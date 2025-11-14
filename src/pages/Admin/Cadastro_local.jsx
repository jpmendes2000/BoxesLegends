// pages/Admin/Cadastro_local.jsx
import { useState } from 'react';
import { supabase } from '../../supabase';
import Navbar from '../../components/Navbar';
import InputComGaleria from '../../components/InputComGaleria';

export default function CadastroLocal() {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Desenho',
    descricao: '',
    foto: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('locais')
        .insert([{
          nome: formData.nome,
          tipo: formData.tipo,
          descricao: formData.descricao || null,
          foto: formData.foto || null
        }])
        .select();

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }

      alert('Local cadastrado com sucesso!');
      
      // Reset form
      setFormData({
        nome: '',
        tipo: 'Desenho',
        descricao: '',
        foto: ''
      });

    } catch (error) {
      console.error('Erro completo:', error);
      alert(`Erro ao cadastrar local: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Cadastrar Local (Desenho, Filme, Série, Jogo)</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome: </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Tipo: </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="Desenho">Desenho</option>
            <option value="Anime">Anime</option>
            <option value="Filme">Filme</option>
            <option value="Série">Série</option>
            <option value="Jogo">Jogo</option>
          </select>
        </div>
        
        <div>
          <label>Descrição: </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label>Foto (URL): </label> 
          <InputComGaleria
            value={formData.foto}
            onChange={(url) => setFormData(prev => ({ ...prev, foto: url }))}
            placeholder="URL da imagem ou selecione da galeria"
            categoria="locais"
          />
        </div>

        
        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Local'}
        </button>
      </form>
    </div>
  );
}