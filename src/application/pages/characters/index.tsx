import { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../components/generic-modal';
import CharacterService from '../../../service/characterService';
import { fetchProjectDataAction } from '../../redux/actions';
import CharactersList from './characters-list';

function Characters() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const characterService = new CharacterService();
  const dispatch = useDispatch();
  const openModal = () => {
    setIsModalOpen(true);
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove('modal-open');
  };

  const handleSaveData = async (data: string) => {
    await characterService.create(data);
    dispatch(fetchProjectDataAction(true));
  };

  return (
    <div className="innerContent">
      <div className="card">
        <button type="button" onClick={openModal}>
          <span className="ui-icon ui-icon-plusthick icon-color" />
          {' '}
          Novo
        </button>
        {isModalOpen && (
          <GenericModal onClose={closeModal} typeName="Nova personagem" onDataSend={handleSaveData} />
        )}
        <CharactersList />
      </div>
    </div>
  );
}

export default Characters;
