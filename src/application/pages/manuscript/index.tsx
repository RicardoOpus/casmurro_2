import { useSelector } from 'react-redux';
import DraftDetail from './draft-detail';
import DraftList from './draft-list';
import './manuscript.css';
import Writer from './writer';

interface IrootState {
  manuscriptReducer: {
    colapse: boolean,
  }
}

function Manuscript() {
  const toColapse = useSelector((state: IrootState) => (
    state.manuscriptReducer.colapse));

  return (
    <div className="manuscriptMain">
      <DraftList />
      <div style={{ width: '100%' }}>
        {!toColapse && (
          <DraftDetail />
        )}
        {/* <Writer /> */}
      </div>
    </div>
  );
}

export default Manuscript;
