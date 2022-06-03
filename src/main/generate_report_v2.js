import { db } from '../db/prepare_data.js';
const _  = require('lodash');
const Excel = require('exceljs');
const fs = require('fs');

const logoPath = './app/vendor/logo.png';

export const generateReport = (batch, source, outputDirectory) => {
  return new Promise((resolve, reject) => {
    generateReportTemplate(batch, source, outputDirectory).then((reportFilePath) => {
      fillData(batch, source, 'All').then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'B');
      }).then(() => {
        return fillData(batch, source, 'ByBatch');
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'C');
      }).then(() => {
        return fillData(batch, source, 'Key Urban 1');
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'D');
      }).then(() => {
        return fillData(batch, source, { areaId: 1 }); // Hồ Chí Minh
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'E');
      }).then(() => {
        return fillData(batch, source, { areaId: 2 }); // Hà Nội
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'F');
      }).then(() => {
        return fillData(batch, source, { areaId: 6 }); // Hải Phòng
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'G');
      }).then(() => {
        return fillData(batch, source, 'Key Urban 2');
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'H');
      }).then(() => {
        return fillData(batch, source, { areaId: 3 }); // Đà Nẵng
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'I');
      }).then(() => {
        return fillData(batch, source, { areaId: 4 }); // Cần Thơ
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'J');
      }).then(() => {
        return fillData(batch, source, 'Urban');
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'K');
      }).then(() => {
        return fillData(batch, source, { provinceId: 7 }); // Nghệ An
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'L');
      }).then(() => {
        return fillData(batch, source, { provinceId: 9 }); // Thái Nguyên
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'M');
      }).then(() => {
        return fillData(batch, source, { provinceId: 23 }); // Bình Dương
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'N');
      }).then(() => {
        return fillData(batch, source, { provinceId: 21 }); // Bình Định
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'O');
      }).then(() => {
        return fillData(batch, source, { provinceId: 17 }); // Bắc Ninh
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'P');
      }).then(() => {
        return fillData(batch, source, { provinceId: 14 }); // Hưng Yên
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'Q');
      }).then(() => {
        return fillData(batch, source, { provinceId: 27 }); // Bến Tre
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'R');
      }).then(() => {
        return fillData(batch, source, { provinceId: 46 }); // Bạc Liêu
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'S');
      }).then(() => {
        return fillData(batch, source, { provinceId: 47 }); // Kiên Giang
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'T');
      }).then(() => {
        return fillData(batch, source, { provinceId: 31 }); // Vĩnh Long
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'U');
      }).then(() => {
        return fillData(batch, source, { provinceId: 24 }); // Đồng Nai
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'V');
      }).then(() => {
        return fillData(batch, source, { provinceId: 18 }); // Thừa Thiên Huế
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'W');
      }).then(() => {
        return fillData(batch, source, { provinceId: 20 }); // Đắk Lắk
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'X');
      }).then(() => {
        return fillData(batch, source, { provinceId: 11 }); // Hải Dương
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'Y');
      }).then(() => {
        return fillData(batch, source, { provinceId: 15 }); // Ninh Bình
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'Z');
      }).then(() => {
        return fillData(batch, source, { provinceId: 19 }); // Quảng Ngãi
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'AA');
      }).then(() => {
        return fillData(batch, source, { provinceId: 48 }); // Sóc Trăng
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'AB');
      }).then(() => {
        return fillData(batch, source, { provinceId: 29 }); // Trà Vinh
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'AC');
      }).then(() => {
        return fillData(batch, source, { provinceId: 16 }); // Vĩnh Phúc
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'AD');
      }).then(() => {
        return fillData(batch, source, { provinceId: 13 }); // Thái Bình
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'AE');
      }).then(() => {
        return fillData(batch, source, 'S1');
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'AF');
      }).then(() => {
        return fillData(batch, source, 'S2');
      }).then((rowData) => {
        return writeToTemplate(reportFilePath, rowData, 'AG');
      }).then(() => {
        return generateSheetValidDatabase(batch, source, reportFilePath);
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
      row.getCell(cellIndex).value = rowData.DuplicatedWithSameYear;

      row = worksheet.getRow(17);
      row.getCell(cellIndex).value = rowData.DuplicatedWith2021;

      row = worksheet.getRow(18);
      row.getCell(cellIndex).value = rowData.DuplicatedWith2020;

      row = worksheet.getRow(19);
      row.getCell(cellIndex).value = rowData.DuplicatedWith2019;

      row = worksheet.getRow(20);
      row.getCell(cellIndex).value = rowData.IllogicalData;

      row = worksheet.getRow(21);
      row.getCell(cellIndex).value = rowData.IllogicalPhone;

      row = worksheet.getRow(22);
      row.getCell(cellIndex).value = rowData.IllogicalDate;

      row = worksheet.getRow(23);
      row.getCell(cellIndex).value = rowData.IllogicalOther;

      row = worksheet.getRow(24);
      row.getCell(cellIndex).value = rowData.TotalBase - rowData.HasError;

      row = worksheet.getRow(25);
      row.getCell(cellIndex).value = rowData.MissingEmail;

      resolve(workbook.xlsx.writeFile(reportFilePath));
    });
  });
}

