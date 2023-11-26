import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import ICharacter from '../../../../../domain/characterModel';
import Alert from '../../../../components/alert';
import indexedDBrepository from '../../../../../infra/repository/indexedDBrepository';

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
  charList: ICharacter[] | undefined;
  currentCharacter: ICharacter | undefined;
}

function CharRelationsModal({
  onClose, openModal, charList, currentCharacter,
}: GenericModalProps) {
  const [relationType, setRelationType] = useState('');
  const [relationCharID, setrelationCharID] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const hasType = relationType.trim() === '';
  const hasID = relationCharID === 0;
  const ref = useRef<HTMLDialogElement | null>(null);

  const handleAlertClose = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  const saveRelation = () => {
    const newRelation = { charID: relationCharID, type: relationType };
    if (currentCharacter) {
      currentCharacter.relations?.push(newRelation);
      indexedDBrepository.characterUpdate(currentCharacter.id, currentCharacter);
    }
    handleAlertClose();
    setRelationType('');
    setrelationCharID(0);
  };

  const handleKeyPress = (event: { key: string; }) => {
    if (event.key === 'Enter' && !hasType && !hasID) {
      saveRelation();
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setrelationCharID(Number(e.target.value));
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
      setRelationType('');
      setrelationCharID(0);
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} className="modal">
      {showAlert && <Alert mensage="Adicionado!" />}
      <div className="modal-content">
        <h2>Definir relações</h2>
        <h3>Personagem:</h3>
        <select
          value={relationCharID}
          className="selectFullWith"
          onChange={(e) => handleSelectChange(e)}
        >
          <option value="">{ }</option>
          {charList?.map((char) => (
            char.id !== currentCharacter?.id && (
              <option key={char.id} value={char.id}>
                •
                {' '}
                {char.title}
              </option>
            )
          ))}
        </select>
        <h3>Tipo de relação:</h3>
        <input
          className="cardInputTitle"
          type="text"
          placeholder="amigo, pai, filho, irmão, escudeiro, ajudante..."
          value={relationType}
          onChange={(e) => setRelationType(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button id="btnSavePr" onClick={saveRelation} type="button" disabled={hasID || hasType}>Adicionar</button>
        <button onClick={handleCancel} type="button">Fechar</button>
      </div>
    </dialog>
  );
}

export default CharRelationsModal;
