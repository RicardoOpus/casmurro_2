import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IrootStateProject from '../../../domain/IrootStateProject';
import IProject from '../../../domain/projectModel';
import './dashboard.css';
import dashboardService from '../../../service/dashboardService';
import { fetchProjectDataAction } from '../../redux/actions/projectActions';
import utils from '../../../service/utils';
import DashboardAddonsModal from './dashboard-addons';
import GenericModal from '../../components/generic-modal';
import DeadlineModal from './dashboard-deadline';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [modalAddons, setModalAddons] = useState(false);
  const [modalDeadline, setModalDeadline] = useState(false);
  const project = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData));
  const [stateProject,
    setStateProject] = useState<IProject | Partial<IProject>>(project || {});

  const cleanupFunction = () => {
    dispatch(fetchProjectDataAction(true));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const updatedState = { ...stateProject, [key]: e.target.value, last_edit: Date.now() };
    setStateProject(updatedState);
    dashboardService.upDate(updatedState as IProject);
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    const updatedState = { ...stateProject, [key]: e.target.value, last_edit: Date.now() };
    setStateProject(updatedState);
    dashboardService.upDate(updatedState as IProject);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, key: string) => {
    const updatedState = { ...stateProject, [key]: e.target.value, last_edit: Date.now() };
    setStateProject(updatedState);
    dashboardService.upDate(updatedState as IProject);
  };

  const handleInputCheck = (e: boolean, key: string) => {
    const updatedState = { ...stateProject, [key]: e, last_edit: Date.now() };
    setStateProject(updatedState);
    dashboardService.upDate(updatedState as IProject);
  };

  const saveImage = async (event: EventTarget & HTMLInputElement) => {
    if (event && event.files && event.files.length > 0) {
      const base64Data = await utils.convertBase64(event.files[0]);
      const base64String = base64Data?.toString();
      if (base64String) {
        const updatedState = { ...stateProject, image_project: base64String.toString() };
        setStateProject(updatedState);
        dashboardService.upDate(updatedState as IProject);
      }
    }
  };

  const clearImage = () => {
    const updatedState = { ...stateProject, image_project: '' };
    setStateProject(updatedState);
    dashboardService.upDate(updatedState as IProject);
  };

  const handleFileInput = (event: EventTarget & HTMLInputElement) => {
    if (utils.isImageFile(event.value)) {
      saveImage(event);
    } else {
      // eslint-disable-next-line no-alert
      alert('O arquivo selecionado não é uma imagem!');
    }
  };

  const updateDeadline = (date1: string, date2: string) => {
    const updatedState = {
      ...stateProject,
      startDate: date1,
      finishDate: date2,
      last_edit: Date.now(),
    };
    setStateProject(updatedState);
    dashboardService.upDate(updatedState as IProject);
  };

  const handleDelete = async () => {
    await dashboardService.deleteProject();
    navigate('/projects');
  };

  useEffect(() => {
    setStateProject(project || {});
  }, [project]);

  useEffect(() => {
    utils.autoGrowAllTextareas();
  }, [stateProject]);

  return (
    <div className="innerContent">
      <div className="card">
        <input
          onChange={(e) => handleInputChange(e, 'title')}
          value={stateProject.title}
          className="dashboardTitle"
          type="text"
          placeholder="Título"
          onBlur={cleanupFunction}
        />
        {stateProject?.showSubtitle && (
          <input
            onChange={(e) => handleInputChange(e, 'subtitle')}
            value={stateProject?.subtitle}
            className="dashboardSubTitle"
            type="text"
            placeholder="Subtítulo"
          />
        )}
        {stateProject?.showAuthor && (
          <input
            onChange={(e) => handleInputChange(e, 'author')}
            value={stateProject?.author}
            className="dashboardAuthor"
            type="text"
            placeholder="Autor ou pseudônimo"
          />
        )}
        {stateProject.image_project && (
          <div style={{ margin: '1em 0' }} className="imageCardBackgournd">
            <div className="cardImageDiv" style={{ backgroundImage: `url(${stateProject.image_project})` }}>
              <img className="cardImage" src={stateProject.image_project} id="output" alt="character" />
            </div>
          </div>
        )}
        <div className="detailBarButtons">
          <div className="detailBarButtonsItens">
            <span className="tooltip-default" data-balloon aria-label="Definir prazo de conclusão" data-balloon-pos="down">
              <label className="deadlineIcon" htmlFor="deadlineIcon">
                <button id="deadlineIcon" onClick={() => setModalDeadline(true)} className="btnInvisible" type="button">{ }</button>
              </label>
            </span>
            <span className="tooltip-default" data-balloon aria-label="Adicionar imagem" data-balloon-pos="down">
              <label htmlFor="addImage">
                <div className="profile-pic addImage">
                  <input
                    id="addImage"
                    onChange={(e) => handleFileInput(e.target)}
                    type="file"
                  />
                </div>
              </label>
            </span>
            <span className="tooltip-default" data-balloon aria-label="Remover imagem" data-balloon-pos="down">
              <label className="removeImage" htmlFor="removeImage">
                <button id="removeImage" onClick={clearImage} className="btnInvisible" type="button">{ }</button>
              </label>
            </span>
          </div>
          <div className="detailBarButtonsItens">
            <span className="tooltip-default" data-balloon aria-label="Mostrar/ocultar campos extras" data-balloon-pos="down">
              <button className="detailAdd" type="button" onClick={() => setModalAddons(true)}>{ }</button>
            </span>
            <button onClick={() => setModal(true)} className="btnSmall" type="button">
              <span className="ui-icon ui-icon-trash icon-color" />
              {' '}
              Excluir
            </button>
          </div>
        </div>
        <div className="divider div-transparent" />
        <div className="charBasicInfos">
          <div>
            <h3>Status</h3>
            <select
              className="selectFullWith"
              value={stateProject?.status}
              onChange={(e) => handleSelectChange(e, 'status')}
            >
              <option value="">{ }</option>
              <option value="Arquivado">Arquivado</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Não iniciado">Não iniciado</option>
              <option value="Novo">Novo</option>
              <option value="Pausado">Pausado</option>
            </select>
          </div>
          <div>
            <h3>Categoria</h3>
            <select
              className="selectFullWith"
              value={stateProject?.literary_genre}
              onChange={(e) => handleSelectChange(e, 'literary_genre')}
            >
              <option value="">{ }</option>
              <option value="Romance Épico">Romance Épico</option>
              <option value="Romance">Romance</option>
              <option value="Novela">Novela</option>
              <option value="Noveleta">Noveleta</option>
              <option value="Conto">Conto</option>
              <option value="Microconto">Microconto</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>
        <textarea
          className="projectResumeInput"
          placeholder="Resumo do projeto"
          value={stateProject?.projectResume}
          onChange={(e) => handleTextAreaChange(e, 'projectResume')}
        />
      </div>
      {stateProject.title && (
        <>
          <DeadlineModal
            openModal={modalDeadline}
            onClose={() => setModalDeadline(false)}
            startDateProject={stateProject.startDate || ''}
            finishDateProject={stateProject.finishDate || ''}
            updateDeadline={updateDeadline}
          />
          <DashboardAddonsModal
            openModal={modalAddons}
            onClose={() => setModalAddons(false)}
            showSubtitle={stateProject.showSubtitle || false}
            showAuthor={stateProject.showAuthor || false}
            handleInputCheck={handleInputCheck}
          />
        </>
      )}
      <GenericModal
        openModal={modal}
        onClose={() => setModal(false)}
        typeName="Deseja realmente excluir o Projeto?"
        subTitle="Essa ação não poderá ser desfeita"
        onDataSend={handleDelete}
        deleteType
      />
    </div>
  );
}

export default Dashboard;
