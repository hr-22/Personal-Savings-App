import React, { useState } from 'react';
import { PlusCircle, Trash2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FONT } from '../lib/theme';
import { SectionLabel, TextInput, Btn, th, td } from './Shared';
import { fmtINR, fmtDate } from '../lib/allocation';

export default function DepositLog({ theme, deposits, addDeposit, removeDeposit }) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  function handleAdd() {
    const n = Number(amount);
    if (!n) return;
    addDeposit({ amount: n, note, date });
    if (n > 0) {
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 }, colors: ['#7B1FA2', '#C2185B', '#1E3A8A'] });
    }
    setAmount('');
    setNote('');
  }

  const total = deposits.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const sorted = [...deposits].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ background: theme.card, borderRadius: 12, padding: 20, border: `1px solid ${theme.border}` }}>
      <SectionLabel icon={PlusCircle} theme={theme}>Deposit log</SectionLabel>
      <p style={{ fontFamily: FONT, fontSize: 12, color: theme.subtext, marginBottom: 16 }}>
        Log every deposit here \u2014 your "Total saved" on the Dashboard is the sum of everything below. Use a negative amount to log a withdrawal or spend.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18, alignItems: 'flex-end' }}>
        <div style={{ width: 130 }}>
          <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color: theme.subtext, marginBottom: 4 }}>Amount (\u20B9)</div>
          <TextInput theme={theme} type="number" value={amount} onChange={setAmount} placeholder="2000" />
        </div>
        <div style={{ width: 150 }}>
          <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color: theme.subtext, marginBottom: 4 }}>Date</div>
          <TextInput theme={theme} type="date" value={date} onChange={setDate} />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color: theme.subtext, marginBottom: 4 }}>Note (optional)</div>
          <TextInput theme={theme} value={note} onChange={setNote} placeholder="Monthly saving, bonus, etc." />
        </div>
        <Btn onClick={handleAdd} bg={theme.deepPurple}><PlusCircle size={14} /> Log it</Btn>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Award size={16} color={theme.pink} />
        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: theme.deepPurple }}>
          Total logged: {fmtINR(total)} across {deposits.length} entr{deposits.length === 1 ? 'y' : 'ies'}
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ background: theme.purple }}>
              <th style={th(theme)}>S.No</th>
              <th style={th(theme)}>Date</th>
              <th style={th(theme)}>Amount</th>
              <th style={th(theme)}>Note</th>
              <th style={th(theme)}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d, idx) => (
              <tr key={d.id}>
                <td style={td(theme)}>{idx + 1}</td>
                <td style={td(theme)}>{fmtDate(d.date)}</td>
                <td style={{ ...td(theme), color: d.amount < 0 ? theme.danger : theme.success, fontWeight: 700 }}>{fmtINR(d.amount)}</td>
                <td style={td(theme)}>{d.note}</td>
                <td style={td(theme)}>
                  <Btn onClick={() => removeDeposit(d.id)} bg={theme.lightPink} fg={theme.pink}><Trash2 size={12} /></Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <p style={{ fontFamily: FONT, fontSize: 12, color: theme.subtext, padding: '14px 0' }}>No deposits logged yet \u2014 add your first one above.</p>
        )}
      </div>
    </div>
  );
}
