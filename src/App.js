import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import imgJson from "./static/code.png";
import imgExcel from "./static/excel.png";

function App() {
  const { t } = useTranslation();

  const toggleLang = (lang) => {
    changeLanguage(lang);
  };

  return (
    <div className="App">
      <h5>i18next 和 i18n-ally 測試</h5>
      <div>
        <button onClick={() => toggleLang("tw")}>切換為中文</button>{" "}
        <button onClick={() => toggleLang("en")}>切換為英文</button>
      </div>
      <blockquote>
        {t("nest_1.nest_2.firstName")} {t("nest_1.nest_2.lastName")}
        <p>{t("category.comp1.online")}</p>
      </blockquote>
      <br />
      <h5>Excel 匯入及匯出</h5>
      <p>
        使用 node.js 將所有 json 檔案合併、匯出為 Excel
        <br />
        並記錄巢狀架構、物件、陣列
        <br />
        翻譯後再匯入成原本 json 架構及類型
      </p>
      <div className="flex">
        <img src={imgJson} alt="imgJson" />
        <img src={imgExcel} alt="imgJson" />
      </div>
      <pre>node src/locale/convert.js //匯出為 excel</pre>
      <pre>node src/locale/excel2json.js //匯出為 json</pre>
    </div>
  );
}

export default App;
