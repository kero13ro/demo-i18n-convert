/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */

const fs = require("fs");
const parser = require("simple-excel-to-json");

/** 檢查路徑，建立空資料夾 */
function makeAllDir(urlPath) {
  const arr = urlPath.split("/");
  arr.pop();
  const dir = arr.join("/");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 尋找 語系對照表 檔案並開啟，
const files = fs.readdirSync(__dirname);
let target;

for (const file of files) {
  if (file.startsWith("語系對照表")) {
    target = file;
    break;
  }
}

const doc = parser.parseXls2Json(`${__dirname}/${target}`);
const sheet = doc[0];

/** 依據檔案名稱拆分物件 */
const resData = {};
for (const { path: url, tw, en } of Object.values(sheet)) {
  const [filePath, key] = url.split(".json/");

  if (!resData[filePath]) resData[filePath] = {};
  resData[filePath][key] = [tw, en];
}

/** 依據語系各別寫 json */
for (const [filterPath, dataObject] of Object.entries(resData)) {
  const langList = ["tw", "en"];

  langList.forEach((str, index) => {
    const langObj = {};

    /** 遞迴建立 json 多層結構。ex. faq.json */
    function multipleLayerByObj(key, value) {
      const pathArr = key.split(">");
      let pointer = langObj;

      while (pathArr.length !== 1) {
        const shiftStr = pathArr.shift();
        if (!pointer[shiftStr]) pointer[shiftStr] = {};
        pointer = pointer[shiftStr];
      }

      pointer[pathArr[0]] = value;
    }

    for (const [key, arr] of Object.entries(dataObject)) {
      if (key.includes(">")) {
        multipleLayerByObj(key, arr[index]);
      } else {
        langObj[key] = arr[index];
      }
    }

    /** 檢查路徑，建立空資料夾 */
    const filePath = `${__dirname}/${str}/${filterPath}.json`;
    makeAllDir(filePath);

    /** json 前綴保留二個空格 */
    fs.writeFileSync(filePath, JSON.stringify(langObj, null, 2));
  });
}
