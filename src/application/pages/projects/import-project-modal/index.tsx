/* eslint-disable no-alert */
import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import IProject from '../../../../interfaces/IProject';
import projectServide from '../../../../service/projectsService';

interface ModalProps {
  onClose: () => void;
  openModal: boolean;
}

function ImportProjectModal({ onClose, openModal }: ModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const navigate = useNavigate();
  const [file, setFile] = useState('');
  const [restoredProject, setRestoresProject] = useState<IProject>();
  const handleCancel = () => onClose();

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          try {
            const jsonData = JSON.parse(e.target.result as string);
            setRestoresProject(jsonData);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Erro ao analisar o JSON:', error);
          }
        }
      };
      reader.readAsText(event.target.files[0]);
      setFile(event.target.files[0].name);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      if (!projectServide.verifyFileExtension(event.target.files[0].name)) {
        return alert('Selecione apenas arquivos terminados em .json');
      }
      handleImport(event);
    }
    return null;
  };

  const importProject = async () => {
    if (restoredProject) {
      const now = Date.now();
      delete restoredProject.id;
      restoredProject.lastBackup = 0;
      restoredProject.last_edit = now;
      await projectServide.importJson(restoredProject);
      navigate('/');
    }
  };

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
      setFile('');
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-content">
        <div className="modal-border">
          <h2>Importar Projeto</h2>
          <div className="importBtn">
            <label htmlFor="importProjetct" className="importLabel">
              <div className="profile-pic importIcon">
                <input
                  type="file"
                  accept=".json"
                  id="importProjetct"
                  onChange={handleFileChange}
                />
              </div>
              <span>
                Selecione o arquivo
              </span>
            </label>
          </div>
          <p>
            {file}
          </p>
          <div className="button-container">
            <button onClick={importProject} type="button" disabled={file === ''} style={{ backgroundColor: 'var(--green-color)' }}>Importar</button>
            <button onClick={handleCancel} type="button">Cancelar</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default ImportProjectModal;
