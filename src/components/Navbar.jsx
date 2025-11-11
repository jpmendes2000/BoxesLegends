import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logoImage from '../assets/logo-bx-legends.png';
import { useAuth } from '../components/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  // Verifica se o usuário é admin
  const isAdmin = user && user.status === 'admin';

  // Define todos os itens do menu
  const allItems = [
    { path: '/', label: 'Home', requiresLogin: false, requiresAdmin: false },
    { path: '/cadastro_de_adiministrador', label: 'Admin', requiresLogin: true, requiresAdmin: true },
    { path: '/cadastro_de_personagens', label: 'Person', requiresLogin: true, requiresAdmin: true },
    { path: '/cadastro_de_local', label: 'Local', requiresLogin: true, requiresAdmin: true },
    { path: '/View_table_local_and_persons', label: 'View', requiresLogin: true, requiresAdmin: true },
    { path: '/boxes', label: 'Boxes', requiresLogin: true, requiresAdmin: false },
    { path: '/ranking', label: 'Ranking', requiresLogin: true, requiresAdmin: false },
    { path: '/biblioteca', label: 'Biblioteca', requiresLogin: true, requiresAdmin: false },
    { path: '/marketplace', label: 'Marketplace', requiresLogin: true, requiresAdmin: false },
    { path: '/usuario', label: 'Usuário', requiresLogin: true, requiresAdmin: false },
    { path: '/login', label: user ? `Sair (${user.nome || user.name})` : 'Login', requiresLogin: false, requiresAdmin: false },
  ];

  // Filtra os itens: mostra tudo se for admin, senão só os que não exigem admin
  const visibleItems = allItems.filter(item => {
    if (item.requiresAdmin) {
      return isAdmin; // Só mostra se for admin
    }
    return true; // Itens normais aparecem sempre
  });

  const handleNavClick = (e, item) => {
    // Se for o login, deixa passar
    if (item.path === '/login') return;

    // Se for a home, deixa passar
    if (item.path === '/') return;

    // Se exige login e não está logado
    if (item.requiresLogin && !user) {
      e.preventDefault();
      setPopupMessage('Você precisa fazer login para acessar essa página.');
      setShowPopup(true);
      setMenuOpen(false); // Fecha o menu mobile
      return;
    }

    // Se exige admin e não é admin
    if (item.requiresAdmin && (!user || user.status !== 'admin')) {
      e.preventDefault();
      setPopupMessage('Apenas administradores podem acessar esta página.');
      setShowPopup(true);
      setMenuOpen(false); // Fecha o menu mobile
      return;
    }

    // Se passou, fecha o menu mobile
    setMenuOpen(false);
  };

  const handleLoginLogout = (e) => {
    e.preventDefault();
    if (user) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
    setMenuOpen(false); // Fecha o menu mobile
  };

  return (
    <>
      {/* Botão hamburger para mobile */}
      <button 
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`container-superior-menu ${menuOpen ? 'menu-open' : ''}`}>
        <div className="logo">
          <img src={logoImage} alt="Logo Boxes Legends" />
        </div>

        <div className="top-spacer" />

        <ul>
          {visibleItems.map((item) => (
            <li key={item.path}>
              {item.path === '/login' ? (
                <a
                  href="#!"
                  onClick={handleLoginLogout}
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={(e) => handleNavClick(e, item)}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Overlay para fechar menu mobile */}
      {menuOpen && (
        <div 
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Popup de aviso */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h2>⚠️ Atenção</h2>
            <p>{popupMessage}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
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