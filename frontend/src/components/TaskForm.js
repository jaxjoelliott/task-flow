import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { PRIORITIES, normalizeTags } from '../utils/tasks';
import TagInput from './TagInput';

const PRIORITY_LABEL = { Low: 'Low', Medium: 'Medium', High: 'High' };

// Persistent single-line quick-capture bar. Enter submits with sensible
// defaults; the chevron expands description / due date / priority / tags.
// Status is intentionally omitted — the board owns status; new tasks are 'To Do'.
const TaskForm = forwardRef(({ onAddTask }, ref) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [tags, setTags] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const titleRef = useRef(null);

  // Let the parent focus the input (keyboard shortcut / after-mount).
  useImperativeHandle(ref, () => ({
    focus: () => titleRef.current?.focus(),
  }));

  const reset = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    setTags([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title: title.trim(),
      description,
      dueDate,
      priority,
      status: 'To Do',
      tags: normalizeTags(tags),
    });
    reset();
    titleRef.current?.focus();
  };

  return (
    <form className="quick-capture" onSubmit={handleSubmit}>
      <div className="capture-row">
        <input
          ref={titleRef}
          className="capture-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task, press Enter  ( / to focus )"
          aria-label="Task title"
        />
        <button
          type="button"
          className="icon-button"
          aria-label={expanded ? 'Hide details' : 'Show details'}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? '⌃' : '⌄'}
        </button>
        <button type="submit" className="primary-button">
          Add
        </button>
      </div>

      {expanded && (
        <div className="capture-expand">
          <div className="form-group full">
            <label htmlFor="qc-description">Description</label>
            <textarea
              id="qc-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details…"
            />
          </div>
          <div className="form-group">
            <label htmlFor="qc-dueDate">Due date</label>
            <input
              id="qc-dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <span className="section-label">Priority</span>
            <div className="chip-group" role="group" aria-label="Priority">
              {PRIORITIES.map((p) => (
                <button
                  type="button"
                  key={p}
                  className={`chip${priority === p ? ' is-active' : ''}`}
                  aria-pressed={priority === p}
                  onClick={() => setPriority(p)}
                >
                  <span className={`chip-dot priority-${p}`} />
                  {PRIORITY_LABEL[p]}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group full">
            <label htmlFor="qc-tags">Tags</label>
            <TagInput id="qc-tags" tags={tags} onChange={setTags} placeholder="work, school…" />
          </div>
        </div>
      )}
    </form>
  );
});

export default TaskForm;
