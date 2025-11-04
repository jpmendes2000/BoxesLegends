import BannerRotativo from '../components/BannerRotativo';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <>
      <Navbar />
      <div className="home-content">
        <BannerRotativo />
        
        {/* Seção de conteúdo da home */}
        <main className="home-main-content"> 
          <section className="welcome-section">
            <h1 id="Título">🎮 Bem-vindo ao Boxes Legends</h1>
            <p className="apresentation">
               Enfrente desafios emocionantes, conquiste recompensas raras e prove sua habilidade em batalhas intensas contra jogadores do mundo inteiro. 
               Explore modos exclusivos, desbloqueie segredos escondidos e construa sua reputação como um verdadeiro mestre da arena. 
               Cada vitória traz novas oportunidades, cada derrota ensina estratégias poderosas, e a jornada nunca para. 
               Prepare-se para evoluir, colecionar itens incríveis e deixar sua marca no topo das classificações épicas que todos desejam alcançar!
            </p>
          </section>
        </main>
      </div>

      {/* Rodapé */}
      <footer className="footer">
        <p id="direitos-footer">© {new Date().getFullYear()} Boxes Legends - Todos os direitos reservados</p>
      </footer>

    </>
  );
}

export default Home;
