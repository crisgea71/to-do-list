import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import Clock from './Clock';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]); // State to hold tasks
  const [taskInput, setTaskInput] = useState(''); // State for task input
  const [currentTaskId, setCurrentTaskId] = useState(null); // Track the current task ID
  const [scheduledTime, setScheduledTime] = useState(''); // State for scheduled time
  const [alertMessages, setAlertMessages] = useState([]); // State for alert messages

  const addTask = (task) => {
    const taskToAdd = task.toUpperCase();
    if (currentTaskId) {
      setTasks(tasks.map(t => t.id === currentTaskId ? { ...t, text: taskToAdd, time: scheduledTime } : t));
      setCurrentTaskId(null);
    } else {
      setTasks([...tasks, { id: Date.now(), text: taskToAdd, completed: false, time: scheduledTime }]);
    }
    setTaskInput('');
    setScheduledTime('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    // Remove alert if task is deleted
    setAlertMessages(prev => prev.filter(msg => msg.taskId !== id));
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    setTaskInput(taskToEdit.text);
    setScheduledTime(taskToEdit.time);
    setCurrentTaskId(id);
  };

  // Alert user about tasks at the scheduled time and check for 5-minute alerts
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      tasks.forEach(task => {
        const taskTime = new Date();
        const [hours, minutes] = task.time.split(':');
        taskTime.setHours(hours, minutes, 0); // Set hours and minutes

        // Check for 5-minute alert
        const timeDiff = taskTime - now; // Difference in milliseconds
        if (timeDiff > 0 && timeDiff <= 300000) { // 5 minutes in milliseconds
          // Check if the alert for this task is already set
          if (!alertMessages.some(msg => msg.taskId === task.id)) {
            setAlertMessages(prev => [...prev, { taskId: task.id, text: `Reminder: You have a task scheduled - "${task.text}" in 5 minutes!` }]);
            playAlertSound(); // Play alert sound
          }
        } else if (timeDiff <= 0) { // If time has expired
          setAlertMessages(prev => prev.filter(msg => msg.taskId !== task.id)); // Remove expired task from alert messages
        }
      });
    }, 1000); // Check every second for precise timing

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [tasks, alertMessages]);

  // Function to play an alert sound
  const playAlertSound = () => {
    const audio = new Audio('https://www.soundjay.com/button/sounds/beep-07.mp3'); // Updated URL for the alert sound
    audio.play().catch((error) => {
      console.error("Error playing sound:", error); // Log any error
    });
  };

  return (
    <div className="app">
      <h1>To-Do List <Clock /></h1>
      {alertMessages.length > 0 && (
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Reminder</th>
            </tr>
          </thead>
          <tbody>
            {alertMessages.map((msg, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{msg.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission
          addTask(taskInput); // Use taskInput for adding/editing
        }}
      >
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)} // Update task input state
          placeholder="Add a new task..."
          required // Make it required
        />
        <input
          type="time"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)} // Update scheduled time state
          required // Make it required
        />
        <button type="submit">{currentTaskId ? 'Update Task' : 'Add Task'}</button>
      </form>
      <TaskList 
        tasks={tasks} 
        deleteTask={deleteTask} 
        toggleCompletion={toggleCompletion} 
        editTask={editTask} // Pass editTask function
      />
    </div>
  );
};

export default App;