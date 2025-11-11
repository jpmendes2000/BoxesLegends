import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logoImage from '../assets/logo-bx-legends.png';
import { useAuth } from '../components/AuthContext';


function Navbar() {
  const { user, logout } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const adminOnlyPaths = new Set([
    '/cadastro_de_adiministrador',
    '/cadastro_de_personagens',
    '/cadastro_de_local',
    '/View_table_local_and_persons'
  ]);

  const handleNavClick = (e, path) => {
    if (path === '/login') return;

    // se rota exigir admin
    if (adminOnlyPaths.has(path)) {
      if (!user) {
        e.preventDefault();
        setPopupMessage('Você precisa fazer login para acessar essa área.');
        setShowPopup(true);
        return;
      }
      if (user && user.status !== 'admin') {
        e.preventDefault();
        setPopupMessage('Apenas administradores podem acessar esta página.');
        setShowPopup(true);
        return;
      }
    }

    // se não exigir admin e não estiver logado, deixamos navegar (caso tu queira bloquear todas as rotas não logadas, adapta aqui)
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  const items = [
    { path: '/', label: 'Home' },
    { path: '/cadastro_de_adiministrador', label: 'Admin' },
    { path: '/cadastro_de_personagens', label: 'Person' },
    { path: '/cadastro_de_local', label: 'Local' },
    { path: '/View_table_local_and_persons', label: 'View' },
    { path: '/boxes', label: 'Boxes' },
    { path: '/ranking', label: 'Ranking' },
    { path: '/biblioteca', label: 'Biblioteca' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/usuario', label: 'Usuário' },
    { path: '/login', label: user ? `Sair (${user.nome || user.name})` : 'Login' },
  ];

  const handleLoginLogout = (path) => {
    if (path === '/login') {
      if (user) {
        logout();
        navigate('/');
      } else {
        navigate('/login');
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <nav className="container-superior-menu">
        <div className="logo">
          <img src={logoImage} alt="Logo Boxes Legends" />
        </div>

        <div className="top-spacer" />

        <ul>
          {items.map((item) => (
            <li key={item.path}>
              {/* Se for o item login, usamos handleLoginLogout para sair quando já logado */}
              {item.path === '/login' ? (
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLoginLogout(item.path);
                  }}
                  className={item.path === '/' ? 'active' : ''}
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h2>Atenção</h2>
            <p>{popupMessage}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => {
                  closePopup();
                  navigate('/login');
                }}
              >
                Ir para login
              </button>
              <button
                onClick={closePopup}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '10px 14px',
                  borderRadius: 8
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
