import React from 'react';
import { Target, Plus, Trash2 } from 'lucide-react';
import { FONT } from '../lib/theme';
import { ICONS, GOAL_COLORS } from '../lib/theme';
import { SectionLabel, TextInput, Select, Btn, th, td } from './Shared';
import { PRIORITIES } from '../lib/allocation';

export default function GoalsPanel({ theme, goals, addGoal, updateGoal, removeGoal }) {
  return (
    <div style={{ background: theme.card, borderRadius: 12, padding: 20, border: `1px solid ${theme.border}` }}>
      <SectionLabel icon={Target} theme={theme}>Long-term goals & emergency fund</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {goals.map((g, idx) => (
          <div key={g.id} style={{ border: `1px solid ${theme.border}`, borderRadius: 10, padding: 14, borderLeft: `4px solid ${g.color || theme.purple}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: FONT, fontSize: 11, color: theme.subtext, fontWeight: 700 }}>#{idx + 1}</span>
              <IconPicker theme={theme} value={g.icon} onChange={(icon) => updateGoal(g.id, { icon })} />
              <ColorPicker value={g.color} onChange={(color) => updateGoal(g.id, { color })} />
              <div style={{ flex: 1, minWidth: 140 }}>
                <TextInput theme={theme} value={g.name} onChange={(v) => updateGoal(g.id, { name: v })} />
              </div>
              <Btn onClick={() => removeGoal(g.id)} bg={theme.lightPink} fg={theme.pink}><Trash2 size={13} /></Btn>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
              <Field theme={theme} label="Target (\u20B9)">
                <TextInput theme={theme} type="number" value={g.target} onChange={(v) => updateGoal(g.id, { target: v === '' ? '' : Number(v) })} />
              </Field>
              <Field theme={theme} label="Deadline">
                <TextInput theme={theme} type="date" value={g.deadline} onChange={(v) => updateGoal(g.id, { deadline: v })} />
              </Field>
              <Field theme={theme} label="Priority">
                <Select theme={theme} value={g.basePriority} onChange={(v) => updateGoal(g.id, { basePriority: v })} options={PRIORITIES} />
              </Field>
              <Field theme={theme} label="Upgrade to">
                <Select theme={theme} value={g.upgradePriority || ''} onChange={(v) => updateGoal(g.id, { upgradePriority: v })} options={['', ...PRIORITIES]} />
              </Field>
              <Field theme={theme} label="From date">
                <TextInput theme={theme} type="date" value={g.upgradeDate} onChange={(v) => updateGoal(g.id, { upgradeDate: v })} />
              </Field>
            </div>
          </div>
        ))}
      </div>
      <Btn onClick={addGoal} bg={theme.deepPurple} style={{ marginTop: 14 }}><Plus size={14} /> Add goal</Btn>
      <p style={{ fontFamily: FONT, fontSize: 11, color: theme.subtext, marginTop: 10, lineHeight: 1.5 }}>
        "Upgrade to" + "From date" is optional \u2014 use it for things like the emergency fund: Low priority now, High from a given date.
      </p>
    </div>
  );
}

function Field({ label, children, theme }) {
  return (
    <div>
      <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color: theme.subtext, marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}

function IconPicker({ value, onChange, theme }) {
  return (
    <select value={value || ICONS[0]} onChange={(e) => onChange(e.target.value)} style={{ fontSize: 16, padding: '4px 6px', borderRadius: 6, border: `1px solid ${theme.border}`, background: theme.card }}>
      {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
    </select>
  );
}

function ColorPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {GOAL_COLORS.map((c) => (
        <button
          key={c} onClick={() => onChange(c)}
          style={{
            width: 16, height: 16, borderRadius: '50%', background: c, cursor: 'pointer',
            border: value === c ? '2px solid #333' : '1px solid rgba(0,0,0,0.15)',
          }}
        />
      ))}
    </div>
  );
}
