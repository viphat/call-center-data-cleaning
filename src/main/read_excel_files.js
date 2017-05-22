const glob = require('glob');
const fs = require('fs');
const _  = require('lodash');

export const readExcelFiles = (extractedFolder) => {
  return new Promise((resolve, reject)=>{
    glob(extractedFolder + '/**/*.*', (err, files) => {
      if (err) {
        reject(err);
      }
      let excelFiles =
        _.filter(files, (file) =>
          file.endsWith('.xls') || file.endsWith('.xlsx')
        );
      resolve(excelFiles);
    });
  });
}
