import { useEffect, useRef } from 'react';
import './help-modal.css';

interface GenericModalProps {
  openModal: boolean;
  onClose: () => void;
  title: string
  mensage: string;
}

function HelpModal({
  openModal, onClose, title, mensage,
}: GenericModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-content">
        <div className="modal-help">
          <h2>{title}</h2>
          <p dangerouslySetInnerHTML={{ __html: mensage }} />
          <button onClick={() => onClose()} type="button">Fechar</button>
        </div>
      </div>
    </dialog>
  );
}

export default HelpModal;
