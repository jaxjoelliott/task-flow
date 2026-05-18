import React, { useState } from 'react';

const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 };

const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'Done') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const [sortOrder, setSortOrder] = useState('none');

  if (!tasks.length) {
    return <p>No tasks yet. Add your first task above.</p>;
  }

  const handleStatusChange = (task, newStatus) => {
    onUpdateTask(task._id, { ...task, status: newStatus });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOrder === 'high-to-low') return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
    if (sortOrder === 'low-to-high') return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    return 0;
  });

  return (
    <div>
      <div className="sort-controls">
        <label htmlFor="priority-sort">Sort by priority:</label>
        <select
          id="priority-sort"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="none">Default</option>
          <option value="high-to-low">High to Low</option>
          <option value="low-to-high">Low to High</option>
        </select>
      </div>
    <div className="task-list">
      {sortedTasks.map((task) => (
        <div className={`task-card${isOverdue(task) ? ' task-card--overdue' : ''}`} key={task._id}>
          <div className="task-header">
            <h3>{task.title}</h3>
            <div className="task-badges">
              {isOverdue(task) && (
                <span className="overdue-badge">Overdue</span>
              )}
              <span className={`status-badge status-${task.status.replace(' ', '').toLowerCase()}`}>
                {task.status}
              </span>
            </div>
          </div>
          {task.description && <p className="task-desc">{task.description}</p>}
          <div className="task-meta">
            {task.dueDate && (
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
            <span>Priority: {task.priority}</span>
          </div>
          <div className="task-actions">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task, e.target.value)}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <button
              className="danger-button"
              onClick={() => onDeleteTask(task._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default TaskList;
