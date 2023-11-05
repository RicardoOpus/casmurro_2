import indexedDBrepository from '../../../infra/repository/indexedDBrepository';

function Dev() {
  return (
    <div>
      <h2>Rotinas dev</h2>
      <div>
        <button type="button" onClick={indexedDBrepository.deleteDB}>Deletar DB</button>
        <button type="button" onClick={indexedDBrepository.populeDB}>Popular DB Simple</button>
      </div>
    </div>
  );
}

export default Dev;
