import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enviarCodigoRecuperacao, validarCodigoRecuperacao, resetarSenha } from '../supabase';
import Navbar from '../components/Navbar';

function ResetarSenha() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1); // 1: email, 2: código, 3: nova senha
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [codigoGerado, setCodigoGerado] = useState('');

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const codigoRecuperacao = await enviarCodigoRecuperacao(email);
      setCodigoGerado(codigoRecuperacao);
      setEtapa(2);
      alert(`Código de recuperação enviado para ${email}! (Código: ${codigoRecuperacao})`);
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidarCodigo = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const valido = await validarCodigoRecuperacao(email, codigo, codigoGerado);
      if (valido) {
        setEtapa(3);
      } else {
        setErro('Código inválido ou expirado');
      }
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetarSenha = async (e) => {
    e.preventDefault();
    setErro('');

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    if (novaSenha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await resetarSenha(email, novaSenha);
      alert('Senha alterada com sucesso!');
      navigate('/login');
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Navbar />
      
      <button 
        className="back-btn-fixed" 
        onClick={() => navigate('/login')}
      >
        ← Voltar para Login
      </button>

      <div className="login-left">
        <h1 className="login-title">
          Recuperar senha<span className="dot">.</span>
        </h1>

        {erro && (
          <div className="error-banner">
            {erro}
          </div>
        )}

        {/* ETAPA 1: ENVIAR EMAIL */}
        {etapa === 1 && (
          <form onSubmit={handleEnviarCodigo} className="login-form">
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', textAlign: 'center' }}>
              Digite seu email para receber o código de recuperação
            </p>
            
            <div className="input-group-animated">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label 
                htmlFor="email"
                className={email ? 'active' : ''}
              >
                email
              </label>
              <div className="input-border"></div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar código'}
            </button>
          </form>
        )}

        {/* ETAPA 2: VALIDAR CÓDIGO */}
        {etapa === 2 && (
          <form onSubmit={handleValidarCodigo} className="login-form">
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', textAlign: 'center' }}>
              Digite o código de 8 dígitos enviado para seu email
            </p>
            
            <div className="input-group-animated">
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 8))}
                maxLength="8"
                required
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
              />
              <label 
                htmlFor="codigo"
                className={codigo ? 'active' : ''}
              >
                código
              </label>
              <div className="input-border"></div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Validando...' : 'Validar código'}
            </button>

            <button 
              type="button" 
              className="secondary-btn"
              onClick={() => setEtapa(1)}
              style={{
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.1)',
                color: '#e6e6e6',
                marginTop: '10px'
              }}
            >
              Reenviar código
            </button>
          </form>
        )}

        {/* ETAPA 3: NOVA SENHA */}
        {etapa === 3 && (
          <form onSubmit={handleResetarSenha} className="login-form">
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', textAlign: 'center' }}>
              Digite sua nova senha
            </p>
            
            <div className="input-group-animated">
              <input
                type="password"
                id="novaSenha"
                name="novaSenha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />
              <label 
                htmlFor="novaSenha"
                className={novaSenha ? 'active' : ''}
              >
                nova senha
              </label>
              <div className="input-border"></div>
            </div>

            <div className="input-group-animated">
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
              <label 
                htmlFor="confirmarSenha"
                className={confirmarSenha ? 'active' : ''}
              >
                confirmar senha
              </label>
              <div className="input-border"></div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Alterando...' : 'Alterar senha'}
            </button>
          </form>
        )}
      </div>

      <div className="login-right"></div>
    </div>
  );
}

export default ResetarSenha;