function fillData(batch, source, filterType) {
  return new Promise((resolve, reject) => {
    let baseQuery = 'SELECT COUNT(*) AS TotalBase, coalesce(SUM(hasError),0) AS HasError,\
    coalesce(SUM(missingData),0) AS MissingData,\
    coalesce(SUM(missingMomName),0) AS MissingMomName,\
    coalesce(SUM(missingAddress),0) AS MissingAddress,\
    coalesce(SUM(missingPhone),0) AS MissingPhone, \
    coalesce(SUM(missingEmail),0) AS MissingEmail, \
    coalesce(SUM(missingDate),0) As MissingDate, \
    coalesce(SUM(missingMomStatus),0) AS MissingMomStatus, \
    coalesce(SUM(illogicalData),0) As IllogicalData, \
    coalesce(SUM(illogicalDate),0) As IllogicalDate, \
    coalesce(SUM(illogicalPhone),0) AS IllogicalPhone,\
    coalesce(SUM(illogicalOther),0) AS IllogicalOther,\
    coalesce(SUM(duplicatedPhone),0) As DuplicatedPhone, \
    coalesce(SUM(duplicatedPhoneBetweenS1AndS2),0) As DuplicatedPhoneBetweenS1AndS2, \
    coalesce(SUM(duplicatedPhoneS1),0) AS DuplicatedPhoneS1,\
    coalesce(SUM(duplicatedPhoneS2),0) AS DuplicatedPhoneS2,\
    coalesce(SUM(duplicatedWithSameYear),0) AS DuplicatedWithSameYear,\
    coalesce(SUM(duplicatedWith2021),0) AS DuplicatedWith2021,\
    coalesce(SUM(duplicatedWith2020),0) AS DuplicatedWith2020,\
    coalesce(SUM(duplicatedWith2019),0) AS DuplicatedWith2019\ FROM customers'

    let whereCondition = '';
    let joinTable = '';
    let params = {};

    if (filterType === 'Key Urban 1' || filterType === 'Key Urban 2' || filterType === 'Urban') {
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
    } else if (filterType.provinceId !== undefined && filterType.provinceId !== null) {
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

    if (source == 'IMC' || source == 'OTB' || source == 'OTB-LHTS') {
      params = _.merge(params, {
        $source: source
      });
      if (whereCondition === '') {
        whereCondition = 'WHERE customers.source = $source'
      } else {
        whereCondition += " AND customers.source = $source";
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

function fillDataForSheetValidDatabase(batch, source, filterType) {
  return new Promise((resolve, reject) => {
    let baseQuery = 'SELECT COUNT(*) AS TotalBase,\
      coalesce(SUM(hasError),0) AS HasError,\
      coalesce(SUM(duplicatedWithAnotherAgency),0) AS duplicatedCount\
      FROM customers WHERE customers.source = $source';

    let whereCondition = '';
    let params = { $source: source };

    if (batch !== '' && filterType !== 'All') {
      params = _.merge(params, {
        $batch: batch
      });

      whereCondition += " AND customers.batch = $batch";
    }

    db.get(baseQuery + ' ' + whereCondition, params, (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
}

function generateSheetValidDatabase(batch, source, reportFilePath) {
  let workbook = new Excel.Workbook();

  workbook.xlsx.readFile(reportFilePath).then((response) => {
    let worksheet = workbook.addWorksheet('Valid Database for QC Calls', {});

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

    worksheet.getCell('B1').value = 'HUGGIES CALL CENTER 2022 PROJECT';

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

    worksheet.getCell('B2').value = 'Step 1: Database Clean - Summary Report';

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

    buildReportFirstColumnType3(worksheet, 6, 'Valid data received from ' + source);

    buildReportFirstColumnType1(worksheet, 7, 'Total duplication removed with other Agency');

    buildReportFirstColumnType1(worksheet, 8, 'Removed from IMC');

    buildReportFirstColumnType1(worksheet, 9, 'Removed from OTB');

    buildReportFirstColumnType1(worksheet, 10, 'Removed from OTB-LHTS');

    buildReportFirstColumnType2(worksheet, 11, 'Valid database for QC Calls ' + source);

    // Total
    fillDataForSheetValidDatabase(batch, source, 'All').then((rowData) => {
      worksheet.getCell('B5').value = 'Total';

      worksheet.getCell('B5').border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      worksheet.getCell('B5').alignment = { horizontal: 'center', vertical: 'middle' };

      worksheet.getCell('B5').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFABF8F' },
        bgColor: { indexed: 64 }
      };

      worksheet.getCell('B6').value = rowData.TotalBase - rowData.HasError;

      worksheet.getCell('B6').alignment = { vertical: 'middle' };

      worksheet.getCell('B6').font = {
        bold: true, size: 14, name: 'Calibri', family: 2,
        color: { argb: 'FFFF0000' }
      };

      worksheet.getCell('B6').border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      worksheet.getCell('B7').value = rowData.duplicatedCount;

      worksheet.getCell('B7').border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      worksheet.getCell('B7').font = {
        size: 14, name: 'Calibri', family: 2
      };

      worksheet.getCell('B7').alignment = { horizontal: 'right', vertical: 'middle' };

      if (source == 'IMC') {
        worksheet.getCell('B8').value = rowData.duplicatedCount;
      } else {
        worksheet.getCell('B8').value = 0;
      }

      worksheet.getCell('B8').border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      worksheet.getCell('B8').font = {
        size: 14, name: 'Calibri', family: 2
      }

      worksheet.getCell('B8').alignment = { horizontal: 'right', vertical: 'middle' };

      if (source == 'OTB') {
        worksheet.getCell('B9').value = rowData.duplicatedCount;
      } else {
        worksheet.getCell('B9').value = 0;
      }

      worksheet.getCell('B9').border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      worksheet.getCell('B9').font = {
        size: 14, name: 'Calibri', family: 2
      }

      worksheet.getCell('B9').alignment = { horizontal: 'right', vertical: 'middle' };

      if (source == 'OTB-LHTS') {
        worksheet.getCell('B10').value = rowData.duplicatedCount;
      } else {
        worksheet.getCell('B10').value = 0;
      }

      worksheet.getCell('B10').border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      worksheet.getCell('B10').font = {
        size: 14, name: 'Calibri', family: 2
      }

      worksheet.getCell('B10').alignment = { horizontal: 'right', vertical: 'middle' };

      worksheet.getCell('B11').value = rowData.TotalBase - rowData.HasError - rowData.duplicatedCount;

      worksheet.getCell('B11').border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      worksheet.getCell('B11').font = {
        bold: true, size: 14, name: 'Calibri', family: 2,
        color: { theme: 0 }
      };

      worksheet.getCell('B11').alignment = { vertical: 'middle' };

      worksheet.getCell('B11').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF00B0F0' },
        bgColor: { indexed: 64 }
      };

      fillDataForSheetValidDatabase(batch, source, 'ByBatch').then((rowData) => {

        worksheet.getCell('C5').value = batch;

        worksheet.getCell('C5').border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
          top: { style: 'thin' },
          bottom: { style: 'thin' }
        };

        worksheet.getCell('C5').alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.getCell('C5').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFABF8F' },
          bgColor: { indexed: 64 }
        };

        worksheet.getCell('C6').value = rowData.TotalBase - rowData.HasError;

        worksheet.getCell('C6').alignment = { vertical: 'middle' };

        worksheet.getCell('C6').font = {
          bold: true, size: 14, name: 'Calibri', family: 2,
          color: { argb: 'FFFF0000' }
        };

        worksheet.getCell('C6').border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
          top: { style: 'thin' },
          bottom: { style: 'thin' }
        };

        worksheet.getCell('C7').value = rowData.duplicatedCount;

        worksheet.getCell('C7').border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
          top: { style: 'thin' },
          bottom: { style: 'thin' }
        };

        worksheet.getCell('C7').font = {
          size: 14, name: 'Calibri', family: 2
        };

        worksheet.getCell('C7').alignment = { horizontal: 'right', vertical: 'middle' };

        if (source == 'IMC') {
          worksheet.getCell('C8').value = rowData.duplicatedCount;
        } else {
          worksheet.getCell('C8').value = 0;
        }

        worksheet.getCell('C8').border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
          top: { style: 'thin' },
          bottom: { style: 'thin' }
        };

        worksheet.getCell('C8').font = {
          size: 14, name: 'Calibri', family: 2
        }

        worksheet.getCell('C8').alignment = { horizontal: 'right', vertical: 'middle' };

        if (source == 'OTB') {
          worksheet.getCell('C9').value = rowData.duplicatedCount;
        } else {
          worksheet.getCell('C9').value = 0;
        }

        worksheet.getCell('C9').border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
          top: { style: 'thin' },
          bottom: { style: 'thin' }
        };

        worksheet.getCell('C9').font = {
          size: 14, name: 'Calibri', family: 2
        }

        worksheet.getCell('C9').alignment = { horizontal: 'right', vertical: 'middle' };

        if (source == 'OTB-LHTS') {
          worksheet.getCell('C10').value = rowData.duplicatedCount;
        } else {
          worksheet.getCell('C10').value = 0;
        }

        worksheet.getCell('C10').border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
          top: { style: 'thin' },
          bottom: { style: 'thin' }
        };

        worksheet.getCell('C10').font = {
          size: 14, name: 'Calibri', family: 2
        }

        worksheet.getCell('C10').alignment = { horizontal: 'right', vertical: 'middle' };

        worksheet.getCell('C11').value = rowData.TotalBase - rowData.HasError -rowData.duplicatedCount;

        worksheet.getCell('C11').border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
          top: { style: 'thin' },
          bottom: { style: 'thin' }
        };

        worksheet.getCell('C11').font = {
          bold: true, size: 14, name: 'Calibri', family: 2,
          color: { theme: 0 }
        };

        worksheet.getCell('C11').alignment = { vertical: 'middle' };

        worksheet.getCell('C11').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF00B0F0' },
          bgColor: { indexed: 64 }
        };

        workbook.xlsx.writeFile(reportFilePath);
      });
    });
  });
}

