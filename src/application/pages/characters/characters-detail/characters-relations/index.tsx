import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import ICharacter from '../../../../../iterfaces/characterModel';
import IRelation from '../../../../../iterfaces/IRelation';

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
  charList: ICharacter[] | undefined;
  currentCharacter: ICharacter | Partial<ICharacter>;
  // eslint-disable-next-line no-unused-vars
  updateCharacterRelations: (data: IRelation[]) => void;
}

function CharRelationsModal({
  onClose, openModal, charList, currentCharacter, updateCharacterRelations,
}: GenericModalProps) {
  const [relationType, setRelationType] = useState('');
  const [relationCharID, setrelationCharID] = useState(0);
  const hasType = relationType.trim() === '';
  const hasID = relationCharID === 0;
  const ref = useRef<HTMLDialogElement | null>(null);

  const saveRelation = () => {
    const newRelation = { charID: relationCharID, type: relationType };
    if (currentCharacter) {
      const updatedRelations = [...(currentCharacter.relations || []), newRelation];
      // eslint-disable-next-line no-param-reassign
      currentCharacter.relations = updatedRelations;
      if (currentCharacter && currentCharacter.id) {
        updateCharacterRelations(updatedRelations);
      }
    }
    onClose();
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
      <div className="modal-content">
        <h2>Definir relações</h2>
        <h3 className="h3Relatoins">Personagem:</h3>
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
        <h3 className="h3Relatoins">Tipo de relação:</h3>
        <input
          className="cardInput"
          type="text"
          placeholder="amigo, pai, filho, irmão, escudeiro, ajudante..."
          value={relationType}
          onChange={(e) => setRelationType(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div className="button-container">
          <button id="btnSavePr" onClick={saveRelation} type="button" disabled={hasID || hasType}>Adicionar</button>
          <button onClick={handleCancel} type="button">Fechar</button>
        </div>
      </div>
    </dialog>
  );
}

export default CharRelationsModal;
