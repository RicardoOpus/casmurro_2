import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, SetStateAction, useState } from 'react';
import IrootStateProject from '../../../../domain/IrootStateProject';
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
  const [typeSound, setTypeSound] = useState(prjSettings.typeWriterSound);
  const [typeVolume, setTypeVolume] = useState(prjSettings.typeWriterVolume);

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

  const handleInputType = async (e: ChangeEvent<HTMLInputElement>) => {
    setTypeSound(e.target.checked);
    await indexedDBrepository.updateProjectSettings(e.target.checked, 'typeWriterSound');
    dispatch(fetchProjectDataAction(true));
  };

  const handleSlideType = async (e: ChangeEvent<HTMLInputElement>) => {
    setTypeVolume(Number(e.target.value));
    await indexedDBrepository.updateProjectSettings(Number(e.target.value), 'typeWriterVolume');
    dispatch(fetchProjectDataAction(true));
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
          Som de máquina de escrever
        </legend>
        <div className="checkbox-wrapper">
          <label htmlFor="typeWriter">
            <input
              className="inputChkBox"
              type="checkbox"
              id="typeWriter"
              checked={typeSound}
              onChange={handleInputType}
            />
            {' '}
            Habilitar som de máquina de escrever nos campos de escrita.
          </label>
          <div className="slidecontainerP">
            <p className="pSettings">
              Volume Control:
              {' '}
              {typeVolume}
            </p>
            <div className="slidecontainer">
              <input
                id="volumeControl"
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={typeVolume}
                className="slider"
                onChange={handleSlideType}
                list="tickmarks"
              />
            </div>
          </div>
          <p className="pSettings">
            Além de proporcionar uma sensação nostálgica, o som das teclas serve
            como um feedback auditivo valioso, auxiliando o escritor a manter o ritmo
            da digitação durante uma sessão intensiva de escrita.
            A audição do som das teclas contribui para evitar que o ritmo da escrita desacelere.
          </p>
        </div>
      </fieldset>
    </div>
  );
}

export default GeneralSettings;
