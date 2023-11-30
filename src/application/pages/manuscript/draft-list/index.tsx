import { SyntheticEvent, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import './draft-list.css';
import { useDispatch } from 'react-redux';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import GenericModal from '../../../components/generic-modal';

function DraftList() {
  const [width, setWidth] = useState(300);
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

  const onResize = (
    _e: SyntheticEvent<Element, Event>,
    data: ResizeCallbackData,
  ) => {
    if (data.size && Number(data.size.width) > 60) {
      setWidth(data.size.width);
    }
  };

  return (
    <Resizable className="resizableDraftList" width={width} height={100} onResize={onResize} handle={<div className="custom-handle" />}>
      <div className="" style={{ width: `${width}px`, height: '100%' }}>
        <div className="btnNew">
          <button type="button" onClick={openModal}>
            <span className="ui-icon ui-icon-plusthick icon-color" />
            {' '}
            Novo
          </button>
        </div>
        <h1>DraftList</h1>
        <p>Um parágrafo</p>
        {/* <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p>
        <p>Um parágrafo</p> */}
        <GenericModal openModal={modal} onClose={closeModal} typeName="Nova Cena" onDataSend={handleSaveData} deleteType={false} />
      </div>
    </Resizable>
  );
}

export default DraftList;
