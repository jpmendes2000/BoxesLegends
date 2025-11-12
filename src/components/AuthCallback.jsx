import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../components/AuthContext';

function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Pega a sessão do Supabase Auth
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session && session.user) {
          console.log('Sessão OAuth encontrada:', session);

          // Prepara o objeto do usuário para salvar
          const usuarioOAuth = {
            id: session.user.id,
            nome: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário',
            email: session.user.email,
            foto_perfil: session.user.user_metadata?.avatar_url || null,
            status: 'user',
            kyros: 0,
            genero: 'prefiro não informar',
            provider: session.user.app_metadata?.provider || 'email'
          };

          // Salva no contexto e localStorage
          setUser(usuarioOAuth);
          localStorage.setItem('usuario', JSON.stringify(usuarioOAuth));
          localStorage.setItem('token', session.access_token);

          console.log('Login OAuth bem-sucedido!');
          
          // Redireciona para home
          navigate('/', { replace: true });
        } else {
          console.log('Nenhuma sessão encontrada');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Erro no callback OAuth:', error);
        alert('Erro ao processar login. Tente novamente.');
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, setUser]);

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Processando login...</p>
      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginTop: '10px' }}>
        Aguarde enquanto validamos suas credenciais
      </p>
    </div>
  );
}

export default AuthCallback;