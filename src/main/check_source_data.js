const _  = require('lodash');
const fs = require('fs');
const Diacritics = require('diacritic');

const Excel = require('exceljs');
import { db } from '../db/prepare_data';

import { buildTemplate } from '../main/build_excel_template';

const dataBeginRow = 6;
const hospitalName = [2, 6];
const provinceName = [3, 6];

const indexCol = 1;
const lastNameCol = 2;
const firstNameCol = 3;
const emailCol = 4;
const districtCol = 5;
const provinceCol = 6;
const phoneCol = 7;
const babyName = 8;
const babyGender = 9;
const dayCol = 10;
const monthCol = 11;
const yearCol = 12;
const s1Col = 13;
const s2Col = 14;

const hospitalNameCell = 'I2';
const redundantString = 'Tên BV/PK:';

export const validateSourceData = (excelFiles, outputDirectory) => {
  return new Promise((resolve, reject) => {
    let fileIndex = 0;
    resolve(readEachFile(excelFiles, outputDirectory, fileIndex));
  });
}

function readEachFile(excelFiles, outputDirectory, fileIndex) {
  return new Promise((resolve, reject) => {
    let excelFile = excelFiles[fileIndex];
    if (excelFile === undefined || excelFile === null) {
      return resolve(null);
    }
    let workbook = new Excel.Workbook();
    console.log('Read: ' + excelFile);
    workbook.xlsx.readFile(excelFile).then(() => {
      let worksheet = workbook.getWorksheet(1);
      // Read Tên Bệnh Viện
      let hospitalName = _.replace(worksheet.getCell(hospitalNameCell).value, redundantString, '');
      hospitalName = hospitalName.trim().replace(/\s+/g, ' ');
      getHospital(hospitalName).then((hospital) => {
        let province_name = hospital.province_name;
        let rowNumber = dataBeginRow;
        return readEachRow(outputDirectory, worksheet, hospital, province_name, rowNumber);
      }).then( (res) => {
        resolve(readEachFile(excelFiles, outputDirectory, fileIndex + 1));
      });
    });
  });
}

function readEachRow(outputDirectory, worksheet, hospital, province_name, rowNumber) {
  return new Promise((resolve, reject) => {
    let row = worksheet.getRow(rowNumber);
    console.log('Row: ' + rowNumber);
    if (isEmptyRow(row)) {
      return resolve(null);
    }
    let missingData = isMissingData(worksheet, row, rowNumber);
    let rowData = [
      row.getCell(indexCol).value,
      row.getCell(lastNameCol).value,
      row.getCell(firstNameCol).value,
      row.getCell(emailCol).value,
      row.getCell(districtCol).value,
      row.getCell(provinceCol).value,
      row.getCell(phoneCol).value,
      row.getCell(babyName).value,
      row.getCell(babyGender).value,
      row.getCell(dayCol).value,
      row.getCell(monthCol).value,
      row.getCell(yearCol).value,
      row.getCell(s1Col).value,
      row.getCell(s2Col).value,
      hospital.hospital_name,
      hospital.area_channel
    ];
    let listType = 'Valid';
    if (missingData) {
      listType = 'Invalid';
    }
    writeToFile(outputDirectory, province_name, listType, rowData).then((res) => {
      resolve(readEachRow(outputDirectory, worksheet, hospital, province_name, rowNumber+1));
    });
  });
}

function writeToFile(outputDirectory, province_name, listType, rowData) {
  return new Promise((resolve, reject) => {
    if ( !_.endsWith(outputDirectory, '/') ) {
      outputDirectory += '/';
    }
    let outputPath = outputDirectory + Diacritics.clean(province_name).split(' ').join('_') + '.xlsx';
    let sheetName = province_name + ' - ' + listType;
    buildTemplate(outputPath, province_name, sheetName, true).then((response) => {
      let workbook = new Excel.Workbook();
      workbook.xlsx.readFile(outputPath).then(()=>{
        let worksheet = workbook.getWorksheet(sheetName);
        let row = worksheet.addRow(rowData);

        row.getCell(1).font = {
          size: 10, color: { theme: 1 }, name: 'Arial', family: 2
        };
        row.getCell(1).border = worksheet.getCell('A5').border;
        row.getCell(1).alignment = worksheet.getCell('A5').alignment;

        row.getCell(2).font = row.getCell(1).font;
        row.getCell(2).border = row.getCell(1).border;
        row.getCell(2).alignment = row.getCell(1).alignment;

        row.getCell(3).font = row.getCell(1).font;
        row.getCell(3).border = row.getCell(1).border;
        row.getCell(3).alignment = row.getCell(1).alignment;

        row.getCell(4).font = row.getCell(1).font;
        row.getCell(4).border = row.getCell(1).border;
        row.getCell(4).alignment = row.getCell(1).alignment;

        row.getCell(5).font = row.getCell(1).font;
        row.getCell(5).border = row.getCell(1).border;
        row.getCell(5).alignment = row.getCell(1).alignment;

        row.getCell(6).font = row.getCell(1).font;
        row.getCell(6).border = row.getCell(1).border;
        row.getCell(6).alignment = row.getCell(1).alignment;

        row.getCell(7).font = row.getCell(1).font;
        row.getCell(7).border = row.getCell(1).border;
        row.getCell(7).alignment = row.getCell(1).alignment;

        row.getCell(8).font = row.getCell(1).font;
        row.getCell(8).border = row.getCell(1).border;
        row.getCell(8).alignment = row.getCell(1).alignment;

        row.getCell(9).font = row.getCell(1).font;
        row.getCell(9).border = row.getCell(1).border;
        row.getCell(9).alignment = row.getCell(1).alignment;

        row.getCell(10).font = row.getCell(1).font;
        row.getCell(10).border = row.getCell(1).border;
        row.getCell(10).alignment = row.getCell(1).alignment;

        row.getCell(11).font = row.getCell(1).font;
        row.getCell(11).border = row.getCell(1).border;
        row.getCell(11).alignment = row.getCell(1).alignment;

        row.getCell(12).font = row.getCell(1).font;
        row.getCell(12).border = row.getCell(1).border;
        row.getCell(12).alignment = row.getCell(1).alignment;

        row.getCell(13).font = row.getCell(1).font;
        row.getCell(13).border = row.getCell(1).border;
        row.getCell(13).alignment = row.getCell(1).alignment;

        row.getCell(14).font = row.getCell(1).font;
        row.getCell(14).border = row.getCell(1).border;
        row.getCell(14).alignment = row.getCell(1).alignment;

        row.getCell(15).font = row.getCell(1).font;
        row.getCell(15).border = row.getCell(1).border;
        row.getCell(15).alignment = row.getCell(1).alignment;

        row.getCell(16).font = row.getCell(1).font;
        row.getCell(16).border = row.getCell(1).border;
        row.getCell(16).alignment = row.getCell(1).alignment;
        // TODO: Cải Tiến chỗ này - Lưu 1 lần khi finish một file thôi >_<.
        // Hiện tốc độ đọc/ghi đang khá chậm
        resolve(workbook.xlsx.writeFile(outputPath));
      });
    });
  });
}

