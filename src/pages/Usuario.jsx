// src/pages/Usuario.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import InputComGaleria from '../components/InputComGaleria';
import { supabase } from '../supabase';

// Função para descriptografar o email (a mesma do supabase.js)
function decryptEmail(encryptedEmail, key = 'minha_master_pass_dev_2025') {
  try {
    const decoded = atob(encryptedEmail);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (error) {
    console.error('Erro ao descriptografar email:', error);
    return encryptedEmail; // Retorna o original se não conseguir descriptografar
  }
}

// Funções de criptografia para o localStorage
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
  // Antes de salvar, garante que o email está descriptografado para o frontend
  const usuarioComEmailDescriptografado = {
    ...usuario,
    email: usuario.emailDescriptografado || decryptEmail(usuario.email) || usuario.email
  };
  
  const encrypted = encryptData(usuarioComEmailDescriptografado);
  if (encrypted) {
    localStorage.setItem('user_encrypted', encrypted);
    localStorage.removeItem('usuario');
    localStorage.removeItem('user');
  }
};

const carregarUsuario = () => {
  const encryptedUser = localStorage.getItem('user_encrypted');
  if (encryptedUser) {
    const usuario = decryptData(encryptedUser);
    // Garante que o email está descriptografado
    if (usuario && usuario.email && usuario.email.includes('==')) {
      usuario.emailDescriptografado = decryptEmail(usuario.email);
    }
    return usuario;
  }
  
  const userLegacy = localStorage.getItem('user');
  if (userLegacy) {
    const usuario = JSON.parse(userLegacy);
    // Garante que o email está descriptografado
    if (usuario && usuario.email && usuario.email.includes('==')) {
      usuario.emailDescriptografado = decryptEmail(usuario.email);
    }
    salvarUsuario(usuario);
    localStorage.removeItem('user');
    return usuario;
  }
  
  const usuarioLegacy = localStorage.getItem('usuario');
  if (usuarioLegacy) {
    const usuario = JSON.parse(usuarioLegacy);
    // Garante que o email está descriptografado
    if (usuario && usuario.email && usuario.email.includes('==')) {
      usuario.emailDescriptografado = decryptEmail(usuario.email);
    }
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
  const [supabaseStatus, setSupabaseStatus] = useState('verificando...');

  useEffect(() => {
    verificarSupabase();
    verificarUsuarioLogado();
  }, [navigate]);

  // Função para verificar se o Supabase está respondendo
  const verificarSupabase = async () => {
    try {
      const { data, error } = await supabase.from('usuarios').select('count').limit(1);
      if (error) throw error;
      setSupabaseStatus('online 🟢');
    } catch (error) {
      setSupabaseStatus('offline 🔴');
      console.error('Supabase offline:', error);
    }
  };

  const verificarUsuarioLogado = () => {
    try {
      const usuarioLogado = carregarUsuario();
      console.log('👤 Usuário carregado:', usuarioLogado);
      
      if (!usuarioLogado) {
        alert('Você precisa fazer login primeiro!');
        navigate('/login');
        return;
      }

      // Garante que temos o email descriptografado
      const usuarioComEmailCorreto = {
        ...usuarioLogado,
        email: usuarioLogado.emailDescriptografado || decryptEmail(usuarioLogado.email) || usuarioLogado.email
      };

      setUsuario(usuarioComEmailCorreto);
      setEditData({
        foto_perfil: usuarioComEmailCorreto.foto_perfil || '',
        nome: usuarioComEmailCorreto.nome || '',
        descricao_perfil: usuarioComEmailCorreto.descricao_perfil || '',
        genero: usuarioComEmailCorreto.genero || 'prefiro não informar',
        senha: ''
      });
      
      carregarPersonagens(usuarioComEmailCorreto.id);
      
    } catch (error) {
      console.error('Erro ao verificar usuário logado:', error);
      alert('Erro ao carregar dados do usuário.');
      navigate('/login');
    }
  };

  const carregarPersonagens = async (idUsuario) => {
    try {
      console.log('🎭 Carregando personagens para usuário:', idUsuario);
      
      // Como você está usando Supabase, vamos buscar os personagens diretamente
      const { data, error } = await supabase
        .from('personagens')
        .select('*')
        .eq('id_usuario', idUsuario)
        .limit(3);

      if (error) {
        console.error('Erro ao carregar personagens:', error);
        setPersonagens([]);
      } else {
        console.log('Personagens carregados:', data);
        setPersonagens(data || []);
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
    if (!usuario || !usuario.id) {
      alert('Erro: Usuário não encontrado');
      return;
    }

    const { nome, descricao_perfil, genero, senha, foto_perfil } = editData;

    // Preparar updates
    const updates = {};
    if (nome && nome !== usuario.nome) updates.nome = nome;
    if (descricao_perfil !== usuario.descricao_perfil) updates.descricao_perfil = descricao_perfil;
    if (genero !== usuario.genero) updates.genero = genero;
    if (foto_perfil !== usuario.foto_perfil) updates.foto_perfil = foto_perfil;
    
    // Se tiver senha, vamos hash ela
    let senhaHash = null;
    if (senha) {
      const encoder = new TextEncoder();
      const data = encoder.encode(senha);
      const hash = await crypto.subtle.digest('SHA-256', data);
      senhaHash = Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      updates.senha = senhaHash;
    }

    console.log('🔄 Atualizando usuário:', updates);

    if (Object.keys(updates).length > 0) {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .update(updates)
          .eq('id', usuario.id)
          .select();

        if (error) {
          console.error('❌ Erro do Supabase:', error);
          alert('Erro ao atualizar perfil: ' + error.message);
          return;
        }

        if (data && data.length > 0) {
          // Ao atualizar, mantém o email descriptografado
          const updatedUsuario = { 
            ...usuario, 
            ...data[0],
            email: usuario.email // Mantém o email descriptografado
          };
          setUsuario(updatedUsuario);
          salvarUsuario(updatedUsuario);
          setShowEditPopup(false);
          alert('Perfil atualizado com sucesso!');
        } else {
          alert('Nenhum dado retornado após atualização');
        }
      } catch (error) {
        console.error('💥 Erro ao atualizar perfil:', error);
        alert('Erro ao atualizar perfil: ' + error.message);
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

  // Função para obter o email descriptografado
  const getEmailDescriptografado = () => {
    if (!usuario) return '';
    
    // Se já temos o email descriptografado, retorna ele
    if (usuario.email && !usuario.email.includes('==')) {
      return usuario.email;
    }
    
    // Se não, tenta descriptografar
    return decryptEmail(usuario.email) || usuario.email;
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-left" style={{ width: '100%' }}>
          <h2>Carregando seu perfil...</h2>
          <p>Status do Supabase: {supabaseStatus}</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="login-container">
        <div className="login-left" style={{ width: '100%' }}>
          <h2>Usuário não encontrado</h2>
          <button onClick={() => navigate('/login')} className="upload-foto-btn">
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <Navbar />
      
      {/* Status do Supabase */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: supabaseStatus.includes('online') ? '#4CAF50' : '#f44336',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        Supabase: {supabaseStatus}
      </div>

      <button className="back-btn-fixed" onClick={() => navigate('/')}>
        ← Voltar pra Home
      </button>

      <div className="login-left perfil-usuario-page instagram-profile">
        <h1 className="login-title">
          Meu Perfil<span className="dot">.</span>
        </h1>

        {supabaseStatus === 'offline 🔴' && (
          <div style={{
            background: '#f44336',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            ⚠️ <strong>Supabase Offline</strong><br/>
            Verifique sua conexão com a internet.
          </div>
        )}

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
            {/* Email descriptografado */}
            <p className="bio">{getEmailDescriptografado()}</p>
            <p className="bio">Gênero: {usuario.genero}</p>
          </div>
        </div>

        {/* ... (resto do componente igual) */}
        <div className="instagram-grid">
          <h3 className="vitrine-titulo">Personagens em Destaque</h3>
          <div className="grid-container">
            {personagens.length > 0 ? (
              personagens.map((personagem, index) => (
                <div key={personagem.id || index} className="grid-item">
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

      {/* Popup de Edição (mantido igual) */}
      {showEditPopup && (
        <div className="edit-popup-overlay">
          <div className="edit-popup">
            <h2>Editar Perfil</h2>
            
            {supabaseStatus === 'offline 🔴' && (
              <div style={{
                background: '#ff9800',
                color: 'white',
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '14px'
              }}>
                ⚠️ Supabase Offline - Alterações não serão salvas
              </div>
            )}
            
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
                <button 
                  className="save-btn" 
                  onClick={handleSaveEdits}
                  disabled={supabaseStatus === 'offline 🔴'}
                >
                  {supabaseStatus === 'offline 🔴' ? 'Supabase Offline' : 'Salvar Alterações'}
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