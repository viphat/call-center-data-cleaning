const extract = require('extract-zip');
const fs = require('fs');

export const extractFile = (inputFile, extractFolder) => {
  return new Promise((resolve, reject)=>{
    if (!fs.existsSync(extractFolder)) {
      fs.mkdirSync(extractFolder);
    }
    extract(inputFile, { dir: extractFolder }, (err) =>{
      if (err) {
        reject(err);
      }
      resolve(true);
    })
  });
};
