import { useDispatch, useSelector } from 'react-redux';
import IrootStateProject from '../../../domain/IrootStateProject';
import './settings.css';
import EditLists from './edit-lists';
import indexedDBrepository from '../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../redux/actions/projectActions';
import GeneralSettings from './general';

function Settings() {
  const dispatch = useDispatch();
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));

  const saveSettings = async (newSettings: string[], table: string) => {
    await indexedDBrepository.updateProjectSettingsList(newSettings, table);
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
        <GeneralSettings />
        <fieldset>
          <legend>
            <img className="settingsSectionIcon icon-color" src="./characters.png" alt="Character icon" />
            {' '}
            Personagens
          </legend>
          <div className="listsSection">
            <EditLists list={prjSettings.charactersCategory} projSettingsI="charactersCategory" listTitle="Categorias" onDataSend={saveSettings} />
            <EditLists list={prjSettings.charactersGenders} projSettingsI="charactersGenders" listTitle="Gênero" onDataSend={saveSettings} />
            <EditLists list={prjSettings.charactersCoreGroupes} projSettingsI="charactersCoreGroupes" listTitle="Núcleos" onDataSend={saveSettings} />
          </div>
        </fieldset>
      </div>
    </div>
  );
}

export default Settings;
