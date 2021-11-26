import './App.css';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return (
    <div className="App">
      <header className="App-header">
        <div>{t('hi')}</div>
      </header>
    </div>
  );
}

export default App;
