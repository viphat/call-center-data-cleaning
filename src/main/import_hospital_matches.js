import { db } from '../db/prepare_data.js';
const _  = require('lodash');
const Excel = require('exceljs');


export const importMatchesFromFile = (excelFile) => {
  return new Promise((resolve, reject) => {
    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile(excelFile).then(()=>{
      let worksheet = workbook.getWorksheet(1);
      let rowIndex = 1;
      let row = worksheet.getRow(rowIndex);
      if (row.getCell(1).value !== 'Hospital Name' && row.getCell(2).value !== 'Equivalent ID') {
        return reject(false);
      }
      rowIndex += 1;
      row = worksheet.getRow(rowIndex);
      while (row.getCell(1).value !== undefined && row.getCell(1).value !== null) {
        let hospitalName = row.getCell(1).value;
        let hospitalId = row.getCell(2).value;
        if (hospitalId !== undefined && hospitalId !== null) {
          hospitalName = hospitalName.trim().replace(/\s+/g, ' ');
          writeToDb(hospitalName, hospitalId);
        }
        rowIndex += 1;
        row = worksheet.getRow(rowIndex);
      }
      resolve(true);
    });
  });

  function writeToDb(hospitalName, id) {
    db.get("SELECT hospital_id, name from matches where name LIKE ?", hospitalName, (err, res) => {
      if (res === undefined || res === null) {
        id = parseInt(id);
        if (!isNaN(id)) {
          db.run('INSERT INTO matches(hospital_id, name) VALUES(?,?);', id, hospitalName);
        }
      }
    });
  }

}
