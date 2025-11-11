import React, { createContext, useContext, useEffect, useState } from 'react';
import { fazerLogin } from '../supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // usuário (objeto vindo do supabase)
  const [token, setToken] = useState(null);    // token simulado do teu fazerLogin
  const [loading, setLoading] = useState(true);

  // ao carregar, tenta recuperar do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      }
    } catch (err) {
      console.error('Erro ao ler auth do localStorage', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // salva no localStorage quando user/token mudam
  useEffect(() => {
    if (user || token) {
      localStorage.setItem('auth', JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem('auth');
    }
  }, [user, token]);

  // função que faz login usando a tua função do supabase.js
  // masterPass é lido da env (REACT_APP_MASTER_PASS) por segurança
  async function login(email, senha) {
    try {
      const masterPass = process.env.REACT_APP_MASTER_PASS || ''; 
      const res = await fazerLogin(email, senha, masterPass);
      // res: { usuario: { ... }, token: '...' }
      setUser(res.usuario);
      setToken(res.token);
      return { ok: true };
    } catch (err) {
      console.error('Erro no login (AuthProvider):', err);
      return { ok: false, error: err.message || String(err) };
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    // se tiver rotinas de logout no supabase, roda aqui também
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
