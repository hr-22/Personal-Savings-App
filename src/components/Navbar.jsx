import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Sparkles, LayoutDashboard, Target, ShoppingBag, PlusCircle, BarChart3, Moon, Sun, LogOut, Flame } from 'lucide-react';
import { FONT } from '../lib/theme';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'wishlist', label: 'Wishlist', icon: ShoppingBag },
  { id: 'deposits', label: 'Deposits', icon: PlusCircle },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
];

export default function Navbar({ tab, setTab, theme, dark, setDark, streak }) {
  return (
    <div style={{ background: theme.card, borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={19} color={theme.pink} />
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 16, color: theme.deepPurple }}>Savings Command Center</span>
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  fontFamily: FONT, fontSize: 12, fontWeight: 700, border: 'none', borderRadius: 8,
                  padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  background: active ? theme.deepPurple : 'transparent',
                  color: active ? '#fff' : theme.subtext,
                }}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {streak > 0 && (
            <span style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, color: theme.pink, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Flame size={14} /> {streak}-week streak
            </span>
          )}
          <button onClick={() => setDark(!dark)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: theme.subtext, display: 'flex' }}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button onClick={() => signOut(auth)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: theme.subtext, display: 'flex' }} title="Sign out">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
