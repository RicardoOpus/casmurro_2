import { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../components/generic-modal';
import CharacterService from '../../../service/characterService';
import { fetchProjectDataAction } from '../../redux/actions/projectActions';
import CharactersList from './characters-list';

function Characters() {
  const characterService = new CharacterService();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleSaveData = async (data: string) => {
    await characterService.create(data);
    dispatch(fetchProjectDataAction(true));
    setModal(false);
  };

  return (
    <div className="innerContent">
      <div className="card">
        <div className="btnNew">
          <button type="button" onClick={openModal}>
            <span className="ui-icon ui-icon-plusthick icon-color" />
            {' '}
            Novo
          </button>
        </div>
        <GenericModal openModal={modal} onClose={closeModal} typeName="Nova personagem" onDataSend={handleSaveData} deleteType={false} />
        <CharactersList />
      </div>
    </div>
  );
}

export default Characters;
