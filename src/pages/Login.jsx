// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fazerLogin } from './Admin/supabase';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [focused, setFocused] = useState({
    email: false,
    password: false
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (field) => {
    setFocused(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleBlur = (field) => {
    setFocused(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usa a função do Supabase
      const resultado = await fazerLogin(
        formData.email, 
        formData.password, 
        'S3nh@MestreSuperSecreta!'
      );

      // Salva dados do usuário no localStorage
      localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
      localStorage.setItem('token', resultado.token);
      
      alert(`Bem-vindo de volta, ${resultado.usuario.nome}!`);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Botão fixo no canto superior esquerdo */}
      <button 
        className="back-btn-fixed" 
        onClick={() => navigate('/')}
      >
        ← Voltar pra Home
      </button>

      <div className="login-left">
        <h1 className="login-title">
          Faça seu login<span className="dot">.</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group-animated">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => handleFocus('email')}
              onBlur={() => handleBlur('email')}
              required
            />
            <label 
              htmlFor="email"
              className={focused.email || formData.email ? 'active' : ''}
            >
              email
            </label>
            <div className="input-border"></div>
          </div>

          <div className="input-group-animated">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              required
            />
            <label 
              htmlFor="password"
              className={focused.password || formData.password ? 'active' : ''}
            >
              senha
            </label>
            <div className="input-border"></div>
          </div>

          <Link to="/resetar-senha" className="forgot-link">
            Esqueci minha senha
          </Link>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="signup-text">
          <Link to="/cadastro">Ainda não tenho uma conta +</Link>
        </p>
      </div>

      <div className="login-right"></div>
    </div>
  );
}

export default Login;