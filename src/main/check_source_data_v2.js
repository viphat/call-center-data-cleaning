const _  = require('lodash');
const fs = require('fs');
const Diacritics = require('diacritic');
const moment = require('moment');
const Excel = require('exceljs');
const padStart = require('string.prototype.padstart');

import { db } from '../db/prepare_data';

import { buildTemplate } from '../main/build_excel_template';
import { createCustomer, updateCustomer } from '../db/create_customer';

const dataBeginRow = 2;

const firstNameCol = 2;
const lastNameCol = 3;
const districtCol = 4;
const provinceCol = 5;
const phoneCol = 6;

const dayCol = 7;
const monthCol = 8;
const yearCol = 9;

const hospitalNameCol = 10;
const hospitalProvinceCol = 11;
const hospitalAreaCol = 12;
const campaignNameCol = 13;
const babyWeightCol = 14;
const babySizeCol = 15;
const brandCol = 16;
const giftSizeCol = 17;
const collectedDateCol = 18;
const weekCol = 19;

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

    let day = row.getCell(dayCol).value;
    let month = row.getCell(monthCol).value;
    let year = row.getCell(yearCol).value;

    let collectedDate = row.getCell(collectedDateCol).value;
    let collectedDay, collectedMonth, collectedYear;

    if (collectedDate instanceof Date) {
      collectedDay = collectedDate.getDate();
      collectedMonth = collectedDate.getMonth() + 1;
      collectedYear = collectedDate.getFullYear();
      collectedDate = collectedDay + '/' + collectedMonth + '/' + collectedYear
    }

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
        campaignName: row.getCell(campaignNameCol).value,
        babyWeight: row.getCell(babyWeightCol).value,
        babySize: row.getCell(babySizeCol).value,
        brand: row.getCell(brandCol).value,
        giftSize: row.getCell(giftSizeCol).value,
        week: row.getCell(weekCol).value,
        collectedDate: collectedDate,
        collectedDay: collectedDay,
        collectedMonth: collectedMonth,
        collectedYear: collectedYear,
        hospital_id: hospital.hospital_id,
        batch: batch
      }

      // Insert Data to Database
      createCustomer(customer).then((response) => {
        if (response.alreadyImported === true) {
          return resolve(readEachRow(excelFile, outputWorkbook, batch, worksheet, rowNumber + 1));
        }

        customer = response;
        let missingData = false;
        let illogicalData = false;
        let duplicateData = false;

        // if (batch !== 'W1') {
        missingData = isMissingData(customer, row);
        illogicalData = isIllogicalData(customer, row);
        // }

        duplicateData = customer.isPhoneDuplicated;

        let rowData = [
          customer.customer_id,
          customer.firstName,
          customer.lastName,
          customer.district,
          customer.province,
          row.getCell(phoneCol).value,
          customer.day,
          customer.month,
          customer.year,
          hospital.hospital_name,
          hospital.province_name,
          hospital.area_name,
          customer.campaignName,
          customer.babyWeight,
          customer.babySize,
          customer.brand,
          customer.giftSize,
          customer.collectedDay,
          customer.collectedMonth,
          customer.collectedYear,
          customer.week
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
            duplicatedWith.first_name,
            duplicatedWith.last_name,
            duplicatedWith.district,
            duplicatedWith.province,
            duplicatedWith.phone,
            duplicatedWith.day,
            duplicatedWith.month,
            duplicatedWith.year,
            duplicatedWith.hospital_name,
            duplicatedWith.province_name,
            duplicatedWith.area_name,
            duplicatedWith.campaignName,
            duplicatedWith.babyWeight,
            duplicatedWith.babySize,
            duplicatedWith.brand,
            duplicatedWith.giftSize,
            duplicatedWith.collectedDay,
            duplicatedWith.collectedMonth,
            duplicatedWith.collectedYear,
            duplicatedWith.week
          ]

          if (duplicatedWith.batch == customer.batch) {
            duplicatedWith.hasError = 1;
            duplicatedWith.duplicatedPhone = 1;
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

    resolve(workbook);
  });
}

