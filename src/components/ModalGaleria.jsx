// src/components/ModalGaleria.jsx
import { useState, useEffect } from 'react';
import { useGaleria } from '../context/GaleriaContext';

const ModalGaleria = ({ isOpen, onClose, onSelectImagem, categoria = null }) => {
  const { galeria, loading, categorias, carregarGaleria, uploadImagem, adicionarImagem } = useGaleria();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(categoria || '');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      carregarGaleria(categoriaSelecionada || null);
    }
  }, [isOpen, categoriaSelecionada]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Verificar se é imagem
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Verificar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    setUploading(true);
    try {
      const imagemUploaded = await uploadImagem(file, categoriaSelecionada || 'geral');
      const imagemSalva = await adicionarImagem(imagemUploaded);
      alert('Imagem adicionada com sucesso!');
    } catch (error) {
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content galeria-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Galeria de Imagens</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="galeria-controls">
          <select 
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            className="categoria-select"
          >
            <option value="">Todas as categorias</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <div className="upload-area">
            <label className="upload-btn">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              {uploading ? 'Enviando...' : '+ Adicionar Imagem'}
            </label>
          </div>
        </div>

        {loading ? (
          <div className="loading">Carregando imagens...</div>
        ) : (
          <div className="galeria-grid">
            {galeria.length === 0 ? (
              <div className="empty-gallery">
                <div>🖼️</div>
                <p>Nenhuma imagem encontrada</p>
                <p>Faça upload de uma imagem para começar</p>
              </div>
            ) : (
              galeria.map(imagem => (
                <div
                  key={imagem.id}
                  className="galeria-item"
                  onClick={() => onSelectImagem(imagem.url)}
                >
                  <img src={imagem.url} alt={imagem.nome} />
                  <div className="image-info">
                    <span className="image-name">{imagem.nome}</span>
                    {imagem.categoria && (
                      <span className="image-category">{imagem.categoria}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalGaleria;