import { useDispatch, useSelector } from 'react-redux';
import IrootStateProject from '../../../../domain/IrootStateProject';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import EditLists from '../edit-lists';

function NotesSettings() {
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
          <img className="settingsSectionIcon icon-color" src="./notes.png" alt="World icon" />
          {' '}
          Notas
        </legend>
        <div className="listsSection">
          <EditLists list={prjSettings.notesCategory} projSettingsI="notesCategory" listTitle="Categorias" onDataSend={saveSettings} />
        </div>
      </fieldset>
    </div>
  );
}

export default NotesSettings;
