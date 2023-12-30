import {
  useState, ChangeEvent, useRef, useEffect,
} from 'react';
import './newProjectModal.css';
import 'balloon-css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import projectServide from '../../../../service/projectsService';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';

interface NewProjectModalProps {
  onClose: () => void;
  openModal: boolean;
}

function NewProjectModal({ onClose, openModal }: NewProjectModalProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [projectName, setProjectName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [warningTerms, setWarningTerms] = useState(false);
  const isSaveButtonDisabled = projectName.trim() === '';
  const handleCancel = () => onClose();
  const ref = useRef<HTMLDialogElement | null>(null);

  const handleCreate = async () => {
    if (!agreedToTerms) {
      return setWarningTerms(true);
    }
    await projectServide.create(projectName);
    dispatch(fetchProjectDataAction(true));
    navigate('/');
    return onClose();
  };

  const handleAgreeToTerms = (e: ChangeEvent<HTMLInputElement>) => {
    setAgreedToTerms(e.target.checked);
  };

  const handleKeyPress = (event: { key: string; }) => {
    if (event.key === 'Enter' && !isSaveButtonDisabled && agreedToTerms) {
      handleCreate();
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
      setProjectName('');
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} className="modal" data-testid="modal-new-project">
      <div className="modal-content">
        <div className="corner ponto1" />
        <div className="corner ponto2" />
        <div className="modal-border">
          <h2>Novo Projeto</h2>
          <input
            className="cardInputTitle"
            type="text"
            placeholder="Título do projeto"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <label htmlFor="termos-uso">
            <input
              id="termos-uso"
              type="checkbox"
              onChange={handleAgreeToTerms}
            />
            {' '}
            Li e concordo com os termos de uso.
          </label>
          {(warningTerms) && (
            <p className="tooltip-big-text" data-balloon-visible aria-label="Você deve concordar com os termos." data-balloon-pos="down" />
          )}
          <div className="termos-uso">
            <p>
              Ao marcar esta caixa, você está consentindo com os seguintes termos
              {' '}
              e condições relacionados ao uso deste programa:
            </p>
            <p>
              1. O programa é gratuito e sem garantias: Este programa é disponibilizado
              {' '}
              gratuitamente e não oferece garantias de qualquer tipo. Você entende que o programa
              {' '}
              é fornecido &quot;no estado em que se encontra&quot; e que o uso é por sua própria
              {' '}
              contae risco. Não há garantias de desempenho,
              {' '}
              confiabilidade ou adequação a qualquer finalidade específica.
            </p>
            <p>
              2. Responsabilidade pelo backup de arquivos:
              {' '}
              É de sua responsabilidade fazer regularmente cópias de
              {' '}
              segurança de seus arquivos e dados. O programa pode estar sujeito a falhas e
              {' '}
              problemas técnicos, e não nos responsabilizamos por quaisquer
              {' '}
              perdas ou danos aos seus arquivos.
            </p>
            <p>
              3. Testes exaustivos, mas sem garantia de ausência de erros: Embora
              {' '}
              tenhamos feito testes exaustivos, você compreende que nenhum programa
              {' '}
              de software está livre de erros. Não podemos garantir que o programa estará
              {' '}
              isento de erros ou que atenderá a todas as suas expectativas.
              {' '}
              Você reconhece que podem ocorrer problemas imprevistos durante o uso.
            </p>
          </div>
          <div className="button-container">
            <button id="btnSavePr" onClick={handleCreate} type="button" disabled={isSaveButtonDisabled}>Salvar</button>
            <button onClick={handleCancel} type="button">Cancelar</button>
          </div>
        </div>
        <div className="corner ponto3" />
        <div className="corner ponto4" />
      </div>
    </dialog>
  );
}

export default NewProjectModal;
