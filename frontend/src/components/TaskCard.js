import React, { useState } from 'react';
import { STATUSES, PRIORITIES, getDueMeta, isOverdue } from '../utils/tasks';

// A dueDate (ISO or 'YYYY-MM-DD', stored at UTC midnight) -> the 'YYYY-MM-DD'
// value a native <input type="date"> expects, read in UTC to keep the calendar day.
const toDateInputValue = (dueDate) => {
  if (!dueDate) return '';
  const d = new Date(dueDate);
  if (Number.isNaN(d.getTime())) return '';
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${d.getUTCFullYear()}-${m}-${day}`;
};

// A single draggable task card with click-to-edit title/description and a
// <select> status fallback for touch / keyboard / small screens.
const TaskCard = ({
  task,
  onUpdateTask,
  onDeleteTask,
  onDragStart,
  onDragEnd,
  isDragging,
  draggable = true,
}) => {
  const [editingField, setEditingField] = useState(null); // 'title' | 'description' | null
  const [draft, setDraft] = useState('');

  const startEdit = (field) => {
    setEditingField(field);
    setDraft(task[field] || '');
  };

  const commit = () => {
    if (editingField) {
      const value = draft.trim();
      // Never persist an empty title (mirrors the create-form guard); revert instead.
      if (editingField === 'title' && !value) {
        setEditingField(null);
        return;
      }
      if (value !== (task[editingField] || '')) {
        onUpdateTask(task._id, { ...task, [editingField]: value });
      }
    }
    setEditingField(null);
  };

  const cancel = () => setEditingField(null);

  // Keyboard entry point for click-to-edit (Enter/Space) so it isn't mouse-only.
  const editKeyDown = (field) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      startEdit(field);
    }
  };

  // Priority (enum) and due date commit immediately on change — no draft needed.
  const commitPriority = (value) => {
    if (value !== task.priority) onUpdateTask(task._id, { ...task, priority: value });
    setEditingField(null);
  };

  const commitDue = (inputValue) => {
    if (inputValue !== toDateInputValue(task.dueDate)) {
      // Send null (not '') to clear, so Mongoose casts it cleanly to no-date.
      onUpdateTask(task._id, { ...task, dueDate: inputValue || null });
    }
    setEditingField(null);
  };

  const handleKeyDown = (e, multiline) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    } else if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      commit();
    }
  };

  const due = getDueMeta(task);
  const overdue = isOverdue(task);

  const canDrag = draggable && editingField === null;
  const classNames = [
    'task-card',
    overdue ? 'task-card--overdue' : '',
    task.status === 'Done' ? 'task-card--done' : '',
    isDragging ? 'is-dragging' : '',
    draggable ? '' : 'task-card--static',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      draggable={canDrag}
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
    >
      <div className="task-card-top">
        <span className={`priority-dot priority-${task.priority}`} title={`${task.priority} priority`} />
        {editingField === 'title' ? (
          <input
            className="edit-input"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => handleKeyDown(e, false)}
          />
        ) : (
          <span
            className="task-title"
            role="button"
            tabIndex={0}
            onClick={() => startEdit('title')}
            onKeyDown={editKeyDown('title')}
            title="Click to edit"
          >
            {task.title}
          </span>
        )}
      </div>

      {editingField === 'description' ? (
        <textarea
          className="edit-textarea"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => handleKeyDown(e, true)}
        />
      ) : task.description ? (
        <p
          className="task-desc"
          role="button"
          tabIndex={0}
          onClick={() => startEdit('description')}
          onKeyDown={editKeyDown('description')}
          title="Click to edit"
        >
          {task.description}
        </p>
      ) : (
        <p
          className="task-desc is-placeholder"
          role="button"
          tabIndex={0}
          onClick={() => startEdit('description')}
          onKeyDown={editKeyDown('description')}
          title="Click to add a description"
        >
          Add a description…
        </p>
      )}

      <div className="task-meta">
        {editingField === 'dueDate' ? (
          <input
            className="edit-meta-input"
            type="date"
            autoFocus
            value={toDateInputValue(task.dueDate)}
            onChange={(e) => commitDue(e.target.value)}
            onBlur={() => setEditingField(null)}
          />
        ) : due.label ? (
          <button
            type="button"
            className={`due-pill due-pill--${due.tier} meta-edit`}
            onClick={() => startEdit('dueDate')}
            title="Click to change due date"
          >
            {due.label}
          </button>
        ) : (
          <button
            type="button"
            className="due-pill due-pill--normal meta-edit meta-add"
            onClick={() => startEdit('dueDate')}
            title="Set a due date"
          >
            + Due date
          </button>
        )}

        {editingField === 'priority' ? (
          <select
            className="edit-meta-input"
            autoFocus
            value={task.priority}
            onChange={(e) => commitPriority(e.target.value)}
            onBlur={() => setEditingField(null)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        ) : (
          <button
            type="button"
            className="priority-tag meta-edit"
            onClick={() => startEdit('priority')}
            title="Click to change priority"
          >
            {task.priority}
          </button>
        )}
      </div>

      <div className="task-card-actions">
        <select
          className="status-select"
          value={task.status}
          aria-label="Change status"
          onChange={(e) => onUpdateTask(task._id, { ...task, status: e.target.value })}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="delete-button"
          aria-label="Delete task"
          title="Delete"
          onClick={() => onDeleteTask(task._id)}
        >
          🗑
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
