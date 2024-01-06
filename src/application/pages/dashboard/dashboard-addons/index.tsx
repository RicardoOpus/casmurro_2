import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';

interface GenericModalProps {
  onClose: () => void;
  openModal: boolean;
  showSubtitle: boolean;
  showAuthor: boolean;
  // eslint-disable-next-line no-unused-vars
  handleInputCheck: (e: boolean, key: string) => void;
}

function DashboardAddonsModal({
  onClose,
  openModal, showSubtitle, showAuthor, handleInputCheck,
}: GenericModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [showFieldSubtitle, setshowFieldSubtitle] = useState(showSubtitle);
  const [showFieldAuthor, setshowFieldAuthor] = useState(showAuthor);

  const handleInputType = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === 'showFieldSubtitle') {
      setshowFieldSubtitle(e.target.checked);
      handleInputCheck(e.target.checked, 'showSubtitle');
    } if (type === 'showFieldAuthor') {
      setshowFieldAuthor(e.target.checked);
      handleInputCheck(e.target.checked, 'showAuthor');
    }
  };

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      setshowFieldSubtitle(showSubtitle);
      setshowFieldAuthor(showAuthor);
      ref.current?.close();
    }
  }, [openModal, showAuthor, showSubtitle]);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-content">
        <h2>Mostrar campos extras</h2>
        <div className="addonsChar">
          <div className="addonsCharE">
            <div className="checkbox-wrapper">
              <div>
                <label htmlFor="showFieldSubtitle">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldSubtitle"
                    checked={showFieldSubtitle}
                    onChange={(e) => handleInputType(e, 'showFieldSubtitle')}
                  />
                  {' '}
                  Subtítulo da obra
                </label>
              </div>
              <div>
                <label htmlFor="showFieldAuthor">
                  <input
                    className="inputChkBox"
                    type="checkbox"
                    id="showFieldAuthor"
                    checked={showFieldAuthor}
                    onChange={(e) => handleInputType(e, 'showFieldAuthor')}
                  />
                  {' '}
                  Autor ou pseudônimo
                </label>
              </div>
            </div>
          </div>
        </div>
        <button onClick={onClose} type="button">Fechar</button>
      </div>
    </dialog>
  );
}

export default DashboardAddonsModal;
