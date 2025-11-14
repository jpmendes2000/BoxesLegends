// pages/Admin/Cadastro_admin.jsx
import { useState } from 'react';
import { criarUsuarioTeste } from '../../supabase';
import Navbar from '../../components/Navbar';
import InputComGaleria from '../../components/InputComGaleria';

export default function CadastroAdmin() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    genero: 'feminino',
    foto_perfil: '',
    descricao_perfil: '',
    kyros: 0
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
      // Usa a função criarUsuarioTeste
      await criarUsuarioTeste(
        {
          ...formData,
          status: 'admin' // Define como admin
        },
        'S3nh@MestreSuperSecreta!' // Chave mestre
      );

      alert('Admin cadastrado com sucesso!');
      
      // Reset form
      setFormData({
        nome: '',
        email: '',
        senha: '',
        genero: 'feminino',
        foto_perfil: '',
        descricao_perfil: '',
        kyros: 0
      });
      
      // Redireciona para login
      window.location.href = '/login';

    } catch (error) {
      console.error('Erro completo:', error);
      alert(`Erro ao cadastrar admin: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Cadastrar Admin</h1>
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
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Senha: </label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>
        
        <div>
          <label>Gênero: </label>
          <select
            name="genero"
            value={formData.genero}
            onChange={handleChange}
          >
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
            <option value="prefiro não informar">Prefiro não informar</option>
          </select>
        </div>
        
      <div className="form-group">
        <label>Foto de Perfil: </label>
        <InputComGaleria
          value={formData.foto_perfil}
          onChange={(url) => setFormData(prev => ({ ...prev, foto_perfil: url }))}
          placeholder="URL da imagem de perfil ou selecione da galeria"
          categoria="perfis"
        />
      </div>
        
        <div>
          <label>Descrição do Perfil: </label>
          <textarea
            name="descricao_perfil"
            value={formData.descricao_perfil}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div>
          <label>Kyros Iniciais: </label>
          <input
            type="number"
            name="kyros"
            value={formData.kyros}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Admin'}
        </button>
      </form>
    </div>
  );
}