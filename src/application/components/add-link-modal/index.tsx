import {
  useEffect, useRef, useState,
} from 'react';
import ILinks from '../../../iterfaces/ILinks';
import utils from '../../../service/utils';

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
  currentList: ILinks[];
  // eslint-disable-next-line no-unused-vars
  updateLinks: (data: ILinks[]) => void;
}

function LinksModal({
  onClose, openModal, currentList, updateLinks,
}: GenericModalProps) {
  const [linkURL, setLinkURL] = useState('');
  const [linkName, setLinkName] = useState('');
  const hasURL = linkURL.trim() === '';
  const hasName = linkName.trim() === '';
  const ref = useRef<HTMLDialogElement | null>(null);

  const saveRelation = () => {
    const isValid = utils.isValideURL(linkURL);
    if (isValid) {
      const newLink = { linkName, URL: linkURL };
      if (currentList) {
        const updatedLinks = [...(currentList || []), newLink];
        updateLinks(updatedLinks);
      }
      onClose();
    } else {
      // eslint-disable-next-line no-alert
      alert("O endereço UEL deve começar com 'https://' ou 'http://'");
    }
  };

  const handleKeyPress = (event: { key: string; }) => {
    if (event.key === 'Enter' && !hasURL && !hasName) {
      saveRelation();
    }
  };

  const handleCancel = () => onClose();

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
      setLinkName('');
      setLinkURL('');
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-content">
        <h2>Adicionar link externo</h2>
        <h3 className="h3Relatoins">Nome:</h3>
        <input
          className="cardInput"
          type="text"
          value={linkName}
          onChange={(e) => setLinkName(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ex: Casmurro Wikipédia"
        />
        <h3 className="h3Relatoins">URL:</h3>
        <input
          className="cardInput"
          type="text"
          value={linkURL}
          onChange={(e) => setLinkURL(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="https://novo.endereco..."
        />
        <div className="button-container">
          <button id="btnSavePr" onClick={saveRelation} type="button" disabled={hasName || hasURL}>Adicionar</button>
          <button onClick={handleCancel} type="button">Fechar</button>
        </div>
      </div>
    </dialog>
  );
}

export default LinksModal;
