import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useState } from 'react';
import EditLists from '../edit-lists';
import IrootStateProject from '../../../../interfaces/IRootStateProject';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';

function ManuscriptSettings() {
  const dispatch = useDispatch();
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const [typeSound, setTypeSound] = useState(prjSettings.typeWriterSound);
  const [typeVolume, setTypeVolume] = useState(prjSettings.typeWriterVolume);
  const [povColor, setPovColor] = useState(prjSettings.manuscriptShowPovColor || false);
  const [sceneWC, setSceneWC] = useState(prjSettings.manuscriptShowWC || false);
  const [sceneChks, setsceneChks] = useState(prjSettings.manuscriptShowChecks || false);

  const saveSettings = async (newSettings: string[], table: string) => {
    await indexedDBrepository.updateProjectSettingsList(newSettings, table);
    dispatch(fetchProjectDataAction(true));
  };

  const handleInputType = async (e: ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === 'color') {
      setPovColor(e.target.checked);
      await indexedDBrepository.updateProjectSettings(e.target.checked, 'manuscriptShowPovColor');
    } if (type === 'WC') {
      setSceneWC(e.target.checked);
      await indexedDBrepository.updateProjectSettings(e.target.checked, 'manuscriptShowWC');
    } if (type === 'checks') {
      setsceneChks(e.target.checked);
      await indexedDBrepository.updateProjectSettings(e.target.checked, 'manuscriptShowChecks');
    }
    dispatch(fetchProjectDataAction(true));
  };

  const handleTypeWriter = async (e: ChangeEvent<HTMLInputElement>) => {
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
        <img className="settingsSectionIcon icon-color" src="./scene.png" alt="Character icon" />
        {' '}
        Manuscrito
      </h2>
      <fieldset className="cardFiedset">
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
              onChange={handleTypeWriter}
            />
            {' '}
            Habilitar sons de máquina de escrever ao escrever cenas.
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
      <fieldset>
        <legend>Informações extras</legend>
        <div className="checkbox-wrapper">
          <label htmlFor="povColor">
            <input
              className="inputChkBox"
              type="checkbox"
              id="povColor"
              checked={povColor}
              onChange={(e) => handleInputType(e, 'color')}
            />
            {' '}
            Mostrar etiqueta do POV na lista de cenas
          </label>
        </div>
        <div className="checkbox-wrapper">
          <label htmlFor="sceneWC">
            <input
              className="inputChkBox"
              type="checkbox"
              id="sceneWC"
              checked={sceneWC}
              onChange={(e) => handleInputType(e, 'WC')}
            />
            {' '}
            Mostrar total de palavras na lista de cenas
          </label>
        </div>
        <div className="checkbox-wrapper">
          <label htmlFor="sceneChks">
            <input
              className="inputChkBox"
              type="checkbox"
              id="sceneChks"
              checked={sceneChks}
              onChange={(e) => handleInputType(e, 'checks')}
            />
            {' '}
            Mostrar sinal ✔ quando o status
            da cena for &apos;Pronto&apos; e ✔✔ quando for &apos;Revisado&apos;
          </label>
        </div>
        <div className="listDraftExeplie">
          <h2>Exemplo de Rascunho</h2>
          <div>
            <div>
              <div className="" style={{ marginLeft: '0em' }}>
                <label htmlFor="67" className="itemDraft">
                  <input type="checkbox" id="67" className="invisibleChk" />
                  <div className="textIcon" />
                  Cena 1
                  {sceneWC && (
                    <span className="wordCountSpan" style={{ marginLeft: '.5em' }}>(2500)</span>
                  )}
                  {sceneChks && (
                    <span className="checkSceneList" style={{ color: 'var(--green-color)' }}>
                      ✔✔
                    </span>
                  )}
                </label>
              </div>
              <div className="" style={{ marginLeft: '0em' }}>
                <label htmlFor="68" className="itemDraft">
                  <input type="checkbox" id="68" className="invisibleChk" />
                  <span className={povColor ? 'charTagIcon' : ''} style={{ backgroundColor: 'rgb(59 106 60)' }} />
                  <div className="textIcon" />
                  Cena 2
                  {sceneWC && (
                    <span className="wordCountSpan" style={{ marginLeft: '.5em' }}>(350)</span>
                  )}
                </label>
              </div>
              <div className="" style={{ marginLeft: '0em' }}>
                <label htmlFor="69" className="itemDraft">
                  <input type="checkbox" id="69" className="invisibleChk" />
                  <span className={povColor ? 'charTagIcon' : ''} style={{ backgroundColor: 'rgb(59 67 106)' }} />
                  <div className="textIcon" />
                  Cena 3
                  {sceneWC && (
                    <span className="wordCountSpan" style={{ marginLeft: '.5em' }}>(750)</span>
                  )}
                  {sceneChks && (
                    <span className="checkSceneList" style={{ color: 'var(--green-color)' }}>
                      ✔
                    </span>
                  )}
                </label>
              </div>
              <div className="" style={{ marginLeft: '0em' }}>
                <label htmlFor="70" className="itemDraft">
                  <input type="checkbox" id="70" className="invisibleChk" />
                  <div className="textIcon" />
                  Cena 4
                  {sceneWC && (
                    <span className="wordCountSpan" style={{ marginLeft: '.5em' }}>(0)</span>
                  )}
                </label>
              </div>
              <div className="" style={{ marginLeft: '0em' }}>
                <label htmlFor="71" className="itemDraft">
                  <input type="checkbox" id="71" className="invisibleChk" />
                  <div className="textIcon" />
                  Cena 5
                  {sceneWC && (
                    <span className="wordCountSpan" style={{ marginLeft: '.5em' }}>(0)</span>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>
          Listas predefinidas
        </legend>
        <div className="listsSection">
          <EditLists list={prjSettings.manuscriptStatus} projSettingsI="manuscriptStatus" listTitle="Status" onDataSend={saveSettings} />
          <EditLists list={prjSettings.manuscriptWeather} projSettingsI="manuscriptWeather" listTitle="Clima" onDataSend={saveSettings} />
          <EditLists list={prjSettings.manuscriptPersonalWords} projSettingsI="manuscriptPersonalWords" listTitle="Palavras para destacar" onDataSend={saveSettings} />
        </div>
      </fieldset>
    </div>
  );
}

export default ManuscriptSettings;
