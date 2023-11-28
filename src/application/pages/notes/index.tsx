import { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../components/generic-modal';
import notesService from '../../../service/notesService';
import { fetchProjectDataAction } from '../../redux/actions/projectActions';

function Notes() {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleSaveData = async (data: string) => {
    await notesService.create(data);
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
        <GenericModal openModal={modal} onClose={closeModal} typeName="Nova nota" onDataSend={handleSaveData} deleteType={false} />
        {/* <WorldList /> */}
      </div>
    </div>
  );
}

export default Notes;
