import {
  SetStateAction, useEffect, useRef, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import text from '../../../../../public/locales/pt/translation.json';
import './backup.css';
import exportService from '../../../../service/exportServise';
import indexedDBrepository from '../../../../infra/repository/indexedDBrepository';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import exportEPUB from '../../../../service/exportEbup';

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
  backupWarning: string;
}

function BackupModal({ onClose, openModal, backupWarning }: GenericModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState('');

  const handleExport = async () => {
    await indexedDBrepository.updateLastBackup();
    dispatch(fetchProjectDataAction(true));
    switch (selectedOption) {
      case 'expDraftTXT':
        exportService.exportDraftTXT();
        return onClose();
      case 'expProjectTXT':
        exportService.exportProjectTXT();
        return onClose();
      case 'expDraftEpub':
        exportEPUB();
        return onClose();
      case 'expPDF':
        window.open('/casmurro2/#/printProject', '_blank');
        return onClose();
      case 'expDraftPDF':
        window.open('/casmurro2/#/printDraft', '_blank');
        return onClose();
      case 'expProject':
        exportService.exportProject();
        return onClose();
      default:
        return null;
    }
  };

  const handleOptionChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedOption(event.target.value);
  };

  const renderTips = (optionSelected: string) => {
    switch (optionSelected) {
      case 'expProject':
        return (
          <div>
            <img src="images/fileJson.svg" alt="json icon" />
            <div dangerouslySetInnerHTML={{ __html: text.backupModal.expProjectTip }} />
          </div>
        );
      case 'expProjectTXT':
        return (
          <div>
            <img src="images/fileTxt.svg" alt="text icon" />
            <div dangerouslySetInnerHTML={{ __html: text.backupModal.expProjectTXTTip }} />
          </div>
        );
      case 'expPDF':
        return (
          <div>
            <img src="images/print.svg" alt="print icon" />
            <div dangerouslySetInnerHTML={{ __html: text.backupModal.expPDFTip }} />
          </div>
        );
      case 'expDraftTXT':
        return (
          <div>
            <img src="images/fileTxt.svg" alt="text icon" />
            <div dangerouslySetInnerHTML={{ __html: text.backupModal.expDraftTXTTip }} />
          </div>
        );
      case 'expDraftPDF':
        return (
          <div>
            <img src="images/print.svg" alt="print icon" />
            <div dangerouslySetInnerHTML={{ __html: text.backupModal.expDraftPDFTip }} />
          </div>
        );
      case 'expDraftEpub':
        return (
          <div>
            <img src="images/epub.svg" alt="epub icon" />
            <div dangerouslySetInnerHTML={{ __html: text.backupModal.expDraftEPUBTip }} />
          </div>
        );
      default:
        return (
          <div>
            <div
              className="warningTitle"
              style={{ textAlign: 'center' }}
              dangerouslySetInnerHTML={{ __html: text.backupModal.warning }}
            />
            <div dangerouslySetInnerHTML={{ __html: text.backupModal.warningCaption }} />
          </div>
        );
    }
  };

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
      setSelectedOption('');
    }
  }, [openModal]);

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

  return (
    <dialog ref={ref} className="modal">
      <div style={{ margin: '5% auto', width: '900px' }} className="modal-content">
        <h2>{text.backupModal.title}</h2>
        <hr className="dividerBackup" />
        <div className="backupSection">
          <div className="backupOptions">
            <label htmlFor="expProject">
              <input
                id="expProject"
                type="radio"
                value="expProject"
                checked={selectedOption === 'expProject'}
                onChange={handleOptionChange}
              />
              {' '}
              {text.backupModal.expProject}
            </label>
            <label htmlFor="expProjectTXT">
              <input
                id="expProjectTXT"
                type="radio"
                value="expProjectTXT"
                checked={selectedOption === 'expProjectTXT'}
                onChange={handleOptionChange}
              />
              {' '}
              {text.backupModal.expProjectTXT}
            </label>
            <label htmlFor="expPDF">
              <input
                id="expPDF"
                type="radio"
                value="expPDF"
                checked={selectedOption === 'expPDF'}
                onChange={handleOptionChange}
              />
              {' '}
              {text.backupModal.expPDF}
            </label>
            <label htmlFor="expDraftTXT">
              <input
                id="expDraftTXT"
                type="radio"
                value="expDraftTXT"
                checked={selectedOption === 'expDraftTXT'}
                onChange={handleOptionChange}
              />
              {' '}
              {text.backupModal.expDraftTXT}
            </label>
            <label htmlFor="expDraftPDF">
              <input
                id="expDraftPDF"
                type="radio"
                value="expDraftPDF"
                checked={selectedOption === 'expDraftPDF'}
                onChange={handleOptionChange}
              />
              {' '}
              {text.backupModal.expDraftPDF}
            </label>
            <label htmlFor="expDraftEpub">
              <input
                id="expDraftEpub"
                type="radio"
                value="expDraftEpub"
                checked={selectedOption === 'expDraftEpub'}
                onChange={handleOptionChange}
              />
              {' '}
              {text.backupModal.expDraftEPUB}
            </label>
            <div className="backupWarning">
              {backupWarning}
            </div>
          </div>
          <div className="backupTips">
            {renderTips(selectedOption)}
          </div>
        </div>
        <div className="backupButtons">
          <button disabled={!selectedOption} style={{ backgroundColor: 'var(--green-color)' }} onClick={handleExport} type="button">{text.backupModal.btnExport}</button>
          <button onClick={() => onClose()} type="button">{text.basics.btnClose}</button>
        </div>
      </div>
    </dialog>
  );
}

export default BackupModal;
