import { NavLink } from 'react-router-dom';
import logoImage from '../assets/images.png';

function Navbar() {
  return (
    <nav className="container-superior-menu">
      <div className="logo">
        <img src={logoImage} alt="Logo Boxes Legends" />
      </div>
      <ul>
        <li>
          <NavLink to="/" end>Home</NavLink>
        </li>
        <li>
          <NavLink to="/boxes">Boxes</NavLink>
        </li>
        <li>
          <NavLink to="/ranking">Ranking</NavLink>
        </li>
        <li>
          <NavLink to="/biblioteca">Biblioteca</NavLink>
        </li>
        <li>
          <NavLink to="/marketplace">Marketplace</NavLink>
        </li>
        <li>
          <NavLink to="/usuario">Usuário</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;