const _  = require('lodash');
const Excel = require('exceljs');
const fs = require('fs');
import { db } from '../db/prepare_data.js';

const hospitalCell = 'I2';
const redundantStrings = ['Tên BV/PK:', 'Tên BV/PK :'];
const workbook = new Excel.Workbook();
let fileTooBig = [];
let hasErorInHospitalName = [];
let notFoundHospitalName = [];
let fileIndex = 0;

export const writeReportToExcelFile = (extractFolder, checkResult) => {
  let resultFilePath = extractFolder + 'invalidCheckingResult.xlsx';
  hasErorInHospitalName = [];
  notFoundHospitalName = [];
  fileTooBig = [];
  return new Promise((resolve, reject) => {
    writeUnfoundList(resultFilePath, checkResult).then((response) => {
      return writeHospitalList(resultFilePath, checkResult);
    }).catch((errRes) => {
      reject(errRes);
    }).then(() => {
      return writeOtherErrors(resultFilePath, checkResult);
    }).catch((errRes) => {
      reject(errRes);
    }).then(() => {
      resolve(resultFilePath);
    });
  });
}

function writeOtherErrors(resultFilePath, checkResult) {
  return new Promise((resolve, reject) => {
    if (checkResult.hasErorInHospitalName.length == 0 && checkResult.fileTooBig.length == 0) {
      return resolve(false);
    }
    let workbook = new Excel.Workbook();

    workbook.xlsx.readFile(resultFilePath).then(() => {
      let worksheet = workbook.addWorksheet('Other Errors', {});
      if (checkResult.fileTooBig.length > 0) {
        worksheet.addRow(['File Size is too big']);
        _.each(checkResult.fileTooBig, (item) => {
          worksheet.addRow([item]);
        });
      }
      if (checkResult.hasErorInHospitalName.length > 0) {
        worksheet.addRow(['Has Error In Hospital Name']);
        _.each(checkResult.hasErorInHospitalName, (item) => {
          worksheet.addRow([item]);
        });
      }
      resolve(workbook.xlsx.writeFile(resultFilePath));
    });
  });
}

function writeUnfoundList(resultFilePath, checkResult) {
  return new Promise((resolve, reject) => {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Unfound List', {});
    worksheet.getColumn('A').width = 20.0;
    worksheet.getColumn('B').width = 9.0;
    worksheet.addRow(['Hospital Name', 'Equivalent ID']);
    if (checkResult.notFoundHospitalName.length == 0) {
      return resolve(workbook.xlsx.writeFile(resultFilePath));
    }
    _.each(checkResult.notFoundHospitalName, (item) => {
      worksheet.addRow([item]);
    });
    resolve(workbook.xlsx.writeFile(resultFilePath));
  });
}

function writeHospitalList(resultFilePath, checkResult) {
  return new Promise((resolve, reject) => {
    if (checkResult.notFoundHospitalName.length == 0) {
      return resolve(false);
    }
    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile(resultFilePath).then(() =>{
      let worksheet = workbook.addWorksheet('Hospital List', {});
      worksheet.getColumn('A').width = 20.0;
      worksheet.getColumn('B').width = 9.0;
      worksheet.addRow(['Hospital Name', 'ID']);
      fetchDbAsync(worksheet).then((response) =>{
        resolve(workbook.xlsx.writeFile(resultFilePath));
      });
    });
  });
}

function fetchDbAsync(worksheet) {
  return new Promise((resolve, reject) => {
    db.all('SELECT hospital_id, name FROM hospitals order by hospital_id;', (err, rows) => {
      if (err) {
        // Do nothing
        console.log(err);
      } else {
        _.each(rows, (row) =>{
          worksheet.addRow([row.name, row.hospital_id]);
        })
        resolve(true);
      }
    });
  })
}

export const checkHospitalNames = (excelFiles) => {
  return new Promise((resolve, reject) => {
    readFiles(excelFiles).then((response) => {
      resolve({
        fileTooBig: fileTooBig,
        hasErorInHospitalName: hasErorInHospitalName,
        notFoundHospitalName: notFoundHospitalName
      });
    }).catch( (errRes) =>{
      reject(errRes);
    });
  })
};

function readFiles(excelFiles) {
  return new Promise((resolve, reject) => {
    resolve(readNextExcelFile(excelFiles, fileIndex));
  });
}

function readNextExcelFile(excelFiles, fileIndex) {
  return new Promise((resolve, reject) => {
    let excelFile = excelFiles[fileIndex];
    console.log(excelFile);
    let stats = fs.statSync(excelFile);
    if (stats.size / 1000000.0 > 1.0) {
      fileTooBig.push(excelFile);
      return resolve(readNextExcelFile(excelFiles, fileIndex + 1));
    } else {
      workbook.xlsx.readFile(excelFile).then(()=>{
        let worksheet = workbook.getWorksheet(1);
        let hospitalName = worksheet.getCell(hospitalCell).value;
        _.each(redundantStrings, (redundantString) => {
          hospitalName = _.replace(hospitalName, redundantString, '');
        })
        hospitalName = hospitalName.trim().replace(/\s+/g, ' ');
        checkHospitalNameError(excelFile, hospitalName).then((res) => {
          if (res == true) {
            if (fileIndex == excelFiles.length) {
              return resolve(null);
            }
            return resolve(readNextExcelFile(excelFiles, fileIndex+1));
          } else {
            checkWithMatches(hospitalName).then( (response) => {
              if (fileIndex == excelFiles.length - 1) {
                return resolve(null);
              }
              return resolve(readNextExcelFile(excelFiles, fileIndex + 1));
            });
          }
        });
      }).catch((errRes) => {
        reject(errRes);
      });
    }
  });
}

function checkHospitalNameError(excelFile, hospitalName) {
  return new Promise((resolve, reject) => {
    if (hospitalName.length < 3) {
      hasErorInHospitalName.push(excelFile);
      resolve(true);
    } else {
      resolve(false);
    }
  })
}

function checkWithMatches(hospitalName) {
  return new Promise((resolve, reject) => {
    db.get("SELECT hospital_id, name from matches where name LIKE ?", "%" + hospitalName + "%", (err, res) => {
      if (err) {
        console.log(err);
        return reject(false);
      }
      if (res === undefined || res === null) {
        if (_.includes(notFoundHospitalName, hospitalName) === false) {
          notFoundHospitalName.push(hospitalName);
        }
      }
      resolve(true);
    });
  });
}
