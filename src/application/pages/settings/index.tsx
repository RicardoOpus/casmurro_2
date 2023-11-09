import { SetStateAction, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IrootStateProject from '../../../domain/IrootStateProject';
import './settings.css';
import EditLists from './edit-lists';
import indexedDBrepository from '../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../redux/actions';

function Settings() {
  const dispatch = useDispatch();
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const [textValue, setTextValue] = useState('Exemplo de texto digitado por você. Nada aqui será salvo...');
  const adjustTextSize = (increaseStep: number, increase: boolean) => {
    const root = document.documentElement;
    const currentTextSize = getComputedStyle(root).getPropertyValue('--user-text-size');
    const currentSizeInPixels = parseInt(currentTextSize, 10);
    let newSizeInPixels;
    if (increase) {
      newSizeInPixels = currentSizeInPixels + increaseStep;
    } else {
      newSizeInPixels = currentSizeInPixels - increaseStep;
    }
    root.style.setProperty('--user-text-size', `${newSizeInPixels}px`);
    localStorage.setItem('contenSize', `${newSizeInPixels}px`);
  };

  const handleTextChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setTextValue(event.target.value);
  };

  const saveSettings = async (newSettings: string[], table: string) => {
    await indexedDBrepository.updateProjectSettings(newSettings, table);
    dispatch(fetchProjectDataAction(true));
  };

  return (
    <div className="innerContent">
      <div className="card">
        <h1>Configurações</h1>
        <p>
          Personalize a aparência, dados e comportamento exclusivos do projeto atual.
          Qualquer alteração feita aqui não afeta outros projetos.
        </p>
        <div className="divider div-transparent" />
        <h2>Customizar campos de texto livre</h2>
        <button onClick={() => adjustTextSize(2, true)} className="btnSmall" type="button">+ A</button>
        <button onClick={() => adjustTextSize(2, false)} className="btnSmall" type="button">- A</button>
        <div className="fullContent">
          <textarea
            style={{ height: '100%' }}
            className="cardInputFull"
            placeholder="Campo livre..."
            value={textValue}
            onChange={handleTextChange}
          />
        </div>
        <h2>Personagens</h2>
        <div className="listsSection">
          <EditLists list={prjSettings.charactersCategory} projSettingsI="charactersCategory" listTitle="Categorias" onDataSend={saveSettings} />
          <EditLists list={prjSettings.charactersGenrders} projSettingsI="charactersGenrders" listTitle="Gênero" onDataSend={saveSettings} />
        </div>
      </div>
    </div>
  );
}

export default Settings;
