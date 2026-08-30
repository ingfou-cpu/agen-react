import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import Spinner from '../components/Spinner.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(username, password);
      navigate('/profile/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card p-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/10 text-2xl text-copper">
            <i className="bi bi-box-arrow-in-right"></i>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-forest-dark dark:text-sand-light">{t('nav.login')}</h2>
          <p className="mt-1 text-sm text-forest-dark/60 dark:text-sand-dark">{t('auth.loginHint')}</p>
        </div>

        {error && (
          <p className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            <i className="bi bi-exclamation-circle me-1"></i>{error}
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="lg-user">{t('auth.username')}</label>
            <input
              id="lg-user"
              className="input"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('auth.usernamePlaceholder')}
            />
          </div>
          <div>
            <label className="label" htmlFor="lg-pass">{t('auth.password')}</label>
            <input
              id="lg-pass"
              type="password"
              className="input"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? <Spinner className="!h-5 !w-5" /> : <><i className="bi bi-box-arrow-in-right"></i> {t('auth.signIn')}</>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-forest-dark/60 dark:text-sand-dark">
          {t('auth.noAccount')}{' '}
          <Link to="/register/" className="font-semibold text-copper hover:underline">
            {t('auth.signUp')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
