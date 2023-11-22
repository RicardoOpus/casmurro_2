import './no-data.css';
import nodata from '../../../../public/no-data.png';

function NoData({ dataType }: { dataType: string }) {
  return (
    <div className="noData icon-">
      <h2>
        Não existem
        {' '}
        {dataType}
        {' '}
        no momento
      </h2>
      <img className="icon-color" src={nodata} alt="ilustração caderno em branco" />
    </div>
  );
}

export default NoData;
