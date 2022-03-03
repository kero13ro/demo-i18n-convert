/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-continue */

/**
  將所有語系 locale 資料夾內 json 合併並匯出為單支 Excel
  供翻譯人員填寫後再匯入，並依據檔案路徑、結構歸類

  faq.json 多層物件架構，以 > 區隔
  {
    "EDIT_DNS": {
      "WIN_XP": {
        "STEP_1": "点击控制面板"
      }
    }
  }
 */

const fs = require("fs");
const path = require("path");
const xl = require("excel4node");

/** 配合 excel 結構，遞迴將 json 多層結構轉為單層。ex. faq.json */
function convertOneLayer(dataObj) {
  const res = {};
  let hasArray = false;

  function extraLayer(item, prefix = "") {
    for (const [key, value] of Object.entries(item)) {
      if (typeof value === "object" && Array.isArray(value)) {
        hasArray = true;
        extraLayer(item[key], `${prefix}££${key}`);

        continue;
      }
      if (typeof value === "object" && !Array.isArray(value)) {
        /** 以 > 分隔 */
        extraLayer(item[key], `${prefix}>${key}`);

        continue;
      }
      if (hasArray) {
        res[`${prefix}£${key}`] = value;
      } else {
        res[`${prefix}>${key}`] = value;
      }
    }
  }
  extraLayer(dataObj);

  return res;
}

/** 讀取 dirPath 內部所有 json，合併為物件 */
const getAllFiles = (dirPath, mergedAll, lang) => {
  const files = fs.readdirSync(dirPath);
  let resMap = mergedAll;

  files.forEach((file) => {
    if (file.endsWith(".ts")) return;

    const currentPath = `${dirPath}/${file}`;

    // 若讀取檔案為資料夾，往下遞迴
    if (fs.statSync(currentPath).isDirectory()) {
      resMap = getAllFiles(currentPath, mergedAll, lang);
    } else {
      const dataObject = fs.readFileSync(currentPath, "utf8");
      const flatObj = convertOneLayer(JSON.parse(dataObject));

      for (const [key, value] of Object.entries(flatObj)) {
        const strIndex = currentPath.indexOf("src/");
        // 注意：目前寫死路徑長度，若有變更相對位置、要對應調整數字
        const addPath = path
          .join(currentPath, key.slice(1))
          .slice(strIndex + 14);

        if (!resMap[addPath]) resMap[addPath] = [];
        if (lang === "tw") resMap[addPath][0] = value;
        if (lang === "cn") resMap[addPath][1] = value;
        if (lang === "en") resMap[addPath][2] = value;
        if (lang === "vn") resMap[addPath][3] = value;
      }
    }
  });

  return resMap;
};

/** 將 object 寫入 excel */
function writeExcel(mixObject) {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet("sheet");
  let i = 1;

  ws.cell(1, 1).string("path");
  ws.cell(1, 2).string("tw");
  ws.cell(1, 3).string("cn");
  ws.cell(1, 4).string("en");
  ws.cell(1, 5).string("vn");

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

/** @INFO 因為 getAllFiles 為遞迴，檔案路徑必須為不傳入 */
// const urlPath = path.join(__dirname, '..');
let mergedAll;

mergedAll = getAllFiles(`${__dirname}/tw`, {}, "tw");
mergedAll = getAllFiles(`${__dirname}/cn`, mergedAll, "cn");
mergedAll = getAllFiles(`${__dirname}/en`, mergedAll, "en");
mergedAll = getAllFiles(`${__dirname}/vn`, mergedAll, "en");
// console.log(mergedAll);

writeExcel(mergedAll);
