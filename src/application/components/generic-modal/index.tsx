import { useState } from 'react';

interface GenericModalProps {
  onClose: () => void;
  typeName: string;
  // eslint-disable-next-line no-unused-vars
  onDataSend: (data: string) => void;
}

function GenericModal({ onClose, typeName, onDataSend }: GenericModalProps) {
  const [newItemTitle, SetNewItemTitle] = useState('');
  const isSaveButtonDisabled = newItemTitle.trim() === '';
  const handleCancel = () => onClose();

  const sendDataToParent = () => {
    onDataSend(newItemTitle);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="corner ponto1" />
        <div className="corner ponto2" />
        <div className="modal-border">
          <h2>
            Novo
            {' '}
            {typeName}
          </h2>
          <input
            className="cardInputTitle"
            type="text"
            placeholder="Título"
            value={newItemTitle}
            onChange={(e) => SetNewItemTitle(e.target.value)}
          />
          <div className="button-container">
            <button id="btnSavePr" onClick={sendDataToParent} type="button" disabled={isSaveButtonDisabled}>Salvar</button>
            <button onClick={handleCancel} type="button">Cancelar</button>
          </div>
        </div>
        <div className="corner ponto3" />
        <div className="corner ponto4" />
      </div>
    </div>
  );
}

export default GenericModal;
