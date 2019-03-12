const _  = require('lodash');
const Excel = require('exceljs');
const fs = require('fs');
import { db } from '../db/prepare_data.js';

const hospitalNameCol = 13;
const startRow = 2;

export const checkHospitalNames = (excelFile) => {
  return new Promise((resolve, reject) => {
    let stats = fs.statSync(excelFile);
    if (stats.size / 1000000.0 > 5.0) {
      return reject('File too big');
    }

    workbook.xlsx.readFile(excelFile).then(()=>{
      console.log(excelFile);
      let worksheet = workbook.getWorksheet(1);
      let rowNumber = startRow;

      if (worksheet === undefined) {
        console.log(workbook);
        return reject('Không tìm thấy Worksheet');
      }
    });
  })
};

function readEachRow(worksheet, rowNumber) {
  return new Promise((resolve, reject) => {
    let row = worksheet.getRow(rowNumber);
    let hospitalName = row.getCell(hospitalNameCol).value
    if (hospitalName === null) {
      console.log(hospitalName)
      resolve('Finished');
    }
    resolve(readEachRow(worksheet, rowNumber + 1));
  });
}
