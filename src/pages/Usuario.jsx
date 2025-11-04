// src/pages/Usuario.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Usuario() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [personagens, setPersonagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    nome: '',
    senha: '',
  });

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuarioLogado) {
      alert('Você precisa fazer login primeiro!');
      navigate('/login');
      return;
    }

    setUsuario(usuarioLogado);
    setEditData({ nome: usuarioLogado.nome, senha: '' }); // Initialize edit data with current name
    carregarPersonagens(usuarioLogado.id);
  }, [navigate]);

  const carregarPersonagens = async (idUsuario) => {
    try {
      const response = await fetch(`http://localhost:3001/usuario/${idUsuario}/personagens`);
      const data = await response.json();
      
      if (response.ok) {
        setPersonagens(data.personagens.slice(0, 9));
      }
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoPerfil(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewFoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdits = async () => {
    const { nome, senha } = editData;
    const idUsuario = usuario.id_usuario;

    // Prepare form data for photo upload if present
    let fotoAtualizada = false;
    if (fotoPerfil) {
      const formData = new FormData();
      formData.append('foto', fotoPerfil);
      formData.append('id_usuario', idUsuario);

      try {
        const response = await fetch('http://localhost:3001/usuario/foto', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          fotoAtualizada = true;
          setUsuario(prev => ({ ...prev, foto_perfil: data.foto_perfil }));
          localStorage.setItem('usuario', JSON.stringify({ ...usuario, foto_perfil: data.foto_perfil }));
        } else {
          alert('Erro ao atualizar foto: ' + data.erro);
          return;
        }
      } catch (error) {
        console.error('Erro ao enviar foto:', error);
        alert('Erro ao atualizar foto');
        return;
      }
    }

    // Update name and/or password
    const updates = {};
    if (nome && nome !== usuario.nome) updates.nome = nome;
    if (senha) updates.senha = senha; // Note: Server will hash this

    if (Object.keys(updates).length > 0 || fotoAtualizada) {
      try {
        const response = await fetch(`http://localhost:3001/usuario/${idUsuario}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        const data = await response.json();
        if (response.ok) {
          const updatedUsuario = { ...usuario, nome: updates.nome || usuario.nome };
          setUsuario(updatedUsuario);
          localStorage.setItem('usuario', JSON.stringify(updatedUsuario));
          setEditMode(false);
          alert('Perfil atualizado com sucesso!');
        } else {
          alert('Erro ao atualizar perfil: ' + data.erro);
        }
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        alert('Erro ao atualizar perfil');
      }
    } else if (!fotoAtualizada) {
      alert('Nenhuma alteração detectada!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    alert('Logout realizado com sucesso!');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-left" style={{ width: '100%' }}>
          <h2>Carregando...</h2>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="login-container">
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
              {previewFoto || usuario.foto_perfil ? (
                <img src={previewFoto || usuario.foto_perfil} alt="Foto de perfil" />
              ) : (
                <div className="foto-placeholder">📷</div>
              )}
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
            <p className="bio">{usuario.email}</p>
            <button
              className="upload-foto-btn"
              onClick={() => setEditMode(true)}
            >
              Editar
            </button>
          </div>
        </div>

        {editMode && (
          <div className="edit-profile-section">
            <div className="perfil-foto-section">
              <div className="foto-perfil-container">
                <div className="foto-perfil-preview">
                  {previewFoto || usuario.foto_perfil ? (
                    <img src={previewFoto || usuario.foto_perfil} alt="Foto de perfil" />
                  ) : (
                    <div className="foto-placeholder">📷</div>
                  )}
                </div>
                <label htmlFor="upload-foto" className="upload-foto-btn">
                  Alterar Foto
                </label>
                <input
                  type="file"
                  id="upload-foto"
                  accept="image/*"
                  onChange={handleFotoChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <div className="perfil-info edit-form">
              <div className="info-item">
                <label>Nome:</label>
                <input
                  type="text"
                  name="nome"
                  value={editData.nome}
                  onChange={handleEditChange}
                  className="input-group-animated"
                />
              </div>
              <div className="info-item">
                <label>Senha:</label>
                <input
                  type="password"
                  name="senha"
                  value={editData.senha}
                  onChange={handleEditChange}
                  className="input-group-animated"
                  placeholder="Deixe em branco para não alterar"
                />
              </div>
              <button className="salvar-foto-btn" onClick={handleSaveEdits}>
                Salvar Alterações
              </button>
              <button
                className="logout-btn"
                style={{ marginTop: '10px' }}
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

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
              Array.from({ length: 9 }).map((_, index) => (
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

        {!editMode && (
          <button className="logout-btn" onClick={handleLogout}>
            Sair da Conta
          </button>
        )}
      </div>

      <div className="login-right"></div>
    </div>
  );
}

export default Usuario;