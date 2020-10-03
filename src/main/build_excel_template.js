const _  = require('lodash');
const Excel = require('exceljs');
const fs = require('fs');

const valid_title = 'DATA CLEANING RESULT - VALID LIST';
const invalid_title = 'DATA CLEANING RESULT - INVALID LIST';
const duplication_title = 'DATA CLEANING RESULT - DUPLICATION LIST';
const logoPath = './app/vendor/logo.png';

export const buildTemplate = (outputPath) => {
  let workbook = new Excel.Workbook();

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputPath)) {
      return resolve(writeTemplate(outputPath, workbook));
    } else {
      workbook.xlsx.readFile(outputPath).then(() => {
        let sheetName = 'Valid';
        let worksheet = workbook.getWorksheet(sheetName);
        if (worksheet === undefined) {
          return resolve(writeTemplate(outputPath, workbook));
        }
        resolve(workbook);
      });
    }
  });
}

function writeTemplate(outputPath, workbook) {
  return new Promise((resolve, reject) => {
    let sheetName = 'Valid';
    let worksheet = workbook.addWorksheet(sheetName, {});
    writeBaseTemplate(workbook, worksheet, valid_title);
    sheetName = 'Invalid';
    worksheet = workbook.addWorksheet(sheetName, {});
    writeBaseTemplate(workbook, worksheet, invalid_title);
    sheetName = 'Duplication';
    worksheet = workbook.addWorksheet(sheetName, {});
    writeBaseTemplate(workbook, worksheet, duplication_title);
    // Write to File
    workbook.xlsx.writeFile(outputPath).then(() => {
      resolve(workbook);
    });
  });
}

