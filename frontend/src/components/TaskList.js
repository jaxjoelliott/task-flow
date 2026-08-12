import React, { useState } from 'react';
import TaskCard from './TaskCard';
import {
  STATUSES,
  PRIORITIES,
  PRIORITY_RANK,
  DUE_BUCKETS,
  isOverdue,
  dueBucket,
  collectTags,
  taskHasTag,
} from '../utils/tasks';

const STATUS_VAR = {
  'To Do': 'var(--status-todo)',
  'In Progress': 'var(--status-inprogress)',
  Done: 'var(--status-done)',
};

const COLUMN_EMPTY_HINT = {
  'To Do': 'Nothing to do',
  'In Progress': 'Nothing in progress',
  Done: 'Nothing done yet',
};

const SkeletonBoard = () => (
  <div className="board">
    {STATUSES.map((status) => (
      <div className="column" key={status}>
        <div className="column-header">
          <span className="dot" style={{ backgroundColor: STATUS_VAR[status] }} />
          <span className="column-title">{status}</span>
        </div>
        <div className="column-list">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </div>
    ))}
  </div>
);

const TaskList = ({ tasks, loading, onUpdateTask, onDeleteTask }) => {
  const [search, setSearch] = useState('');
  const [priorityFilters, setPriorityFilters] = useState(() => new Set());
  const [tagFilters, setTagFilters] = useState(() => new Set());
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [groupBy, setGroupBy] = useState('status');
  const [sort, setSort] = useState('none');

  const [dragTaskId, setDragTaskId] = useState(null);
  const [dropColumn, setDropColumn] = useState(null);

  const availableTags = collectTags(tasks);

  const togglePriority = (p) => {
    setPriorityFilters((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const toggleTag = (tag) => {
    const key = tag.toLowerCase();
    setTagFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (loading) return <SkeletonBoard />;

  const query = search.trim().toLowerCase();
  const filtered = tasks.filter((t) => {
    if (query) {
      const haystack = `${t.title} ${t.description || ''} ${(t.tags || []).join(' ')}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (priorityFilters.size && !priorityFilters.has(t.priority)) return false;
    if (tagFilters.size) {
      const taskKeys = new Set((t.tags || []).map((tag) => tag.toLowerCase()));
      let hit = false;
      for (const key of tagFilters) {
        if (taskKeys.has(key)) {
          hit = true;
          break;
        }
      }
      if (!hit) return false;
    }
    if (overdueOnly && !isOverdue(t)) return false;
    return true;
  });

  const sortFn = (a, b) => {
    if (sort === 'priority-desc') return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
    if (sort === 'priority-asc') return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (sort === 'due-asc') {
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return ad - bd;
    }
    return 0;
  };

  // ── Drag and drop (status board only) ──────────────────────────────────
  const handleDragStart = (e, task) => {
    setDragTaskId(task._id);
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnd = () => {
    setDragTaskId(null);
    setDropColumn(null);
  };
  const handleColumnDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropColumn !== status) setDropColumn(status);
  };
  const handleColumnDragLeave = (e) => {
    // Ignore leaves that land on a child element; only clear when the pointer
    // actually exits the column, so the highlight doesn't stick in board gaps.
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setDropColumn(null);
  };
  const handleColumnDrop = (e, status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || dragTaskId;
    const task = tasks.find((t) => t._id === id);
    if (task && task.status !== status) onUpdateTask(id, { ...task, status });
    setDragTaskId(null);
    setDropColumn(null);
  };

  const cardProps = {
    onUpdateTask,
    onDeleteTask,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  };

  const controls = (
    <>
      <div className="controls">
        <input
          className="search-input"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSearch('');
          }}
          placeholder="Search tasks…"
          aria-label="Search tasks"
        />
        <div className="segmented" role="group" aria-label="Group by">
          {[
            ['status', 'Board'],
            ['priority', 'Priority'],
            ['due', 'Due'],
            ['tag', 'Tag'],
          ].map(([value, label]) => (
            <button
              key={value}
              className={groupBy === value ? 'is-active' : ''}
              onClick={() => setGroupBy(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort tasks">
          <option value="none">Sort: Default</option>
          <option value="priority-desc">Priority: High → Low</option>
          <option value="priority-asc">Priority: Low → High</option>
          <option value="due-asc">Due: Soonest</option>
        </select>
      </div>
      <div className="filter-chips">
        {PRIORITIES.map((p) => (
          <button
            key={p}
            className={`chip${priorityFilters.has(p) ? ' is-active' : ''}`}
            aria-pressed={priorityFilters.has(p)}
            onClick={() => togglePriority(p)}
          >
            <span className={`chip-dot priority-${p}`} />
            {p}
          </button>
        ))}
        <button
          className={`chip${overdueOnly ? ' is-active' : ''}`}
          aria-pressed={overdueOnly}
          onClick={() => setOverdueOnly((v) => !v)}
        >
          Overdue only
        </button>
      </div>
      {availableTags.length > 0 && (
        <div className="filter-chips filter-chips--tags" role="group" aria-label="Filter by tag">
          {availableTags.map((tag) => {
            const active = tagFilters.has(tag.toLowerCase());
            return (
              <button
                key={tag.toLowerCase()}
                className={`chip chip--tag${active ? ' is-active' : ''}`}
                aria-pressed={active}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}
    </>
  );

  const noResults =
    filtered.length === 0 && (query || priorityFilters.size || tagFilters.size || overdueOnly);
  const noTasks = tasks.length === 0;

  let body;
  if (noTasks) {
    body = (
      <div className="empty-state">
        <h3>No tasks yet</h3>
        <p>Capture your first task in the bar above — just type and press Enter.</p>
      </div>
    );
  } else if (noResults) {
    body = (
      <div className="empty-state">
        <h3>No matching tasks</h3>
        <p>Try clearing the search or filters.</p>
      </div>
    );
  } else if (groupBy === 'status') {
    const grouped = STATUSES.reduce((acc, s) => ({ ...acc, [s]: [] }), {});
    for (const t of filtered) (grouped[t.status] || grouped['To Do']).push(t);
    body = (
      <div className="board">
        {STATUSES.map((status) => {
          const items = grouped[status].slice().sort(sortFn);
          return (
            <div
              key={status}
              className={`column${dropColumn === status ? ' column--drop-target' : ''}`}
              onDragOver={(e) => handleColumnDragOver(e, status)}
              onDragLeave={handleColumnDragLeave}
              onDrop={(e) => handleColumnDrop(e, status)}
            >
              <div className="column-header">
                <span className="dot" style={{ backgroundColor: STATUS_VAR[status] }} />
                <span className="column-title">{status}</span>
                <span className="column-count num">{items.length}</span>
              </div>
              <div className="column-list">
                {items.length === 0 ? (
                  <div className="column-empty">{COLUMN_EMPTY_HINT[status]}</div>
                ) : (
                  items.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      isDragging={dragTaskId === task._id}
                      {...cardProps}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  } else if (groupBy === 'tag') {
    // Multi-tag tasks appear under each matching tag; untagged tasks get their own section.
    const buckets = [...availableTags, 'Untagged'];
    const grouped = buckets.reduce((acc, b) => ({ ...acc, [b]: [] }), {});

    for (const t of filtered) {
      const taskTags = t.tags || [];
      if (!taskTags.length) {
        grouped.Untagged.push(t);
        continue;
      }
      for (const tag of availableTags) {
        if (taskHasTag(t, tag)) grouped[tag].push(t);
      }
    }

    body = (
      <div>
        {buckets.map((bucket) => {
          const items = grouped[bucket].slice().sort(sortFn);
          if (items.length === 0) return null;
          return (
            <section className="group-section" key={bucket}>
              <div className="group-section-header">
                <span className="section-label">{bucket}</span>
                <span className="column-count num">{items.length}</span>
              </div>
              <div className="group-list">
                {items.map((task) => (
                  <TaskCard
                    key={`${bucket}-${task._id}`}
                    task={task}
                    isDragging={false}
                    draggable={false}
                    {...cardProps}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  } else {
    // Grouped sectioned list (priority or due). Not draggable.
    const buckets = groupBy === 'priority' ? ['High', 'Medium', 'Low'] : DUE_BUCKETS;
    const keyOf = groupBy === 'priority' ? (t) => t.priority : dueBucket;
    const grouped = buckets.reduce((acc, b) => ({ ...acc, [b]: [] }), {});
    for (const t of filtered) if (grouped[keyOf(t)]) grouped[keyOf(t)].push(t);

    body = (
      <div>
        {buckets.map((bucket) => {
          const items = grouped[bucket].slice().sort(sortFn);
          if (items.length === 0) return null;
          return (
            <section className="group-section" key={bucket}>
              <div className="group-section-header">
                {groupBy === 'priority' && <span className={`chip-dot priority-${bucket}`} />}
                <span className="section-label">{bucket}</span>
                <span className="column-count num">{items.length}</span>
              </div>
              <div className="group-list">
                {items.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    isDragging={false}
                    draggable={false}
                    {...cardProps}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {controls}
      {body}
    </div>
  );
};

export default TaskList;
