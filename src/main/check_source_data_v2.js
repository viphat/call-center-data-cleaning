const _  = require('lodash');
const fs = require('fs');
const Diacritics = require('diacritic');
const moment = require('moment');
const Excel = require('exceljs');
const padStart = require('string.prototype.padstart');

import { db } from '../db/prepare_data';

import { buildTemplate } from '../main/build_excel_template_v2';
import { createCustomer, updateCustomer } from '../db/create_customer';

const dataBeginRow = 2;

// const indexCol = 1;
const lastNameCol = 2;
let firstNameCol = 3; // 2 For OTB-LHTS
const emailCol = 4;
const districtCol = 5;
const provinceCol = 6;
let phoneCol = 7; // 6 For OTB-LHTS

let dayCol = 8; // 3 For OTB-LHTS
let monthCol = 9; // 4 For OTB-LHTS
let yearCol = 10; // 5 For OTB-LHTS

const s1Col = 11;
const s2Col = 12;
let hospitalNameCol = 13; // 10 For OTB-LHTS

let collectedDateCol = 17; // 17 for OTB | 19 for IMC
let collectedDayCol = 7; // For OTB-LHTS
let collectedMonthCol = 8; // For OTB-LHTS
let collectedYearCol = 9; // For OTB-LHTS
let staffCol = 18; // 18 for OTB or 20 for IMC
let noteCol = 19;
let pgCodeCol = 20;
let qrCodeCol = 21;

export const validateSourceData = (excelFile, batch, source, outputDirectory) => {
  return new Promise((resolve, reject) => {
    if ( !_.endsWith(outputDirectory, '/') ) {
      outputDirectory += '/';
    }

    let dir = outputDirectory + batch;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    dir = dir + '/' + source;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    if (source == 'IMC') {
      collectedDateCol = 19;
      staffCol = 20;
      noteCol = 21;
      pgCodeCol = 22;
      qrCodeCol = 23;
    }

    if (source == 'OTB-LHTS') {
      firstNameCol = 2;
      phoneCol = 6; // 6 For OTB-LHTS

      dayCol = 3; // 3 For OTB-LHTS
      monthCol = 4; // 4 For OTB-LHTS
      yearCol = 5; // 5 For OTB-LHTS

      hospitalNameCol = 10; // 10 For OTB-LHTS
    }

    resolve(readFile(excelFile, batch, source, dir));
  });
}

function readFile(excelFile, batch, source, outputDirectory) {
  return new Promise((resolve, reject) => {
    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile(excelFile).then(() => {
      let worksheet = workbook.getWorksheet(1);
      let rowNumber = dataBeginRow;
      let outputPath = outputDirectory + '/' + batch + '_' + source + '_cleaned_data.xlsx';

      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

      buildTemplate(outputPath).then((outputWorkbook) => {
        return readEachRow(excelFile, outputWorkbook, batch, source, worksheet, rowNumber);
      }).then((outputWorkbook) => {
        resolve(outputWorkbook.xlsx.writeFile(outputPath));
      });
    });
  });
}

