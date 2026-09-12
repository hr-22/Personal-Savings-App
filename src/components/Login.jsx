import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Lock, Sparkles } from 'lucide-react';
import { FONT } from '../lib/theme';

export default function Login({ theme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError('Wrong email or password.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.bg, fontFamily: FONT }}>
      <form onSubmit={handleSubmit} style={{
        background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16,
        padding: '36px 32px', width: 340, boxShadow: '0 10px 40px rgba(74,20,140,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Sparkles size={20} color={theme.pink} />
          <h1 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 900, color: theme.deepPurple, margin: 0 }}>
            Savings Command Center
          </h1>
        </div>
        <p style={{ fontFamily: FONT, fontSize: 11.5, color: theme.subtext, marginTop: 4, marginBottom: 22 }}>
          Sign in to your private tracker.
        </p>

        <label style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: theme.text }}>Email</label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          style={{ ...inputStyle(theme), marginTop: 5, marginBottom: 14 }}
        />

        <label style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: theme.text }}>Password</label>
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          style={{ ...inputStyle(theme), marginTop: 5, marginBottom: 18 }}
        />

        {error && <p style={{ fontFamily: FONT, fontSize: 11.5, color: theme.danger, marginBottom: 12 }}>{error}</p>}

        <button type="submit" disabled={busy} style={{
          width: '100%', fontFamily: FONT, fontSize: 13, fontWeight: 700, color: '#fff',
          background: theme.deepPurple, border: 'none', borderRadius: 8, padding: '10px 0',
          cursor: busy ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}>
          <Lock size={14} /> {busy ? 'Signing in\u2026' : 'Sign in'}
        </button>

        <p style={{ fontFamily: FONT, fontSize: 10, color: theme.subtext, marginTop: 16, lineHeight: 1.5 }}>
          No sign-up here \u2014 this account is created for you directly in the Firebase console.
        </p>
      </form>
    </div>
  );
}

function inputStyle(theme) {
  return {
    width: '100%', fontFamily: FONT, fontSize: 13, padding: '9px 11px', borderRadius: 7,
    border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, boxSizing: 'border-box',
  };
}
