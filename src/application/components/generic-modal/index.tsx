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
        <h2>
          Novo
          {' '}
          {typeName}
        </h2>
        <input
          className="cardInput"
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
    </div>
  );
}

export default GenericModal;
