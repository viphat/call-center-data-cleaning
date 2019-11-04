const _  = require('lodash');
const fs = require('fs');
const Diacritics = require('diacritic');
const moment = require('moment');
const Excel = require('exceljs');
const padStart = require('string.prototype.padstart');

import { db } from '../db/prepare_data';

import { buildTemplate } from '../main/build_excel_template';
import { createCustomer, updateCustomer } from '../db/create_customer';

const dataBeginRow = 4;
const indexCol = 1;
const lastNameCol = 2;
const firstNameCol = 3;
const districtCol = 4;
const provinceCol = 5;
const phoneCol = 6;

const dateCol = 7;
const s1Col = 8;
const s2Col = 9;
const hospitalNameCol = 10;

export const validateSourceData = (excelFile, batch, outputDirectory) => {
  return new Promise((resolve, reject) => {
    if ( !_.endsWith(outputDirectory, '/') ) {
      outputDirectory += '/';
    }

    let dir = outputDirectory + batch;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    dir = dir + '/';

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    resolve(readFile(excelFile, batch, dir));
  });
}

function readFile(excelFile, batch, outputDirectory) {
  return new Promise((resolve, reject) => {
    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile(excelFile).then(() => {
      let worksheet = workbook.getWorksheet(1);
      let rowNumber = dataBeginRow;
      let outputPath = outputDirectory + '/' + batch + '_cleaned_data.xlsx';

      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

      buildTemplate(outputPath).then((outputWorkbook) => {
        return readEachRow(excelFile, outputWorkbook, batch, worksheet, rowNumber);
      }).then((outputWorkbook) => {
        resolve(outputWorkbook.xlsx.writeFile(outputPath));
      });
    });
  });
}

function readEachRow(excelFile, outputWorkbook, batch, worksheet, rowNumber) {
  return new Promise((resolve, reject) => {
    let row = worksheet.getRow(rowNumber);
    console.log('Row: ' + rowNumber);

    if (isEmptyRow(row)) {
      return resolve(outputWorkbook);
    }

    let hospitalName = row.getCell(hospitalNameCol).value;
    hospitalName = hospitalName.trim().replace(/\s+/g, ' ');

    let date = row.getCell(dateCol).value;
    console.log(date);
    date = new Date(date);
    console.log(date);

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    getHospital(hospitalName).then((hospital) => {
      let customer = {
        lastName: row.getCell(lastNameCol).value,
        firstName: row.getCell(firstNameCol).value,
        district: row.getCell(districtCol).value,
        province: row.getCell(provinceCol).value,
        phone: row.getCell(phoneCol).value,
        day: day,
        month: month,
        year: year,
        s1: row.getCell(s1Col).value,
        s2: row.getCell(s2Col).value,
        hospital_id: hospital.hospital_id,
        batch: batch
      }

      if (row.getCell(s1Col).value === 'S1') {
        customer.sampling = 'S1';
      }

      if (row.getCell(s2Col).value === 'S2') {
        customer.sampling = 'S2';
      }

      // Insert Data to Database
      createCustomer(customer).then((response) => {
        if (response.alreadyImported === true) {
          return resolve(readEachRow(excelFile, outputWorkbook, batch, worksheet, rowNumber + 1));
        }

        customer = response;
        let missingData = isMissingData(customer, row);
        let illogicalData = isIllogicalData(customer, row);
        let duplicateData = customer.isPhoneDuplicated;

        let rowData = [
          customer.customer_id,
          customer.lastName,
          customer.firstName,
          customer.district,
          customer.province,
          row.getCell(phoneCol).value,
          customer.day,
          customer.month,
          customer.year,
          customer.s1,
          customer.s2,
          hospital.hospital_name,
          hospital.province_name,
          hospital.area_channel,
          hospital.area_name
        ];

        let outputSheetName = 'Valid';
        if (missingData || illogicalData) {
          outputSheetName = 'Invalid';
        } else if (duplicateData === true) {
          outputSheetName = 'Duplication';
        }

        if (duplicateData == true || missingData == true || illogicalData == true) {
          // Update Database
          customer.hasError = 1;
          if (missingData) {
            customer.missingData = 1;
          }
          if (illogicalData) {
            customer.illogicalData = 1;
          }
        }

        updateCustomer(customer);

        if (duplicateData == true) {
          var duplicatedWith
          duplicatedWith = customer.duplicatedWith;

          var duplicatedRow = [
            duplicatedWith.customer_id,
            duplicatedWith.last_name,
            duplicatedWith.first_name,
            duplicatedWith.district,
            duplicatedWith.province,
            duplicatedWith.phone,
            duplicatedWith.day,
            duplicatedWith.month,
            duplicatedWith.year,
            duplicatedWith.s1,
            duplicatedWith.s2,
            duplicatedWith.hospital_name,
            duplicatedWith.province_name,
            duplicatedWith.area_channel,
            duplicatedWith.area_name,
            duplicatedWith.batch
          ]

          if (duplicatedWith.batch == customer.batch) {
            duplicatedWith.hasError = 1;
            duplicatedWith.duplicatedPhone = 1;
            if (customer.sampling === 'S1' && duplicatedWith.sampling === 'S1') {
              duplicatedWith.duplicatedPhoneS1 = 1;
            } else if (customer.sampling === 'S2' && duplicatedWith.sampling === 'S2') {
              duplicatedWith.duplicatedPhoneS2 = 1;
            } else {
              duplicatedWith.duplicatedPhoneBetweenS1AndS2 = 1;
            }
            updateCustomer(duplicatedWith);
          }

          rowData.push(customer.batch);

          writeToFile(outputWorkbook, outputSheetName, duplicatedRow).then((workbook) => {
            writeToFile(outputWorkbook, outputSheetName, rowData).then((workbook) => {
              if (rowNumber % 1000 === 0) {
                setTimeout(function(){
                  resolve(readEachRow(excelFile, workbook, batch, worksheet, rowNumber+1));
                }, 0);
              } else {
                resolve(readEachRow(excelFile, workbook, batch, worksheet, rowNumber+1));
              }
            });
          });
        } else {
          writeToFile(outputWorkbook, outputSheetName, rowData).then((workbook) => {
            if (rowNumber % 1000 === 0) {
                setTimeout(function(){
                  resolve(readEachRow(excelFile, workbook, batch, worksheet, rowNumber+1));
                }, 0);
              } else {
                resolve(readEachRow(excelFile, workbook, batch, worksheet, rowNumber+1));
              }
          });
        }
      });
    });
  });
}

