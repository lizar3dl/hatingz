// Responsável: Enzo
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { register } from '../services/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [favoriteTeamSlug, setFavoriteTeamSlug] = useState('corinthians');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await register(name.trim(), email.trim(), password, favoriteTeamSlug);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError<{ message?: string }>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Unable to create the account');
      }
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="register-title">
        <div className="auth-brand">
          <span className="brand-mark">R</span>
          <span>RATINGZ</span>
        </div>
        <p className="auth-kicker">A plataforma do torcedor</p>
        <h1 id="register-title">Crie sua conta</h1>
        <p className="auth-subtitle">Monte sua escalação ideal e faça sua voz valer no jogo.</p>
        <form onSubmit={onSubmit} className="auth-form">
          <label>
          Nome
            <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
          </label>
          <label>
          Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required />
          </label>
          <label>
          Senha
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="new-password" minLength={8} required />
          </label>
          <label>
          Time do coração
            <select value={favoriteTeamSlug} onChange={(event) => setFavoriteTeamSlug(event.target.value)}>
            <option value="palmeiras">Palmeiras</option>
            <option value="bahia">Bahia</option>
            <option value="corinthians">Corinthians</option>
            <option value="sao-paulo">São Paulo</option>
            <option value="vasco">Vasco da Gama</option>
            </select>
          </label>
          {error ? <p className="auth-error" role="alert">{error}</p> : null}
          <button className="auth-submit" type="submit">Cadastrar</button>
        </form>
        <p className="auth-switch">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
