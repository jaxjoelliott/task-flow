// Shared task helpers — one source of truth for status/priority ordering and
// due-date reasoning, consumed by the board, the filters, and the chart.

export const STATUSES = ['To Do', 'In Progress', 'Done'];
export const PRIORITIES = ['Low', 'Medium', 'High'];
export const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 };

const DAY_MS = 24 * 60 * 60 * 1000;

// A dueDate is a calendar day the user picked via <input type="date">. Whether it
// arrives as 'YYYY-MM-DD' (parsed as UTC midnight per spec) or as a full ISO
// 'YYYY-MM-DDT00:00:00.000Z' from the backend, `new Date(...).setHours(0,0,0,0)`
// shifts it to the previous day in any negative-UTC-offset timezone. Rebuild the
// date at LOCAL midnight from its UTC calendar components so day math is stable.
const parseDueDate = (dueDate) => {
  const d = new Date(dueDate);
  if (Number.isNaN(d.getTime())) return d;
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

// Midnight-normalized day difference between a task's dueDate and today
// (positive = future, 0 = today, negative = overdue).
const daysUntilDue = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = parseDueDate(dueDate);
  return Math.round((due - today) / DAY_MS);
};

export const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'Done') return false;
  return daysUntilDue(task.dueDate) < 0;
};

// Human-friendly due-date meta used for both the label and the color tier.
// tier: 'overdue' | 'due-soon' | 'normal' | 'none'
export const getDueMeta = (task) => {
  if (!task.dueDate) return { tier: 'none', label: '' };
  const days = daysUntilDue(task.dueDate);
  const done = task.status === 'Done';

  if (!done && days < 0) {
    const n = Math.abs(days);
    return { tier: 'overdue', label: n === 1 ? 'Overdue by 1 day' : `Overdue by ${n} days` };
  }
  if (days === 0) return { tier: done ? 'normal' : 'due-soon', label: 'Due today' };
  if (days === 1) return { tier: done ? 'normal' : 'due-soon', label: 'Due tomorrow' };
  if (days > 1 && days <= 6) return { tier: 'normal', label: `Due in ${days} days` };

  return { tier: 'normal', label: `Due ${parseDueDate(task.dueDate).toLocaleDateString()}` };
};

export const groupByStatus = (tasks) => {
  const groups = { 'To Do': [], 'In Progress': [], Done: [] };
  for (const task of tasks) {
    if (groups[task.status]) groups[task.status].push(task);
    else groups['To Do'].push(task);
  }
  return groups;
};

// Buckets for the "group by due" view.
export const DUE_BUCKETS = ['Overdue', 'Today', 'This week', 'Later', 'No date'];

// Pure temporal bucketing by calendar day (status-independent), so a completed
// task with a past due date groups under 'Overdue' rather than the future-facing
// 'Later'. The red overdue *styling* stays status-aware via isOverdue/getDueMeta.
export const dueBucket = (task) => {
  if (!task.dueDate) return 'No date';
  const days = daysUntilDue(task.dueDate);
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Today';
  if (days <= 7) return 'This week';
  return 'Later';
};

// Recharts renders to SVG and cannot reliably read CSS custom properties, so
// the chart is fed explicit hex values keyed on the active theme. Keep these in
// sync with the --status-* tokens in App.css.
export const STATUS_CHART_COLORS = {
  light: { 'To Do': '#8A8A80', 'In Progress': '#3B67D6', Done: '#5E8C6A' },
  dark: { 'To Do': '#9A9A90', 'In Progress': '#7DA2F2', Done: '#87B394' },
};

export const MAX_TAG_LENGTH = 24;
export const MAX_TAGS = 8;

// Normalize free-form tags: trim, drop empties/duplicates (case-insensitive),
// preserve first-seen casing, and enforce length/count limits.
export const normalizeTags = (tags) => {
  let list = tags;
  if (typeof list === 'string') list = list.split(/[,#]/);
  if (!Array.isArray(list)) return [];

  const seen = new Set();
  const out = [];

  for (const raw of list) {
    if (typeof raw !== 'string') continue;
    const tag = raw
      .trim()
      .replace(/^#+/, '')
      .replace(/\s+/g, ' ')
      .slice(0, MAX_TAG_LENGTH)
      .trim();
    if (!tag) continue;

    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
    if (out.length >= MAX_TAGS) break;
  }

  return out;
};

export const taskHasTag = (task, tag) => {
  const key = String(tag || '').toLowerCase();
  return (task.tags || []).some((t) => t.toLowerCase() === key);
};

// Unique tags across a task list, sorted alphabetically (case-insensitive).
export const collectTags = (tasks) => {
  const seen = new Map();
  for (const task of tasks) {
    for (const tag of task.tags || []) {
      const key = tag.toLowerCase();
      if (!seen.has(key)) seen.set(key, tag);
    }
  }
  return Array.from(seen.values()).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  );
};
