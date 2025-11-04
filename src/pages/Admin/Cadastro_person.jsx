// pages/Admin/Cadastro_person.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import InputComGaleria from '../../components/InputComGaleria';

export default function CadastroPersonagem() {
  const [formData, setFormData] = useState({
    nome: '',
    local_id: '',
    descricao: '',
    foto: '',
    valor_kyros: 0,
    pity: 0.5,
    atividade: 0
  });
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar locais existentes
  useEffect(() => {
    carregarLocais();
  }, []);

  async function carregarLocais() {
    const { data: locaisData, error } = await supabase
      .from('locais')
      .select('id, nome, tipo')
      .order('nome');
    
    if (error) {
      console.error('Erro ao carregar locais:', error);
      alert('Erro ao carregar locais: ' + error.message);
      return;
    }
    setLocais(locaisData || []);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valor_kyros' || name === 'pity' || name === 'atividade' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar dados
      if (!formData.nome || !formData.local_id) {
        throw new Error('Nome e Local são obrigatórios');
      }

      if (formData.pity < 0 || formData.pity > 1) {
        throw new Error('Pity deve estar entre 0 e 1');
      }

      const { data, error } = await supabase
        .from('personagens')
        .insert([{
          nome: formData.nome,
          local_id: parseInt(formData.local_id),
          descricao: formData.descricao || null,
          foto: formData.foto || null,
          valor_kyros: parseFloat(formData.valor_kyros) || 0,
          pity: parseFloat(formData.pity) || 0.5,
          atividade: parseInt(formData.atividade) || 0
        }])
        .select();

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }

      alert('Personagem cadastrado com sucesso!');
      
      // Reset form
      setFormData({
        nome: '',
        local_id: '',
        descricao: '',
        foto: '',
        valor_kyros: 0,
        pity: 0.5,
        atividade: 0
      });

    } catch (error) {
      console.error('Erro completo:', error);
      alert(`Erro ao cadastrar personagem: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Cadastrar Personagem</h1>
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
          <label>Local: </label>
          <select
            name="local_id"
            value={formData.local_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um local</option>
            {locais.map((local) => (
              <option key={local.id} value={local.id}>
                {local.nome} ({local.tipo})
              </option>
            ))}
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
        <label>Foto: </label>
        <InputComGaleria
          value={formData.foto}
          onChange={(url) => setFormData(prev => ({ ...prev, foto: url }))}
          placeholder="URL da imagem ou selecione da galeria"
          categoria="personagens"
        />
      </div>
        
        <div>
          <label>Valor em Kyros: </label>
          <input
            type="number"
            name="valor_kyros"
            value={formData.valor_kyros}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <label>Pity (0-1): </label>
          <input
            type="number"
            name="pity"
            value={formData.pity}
            onChange={handleChange}
            min="0"
            max="1"
            step="0.000000001"
          />
          <span> Valor: {formData.pity}</span>
        </div>
        
        <div>
          <label>Atividade: </label>
          <input
            type="number"
            name="atividade"
            value={formData.atividade}
            onChange={handleChange}
            min="0"
            max="32767"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Personagem'}
        </button>
      </form>
    </div>
  );
}