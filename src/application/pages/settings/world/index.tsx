import { useDispatch, useSelector } from 'react-redux';
import IrootStateProject from '../../../../iterfaces/IRootStateProject';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import EditLists from '../edit-lists';

function WorldSettings() {
  const dispatch = useDispatch();
  const prjSettings = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));

  const saveSettings = async (newSettings: string[], table: string) => {
    await indexedDBrepository.updateProjectSettingsList(newSettings, table);
    dispatch(fetchProjectDataAction(true));
  };

  return (
    <div>
      <h2 className="cardSettingsH2">
        <img className="settingsSectionIcon icon-color" src="./world.png" alt="World icon" />
        {' '}
        Mundo
      </h2>
      <fieldset className="cardFiedset">
        <legend>
          Listas predefinidas
        </legend>
        <div className="listsSection">
          <EditLists list={prjSettings.worldCategory} projSettingsI="worldCategory" listTitle="Categorias" onDataSend={saveSettings} />
        </div>
      </fieldset>
    </div>
  );
}

export default WorldSettings;
