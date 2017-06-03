const _  = require('lodash');
const fs = require('fs');
const Diacritics = require('diacritic');
const moment = require('moment');
const Excel = require('exceljs');

import { db } from '../db/prepare_data';
import { writeToFile } from './check_source_data';
import { buildTemplate } from './build_excel_template';

export const exportFullData = (outputDirectory) => {
  if ( !_.endsWith(outputDirectory, '/') ) {
    outputDirectory += '/';
  }
  outputDirectory += 'Full';
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }
  if ( !_.endsWith(outputDirectory, '/') ) {
    outputDirectory += '/';
  }
  let provinceIndex = 0;
  return new Promise((resolve, reject) => {
    getProvinces().then((provinces) => {
      resolve(buildFileForProvince(outputDirectory, provinces, provinceIndex));
    })
  });
}

function buildFileForProvince(outputDirectory, provinces, provinceIndex) {
  return new Promise((resolve, reject) => {
    let province = provinces[provinceIndex];
    if (province === undefined || province === null) {
      return resolve(null);
    }
    checkProvinceHasData(province).then((hasData) => {
      if (hasData == true) {
        console.log('Đang load dữ liệu của ' + province.name);
        let outputPath = outputDirectory + '/' + Diacritics.clean(province.name).split(' ').join('_') + '.xlsx';
        buildTemplate(outputPath, province.name).then((outputWorkbook) => {
          getDataOfProvince(province).then((customers) => {
            let customerIndex = 0;
            writeCustomersToFile(outputWorkbook, province, customers, customerIndex).then((writtenResult) => {
              outputWorkbook.xlsx.writeFile(outputPath);
              resolve(buildFileForProvince(outputDirectory, provinces, provinceIndex + 1));
            });
          })
        })
      } else {
        resolve(buildFileForProvince(outputDirectory, provinces, provinceIndex + 1));
      }
    })
  })
}

function writeCustomersToFile(outputWorkbook, province, customers, customerIndex) {
  return new Promise((resolve, reject) => {
    let customer = customers[customerIndex];
    if (customer === undefined || customer === null) {
      return resolve(null);
    }

    let sheetName = province.name + ' - ' + 'Valid';

    if (customer.illogicalData == 1 || customer.missingMomName == 1 ||
      customer.missingAddress == 1 || customer.missingPhone == 1 ||
      customer.missingBabyInformation == 1 || customer.missingMomStatus == 1) {
      sheetName = province.name + ' - ' + 'Invalid';
    } else if (customer.duplicatedPhone == 1) {
      sheetName = province.name + ' - ' + 'Duplication';
    }

    let rowData = [
      customer.customer_id,
      customer.last_name,
      customer.first_name,
      customer.email,
      customer.district,
      customer.province,
      customer.phone,
      customer.baby_name,
      customer.baby_gender,
      customer.day,
      customer.month,
      customer.year,
      customer.s1,
      customer.s2,
      customer.hospital_name,
      customer.area_channel,
      customer.area_name
    ]

    writeToFile(outputWorkbook, sheetName, province.name, rowData).then((res) => {
      resolve(writeCustomersToFile(outputWorkbook, province, customers, customerIndex + 1));
    });
  });
}

function getDataOfProvince(province) {
  return new Promise((resolve, reject) => {
    db.all("SELECT customers.customer_id, customers.last_name, customers.first_name,\
    customers.email, customers.district, customers.province, customers.phone,\
    customers.baby_name, customers.baby_gender, customers.day, customers.month, customers.year,\
    customers.s1, customers.s2, hospitals.name as hospital_name, areas.channel as area_channel, \
    areas.name as area_name, \
    customers.missingData, \
    customers.missingMomName, \
    customers.missingAddress,\
    customers.missingPhone,\
    customers.missingBabyInformation, \
    customers.missingMomStatus, \
    customers.illogicalData, customers.duplicatedPhone \
    from customers JOIN hospitals ON \
    hospitals.hospital_id = customers.hospital_id JOIN provinces ON \
    hospitals.province_id = provinces.province_id JOIN areas ON \
    areas.area_id = provinces.area_id WHERE provinces.province_id = ?", province.province_id, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function checkProvinceHasData(province) {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) As count FROM customers JOIN hospitals ON \
    hospitals.hospital_id = customers.hospital_id JOIN provinces ON \
    hospitals.province_id = provinces.province_id WHERE provinces.province_id = ?', province.province_id, (err, res) => {
      if (err) {
        return resolve(false);
      }
      if (res === undefined || res === null) {
        return resolve(false);
      }
      if (res.count > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
  });
}

function getProvinces() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM provinces", function(err, provinces){
      if (err) {
        return reject(err);
      }
      resolve(provinces);
    })
  })
}
