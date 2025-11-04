// pages/Admin/View.jsx
import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function ViewLocaisPersonagens() {
  const [locais, setLocais] = useState([]);
  const [personagens, setPersonagens] = useState([]);
  const [allLocais, setAllLocais] = useState([]);
  const [allPersonagens, setAllPersonagens] = useState([]);
  const [currentLocalId, setCurrentLocalId] = useState(null);
  const [editingPersonagem, setEditingPersonagem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchLocais, setSearchLocais] = useState('');
  const [searchPersonagens, setSearchPersonagens] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterAtividade, setFilterAtividade] = useState('');
  const [loading, setLoading] = useState(false);

  // Carrega todos os locais
  useEffect(() => {
    carregarLocais();
  }, []);

  async function carregarLocais() {
    setLoading(true);
    try {
      const { data: locaisData, error } = await supabase.from('locais').select('*');
      if (error) {
        mostrarErro('Erro ao carregar locais: ' + error.message);
        return;
      }
      setAllLocais(locaisData || []);
      setLocais(locaisData || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }

  // Carrega personagens de um local específico
  async function carregarPersonagens(local_id) {
    setCurrentLocalId(local_id);
    setLoading(true);
    try {
      const { data: personagensData, error } = await supabase
        .from('personagens')
        .select('*')
        .eq('local_id', local_id);

      if (error) {
        mostrarErro('Erro ao carregar personagens: ' + error.message);
        return;
      }

      setAllPersonagens(personagensData || []);
      setPersonagens(personagensData || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filtra locais
  useEffect(() => {
    if (!allLocais.length) return;

    const termo = searchLocais.toLowerCase();
    const locaisFiltrados = allLocais.filter(local => {
      const matchNome = local.nome.toLowerCase().includes(termo);
      const matchTipo = !filterTipo || local.tipo === filterTipo;
      return matchNome && matchTipo;
    });
    
    setLocais(locaisFiltrados);
  }, [searchLocais, filterTipo, allLocais]);

  // Filtra personagens
  useEffect(() => {
    if (!allPersonagens.length) return;

    const termo = searchPersonagens.toLowerCase();
    const personagensFiltrados = allPersonagens.filter(p => {
      const matchNome = p.nome.toLowerCase().includes(termo);
      const matchAtividade = !filterAtividade || p.atividade.toString() === filterAtividade;
      return matchNome && matchAtividade;
    });
    
    setPersonagens(personagensFiltrados);
  }, [searchPersonagens, filterAtividade, allPersonagens]);

  // Abrir modal para editar personagem
  function abrirModal(personagem) {
    setEditingPersonagem(personagem);
    setShowModal(true);
  }

  // Fechar modal
  function fecharModal() {
    setShowModal(false);
    setEditingPersonagem(null);
  }

  // Salvar alterações do personagem
  async function salvarPersonagem(e) {
    e.preventDefault();
    if (!editingPersonagem) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.from('personagens')
        .update({
          nome: editingPersonagem.nome,
          foto: editingPersonagem.foto,
          descricao: editingPersonagem.descricao,
          valor_kyros: parseFloat(editingPersonagem.valor_kyros),
          pity: parseFloat(editingPersonagem.pity),
          atividade: parseInt(editingPersonagem.atividade)
        })
        .eq('id', editingPersonagem.id);

      if (error) {
        mostrarErro('Erro ao atualizar personagem: ' + error.message);
        return;
      }
      
      mostrarSucesso('Personagem atualizado com sucesso!');
      fecharModal();
      
      // Recarrega os personagens do mesmo local
      if (currentLocalId) {
        carregarPersonagens(currentLocalId);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }

  // Funções de feedback
  function mostrarSucesso(mensagem) {
    alert(mensagem);
  }

  function mostrarErro(mensagem) {
    alert('Erro: ' + mensagem);
  }

  // Atualizar campo do personagem em edição
  function atualizarCampoPersonagem(campo, valor) {
    setEditingPersonagem(prev => ({
      ...prev,
      [campo]: valor
    }));
  }

  return (
    <div>
      <div className="decoration decoration-1"></div>
      <div className="decoration decoration-2"></div>
      
      <div className="container">
        <header>
          <a href="/admin/cadastro" className="nav-link">← Voltar para Cadastro</a>
          <h1>Locais e Personagens</h1>
          <p>Visualize e gerencie todos os locais e personagens cadastrados</p>
        </header>

        <section>
          <h2>Locais</h2>
          <div className="filters">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                id="searchLocais" 
                placeholder="Pesquisar locais..."
                value={searchLocais}
                onChange={(e) => setSearchLocais(e.target.value)}
              />
            </div>
            <select 
              className="filter-select" 
              id="filterTipo"
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
            >
              <option value="">Todos os tipos</option>
              <option value="Desenho">Desenho</option>
              <option value="Anime">Anime</option>
              <option value="Filme">Filme</option>
              <option value="Série">Série</option>
              <option value="Jogo">Jogo</option>
            </select>
          </div>
          <div className="locais-container">
            {loading ? (
              <div className="loading">Carregando...</div>
            ) : locais.length === 0 ? (
              <div className="empty-state" style={{gridColumn: '1 / -1'}}>
                <div>🏞️</div>
                <h3>Nenhum local encontrado</h3>
                <p>Tente ajustar os filtros de pesquisa</p>
              </div>
            ) : (
              locais.map(local => (
                <div 
                  key={local.id} 
                  className="local-card"
                  onClick={() => carregarPersonagens(local.id)}
                >
                  <img 
                    src={local.foto || 'https://via.placeholder.com/300x180?text=Sem+Imagem'} 
                    alt={local.nome} 
                    className="local-image" 
                  />
                  <div className="local-info">
                    <h3 className="local-name">{local.nome}</h3>
                    <span className="local-type">{local.tipo}</span>
                    <p className="local-description">
                      {local.descricao || 'Sem descrição disponível.'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2>Personagens</h2>
          <div className="filters">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                id="searchPersonagens" 
                placeholder="Pesquisar personagens..."
                value={searchPersonagens}
                onChange={(e) => setSearchPersonagens(e.target.value)}
              />
            </div>
            <select 
              className="filter-select" 
              id="filterAtividade"
              value={filterAtividade}
              onChange={(e) => setFilterAtividade(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="1">Ativos</option>
              <option value="0">Inativos</option>
            </select>
          </div>
          <div className="personagens-container">
            {loading ? (
              <div className="loading">Carregando...</div>
            ) : !currentLocalId ? (
              <div className="empty-state">
                <div>👆</div>
                <h3>Selecione um local para ver seus personagens</h3>
                <p>Clique em um dos locais acima para carregar os personagens associados</p>
              </div>
            ) : personagens.length === 0 ? (
              <div className="empty-state">
                <div>👤</div>
                <h3>Nenhum personagem cadastrado</h3>
                <p>Este local não possui personagens associados</p>
              </div>
            ) : (
              personagens.map(p => (
                <div key={p.id} className="personagem-card">
                  <div className="personagem-header">
                    <img 
                      src={p.foto || 'https://via.placeholder.com/100?text=Sem+Imagem'} 
                      alt={p.nome} 
                      className="personagem-image" 
                    />
                    <div className="personagem-basic-info">
                      <h3 className="personagem-name">{p.nome}</h3>
                      <span className={`personagem-status ${p.atividade == 1 ? 'status-active' : 'status-inactive'}`}>
                        {p.atividade == 1 ? 'Ativo' : 'Inativo'}
                      </span>
                      <div className="personagem-stats">
                        <div className="stat">
                          <div className="stat-value">{p.valor_kyros}</div>
                          <div className="stat-label">Kyros</div>
                        </div>
                        <div className="stat">
                          <div className="stat-value">{p.pity}</div>
                          <div className="stat-label">Pity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="personagem-body">
                    <p className="personagem-description">
                      {p.descricao || 'Sem descrição disponível.'}
                    </p>
                  </div>
                  <div className="personagem-footer">
                    <button 
                      className="btn btn-edit" 
                      onClick={() => abrirModal(p)}
                    >
                      <span className="icon">✏️</span> Editar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Modal para editar personagem */}
      {showModal && editingPersonagem && (
        <div className="modal" style={{display: 'block'}}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Editar Personagem</h3>
              <span className="close" onClick={fecharModal}>&times;</span>
            </div>
            <form onSubmit={salvarPersonagem}>
              <input type="hidden" value={editingPersonagem.id} />
              
              <div className="form-group">
                <label htmlFor="editNome" className="form-label">Nome:</label>
                <input 
                  type="text" 
                  id="editNome" 
                  className="form-control" 
                  value={editingPersonagem.nome}
                  onChange={(e) => atualizarCampoPersonagem('nome', e.target.value)}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editFoto" className="form-label">Foto URL:</label>
                <input 
                  type="text" 
                  id="editFoto" 
                  className="form-control" 
                  value={editingPersonagem.foto || ''}
                  onChange={(e) => atualizarCampoPersonagem('foto', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editDescricao" className="form-label">Descrição:</label>
                <textarea 
                  id="editDescricao" 
                  className="form-control" 
                  rows="3"
                  value={editingPersonagem.descricao || ''}
                  onChange={(e) => atualizarCampoPersonagem('descricao', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editValor" className="form-label">Valor Kyros:</label>
                <input 
                  type="number" 
                  step="0.01" 
                  id="editValor" 
                  className="form-control" 
                  value={editingPersonagem.valor_kyros}
                  onChange={(e) => atualizarCampoPersonagem('valor_kyros', e.target.value)}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editPity" className="form-label">Pity (0 a 1):</label>
                <input 
                  type="number" 
                  step="0.000000001" 
                  min="0" 
                  max="1" 
                  id="editPity" 
                  className="form-control" 
                  value={editingPersonagem.pity}
                  onChange={(e) => atualizarCampoPersonagem('pity', e.target.value)}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editAtividade" className="form-label">Atividade:</label>
                <select 
                  id="editAtividade" 
                  className="form-control"
                  value={editingPersonagem.atividade}
                  onChange={(e) => atualizarCampoPersonagem('atividade', e.target.value)}
                >
                  <option value="0">Não ativo</option>
                  <option value="1">Ativo</option>
                </select>
              </div>
              
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}