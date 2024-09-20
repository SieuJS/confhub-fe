import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CountdownTimer = ({ targetDate }) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  function calculateTimeRemaining() {
    const now = new Date();
    const target = new Date(targetDate);
    const totalSeconds = Math.floor((target - now) / 1000);

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='fs-6 text-danger'>
      <span>{timeRemaining.days}d </span>
      <span>{timeRemaining.hours}h </span>
      <span>{timeRemaining.minutes}m </span>
      <span>{timeRemaining.seconds}s</span>
    </div>
  );
};

export default CountdownTimer;