export const generateReportTemplate = (batch, source, outputDirectory) => {
  return new Promise((resolve, reject) => {

    let dir = outputDirectory + '/' + batch;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    let reportFilePath = dir + '/report_' + source + '.xlsx';

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
    worksheet.getColumn('U').width = 30;
    worksheet.getColumn('V').width = 30;
    worksheet.getColumn('W').width = 30;
    worksheet.getColumn('X').width = 30;
    worksheet.getColumn('Y').width = 30;
    worksheet.getColumn('Z').width = 30;
    worksheet.getColumn('AA').width = 30;
    worksheet.getColumn('AB').width = 30;
    worksheet.getColumn('AC').width = 30;
    worksheet.getColumn('AD').width = 30;
    worksheet.getColumn('AE').width = 30;
    worksheet.getColumn('AF').width = 30;
    worksheet.getColumn('AG').width = 30;
    // A1

    worksheet.getCell('B1').value = 'HUGGIES CALL CENTER 2022 PROJECT';

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

    worksheet.getCell('B2').value = 'Step 1: Database Clean - Summary Report';

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
    buildReportFirstColumnType3(worksheet, 6, 'Raw data received from ' + source);
    buildReportFirstColumnType3(worksheet, 24, 'Valid database (value) - base all');

    // A7, A12, A16, A21
    buildReportFirstColumnType2(worksheet, 7, 'Data missing');
    buildReportFirstColumnType2(worksheet, 12, 'Duplicated Data (Checking vs. total database since 1st week)');
    buildReportFirstColumnType2(worksheet, 20, 'Illogical data');
    buildReportFirstColumnType2(worksheet, 25, 'Email missing');

    // A8 - A11, A13 - A15, A17-A19
    buildReportFirstColumnType1(worksheet, 8, "Mom's name");
    buildReportFirstColumnType1(worksheet, 9, "Address (District, Province, City)");
    buildReportFirstColumnType1(worksheet, 10, "Telephone number");
    buildReportFirstColumnType1(worksheet, 11, "Date of pregnancy/Baby Delivery");
    buildReportFirstColumnType1(worksheet, 13, "% duplication between S1 and S2");
    buildReportFirstColumnType1(worksheet, 14, "% duplication within S1");
    buildReportFirstColumnType1(worksheet, 15, "% duplication within S2");

    buildReportFirstColumnType1(worksheet, 16, "Duplication within same year (2022)");
    buildReportFirstColumnType1(worksheet, 17, "Duplication with 2021 data");
    buildReportFirstColumnType1(worksheet, 18, "Duplication with 2020 data");
    buildReportFirstColumnType1(worksheet, 19, "Duplication with 2019 data");

    buildReportFirstColumnType1(worksheet, 21, "Illogical phone number");
    buildReportFirstColumnType1(worksheet, 22, "Illogical Date of pregnancy/Baby Delivery");
    buildReportFirstColumnType1(worksheet, 23, "Illogical Other");

    // Done 1st Col

    // Row 4 - D4, K4, P4, S4
    buildReportRow4(worksheet, 'D', 'D4:G4', 'KEY URBAN 1');
    buildReportRow4(worksheet, 'H', 'H4:J4', 'KEY URBAN 2');
    buildReportRow4(worksheet, 'K', 'K4:AE4', 'URBAN');
    buildReportRow4(worksheet, 'AF', 'AF4:AG4', 'SAMPLING');

    // // Row 5, B4-T4
    buildReportRow5(worksheet, 'B', 'Total Project');
    buildReportRow5(worksheet, 'C', 'Total ' + batch);
    buildReportRow5(worksheet, 'D', 'Total Key Urban 1');
    buildReportRow5(worksheet, 'E', 'HCM');
    buildReportRow5(worksheet, 'F', 'Hà Nội');
    buildReportRow5(worksheet, 'G', 'Hải Phòng');
    buildReportRow5(worksheet, 'H', 'Total Key Urban 2');
    buildReportRow5(worksheet, 'I', 'Đà Nẵng');
    buildReportRow5(worksheet, 'J', 'Cần Thơ');
    buildReportRow5(worksheet, 'K', 'Total Urban');
    buildReportRow5(worksheet, 'L', 'Nghệ An');
    buildReportRow5(worksheet, 'M', 'Thái Nguyên');
    buildReportRow5(worksheet, 'N', 'Bình Dương');
    buildReportRow5(worksheet, 'O', 'Bình Định');
    buildReportRow5(worksheet, 'P', 'Bắc Ninh');
    buildReportRow5(worksheet, 'Q', 'Hưng Yên');
    buildReportRow5(worksheet, 'R', 'Bến Tre');
    buildReportRow5(worksheet, 'S', 'Bạc Liêu');
    buildReportRow5(worksheet, 'T', 'Kiên Giang');
    buildReportRow5(worksheet, 'U', 'Vĩnh Long');
    buildReportRow5(worksheet, 'V', 'Đồng Nai');
    buildReportRow5(worksheet, 'W', 'Thừa Thiên Huế');
    buildReportRow5(worksheet, 'X', 'Đắk Lắk');
    buildReportRow5(worksheet, 'Y', 'Hải Dương');
    buildReportRow5(worksheet, 'Z', 'Ninh Bình');
    buildReportRow5(worksheet, 'AA', 'Quảng Ngãi');
    buildReportRow5(worksheet, 'AB', 'Sóc Trăng');
    buildReportRow5(worksheet, 'AC', 'Trà Vinh');
    buildReportRow5(worksheet, 'AD', 'Vĩnh Phúc');
    buildReportRow5(worksheet, 'AE', 'Thái Bình');
    buildReportRow5(worksheet, 'AF', 'Pregnant Mom');
    buildReportRow5(worksheet, 'AG', 'New Mom');

    // Data
    let colArr = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG'];

    let rowArr = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

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

  if (cellIndex == 'D' || cellIndex == 'E' || cellIndex == 'F' || cellIndex == 'G') {
    fgColor = { argb: 'FFFFFF00' };
  }

  if (cellIndex == 'H' || cellIndex == 'I' || cellIndex == 'J') {
    fgColor = { theme: 6, tint: 0.3999755851924192 };
  }

  if (cellIndex == 'K' || cellIndex == 'L' || cellIndex == 'M' || cellIndex == 'N' || cellIndex == 'O' || cellIndex == 'P' || cellIndex == 'Q' || cellIndex == 'R' || cellIndex == 'S' || cellIndex == 'T' || cellIndex == 'U' || cellIndex == 'V' || cellIndex == 'W' || cellIndex == 'X' || cellIndex == 'Y' || cellIndex == 'Z' || cellIndex == 'AA' || cellIndex == 'AB' || cellIndex == 'AC' || cellIndex == 'AD' || cellIndex == 'AE') {
    fgColor = { theme: 9, tint: 0.3999755851924192 };
  }

  if (cellIndex == 'AF' || cellIndex == 'AG') {
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
    case 'H':
      fgColor = { theme: 6, tint: 0.3999755851924192 };
      break;
    case 'K':
      fgColor = { theme: 9, tint: 0.3999755851924192 };
      break;
    case 'AF':
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

  if (rowIndex == 24) {
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

  if (rowIndex == 24) {
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

  if (rowIndex === 25) {
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

  if (rowIndex !== 25) {
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

  if (rowIndex == 6 || rowIndex == 7 || rowIndex == 12 || rowIndex == 20 || rowIndex == 24 || rowIndex == 25) {
    bold = true;
  }

  if (rowIndex == 7 || rowIndex == 12 || rowIndex == 20) {
    row.getCell(cellIndex).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF00B0F0' },
      bgColor: { indexed: 64 }
    };
  }

  if (rowIndex == 24) {
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

  if (rowIndex == 7 || rowIndex == 12 || rowIndex == 20 || rowIndex == 24) {
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
