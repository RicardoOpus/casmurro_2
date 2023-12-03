import { useDispatch, useSelector } from 'react-redux';
import EditLists from '../edit-lists';
import IrootStateProject from '../../../../domain/IrootStateProject';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';

function ManuscriptSettings() {
  const dispatch = useDispatch();
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));

  const saveSettings = async (newSettings: string[], table: string) => {
    await indexedDBrepository.updateProjectSettingsList(newSettings, table);
    dispatch(fetchProjectDataAction(true));
  };

  return (
    <div>
      <fieldset>
        <legend>
          <img className="settingsSectionIcon icon-color" src="./scene.png" alt="Character icon" />
          {' '}
          Manuscript
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
