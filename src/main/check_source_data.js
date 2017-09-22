const _  = require('lodash');
const fs = require('fs');
const Diacritics = require('diacritic');
const moment = require('moment');
const Excel = require('exceljs');

import { db } from '../db/prepare_data';

import { buildTemplate } from '../main/build_excel_template';
import { createCustomer, updateCustomer } from '../db/create_customer';

const dataBeginRow = 6;
const indexCol = 1;
const lastNameCol = 2;
const firstNameCol = 3;
const emailCol = 4;
const districtCol = 5;
const provinceCol = 6;
const phoneCol = 7;
const dateCol = 8;
const s1Col = 9;
const s2Col = 10;

const hospitalNameCell = 'H2';
const redundantStrings = ['Tên BV/PK:', 'Tên BV/PK :'];

export const validateSourceData = (excelFiles, batch, outputDirectory) => {
  return new Promise((resolve, reject) => {
    let fileIndex = 0;
    if ( !_.endsWith(outputDirectory, '/') ) {
      outputDirectory += '/';
    }
    let dir = outputDirectory + batch;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    resolve(readEachFile(excelFiles, batch, dir, fileIndex));
  });
}

function readEachFile(excelFiles, batch, outputDirectory, fileIndex) {
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
      let hospitalName = worksheet.getCell(hospitalNameCell).value;
      _.each(redundantStrings, (redundantString) => {
        hospitalName = _.replace(hospitalName, redundantString, '');
      })
      hospitalName = hospitalName.trim().replace(/\s+/g, ' ');
      let province_name;
      let rowNumber;
      let outputPath;
      let hospital;
      getHospital(hospitalName).then((obj) => {
        hospital = obj;
        province_name = hospital.province_name;
        rowNumber = dataBeginRow;
        outputPath = outputDirectory + '/' + Diacritics.clean(province_name).split(' ').join('_') + '.xlsx';
        return buildTemplate(outputPath, province_name);
      }).then( (outputWorkbook) => {
        return readEachRow(excelFile, outputWorkbook, batch, worksheet, hospital, province_name, rowNumber);
      }).then( (outputWorkbook) => {
        outputWorkbook.xlsx.writeFile(outputPath).then(() =>{
          resolve(readEachFile(excelFiles, batch, outputDirectory, fileIndex + 1));
        })
      });
    });
  });
}

function readEachRow(excelFile, outputWorkbook, batch, worksheet, hospital, province_name, rowNumber) {
  return new Promise((resolve, reject) => {
    let row = worksheet.getRow(rowNumber);
    console.log('Row: ' + rowNumber);
    if (isEmptyRow(row)) {
      return resolve(outputWorkbook);
    }

    let customer = {
      lastName: row.getCell(lastNameCol).value,
      firstName: row.getCell(firstNameCol).value,
      email: row.getCell(emailCol).value,
      district: row.getCell(districtCol).value,
      province: row.getCell(provinceCol).value,
      phone: row.getCell(phoneCol).value,
      s1: row.getCell(s1Col).value,
      s2: row.getCell(s2Col).value,
      hospital_id: hospital.hospital_id,
      batch: batch
    }

    if (excelFile.endsWith('S1.xlsx')) {
      customer.sampling = 'S1';
    } else {
      customer.sampling = 'S2';
    }
    // Insert Data to Database
    createCustomer(customer).then((response) => {
      if (response.alreadyImported === true) {
        return resolve(readEachRow(excelFile, outputWorkbook, batch, worksheet, hospital, province_name, rowNumber + 1));
      }

      customer = response;
      let missingData = isMissingData(customer, row);
      let illogicalData = isIllogicalData(customer, row);
      let duplicateData = customer.isPhoneDuplicated;

      let rowData = [
        customer.customer_id,
        customer.lastName,
        customer.firstName,
        customer.email,
        customer.district,
        customer.province,
        row.getCell(phoneCol).value,
        // '',  // Placeholder for babyName
        // '',  // Placeholder for babyGender
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

      let outputSheetName = province_name + ' - ' + 'Valid';
      if (missingData || illogicalData) {
        outputSheetName = province_name + ' - ' + 'Invalid';
      } else if (duplicateData === true) {
        outputSheetName = province_name + ' - ' + 'Duplication';
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
        var duplicatedWith = customer.duplicatedWith;

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
          duplicatedWith.batch
        ]

        // console.log(duplicatedRow);

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
        writeToFile(outputWorkbook, outputSheetName, province_name, duplicatedRow).then((workbook) => {
          writeToFile(outputWorkbook, outputSheetName, province_name, rowData).then((workbook) => {
            resolve(readEachRow(excelFile, workbook, batch, worksheet, hospital, province_name, rowNumber+1));
          });
        });
      } else {
        writeToFile(outputWorkbook, outputSheetName, province_name, rowData).then((workbook) => {
          resolve(readEachRow(excelFile, workbook, batch, worksheet, hospital, province_name, rowNumber+1));
        });
      }
    });
  });
}

