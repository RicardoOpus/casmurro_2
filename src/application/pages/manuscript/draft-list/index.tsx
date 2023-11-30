import { SyntheticEvent, useEffect, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import './draft-list.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectDataAction } from '../../../redux/actions/projectActions';
import manuscriptService from '../../../../service/manuscriptService';
import IrootStateProject from '../../../../domain/IrootStateProject';
import IManuscript from '../../../../domain/IManuscript';

function DraftList() {
  const [width, setWidth] = useState(300);
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const [cenesList, setCenesList] = useState<IManuscript[]>([]);
  const dispatch = useDispatch();

  const creatNewCene = async () => {
    // const selectItem = document.querySelectorAll('.selected');
    await manuscriptService.createScene();
    dispatch(fetchProjectDataAction(true));
  };

  const onResize = (
    _e: SyntheticEvent<Element, Event>,
    data: ResizeCallbackData,
  ) => {
    if (data.size && Number(data.size.width) > 60) {
      setWidth(data.size.width);
    }
  };

  useEffect(() => {
    if (projectData.data?.manuscript) {
      setCenesList(projectData.data.manuscript);
    }
  }, [projectData.data?.manuscript]);

  useEffect(() => {
    const selectTask = (event: MouseEvent) => {
      const element = event.target as HTMLElement;
      if (element) {
        const className = element.classList[0];
        if (className === 'selected') {
          element.classList.remove('selected');
        } else {
          const mouseClick = document.querySelectorAll('.selected');
          for (let i = 0; i < mouseClick.length; i += 1) {
            mouseClick[i].classList.remove('selected');
          }
          element.classList.add('selected');
        }
      }
    };

    const taskDone = (event: MouseEvent) => {
      const element = event.target as HTMLElement;
      if (element) {
        const verify = element.classList.contains('completed');
        if (verify) {
          element.classList.remove('completed');
        } else {
          element.classList.add('completed');
        }
      }
    };

    const selectItem = document.getElementById('lista-tarefas');
    if (selectItem) {
      selectItem.addEventListener('click', selectTask);
      selectItem.addEventListener('dblclick', taskDone);
    }
  }, []);

  return (
    <Resizable className="resizableDraftList" width={width} height={100} onResize={onResize} handle={<div className="custom-handle" />}>
      <div style={{ width: `${width}px`, height: '100%' }}>
        <button onClick={creatNewCene} type="button">Nova cena</button>
        <h1>DraftList</h1>
        <div id="lista-tarefas">
          {cenesList.map((e) => (
            <div>
              {e.title}
            </div>
          ))}
        </div>
      </div>
    </Resizable>
  );
}

export default DraftList;
