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
      <small>
        <ul>
          <li>i18n 可建立多國語系、切換語系。文章太多不再贅述</li>
          <li>i18n-ally 可快速預覽 key 顯示詞彙</li>
        </ul>
      </small>
      <div>
        <button onClick={() => toggleLang("tw")}>切換為中文</button>{" "}
        <button onClick={() => toggleLang("en")}>切換為英文</button>
      </div>
      <blockquote>
        {t("nest_1.nest_2.firstName")} {t("nest_1.nest_2.lastName")}
        <p>{t("category.comp1.online")}</p>
      </blockquote>
      <br />
      <h5>Excel 匯出及匯入</h5>
      <p>
        使用 node.js 將所有 json 檔案合併、匯出為 Excel
        <br />
        並記錄 資料夾巢狀架構、物件、陣列
        <br />
        翻譯後再匯入成原本 json 架構及類型
      </p>
      <div className="flex">
        <img src={imgJson} alt="imgJson" />
        <img src={imgExcel} alt="imgJson" />
      </div>
      <small>
        匯出為 excel
        <pre>node src/locale/convert.js</pre>
        匯入為 json
        <pre>node src/locale/excel2json.js</pre>
      </small>
    </div>
  );
}

export default App;
