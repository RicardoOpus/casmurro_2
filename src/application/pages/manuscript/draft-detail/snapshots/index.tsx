/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import './snapshots.css';
import { v4 as uuidv4 } from 'uuid';
import ISnapshots from '../../../../../interfaces/ISnapshots';
import utils from '../../../../../service/utils';

interface GenericModalProps {
  openModal: boolean;
  onClose: () => void;
  snapshots: ISnapshots[];
  currentScene: string;
  deleteSnapshot: (i: number) => void;
  restoreSnapshot: (text: string) => void;
}

function Snapshots({
  openModal, onClose, snapshots, currentScene, deleteSnapshot, restoreSnapshot,
}: GenericModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [selectedSnap, setSelectedSnap] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showWarningDel, setShowWarningDel] = useState(false);
  const [showWarningRestore, setShowWarningRestore] = useState(false);

  const handleClick = (text: string, index: number) => {
    setSelectedSnap(text);
    setSelectedIndex(index);
    setShowWarningDel(false);
    setShowWarningRestore(false);
  };

  const handleDelete = () => {
    deleteSnapshot(selectedIndex);
    setShowWarningDel(false);
    setSelectedSnap('');
    setSelectedIndex(-1);
  };

  const handleRestore = () => {
    restoreSnapshot(selectedSnap);
    setShowWarningDel(false);
    setSelectedSnap('');
    setSelectedIndex(-1);
  };

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      setSelectedSnap('');
      setSelectedIndex(-1);
      setShowWarningDel(false);
      setShowWarningRestore(false);
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-content-snap">
        <h2 style={{ marginBottom: '0.5em' }}>Snapshots</h2>
        <div className="snapshot-inner">
          <div className="snapshotList">
            <h2>Instantêneos</h2>
            <div className="snapshotListInner">
              {snapshots.map((e, i) => (
                <button
                  className={i === selectedIndex ? 'snapshotModaListSelect' : 'snapshotModaList'}
                  type="button"
                  id={i.toString()}
                  key={uuidv4()}
                  onClick={() => handleClick(e.text, i)}
                >
                  {utils.convertDateBRhm(e.createdAt)}
                </button>
              ))}
            </div>
          </div>
          <div className="snapshotView">
            <h2>
              Texto atual
              <span style={{ fontSize: 'medium' }}>
                {' '}
                (
                {utils.countWords(currentScene)}
                )
              </span>
            </h2>
            <hr />
            <p dangerouslySetInnerHTML={{ __html: currentScene }} />
          </div>
          <div className="snapshotView">
            <h2>
              Texto do instantâneo
              <span style={{ fontSize: 'medium' }}>
                {' '}
                (
                {utils.countWords(selectedSnap)}
                )
              </span>
            </h2>
            <hr />
            {!showWarningDel && !showWarningRestore && selectedSnap !== '' && (
              <div className="snapshotViewBtns">
                <button onClick={() => setShowWarningDel(true)} type="button" className="btnSmall">Apagar</button>
                <button onClick={() => setShowWarningRestore(true)} type="button" className="btnSmall">Restaurar</button>
              </div>
            )}
            {showWarningDel && (
              <div className="snapWarning">
                <p>Tem certeza que gostaria de apagar esse instantâneo?</p>
                <div className="snapshotViewBtns">
                  <button onClick={handleDelete} className="btnSmall" type="button">Sim</button>
                  <button onClick={() => setShowWarningDel(false)} className="btnSmall" type="button">Não</button>
                </div>
                <hr />
              </div>
            )}
            {showWarningRestore
              && selectedSnap !== ''
              && selectedSnap !== '<p><br></p>'
              && (
                <div className="snapWarning">
                  <p>Essa ação substituirá a cena atual pela versão abaixo. Deseja continuar?</p>
                  <div className="snapshotViewBtns">
                    <button onClick={handleRestore} className="btnSmall" type="button">Sim</button>
                    <button onClick={() => setShowWarningRestore(false)} className="btnSmall" type="button">Não</button>
                  </div>
                  <hr />
                </div>
              )}
            <p dangerouslySetInnerHTML={{ __html: selectedSnap }} />
          </div>
        </div>
        <button onClick={() => onClose()} type="button">Fechar</button>
      </div>
    </dialog>
  );
}

export default Snapshots;
