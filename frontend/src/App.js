import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ProgressChart from './components/ProgressChart';
import AuthForm from './components/AuthForm';
import ToastHost from './components/ToastHost';
import { STATUSES, STATUS_CHART_COLORS } from './utils/tasks';
import { pageview } from './utils/analytics';
import './styles/App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [toasts, setToasts] = useState([]);

  const formRef = useRef(null);
  const toastSeq = useRef(0);
  const pendingDeletes = useRef(new Map());

  const authAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });

  // ── Theme ──────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ── Toasts ─────────────────────────────────────────────────────────────
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast) => {
      const id = (toastSeq.current += 1);
      setToasts((prev) => [...prev, { id, ...toast }]);
      const duration = toast.duration ?? 3500;
      setTimeout(() => dismissToast(id), duration);
      return id;
    },
    [dismissToast],
  );

  // ── Data ───────────────────────────────────────────────────────────────
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      pushToast({ message: 'Failed to load tasks', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  useEffect(() => {
    pageview(token ? '/app' : '/login');
  }, [token]);

  // ── Keyboard shortcut: focus quick-capture ─────────────────────────────
  useEffect(() => {
    if (!token) return undefined;
    const handler = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return; // don't hijack Cmd/Ctrl+C etc.
      const el = e.target;
      const typing =
        el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
      if (typing) return;
      if (e.key === '/' || e.key === 'c') {
        e.preventDefault();
        formRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [token]);

  const handleAuthSuccess = (data) => {
    setUser({ id: data._id, name: data.name, email: data.email });
    setToken(data.token);
    localStorage.setItem('token', data.token);
  };

  // Cancel any armed undo-delete timers (they close over the current token/axios).
  const cancelPendingDeletes = () => {
    for (const tid of pendingDeletes.current.values()) clearTimeout(tid);
    pendingDeletes.current.clear();
  };

  // Clear timers on unmount so a delayed DELETE never fires after teardown.
  useEffect(() => cancelPendingDeletes, []);

  const handleLogout = () => {
    cancelPendingDeletes();
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    setTasks([]);
  };

  const addTask = async (taskData) => {
    try {
      const res = await authAxios.post('/api/tasks', taskData);
      setTasks((prev) => [res.data, ...prev]);
      pushToast({ message: 'Task added' });
    } catch (err) {
      console.error(err);
      pushToast({ message: 'Failed to add task', variant: 'error' });
    }
  };

  const updateTask = async (id, updates) => {
    // Optimistic update keeps drag / status / inline-edit feeling instant.
    const prevTask = tasks.find((t) => t._id === id);
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, ...updates } : t)));
    try {
      const res = await authAxios.put(`/api/tasks/${id}`, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
      // Roll back ONLY this task (functional update) so a concurrent add / edit /
      // delete that landed while the PUT was in flight is not clobbered.
      if (prevTask) setTasks((prev) => prev.map((t) => (t._id === id ? prevTask : t)));
      pushToast({ message: 'Failed to update task', variant: 'error' });
    }
  };

  // Optimistic remove + delayed DELETE so it can be undone.
  const deleteTask = (id) => {
    const idx = tasks.findIndex((t) => t._id === id);
    if (idx === -1) return;
    const task = tasks[idx];

    setTasks((prev) => prev.filter((t) => t._id !== id));

    const restore = () => {
      setTasks((prev) => {
        if (prev.some((t) => t._id === id)) return prev;
        const copy = prev.slice();
        copy.splice(Math.min(idx, copy.length), 0, task);
        return copy;
      });
    };

    const timeoutId = setTimeout(async () => {
      pendingDeletes.current.delete(id);
      try {
        await authAxios.delete(`/api/tasks/${id}`);
      } catch (err) {
        console.error(err);
        restore();
        pushToast({ message: 'Failed to delete task', variant: 'error' });
      }
    }, 5000);
    pendingDeletes.current.set(id, timeoutId);

    pushToast({
      message: `Deleted "${task.title}"`,
      actionLabel: 'Undo',
      duration: 5000,
      onAction: () => {
        const tid = pendingDeletes.current.get(id);
        if (tid) clearTimeout(tid);
        pendingDeletes.current.delete(id);
        restore();
      },
    });
  };

  const completedCount = tasks.filter((t) => t.status === 'Done').length;
  const completionRate = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const counts = STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: tasks.filter((t) => t.status === s).length }),
    {},
  );
  const chartColors = STATUS_CHART_COLORS[theme];

  const themeToggle = (
    <button
      type="button"
      className="icon-button"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );

  if (!token) {
    return (
      <div className="auth-screen">
        <AuthForm apiBaseUrl={API_BASE_URL} onAuthSuccess={handleAuthSuccess} />
        <div style={{ position: 'fixed', top: 'var(--space-4)', right: 'var(--space-4)' }}>
          {themeToggle}
        </div>
        <ToastHost toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="wordmark">
            <span className="wordmark-dot" />
            Task Flow
          </div>
          <div className="topbar-spacer" />
          <div className="metric-strip">
            <span className="num">{tasks.length}</span>&nbsp;tasks&nbsp;·&nbsp;
            <strong className="num">{completionRate}%</strong>&nbsp;done
          </div>
          {themeToggle}
          <button type="button" className="ghost-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="app-container">
        <TaskForm ref={formRef} onAddTask={addTask} />

        <section className="metric-cluster">
          <div className="metric-figures">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionRate}%` }} />
            </div>
            <div className="metric-counts">
              {STATUSES.map((s) => (
                <span key={s}>
                  <span className="swatch" style={{ backgroundColor: chartColors[s] }} />
                  {s} <span className="num">{counts[s]}</span>
                </span>
              ))}
            </div>
          </div>
          <ProgressChart tasks={tasks} theme={theme} />
        </section>

        <TaskList
          tasks={tasks}
          loading={loading}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
      </main>

      <ToastHost toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
