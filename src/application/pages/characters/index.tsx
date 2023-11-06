import { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../components/generic-modal';
import CharacterService from '../../../service/characterService';
import { fetchProjectDataAction } from '../../redux/actions';

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
    <div>
      <h1>Personagens</h1>
      <button type="button" onClick={openModal}>Novo</button>
      {isModalOpen && (
        <GenericModal onClose={closeModal} typeName="Personagem" onDataSend={handleSaveData} />
      )}
    </div>
  );
}

export default Characters;
