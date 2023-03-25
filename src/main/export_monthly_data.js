const _  = require('lodash');
const fs = require('fs');
const Diacritics = require('diacritic');
const moment = require('moment');
const Excel = require('exceljs');

import { db } from '../db/prepare_data';
import { writeToFile } from './check_source_data_v2';
import { buildTemplate } from './build_excel_template_v3';

export const exportMonthlyData = (month, year, outputDirectory) => {
  if ( !_.endsWith(outputDirectory, '/') ) {
    outputDirectory += '/';
  }

  let monthYear = month + '-' + year;
  outputDirectory += monthYear;

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }
  if ( !_.endsWith(outputDirectory, '/') ) {
    outputDirectory += '/';
  }

  return new Promise((resolve, reject) => {
    let outputPath = outputDirectory + 'Total_' + monthYear + '.xlsx';
    let sheetName = { name: 'Total ' + monthYear }
    let sheetTitle = 'DATA OF ' + monthYear;
    console.log('Loaded Full Data of ' + monthYear + ' into Excel File.');

    buildTemplate(outputPath, sheetName.name, sheetTitle).then((outputWorkbook) => {
      getDataOfMonth(parseInt(month), parseInt(year)).then((customers) => {
        let customerIndex = 0;
        writeCustomersToFile(outputWorkbook, sheetName, customers, customerIndex).then((writtenResult) => {
          outputWorkbook.xlsx.writeFile(outputPath);
          resolve({success: true});
        });
      });
    });
  });
}

function getDataOfMonth(month, year) {
  return new Promise((resolve, reject) => {
    db.all("SELECT customers.customer_id, customers.last_name, customers.first_name,\
    customers.email, customers.district, customers.province, customers.phone,\
    customers.day, customers.month, customers.year,\
    customers.s1, customers.s2, hospitals.name as hospital_name, \
    provinces.name as province_name, \
    areas.channel as area_channel, \
    areas.name as area_name, \
    customers.source, \
    customers.collectedDay, customers.collectedMonth, customers.collectedYear,\
    customers.staff, customers.note, customers.pgCode, customers.qrCode,\
    customers.batch \
    from customers JOIN hospitals ON \
    hospitals.hospital_id = customers.hospital_id JOIN provinces ON \
    hospitals.province_id = provinces.province_id JOIN areas ON \
    areas.area_id = provinces.area_id WHERE customers.collectedMonth = ? AND customers.collectedYear = ?", month, year, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function writeCustomersToFile(outputWorkbook, sheetName, customers, customerIndex) {
  return new Promise((resolve, reject) => {
    let customer = customers[customerIndex];

    if (customer === undefined || customer === null) {
      return resolve(null);
    }

    let rowData = [
      customer.customer_id,
      customer.last_name,
      customer.first_name,
      customer.email,
      customer.district,
      customer.province,
      customer.phone,
      customer.day,
      customer.month,
      customer.year,
      customer.s1,
      customer.s2,
      customer.hospital_name,
      customer.province_name,
      customer.area_channel,
      customer.area_name,
      customer.source,
      customer.collectedDay,
      customer.collectedMonth,
      customer.collectedYear,
      customer.staff,
      customer.note,
      customer.pgCode,
      customer.qrCode,
    ]

    writeToFile(outputWorkbook, sheetName, rowData, false).then((res) => {
      resolve(writeCustomersToFile(outputWorkbook, sheetName, customers, customerIndex + 1));
    });
  });
}

