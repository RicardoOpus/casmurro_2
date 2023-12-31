import { useEffect, useRef, useState } from 'react';

interface GenericModalProps {
  onClose: () => void;
  typeName: string;
  subTitle?: string;
  // eslint-disable-next-line no-unused-vars
  onDataSend: (data: string) => void;
  deleteType: boolean;
  openModal: boolean;
}

function getIconPath(category: string): string {
  switch (category) {
    case 'Nova personagem':
      return './images/characters.png';
    case 'Novo item mundo':
      return './images/world.png';
    case 'Nova Cena':
      return './images/scene.png';
    case 'Linha do tempo':
      return './images/timeline.png';
    case 'Nova nota':
      return './images/notes.png';
    default:
      return './images/delete.png';
  }
}

function GenericModal({
  onClose, typeName, subTitle, onDataSend, deleteType, openModal,
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
    const handleEscapeKeyPress = (event: { key: string }) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKeyPress);
    return () => {
      document.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, [onClose]);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      SetNewItemTitle('');
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-content">
        <div className="modal-border">
          <img className="icon-color" src={getIconPath(typeName)} alt="type icon" />
          <h2>
            {typeName}
          </h2>
          {subTitle && (
            <p>{subTitle}</p>
          )}
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
      </div>
    </dialog>
  );
}

GenericModal.defaultProps = {
  subTitle: undefined,
};

export default GenericModal;
