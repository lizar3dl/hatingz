// Responsável: Enzo
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '../services/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError<{ message?: string }>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Unable to sign in');
      }
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-brand">
          <span className="brand-mark">R</span>
          <span>RATINGZ</span>
        </div>
        <p className="auth-kicker">A plataforma do torcedor</p>
        <h1 id="login-title">Bem-vindo de volta</h1>
        <p className="auth-subtitle">Entre para acompanhar seus times e participar das decisões.</p>
        <form onSubmit={onSubmit} className="auth-form">
          <label>
          Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required />
          </label>
          <label>
          Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required />
          </label>
          {error ? <p className="auth-error" role="alert">{error}</p> : null}
          <button className="auth-submit" type="submit">Entrar</button>
        </form>
        <p className="auth-switch">
          Novo no Ratingz? <Link to="/register">Crie sua conta</Link>
        </p>
      </section>
    </main>
  );
}
