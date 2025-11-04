import Navbar from '../components/Navbar';

function Ranking() {
  const rankingData = [
    { posicao: 1, nome: "DragonSlayer", pontos: 15420 },
    { posicao: 2, nome: "ShadowMaster", pontos: 14890 },
    { posicao: 3, nome: "FireWizard", pontos: 13250 },
    { posicao: 4, nome: "IceQueen", pontos: 12100 },
    { posicao: 5, nome: "ThunderBolt", pontos: 11500 },
  ];

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>🏆 Ranking Global</h1>
          <p>Os melhores jogadores de Boxes Legends</p>
        </div>
        
        <div className="ranking-table">
          {rankingData.map((player) => (
            <div key={player.posicao} className="ranking-item">
              <div className="ranking-position">
                <span className="position-number">#{player.posicao}</span>
                {player.posicao <= 3 && (
                  <span className="medal">
                    {player.posicao === 1 ? '🥇' : player.posicao === 2 ? '🥈' : '🥉'}
                  </span>
                )}
              </div>
              <div className="player-info">
                <span className="player-name">{player.nome}</span>
                <span className="player-points">{player.pontos.toLocaleString()} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Ranking;
