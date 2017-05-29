import { db } from '../db/prepare_data.js';
const _  = require('lodash');
const Excel = require('exceljs');

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
        return fillData(batch, { areaId: 10 });
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'N');
      }).then(() => {
        return fillData(batch, { areaId: 9 });
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

      row = worksheet.getRow(5);
      row.getCell(cellIndex).value = rowData.TotalBase;

      row = worksheet.getRow(6);
      row.getCell(cellIndex).value = rowData.MissingData;

      row = worksheet.getRow(7);
      row.getCell(cellIndex).value = rowData.MissingMomName;

      row = worksheet.getRow(8);
      row.getCell(cellIndex).value = rowData.MissingAddress;

      row = worksheet.getRow(9);
      row.getCell(cellIndex).value = rowData.MissingPhone;

      row = worksheet.getRow(10);
      row.getCell(cellIndex).value = rowData.MissngEmail;

      row = worksheet.getRow(11);
      row.getCell(cellIndex).value = rowData.MissingBabyInformation;

      row = worksheet.getRow(12);
      row.getCell(cellIndex).value = rowData.MissingMomStatus;

      row = worksheet.getRow(13);
      row.getCell(cellIndex).value = rowData.DuplicatedPhone;

      row = worksheet.getRow(14);
      row.getCell(cellIndex).value = rowData.DuplicatedPhone;

      row = worksheet.getRow(15);
      row.getCell(cellIndex).value = rowData.DuplicatedPhoneS1;

      row = worksheet.getRow(16);
      row.getCell(cellIndex).value = rowData.DuplicatedPhoneS2;

      row = worksheet.getRow(17);
      row.getCell(cellIndex).value = rowData.IllogicalData;

      row = worksheet.getRow(18);
      row.getCell(cellIndex).value = rowData.IllogicalPhone;

      row = worksheet.getRow(19);
      row.getCell(cellIndex).value = rowData.TotalBase - rowData.HasError;

      row = worksheet.getRow(20);
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
    coalesce(SUM(missingPhone),0) AS MissingPhone, coalesce(SUM(missingEmail),0) AS MissngEmail,\
    coalesce(SUM(missingBabyInformation),0) As MissingBabyInformation, coalesce(SUM(missingMomStatus),0) AS MissingMomStatus,\
    coalesce(SUM(illogicalData),0) As IllogicalData, coalesce(SUM(illogicalPhone),0) AS IllogicalPhone,\
    coalesce(SUM(duplicatedPhone),0) As DuplicatedPhone, coalesce(SUM(duplicatedPhoneS1),0) AS DuplicatedPhoneS1,\
    coalesce(SUM(duplicatedPhoneS2),0) AS DuplicatedPhoneS2 FROM customers'

    let whereCondition = '';
    let joinTable = '';
    let params = {};

    if (filterType === 'ByBatch') {
      whereCondition = 'WHERE customers.batch = $batch';
      params = {
        $batch: batch
      }
    } else if (filterType === 'Key Urban' || filterType === 'Urban' || filterType === 'Rural') {
      joinTable = 'JOIN hospitals ON customers.hospital_id = hospitals.hospital_id \
        JOIN provinces ON hospitals.province_id = provinces.province_id \
        JOIN areas ON provinces.area_id = areas.area_id';
      whereCondition = 'WHERE customers.batch = $batch AND areas.channel = $channel';
      params = {
        $batch: batch,
        $channel: filterType
      }
    } else if (filterType.areaId !== undefined && filterType.areaId !== null) {
      joinTable = 'JOIN hospitals ON customers.hospital_id = hospitals.hospital_id \
        JOIN provinces ON hospitals.province_id = provinces.province_id';
      whereCondition = 'WHERE customers.batch = $batch AND provinces.area_id = $areaId'
      params = {
        $batch: batch,
        $areaId: filterType.areaId
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
    let reportFilePath = outputDirectory + '/report.xlsx';

    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Abs', {});

    worksheet.getColumn('A').width = 80;
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
    // A1

    worksheet.getCell('A1').value = 'HUGGIES CALL CENTER 2017 PROJECT';

    worksheet.getCell('A1').font = {
      bold: true, size: 26, name: 'Calibri', family: 2,
      color: { argb: 'FFFF0000' }
    }

    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    // A2

    worksheet.getCell('A2').font = {
      bold: true, size: 14, name: 'Calibri', family: 2,
      color: { argb: 'FFFF0000' }
    }

    worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getCell('A2').value = 'Step 1: Database Clean';

    // A4
    worksheet.getCell('A4').border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
      top: { style: 'thin' },
      bottom: { style: 'thin' }
    }

    worksheet.getCell('A4').font = {
      bold: true, size: 14, name: 'Calibri', family: 2
    }

    worksheet.getCell('A4').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getCell('A4').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFABF8F' },
      bgColor: { indexed: 64 }
    };

    worksheet.getCell('A4').value = batch;

    // A5, A19
    buildReportFirstColumnType3(worksheet, 5, 'Raw data received from K-C');
    buildReportFirstColumnType3(worksheet, 19, 'Valid database (value) - base all');


    // A6, A13, A17, A20
    buildReportFirstColumnType2(worksheet, 6, 'Data missing');
    buildReportFirstColumnType2(worksheet, 13, 'Duplicated Data (Checking vs. total database since 1st week)');
    buildReportFirstColumnType2(worksheet, 17, 'Illogical data');
    buildReportFirstColumnType2(worksheet, 20, 'Email missing');

    // A7 - A12, A14 - A16, A18
    buildReportFirstColumnType1(worksheet, 7, "Mom's name");
    buildReportFirstColumnType1(worksheet, 8, "Address (District, Province, City)");
    buildReportFirstColumnType1(worksheet, 9, "Telephone number");
    buildReportFirstColumnType1(worksheet, 10, "Email address");
    buildReportFirstColumnType1(worksheet, 11, "Baby information (name, gender)");
    buildReportFirstColumnType1(worksheet, 12, "Mom's status (Pregnant/ Delivered, Date of pregnancy/ Baby Delivery)");
    buildReportFirstColumnType1(worksheet, 14, "% duplication between S1 and S2");
    buildReportFirstColumnType1(worksheet, 15, "% duplication within S1");
    buildReportFirstColumnType1(worksheet, 16, "% duplication within S2");
    buildReportFirstColumnType1(worksheet, 18, "Illogical phone number");

    // Done 1st Col

    // Row 3 - D3, K3, P3
    buildReportRow3(worksheet, 'D', 'D3:J3', 'KEY URBAN');
    buildReportRow3(worksheet, 'K', 'K3:O3', 'URBAN');
    buildReportRow3(worksheet, 'P', 'P3:R3', 'Rural');

    // Row 4, B4-R4
    buildReportRow4(worksheet, 'B', 'Total Project');
    buildReportRow4(worksheet, 'C', 'Total ' + batch);
    buildReportRow4(worksheet, 'D', 'Total Key Urban');
    buildReportRow4(worksheet, 'E', 'HCM');
    buildReportRow4(worksheet, 'F', 'Hà Nội');
    buildReportRow4(worksheet, 'G', 'Đà Nẵng');
    buildReportRow4(worksheet, 'H', 'Cần  Thơ');
    buildReportRow4(worksheet, 'I', 'Khánh Hòa');
    buildReportRow4(worksheet, 'J', 'Hải Phòng');
    buildReportRow4(worksheet, 'K', 'Total Urban');
    buildReportRow4(worksheet, 'L', 'Miền Bắc');
    buildReportRow4(worksheet, 'M', 'Miền Trung');
    buildReportRow4(worksheet, 'N', 'Miền Tây');
    buildReportRow4(worksheet, 'O', 'Miền Đông');
    buildReportRow4(worksheet, 'P', 'Total Rural');
    buildReportRow4(worksheet, 'Q', 'Miền Bắc');
    buildReportRow4(worksheet, 'R', 'Miền Trung');

    // Data
    let colArr = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];
    let rowArr = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

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

function buildReportRow4(worksheet, cellIndex, text) {
  let row = worksheet.getRow(4);
  let fgColor = { theme: 0, tint: -0.1499984740745262 };

  if (cellIndex == 'B' || cellIndex == 'C') {
    fgColor = { argb: 'FFFABF8F' };
  }

  if (cellIndex == 'D' || cellIndex == 'K' || cellIndex == 'P') {
    fgColor = { theme: 9, tint: 0.5999938962981048 }
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

function buildReportRow3(worksheet, cellIndex, mergeRange, text) {
  let row = worksheet.getRow(3);

  row.getCell(cellIndex).border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: { style: 'thin' },
    bottom: { style: 'thin' }
  }

  row.getCell(cellIndex).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF00' },
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

  row.getCell('A').font = {
    bold: true, size: 14, name: 'Calibri', family: 2,
    color: { argb: 'FFFF0000' }
  }

  row.getCell('A').alignment = { vertical: 'middle' };

  row.getCell('A').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { theme: 9, tint: 0.5999938962981048 },
    bgColor: { indexed: 64 }
  };

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
  }

  row.getCell('A').alignment = { vertical: 'middle' };

  row.getCell('A').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { theme: 9, tint: 0.5999938962981048 },
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
    size: 14, name: 'Calibri', family: 2,
  }

  row.getCell('A').alignment = { horizontal: 'right', vertical: 'middle' };

  row.getCell('A').value = text;
}

function buildDataRow(worksheet, rowIndex, cellIndex) {
  let row = worksheet.getRow(rowIndex);
  let bold = false;
  let color = { argb: 'FF000000' };

  if (rowIndex == 5 || rowIndex == 6 || rowIndex == 13 ||
    rowIndex == 17 || rowIndex == 19 || rowIndex == 20
  ) {
    bold = true;
    row.getCell(cellIndex).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { theme: 9, tint: 0.5999938962981048 },
      bgColor: { indexed: 64 }
    };
  }

  if (rowIndex == 5 || rowIndex == 19) {
    color = { argb: 'FFFF0000' };
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
//   let originalTemplatePath = '/Users/viphat/projects/dct/report-template.xlsx'
//   let workbook = new Excel.Workbook();
//   workbook.xlsx.readFile(originalTemplatePath).then(()=>{
//     let worksheet = workbook.getWorksheet('Abs');
//   });
// }
