const _  = require('lodash');
const Excel = require('exceljs');
const fs = require('fs');
import { db } from '../db/prepare_data.js';

const hospitalNameCol = 12;
const startRow = 4;
let notFoundHospitalNames = [];

export const writeReportToExcelFile = (outputFolder, notFoundHospitalNames) => {
  let resultFilePath = outputFolder + 'not_found_hospitals.xlsx';
  console.log(resultFilePath);

  return new Promise((resolve, reject) => {
    writeUnfoundList(resultFilePath, notFoundHospitalNames).then((response) => {
      return writeHospitalList(resultFilePath, notFoundHospitalNames);
    }).catch((errRes) => {
      reject(errRes);
    });
  });
}

export const checkHospitalNames = (excelFile) => {
  notFoundHospitalNames = [];
  return new Promise((resolve, reject) => {
    let stats = fs.statSync(excelFile);
    if (stats.size / 1000000.0 > 10.0) {
      // ~ 10 MB
      return reject('File Excel quá lớn không thể xử lý.');
    }
    console.log('Checking ' + excelFile);
    let workbook = new Excel.Workbook();

    workbook.xlsx.readFile(excelFile).then(()=>{
      console.log(excelFile);
      let worksheet = workbook.getWorksheet(1);
      let rowNumber = startRow;

      if (worksheet === undefined) {
        console.log(workbook);
        return reject('Không tìm thấy Worksheet');
      }

      readEachRow(worksheet, rowNumber).then((res) => {
        console.log(notFoundHospitalNames);
        resolve(notFoundHospitalNames);
      });
    });
  })
};

function readEachRow(worksheet, rowNumber) {
  return new Promise((resolve, reject) => {
    let row = worksheet.getRow(rowNumber);

    let hospitalName = row.getCell(hospitalNameCol).value;

    if (hospitalName === null) {
      resolve('End of File reached.');
      return;
    }

    hospitalName = hospitalName.trim().replace(/\s+/g, ' ');

    checkWithMatches(hospitalName).then((res) => {
      if (rowNumber % 1000 === 0) {
        setTimeout(function(){
          resolve(readEachRow(worksheet, rowNumber + 1));
        }, 0);
      } else {
        resolve(readEachRow(worksheet, rowNumber + 1));
      }
    })
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

function checkWithMatches(hospitalName) {
  return new Promise((resolve, reject) => {
    db.get("SELECT hospitals.hospital_id FROM hospitals LEFT JOIN matches ON hospitals.hospital_id = matches.hospital_id where hospitals.name = ? OR matches.name = ?", hospitalName, hospitalName, (err, res) => {
      if (err) {
        console.log('Fetch DB Error: ' + err);
        return reject(false);
      }

      if (res === undefined || res === null) {
        if (_.includes(notFoundHospitalNames, hospitalName) === false) {
          notFoundHospitalNames.push(hospitalName);
        }
      }
      resolve(true);
    });
  });
}

function writeUnfoundList(resultFilePath, notFoundHospitalNames) {
  return new Promise((resolve, reject) => {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Not Found List', {});
    worksheet.getColumn('A').width = 20.0;
    worksheet.getColumn('B').width = 9.0;
    worksheet.addRow(['Tên Bệnh Viện', 'ID tương ứng']);
    if (notFoundHospitalNames.length == 0) {
      return resolve(workbook.xlsx.writeFile(resultFilePath));
    }
    _.each(notFoundHospitalNames, (item) => {
      worksheet.addRow([item]);
    });
    resolve(workbook.xlsx.writeFile(resultFilePath));
  });
}

function writeHospitalList(resultFilePath, notFoundHospitalNames) {
  return new Promise((resolve, reject) => {
    if (notFoundHospitalNames.length == 0) {
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
