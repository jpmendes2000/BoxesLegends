import { NavLink } from 'react-router-dom';
import logoImage from '../assets/logo.png';

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
          <NavLink to="/cadastro_de_adiministrador">admin</NavLink>
        </li>
        <li>
          <NavLink to="/cadastro_de_personagens">person</NavLink>
        </li>
        <li>
          <NavLink to="/cadastro_de_local">local</NavLink>
        </li>
        <li>
          <NavLink to="/View_table_local_and_persons">View</NavLink>
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