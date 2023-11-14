import { useEffect, useRef, useState } from 'react';

interface GenericModalProps {
  onClose: () => void;
  typeName: string;
  // eslint-disable-next-line no-unused-vars
  onDataSend: (data: string) => void;
  deleteType: boolean;
  openModal: boolean;
}

function getIconPath(category: string): string {
  switch (category) {
    case 'Nova personagem':
      return './characters.png';
    case 'Mundo':
      return './world.png';
    case 'Cena':
      return './scene.png';
    case 'Linha do tempo':
      return './timeline.png';
    case 'Nota':
      return './notes.png';
    default:
      return './delete.png';
  }
}

function GenericModal({
  onClose, typeName, onDataSend, deleteType, openModal,
}: GenericModalProps) {
  const [newItemTitle, SetNewItemTitle] = useState('');
  const isSaveButtonDisabled = newItemTitle.trim() === '';
  const handleCancel = () => onClose();
  const ref = useRef<HTMLDialogElement | null>(null);

  const sendDataToParent = () => {
    onDataSend(newItemTitle);
    onClose();
  };

  const handleKeyPress = (event: { key: string; }) => {
    if (event.key === 'Enter' && !isSaveButtonDisabled) {
      sendDataToParent();
    }
  };

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      SetNewItemTitle('');
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} id="newModal" className="modal">
      <div className="modal-content">
        <div className="corner ponto1" />
        <div className="corner ponto2" />
        <div className="modal-border">
          <img className="icon-color" src={getIconPath(typeName)} alt="type icon" />
          <h2>
            {typeName}
          </h2>
          {!deleteType && (
            <input
              className="cardInputTitle"
              type="text"
              placeholder="Título"
              value={newItemTitle}
              onChange={(e) => SetNewItemTitle(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          )}
          <div className="button-container">
            {deleteType ? (
              <button className="delteBtn" id="btnSavePr" onClick={sendDataToParent} type="button">Deletar</button>
            ) : (
              <button id="btnSavePr" onClick={sendDataToParent} type="button" disabled={isSaveButtonDisabled}>Salvar</button>
            )}
            <button onClick={handleCancel} type="button">Cancelar</button>
          </div>
        </div>
        <div className="corner ponto3" />
        <div className="corner ponto4" />
      </div>
    </dialog>
  );
}

export default GenericModal;
