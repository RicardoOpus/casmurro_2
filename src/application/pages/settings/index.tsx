import './settings.css';
import CharactersSettings from './characters';
import GeneralSettings from './general';

function Settings() {
  return (
    <div className="innerContent">
      <div className="card">
        <h1>Configurações</h1>
        <p>
          Personalize a aparência, dados e comportamento exclusivos do projeto atual.
          Qualquer alteração feita aqui não afeta outros projetos.
        </p>
        <GeneralSettings />
        <CharactersSettings />
      </div>
    </div>
  );
}

export default Settings;
