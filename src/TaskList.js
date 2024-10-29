import React from 'react';
import Task from './Task';

const TaskList = ({ tasks, deleteTask, toggleCompletion, editTask }) => {
  return (
    <ul>
      {tasks.map(task => (
        <Task
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleCompletion={toggleCompletion}
          editTask={editTask} // Pass editTask function
        />
      ))}
    </ul>
  );
};

export default TaskList;