import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, SetStateAction, useState } from 'react';
import IrootStateProject from '../../../../iterfaces/IrootStateProject';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import paragraphyMock from '../../../../templates/paragraph';
import './general.css';

function GeneralSettings() {
  const dispatch = useDispatch();
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const [color, setColor] = useState(prjSettings.projectColor);
  const typeSet = localStorage.getItem('contenTypeFont') || 'Roboto';
  const [typeFontUser, setTypeFontUSer] = useState(typeSet);
  const [textValue, setTextValue] = useState(paragraphyMock);

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    await indexedDBrepository.updateProjectSettings(e.target.value, 'projectColor');
    dispatch(fetchProjectDataAction(true));
  };

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

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const root = document.documentElement;
    root.style.setProperty('--user-text-type', e.target.value);
    localStorage.setItem('contenTypeFont', e.target.value);
    setTypeFontUSer(e.target.value);
  };

  const handleTextChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setTextValue(event.target.value);
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
    <div>
      <h2 className="cardSettingsH2">
        Geral
      </h2>
      <fieldset className="cardFiedset">
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
            style={{ color: 'var(--text-color-inactive)' }}
          >
            <option disabled>Tido da Fonte</option>
            <option value="PT"> • Serifa</option>
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

    </div>
  );
}

export default GeneralSettings;
