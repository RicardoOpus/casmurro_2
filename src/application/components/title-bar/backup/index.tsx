import { useEffect, useRef } from 'react';
import './backup.css';
import { NavLink } from 'react-router-dom';
import exportService from '../../../../service/exportServise';

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
}

function BackupModal({ onClose, openModal }: GenericModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);

  const handleClick = (type: string) => {
    switch (type) {
      case 'expDraftTXT':
        exportService.exportDraftTXT();
        return onClose();
      default:
        return null;
    }
  };

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
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
      <div style={{ margin: '5% auto' }} className="modal-content">
        <h2>Backup</h2>
        <fieldset style={{ padding: '0 1em .5em 1em' }} className="cardFiedset">
          <legend className="legendMedium">
            Dados do Projeto
            <span className="spanField">(Tudo)</span>
          </legend>
          <div className="backupField">
            <button onClick={() => handleClick('expProject')} disabled className="btnJson" type="button">
              🠗 Exportar Projeto
            </button>
            <button onClick={() => handleClick('expTXT')} disabled className="btnTXT" type="button">
              🠗 Salvar texto
            </button>
            <button onClick={() => handleClick('expPDF')} disabled className="btnPDF" type="button">
              🠗 Impressão
            </button>
          </div>
        </fieldset>
        <fieldset style={{ padding: '0 1em .5em 1em', marginTop: '1em' }} className="cardFiedset">
          <legend className="legendMedium">
            Manuscrito
            <span className="spanField">(Somente Cenas)</span>
          </legend>
          <div className="backupField">
            <button onClick={() => handleClick('expDraftTXT')} className="btnTXT" type="button">
              🠗 Salvar texto
            </button>
            <button onClick={() => handleClick('expDraftPDF')} className="btnPDF" type="button">
              <NavLink to="/printDraft" target="_blank" style={{ all: 'unset' }}>
                🠗 Impressão
              </NavLink>
            </button>
          </div>
        </fieldset>
        <h3 style={{ marginBottom: '0', color: 'var(--text-color-inactive)' }}>Atenção! Mantenha seus dados seguros</h3>
        <p className="backupFieldP">
          Casmurro respeita sua privacidade e não coleta informações.
          Isso significa que todos os dados são armazenados
          localmente em seu próprio navegador. Portando, é
          recomendável fazer backups com frequência e salvá-los
          em pastas sincronizadas na nuvem,
          como o Google Drive ou Dropbox.
        </p>
        <button onClick={() => onClose()} type="button">Fechar</button>
      </div>
    </dialog>
  );
}

export default BackupModal;
