import { useDispatch, useSelector } from 'react-redux';
import EditLists from '../edit-lists';
import IrootStateProject from '../../../../domain/IrootStateProject';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';

function CharactersSettings() {
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
        <img className="settingsSectionIcon icon-color" src="./characters.png" alt="Character icon" />
        {' '}
        Personagens
      </h2>
      <fieldset className="cardFiedset">
        <legend>
          Listas predefinidas
        </legend>
        <div className="listsSection">
          <EditLists list={prjSettings.charactersCategory} projSettingsI="charactersCategory" listTitle="Categorias" onDataSend={saveSettings} />
          <EditLists list={prjSettings.charactersGenders} projSettingsI="charactersGenders" listTitle="Gênero" onDataSend={saveSettings} />
          <EditLists list={prjSettings.charactersCoreGroupes} projSettingsI="charactersCoreGroupes" listTitle="Núcleos" onDataSend={saveSettings} />
        </div>
      </fieldset>
    </div>
  );
}

export default CharactersSettings;
