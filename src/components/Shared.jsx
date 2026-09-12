import React from 'react';
import { FONT } from '../lib/theme';

export function SectionLabel({ icon: Icon, children, theme }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: theme.deepPurple, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={17} color="#fff" />
      </div>
      <h2 style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: theme.deepPurple, margin: 0 }}>{children}</h2>
    </div>
  );
}

export function TextInput({ value, onChange, type = 'text', placeholder, theme, style }) {
  return (
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontFamily: FONT, fontSize: 12.5, padding: '7px 9px', borderRadius: 6,
        border: `1px solid ${theme.border}`, background: theme.card, color: theme.text,
        width: '100%', boxSizing: 'border-box', ...style,
      }}
    />
  );
}

export function Select({ value, onChange, options, theme, style }) {
  return (
    <select
      value={value} onChange={(e) => onChange(e.target.value)}
      style={{
        fontFamily: FONT, fontSize: 12.5, padding: '7px 9px', borderRadius: 6,
        border: `1px solid ${theme.border}`, background: theme.card, color: theme.text,
        width: '100%', boxSizing: 'border-box', ...style,
      }}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export function PriorityPill({ p, theme }) {
  const map = {
    High: { bg: theme.lightPink, fg: theme.pink },
    Medium: { bg: theme.lightPurple, fg: theme.purple },
    Low: { bg: theme.lightBlue, fg: theme.blueSoft },
  };
  const c = map[p] || map.Medium;
  return (
    <span style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: c.bg, color: c.fg }}>
      {p}
    </span>
  );
}

export function ProgressBar({ pct, theme, width = 90 }) {
  const clamped = Math.max(0, Math.min(1, pct));
  return (
    <div style={{ width, height: 7, borderRadius: 4, background: theme.lightPurple, overflow: 'hidden' }}>
      <div style={{ width: `${clamped * 100}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${theme.purple}, ${theme.pink})` }} />
    </div>
  );
}

export function StatCard({ label, color, value, children, theme }) {
  return (
    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 12, padding: '14px 16px', borderTop: `3px solid ${color}` }}>
      <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: theme.subtext, marginBottom: 6 }}>{label}</div>
      {value !== undefined
        ? <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color }}>{value}</div>
        : children}
    </div>
  );
}

export const th = (theme) => ({ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#fff', padding: '9px 10px', textAlign: 'left', whiteSpace: 'nowrap' });
export const td = (theme) => ({ fontFamily: FONT, fontSize: 12, color: theme.text, padding: '8px 10px', borderBottom: `1px solid ${theme.border}` });

export function Btn({ children, onClick, bg, fg = '#fff', style }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: FONT, fontSize: 12, fontWeight: 700, border: 'none', borderRadius: 7,
        padding: '8px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
        background: bg, color: fg, ...style,
      }}
    >
      {children}
    </button>
  );
}
