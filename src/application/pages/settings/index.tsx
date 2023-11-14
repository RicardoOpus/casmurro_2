import { ChangeEvent, SetStateAction, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IrootStateProject from '../../../domain/IrootStateProject';
import './settings.css';
import EditLists from './edit-lists';
import indexedDBrepository from '../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../redux/actions';
import paragraphyMock from '../../../mocks/paragraph';

function Settings() {
  const dispatch = useDispatch();
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const [color, setColor] = useState(prjSettings.projectColor);
  const typeSet = localStorage.getItem('contenTypeFont') || 'Roboto';
  const [typeFontUser, setTypeFontUSer] = useState(typeSet);
  const [textValue, setTextValue] = useState(paragraphyMock);
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
    await indexedDBrepository.updateProjectSettingsList(newSettings, table);
    dispatch(fetchProjectDataAction(true));
  };

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    await indexedDBrepository.updateProjectSettings(e.target.value, 'projectColor');
    dispatch(fetchProjectDataAction(true));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const root = document.documentElement;
    root.style.setProperty('--user-text-type', e.target.value);
    localStorage.setItem('contenTypeFont', e.target.value);
    setTypeFontUSer(e.target.value);
  };

  const revert = async (type: string) => {
    if (type === 'color') {
      setColor('#0099ff');
      await indexedDBrepository.updateProjectSettings('#0099ff', 'projectColor');
      dispatch(fetchProjectDataAction(true));
    } else {
      const root = document.documentElement;
      localStorage.removeItem('contenTypeFont');
      localStorage.removeItem('contenSize');
      root.style.setProperty('--user-text-type', 'Roboto');
      root.style.setProperty('--user-text-size', '16px');
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
        <fieldset>
          <legend>
            Cor de destaque
          </legend>
          <p className="pSettings">
            Esta é a cor principal utilizada na interface,
            sendo empregada para realçar botões, links e itens ativos.
          </p>
          <div className="colorInterfaceSection">
            <input
              className="chartaterColor"
              type="color"
              value={color}
              onChange={(e) => handleInputChange(e)}
            />
            <button onClick={() => revert('color')} className="btnSmall" type="button">Reverter</button>
            <a style={{ color: 'var(--accent-color)' }} href="https://www.ricardoserafim.com.br/" target="_blank" rel="noreferrer">Exemplo da cor em um link</a>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            Customizar campos de texto livre
          </legend>
          <div className="settingsSectionFont">
            <button onClick={() => adjustTextSize(1, true)} className="btnSmall" type="button">+ A</button>
            <button onClick={() => adjustTextSize(1, false)} className="btnSmall" type="button">- A</button>
            <select
              className="ui-button ui-corner-all"
              onChange={(e) => handleSelectChange(e)}
              value={typeFontUser}
            >
              <option disabled>Tido da Fonte</option>
              <option value="Texgyretermes"> • Serifa</option>
              <option value="Roboto"> • Sem Serifa</option>
              <option value="TypeCurier"> • Mono</option>
            </select>
            <button onClick={() => revert('font')} className="btnSmall" type="button">Reverter</button>
          </div>
          <div className="settingsSectionFontDiv">
            <textarea
              className="settingstextArea"
              placeholder="Campo livre..."
              value={textValue}
              onChange={handleTextChange}
            />
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <img className="settingsSectionIcon icon-color" src="./characters.png" alt="Character icon" />
            {' '}
            Personagens
          </legend>
          <div className="listsSection">
            <EditLists list={prjSettings.charactersCategory} projSettingsI="charactersCategory" listTitle="Categorias" onDataSend={saveSettings} />
            <EditLists list={prjSettings.charactersGenrders} projSettingsI="charactersGenrders" listTitle="Gênero" onDataSend={saveSettings} />
          </div>
        </fieldset>
      </div>
    </div>
  );
}

export default Settings;