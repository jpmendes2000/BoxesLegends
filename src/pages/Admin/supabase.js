// supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nsdsixizbaehfzeddbzc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZHNpeGl6YmFlaGZ6ZWRkYnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODg5NzEsImV4cCI6MjA3Nzc2NDk3MX0.MdIU1Py2r0YSuySAooy9V4V_aMHlO69CXMfuJBqjda4';

// Cria o cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função de hash simples (substitui o connector.js)
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
  // Em produção, use uma biblioteca de criptografia adequada
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result); // Converte para base64
}

/**
 * Prepara os dados do usuário para inserção
 */
async function prepareUserPayload(user, masterPass) {
  return {
    nome: user.nome,
    email: simpleEncrypt(user.email, masterPass), // Criptografa email
    senha: await hashPassword(user.senha), // Hash da senha
    foto_perfil: user.foto_perfil || null,
    genero: user.genero,
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
    // Prepara payload
    const payload = await prepareUserPayload(user, masterPass);

    // Insere no Supabase na tabela "usuarios"
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