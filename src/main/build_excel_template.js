const _  = require('lodash');
const Excel = require('exceljs');
const fs = require('fs');

const valid_title = 'DATA CLEANING RESULT - VALID LIST';
const invalid_title = 'DATA CLEANING RESULT - INVALID LIST';
const duplication_title = 'DATA CLEANING RESULT - DUPLICATION LIST';
const logoPath = './app/vendor/logo.png';

export const buildTemplate = (outputPath, province_name) => {
  let workbook = new Excel.Workbook();

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputPath)) {
      return resolve(writeTemplate(outputPath, province_name, workbook));
    } else {
      workbook.xlsx.readFile(outputPath).then(() => {
        let sheetName = province_name + ' - ' + 'Valid';
        let worksheet = workbook.getWorksheet(sheetName);
        if (worksheet === undefined) {
          return resolve(writeTemplate(outputPath, province_name, workbook));
        }
        resolve(workbook);
      });
    }
  });
}

function writeTemplate(outputPath, province_name, workbook) {
  return new Promise((resolve, reject) => {
    let sheetName = province_name + ' - ' + 'Valid';
    let worksheet = workbook.addWorksheet(sheetName, {});
    writeBaseTemplate(workbook, worksheet, valid_title, province_name);
    sheetName = province_name + ' - ' + 'Invalid';
    worksheet = workbook.addWorksheet(sheetName, {});
    writeBaseTemplate(workbook, worksheet, invalid_title, province_name);
    sheetName = province_name + ' - ' + 'Duplication';
    worksheet = workbook.addWorksheet(sheetName, {});
    writeBaseTemplate(workbook, worksheet, duplication_title, province_name);
    // Write to File
    workbook.xlsx.writeFile(outputPath).then(() => {
      resolve(workbook);
    });
  });
}

