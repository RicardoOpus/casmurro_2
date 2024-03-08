import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import indexedDBrepository from '../../../infra/repository/indexedDBrepository';
import './next-and-prev.css';
import { fetchProjectDataAction } from '../../redux/actions/projectActions';

interface NextPrevProps {
  id: number;
  dataTable: string;
  callback: () => void;
  isSceneDetail: boolean;
  // eslint-disable-next-line no-unused-vars,
}

function NextAndPrevCard({
  id, dataTable, callback, isSceneDetail,
}: NextPrevProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [idNext, setIdNext] = useState(0);
  const [idPrev, setIdPrev] = useState(0);

  const handleClick = (next: boolean) => {
    dispatch(fetchProjectDataAction(true));
    callback();
    if (next) {
      navigate(`/${isSceneDetail ? 'draftDetail' : dataTable}/${idNext}`);
    } else {
      navigate(`/${isSceneDetail ? 'draftDetail' : dataTable}/${idPrev}`);
    }
  };

  useEffect(() => {
    const positionInArray = async () => {
      const result = await indexedDBrepository.getNextAndPrevCardID(id, dataTable);
      if (result && result.nextID) {
        setIdNext(result.nextID);
      }
      if (result && result.prevID) {
        setIdPrev(result.prevID);
      }
    };
    positionInArray();
  }, [dataTable, id]);

  return (
    <div className="nexAndPrevBtns">
      <button disabled={idPrev === 0 && idPrev !== id} className="btnInvisible" type="button" onClick={() => handleClick(false)}>
        <span className="ui-icon ui-icon-circle-arrow-w icon-color" />
        {' '}
        Anterior
      </button>
      <button disabled={idNext === 0 && idNext !== id} className="btnInvisible NextBtn" type="button" onClick={() => handleClick(true)}>
        Próximo
        {' '}
        <span className="ui-icon ui-icon-circle-arrow-e icon-color" />
      </button>
    </div>
  );
}

export default NextAndPrevCard;