export const writeToFile = (outputWorkbook, outputSheetName, rowData) => {
  return new Promise((resolve, reject) => {
    let workbook = outputWorkbook;
    let worksheet = workbook.getWorksheet(outputSheetName);
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

    if (outputSheetName.endsWith('Duplication')) {
      row.getCell(16).font = row.getCell(1).font;
      row.getCell(16).border = row.getCell(1).border;
      row.getCell(16).alignment = row.getCell(1).alignment;
    }

    resolve(workbook);
  });
}

function getHospital(hospitalName) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT hospitals.hospital_id, hospitals.name AS hospital_name, provinces.name AS province_name, areas.area_id AS area_id, areas.name As area_name, areas.channel as area_channel FROM hospitals LEFT JOIN matches ON hospitals.hospital_id = matches.hospital_id JOIN provinces ON hospitals.province_id = provinces.province_id JOIN areas ON provinces.area_id = areas.area_id WHERE hospitals.name = ? OR matches.name = ?;';
    db.get(query, hospitalName, hospitalName, (err, row) => {
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
      row.getCell(dateCol).value === null           &&
      row.getCell(s1Col).value === null         &&
      row.getCell(s2Col).value === null          &&
      row.getCell(hospitalNameCol).value === null
    ) {
    // Empty Row
    return true;
  }
  return false
}

function isMissingData(customer, row) {
  // Kiểm tra thiếu thông tin
  let missingFields = [];

  if (row.getCell(lastNameCol).value === null) {
    missingFields.push('Họ');
    customer.missingLastName = 1;
  }

  if ((row.getCell(firstNameCol).value === null  || row.getCell(firstNameCol).value === '')) {
    missingFields.push('Tên');
    customer.missingFirstName = 1;
    customer.missingMomName = 1;
  }

  if ((row.getCell(firstNameCol).value === null  || row.getCell(firstNameCol).value === '') && (row.getCell(lastNameCol).value === null  || row.getCell(lastNameCol).value === '')) {
    missingFields.push('Tên');
    customer.missingFirstName = 1;
    customer.missingMomName = 1;
  }

  if ((row.getCell(districtCol).value === null || row.getCell(districtCol).value.length == 0)) {
    missingFields.push('Quận/Huyện');
    customer.missingDistrict = 1;
    customer.missingAddress = 1;
  }

  if ((row.getCell(provinceCol).value === null || row.getCell(provinceCol). value.length == 0)) {
    missingFields.push('Tỉnh/Thành');
    customer.missingProvince = 1;
    customer.missingAddress = customer.missingAddress || 1;
  }

  if (row.getCell(phoneCol).value === null) {
    missingFields.push('Điện Thoại');
    customer.missingPhone = 1;
  }

  if (row.getCell(s1Col).value !== 'S1' && row.getCell(s2Col).value !== 'S2') {
    missingFields.push('Đối tượng đặt mẫu');
    customer.missingSampling = 1;
    customer.missingMomStatus = 1;
  }

  if (row.getCell(dateCol).value === null) {
    customer.missingDate = 1;
    customer.missingMomStatus = 1;
    missingFields.push('Ngày dự sinh/Ngày sinh');
  }

  if (missingFields.length > 0) {
    return true;
  }

  return false;
}

