const _  = require('lodash');
const Excel = require('exceljs');

const valid_title = 'DATA CLEANING RESULT - VALID LIST';
const invalid_title = 'DATA CLEANING RESULT - INVALID LIST';
const logoPath = './app/vendor/logo.png';

export const buildTemplate = (templateFilePath, isValid = true) => {
  let workbook = new Excel.Workbook();

  let worksheet = workbook.addWorksheet('Template', {});

  worksheet.getColumn('A').width = 6;
  worksheet.getColumn('B').width = 19.4;
  worksheet.getColumn('C').width = 14;
  worksheet.getColumn('D').width = 14;
  worksheet.getColumn('E').width = 19.2;
  worksheet.getColumn('F').width = 12.4;
  worksheet.getColumn('G').width = 11;
  worksheet.getColumn('H').width = 11;
  worksheet.getColumn('I').width = 11;
  worksheet.getColumn('J').width = 9.2;
  worksheet.getColumn('K').width = 9.4;
  worksheet.getColumn('L').width = 20.2;
  worksheet.getColumn('M').width = 23.8;

  worksheet.getRow('5').height = 30;

  worksheet.getCell('D1').font = {
    bold: true, size: 14, name: 'Arial', family: 2,
    color: { argb: 'FFFF0000' }
  };

  worksheet.getCell('D1').alignment = { vertical: 'middle' };

  if (isValid == true) {
    worksheet.getCell('D1').value = valid_title;
  } else {
    worksheet.getCell('D1').value = invalid_title;
  }

  worksheet.getCell('D3').font = {
    bold: true
  };

  worksheet.getCell('D3').value = 'City/Province';

  worksheet.getCell('E3').font = {
    bold: true,
    size: 10,
    color: { argb: 'FF0000FF' },
    name: 'Arial',
    family: 2
  };

  worksheet.getCell('E3').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { theme: 5, tint: 0.5999938962981048 },
    bgColor: { indexed: 64 }
  };

  worksheet.getCell('E3').alignment = {
    horizontal: 'right', vertical: 'middle'
  }

  worksheet.getCell('E3').value = 'Cần Thơ';

  worksheet.getCell('J2').font = {
    italic: true,
    size: 10,
    color: { argb: 'FF0000FF' },
    name: 'Arial',
    family: 2
  }

  worksheet.getCell('J2').alignment = { vertical: 'middle' };

  worksheet.getCell('J2').value = 'S1: Pregnant';

  worksheet.getCell('J3').font = {
    italic: true,
    size: 10,
    color: { argb: 'FF0000FF' },
    name: 'Arial',
    family: 2
  }

  worksheet.getCell('J3').alignment = { vertical: 'middle' };

  worksheet.getCell('J3').value = 'S2: Baby delivered';

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
  worksheet.getCell('B5').value = 'Full name';

  worksheet.mergeCells('C5:C6');
  worksheet.getCell('C5').font = worksheet.getCell('A5').font;
  worksheet.getCell('C5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('C5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('C5').border = worksheet.getCell('A5').border;
  worksheet.getCell('C5').value = 'District';

  worksheet.mergeCells('D5:D6');
  worksheet.getCell('D5').font = worksheet.getCell('A5').font;
  worksheet.getCell('D5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('D5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('D5').border = worksheet.getCell('A5').border;
  worksheet.getCell('D5').value = 'City/Province';

  worksheet.mergeCells('E5:E6');
  worksheet.getCell('E5').font = worksheet.getCell('A5').font;
  worksheet.getCell('E5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('E5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('E5').border = worksheet.getCell('A5').border;
  worksheet.getCell('E5').value = 'Telephone Number';


  worksheet.mergeCells('F5:F6');
  worksheet.getCell('F5').font = worksheet.getCell('A5').font;
  worksheet.getCell('F5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('F5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('F5').border = worksheet.getCell('A5').border;
  worksheet.getCell('F5').value = 'Email';

  worksheet.mergeCells('G5:I5');
  worksheet.getCell('G5').font = worksheet.getCell('A5').font;
  worksheet.getCell('G5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('G5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('G5').border = worksheet.getCell('A5').border;
  worksheet.getCell('G5').value = 'Date of pregnancy/Baby delivery';

  worksheet.getCell('G6').font = worksheet.getCell('A5').font;
  worksheet.getCell('G6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('G6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('G6').border = worksheet.getCell('A5').border;
  worksheet.getCell('G6').value = 'Day';

  worksheet.getCell('H6').font = worksheet.getCell('A5').font;
  worksheet.getCell('H6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('H6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('H6').border = worksheet.getCell('A5').border;
  worksheet.getCell('H6').value = 'Month';

  worksheet.getCell('I6').font = worksheet.getCell('A5').font;
  worksheet.getCell('I6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('I6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('I6').border = worksheet.getCell('A5').border;
  worksheet.getCell('I6').value = 'Year';

  worksheet.mergeCells('J5:K5');
  worksheet.getCell('J5').font = worksheet.getCell('A5').font;
  worksheet.getCell('J5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('J5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('J5').border = worksheet.getCell('A5').border;
  worksheet.getCell('J5').value = 'Target receiver (S1/S2)';

  worksheet.getCell('J6').font = worksheet.getCell('A5').font;
  worksheet.getCell('J6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('J6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('J6').border = worksheet.getCell('A5').border;
  worksheet.getCell('J6').value = 'S1';

  worksheet.getCell('K6').font = worksheet.getCell('A5').font;
  worksheet.getCell('K6').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('K6').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('K6').border = worksheet.getCell('A5').border;
  worksheet.getCell('K6').value = 'S2';

  worksheet.mergeCells('L5:L6');
  worksheet.getCell('L5').font = worksheet.getCell('A5').font;
  worksheet.getCell('L5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('L5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('L5').border = worksheet.getCell('A5').border;
  worksheet.getCell('L5').value = 'Hospital';

  worksheet.mergeCells('M5:M6');
  worksheet.getCell('M5').font = worksheet.getCell('A5').font;
  worksheet.getCell('M5').fill = worksheet.getCell('A5').fill;
  worksheet.getCell('M5').alignment = worksheet.getCell('A5').alignment;
  worksheet.getCell('M5').border = worksheet.getCell('A5').border;
  worksheet.getCell('M5').value = 'Sampling Channel\n(Key urban/Urban/Rural)';

  // End Table Headers

  // First Row
  worksheet.getCell('A7').font = {
    size: 10, color: { theme: 1 }, name: 'Arial', family: 2
  };
  worksheet.getCell('A7').border = worksheet.getCell('A5').border;
  worksheet.getCell('A7').alignment = worksheet.getCell('A5').alignment;

  worksheet.getCell('B7').font = worksheet.getCell('A7').font;
  worksheet.getCell('B7').border = worksheet.getCell('A7').border;
  worksheet.getCell('B7').alignment = worksheet.getCell('A7').alignment;

  worksheet.getCell('C7').font = worksheet.getCell('A7').font;
  worksheet.getCell('C7').border = worksheet.getCell('A7').border;
  worksheet.getCell('C7').alignment = worksheet.getCell('A7').alignment;

  worksheet.getCell('D7').font = worksheet.getCell('A7').font;
  worksheet.getCell('D7').border = worksheet.getCell('A7').border;
  worksheet.getCell('D7').alignment = worksheet.getCell('A7').alignment;

  worksheet.getCell('E7').font = worksheet.getCell('A7').font;
  worksheet.getCell('E7').border = worksheet.getCell('A7').border;
  worksheet.getCell('E7').alignment = worksheet.getCell('A7').alignment;

  worksheet.getCell('F7').font = worksheet.getCell('A7').font;
  worksheet.getCell('F7').border = worksheet.getCell('A7').border;
  worksheet.getCell('F7').alignment = worksheet.getCell('A7').alignment;

  worksheet.getCell('G7').font = worksheet.getCell('A7').font;
  worksheet.getCell('G7').border = worksheet.getCell('A7').border;
  worksheet.getCell('G7').alignment = worksheet.getCell('A7').alignment;

  worksheet.getCell('H7').font = worksheet.getCell('A7').font;
  worksheet.getCell('H7').border = worksheet.getCell('A7').border;
  worksheet.getCell('H7').alignment = worksheet.getCell('A7').alignment;

  worksheet.getCell('I7').font = worksheet.getCell('A7').font;
  worksheet.getCell('I7').border = worksheet.getCell('A7').border;
  worksheet.getCell('I7').alignment = worksheet.getCell('A7').alignment;

  worksheet.getCell('J7').font = worksheet.getCell('A7').font;
  worksheet.getCell('J7').border = worksheet.getCell('A7').border;
  worksheet.getCell('J7').alignment = worksheet.getCell('A7').alignment;

  worksheet.getCell('K7').font = worksheet.getCell('A7').font;
  worksheet.getCell('K7').border = worksheet.getCell('A7').border;
  worksheet.getCell('K7').alignment = worksheet.getCell('A7').alignment;

  worksheet.getCell('L7').font = worksheet.getCell('A7').font;
  worksheet.getCell('L7').border = worksheet.getCell('A7').border;
  worksheet.getCell('L7').alignment = worksheet.getCell('A7').alignment;

  worksheet.getCell('M7').font = worksheet.getCell('A7').font;
  worksheet.getCell('M7').border = worksheet.getCell('A7').border;
  worksheet.getCell('M7').alignment = worksheet.getCell('A7').alignment;

  // Add Logo
  let logo = workbook.addImage({
    filename: logoPath,
    extension: 'png'
  });

  worksheet.addImage(logo, 'A1:B3');
  //
  workbook.xlsx.writeFile(templateFilePath);
}

function readTemplate() {
  let originalTemplatePath = '/Users/viphat/Downloads/DATA TUAN 11 - QUY 2/Hospital Sponsoring_Data Cleaning Format (22.5.2017).xlsx'
  let workbook = new Excel.Workbook();
  workbook.xlsx.readFile(originalTemplatePath).then(()=>{
    // Do nothing
  });
}
