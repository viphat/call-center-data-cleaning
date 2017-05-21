const extract = require('extract-zip');
const fs = require('fs');

export const extractFile = (inputFile, outputDirectory) => {
  return new Promise((resolve, reject)=>{
    let extractFolder = outputDirectory + '/sources';
    if (!fs.existsSync(extractFolder)) {
      fs.mkdirSync(extractFolder);
    }
    extract(inputFile, { dir: extractFolder }, (err) =>{
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(true);
    })
  });
};
