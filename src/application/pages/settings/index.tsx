import './settings.css';
import { useState } from 'react';
import CharactersSettings from './characters';
import GeneralSettings from './general';

function Settings() {
  const [activeTab, setActiveTab] = useState('Geral');
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Geral':
        return <GeneralSettings />;
      case 'Personagens':
        return <CharactersSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="innerContent">
      <div className="card">
        <h1>Configurações</h1>
        <p>
          Personalize a aparência, dados e comportamento exclusivos do projeto atual.
          Qualquer alteração feita aqui não afeta outros projetos.
        </p>
        <div className="settingsTabs">
          <ul>
            <li>
              <button
                className={activeTab === 'Geral' ? 'active-tab' : ''}
                onClick={() => setActiveTab('Geral')}
                type="button"
              >
                Geral
              </button>
            </li>
            <li>
              <button
                className={activeTab === 'Personagens' ? 'active-tab' : ''}
                onClick={() => setActiveTab('Personagens')}
                type="button"
              >
                Personagens
              </button>
            </li>
          </ul>
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default Settings;