function writeBaseTemplate(workbook, worksheet, title) {
  worksheet.getColumn('A').width = 6;
  worksheet.getColumn('B').width = 17;
  worksheet.getColumn('C').width = 17;
  worksheet.getColumn('D').width = 19.2;
  worksheet.getColumn('E').width = 19.2;
  worksheet.getColumn('F').width = 19.2;
  worksheet.getColumn('G').width = 9.5;
  worksheet.getColumn('H').width = 9.5;
  worksheet.getColumn('I').width = 9.5;
  worksheet.getColumn('J').width = 32;
  worksheet.getColumn('K').width = 13.8;
  worksheet.getColumn('L').width = 13.8;
  worksheet.getColumn('M').width = 32;
  worksheet.getColumn('N').width = 9.5;
  worksheet.getColumn('O').width = 9.5;
  worksheet.getColumn('P').width = 13.5;
  worksheet.getColumn('Q').width = 9.5;
  worksheet.getColumn('R').width = 9.5;
  worksheet.getColumn('S').width = 9.5;
  worksheet.getColumn('T').width = 9.5;
  worksheet.getColumn('U').width = 13.8;

  worksheet.getRow('5').height = 30;

  worksheet.getCell('E1').font = {
    bold: true, size: 14, name: 'Arial', family: 2,
    color: { argb: 'FFFF0000' }
  };

  worksheet.getCell('E1').alignment = { vertical: 'middle' };

  worksheet.getCell('E1').value = title;

  worksheet.getCell('E3').font = {
    bold: true
  };

  // Table Headers
  worksheet.mergeCells('A5:A6');

  worksheet.getCell('A5').font = {
    bold: true,
    size: 10,
    color: { theme: 1 },
    name: 'Arial',
    family: 2
  }

  worksheet.getCell('A5').fill =  {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF00' },
    bgColor: { indexed: 64 }
  }

  worksheet.getCell('A5').alignment = {
    horizontal: 'center', vertical: 'middle', wrapText: true
  }

  worksheet.getCell('A5').border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: { style: 'thin' },
    bottom: { style: 'thin' }
  }

  worksheet.getCell('A5').value = 'No.'

  worksheet.mergeCells('B5:B6');
  worksheet.getCell('B5').font = worksheet.getCell('A5').font;
  worksheet.getCell('B5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('B5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('B5').border = worksheet.getCell('A5').border;
  worksheet.getCell('B5').value = 'Họ';

  worksheet.mergeCells('C5:C6');
  worksheet.getCell('C5').font = worksheet.getCell('A5').font;
  worksheet.getCell('C5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('C5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('C5').border = worksheet.getCell('A5').border;
  worksheet.getCell('C5').value = 'Tên';

  worksheet.mergeCells('D5:D6');
  worksheet.getCell('D5').font = worksheet.getCell('A5').font;
  worksheet.getCell('D5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('D5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('D5').border = worksheet.getCell('A5').border;
  worksheet.getCell('D5').value = 'Quận/Huyện';

  worksheet.mergeCells('E5:E6');
  worksheet.getCell('E5').font = worksheet.getCell('A5').font;
  worksheet.getCell('E5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('E5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('E5').border = worksheet.getCell('A5').border;
  worksheet.getCell('E5').value = 'Tỉnh/Thành';

  worksheet.mergeCells('F5:F6');
  worksheet.getCell('F5').font = worksheet.getCell('A5').font;
  worksheet.getCell('F5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('F5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('F5').border = worksheet.getCell('A5').border;
  worksheet.getCell('F5').value = 'Điện Thoại';

  worksheet.mergeCells('G5:I5');
  worksheet.getCell('G5').font = worksheet.getCell('A5').font;
  worksheet.getCell('G5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('G5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('G5').border = worksheet.getCell('A5').border;
  worksheet.getCell('G5').value = 'Ngày sinh của bé';

  worksheet.getCell('G6').font = worksheet.getCell('A5').font;
  worksheet.getCell('G6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('G6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('G6').border = worksheet.getCell('A5').border;
  worksheet.getCell('G6').value = 'Ngày';

  worksheet.getCell('H6').font = worksheet.getCell('A5').font;
  worksheet.getCell('H6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('H6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('H6').border = worksheet.getCell('A5').border;
  worksheet.getCell('H6').value = 'Tháng';

  worksheet.getCell('I6').font = worksheet.getCell('A5').font;
  worksheet.getCell('I6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('I6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('I6').border = worksheet.getCell('A5').border;
  worksheet.getCell('I6').value = 'Năm';

  worksheet.mergeCells('J5:L5');

  worksheet.getCell('J5').font = worksheet.getCell('A5').font;
  worksheet.getCell('J5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('J5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('J5').border = worksheet.getCell('A5').border;
  worksheet.getCell('J5').value = 'Thông tin bệnh viện';

  worksheet.getCell('J6').font = worksheet.getCell('A5').font;
  worksheet.getCell('J6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('J6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('J6').border = worksheet.getCell('A5').border;
  worksheet.getCell('J6').value = 'Tên bệnh viện';

  worksheet.getCell('K6').font = worksheet.getCell('A5').font;
  worksheet.getCell('K6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('K6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('K6').border = worksheet.getCell('A5').border;
  worksheet.getCell('K6').value = 'Tỉnh Thành';

  worksheet.getCell('L6').font = worksheet.getCell('A5').font;
  worksheet.getCell('L6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('L6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('L6').border = worksheet.getCell('A5').border;
  worksheet.getCell('L6').value = 'Khu vực';

  worksheet.mergeCells('M5:M6');
  worksheet.getCell('M5').font = worksheet.getCell('A5').font;
  worksheet.getCell('M5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('M5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('M5').border = worksheet.getCell('A5').border;
  worksheet.getCell('M5').value = 'CampaignName/Source';

  worksheet.mergeCells('N5:N6');
  worksheet.getCell('N5').font = worksheet.getCell('A5').font;
  worksheet.getCell('N5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('N5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('N5').border = worksheet.getCell('A5').border;
  worksheet.getCell('N5').value = 'Số ký của bé';

  worksheet.mergeCells('O5:O6');
  worksheet.getCell('O5').font = worksheet.getCell('A5').font;
  worksheet.getCell('O5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('O5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('O5').border = worksheet.getCell('A5').border;
  worksheet.getCell('O5').value = 'Size tã bé đang dùng';

  worksheet.mergeCells('P5:P6');
  worksheet.getCell('P5').font = worksheet.getCell('A5').font;
  worksheet.getCell('P5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('P5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('P5').border = worksheet.getCell('A5').border;
  worksheet.getCell('P5').value = 'Nhãn hiệu tã bé đang dùng';

  worksheet.mergeCells('Q5:Q6');
  worksheet.getCell('Q5').font = worksheet.getCell('A5').font;
  worksheet.getCell('Q5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('Q5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('Q5').border = worksheet.getCell('A5').border;
  worksheet.getCell('Q5').value = 'Size tã tặng';

  worksheet.mergeCells('R5:T5');
  worksheet.getCell('R5').font = worksheet.getCell('A5').font;
  worksheet.getCell('R5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('R5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('R5').border = worksheet.getCell('A5').border;
  worksheet.getCell('R5').value = 'Thời gian lấy mẫu';

  worksheet.getCell('R6').font = worksheet.getCell('A5').font;
  worksheet.getCell('R6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('R6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('R6').border = worksheet.getCell('A5').border;
  worksheet.getCell('R6').value = 'Ngày';

  worksheet.getCell('S6').font = worksheet.getCell('A5').font;
  worksheet.getCell('S6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('S6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('S6').border = worksheet.getCell('A5').border;
  worksheet.getCell('S6').value = 'Tháng';

  worksheet.getCell('T6').font = worksheet.getCell('A5').font;
  worksheet.getCell('T6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('T6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('T6').border = worksheet.getCell('A5').border;
  worksheet.getCell('T6').value = 'Năm';

  worksheet.mergeCells('U5:U6');
  worksheet.getCell('U5').font = worksheet.getCell('A5').font;
  worksheet.getCell('U5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('U5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('U5').border = worksheet.getCell('A5').border;
  worksheet.getCell('U5').value = 'Week';
  // End Table Headers

  // Add Logo
  let logo = workbook.addImage({
    filename: logoPath,
    extension: 'png'
  });

  worksheet.addImage(logo, 'A1:B3');
}
