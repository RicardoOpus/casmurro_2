import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import indexedDBrepository from '../../../infra/repository/indexedDBrepository';
import './next-and-prev.css';

interface NextPrevProps {
  id: number;
  dataTable: string;
}

function NextAndPrevCard({ id, dataTable }: NextPrevProps) {
  const navigate = useNavigate();
  const [idNext, setIdNext] = useState(0);
  const [idPrev, setIdPrev] = useState(0);

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
      {idPrev !== 0 && idPrev !== id && (
        <button className="btnInvisible" type="button" onClick={() => navigate(`/${dataTable}/${idPrev}`)}>
          <span className="ui-icon ui-icon-circle-arrow-w icon-color" />
          {' '}
          Anterior
        </button>
      )}
      {idNext !== 0 && idNext !== id && (
        <button className="btnInvisible" type="button" onClick={() => navigate(`/${dataTable}/${idNext}`)}>
          Próximo
          {' '}
          <span className="ui-icon ui-icon-circle-arrow-e icon-color" />
        </button>
      )}
    </div>
  );
}

export default NextAndPrevCard;
