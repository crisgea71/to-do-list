import React, { useState, useEffect } from 'react';

const Task = ({ task, deleteTask, toggleCompletion, editTask }) => {
  const [remainingTime, setRemainingTime] = useState('');

  // Function to calculate the remaining time until the scheduled time
  const updateRemainingTime = () => {
    const now = new Date();
    const [hours, minutes] = task.time.split(':');
    const scheduledDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    const timeDiff = scheduledDate - now; // Difference in milliseconds

    if (timeDiff > 0) {
      const totalSeconds = Math.floor(timeDiff / 1000); // Convert milliseconds to seconds
      const hrs = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      setRemainingTime(`${hrs}h ${mins}m ${secs}s`);
    } else {
      setRemainingTime('Time Passed'); // Handle past scheduled time
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      updateRemainingTime();
    }, 1000); // Update every second

    // Initialize remaining time
    updateRemainingTime();

    return () => clearInterval(timerId); // Cleanup timer on unmount
  }, [task.time]);

  return (
    <li style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
      <span>{task.text}</span>
      <span style={{ marginLeft: '10px', fontStyle: 'italic', color: '#555' }}>
        {task.time ? `Scheduled: ${task.time} - ${remainingTime}` : ''} {/* Display scheduled time and remaining time */}
      </span>
      <div className="task-buttons">
        <button onClick={() => toggleCompletion(task.id)}>
          {task.completed ? 'Undo' : 'Complete'}
        </button>
        <button onClick={() => editTask(task.id)}>Edit</button>
        <button onClick={() => deleteTask(task.id)}>Delete</button>
      </div>
    </li>
  );
};

export default Task;