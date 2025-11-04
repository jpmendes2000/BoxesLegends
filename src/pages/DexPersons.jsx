import Navbar from '../components/Navbar';

function DexPersons() {
  const personagens = [
    { id: 1, nome: "Dragão de Fogo", raridade: "Lendário", tipo: "Fogo" },
    { id: 2, nome: "Cavaleiro das Sombras", raridade: "Épico", tipo: "Sombra" },
    { id: 3, nome: "Mago do Gelo", raridade: "Raro", tipo: "Gelo" },
    { id: 4, nome: "Guerreiro da Luz", raridade: "Comum", tipo: "Luz" },
  ];

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>📚 Biblioteca de Personagens</h1>
          <p>Descubra todos os personagens disponíveis</p>
        </div>
        
        <div className="personagens-grid">
          {personagens.map((personagem) => (
            <div key={personagem.id} className="personagem-card">
              <div className="personagem-avatar">🎭</div>
              <h3>{personagem.nome}</h3>
              <div className="personagem-info">
                <span className={`raridade ${personagem.raridade.toLowerCase()}`}>
                  {personagem.raridade}
                </span>
                <span className="tipo">Tipo: {personagem.tipo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DexPersons;