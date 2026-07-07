import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { STATUSES, STATUS_CHART_COLORS } from '../utils/tasks';

// Compact, theme-aware donut with a completion-rate center label. Colors are
// fed as explicit hex (keyed on the active theme) because recharts SVG fills
// cannot read CSS custom properties.
const ProgressChart = ({ tasks, theme }) => {
  const colors = STATUS_CHART_COLORS[theme] || STATUS_CHART_COLORS.light;

  const counts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const data = STATUSES.map((name) => ({ name, value: counts[name] || 0 }));
  const total = tasks.length;
  const done = counts.Done || 0;
  const completionRate = total ? Math.round((done / total) * 100) : 0;

  if (!total) {
    return <p className="task-desc is-placeholder">Add tasks to see your progress.</p>;
  }

  return (
    <div className="donut-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={44}
            outerRadius={58}
            paddingAngle={2}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={colors[entry.name]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-center">
        <span className="pct num">{completionRate}%</span>
        <span className="lbl">done</span>
      </div>
    </div>
  );
};

export default ProgressChart;
