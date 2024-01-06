import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import ICharacter from '../../../../../interfaces/ICharacter';

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
  charList: ICharacter[] | undefined;
  sceneCharacters: number[];
  // eslint-disable-next-line no-unused-vars
  updateCharacterRelations: (data: number[]) => void;
}

function CharSceneModal({
  onClose, openModal, charList, sceneCharacters, updateCharacterRelations,
}: GenericModalProps) {
  const [idsList, setIdsList] = useState<number[]>([]);
  const ref = useRef<HTMLDialogElement | null>(null);

  const handleInputType = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const list = [...idsList];
    const index = list.indexOf(value);
    if (index !== -1) {
      list.splice(index, 1);
    } else {
      list.push(value);
    }
    setIdsList(list);
    updateCharacterRelations(list);
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
      ref.current?.close();
    }
  }, [openModal]);

  useEffect(() => {
    setIdsList(sceneCharacters);
  }, [sceneCharacters]);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-content">
        <h2>Personagens em cena</h2>
        <div className="addonsChar">
          <div className="addonsCharE">
            <div className="checkbox-wrapper">
              {charList?.map((char) => (
                <div key={char.id}>
                  <label htmlFor={`${char.id}`}>
                    <input
                      className="inputChkBox"
                      type="checkbox"
                      id={`${char.id}`}
                      value={char.id}
                      checked={sceneCharacters.includes(char.id)}
                      onChange={(e) => handleInputType(e)}
                    />
                    {' '}
                    {char.title}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="button-container">
          <button onClick={handleCancel} type="button">Fechar</button>
        </div>
      </div>
    </dialog>
  );
}

export default CharSceneModal;