function writeBaseTemplate(workbook, worksheet, title, province_name) {
  worksheet.getColumn('A').width = 6;
  worksheet.getColumn('B').width = 17;
  worksheet.getColumn('C').width = 17;
  worksheet.getColumn('D').width = 30;
  worksheet.getColumn('E').width = 19.2;
  worksheet.getColumn('F').width = 19.2;
  worksheet.getColumn('G').width = 20;
  worksheet.getColumn('H').width = 9.5;
  worksheet.getColumn('I').width = 9.5;
  worksheet.getColumn('J').width = 9.5;
  worksheet.getColumn('K').width = 13.8;
  worksheet.getColumn('L').width = 13.8;
  worksheet.getColumn('M').width = 23.8;
  worksheet.getColumn('N').width = 23.8;
  worksheet.getColumn('O').width = 23.8;
  worksheet.getColumn('P').width = 23.8;

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

  worksheet.getCell('E3').value = 'City/Province';

  worksheet.getCell('F3').font = {
    bold: true,
    size: 10,
    color: { argb: 'FF0000FF' },
    name: 'Arial',
    family: 2
  };

  worksheet.getCell('F3').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { theme: 5, tint: 0.5999938962981048 },
    bgColor: { indexed: 64 }
  };

  worksheet.getCell('F3').alignment = {
    horizontal: 'right', vertical: 'middle'
  }

  worksheet.getCell('F3').value = province_name;

  worksheet.getCell('H2').font = {
    italic: true,
    size: 10,
    color: { argb: 'FF0000FF' },
    name: 'Arial',
    family: 2
  }

  worksheet.getCell('H2').alignment = { vertical: 'middle' };

  worksheet.getCell('H2').value = 'S1: Pregnant';

  worksheet.getCell('H3').font = {
    italic: true,
    size: 10,
    color: { argb: 'FF0000FF' },
    name: 'Arial',
    family: 2
  }

  worksheet.getCell('H3').alignment = { vertical: 'middle' };

  worksheet.getCell('H3').value = 'S2: Baby delivered';

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
  worksheet.getCell('D5').value = 'Email';

  worksheet.mergeCells('E5:E6');
  worksheet.getCell('E5').font = worksheet.getCell('A5').font;
  worksheet.getCell('E5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('E5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('E5').border = worksheet.getCell('A5').border;
  worksheet.getCell('E5').value = 'Quận/Huyện';


  worksheet.mergeCells('F5:F6');
  worksheet.getCell('F5').font = worksheet.getCell('A5').font;
  worksheet.getCell('F5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('F5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('F5').border = worksheet.getCell('A5').border;
  worksheet.getCell('F5').value = 'Tỉnh/Thành';

  worksheet.mergeCells('G5:G6');
  worksheet.getCell('G5').font = worksheet.getCell('A5').font;
  worksheet.getCell('G5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('G5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('G5').border = worksheet.getCell('A5').border;
  worksheet.getCell('G5').value = 'Điện Thoại';

  worksheet.mergeCells('H5:J5');
  worksheet.getCell('H5').font = worksheet.getCell('A5').font;
  worksheet.getCell('H5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('H5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('H5').border = worksheet.getCell('A5').border;
  worksheet.getCell('H5').value = 'Ngày dự sinh/Ngày mẹ sinh bé';

  worksheet.getCell('H6').font = worksheet.getCell('A5').font;
  worksheet.getCell('H6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('H6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('H6').border = worksheet.getCell('A5').border;
  worksheet.getCell('H6').value = 'Ngày';

  worksheet.getCell('I6').font = worksheet.getCell('A5').font;
  worksheet.getCell('I6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('I6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('I6').border = worksheet.getCell('A5').border;
  worksheet.getCell('I6').value = 'Tháng';

  worksheet.getCell('J6').font = worksheet.getCell('A5').font;
  worksheet.getCell('J6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('J6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('J6').border = worksheet.getCell('A5').border;
  worksheet.getCell('J6').value = 'Năm';

  worksheet.mergeCells('K5:L5');
  worksheet.getCell('K5').font = worksheet.getCell('A5').font;
  worksheet.getCell('K5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('K5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('K5').border = worksheet.getCell('A5').border;
  worksheet.getCell('K5').value = 'Đối tượng nhận mẫu';

  worksheet.getCell('K6').font = worksheet.getCell('A5').font;
  worksheet.getCell('K6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('K6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('K6').border = worksheet.getCell('A5').border;
  worksheet.getCell('K6').value = 'S1';

  worksheet.getCell('L6').font = worksheet.getCell('A5').font;
  worksheet.getCell('L6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('L6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('L6').border = worksheet.getCell('A5').border;
  worksheet.getCell('L6').value = 'S2';

  worksheet.mergeCells('M5:P5');

  worksheet.getCell('M5').font = worksheet.getCell('A5').font;
  worksheet.getCell('M5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('M5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('M5').border = worksheet.getCell('A5').border;
  worksheet.getCell('M5').value = 'Thông tin bệnh viện';

  worksheet.getCell('M6').font = worksheet.getCell('A5').font;
  worksheet.getCell('M6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('M6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('M6').border = worksheet.getCell('A5').border;
  worksheet.getCell('M6').value = 'Tên bệnh viện';

  worksheet.getCell('N6').font = worksheet.getCell('A5').font;
  worksheet.getCell('N6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('N6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('N6').border = worksheet.getCell('A5').border;
  worksheet.getCell('N6').value = 'Tỉnh Thành';

  worksheet.getCell('O6').font = worksheet.getCell('A5').font;
  worksheet.getCell('O6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('O6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('O6').border = worksheet.getCell('A5').border;
  worksheet.getCell('O6').value = 'Channel\n(Key urban/Urban/Rural)';

  worksheet.getCell('P6').font = worksheet.getCell('A5').font;
  worksheet.getCell('P6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('P6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('P6').border = worksheet.getCell('A5').border;
  worksheet.getCell('P6').value = 'Khu vực';
  // End Table Headers

  if (worksheet.name.endsWith('Duplication')) {
    worksheet.mergeCells('Q5:Q6');
    worksheet.getCell('Q5').font = worksheet.getCell('A5').font;
    worksheet.getCell('Q5').fill = worksheet.getCell('A5').fill;
    worksheet.getCell('Q5').alignment = worksheet.getCell('A5').alignment;
    worksheet.getCell('Q5').border = worksheet.getCell('A5').border;
    worksheet.getCell('Q5').value = 'Tuần';
  }

  // Add Logo
  let logo = workbook.addImage({
    filename: logoPath,
    extension: 'png'
  });

  worksheet.addImage(logo, 'A1:B3');
}
