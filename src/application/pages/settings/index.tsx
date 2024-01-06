import './settings.css';
import { useState } from 'react';
import CharactersSettings from './characters';
import GeneralSettings from './general';
import WorldSettings from './world';
import NotesSettings from './notes';
import ManuscriptSettings from './manuscript';

function Settings() {
  const [activeTab, setActiveTab] = useState('Geral');
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Geral':
        return <GeneralSettings />;
      case 'Personagens':
        return <CharactersSettings />;
      case 'Mundo':
        return <WorldSettings />;
      case 'Notas':
        return <NotesSettings />;
      case 'Manuscrito':
        return <ManuscriptSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="innerContent">
      <div className="card">
        <div className="cardSettings">
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
              <li>
                <button
                  className={activeTab === 'Mundo' ? 'active-tab' : ''}
                  onClick={() => setActiveTab('Mundo')}
                  type="button"
                >
                  Mundo
                </button>
              </li>
              <li>
                <button
                  className={activeTab === 'Notas' ? 'active-tab' : ''}
                  onClick={() => setActiveTab('Notas')}
                  type="button"
                >
                  Notas
                </button>
              </li>
              <li>
                <button
                  className={activeTab === 'Manuscrito' ? 'active-tab' : ''}
                  onClick={() => setActiveTab('Manuscrito')}
                  type="button"
                >
                  Manuscrito
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default Settings;
