import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  function signOut() {
    localStorage.removeItem("ratingz-token");
    navigate("/login");
  }
  return (
    <header className="site-header">
      <Link className="brand" to="/dashboard"><span className="brand-mark">R</span> RATINGZ</Link>
      <nav className="main-nav" aria-label="Navegação principal">
        <NavLink to="/dashboard">Jogos</NavLink>
        <NavLink to="/lineups">Prancheta</NavLink>
        <NavLink to="/community">Comunidade</NavLink>
      </nav>
      <button className="header-action" type="button" onClick={signOut}>Sair</button>
    </header>
  );
}
