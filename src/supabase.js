// supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nsdsixizbaehfzeddbzc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZHNpeGl6YmFlaGZ6ZWRkYnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODg5NzEsImV4cCI6MjA3Nzc2NDk3MX0.MdIU1Py2r0YSuySAooy9V4V_aMHlO69CXMfuJBqjda4';

// Cria o cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função de hash simples
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Função simples de criptografia (apenas para teste)
function simpleEncrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result);
}

/**
 * Função para descriptografar email (se necessário)
 */
export function decryptEmail(encryptedEmail, masterPass) {
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

/**
 * Prepara os dados do usuário para inserção
 */
async function prepareUserPayload(user, masterPass) {
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

/**
 * Cria um usuário no Supabase
 */
export async function criarUsuarioTeste(user, masterPass) {
  try {
    const payload = await prepareUserPayload(user, masterPass);

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

/**
 * Função de login
 */
export async function fazerLogin(email, senha, masterPass) {
  try {
    // Criptografa o email para buscar no banco
    const emailCriptografado = simpleEncrypt(email, masterPass);
    const senhaHash = await hashPassword(senha);

    console.log('Buscando usuário com email criptografado...');

    // Busca o usuário no banco
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

    // Verifica a senha
    if (usuario.senha !== senhaHash) {
      throw new Error('Email ou senha incorretos');
    }

    console.log('Login bem-sucedido:', usuario);
    
    // Retorna os dados do usuário (sem a senha)
    const { senha: _, ...usuarioSemSenha } = usuario;
    return {
      usuario: usuarioSemSenha,
      token: 'token-simulado-' + Date.now() // Em produção, use JWT real
    };
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}

export const loginComGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  } catch (error) {
    throw new Error(error.message)
  }
}

export const loginComGitHub = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  } catch (error) {
    throw new Error(error.message)
  }
}

/**
 * Função de cadastro de usuário normal
 */
export async function cadastrarUsuario(usuario, masterPass) {
  try {
    const payload = await prepareUserPayload(usuario, masterPass);

    // Verifica se o usuário já existe
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

    // Insere o novo usuário
    const { data, error } = await supabase
      .from('usuarios')
      .insert([payload])
      .select();

    if (error) {
      throw new Error('Erro ao criar usuário: ' + error.message);
    }

    console.log('Usuário cadastrado com sucesso:', data);
    
    // Retorna os dados sem a senha
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