export const writeToFile = (outputWorkbook, outputSheetName, province_name, rowData) => {
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

    if (outputSheetName.endsWith('Duplication')) {
      row.getCell(17).font = row.getCell(1).font;
      row.getCell(17).border = row.getCell(1).border;
      row.getCell(17).alignment = row.getCell(1).alignment;
    }

    resolve(workbook);
  });
}

function getHospital(hospitalName) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT hospitals.hospital_id, hospitals.name AS hospital_name, provinces.name AS province_name, areas.area_id AS area_id, areas.name As area_name, areas.channel as area_channel FROM hospitals JOIN matches ON hospitals.hospital_id = matches.hospital_id JOIN provinces ON hospitals.province_id = provinces.province_id JOIN areas ON provinces.area_id = areas.area_id WHERE hospitals.name LIKE ? OR matches.name LIKE ?;';
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
      row.getCell(dateCol).value === null
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

  if (row.getCell(firstNameCol).value === null) {
    missingFields.push('Tên');
    customer.missingFirstName = 1;
  }

  if (row.getCell(firstNameCol).value === null || row.getCell(lastNameCol).value === null) {
    customer.missingMomName = 1;
  }

  if (row.getCell(emailCol).value === null) {
    // Tạm thời không làm gì cả
    // Không đưa vào Invalid List
    customer.missingEmail = 1;
  }

  if (row.getCell(districtCol).value === null || row.getCell(districtCol).value.length == 0) {
    missingFields.push('Quận/Huyện');
    customer.missingDistrict = 1;
    customer.missingAddress = 1;
  }

  if (row.getCell(provinceCol).value === null || row.getCell(provinceCol).value.length == 0) {
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
  let email = row.getCell(emailCol).value;
  let district = row.getCell(districtCol).value;
  let province = row.getCell(provinceCol).value;
  let date = row.getCell(dateCol).value;

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

  if (lastName !== undefined && lastName !== null && firstName) {
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
      // Vẫn cho phép Email bị sai? (Nhưng sẽ thống kê lại)
      // return true;
      customer.illogicalEmail = 1;
    }
  }

  if (district !== undefined && district !== null) {
    district = '' + district;
    district = district.trim().replace(/\s+/g, ' ');
    let iDistrict = parseInt(district);
    if (district.length > 0) {
      if (!isNaN(iDistrict)) {
        if (iDistrict < 1 && iDistrict > 12) {
          customer.illogicalAddress = 1;
          flag = true;
        }
      }
      if (hasSpecialCharacter(district)) {
        customer.illogicalAddress = 1;
        flag = true;
      }
    }
  }

  if (province !== undefined && province !== null) {
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

  // day !== null && day !== undefined && month !== null && month !== undefined && year !== null && year !== undefined
  if (date !== null && date !== undefined) {
    customer.day = date;
    customer.month = null;
    customer.year = null;
    let day, month, year;
    let mayOf2017 = new Date('2017-05-01');
    if (date instanceof Date) {
      day = date.getDate();
      month = date.getMonth() + 1;
      year = date.getFullYear();
    } else {
      date = new Date(date);
      if (date == 'Invalid Date') {
        let dateArr = customer.day.split('/');
        if (dateArr.length == 1) {
          dateArr = customer.day.split('-');
        }
        // console.log(dateArr);
        if (dateArr.length == 3) {
          day = dateArr[0];
          month = dateArr[1];
          year = dateArr[2];
        }
      } else {
        day = date.getDate();
        month = date.getMonth() + 1;
        year = date.getFullYear();
        let tmp = day;
        day = month;
        month = tmp;
      }
    }

    customer.day = day;
    customer.month = month;
    customer.year = year;

    date = new Date(year + '-' + month + '-' + day);

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
      var currentYear = today.getFullYear();

      if (date.getFullYear() < currentYear - 1 || date.getFullYear() > currentYear + 1) {
        customer.illogicalDate = 1;
        flag = true;
      }

      if (date < mayOf2017) {
        customer.illogicalDate = 1;
        flag = true;
      }

      if (sampling == 'S2' && date >= today) {
        // Ngày sinh của em bé không được lớn hơn hoặc bằng ngày import
        customer.illogicalDate = 1;
        flag = true;
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
