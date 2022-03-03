const fs = require("fs");
const xl = require("excel4node");

// /account/setting.json{{title
// /common.json{{hi
// /common.json>nest_1>nest_2{{firstName

/** 配合 excel 結構，遞迴將 json 多層結構轉為單層。ex. faq.json */
function convertOneLayer(dataObj) {
  const res = {};

  function extraLayer(item, prefix = "") {
    for (const [key, value] of Object.entries(item)) {
      if (typeof value === "object") {
        extraLayer(item[key], `${prefix}>${key}`);
        continue;
      }
      res[`${prefix}>${key}`] = value; //todo
    }
  }
  extraLayer(dataObj);

  return res;
}

const getAllFiles = (innerPath, langMap, index) => {
  const rootPath = __dirname + "/" + innerPath;

  const files = fs.readdirSync(rootPath);

  files.forEach((file) => {
    if (fs.statSync(`${rootPath}/${file}`).isDirectory()) {
      langMap = getAllFiles(`${innerPath}/${file}`, langMap, index);

      return;
    }

    const dataObject = fs.readFileSync(`${rootPath}/${file}`, "utf8");
    const flatObj = convertOneLayer(JSON.parse(dataObject));

    for (const [key, value] of Object.entries(flatObj)) {
      const mixKey = (innerPath + "/" + file + key).slice(2);

      if (!langMap[mixKey]) langMap[mixKey] = [];
      langMap[mixKey][index] = value;
    }
  });

  return langMap;
};

const order = ["tw", "en"];
const allLangMap = order.reduce((obj, str, index) => {
  return getAllFiles(`${str}`, obj, index);
}, {});
console.log(allLangMap);

/** 將 object 寫入 excel */
function writeExcel(mixObject) {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet("sheet");
  let i = 1;

  ws.cell(1, 1).string("path");
  ws.cell(1, 2).string("tw");
  ws.cell(1, 3).string("en");
  // ws.cell(1, 4).string('en');

  for (const [key, value] of Object.entries(mixObject)) {
    i += 1;
    ws.cell(i, 1).string(key);

    if (value[0]) ws.cell(i, 2).string(value[0]);
    if (value[1]) ws.cell(i, 3).string(value[1]);
    if (value[2]) ws.cell(i, 4).string(value[2]);
  }

  const MM = new Date().getMonth() + 1;
  const DD = new Date().getDate();
  const fileName = `${__dirname}/語系對照表${MM}${DD}.xlsx`;

  // 尋找並刪除文件
  const files = fs.readdirSync(__dirname);
  let target;

  for (const file of files) {
    if (file.startsWith("語系對照表")) {
      target = file;
      break;
    }
  }
  console.log(target);
  if (target) fs.unlinkSync(`${__dirname}/${target}`);

  wb.write(fileName, (err, stats) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`success at ${stats.birthtime}`);
    }
  });
}

writeExcel(allLangMap);
