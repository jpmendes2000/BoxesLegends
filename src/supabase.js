// supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nsdsixizbaehfzeddbzc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZHNpeGl6YmFlaGZ6ZWRkYnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODg5NzEsImV4cCI6MjA3Nzc2NDk3MX0.MdIU1Py2r0YSuySAooy9V4V_aMHlO69CXMfuJBqjda4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// MASTER_PASS fixa para desenvolvimento (substitua em produção)
const MASTER_PASS = 'minha_master_pass_dev_2025';

// Função de hash (SHA-256)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Função simples de criptografia XOR + base64 (mantida)
function simpleEncrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result);
}

export function decryptEmail(encryptedEmail, masterPass = MASTER_PASS) {
  try {
    const decoded = atob(encryptedEmail);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ masterPass.charCodeAt(i % masterPass.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (error) {
    console.error('Erro ao descriptografar email:', error);
    return null;
  }
}

async function prepareUserPayload(user, masterPass = MASTER_PASS) {
  return {
    nome: user.nome,
    email: simpleEncrypt(user.email, masterPass),
    senha: await hashPassword(user.senha),
    foto_perfil: user.foto_perfil || null,
    genero: user.genero || 'prefiro não informar',
    kyros: user.kyros || 0,
    status: user.status || 'user',
    descricao_perfil: user.descricao_perfil || null,
    created_at: new Date().toISOString()
  };
}

export async function criarUsuarioTeste(user) {
  try {
    const payload = await prepareUserPayload(user); // usa MASTER_PASS internamente

    const { data, error } = await supabase
      .from('usuarios')
      .insert([payload])
      .select();

    if (error) {
      console.error('Erro ao inserir usuário:', error);
      throw error;
    }

    console.log('Usuário inserido com sucesso:', data);
    return data;
  } catch (err) {
    console.error('Erro ao preparar/inserir usuário:', err);
    throw err;
  }
}

// fazerLogin agora usa MASTER_PASS internamente — não precisa passar pela UI
export async function fazerLogin(email, senha) {
  try {
    const emailCriptografado = simpleEncrypt(email, MASTER_PASS);
    const senhaHash = await hashPassword(senha);

    console.log('Buscando usuário com email criptografado...');

    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', emailCriptografado);

    if (error) {
      console.error('Erro ao buscar usuário:', error);
      throw new Error('Erro ao buscar usuário');
    }

    if (!usuarios || usuarios.length === 0) {
      throw new Error('Email ou senha incorretos');
    }

    const usuario = usuarios[0];

    if (usuario.senha !== senhaHash) {
      throw new Error('Email ou senha incorretos');
    }

    console.log('Login bem-sucedido:', usuario);

    const { senha: _, ...usuarioSemSenha } = usuario;
    return {
      usuario: usuarioSemSenha,
      token: 'token-simulado-' + Date.now()
    };
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}

export const loginComGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
};

export const loginComGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
};

export async function cadastrarUsuario(usuario) {
  try {
    const payload = await prepareUserPayload(usuario); // MASTER_PASS interno

    const { data: usuarioExistente, error: erroBusca } = await supabase
      .from('usuarios')
      .select('email')
      .eq('email', payload.email);

    if (erroBusca) {
      throw new Error('Erro ao verificar usuário existente');
    }

    if (usuarioExistente && usuarioExistente.length > 0) {
      throw new Error('Já existe um usuário com este email');
    }

    const { data, error } = await supabase
      .from('usuarios')
      .insert([payload])
      .select();

    if (error) {
      throw new Error('Erro ao criar usuário: ' + error.message);
    }

    console.log('Usuário cadastrado com sucesso:', data);

    const usuarioCriado = data[0];
    const { senha: _, ...usuarioSemSenha } = usuarioCriado;

    return {
      usuario: usuarioSemSenha,
      token: 'token-simulado-' + Date.now()
    };
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw error;
  }
}
