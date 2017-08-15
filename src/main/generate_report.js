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
        return fillData(batch, 'Key Urban');
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'D');
      }).then(() => {
        return fillData(batch, { areaId: 1 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'E');
      }).then(() => {
        return fillData(batch, { areaId: 2 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'F');
      }).then(() => {
        return fillData(batch, { areaId: 3 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'G');
      }).then(() => {
        return fillData(batch, { areaId: 4 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'H');
      }).then(() => {
        return fillData(batch, { areaId: 5 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'I');
      }).then(() => {
        return fillData(batch, { areaId: 6 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'J');
      }).then(() => {
        return fillData(batch, 'Urban');
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'K');
      }).then(() => {
        return fillData(batch, { areaId: 7 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'L');
      }).then(() => {
        return fillData(batch, { areaId: 8 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'M');
      }).then(() => {
        return fillData(batch, { areaId: 9 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'N');
      }).then(() => {
        return fillData(batch, { areaId: 10 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'O');
      }).then(() => {
        return fillData(batch, 'Rural');
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'P');
      }).then(() => {
        return fillData(batch, { areaId: 11 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'Q');
      }).then(() => {
        return fillData(batch, { areaId: 12 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'R');
      }).then(() => {
        return fillData(batch, 'S1');
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'S');
      }).then(() => {
        return fillData(batch, 'S2');
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'T');
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
      row.getCell(cellIndex).value = rowData.MissingMomName;

      row = worksheet.getRow(9);
      row.getCell(cellIndex).value = rowData.MissingAddress;

      row = worksheet.getRow(10);
      row.getCell(cellIndex).value = rowData.MissingPhone;

      row = worksheet.getRow(11);
      row.getCell(cellIndex).value = rowData.MissingDate;

      row = worksheet.getRow(12);
      row.getCell(cellIndex).value = rowData.DuplicatedPhone;

      row = worksheet.getRow(13);
      row.getCell(cellIndex).value = rowData.DuplicatedPhoneBetweenS1AndS2;

      row = worksheet.getRow(14);
      row.getCell(cellIndex).value = rowData.DuplicatedPhoneS1;

      row = worksheet.getRow(15);
      row.getCell(cellIndex).value = rowData.DuplicatedPhoneS2;

      row = worksheet.getRow(16);
      row.getCell(cellIndex).value = rowData.IllogicalData;

      row = worksheet.getRow(17);
      row.getCell(cellIndex).value = rowData.IllogicalPhone;

      row = worksheet.getRow(18);
      row.getCell(cellIndex).value = rowData.IllogicalDate;

      row = worksheet.getRow(19);
      row.getCell(cellIndex).value = rowData.IllogicalOther;

      row = worksheet.getRow(20);
      row.getCell(cellIndex).value = rowData.TotalBase - rowData.HasError;

      row = worksheet.getRow(21);
      row.getCell(cellIndex).value = rowData.MissngEmail;

      resolve(workbook.xlsx.writeFile(reportFilePath));
    });
  });
}

function fillData(batch, filterType) {
  return new Promise((resolve, reject) => {
    let baseQuery = 'SELECT COUNT(*) AS TotalBase, coalesce(SUM(hasError),0) AS HasError,\
    coalesce(SUM(missingData),0) AS MissingData,\
    coalesce(SUM(missingMomName),0) AS MissingMomName, coalesce(SUM(missingAddress),0) AS MissingAddress,\
    coalesce(SUM(missingPhone),0) AS MissingPhone, \
    coalesce(SUM(missingEmail),0) AS MissngEmail, \
    coalesce(SUM(missingDate),0) As MissingDate, \
    coalesce(SUM(missingMomStatus),0) AS MissingMomStatus, \
    coalesce(SUM(illogicalData),0) As IllogicalData, \
    coalesce(SUM(illogicalDate),0) As IllogicalDate, \
    coalesce(SUM(illogicalPhone),0) AS IllogicalPhone,\
    coalesce(SUM(illogicalOther),0) AS IllogicalOther,\
    coalesce(SUM(duplicatedPhone),0) As DuplicatedPhone, \
    coalesce(SUM(duplicatedPhoneBetweenS1AndS2),0) As DuplicatedPhoneBetweenS1AndS2, \
    coalesce(SUM(duplicatedPhoneS1),0) AS DuplicatedPhoneS1,\
    coalesce(SUM(duplicatedPhoneS2),0) AS DuplicatedPhoneS2 FROM customers'

    let whereCondition = '';
    let joinTable = '';
    let params = {};

    if (filterType === 'Key Urban' || filterType === 'Urban' || filterType === 'Rural') {
      joinTable = 'JOIN hospitals ON customers.hospital_id = hospitals.hospital_id \
        JOIN provinces ON hospitals.province_id = provinces.province_id \
        JOIN areas ON provinces.area_id = areas.area_id';
      whereCondition = 'WHERE areas.channel = $channel';
      params = {
        $channel: filterType
      }
    } else if (filterType === 'S1' || filterType === 'S2'){
      whereCondition = 'WHERE customers.sampling = $sampling';
      params = {
        $sampling: filterType
      }
    } else if (filterType.areaId !== undefined && filterType.areaId !== null) {
      joinTable = 'JOIN hospitals ON customers.hospital_id = hospitals.hospital_id \
        JOIN provinces ON hospitals.province_id = provinces.province_id';
      whereCondition = 'WHERE provinces.area_id = $areaId'
      params = {
        $areaId: filterType.areaId
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
    worksheet.getColumn('R').width = 30;

    worksheet.getColumn('S').width = 30;
    worksheet.getColumn('T').width = 30;
    // A1

    worksheet.getCell('B1').value = 'HUGGIES CALL CENTER 2017 PROJECT';

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
    buildReportFirstColumnType3(worksheet, 6, 'Raw data received from K-C');
    buildReportFirstColumnType3(worksheet, 20, 'Valid database (value) - base all');

    // A7, A12, A16, A21
    buildReportFirstColumnType2(worksheet, 7, 'Data missing');
    buildReportFirstColumnType2(worksheet, 12, 'Duplicated Data (Checking vs. total database since 1st week)');
    buildReportFirstColumnType2(worksheet, 16, 'Illogical data');
    buildReportFirstColumnType2(worksheet, 21, 'Email missing');

    // A8 - A11, A13 - A15, A17-A19
    buildReportFirstColumnType1(worksheet, 8, "Mom's name");
    buildReportFirstColumnType1(worksheet, 9, "Address (District, Province, City)");
    buildReportFirstColumnType1(worksheet, 10, "Telephone number");
    buildReportFirstColumnType1(worksheet, 11, "Date of pregnancy/Baby Delivery");
    buildReportFirstColumnType1(worksheet, 13, "% duplication between S1 and S2");
    buildReportFirstColumnType1(worksheet, 14, "% duplication within S1");
    buildReportFirstColumnType1(worksheet, 15, "% duplication within S2");
    buildReportFirstColumnType1(worksheet, 17, "Illogical phone number");
    buildReportFirstColumnType1(worksheet, 18, "Illogical Date of pregnancy/Baby Delivery");
    buildReportFirstColumnType1(worksheet, 19, "Illogical Other");

    // Done 1st Col

    // Row 4 - D4, K4, P4, S4
    buildReportRow4(worksheet, 'D', 'D4:J4', 'KEY URBAN');
    buildReportRow4(worksheet, 'K', 'K4:O4', 'URBAN');
    buildReportRow4(worksheet, 'P', 'P4:R4', 'RURAL');
    buildReportRow4(worksheet, 'S', 'S4:T4', 'SAMPLING');

    // // Row 5, B4-T4
    buildReportRow5(worksheet, 'B', 'Total Project');
    buildReportRow5(worksheet, 'C', 'Total ' + batch);
    buildReportRow5(worksheet, 'D', 'Total Key Urban');
    buildReportRow5(worksheet, 'E', 'HCM');
    buildReportRow5(worksheet, 'F', 'Hà Nội');
    buildReportRow5(worksheet, 'G', 'Đà Nẵng');
    buildReportRow5(worksheet, 'H', 'Cần  Thơ');
    buildReportRow5(worksheet, 'I', 'Khánh Hòa');
    buildReportRow5(worksheet, 'J', 'Hải Phòng');
    buildReportRow5(worksheet, 'K', 'Total Urban');
    buildReportRow5(worksheet, 'L', 'Miền Bắc');
    buildReportRow5(worksheet, 'M', 'Miền Trung');
    buildReportRow5(worksheet, 'N', 'Miền Đông');
    buildReportRow5(worksheet, 'O', 'Miền Tây');
    buildReportRow5(worksheet, 'P', 'Total Rural');
    buildReportRow5(worksheet, 'Q', 'Miền Bắc');
    buildReportRow5(worksheet, 'R', 'Miền Trung');
    buildReportRow5(worksheet, 'S', 'Pregnant Mom');
    buildReportRow5(worksheet, 'T', 'New Mom');

    // Data
    let colArr = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
    let rowArr = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

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

  if (rowIndex === 21) {
    row.getCell('A').font = {
      bold: true, size: 14, name: 'Calibri', family: 2
    }
  } else {
    row.getCell('A').font = {
      bold: true, size: 14, name: 'Calibri', family: 2,
      color: { theme: 0 }
    }
  }

  row.getCell('A').alignment = { vertical: 'middle' };

  if (rowIndex !== 21) {
    row.getCell('A').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF00B0F0' },
      bgColor: { indexed: 64 }
    };
  }

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

  if (rowIndex == 6 || rowIndex == 7 || rowIndex == 12 || rowIndex == 16 || rowIndex == 20 || rowIndex == 21) {
    bold = true;
  }

  if (rowIndex == 7 || rowIndex == 12 || rowIndex == 16) {
    row.getCell(cellIndex).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF00B0F0' },
      bgColor: { indexed: 64 }
    };
  }

  if (rowIndex == 20) {
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

  if (rowIndex == 7 || rowIndex == 12 || rowIndex == 16 || rowIndex == 20) {
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
