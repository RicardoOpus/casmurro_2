import { useEffect, useState } from 'react';

interface GenericModalProps {
  onClose: () => void;
  typeName: string;
  // eslint-disable-next-line no-unused-vars
  onDataSend: (data: string) => void;
}

function GenericModal({ onClose, typeName, onDataSend }: GenericModalProps) {
  const [newItemTitle, SetNewItemTitle] = useState('');
  const [uiMode, SetUiMode] = useState('light-mode');
  const isSaveButtonDisabled = newItemTitle.trim() === '';
  const handleCancel = () => onClose();

  const sendDataToParent = () => {
    onDataSend(newItemTitle);
    onClose();
  };

  useEffect(() => {
    const storedMode = localStorage.getItem('uiMode');
    if (storedMode === 'light') {
      SetUiMode('light-mode');
    } else {
      SetUiMode('dark-mode');
    }
  }, []);

  return (
    <div className="modal">
      <div className="modal-content">
        <img className="ponto1" src={uiMode === 'light-mode' ? './corner.png' : 'corner-dark.png'} alt="ponto" />
        <img className="ponto2" src={uiMode === 'light-mode' ? './corner.png' : 'corner-dark.png'} alt="ponto" />
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
        <img className="ponto3" src={uiMode === 'light-mode' ? './corner.png' : 'corner-dark.png'} alt="ponto" />
        <img className="ponto4" src={uiMode === 'light-mode' ? './corner.png' : 'corner-dark.png'} alt="ponto" />
      </div>
    </div>
  );
}

export default GenericModal;
