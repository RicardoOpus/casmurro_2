import './no-data.css';
import nodata from '../../../../public/no-data.png';

function NoData({ dataType }: { dataType: string }) {
  return (
    <div className="noData">
      <img src={nodata} alt="ilustração caderno em branco" />
      <h2>
        Sem
        {' '}
        {dataType}
        {' '}
        no momento
      </h2>
    </div>
  );
}

export default NoData;
