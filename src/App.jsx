import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import GoalsPanel from './components/GoalsPanel';
import WishlistPanel from './components/WishlistPanel';
import DepositLog from './components/DepositLog';
import Stats from './components/Stats';
import { LIGHT, DARK, FONT, ICONS, GOAL_COLORS } from './lib/theme';

const uid = () => Math.random().toString(36).slice(2, 10);

const defaultData = {
  monthlyCapacity: 8000,
  goals: [
    { id: uid(), name: 'Vehicle', icon: '\u{1F697}', color: '#7B1FA2', target: 150000, deadline: '2027-06-01', basePriority: 'High', upgradeDate: '', upgradePriority: '' },
    { id: uid(), name: 'Higher Education', icon: '\u{1F393}', color: '#1E3A8A', target: 300000, deadline: '2028-04-01', basePriority: 'Medium', upgradeDate: '', upgradePriority: '' },
    { id: uid(), name: 'Home Down Payment', icon: '\u{1F3E1}', color: '#00838F', target: 500000, deadline: '2030-01-01', basePriority: 'Medium', upgradeDate: '', upgradePriority: '' },
    { id: uid(), name: 'Emergency Fund', icon: '\u{1F6E1}\uFE0F', color: '#EF6C00', target: 100000, deadline: '', basePriority: 'Low', upgradeDate: '2027-01-01', upgradePriority: 'High' },
  ],
  wishlist: [
    { id: uid(), name: 'Wireless Earbuds', icon: '\u{1F3AE}', color: '#C2185B', source: 'Amazon', price: 3000, priority: 'Medium' },
  ],
  deposits: [
    { id: uid(), date: new Date().toISOString().slice(0, 10), amount: 70000, note: 'Starting balance' },
  ],
};

