import { useState, ChangeEvent } from 'react';
import './newProjectModal.css';
import 'balloon-css';
import { useNavigate } from 'react-router-dom';
import ProjectServide from '../../../../service/projectsService';

interface NewProjectModalProps {
  onClose: () => void;
}

function NewProjectModal({ onClose }: NewProjectModalProps) {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [warningTerms, setWarningTerms] = useState(false);
  const isSaveButtonDisabled = projectName.trim() === '';
  const handleCancel = () => onClose();

  const handleCreate = async () => {
    if (!agreedToTerms) {
      return setWarningTerms(true);
    }
    const projectServide = new ProjectServide();
    await projectServide.create(projectName);
    navigate('/');
    return onClose();
  };

  const handleAgreeToTerms = (e: ChangeEvent<HTMLInputElement>) => {
    setAgreedToTerms(e.target.checked);
  };

  return (
    <div className="modal" data-testid="modal-new-project">
      <div className="modal-content">
        <h2>Novo Projeto</h2>
        <input
          className="cardInput"
          type="text"
          placeholder="Título do projeto"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
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
    </div>
  );
}

export default NewProjectModal;
