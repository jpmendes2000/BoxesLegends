// src/components/ModalGaleria.jsx
import { useState, useEffect } from 'react';
import { useGaleria } from '../components/GaleriaContext';

const ModalGaleria = ({ isOpen, onClose, onSelectImagem, categoria = null }) => {
  const { galeria, loading, categorias, carregarGaleria, uploadImagem, adicionarImagem } = useGaleria();
  const [categoriaAtual, setCategoriaAtual] = useState(categoria || 'perfis');
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      carregarGaleria(categoriaAtual);
    }
  }, [isOpen, categoriaAtual, carregarGaleria]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Verificar se é imagem
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    setUploading(true);
    try {
      const imagem = await uploadImagem(file, categoriaAtual);
      const imagemSalva = await adicionarImagem(imagem);
      
      // Seleciona a imagem automaticamente após upload
      setImagemSelecionada(imagemSalva.url);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  const handleSelecionar = () => {
    if (imagemSelecionada) {
      onSelectImagem(imagemSelecionada);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content galeria-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Galeria de Imagens</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="galeria-container">
          <div className="galeria-header">
            <div className="galeria-categorias">
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`categoria-btn ${categoriaAtual === cat ? 'active' : ''}`}
                  onClick={() => setCategoriaAtual(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="upload-area">
            <input
              type="file"
              id="upload-imagem"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
            <label htmlFor="upload-imagem" className="upload-label">
              {uploading ? 'Fazendo upload...' : '+ Adicionar Imagem'}
            </label>
          </div>

          {loading ? (
            <div className="galeria-vazia">Carregando...</div>
          ) : galeria.length > 0 ? (
            <div className="galeria-grid">
              {galeria
                .filter(img => img.categoria === categoriaAtual)
                .map(imagem => (
                  <div
                    key={imagem.id}
                    className={`galeria-item ${imagemSelecionada === imagem.url ? 'selected' : ''}`}
                    onClick={() => setImagemSelecionada(imagem.url)}
                  >
                    <img src={imagem.url} alt={imagem.nome} />
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="galeria-vazia">
              Nenhuma imagem encontrada
              <br />
              <small>Faça upload de uma imagem para começar</small>
            </div>
          )}

          <div className="galeria-actions">
            <button
              className="select-btn"
              onClick={handleSelecionar}
              disabled={!imagemSelecionada}
            >
              Selecionar Imagem
            </button>
            <button className="cancel-btn" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalGaleria;