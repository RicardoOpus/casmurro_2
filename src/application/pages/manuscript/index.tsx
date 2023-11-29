import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProjectDataAction } from '../../redux/actions/projectActions';
import GenericModal from '../../components/generic-modal';

function Manuscript() {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleSaveData = async (data: string) => {
    // await characterService.create(data);
    console.log(data);
    dispatch(fetchProjectDataAction(true));
    setModal(false);
  };

  return (
    <div>
      <div className="btnNew">
        <button type="button" onClick={openModal}>
          <span className="ui-icon ui-icon-plusthick icon-color" />
          {' '}
          Novo
        </button>
      </div>
      <GenericModal openModal={modal} onClose={closeModal} typeName="Nova personagem" onDataSend={handleSaveData} deleteType={false} />
      {/* <CharactersList /> */}
    </div>
  );
}

export default Manuscript;
