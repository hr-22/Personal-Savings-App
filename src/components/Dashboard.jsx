import React, { useMemo, useState } from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, Quote, SlidersHorizontal } from 'lucide-react';
import { FONT } from '../lib/theme';
import { StatCard, SectionLabel, PriorityPill, ProgressBar, th, td } from './Shared';
import { allocatePool, simulateCompletions, effectivePriority, monthsBetween, fmtINR, fmtDate } from '../lib/allocation';
import { quoteOfTheDay } from '../lib/quotes';

export default function Dashboard({ theme, allItems, totalSaved, monthlyCapacity, today }) {
  const [whatIf, setWhatIf] = useState(monthlyCapacity || 0);

  const allocationNow = useMemo(() => allocatePool(totalSaved, allItems, today), [totalSaved, allItems, today]);
  const completions = useMemo(() => simulateCompletions(totalSaved, monthlyCapacity, allItems, today), [totalSaved, monthlyCapacity, allItems, today]);
  const whatIfCompletions = useMemo(() => simulateCompletions(totalSaved, whatIf, allItems, today), [totalSaved, whatIf, allItems, today]);

  const totalTarget = allItems.reduce((s, i) => s + (Number(i.target) || 0), 0);
  const coverage = totalTarget > 0 ? totalSaved / totalTarget : 0;

  const goalsWithDeadline = allItems.filter((i) => i.type === 'Goal' && i.deadline);
  const monthlyRequirements = goalsWithDeadline.map((g) => {
    const row = allocationNow.find((r) => r.id === g.id);
    const remaining = row ? row.need : g.target;
    const m = monthsBetween(today, g.deadline);
    const monthlyNeeded = m && m > 0 ? remaining / m : remaining;
    return { name: g.name, monthlyNeeded, monthsLeft: m };
  });
  const tightest = monthlyRequirements.reduce((max, r) => (r.monthlyNeeded > (max ? max.monthlyNeeded : -Infinity) ? r : max), null);

  let insight = { tone: 'neutral', text: 'Add a deadline to a goal to see how your monthly saving capacity stacks up.' };
  if (tightest) {
    if (monthlyCapacity >= tightest.monthlyNeeded) {
      insight = { tone: 'good', text: `You're on track. At ${fmtINR(monthlyCapacity)}/month you cover the tightest goal ("${tightest.name}", needs ${fmtINR(tightest.monthlyNeeded)}/month) with ${fmtINR(monthlyCapacity - tightest.monthlyNeeded)} to spare.` };
    } else {
      insight = { tone: 'warn', text: `Your tightest goal is "${tightest.name}" \u2014 it needs ${fmtINR(tightest.monthlyNeeded)}/month to hit its deadline, but you're set at ${fmtINR(monthlyCapacity)}/month. Add ${fmtINR(tightest.monthlyNeeded - monthlyCapacity)}/month, or push the deadline out.` };
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '13px 16px', borderRadius: 10, marginBottom: 20, background: theme.lightPurple, border: `1px solid ${theme.border}` }}>
        <Quote size={16} color={theme.purple} style={{ flexShrink: 0 }} />
        <p style={{ fontFamily: FONT, fontSize: 12, fontStyle: 'italic', color: theme.text, margin: 0 }}>{quoteOfTheDay()}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
        <StatCard theme={theme} label="Total saved right now" color={theme.deepPurple} value={fmtINR(totalSaved)} />
        <StatCard theme={theme} label="Monthly saving capacity" color={theme.purple} value={fmtINR(monthlyCapacity)} />
        <StatCard theme={theme} label="Total needed (goals + wishlist)" color={theme.pink} value={fmtINR(totalTarget)} />
        <StatCard theme={theme} label="Coverage today" color={theme.blueSoft} value={`${(coverage * 100).toFixed(1)}%`} />
      </div>

      <div style={{
        display: 'flex', gap: 10, alignItems: 'flex-start', padding: '13px 16px', borderRadius: 10, marginBottom: 26,
        background: insight.tone === 'good' ? (theme.bg === '#1A1424' ? '#1C3324' : '#EAF6EC') : insight.tone === 'warn' ? theme.lightPink : theme.lightPurple,
        border: `1px solid ${theme.border}`,
      }}>
        {insight.tone === 'good' ? <CheckCircle2 size={18} color={theme.success} style={{ flexShrink: 0, marginTop: 1 }} /> : <AlertCircle size={18} color={insight.tone === 'warn' ? theme.pink : theme.purple} style={{ flexShrink: 0, marginTop: 1 }} />}
        <p style={{ fontFamily: FONT, fontSize: 12.5, margin: 0, lineHeight: 1.5, color: theme.text }}>{insight.text}</p>
      </div>

      <div style={{ background: theme.card, borderRadius: 12, padding: 20, marginBottom: 26, border: `1px solid ${theme.border}` }}>
        <SectionLabel icon={TrendingUp} theme={theme}>Allocation right now</SectionLabel>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ background: theme.deepPurple }}>
                <th style={th(theme)}>S.No</th>
                <th style={th(theme)}>Name</th>
                <th style={th(theme)}>Type</th>
                <th style={th(theme)}>Priority</th>
                <th style={th(theme)}>Target</th>
                <th style={th(theme)}>Allocated</th>
                <th style={th(theme)}>Remaining</th>
                <th style={th(theme)}>Progress</th>
                <th style={th(theme)}>Funded by</th>
              </tr>
            </thead>
            <tbody>
              {allocationNow.map((row, idx) => {
                const pct = row.target > 0 ? row.allocated / row.target : 0;
                const done = row.need <= 0.5;
                return (
                  <tr key={row.id}>
                    <td style={td(theme)}>{idx + 1}</td>
                    <td style={{ ...td(theme), fontWeight: 700 }}>{row.icon ? `${row.icon} ` : ''}{row.name}</td>
                    <td style={td(theme)}>{row.type}</td>
                    <td style={td(theme)}><PriorityPill theme={theme} p={effectivePriority(row, today)} /></td>
                    <td style={td(theme)}>{fmtINR(row.target)}</td>
                    <td style={td(theme)}>{fmtINR(row.allocated)}</td>
                    <td style={td(theme)}>{fmtINR(row.need)}</td>
                    <td style={td(theme)}><ProgressBar theme={theme} pct={pct} /></td>
                    <td style={td(theme)}>
                      {done ? <span style={{ color: theme.success, fontWeight: 700 }}>\u2713 Funded</span> : fmtDate(completions[row.id])}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: theme.card, borderRadius: 12, padding: 20, border: `1px solid ${theme.border}` }}>
        <SectionLabel icon={SlidersHorizontal} theme={theme}>What if I saved differently?</SectionLabel>
        <p style={{ fontFamily: FONT, fontSize: 12, color: theme.subtext, marginBottom: 14 }}>
          Drag to test a different monthly amount \u2014 doesn't change your real data, just previews the effect.
        </p>
        <input
          type="range" min="0" max={Math.max(50000, monthlyCapacity * 4, 5000)} step="500"
          value={whatIf} onChange={(e) => setWhatIf(Number(e.target.value))}
          style={{ width: '100%', accentColor: theme.pink }}
        />
        <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: theme.deepPurple, margin: '8px 0 16px' }}>
          {fmtINR(whatIf)} / month
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {allItems.map((item) => (
            <div key={item.id} style={{ padding: '10px 12px', borderRadius: 8, background: theme.bg, border: `1px solid ${theme.border}` }}>
              <div style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, color: theme.text }}>{item.icon ? `${item.icon} ` : ''}{item.name}</div>
              <div style={{ fontFamily: FONT, fontSize: 11, color: theme.subtext, marginTop: 3 }}>
                at current pace: {fmtDate(completions[item.id])}
              </div>
              <div style={{ fontFamily: FONT, fontSize: 11, color: theme.pink, fontWeight: 700, marginTop: 1 }}>
                at {fmtINR(whatIf)}/mo: {fmtDate(whatIfCompletions[item.id])}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
