import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { BarChart3, Award } from 'lucide-react';
import { FONT } from '../lib/theme';
import { SectionLabel } from './Shared';
import { allocatePool, effectivePriority, fmtINR, fmtShortDate } from '../lib/allocation';

const PIE_COLORS = ['#7B1FA2', '#C2185B', '#1E3A8A', '#00838F', '#EF6C00', '#2E7D32', '#AD1457', '#5D4037'];

export default function Stats({ theme, allItems, deposits, totalSaved, today }) {
  const allocationNow = useMemo(() => allocatePool(totalSaved, allItems, today), [totalSaved, allItems, today]);

  const trendData = useMemo(() => {
    const sorted = [...deposits].sort((a, b) => new Date(a.date) - new Date(b.date));
    let running = 0;
    return sorted.map((d) => {
      running += Number(d.amount) || 0;
      return { date: fmtShortDate(d.date), total: Math.round(running) };
    });
  }, [deposits]);

  const pieData = allocationNow
    .filter((r) => r.allocated > 0)
    .map((r) => ({ name: r.name, value: Math.round(r.allocated) }));

  const badges = [];
  allocationNow.forEach((r) => {
    const pct = r.target > 0 ? r.allocated / r.target : 0;
    [0.25, 0.5, 0.75, 1].forEach((milestone) => {
      if (pct >= milestone) {
        badges.push({
          key: `${r.id}-${milestone}`,
          label: `${r.icon || ''} ${r.name} \u2014 ${milestone === 1 ? 'Fully funded!' : `${milestone * 100}% there`}`,
          milestone,
        });
      }
    });
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: theme.card, borderRadius: 12, padding: 20, border: `1px solid ${theme.border}` }}>
        <SectionLabel icon={BarChart3} theme={theme}>Savings over time</SectionLabel>
        {trendData.length > 1 ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <CartesianGrid stroke={theme.border} strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke={theme.subtext} fontFamily={FONT} fontSize={11} />
              <YAxis stroke={theme.subtext} fontFamily={FONT} fontSize={11} tickFormatter={(v) => `\u20B9${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => fmtINR(v)} contentStyle={{ fontFamily: FONT, fontSize: 12, borderRadius: 8, border: `1px solid ${theme.border}` }} />
              <Line type="monotone" dataKey="total" stroke={theme.pink} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ fontFamily: FONT, fontSize: 12, color: theme.subtext }}>Log a couple of deposits to see your trend line here.</p>
        )}
      </div>

      <div style={{ background: theme.card, borderRadius: 12, padding: 20, border: `1px solid ${theme.border}` }}>
        <SectionLabel icon={BarChart3} theme={theme}>Where your money is allocated</SectionLabel>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={(d) => `${d.name}: ${fmtINR(d.value)}`}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmtINR(v)} contentStyle={{ fontFamily: FONT, fontSize: 12, borderRadius: 8, border: `1px solid ${theme.border}` }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ fontFamily: FONT, fontSize: 12, color: theme.subtext }}>Add some savings to see the allocation split.</p>
        )}
      </div>

      <div style={{ background: theme.card, borderRadius: 12, padding: 20, border: `1px solid ${theme.border}` }}>
        <SectionLabel icon={Award} theme={theme}>Achievements</SectionLabel>
        {badges.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {badges.map((b) => (
              <div key={b.key} style={{
                fontFamily: FONT, fontSize: 12, padding: '10px 12px', borderRadius: 8,
                background: b.milestone === 1 ? theme.lightPink : theme.lightPurple,
                color: b.milestone === 1 ? theme.pink : theme.purple, fontWeight: 700,
              }}>
                {b.milestone === 1 ? '\u{1F3C6} ' : '\u2B50 '}{b.label}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontFamily: FONT, fontSize: 12, color: theme.subtext }}>Milestones (25%, 50%, 75%, fully funded) will show up here as your goals fill up.</p>
        )}
      </div>
    </div>
  );
}
