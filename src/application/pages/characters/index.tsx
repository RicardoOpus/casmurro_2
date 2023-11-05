import { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../components/generic-modal';
import CharacterService from '../../../service/characterService';
import indexedDBrepository from '../../../infra/repository/indexedDBrepository';
import { projectDataAction } from '../../redux/actions';

function Charaters() {
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
    const fetchData = async () => {
      const projectItem = await indexedDBrepository.getCurrentProject();
      if (projectItem) {
        dispatch(projectDataAction(projectItem));
      }
    };
    fetchData();
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

export default Charaters;