function isIllogicalData(customer, row) {
  let phone = row.getCell(phoneCol).value;
  let lastName = row.getCell(lastNameCol).value;
  let firstName = row.getCell(firstNameCol).value;
  let district = row.getCell(districtCol).value;
  let province = row.getCell(provinceCol).value;

  let sampling = '';
  let flag = false;

  if (row.getCell(s1Col).value === 'S1') {
    sampling = 'S1';
  }

  if (row.getCell(s2Col).value === 'S2') {
    sampling = 'S2';
  }

  if (row.getCell(s1Col).value === 'S1' && row.getCell(s2Col).value === 'S2') {
    customer.illogicalSampling = 1;
    flag = true;
  }

  if (phone !== undefined && phone !== null) {
    phone = '' + phone.replace(/[\.\-\_\s\+\(\)]/g,'');
    if (isNaN(parseInt(phone))) {
      customer.illogicalPhone = 1;
      flag = true;
    } else {
      if (phone.length < 8 || phone.length > 12) {
        customer.illogicalPhone = 1;
        flag = true;
      }
    }
  }

  if ((lastName !== undefined && lastName !== null && firstName)) {
    let fullName = '' + firstName + lastName;
    if (!isNaN(parseInt(fullName)) || hasSpecialCharacter(fullName)) {
      // If is a Number
      customer.illogicalName = 1;
      flag = true;
    }
  }

  if ((province !== undefined && province !== null)) {
    province = '' + province;
    province = province.trim().replace(/\s+/g, ' ');
    if (!isNaN(province) || (province.length > 0 &&  hasSpecialCharacter(province))) {
      customer.illogicalAddress = 1;
      flag = true;
    }
  }

  if (customer.illogicalName == 1 || customer.illogicalAddress == 1 || customer.illogicalSampling == 1) {
    customer.illogicalOther = 1;
    flag = true;
  }

  // let date = year + '-' + padStart(month, 2, 0) + '-' + padStart(day, 2, 0);
  let date = row.getCell(dateCol).value;
  date = new Date(date);

  if (date !== null && date !== undefined) {
    let day, month, year;
    let projectStartDate = new Date('2019-10-01');

    day = customer.day;
    month = customer.month;
    year = customer.year;

    if (date == 'Invalid Date') {
      customer.illogicalDate = 1;
      flag = true;
    } else {
      if (parseInt(month) == 2 && parseInt(day) > 29) {
        customer.illogicalDate = 1;
        flag = true;
      }

      if ((parseInt(month) == 4 || parseInt(month) == 6 || parseInt(month) == 9 || parseInt(month) == 11) && parseInt(day) > 30) {
        customer.illogicalDate = 1;
        flag = true;
      }

      var today = new Date();
      var next9Months = today.setMonth(today.getMonth() + 9);
      next9Months = new Date(next9Months);

      today = new Date();
      var previousMonth = today.setMonth(today.getMonth() - 1);
      previousMonth = new Date(previousMonth);

      var currentYear = today.getFullYear();

      if (date.getFullYear() < currentYear - 1 || date.getFullYear() > currentYear + 1) {
        customer.illogicalDate = 1;
        flag = true;
      }

      if (date < projectStartDate) {
        customer.illogicalDate = 1;
        flag = true;
      }

      today = new Date();
      if (sampling == 'S2' && date >= today) {
        // Ngày sinh của em bé không được lớn hơn hoặc bằng ngày import
        customer.illogicalDate = 1;
        flag = true;
      } else {
        if (date > next9Months) {
          customer.illogicalDate = 1;
          flag = true;
        }

        if (sampling == 'S1' && date <= previousMonth) {
          customer.illogicalDate = 1;
          flag = true;
        }
      }
    }
  }

  return flag;
}

function hasSpecialCharacter(string) {
  var re = /[!@#$%^&*_+=\[\]{};:"\\|<>\/?]/;
  return re.test(string);
}