function getHospital(hospitalName) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT hospitals.hospital_id, hospitals.name AS hospital_name, provinces.name AS province_name, areas.area_id AS area_id, areas.name As area_name FROM hospitals LEFT JOIN matches ON hospitals.hospital_id = matches.hospital_id JOIN provinces ON hospitals.province_id = provinces.province_id JOIN areas ON provinces.area_id = areas.area_id WHERE hospitals.name = ? OR matches.name = ?;';
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
      row.getCell(dayCol).value === null           &&
      row.getCell(monthCol).value === null         &&
      row.getCell(yearCol).value === null          &&
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

  if (row.getCell(lastNameCol).value === null || row.getCell(lastNameCol).value.length == 0) {
    missingFields.push('Tên');
    customer.missingName = 1;
  }

  if (row.getCell(districtCol).value === null || row.getCell(districtCol).value.length == 0) {
    missingFields.push('Quận/Huyện');
    customer.missingLivingCity = 1;
  }

  if (row.getCell(provinceCol).value === null || row.getCell(provinceCol).value.length == 0) {
    missingFields.push('Tỉnh/Thành');
    customer.missingLivingCity = 1;
  }

  if (row.getCell(phoneCol).value === null || row.getCell(phoneCol).value.length == 0) {
    missingFields.push('Điện Thoại');
    customer.missingPhone = 1;
  }

  if (row.getCell(dayCol).value === null || row.getCell(monthCol).value === null || row.getCell(yearCol).value === null) {
    customer.missingDeliveryDate = 1;
    missingFields.push('Ngày sinh');
  }

  if (row.getCell(hospitalNameCol).value === null || row.getCell(hospitalNameCol).value.length == 0) {
    customer.missingHospital = 1;
    missingFields.push('Bệnh viện');
  }

  if (row.getCell(hospitalProvinceCol).value === null || row.getCell(hospitalProvinceCol).value.length == 0) {
    customer.missingHospital = 1;
    missingFields.push('Bệnh viện');
  }

  if (row.getCell(hospitalAreaCol).value === null || row.getCell(hospitalAreaCol).value.length == 0) {
    customer.missingHospital = 1;
    missingFields.push('Bệnh viện');
  }

  if (row.getCell(brandCol).value === null || row.getCell(brandCol). value.length == 0) {
    customer.missingBrand = 1;
    missingFields.push('Nhãn hiệu tã đang sử dụng');
  }

  if (row.getCell(babyWeightCol).value === null || row.getCell(babyWeightCol).value.length == 0) {
    customer.missingOtherInformation = 1;
    missingFields.push('Thông tin khác');
  }

  if (row.getCell(babySizeCol).value === null || row.getCell(babySizeCol).value.length == 0) {
    customer.missingOtherInformation = 1;
    missingFields.push('Thông tin khác');
  }

  if (row.getCell(giftSizeCol).value === null || row.getCell(giftSizeCol).value.length == 0) {
    customer.missingOtherInformation = 1;
    missingFields.push('Thông tin khác');
  }

  if (missingFields.length > 0) {
    return true;
  }

  return false;
}

function isIllogicalData(customer, row) {
  let flag = false;

  let phone = row.getCell(phoneCol).value;

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

  let day = row.getCell(dayCol).value;
  let month = row.getCell(monthCol).value;
  let year = row.getCell(yearCol).value;
  let date = year + '-' + padStart(month, 2, 0) + '-' + padStart(day, 2, 0);
  date = new Date(date);

  if (date !== null && date !== undefined) {
    if (date.toString() === 'Invalid Date') {
      customer.illogicalDeliveryDate = 1;
      flag = true;
    } else {
      if (parseInt(month) == 2 && parseInt(day) > 29) {
        customer.illogicalDeliveryDate = 1;
        flag = true;
      }

      if ((parseInt(month) == 4 || parseInt(month) == 6 || parseInt(month) == 9 || parseInt(month) == 11) && parseInt(day) > 30) {
        customer.illogicalDeliveryDate = 1;
        flag = true;
      }

      var today = new Date();
      var currentYear = today.getFullYear();

      if (date.getFullYear() < currentYear - 1 || date.getFullYear() >= currentYear + 1) {
        customer.illogicalDeliveryDate = 1;
        flag = true;
      }

      if (date >= today) {
        customer.illogicalDeliveryDate = 1;
        flag = true;
      }

      if (customer.collectedDay && customer.collectedMonth && customer.collectedYear) {
        let collectedDate = customer.collectedYear + '-' + padStart(customer.collectedMonth, 2, 0) + '-' + padStart(customer.collectedDay, 2, 0);
        collectedDate = new Date(collectedDate);
        if (date >= collectedDate) {
          customer.illogicalOthers = 1;
          flag = true;
        }
      }
    }
  }

  let babySize = row.getCell(babySizeCol).value;
  let giftSize = row.getCell(giftSizeCol).value;

  if (babySize !== 'M' || giftSize !== 'M') {
    customer.illogicalSize = 1
    flag = true;
  }

  let babyWeight = row.getCell(babyWeightCol).value;

  if (babyWeight !== null && (parseInt(babyWeight) < 6 || parseInt(babyWeight) > 11)) {
    customer.illogicalBabyWeight = 1
    flag = true;
  }

  let brand = row.getCell(brandCol).value;

  if (brand !== null && brand.toLowerCase() === 'huggies') {
    customer.illogicalBrand = 1
    flag = true;
  }

  return flag;
}
