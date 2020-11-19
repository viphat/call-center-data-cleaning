import { db } from '../db/prepare_data.js';
const _  = require('lodash');
const Excel = require('exceljs');
const fs = require('fs');

const logoPath = './app/vendor/logo.png';

export const generateReport = (batch, outputDirectory) => {
  return new Promise((resolve, reject) => {
    generateReportTemplate(batch, outputDirectory).then((reportFilePath) => {
      fillData(batch, 'All').then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'B');
      }).then(() => {
        return fillData(batch, 'ByBatch');
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'C');
      }).then(() => {
        return fillData(batch, { provinceId: 1 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'D');
      }).then(() => {
        return fillData(batch, { provinceId: 2 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'E');
      }).then(() => {
        return fillData(batch, { provinceId: 3 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'F');
      }).then(() => {
        return fillData(batch, { provinceId: 4 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'G');
      }).then(() => {
        return fillData(batch, { provinceId: 5 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'H');
      }).then(() => {
        return fillData(batch, { provinceId: 6 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'I');
      }).then(() => {
        return fillData(batch, { provinceId: 7 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'J');
      }).then(() => {
        return fillData(batch, { provinceId: 8 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'K');
      }).then(() => {
        return fillData(batch, { provinceId: 9 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'L');
      }).then(() => {
        return fillData(batch, { provinceId: 10 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'M');
      }).then(() => {
        return fillData(batch, { provinceId: 11 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'N');
      }).then(() => {
        return fillData(batch, { provinceId: 12 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'O');
      }).then(() => {
        return fillData(batch, { provinceId: 13 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'P');
      }).then(() => {
        return fillData(batch, { provinceId: 14 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'Q');
      }).then(() => {
        resolve(reportFilePath);
      });

    });
  });
}

function writeToTemplate(reportFilePath, rowData, cellIndex) {
  return new Promise((resolve, reject) => {
    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile(reportFilePath).then((response) => {

      let worksheet = workbook.getWorksheet(1);
      let row;

      row = worksheet.getRow(6);
      row.getCell(cellIndex).value = rowData.TotalBase;

      row = worksheet.getRow(7);
      row.getCell(cellIndex).value = rowData.MissingData;

      row = worksheet.getRow(8);
      row.getCell(cellIndex).value = rowData.MissingName;

      row = worksheet.getRow(9);
      row.getCell(cellIndex).value = rowData.MissingLivingCity;

      row = worksheet.getRow(10);
      row.getCell(cellIndex).value = rowData.MissingPhone;

      row = worksheet.getRow(11);
      row.getCell(cellIndex).value = rowData.MissingDeliveryDate;

      row = worksheet.getRow(12);
      row.getCell(cellIndex).value = rowData.MissingHospital;

      row = worksheet.getRow(13);
      row.getCell(cellIndex).value = rowData.MissingBrand;

      row = worksheet.getRow(14);
      row.getCell(cellIndex).value = rowData.MissingOtherInformation;

      row = worksheet.getRow(15);
      row.getCell(cellIndex).value = rowData.DuplicatedPhone;

      row = worksheet.getRow(16);
      row.getCell(cellIndex).value = rowData.IllogicalData;

      row = worksheet.getRow(17);
      row.getCell(cellIndex).value = rowData.IllogicalPhone;

      row = worksheet.getRow(18);
      row.getCell(cellIndex).value = rowData.IllogicalDeliveryDate;

      row = worksheet.getRow(19);
      row.getCell(cellIndex).value = rowData.IllogicalSize;

      row = worksheet.getRow(20);
      row.getCell(cellIndex).value = rowData.IllogicalBrand;

      row = worksheet.getRow(21);
      row.getCell(cellIndex).value = rowData.IllogicalBabyWeight;

      row = worksheet.getRow(22);
      row.getCell(cellIndex).value = rowData.IllogicalOthers;

      row = worksheet.getRow(23);
      row.getCell(cellIndex).value = rowData.TotalBase - rowData.HasError;

      resolve(workbook.xlsx.writeFile(reportFilePath));
    });
  });
}

function fillData(batch, filterType) {
  return new Promise((resolve, reject) => {
    let baseQuery = 'SELECT COUNT(*) AS TotalBase, coalesce(SUM(hasError),0) AS HasError,\
    coalesce(SUM(missingData),0) AS MissingData,\
    coalesce(SUM(missingName),0) AS MissingName, coalesce(SUM(missingLivingCity),0) AS MissingLivingCity,\
    coalesce(SUM(missingPhone),0) AS MissingPhone, \
    coalesce(SUM(missingDeliveryDate),0) As MissingDeliveryDate, \
    coalesce(SUM(missingHospital),0) AS MissingHospital, \
    coalesce(SUM(missingBrand),0) AS MissingBrand, \
    coalesce(SUM(missingOtherInformation),0) AS MissingOtherInformation, \
    coalesce(SUM(illogicalData),0) As IllogicalData, \
    coalesce(SUM(illogicalDeliveryDate),0) As IllogicalDeliveryDate, \
    coalesce(SUM(illogicalPhone),0) AS IllogicalPhone,\
    coalesce(SUM(illogicalSize),0) AS IllogicalSize,\
    coalesce(SUM(illogicalBrand),0) AS IllogicalBrand,\
    coalesce(SUM(illogicalBabyWeight),0) AS IllogicalBabyWeight,\
    coalesce(SUM(illogicalOthers),0) AS IllogicalOthers,\
    coalesce(SUM(duplicatedPhone),0) As DuplicatedPhone FROM customers'

    let whereCondition = '';
    let joinTable = '';
    let params = {};

    if (filterType.provinceId !== undefined && filterType.provinceId !== null) {
      joinTable = 'JOIN hospitals ON customers.hospital_id = hospitals.hospital_id \
        JOIN provinces ON hospitals.province_id = provinces.province_id';
      whereCondition = 'WHERE provinces.province_id = $provinceId'
      params = {
        $provinceId: filterType.provinceId
      }
    }

    if (batch !== '' && filterType !== 'All') {
      params = _.merge(params, {
        $batch: batch
      });
      if (whereCondition === '') {
        whereCondition = 'WHERE customers.batch = $batch'
      } else {
        whereCondition += " AND customers.batch = $batch";
      }
    }

    let query = baseQuery + ' ' + joinTable + ' ' + whereCondition + ';';

    db.get(query, params, (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
}


export const generateReportTemplate = (batch, outputDirectory) => {
  return new Promise((resolve, reject) => {

    let dir = outputDirectory + '/' + batch;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    let reportFilePath = dir + '/report.xlsx';

    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Abs', {});

    worksheet.getColumn('A').width = 60;
    worksheet.getRow(1).height = 50;
    worksheet.getRow(4).height = 30;
    worksheet.getRow(5).height = 40;

    // Add Logo
    let logo = workbook.addImage({
      filename: logoPath,
      extension: 'png'
    });

    worksheet.addImage(logo, {
      tl: { col: 0, row: 0 },
      br: { col: 1, row: 1 }
    });

    worksheet.getColumn('B').width = 30;
    worksheet.getColumn('C').width = 30;
    worksheet.getColumn('D').width = 30;
    worksheet.getColumn('E').width = 30;
    worksheet.getColumn('F').width = 30;
    worksheet.getColumn('G').width = 30;
    worksheet.getColumn('H').width = 30;
    worksheet.getColumn('I').width = 30;
    worksheet.getColumn('J').width = 30;
    worksheet.getColumn('K').width = 30;
    worksheet.getColumn('L').width = 30;
    worksheet.getColumn('M').width = 30;
    worksheet.getColumn('N').width = 30;
    worksheet.getColumn('O').width = 30;
    worksheet.getColumn('P').width = 30;
    worksheet.getColumn('Q').width = 30;
    // A1

    worksheet.getCell('B1').value = 'HUGGIES AB CALL CENTER 2020 PROJECT';

    worksheet.getCell('B1').font = {
      bold: true, size: 26, name: 'Calibri', family: 2,
      color: { argb: 'FFFF0000' }
    }

    worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.mergeCells('B1:E1')

    // A2
    worksheet.getCell('B2').font = {
      bold: true, size: 14, name: 'Calibri', family: 2,
      underline: true,
      color: { argb: 'FFFF0000' }
    }

    worksheet.getCell('B2').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getCell('B2').value = 'Step 1: Database Clean';

    // A4
    worksheet.getCell('A5').border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
      top: { style: 'thin' },
      bottom: { style: 'thin' }
    }

    worksheet.getCell('A5').font = {
      bold: true, size: 14, name: 'Calibri', family: 2
    }

    worksheet.getCell('A5').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getCell('A5').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFABF8F' },
      bgColor: { indexed: 64 }
    };

    worksheet.getCell('A5').value = batch;

    // A6, A20
    buildReportFirstColumnType3(worksheet, 6, 'Raw data received from Agency');
    buildReportFirstColumnType3(worksheet, 23, 'Valid database (value) - base all');

    // A7, A12, A16
    buildReportFirstColumnType2(worksheet, 7, 'Data missing');
    buildReportFirstColumnType2(worksheet, 15, 'Duplicated Data (Checking vs. total database since 1st week)');
    buildReportFirstColumnType2(worksheet, 16, 'Illogical data');

    // A8 - A11, A13 - A15, A17-A19
    buildReportFirstColumnType1(worksheet, 8, "Respondent's name (column C)");
    buildReportFirstColumnType1(worksheet, 9, "Living city (missing one of the column D+E)");
    buildReportFirstColumnType1(worksheet, 10, "Phone number (column F)");
    buildReportFirstColumnType1(worksheet, 11, "Delivery Data (missing one of the column  G+H+I)");
    buildReportFirstColumnType1(worksheet, 12, "Hospital (missing one of the column J+K+L)");
    buildReportFirstColumnType1(worksheet, 13, "Brand using (column P)");
    buildReportFirstColumnType1(worksheet, 14, "Other information (missing one of the column N+O+Q)");

    buildReportFirstColumnType1(worksheet, 17, "Illogical phone number format");
    buildReportFirstColumnType1(worksheet, 18, "Illogical date format");
    buildReportFirstColumnType1(worksheet, 19, "Illogical size (column Q ≠ 'M')");
    buildReportFirstColumnType1(worksheet, 20, "Illogical brand (column P = 'Huggies')");
    buildReportFirstColumnType1(worksheet, 21, "Illogic baby weight (column N not among '6-11')");
    buildReportFirstColumnType1(worksheet, 22, "Illogical Others");
    // Done 1st Col

    // Row 4 - D4, K4, P4, S4
    buildReportRow4(worksheet, 'D', 'D4:Q4', 'Break-down by city (based on column K)');

    // // Row 5, B4-T4
    buildReportRow5(worksheet, 'B', 'Total Project');
    buildReportRow5(worksheet, 'C', 'Total ' + batch);
    buildReportRow5(worksheet, 'D', 'Hồ Chí Minh');
    buildReportRow5(worksheet, 'E', 'Đà Nẵng');
    buildReportRow5(worksheet, 'F', 'Nha Trang');
    buildReportRow5(worksheet, 'G', 'Hà Nội');
    buildReportRow5(worksheet, 'H', 'Bắc Ninh');
    buildReportRow5(worksheet, 'I', 'Vĩnh Phúc');
    buildReportRow5(worksheet, 'J', 'Hải Phòng');
    buildReportRow5(worksheet, 'K', 'Thái Nguyên');
    buildReportRow5(worksheet, 'L', 'Hải Dương');
    buildReportRow5(worksheet, 'M', 'Thái Bình');
    buildReportRow5(worksheet, 'N', 'Nghệ An');
    buildReportRow5(worksheet, 'O', 'Thanh Hóa');
    buildReportRow5(worksheet, 'P', 'Hưng Yên');
    buildReportRow5(worksheet, 'Q', 'Ninh Bình');

    // Data
    let colArr = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'];
    let rowArr = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    for (let rowArrIndex = 0; rowArrIndex < rowArr.length; rowArrIndex += 1) {
      for (let colArrIndex = 0; colArrIndex < colArr.length; colArrIndex += 1 ) {
        buildDataRow(worksheet, rowArr[rowArrIndex], colArr[colArrIndex]);
      }
    }
    // End Data

    // Write to File
    workbook.xlsx.writeFile(reportFilePath).then((res) => {
      resolve(reportFilePath);
    });
  });
};

function buildReportRow5(worksheet, cellIndex, text) {
  let row = worksheet.getRow(5);
  let fgColor = { theme: 0, tint: -0.1499984740745262 };

  if (cellIndex == 'B') {
    fgColor = { theme: 2, tint: -0.249977111117893 };
  }

  if (cellIndex == 'C') {
    fgColor = { theme: 5, tint: 0.5999938962981048 };
  }

  if (cellIndex == 'D' || cellIndex == 'E' || cellIndex == 'F' || cellIndex == 'G' ||
    cellIndex == 'H' || cellIndex == 'I' || cellIndex == 'J'
  ) {
    fgColor = { argb: 'FFFFFF00' };
  }

  if (cellIndex == 'K' || cellIndex == 'L' || cellIndex == 'M' || cellIndex == 'N' ||
    cellIndex == 'O'
  ) {
    fgColor = { theme: 6, tint: 0.3999755851924192 };
  }

  if (cellIndex == 'P' || cellIndex == 'Q' || cellIndex == 'R') {
    fgColor = { theme: 9, tint: 0.3999755851924192 };
  }

  if (cellIndex == 'S' || cellIndex == 'T') {
    fgColor = { theme: 9, tint: 0.5999938962981048 };
  }

  row.getCell(cellIndex).border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: { style: 'thin' },
    bottom: { style: 'thin' }
  }

  row.getCell(cellIndex).font = {
    bold: true, size: 14, name: 'Calibri', family: 2
  }

  row.getCell(cellIndex).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: fgColor,
    bgColor: { indexed: 64 }
  };

  row.getCell(cellIndex).alignment = { horizontal: 'center', vertical: 'middle' };

  row.getCell(cellIndex).value = text;
}

function buildReportRow4(worksheet, cellIndex, mergeRange, text) {
  let row = worksheet.getRow(4);

  row.getCell(cellIndex).border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: { style: 'thin' },
    bottom: { style: 'thin' }
  }

  let fgColor = '';

  switch (cellIndex) {
    case 'D':
      fgColor = { argb: 'FFFFFF00' };
      break;
    case 'K':
      fgColor = { theme: 6, tint: 0.3999755851924192 };
      break;
    case 'P':
      fgColor = { theme: 9, tint: 0.3999755851924192 };
      break;
    case 'S':
      fgColor = { theme: 9, tint: 0.5999938962981048 };
      break;
  }

  row.getCell(cellIndex).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: fgColor,
    bgColor: { indexed: 64 }
  }

  row.getCell(cellIndex).font = {
    bold: true,
    size: 12,
    color: { argb: 'FF0070C0' },
    name: 'Calibri',
    family: 2
  }

  row.getCell(cellIndex).alignment = { horizontal: 'center', vertical: 'middle' };

  row.getCell(cellIndex).value = text;

  worksheet.mergeCells(mergeRange);
}

function buildReportFirstColumnType3(worksheet, rowIndex, text) {
  let row = worksheet.getRow(rowIndex);

  row.getCell('A').border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: { style: 'thin' },
    bottom: { style: 'thin' }
  }

  if (rowIndex == 20) {
    row.getCell('A').font = {
      bold: true, size: 14, name: 'Calibri', family: 2,
      color: { theme: 0 }
    }
  } else {
    row.getCell('A').font = {
      bold: true, size: 14, name: 'Calibri', family: 2,
      color: { argb: 'FFFF0000' }
    }
  }

  row.getCell('A').alignment = { vertical: 'middle' };

  if (rowIndex == 20) {
    row.getCell('A').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF0000' },
      bgColor: { indexed: 64 }
    };
  }

  row.getCell('A').value = text;
}


function buildReportFirstColumnType2(worksheet, rowIndex, text) {
  let row = worksheet.getRow(rowIndex);

  row.getCell('A').border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: { style: 'thin' },
    bottom: { style: 'thin' }
  }

  row.getCell('A').font = {
    bold: true, size: 14, name: 'Calibri', family: 2,
    color: { theme: 0 }
  }

  row.getCell('A').alignment = { vertical: 'middle' };

  row.getCell('A').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF00B0F0' },
    bgColor: { indexed: 64 }
  };

  row.getCell('A').value = text;
}

function buildReportFirstColumnType1(worksheet, rowIndex, text) {
  let row = worksheet.getRow(rowIndex);

  row.getCell('A').border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: { style: 'thin' },
    bottom: { style: 'thin' }
  }

  row.getCell('A').font = {
    size: 14, name: 'Calibri', family: 2
  }

  row.getCell('A').alignment = { horizontal: 'right', vertical: 'middle' };

  row.getCell('A').value = text;
}

function buildDataRow(worksheet, rowIndex, cellIndex) {
  let row = worksheet.getRow(rowIndex);
  let bold = false;
  let color = { argb: 'FF000000' };

  if (rowIndex == 6 || rowIndex == 7 || rowIndex == 15 || rowIndex == 16 || rowIndex == 23) {
    bold = true;
  }

  if (rowIndex == 7 || rowIndex == 15 || rowIndex == 16) {
    row.getCell(cellIndex).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF00B0F0' },
      bgColor: { indexed: 64 }
    };
  }

  if (rowIndex == 23) {
    row.getCell(cellIndex).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF0000' },
      bgColor: { indexed: 64 }
    };
  }

  if (rowIndex == 6) {
    color = { argb: 'FFFF0000' };
  }

  if (rowIndex == 7 || rowIndex == 15 || rowIndex == 16 || rowIndex == 23) {
    color = { theme: 0 };
  }

  row.getCell(cellIndex).border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: { style: 'thin' },
    bottom: { style: 'thin' }
  }

  row.getCell(cellIndex).font = {
    italic: true, bold: bold, size: 14, name: 'Calibri', family: 2,
    color: color
  }

  row.getCell(cellIndex).numFmt = '#,##0';

  row.getCell(cellIndex).value = 0;
}

// function readReportTemplate() {
//   let originalTemplatePath = '/Users/viphat/projects/dct/Huggies Call Center_ Clean Topline _Format for 2017 (31.5.2017).xlsx'
//   let workbook = new Excel.Workbook();
//   workbook.xlsx.readFile(originalTemplatePath).then(()=>{
//     let worksheet = workbook.getWorksheet('Abs');
//     console.log(worksheet.getCell('B5').fill);
//     console.log(worksheet.getCell('C5').fill);
//   });
// }
