import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './pages/styles/style-global.css';
import './pages/styles/login.css'

import { GaleriaProvider } from './components/GaleriaContext';

// Importando todas as páginas
import Home from './pages/Home';
import Boxes from './pages/Boxes';
import Ranking from './pages/Ranking';
import DexPersons from './pages/DexPersons';
import Marketplace from './pages/Marketplace';
import Usuario from './pages/Usuario';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Cadastro_admin from './pages/Admin/Cadastro_admin';
import Cadastro_person from './pages/Admin/Cadastro_person';
import Cadastro_local from './pages/Admin/Cadastro_local';
import View from './pages/Admin/View';

function App() {  
  return (
    <GaleriaProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boxes" element={<Boxes />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/biblioteca" element={<DexPersons />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/cadatro_de_adiministrador" element={<Cadastro_admin />}/>
            <Route path="/cadatro_de_personagens" element={<Cadastro_person />}/>
            <Route path="/cadatro_de_local" element={<Cadastro_local />}/>
            <Route path="/View_table_local_and_persons" element={<View />}/>
            <Route path="*" element={<div className="error-page"><h2>404 - Página não encontrada</h2></div>} />
          </Routes>
        </div>
      </Router>
    </GaleriaProvider>
  );
}

export default App;