// AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // O Supabase automaticamente processa o token da URL
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          console.log('Login OAuth bem-sucedido:', session.user);
          
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
  }, [navigate]);

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Processando login...</p>
    </div>
  );
}

export default AuthCallback;