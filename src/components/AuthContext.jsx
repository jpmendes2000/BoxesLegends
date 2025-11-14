// AuthContext.jsx
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, decryptEmail } from '../supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para carregar usuário do localStorage ou Supabase
    const loadUser = async () => {
      try {
        // 1. Primeiro, verifica se há sessão OAuth no Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Login OAuth (Google/GitHub)
          const oauthUser = {
            id: session.user.id,
            email: session.user.email,
            nome: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            foto_perfil: session.user.user_metadata?.avatar_url || null,
            status: 'user', // OAuth users são 'user' por padrão
            tipo_login: 'oauth'
          };
          setUser(oauthUser);
          localStorage.setItem('user', JSON.stringify(oauthUser));
        } else {
          // 2. Se não há sessão OAuth, verifica localStorage (login tradicional)
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              // Descriptografa o email se necessário
              if (parsedUser.email && !parsedUser.email.includes('@')) {
                parsedUser.email = decryptEmail(parsedUser.email) || parsedUser.email;
              }
              setUser(parsedUser);
            } catch (err) {
              console.error('Erro ao carregar usuário do localStorage:', err);
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Ouvir mudanças de autenticação OAuth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const oauthUser = {
          id: session.user.id,
          email: session.user.email,
          nome: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          foto_perfil: session.user.user_metadata?.avatar_url || null,
          status: 'user',
          tipo_login: 'oauth'
        };
        setUser(oauthUser);
        localStorage.setItem('user', JSON.stringify(oauthUser));
      } else {
        // Se a sessão OAuth foi encerrada, verifica se há usuário tradicional
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.tipo_login !== 'oauth') {
              setUser(parsedUser);
            } else {
              setUser(null);
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          } catch {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { ok: true, user: data.user };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Limpa localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Se for usuário OAuth, faz signOut no Supabase
      if (user?.tipo_login === 'oauth') {
        await supabase.auth.signOut();
      }
      
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpa o estado local
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};