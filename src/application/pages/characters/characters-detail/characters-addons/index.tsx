import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import './characters-addons.css';

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
  showBirth: boolean;
  showDeath: boolean;
  showCharact: boolean;
  showFullName: boolean;
  showNotes: boolean;
  showtaskList: boolean;
  showAge: boolean;
  showCoreGroup: boolean;
  showGender: boolean;
  showOccupation: boolean;
  // eslint-disable-next-line no-unused-vars
  handleInputCheck: (e: boolean, key: string) => void;
}

function CharAddonsModal({
  onClose,
  openModal, showBirth, showDeath, showCharact,
  showFullName, showNotes, showtaskList,
  showAge, showCoreGroup, showGender, showOccupation,
  handleInputCheck,
}: GenericModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [showFieldBirth, setShowFieldBirth] = useState(showBirth);
  const [showFieldDeath, setShowFieldDeath] = useState(showDeath);
  const [showFieldChara, setshowFieldChara] = useState(showCharact);
  const [showFieldFull, setshowFieldFull] = useState(showFullName);
  const [showFieldNotes, setshowFieldNotes] = useState(showNotes);
  const [showFieldTask, setShowFieldTask] = useState(showtaskList);
  const [showFieldAge, setshowFieldAge] = useState(showAge);
  const [showFieldCoreGroup, setshowFieldCoreGroup] = useState(showCoreGroup);
  const [showFieldGender, setshowFieldGender] = useState(showGender);
  const [showFieldOccupation, setshowFieldOccupation] = useState(showOccupation);

  const handleInputType = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    let inputType;
    let showField;
    switch (type) {
      case 'birth':
        inputType = 'showDate_birth';
        showField = setShowFieldBirth;
        break;
      case 'death':
        inputType = 'showDate_death';
        showField = setShowFieldDeath;
        break;
      case 'char':
        inputType = 'showCharacteristics';
        showField = setshowFieldChara;
        break;
      case 'full':
        inputType = 'show_full_name';
        showField = setshowFieldFull;
        break;
      case 'notes':
        inputType = 'show_notes';
        showField = setshowFieldNotes;
        break;
      case 'task':
        inputType = 'show_taskList';
        showField = setShowFieldTask;
        break;
      case 'age':
        inputType = 'show_age';
        showField = setshowFieldAge;
        break;
      case 'core_group':
        inputType = 'show_core_group';
        showField = setshowFieldCoreGroup;
        break;
      case 'gender':
        inputType = 'show_gender';
        showField = setshowFieldGender;
        break;
      case 'occupation':
        inputType = 'show_occupation';
        showField = setshowFieldOccupation;
        break;
      default:
        return;
    }
    showField(e.target.checked);
    handleInputCheck(e.target.checked, inputType);
  };

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-content">
        <h2>Adicionar campos extras</h2>
        <div className="addonsChar">
          <div className="addonsCharE">
            <div className="checkbox-wrapper">
              <div>
                <label htmlFor="showFieldFull">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldFull"
                    checked={showFieldFull}
                    onChange={(e) => handleInputType(e, 'full')}
                  />
                  {' '}
                  Nome completo
                </label>
              </div>
              <div>
                <label htmlFor="showFieldGender">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldGender"
                    checked={showFieldGender}
                    onChange={(e) => handleInputType(e, 'gender')}
                  />
                  {' '}
                  Gênero
                </label>
              </div>
              <div>
                <label htmlFor="showFieldCoreGroup">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldCoreGroup"
                    checked={showFieldCoreGroup}
                    onChange={(e) => handleInputType(e, 'core_group')}
                  />
                  {' '}
                  Núcleo
                </label>
              </div>
              <div>
                <label htmlFor="showFieldAge">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldAge"
                    checked={showFieldAge}
                    onChange={(e) => handleInputType(e, 'age')}
                  />
                  {' '}
                  Idade
                </label>
              </div>
              <div>
                <label htmlFor="showFieldOccupation">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldOccupation"
                    checked={showFieldOccupation}
                    onChange={(e) => handleInputType(e, 'occupation')}
                  />
                  {' '}
                  Ocupação
                </label>
              </div>
              <div>
                <label htmlFor="showFieldBirth">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldBirth"
                    checked={showFieldBirth}
                    onChange={(e) => handleInputType(e, 'birth')}
                  />
                  {' '}
                  Data de nascimento
                </label>
              </div>
              <div>
                <label htmlFor="showFieldDeath">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldDeath"
                    checked={showFieldDeath}
                    onChange={(e) => handleInputType(e, 'death')}
                  />
                  {' '}
                  Data de falecimento
                </label>
              </div>
              <div>
                <label htmlFor="showFieldChara">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldChara"
                    checked={showFieldChara}
                    onChange={(e) => handleInputType(e, 'char')}
                  />
                  {' '}
                  Características física e psicológicas
                </label>
              </div>
              <div>
                <label htmlFor="showFieldTask">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldTask"
                    checked={showFieldTask}
                    onChange={(e) => handleInputType(e, 'task')}
                  />
                  {' '}
                  Lista de tarefas
                </label>
              </div>
              <div>
                <label htmlFor="showFieldNotes">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldNotes"
                    checked={showFieldNotes}
                    onChange={(e) => handleInputType(e, 'notes')}
                  />
                  {' '}
                  Anotações
                </label>
              </div>
            </div>
          </div>
        </div>
        <button onClick={onClose} type="button">Fechar</button>
      </div>
    </dialog>
  );
}

export default CharAddonsModal;
