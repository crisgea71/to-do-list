import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update the time every second

    return () => clearInterval(timerId); // Cleanup timer on unmount
  }, []);

  return (
    <span style={{ fontSize: '1.2em', fontWeight: 'bold', marginLeft: '20px' }}>
      {time.toLocaleTimeString()} {/* Format time as a locale string */}
    </span>
  );
};

export default Clock;