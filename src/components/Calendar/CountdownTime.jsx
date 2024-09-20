import React, { useState, useEffect } from 'react';

const CountdownTime = ({ totalTimeMinutes }) => {

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const hours = Math.floor(totalTimeMinutes / 60);
      const minutes = totalTimeMinutes % 60;
      const seconds = 0; // Bắt đầu đếm ngược từ 0 giây

      setTimeLeft({
        hours,
        minutes,
        seconds
      });

      // Giảm thời gian đi 1 giây
      totalTimeMinutes--;

      // Kết thúc đếm ngược nếu hết thời gian
      if (totalTimeMinutes < 0) {
        clearInterval(countdownInterval);
      }
    }, 1000); // Đếm ngược mỗi giây

    return () => clearInterval(countdownInterval); // Clear interval khi unmount component
  }, [totalTimeMinutes]);

  // Định dạng chuỗi để hiển thị đếm ngược
  const formatTime = (time) => {
    return time.toString().padStart(2, '0');
  };

  return (
    <div className="countdown-timer">
      <div className="countdown-item">
        <span>{formatTime(timeLeft.hours)}</span>:
        <span>{formatTime(timeLeft.minutes)}</span>:
        <span>{formatTime(timeLeft.seconds)}</span>
      </div>
    </div>
  );
};

export default CountdownTime;
