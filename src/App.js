import "./App.css";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();

  return (
    <div className="App">
      <header className="App-header">
        <h1>{t("nest_1.nest_2.firstname")}</h1>
        <h1>{t("nest_1.nest_2.lastname")}</h1>
      </header>
    </div>
  );
}

export default App;
