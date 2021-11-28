

const fs = require('fs');
// const path = require('path');
// const xl = require('excel4node');

// /account/setting.json{{title
// /common.json{{hi
// /common.json>nest_1>nest_2{{firstname

/** 配合 excel 結構，遞迴將 json 多層結構轉為單層。ex. faq.json */
function convertOneLayer(dataObj) {
  const res = {};

  function extraLayer(item, prefix = '') {
    for (const [key, value] of Object.entries(item)) {
      if (typeof value === 'object') {
        extraLayer(item[key], `${prefix}>${key}`);
        continue;
      }
      res[`${prefix}{{${key}`] = value;
    }
  }
  extraLayer(dataObj);

  return res;
}

const getAllFiles = (innerPath, langMap, index) => {
  const rootPath = __dirname +'/'+ innerPath
  
  const files = fs.readdirSync(rootPath);

  files.forEach((file) => {  
    if (fs.statSync(`${rootPath}/${file}`).isDirectory()) {
      langMap = getAllFiles(`${innerPath}/${file}`, langMap, index);

      return
    }
    
    const dataObject = fs.readFileSync(`${rootPath}/${file}`, 'utf8');
    const flatObj = convertOneLayer(JSON.parse(dataObject));

    for (const [key, value] of Object.entries(flatObj)) {
      const mixKey = (innerPath + '/' + file +key).slice(2)

      if (!langMap[mixKey]) langMap[mixKey] = [];
      langMap[mixKey][index] = value;
    }
  });

  return langMap;
};

const order = ['tw', 'en']
const allLangMap = order.reduce((obj, str, index)=>{
  return getAllFiles(`${str}`, obj, index)
}, {})
console.log(allLangMap)
