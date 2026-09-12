import React, { useMemo, useState } from 'react';
import { ShoppingBag, Plus, Trash2, Search } from 'lucide-react';
import { FONT } from '../lib/theme';
import { ICONS, GOAL_COLORS } from '../lib/theme';
import { SectionLabel, TextInput, Select, Btn } from './Shared';
import { PRIORITIES } from '../lib/allocation';

export default function WishlistPanel({ theme, wishlist, addWish, updateWish, removeWish }) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority');

  const filtered = useMemo(() => {
    let list = wishlist.filter((w) => w.name.toLowerCase().includes(query.toLowerCase()));
    const weight = { High: 3, Medium: 2, Low: 1 };
    if (sortBy === 'priority') list = [...list].sort((a, b) => (weight[b.priority] || 0) - (weight[a.priority] || 0));
    if (sortBy === 'price') list = [...list].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    return list;
  }, [wishlist, query, sortBy]);

  return (
    <div style={{ background: theme.card, borderRadius: 12, padding: 20, border: `1px solid ${theme.border}` }}>
      <SectionLabel icon={ShoppingBag} theme={theme}>Wishlist</SectionLabel>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 160, position: 'relative' }}>
          <Search size={13} color={theme.subtext} style={{ position: 'absolute', left: 9, top: 9 }} />
          <TextInput theme={theme} value={query} onChange={setQuery} placeholder="Search wishlist\u2026" style={{ paddingLeft: 28 }} />
        </div>
        <div style={{ width: 150 }}>
          <Select theme={theme} value={sortBy} onChange={setSortBy} options={['priority', 'price']} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((w) => {
          const originalIdx = wishlist.findIndex((x) => x.id === w.id);
          return (
            <div key={w.id} style={{ border: `1px solid ${theme.border}`, borderRadius: 10, padding: 14, borderLeft: `4px solid ${w.color || theme.pink}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FONT, fontSize: 11, color: theme.subtext, fontWeight: 700 }}>#{originalIdx + 1}</span>
                <select value={w.icon || ICONS[0]} onChange={(e) => updateWish(w.id, { icon: e.target.value })} style={{ fontSize: 16, padding: '4px 6px', borderRadius: 6, border: `1px solid ${theme.border}`, background: theme.card }}>
                  {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <div style={{ display: 'flex', gap: 3 }}>
                  {GOAL_COLORS.map((c) => (
                    <button key={c} onClick={() => updateWish(w.id, { color: c })}
                      style={{ width: 16, height: 16, borderRadius: '50%', background: c, cursor: 'pointer', border: w.color === c ? '2px solid #333' : '1px solid rgba(0,0,0,0.15)' }} />
                  ))}
                </div>
                <div style={{ flex: 1, minWidth: 130 }}>
                  <TextInput theme={theme} value={w.name} onChange={(v) => updateWish(w.id, { name: v })} />
                </div>
                <Btn onClick={() => removeWish(w.id)} bg={theme.lightPink} fg={theme.pink}><Trash2 size={13} /></Btn>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                <Field theme={theme} label="Source / App">
                  <TextInput theme={theme} value={w.source} onChange={(v) => updateWish(w.id, { source: v })} placeholder="Amazon, store\u2026" />
                </Field>
                <Field theme={theme} label="Price (\u20B9)">
                  <TextInput theme={theme} type="number" value={w.price} onChange={(v) => updateWish(w.id, { price: v === '' ? '' : Number(v) })} />
                </Field>
                <Field theme={theme} label="Priority">
                  <Select theme={theme} value={w.priority} onChange={(v) => updateWish(w.id, { priority: v })} options={PRIORITIES} />
                </Field>
              </div>
            </div>
          );
        })}
      </div>
      <Btn onClick={addWish} bg={theme.pink} style={{ marginTop: 14 }}><Plus size={14} /> Add wishlist item</Btn>
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