function isoWeekKey(dateStr) {
  const d = new Date(dateStr);
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const week = 1 + Math.round(((target - firstThursday) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
  return `${target.getFullYear()}-W${week}`;
}

function computeStreak(deposits) {
  if (!deposits.length) return 0;
  const weeks = new Set(deposits.filter((d) => Number(d.amount) > 0).map((d) => isoWeekKey(d.date)));
  let streak = 0;
  let cursor = new Date();
  while (true) {
    const key = isoWeekKey(cursor.toISOString().slice(0, 10));
    if (weeks.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 7);
    } else {
      break;
    }
  }
  return streak;
}

export default function App() {
  const [user, setUser] = useState(undefined);
  const [data, setData] = useState(defaultData);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [dark, setDark] = useState(() => localStorage.getItem('scc-dark') === '1');

  const theme = dark ? DARK : LIGHT;
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    localStorage.setItem('scc-dark', dark ? '1' : '0');
  }, [dark]);

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const ref = doc(db, 'users', user.uid, 'data', 'main');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setData({ ...defaultData, ...snap.data() });
      } else {
        await setDoc(ref, defaultData);
      }
      setLoaded(true);
    })();
  }, [user]);

  const persist = useCallback((next) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'data', 'main');
    setDoc(ref, next, { merge: true });
  }, [user]);

  const update = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persist(next);
      return next;
    });
  }, [persist]);

  const addGoal = () => update((prev) => ({
    ...prev,
    goals: [...prev.goals, { id: uid(), name: 'New Goal', icon: ICONS[0], color: GOAL_COLORS[prev.goals.length % GOAL_COLORS.length], target: 10000, deadline: '', basePriority: 'Medium', upgradeDate: '', upgradePriority: '' }],
  }));
  const updateGoal = (id, patch) => update((prev) => ({ ...prev, goals: prev.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));
  const removeGoal = (id) => update((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));

  const addWish = () => update((prev) => ({
    ...prev,
    wishlist: [...prev.wishlist, { id: uid(), name: 'New Item', icon: ICONS[1], color: GOAL_COLORS[prev.wishlist.length % GOAL_COLORS.length], source: '', price: 1000, priority: 'Medium' }],
  }));
  const updateWish = (id, patch) => update((prev) => ({ ...prev, wishlist: prev.wishlist.map((w) => (w.id === id ? { ...w, ...patch } : w)) }));
  const removeWish = (id) => update((prev) => ({ ...prev, wishlist: prev.wishlist.filter((w) => w.id !== id) }));

  const addDeposit = (entry) => update((prev) => ({ ...prev, deposits: [...(prev.deposits || []), { id: uid(), ...entry }] }));
  const removeDeposit = (id) => update((prev) => ({ ...prev, deposits: prev.deposits.filter((d) => d.id !== id) }));

  const updateCapacity = (v) => update((prev) => ({ ...prev, monthlyCapacity: v === '' ? '' : Number(v) }));

  const totalSaved = (data.deposits || []).reduce((s, d) => s + (Number(d.amount) || 0), 0);

  const allItems = useMemo(() => {
    const goalItems = (data.goals || []).map((g) => ({ ...g, type: 'Goal', target: Number(g.target) || 0 }));
    const wishItems = (data.wishlist || []).map((w) => ({
      id: w.id, name: w.name, icon: w.icon, color: w.color, type: 'Wishlist', target: Number(w.price) || 0,
      deadline: '', basePriority: w.priority, upgradeDate: '', upgradePriority: '',
    }));
    return [...goalItems, ...wishItems];
  }, [data.goals, data.wishlist]);

  const streak = useMemo(() => computeStreak(data.deposits || []), [data.deposits]);

  if (user === undefined) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: theme.subtext, background: theme.bg }}>Loading\u2026</div>;
  }
  if (!user) {
    return <Login theme={theme} />;
  }
  if (!loaded) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: theme.subtext, background: theme.bg }}>Loading your data\u2026</div>;
  }

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', fontFamily: FONT, color: theme.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input:focus, select:focus { outline: 2px solid ${theme.purpleSoft}; outline-offset: 1px; }
      `}</style>
      <Navbar tab={tab} setTab={setTab} theme={theme} dark={dark} setDark={setDark} streak={streak} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px 60px' }}>
        {tab === 'dashboard' && (
          <>
            <TopControls theme={theme} totalSaved={totalSaved} monthlyCapacity={data.monthlyCapacity} updateCapacity={updateCapacity} />
            <Dashboard theme={theme} allItems={allItems} totalSaved={totalSaved} monthlyCapacity={Number(data.monthlyCapacity) || 0} today={today} />
          </>
        )}
        {tab === 'goals' && <GoalsPanel theme={theme} goals={data.goals || []} addGoal={addGoal} updateGoal={updateGoal} removeGoal={removeGoal} />}
        {tab === 'wishlist' && <WishlistPanel theme={theme} wishlist={data.wishlist || []} addWish={addWish} updateWish={updateWish} removeWish={removeWish} />}
        {tab === 'deposits' && <DepositLog theme={theme} deposits={data.deposits || []} addDeposit={addDeposit} removeDeposit={removeDeposit} />}
        {tab === 'stats' && <Stats theme={theme} allItems={allItems} deposits={data.deposits || []} totalSaved={totalSaved} today={today} />}
      </div>
    </div>
  );
}

function TopControls({ theme, totalSaved, monthlyCapacity, updateCapacity }) {
  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: '12px 16px' }}>
      <div style={{ fontFamily: FONT, fontSize: 11.5, color: theme.subtext }}>
        Total saved is now the sum of your <b>Deposits</b> tab. Set your monthly capacity below \u2014
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, color: theme.text }}>Monthly capacity:</span>
        <input
          type="number" value={monthlyCapacity} onChange={(e) => updateCapacity(e.target.value)}
          style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, padding: '6px 9px', borderRadius: 6, border: `1px solid ${theme.border}`, width: 110, background: theme.bg, color: theme.deepPurple }}
        />
      </div>
    </div>
  );
}
