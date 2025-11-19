import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logoImage from '../assets/logo-bx-legends.png';
import { useAuth } from '../components/AuthContext';

// Importando ícones
import { 
  FaHome, 
  FaUserShield, 
  FaUser, 
  FaMapMarkerAlt, 
  FaEye, 
  FaBox, 
  FaTrophy, 
  FaBook, 
  FaStore, 
  FaUserCircle,
  FaSignInAlt,
  FaSignOutAlt
} from 'react-icons/fa';

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Verifica se o usuário é admin
  const isAdmin = user && user.status === 'admin';

  // Define todos os itens do menu com seus ícones
  const allItems = [
    { path: '/', label: 'Home', icon: <FaHome />, requiresLogin: false, requiresAdmin: false },
    { path: '/cadastro_de_adiministrador', label: 'Admin', icon: <FaUserShield />, requiresLogin: true, requiresAdmin: true },
    { path: '/cadastro_de_personagens', label: 'Person', icon: <FaUser />, requiresLogin: true, requiresAdmin: true },
    { path: '/cadastro_de_local', label: 'Local', icon: <FaMapMarkerAlt />, requiresLogin: true, requiresAdmin: true },
    { path: '/View_table_local_and_persons', label: 'View', icon: <FaEye />, requiresLogin: true, requiresAdmin: true },
    { path: '/boxes', label: 'Boxes', icon: <FaBox />, requiresLogin: true, requiresAdmin: false },
    { path: '/ranking', label: 'Ranking', icon: <FaTrophy />, requiresLogin: true, requiresAdmin: false },
    { path: '/biblioteca', label: 'Biblioteca', icon: <FaBook />, requiresLogin: true, requiresAdmin: false },
    { path: '/marketplace', label: 'Marketplace', icon: <FaStore />, requiresLogin: true, requiresAdmin: false },
    { path: '/usuario', label: 'Usuário', icon: <FaUserCircle />, requiresLogin: true, requiresAdmin: false },
  ];

  // Filtra os itens: mostra tudo se for admin, senão só os que não exigem admin
  const visibleItems = allItems.filter(item => {
    if (item.requiresAdmin) {
      return isAdmin; // Só mostra se for admin
    }
    return true; // Itens normais aparecem sempre
  });

  const handleNavClick = (e, item) => {
    // Se for a home, deixa passar
    if (item.path === '/') {
      setMenuOpen(false);
      return;
    }

    // Se exige login e não está logado
    if (item.requiresLogin && !user) {
      e.preventDefault();
      alert('Você precisa fazer login para acessar essa página.');
      navigate('/login');
      setMenuOpen(false);
      return;
    }

    // Se exige admin e não é admin
    if (item.requiresAdmin && (!user || user.status !== 'admin')) {
      e.preventDefault();
      alert('Apenas administradores podem acessar esta página.');
      setMenuOpen(false);
      return;
    }

    // Se passou, fecha o menu mobile
    setMenuOpen(false);
  };

  const handleLoginLogout = async (e) => {
    e.preventDefault();
    if (user) {
      await logout();
      alert('Você saiu da sua conta!');
      navigate('/');
    } else {
      navigate('/login');
    }
    setMenuOpen(false);
  };

  // Função para clicar na logo/foto de perfil
  const handleLogoClick = () => {
    if (user) {
      // Se está logado, vai para a página do usuário
      navigate('/usuario');
    } else {
      // Se não está logado, vai para a home
      navigate('/');
    }
    setMenuOpen(false);
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
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          {user && user.foto_perfil ? (
            // Foto de perfil do usuário quando está logado
            <img 
              src={user.foto_perfil} 
              alt={`Foto de ${user.nome || user.name}`}
              style={{
                width: '92px',
                height: '92px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent)',
                transition: 'all 0.3s ease'
              }}
              onError={(e) => {
                // Se a foto não carregar, mostra a logo padrão
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : (
            // Logo padrão quando não está logado ou não tem foto
            <img 
              src={logoImage} 
              alt="Logo Boxes Legends" 
              style={{
                width: '92px',
                height: '92px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent)'
              }}
            />
          )}
        </div>

        <div className="top-spacer" />

        <ul>
          {visibleItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                onClick={(e) => handleNavClick(e, item)}
                className={({ isActive }) => 
                  `nav-link-with-icon ${isActive ? 'active' : ''}`
                }
              >
                {item.icon}
                <span className="nav-link-text">{item.label}</span>
              </NavLink>
            </li>
          ))}
          
          {/* Botão de Login/Logout - só aparece se não estiver logado OU para fazer logout */}
          <li>
            <a
              href="#!"
              onClick={handleLoginLogout}
              className="nav-link-with-icon"
            >
              {user ? <FaSignOutAlt /> : <FaSignInAlt />}
              <span className="nav-link-text">
                {user ? `Sair (${user.nome || user.name})` : 'Login'}
              </span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Overlay para fechar menu mobile */}
      {menuOpen && (
        <div 
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* CSS adicional para hover na foto */}
      <style jsx>{`
        .logo img:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
        }
      `}</style>
    </>
  );
}

export default Navbar;