const _  = require('lodash');
const xlsx = require('xlsx');
const beginDataRow = 6;

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
    let workbook = xlsx.readFile(excelFile);
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let row = beginDataRow;
    while (isEndOfDataSheet(worksheet, row) === false) {
      console.log(worksheet['A' + row].v);
      if (worksheet['F' + row] === undefined) {
        delete_row(worksheet, row);
      }
      row += 1;
    }
    xlsx.writeFile(workbook, excelFile);
    // _.each(excelFiles, (excelFile) =>{
    //   let workbook = xlsx.readFile(excelFile)
    // });
  });
}

function isEndOfDataSheet(worksheet, row) {
  return worksheet['A' + row] === undefined && worksheet['B' + row] === undefined
}

const ec = (r, c) => {
  return xlsx.utils.encode_cell({r:r,c:c})
}

const delete_row = (ws, row_index) => {
  let range = xlsx.utils.decode_range(ws["!ref"])
  for(var R = row_index; R < range.e.r; ++R){
    for(var C = range.s.c; C <= range.e.c; ++C){
      ws[ec(R, C)] = ws[ec(R+1, C)]
    }
  }
  range.e.r--
  ws['!ref'] = xlsx.utils.encode_range(range.s, range.e)
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