function getHospital(hospitalName) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT hospitals.hospital_id, hospitals.name AS hospital_name, provinces.name AS province_name, areas.area_id AS area_id, areas.name As area_name, areas.channel as area_channel FROM hospitals JOIN matches ON hospitals.hospital_id = matches.hospital_id JOIN provinces ON hospitals.province_id = provinces.province_id JOIN areas ON provinces.area_id = areas.area_id WHERE hospitals.name LIKE ? OR matches.name LIKE ?;';
    // let query = 'SELECT * from hospitals WHERE hospitals.name LIKE ?'
    db.get(query, "%" + hospitalName + "%", "%" + hospitalName + "%", (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (row === undefined || row === null) {
          return reject(row);
        }
        resolve(row);
      }
    });
  });
}

function isEmptyRow(row) {
  if (row.getCell(firstNameCol).value === null     &&
      row.getCell(lastNameCol).value === null      &&
      row.getCell(districtCol).value === null      &&
      row.getCell(provinceCol).value === null      &&
      row.getCell(phoneCol).value === null         &&
      row.getCell(dayCol).value === null           &&
      row.getCell(monthCol).value === null         &&
      row.getCell(yearCol).value === null
    ) {
    // Empty Row
    return true;
  }
  return false
}

function isMissingData(worksheet, row, rowNumber) {
  // Kiểm tra thiếu thông tin
  let missingFields = [];

  if (row.getCell(lastNameCol).value === null) {
    missingFields.push('Họ');
  }

  if (row.getCell(firstNameCol).value === null) {
    missingFields.push('Tên');
  }

  if (row.getCell(emailCol).value === null) {
    // Tạm thời không làm gì cả
    // Không đưa vào Invalid List
  }

  if (row.getCell(districtCol).value === null) {
    missingFields.push('Quận/Huyện');
  }

  if (row.getCell(provinceCol).value === null) {
    missingFields.push('Tỉnh/Thành');
  }

  if (row.getCell(phoneCol).value === null) {
    missingFields.push('Điện Thoại');
  }

  if (row.getCell(s1Col).value === null && row.getCell(s2Col).value === null) {
    missingFields.push('Đối tượng đặt mẫu');
  }

  if (row.getCell(s2Col).value == 'S2' && row.getCell(babyName).value === null) {
    missingFields.push('Tên bé');
  }

  if (row.getCell(s2Col).value == 'S2' && row.getCell(babyGender).value === null) {
    missingFields.push('Giới tính của bé');
  }

  if (row.getCell(dayCol).value === null ||
      row.getCell(monthCol).value === null ||
      row.getCell(yearCol).value === null
    ) {
    missingFields.push('Ngày dự sinh/Ngày sinh');
  }

  if (missingFields.length > 0) {
    return true;
  }

  return false;
}

// Kết quả đã lọc bớt các record thiếu thông tin.
// Thống kê lỗi cho từng đợt import (Thiếu thông tin, thông tin không logic)
// Tỉ lệ Duplicate của số điện thoại (So với toàn bộ Database)
//
// Thông tin bắt buộc phải có:
// - Tên khách hàng, Quận, Huyện, ngày dự sinh (hoặc ngày sinh), số điện thoại
//
// Một số logic cần kiểm tra:

// - Số điện thoại phải có 10~11 số, kể cả số điện thoại bàn cũng có 10~11 số, bao gồm mã vùng
// - Nếu số điện thoại là kiểu số thì chuyển về kiểu chuỗi.
// - Nếu số điện thoại không bắt đầu bằng số 0 thì chèn thêm số 0 vào trước.
// - Logic của ngày sinh, năm sinh?

// - ~~Check luôn Quận Huyện với Tỉnh Thành (Nếu có Database)~~
// -> Khó check lắm, vì nhiều khi nhập sai chính tả đồ, không dấu đồ, viết tắt đồ

//

