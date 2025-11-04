// src/context/GaleriaContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const GaleriaContext = createContext();

export const useGaleria = () => {
  const context = useContext(GaleriaContext);
  if (!context) {
    throw new Error('useGaleria deve ser usado dentro de um GaleriaProvider');
  }
  return context;
};

export const GaleriaProvider = ({ children }) => {
  const [galeria, setGaleria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([
    'personagens',
    'locais',
    'perfis',
    'backgrounds',
    'icones'
  ]);

  // Carregar imagens da galeria
  const carregarGaleria = async (categoria = null) => {
    setLoading(true);
    try {
      let query = supabase
        .from('galeria_imagens')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoria) {
        query = query.eq('categoria', categoria);
      }

      const { data, error } = await query;

      if (error) throw error;
      setGaleria(data || []);
    } catch (error) {
      console.error('Erro ao carregar galeria:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar imagem à galeria
  const adicionarImagem = async (imagem) => {
    try {
      const { data, error } = await supabase
        .from('galeria_imagens')
        .insert([imagem])
        .select();

      if (error) throw error;
      
      setGaleria(prev => [data[0], ...prev]);
      return data[0];
    } catch (error) {
      console.error('Erro ao adicionar imagem:', error);
      throw error;
    }
  };

  // Upload de imagem (simulado - em produção, use Supabase Storage)
  const uploadImagem = async (file, categoria = 'geral') => {
    // Simulando upload - em produção, substitua por Supabase Storage
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imagem = {
          id: Date.now(),
          url: e.target.result,
          nome: file.name,
          categoria,
          tipo: file.type,
          tamanho: file.size,
          created_at: new Date().toISOString()
        };
        resolve(imagem);
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    carregarGaleria();
  }, []);

  const value = {
    galeria,
    loading,
    categorias,
    carregarGaleria,
    adicionarImagem,
    uploadImagem
  };

  return (
    <GaleriaContext.Provider value={value}>
      {children}
    </GaleriaContext.Provider>
  );
};