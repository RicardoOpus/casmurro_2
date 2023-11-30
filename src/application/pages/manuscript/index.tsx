import DraftDetail from './draft-detail';
import DraftList from './draft-list';
import './manuscript.css';
import Writer from './writer';

function Manuscript() {
  return (
    <div className="manuscriptMain">
      <DraftList />
      <div style={{ width: '100%' }}>
        <DraftDetail />
        <Writer />
      </div>
    </div>
  );
}

export default Manuscript;
