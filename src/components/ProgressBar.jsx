import { useEffect, useState } from 'react';

export default function ProgressBar({ timer }) {
  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('INTERVAL');
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);
  // here we name the interval in order to be able to clear it when we return the cleanup function. otherwise it will keep running even after the component is unmounted.
  // the empty dependencies array means that this effect will only run once when the component is mounted, and the cleanup function will run when the component is unmounted.

  return <progress value={remainingTime} max={timer} />;
}
// ^ this component was outsourced because it re-renders every 10 milliseconds, which would cause the parent component to re-render every 10 milliseconds if it was defined in the parent component, and we don't want that. by outsourcing it, we can prevent the parent component from re-rendering every 10 milliseconds, and only the ProgressBar component will re-render every 10 milliseconds.
