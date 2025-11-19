// src/pages/Usuario.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import InputComGaleria from '../components/InputComGaleria';

// Funções de criptografia (mantidas do código anterior)
const encryptData = (data, key = 'my-secret-key-123') => {
  try {
    const text = JSON.stringify(data);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result);
  } catch (error) {
    console.error('Erro ao criptografar:', error);
    return null;
  }
};

const decryptData = (encryptedData, key = 'my-secret-key-123') => {
  try {
    const decoded = atob(encryptedData);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return JSON.parse(result);
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    return null;
  }
};

export const salvarUsuario = (usuario) => {
  const encrypted = encryptData(usuario);
  if (encrypted) {
    localStorage.setItem('user_encrypted', encrypted);
    localStorage.removeItem('usuario');
    localStorage.removeItem('user');
  }
};

const carregarUsuario = () => {
  const encryptedUser = localStorage.getItem('user_encrypted');
  if (encryptedUser) {
    return decryptData(encryptedUser);
  }
  
  const userLegacy = localStorage.getItem('user');
  if (userLegacy) {
    const usuario = JSON.parse(userLegacy);
    salvarUsuario(usuario);
    localStorage.removeItem('user');
    return usuario;
  }
  
  const usuarioLegacy = localStorage.getItem('usuario');
  if (usuarioLegacy) {
    const usuario = JSON.parse(usuarioLegacy);
    salvarUsuario(usuario);
    localStorage.removeItem('usuario');
    return usuario;
  }
  
  return null;
};

