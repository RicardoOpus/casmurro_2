import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useState } from 'react';
import EditLists from '../edit-lists';
import IrootStateProject from '../../../../domain/IrootStateProject';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';

function ManuscriptSettings() {
  const dispatch = useDispatch();
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
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

  return (
    <div>
      <h2 className="cardSettingsH2">
        <img className="settingsSectionIcon icon-color" src="./scene.png" alt="Character icon" />
        {' '}
        Manuscrito
      </h2>
      <fieldset className="cardFiedset">
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
        </div>
      </fieldset>
    </div>
  );
}

export default ManuscriptSettings;
