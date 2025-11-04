import Navbar from '../components/Navbar';

function Boxes() {
  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>🎁 Caixas Épicas</h1>
          <p>Abra caixas e descubra personagens lendários!</p>
        </div>
        
        <div className="boxes-grid">
          <div className="box-item">
            <div className="box-preview">📦</div>
            <h3>Caixa Comum</h3>
            <p>Personagens básicos</p>
            <button className="btn btn-primary">Abrir - 100 moedas</button>
          </div>
          
          <div className="box-item">
            <div className="box-preview">🏺</div>
            <h3>Caixa Rara</h3>
            <p>Personagens raros</p>
            <button className="btn btn-secondary">Abrir - 500 moedas</button>
          </div>
          
          <div className="box-item">
            <div className="box-preview">💎</div>
            <h3>Caixa Lendária</h3>
            <p>Personagens épicos</p>
            <button className="btn btn-primary">Abrir - 1000 moedas</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Boxes;