function readEachRow(excelFile, outputWorkbook, batch, source, worksheet, rowNumber) {
  return new Promise((resolve, reject) => {
    let row = worksheet.getRow(rowNumber);
    console.log('Row: ' + rowNumber);

    if (isEmptyRow(row)) {
      return resolve(outputWorkbook);
    }

    let hospitalName = row.getCell(hospitalNameCol).value;
    hospitalName = hospitalName.trim().replace(/\s+/g, ' ');

    let collectedDate
    let collectedDay;
    let collectedMonth;
    let collectedYear;

    if (source === 'OTB-LHTS') {
      collectedDay = row.getCell(collectedDayCol).value;
      collectedMonth = row.getCell(collectedMonthCol).value;
      collectedYear = row.getCell(collectedYearCol).value;
    } else {
      collectedDate = row.getCell(collectedDateCol).value;
      collectedDate = new Date(collectedDate);

      collectedDay = collectedDate.getDate();
      collectedMonth = collectedDate.getMonth() + 1;
      collectedYear = collectedDate.getFullYear();
    }

    if (collectedYear == 1970) {
      return reject('Lỗi Ngày tháng ở dòng ' + rowNumber);
    }

    let lastName = row.getCell(lastNameCol).value;
    if (source === 'OTB-LHTS') {
      lastName = '';
    }

    let email = row.getCell(emailCol).value;
    if (source === 'OTB-LHTS') {
      email = '';
    }

    let district = row.getCell(districtCol).value;
    if (source === 'OTB-LHTS') {
      district = '';
    }

    let province = row.getCell(provinceCol).value;
    if (source === 'OTB-LHTS') {
      province = '';
    }

    getHospital(hospitalName).then((hospital) => {
      let customer = {
        lastName: lastName,
        firstName: row.getCell(firstNameCol).value,
        email: email,
        district: district,
        province: province,
        phone: row.getCell(phoneCol).value,
        day: row.getCell(dayCol).value,
        month: row.getCell(monthCol).value,
        year: row.getCell(yearCol).value,
        s1: row.getCell(s1Col).value,
        s2: row.getCell(s2Col).value,
        collectedDay: parseInt(collectedDay),
        collectedMonth: parseInt(collectedMonth),
        collectedYear: parseInt(collectedYear),
        staff: row.getCell(staffCol).value,
        note: row.getCell(noteCol).value,
        pgCode: parseInt(row.getCell(pgCodeCol).value),
        qrCode: row.getCell(qrCodeCol).value,
        hospital_id: hospital.hospital_id,
        batch: batch,
        source: source
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
          return resolve(readEachRow(excelFile, outputWorkbook, batch, source, worksheet, rowNumber + 1));
        }

        customer = response;
        let duplicateData = customer.isPhoneDuplicated;
        let missingData = isMissingData(customer, row);
        let illogicalData = isIllogicalData(customer, row);

        let duplicateDataWithAnotherAgency = customer.isPhoneDuplicatedWithAnotherAgency;

        let rowData = [
          customer.customer_id,
          customer.lastName,
          customer.firstName,
          customer.email,
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
          hospital.area_name,
          customer.source,
          customer.collectedDay,
          customer.collectedMonth,
          customer.collectedYear,
          customer.staff,
          customer.note,
          customer.pgCode,
          customer.qrCode
        ];

        let outputSheetName = 'Valid';

        if (duplicateData === true) {
          if (customer.duplicatedWithinPast2Years === 1) {
            outputSheetName = 'Duplication - Within 24 Months';
          } else {
            outputSheetName = 'Duplication - Over 24 Months';
          }
        } else if (missingData || illogicalData) {
          outputSheetName = 'Invalid';
        } else if (duplicateDataWithAnotherAgency === true) {
          outputSheetName = 'Duplication With Another Agency';
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

        if (duplicateData == true || duplicateDataWithAnotherAgency == true) {
          var duplicatedWith

          if (duplicateDataWithAnotherAgency) {
            duplicatedWith = customer.duplicateWithAnotherAgency;
          } else {
            duplicatedWith = customer.duplicatedWith;
          }

          var duplicatedRow = [
            duplicatedWith.customer_id,
            duplicatedWith.last_name,
            duplicatedWith.first_name,
            duplicatedWith.email,
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
            duplicatedWith.source,
            duplicatedWith.collectedDay,
            duplicatedWith.collectedMonth,
            duplicatedWith.collectedYear,
            duplicatedWith.staff,
            duplicatedWith.note,
            duplicatedWith.pgCode,
            duplicatedWith.qrCode,
            duplicatedWith.batch
          ]

          var toHighlight = false;
          if (duplicatedWith.batch == customer.batch && duplicatedWith.source == customer.source) {
            toHighlight = true;
          //   duplicatedWith.hasError = 1;
          //   duplicatedWith.duplicatedPhone = 1;
          //   if (customer.sampling === 'S1' && duplicatedWith.sampling === 'S1') {
          //     duplicatedWith.duplicatedPhoneS1 = 1;
          //   } else if (customer.sampling === 'S2' && duplicatedWith.sampling === 'S2') {
          //     duplicatedWith.duplicatedPhoneS2 = 1;
          //   } else {
          //     duplicatedWith.duplicatedPhoneBetweenS1AndS2 = 1;
          //   }
          //   updateCustomer(duplicatedWith);
          }

          rowData.push(customer.batch);

          writeToFile(outputWorkbook, outputSheetName, duplicatedRow, toHighlight).then((workbook) => {
            writeToFile(outputWorkbook, outputSheetName, rowData, toHighlight).then((workbook) => {
              if (rowNumber % 1000 === 0) {
                setTimeout(function(){
                  resolve(readEachRow(excelFile, workbook, batch, source, worksheet, rowNumber+1));
                }, 0);
              } else {
                resolve(readEachRow(excelFile, workbook, batch, source, worksheet, rowNumber+1));
              }
            });
          });
        } else {
          writeToFile(outputWorkbook, outputSheetName, rowData, false).then((workbook) => {
            if (rowNumber % 1000 === 0) {
                setTimeout(function(){
                  resolve(readEachRow(excelFile, workbook, batch, source, worksheet, rowNumber+1));
                }, 0);
              } else {
                resolve(readEachRow(excelFile, workbook, batch, source, worksheet, rowNumber+1));
              }
          });
        }
      });
    });
  });
}

export const writeToFile = (outputWorkbook, outputSheetName, rowData, toHighlight) => {
  return new Promise((resolve, reject) => {
    let workbook = outputWorkbook;
    let worksheet = workbook.getWorksheet(outputSheetName);
    let row = worksheet.addRow(rowData);

    let highlight = {
      bold: true, size: 10, name: 'Arial', family: 2,
      color: { argb: 'FFFF0000' }
    }

    let normal = {
      size: 10, color: { theme: 1 }, name: 'Arial', family: 2
    }

    if (toHighlight) {
      row.getCell(1).font = highlight;
    } else {
      row.getCell(1).font = normal;
    }

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

    row.getCell(17).font = row.getCell(1).font;
    row.getCell(17).border = row.getCell(1).border;
    row.getCell(17).alignment = row.getCell(1).alignment;

    row.getCell(18).font = row.getCell(1).font;
    row.getCell(18).border = row.getCell(1).border;
    row.getCell(18).alignment = row.getCell(1).alignment;

    row.getCell(19).font = row.getCell(1).font;
    row.getCell(19).border = row.getCell(1).border;
    row.getCell(19).alignment = row.getCell(1).alignment;

    row.getCell(20).font = row.getCell(1).font;
    row.getCell(20).border = row.getCell(1).border;
    row.getCell(20).alignment = row.getCell(1).alignment;

    row.getCell(21).font = row.getCell(1).font;
    row.getCell(21).border = row.getCell(1).border;
    row.getCell(21).alignment = row.getCell(1).alignment;

    row.getCell(22).font = row.getCell(1).font;
    row.getCell(22).border = row.getCell(1).border;
    row.getCell(22).alignment = row.getCell(1).alignment;

    row.getCell(23).font = row.getCell(1).font;
    row.getCell(23).border = row.getCell(1).border;
    row.getCell(23).alignment = row.getCell(1).alignment;

    row.getCell(24).font = row.getCell(1).font;
    row.getCell(24).border = row.getCell(1).border;
    row.getCell(24).alignment = row.getCell(1).alignment;

    if (outputSheetName.startsWith('Duplication')) {
      row.getCell(25).font = row.getCell(1).font;
      row.getCell(25).border = row.getCell(1).border;
      row.getCell(25).alignment = row.getCell(1).alignment;
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
  if (row.getCell(1).value === null      &&
      row.getCell(2).value === null      &&
      row.getCell(3).value === null      &&
      row.getCell(4).value === null      &&
      row.getCell(5).value === null      &&
      row.getCell(6).value === null      &&
      row.getCell(7).value === null      &&
      row.getCell(8).value === null      &&
      row.getCell(9).value === null
    ) {
    // Empty Row
    return true;
  }
  return false
}

function isMissingData(customer, row) {
  if (customer.isPhoneDuplicated === true) {
    return;
  }

  // Kiểm tra thiếu thông tin
  let missingFields = [];

  // if (row.getCell(lastNameCol).value === null) {
  //   missingFields.push('Họ');
  //   customer.missingLastName = 1;
  // }

  if ((row.getCell(firstNameCol).value === null  || row.getCell(firstNameCol).value === '') && (customer.source !== 'OTB-Chatbot')) {
    missingFields.push('Tên');
    customer.missingFirstName = 1;
    customer.missingMomName = 1;
  }

  if ((row.getCell(firstNameCol).value === null  || row.getCell(firstNameCol).value === '') && (row.getCell(lastNameCol).value === null  || row.getCell(lastNameCol).value === '') && (customer.source === 'OTB-Chatbot' && customer.source !== 'OTB-LHTS')) {
    missingFields.push('Tên');
    customer.missingFirstName = 1;
    customer.missingMomName = 1;
  }

  if ((row.getCell(emailCol).value === null || row.getCell(emailCol).value == '') && (customer.source !== 'OTB-Chatbot' && customer.source !== 'OTB-LHTS')) {
    // Tạm thời không làm gì cả
    // Không đưa vào Invalid List
    customer.missingEmail = 1;
  }

  if ((row.getCell(districtCol).value === null || row.getCell(districtCol).value.length == 0) && (customer.source !== 'OTB-Chatbot' && customer.source !== 'OTB-LHTS')) {
    missingFields.push('Quận/Huyện');
    customer.missingDistrict = 1;
    customer.missingAddress = 1;
  }

  if ((row.getCell(provinceCol).value === null || row.getCell(provinceCol). value.length == 0) && (customer.source !== 'OTB-Chatbot' && customer.source !== 'OTB-LHTS')) {
    missingFields.push('Tỉnh/Thành');
    customer.missingProvince = 1;
    customer.missingAddress = customer.missingAddress || 1;
  }

  if (row.getCell(phoneCol).value === null) {
    missingFields.push('Điện Thoại');
    customer.missingPhone = 1;
  }

  if (customer.source !== 'OTB-LHTS' && row.getCell(s1Col).value !== 'S1' && row.getCell(s2Col).value !== 'S2') {
    missingFields.push('Đối tượng đặt mẫu');
    customer.missingSampling = 1;
    customer.missingMomStatus = 1;
  }

  if (row.getCell(dayCol).value === null || row.getCell(monthCol).value === null || row.getCell(yearCol).value === null) {
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
  if (customer.isPhoneDuplicated === true) {
    return;
  }

  let phone = row.getCell(phoneCol).value;
  let lastName = row.getCell(lastNameCol).value;
  let firstName = row.getCell(firstNameCol).value;
  let email = row.getCell(emailCol).value;
  let province = row.getCell(provinceCol).value;
  let day = row.getCell(dayCol).value;
  let month = row.getCell(monthCol).value;
  let year = row.getCell(yearCol).value;

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
      if (phone.length !== 10) {
        customer.illogicalPhone = 1;
        flag = true;
      }
    }
  }

  if ((lastName !== undefined && lastName !== null && firstName) && (customer.source !== 'OTB-Chatbot' && customer.source !== 'OTB-LHTS')) {
    let fullName = '' + firstName + lastName;
    if (!isNaN(parseInt(fullName)) || hasSpecialCharacter(fullName)) {
      // If is a Number
      customer.illogicalName = 1;
      flag = true;
    }
  }

  if (email !== undefined && email !== null && email !== '') {
    email = '' + email;
    email = email.trim();
    if (validateEmail(email) == false) {
      customer.illogicalEmail = 1;
    }
  }

  if ((province !== undefined && province !== null) && (customer.source !== 'OTB-Chatbot' && customer.source !== 'OTB-LHTS')) {
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

  let date = year + '-' + padStart(month, 2, 0) + '-' + padStart(day, 2, 0);
  date = new Date(date);

  if (date !== null && date !== undefined) {
    let day, month, year;
    // let projectStartDate = new Date('2019-01-01');

    day = customer.day;
    month = customer.month;
    year = customer.year;

    if (date.toString() === 'Invalid Date') {
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
      var currentYear = today.getFullYear();

      if (date.getFullYear() < currentYear - 1 || date.getFullYear() > currentYear + 1) {
        customer.illogicalDate = 1;
        flag = true;
      }

      // if (date < projectStartDate) {
      //   customer.illogicalDate = 1;
      //   flag = true;
      // }

      if (sampling == 'S2' && date >= today) {
        // Ngày sinh của em bé không được lớn hơn hoặc bằng ngày import
        customer.illogicalDate = 1;
        flag = true;
      } else {
        if (date > next9Months) {
          customer.illogicalDate = 1;
          flag = true;
        }
      }
    }
  }

  return flag;
}

function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function hasSpecialCharacter(string) {
  var re = /[!@#$%^&*_+=\[\]{};:"\\|<>\/?]/;
  return re.test(string);
}
