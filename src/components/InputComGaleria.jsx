// src/components/InputComGaleria.jsx
import { useState } from 'react';
import ModalGaleria from './ModalGaleria';

const InputComGaleria = ({ 
  value, 
  onChange, 
  placeholder = "Cole a URL da imagem ou selecione da galeria",
  categoria = null,
  className = "" 
}) => {
  const [showGaleria, setShowGaleria] = useState(false);

  const handleSelectImagem = (url) => {
    onChange(url);
    setShowGaleria(false);
  };

  return (
    <div className={`input-with-gallery ${className}`}>
      <div className="input-group">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="image-input"
        />
        <button
          type="button"
          className="gallery-btn"
          onClick={() => setShowGaleria(true)}
        >
          🖼️ Galeria
        </button>
      </div>

      {value && (
        <div className="image-preview">
          <img src={value} alt="Preview" onError={(e) => {
            e.target.style.display = 'none';
          }} />
        </div>
      )}

      <ModalGaleria
        isOpen={showGaleria}
        onClose={() => setShowGaleria(false)}
        onSelectImagem={handleSelectImagem}
        categoria={categoria}
      />
    </div>
  );
};

export default InputComGaleria;