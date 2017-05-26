const _  = require('lodash');
const Excel = require('exceljs');

const dataBeginRow = 6;
const hospitalName = [2, 6];
const provinceName = [3, 6];

const indexCol = 1;
const lastNameCol = 2;
const firstNameCol = 3;
const emailCol = 4;
const districtCol = 5;
const provinceCol = 6;
const phoneCol = 7;
const babyName = 8;
const babyGender = 9;
const dayCol = 10;
const monthCol = 11;
const yearCol = 12;
const s1Col = 13;
const s2Col = 14;

const commentCell = 'L4';
const commentMergedCell = 'L5';
const commentCol = 12;

export const validateSourceData = (excelFiles, extractedFolder) => {
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
          if (checkMissingData(worksheet, row, rowNumber)){
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

function checkMissingData(worksheet, row, rowNumber) {
  // Kiểm tra thiếu thông tin
  if (row.getCell(firstNameCol).value === null     &&
      row.getCell(lastNameCol).value === null      &&
      row.getCell(districtCol).value === null      &&
      row.getCell(provinceCol).value === null      &&
      row.getCell(phoneCol).value === null         &&
      row.getCell(dayCol).value === null           &&
      row.getCell(monthCol).value === null         &&
      row.getCell(yearCol).value === null
    ) {
    // Empty Row
    return false;
  }

  let comment = '';
  let missingFields = [];

  if (row.getCell(lastNameCol).value === null) {

  }

  if (row.getCell(firstNameCol).value === null) {

  }

  if (row.getCell(districtCol).value === null) {

  }

  if (row.getCell(provinceCol).value === null) {

  }

  if (row.getCell(phoneCol).value === null) {

  }

  if (row.getCell(dayCol).value === null ||
      row.getCell(monthCol).value === null ||
      row.getCell(yearCol).value === null
    ) {
  }

  if (missingFields.length > 0) {

  }

  if (comment.length > 0) {

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

