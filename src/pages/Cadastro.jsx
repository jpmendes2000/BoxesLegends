// src/pages/Cadastro.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cadastrarUsuario } from "../supabase";
import Navbar from '../components/Navbar';

function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [focused, setFocused] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação do formulário
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // Usa a função do Supabase
      const resultado = await cadastrarUsuario(
        {
          nome: formData.username,
          email: formData.email,
          senha: formData.password,
          genero: 'prefiro não informar',
          kyros: 0,
          status: 'user'
        },
        'S3nh@MestreSuperSecreta!'
      );

      // Salva dados do usuário no localStorage
      localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
      localStorage.setItem('token', resultado.token);

      alert(`Bem-vindo, ${formData.username}! Conta criada com sucesso!`);
      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Navbar />
      <div className="login-left">
        <button 
          type="button" 
          className="back-btn-fixed" 
          onClick={() => navigate('/')}
        >
          ← Voltar pra Home
        </button>

        <h1 className="login-title">
          Crie sua conta<span className="dot">.</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group-animated">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onFocus={() => handleFocus('username')}
              onBlur={() => handleBlur('username')}
              required
            />
            <label 
              htmlFor="username"
              className={focused.username || formData.username ? 'active' : ''}
            >
              nome de usuário
            </label>
            <div className="input-border"></div>
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

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
            {errors.email && <span className="error-message">{errors.email}</span>}
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
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="input-group-animated">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={() => handleBlur('confirmPassword')}
              required
            />
            <label 
              htmlFor="confirmPassword"
              className={focused.confirmPassword || formData.confirmPassword ? 'active' : ''}
            >
              confirmar senha
            </label>
            <div className="input-border"></div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="login-btn" disabled={loading}>  
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>

        <p className="signup-text">
          <Link to="/login">Já tenho uma conta +</Link>
        </p>
      </div>

      <div className="login-right"></div>
    </div>
  );
}

export default Cadastro;