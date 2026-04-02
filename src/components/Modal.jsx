import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, children, onClose }) {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);
  // ^ open is a dependency, so the function will be executed every time the value of open changes
  // dependency = a value that the function depends on, if the value changes, the function will be executed again

  return createPortal(
    <dialog className='modal' ref={dialog} onClose={onClose}>
      {open ? children : null}
    </dialog>,
    document.getElementById('modal'),
  );
}

export default Modal;
