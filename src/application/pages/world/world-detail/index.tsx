import { useParams } from 'react-router-dom';
import BackButton from '../../../components/back-button';
import NextAndPrevCard from '../../../components/next-and-prev';

function WorldDetail() {
  const { id } = useParams();

  return (
    <div className="innerContent">
      <div className="card">
        <BackButton page="/world" />
        <NextAndPrevCard id={Number(id)} dataTable="world" />
      </div>
    </div>
  );
}

export default WorldDetail;
