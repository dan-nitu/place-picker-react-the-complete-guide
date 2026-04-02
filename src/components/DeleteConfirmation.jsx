import { useEffect } from 'react';
import ProgressBar from './ProgressBar';

const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    console.log('TIMER SET');
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);

    return () => {
      console.log('Cleaning up timer');
      clearTimeout(timer);
    };
  }, [onConfirm]);
  // useEffect can also return a function, this function will be executed when the component is unmounted or when the dependencies change, in this case, when onConfirm changes, the timer will be cleared and a new timer will be set with the new onConfirm function
  // adding functions as dependencies can cause infinite loops if the function is recreated on every render, but in this case, onConfirm is a stable function that doesn't change on every render, so it's safe to add it as a dependency

  return (
    <div id='delete-confirmation'>
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id='confirmation-actions'>
        <button onClick={onCancel} className='button-text'>
          No
        </button>
        <button onClick={onConfirm} className='button'>
          Yes
        </button>
      </div>

      <ProgressBar timer={TIMER} />
    </div>
  );
}