function Usuario() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [personagens, setPersonagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editData, setEditData] = useState({
    foto_perfil: '',
    nome: '',
    descricao_perfil: '',
    genero: '',
    senha: ''
  });

  useEffect(() => {
    verificarUsuarioLogado();
  }, [navigate]);

  const verificarUsuarioLogado = () => {
    try {
      const usuarioLogado = carregarUsuario();
      
      if (!usuarioLogado) {
        alert('Você precisa fazer login primeiro!');
        navigate('/login');
        return;
      }

      setUsuario(usuarioLogado);
      setEditData({
        foto_perfil: usuarioLogado.foto_perfil || '',
        nome: usuarioLogado.nome || '',
        descricao_perfil: usuarioLogado.descricao_perfil || '',
        genero: usuarioLogado.genero || 'prefiro não informar',
        senha: ''
      });
      
      const idUsuario = usuarioLogado.id_usuario || usuarioLogado.id;
      carregarPersonagens(idUsuario);
      
    } catch (error) {
      console.error('Erro ao verificar usuário logado:', error);
      alert('Erro ao carregar dados do usuário.');
      navigate('/login');
    }
  };

  const carregarPersonagens = async (idUsuario) => {
    try {
      const response = await fetch(`http://localhost:3001/usuario/${idUsuario}/personagens`);
      
      if (response.ok) {
        const data = await response.json();
        setPersonagens(data.personagens?.slice(0, 9) || []);
      }
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
      setPersonagens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (url) => {
    setEditData(prev => ({ ...prev, foto_perfil: url }));
  };

  const handleSaveEdits = async () => {
    const { nome, descricao_perfil, genero, senha, foto_perfil } = editData;
    const idUsuario = usuario.id_usuario || usuario.id;

    if (!idUsuario) {
      alert('Erro: ID do usuário não encontrado');
      return;
    }

    const updates = {};
    if (nome && nome !== usuario.nome) updates.nome = nome;
    if (descricao_perfil !== usuario.descricao_perfil) updates.descricao_perfil = descricao_perfil;
    if (genero !== usuario.genero) updates.genero = genero;
    if (foto_perfil !== usuario.foto_perfil) updates.foto_perfil = foto_perfil;
    if (senha) updates.senha = senha;

    if (Object.keys(updates).length > 0) {
      try {
        const response = await fetch(`http://localhost:3001/usuario/${idUsuario}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          const updatedUsuario = { ...usuario, ...updates };
          setUsuario(updatedUsuario);
          salvarUsuario(updatedUsuario);
          setShowEditPopup(false);
          alert('Perfil atualizado com sucesso!');
        } else {
          alert('Erro ao atualizar perfil: ' + data.erro);
        }
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        alert('Erro ao atualizar perfil');
      }
    } else {
      alert('Nenhuma alteração detectada!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_encrypted');
    localStorage.removeItem('user');
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    alert('Logout realizado com sucesso!');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-left" style={{ width: '100%' }}>
          <h2>Carregando seu perfil...</h2>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="login-container">
      <Navbar />
      <button className="back-btn-fixed" onClick={() => navigate('/')}>
        ← Voltar pra Home
      </button>

      <div className="login-left perfil-usuario-page instagram-profile">
        <h1 className="login-title">
          Meu Perfil<span className="dot">.</span>
        </h1>

        <div className="profile-header">
          <div className="profile-photo">
            <div className="foto-perfil-preview">
              {usuario.foto_perfil ? (
                <img src={usuario.foto_perfil} alt="Foto de perfil" />
              ) : (
                <div className="foto-placeholder">📷</div>
              )}
              <button 
                className="edit-profile-btn"
                onClick={() => setShowEditPopup(true)}
                title="Editar perfil"
              >
                ✏️
              </button>
            </div>
          </div>
          
          <div className="profile-info">
            <h1 className="username">{usuario.nome}</h1>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">{personagens.length}</span>
                <span className="stat-label">Personagens</span>
              </div>
              <div className="stat-item">
                <span className="stat-number kyros-value">
                  🪙 {usuario.kyros?.toLocaleString() || 0}
                </span>
                <span className="stat-label">Kyros</span>
              </div>
            </div>
            {usuario.descricao_perfil && (
              <p className="bio">{usuario.descricao_perfil}</p>
            )}
            <p className="bio">{usuario.email}</p>
            <p className="bio">Gênero: {usuario.genero}</p>
          </div>
        </div>

        <div className="instagram-grid">
          <h3 className="vitrine-titulo">Personagens em Destaque</h3>
          <div className="grid-container">
            {personagens.length > 0 ? (
              personagens.map((personagem, index) => (
                <div key={index} className="grid-item">
                  <div className="vitrine-card">
                    <div className="vitrine-icon">🎭</div>
                    <h4>{personagem.nome}</h4>
                    <span className={`raridade-badge ${personagem.raridade}`}>
                      {personagem.raridade}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="grid-item">
                  <div className="vitrine-card vitrine-empty">
                    <div className="vitrine-icon">❓</div>
                    <p>Slot vazio</p>
                    <small>Abra caixas para conseguir</small>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {personagens.length > 0 && (
            <button
              className="ver-todos-btn"
              onClick={() => navigate('/biblioteca')}
            >
              Ver Todos →
            </button>
          )}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Sair da Conta
        </button>
      </div>

      {/* Popup de Edição */}
      {showEditPopup && (
        <div className="edit-popup-overlay">
          <div className="edit-popup">
            <h2>Editar Perfil</h2>
            
            <div className="edit-foto-section">
              <div className="edit-foto-preview">
                {editData.foto_perfil ? (
                  <img src={editData.foto_perfil} alt="Preview" />
                ) : (
                  <div className="foto-placeholder">📷</div>
                )}
              </div>
            </div>

            <div className="edit-form">
              <div className="form-group">
                <label>Foto de Perfil (URL)</label>
                <InputComGaleria
                  value={editData.foto_perfil}
                  onChange={handleFotoChange}
                  placeholder="Cole a URL ou selecione da galeria"
                  categoria="perfis"
                />
              </div>

              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={editData.nome}
                  onChange={handleEditChange}
                  className="form-input"
                  placeholder="Seu nome"
                />
              </div>

              <div className="form-group">
                <label>Descrição do Perfil</label>
                <textarea
                  name="descricao_perfil"
                  value={editData.descricao_perfil}
                  onChange={handleEditChange}
                  className="form-input form-textarea"
                  placeholder="Conte um pouco sobre você..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Gênero</label>
                <select
                  name="genero"
                  value={editData.genero}
                  onChange={handleEditChange}
                  className="form-select"
                >
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                  <option value="prefiro não informar">Prefiro não informar</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nova Senha</label>
                <input
                  type="password"
                  name="senha"
                  value={editData.senha}
                  onChange={handleEditChange}
                  className="form-input"
                  placeholder="Deixe em branco para não alterar"
                />
              </div>

              <div className="edit-popup-buttons">
                <button className="save-btn" onClick={handleSaveEdits}>
                  Salvar Alterações
                </button>
                <button 
                  className="cancel-btn" 
                  onClick={() => setShowEditPopup(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="login-right"></div>
    </div>
  );
}

export default Usuario;