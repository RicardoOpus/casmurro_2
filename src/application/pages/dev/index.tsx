import IndexedDBrepository from '../../../infra/repository/indexedDBrepository';

function Dev() {
  const indexedDBrepository = new IndexedDBrepository();

  return (
    <div>
      <h2>Rotinas dev</h2>
      <div>
        <button onClick={indexedDBrepository.deleteDB}>Deletar DB</button>
        <button onClick={indexedDBrepository.populeDB}>Popular DB Simple</button>
      </div>
    </div>
  )
}

export default Dev;
