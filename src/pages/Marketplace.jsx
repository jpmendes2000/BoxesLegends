import { useState } from 'react';
import Navbar from '../components/Navbar';

function Marketplace() {
  const [filtro, setFiltro] = useState('todos');
  
  const itensMarketplace = [
    {
      id: 1,
      nome: "Dragão de Fogo",
      tipo: "personagem",
      raridade: "lendário",
      preco: 5000,
      vendedor: "DragonMaster",
      imagem: "🐲"
    },
    {
      id: 2,
      nome: "Espada Flamejante",
      tipo: "item",
      raridade: "épico",
      preco: 2500,
      vendedor: "SwordCollector",
      imagem: "⚔️"
    },
    {
      id: 3,
      nome: "Armadura de Cristal",
      tipo: "item",
      raridade: "raro",
      preco: 1800,
      vendedor: "CrystalWarrior",
      imagem: "🛡️"
    },
    {
      id: 4,
      nome: "Fênix Dourada",
      tipo: "personagem",
      raridade: "lendário",
      preco: 7500,
      vendedor: "Phoenix_King",
      imagem: "🔥"
    },
    {
      id: 5,
      nome: "Poção de Força",
      tipo: "consumivel",
      raridade: "comum",
      preco: 150,
      vendedor: "AlchemyMaster",
      imagem: "🧪"
    },
    {
      id: 6,
      nome: "Cavaleiro das Sombras",
      tipo: "personagem",
      raridade: "épico",
      preco: 3200,
      vendedor: "ShadowLord",
      imagem: "🛡️"
    }
  ];

  const itensFiltrados = filtro === 'todos' 
    ? itensMarketplace 
    : itensMarketplace.filter(item => item.tipo === filtro);

  const handleComprar = (item) => {
    alert(`Você comprou ${item.nome} por ${item.preco} moedas!`);
  };

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>🛒 Marketplace</h1>
          <p>Compre e venda itens únicos com outros jogadores</p>
        </div>
        
        {/* Filtros */}
        <div className="marketplace-filters">
          <button 
            className={filtro === 'todos' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFiltro('todos')}
          >
            Todos
          </button>
          <button 
            className={filtro === 'personagem' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFiltro('personagem')}
          >
            Personagens
          </button>
          <button 
            className={filtro === 'item' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFiltro('item')}
          >
            Itens
          </button>
          <button 
            className={filtro === 'consumivel' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFiltro('consumivel')}
          >
            Consumíveis
          </button>
        </div>

        {/* Grid de Itens */}
        <div className="marketplace-grid">
          {itensFiltrados.map((item) => (
            <div key={item.id} className="marketplace-card">
              <div className="item-image">{item.imagem}</div>
              <div className="item-info">
                <h3>{item.nome}</h3>
                <span className={`raridade ${item.raridade}`}>{item.raridade}</span>
                <div className="item-details">
                  <p className="vendedor">Por: {item.vendedor}</p>
                  <p className="preco">{item.preco} 🪙</p>
                </div>
                <button 
                  className="btn btn-primary btn-full"
                  onClick={() => handleComprar(item)}
                >
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Marketplace;