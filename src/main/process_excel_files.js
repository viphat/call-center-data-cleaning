const _  = require('lodash');
const Excel = require('exceljs');

const dataBeginRow = 6;
const hospitalName = [2, 6];
const provinceName = [3, 6];

const indexCol = 1;
const nameCol = 2;
const districtCol = 3;
const provinceCol = 4;
const phoneCol = 5;
const dayCol = 7;
const monthCol = 8;
const yearCol = 9;

const commentCell = 'L4';
const commentMergedCell = 'L5';
const commentCol = 12;

export const processExcelFiles = (excelFiles, extractedFolder) => {
  if (!_.endsWith('/')) {
    extractedFolder += '/'
  }
  return new Promise((resolve, reject) => {
    let excelFile = _.first(excelFiles);
    let fileName = _.replace(excelFile, extractedFolder, '');
    let fileNameArr = fileName.split('/')
    let province = fileNameArr[0]; // Ten Tinh Thanh
    let hospital = fileNameArr[1]; // Ten Benh Vien
    let samplingMethod = fileNameArr[2]; // BAU or DE
    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile(excelFile).then(() => {
      let worksheet = workbook.getWorksheet(1);
      worksheet.getCell(commentCell).value = 'Comment';
      worksheet.mergeCells(commentCell + ':' + commentMergedCell);
      worksheet.getCell(commentCell).border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
      worksheet.getCell(commentCell).font = {
        bold: true
      }
      worksheet.getCell(commentCell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { theme: 0, tint: -0.249977111117893 },
        bgColor: { indexed: 64 }
      }
      worksheet.getCell(commentCell).alignment = {
        vertical: 'middle', horizontal: 'center'
      };
      worksheet.getColumn(commentCol).width = 40;
      let lastRow = dataBeginRow;
      worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        if (rowNumber >= dataBeginRow) {
          if (validateRow(worksheet, row, rowNumber)){
            row.getCell(commentCol).border = {
              top: {style: 'thin'},
              left: {style: 'thin'},
              bottom: {style: 'thin'},
              right: {style: 'thin'}
            };
          };
          lastRow = rowNumber;
        }
      });

      // Auto Filters
      worksheet.autoFilter = {
        from: 'A4',
        to: {
          row: lastRow,
          column: commentCol
        }
      };

      workbook.xlsx.writeFile(excelFile);
    });

  });
}

function validateRow(worksheet, row, rowNumber) {
  // Kiểm tra thiếu thông tin
  if (row.getCell(indexCol).value === null &&
      row.getCell(nameCol).value === null  &&
      row.getCell(districtCol).value === null &&
      row.getCell(provinceCol).value === null &&
      row.getCell(phoneCol).value === null    &&
      row.getCell(dayCol).value === null      &&
      row.getCell(monthCol).value === null    &&
      row.getCell(yearCol).value === null
    ) {
    // Empty Row.
    return false;
  }

  let comment = '';
  let missingFields = [];
  if (row.getCell(indexCol).value === null) {
    // Thiếu STT
    missingFields.push('STT');
  }

  if (row.getCell(nameCol).value === null) {
    missingFields.push('Họ Tên');
  }

  if (row.getCell(districtCol).value === null) {
    missingFields.push('Quận/Huyện');
  }

  if (row.getCell(provinceCol).value === null) {
    missingFields.push('Tỉnh/Thành');
  }

  if (row.getCell(phoneCol).value === null) {
    missingFields.push('Điện Thoại');
  }

  if (row.getCell(dayCol).value === null ||
      row.getCell(monthCol).value === null ||
      row.getCell(yearCol).value === null
    ) {
    missingFields.push('Ngày tháng');
  }

  if (missingFields.length > 0) {
    comment = 'Missing fields: ' + missingFields.join(', ')
  }

  if (comment.length > 0) {
    row.getCell(commentCol).value = comment;
    row.hidden = true;
  }

  return true;
}

// Kết quả đã lọc bớt các record thiếu thông tin.
// Thống kê lỗi cho từng đợt import (Thiếu thông tin, thông tin không logic)
// Tỉ lệ Duplicate của số điện thoại (So với toàn bộ Database)
// Kết quả Filter theo từng bệnh viện (tỉnh/thành)
// Thống kê lỗi cho toàn bộ dự án (Chưa biết cần không, nhưng cứ lưu hết vào Database đã)
//
// Thông tin bắt buộc phải có:
// - Tên khách hàng, Quận, Huyện, ngày dự sinh (hoặc ngày sinh), số điện thoại
//
// Một số logic cần kiểm tra:

// - Số điện thoại phải có 10~11 số, kể cả số điện thoại bàn cũng có 10~11 số, bao gồm mã vùng
// - Nếu số điện thoại là kiểu số thì chuyển về kiểu chuỗi.
// - Nếu số điện thoại không bắt đầu bằng số 0 thì chèn thêm số 0 vào trước.
// - Logic của ngày sinh, năm sinh?

// - ~~Check luôn Quận Huyện với Tỉnh Thành (Nếu có Database)~~
// -> Khó check lắm, vì nhiều khi nhập sai chính tả đồ, không dấu đồ, viết tắt đồ

//

