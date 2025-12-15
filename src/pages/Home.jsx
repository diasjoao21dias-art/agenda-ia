import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="container">
      <div className="card" style={{ marginTop: '40px' }}>
        <h1>Psicologia & Bem-Estar</h1>
        <p>Agende sua consulta de forma rápida e discreta</p>
        
        <div style={{ marginTop: '24px' }}>
          <Link to="/agendar">
            <button className="btn btn-primary">
              Agendar Consulta
            </button>
          </Link>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Sem necessidade de login ou cadastro
          </p>
        </div>
      </div>

      <div className="card">
        <h2>Atendimentos</h2>
        <div className="service-list">
          <div className="service-item">
            <h3>Sessão Individual</h3>
            <span>R$ 180,00 • 50 min</span>
          </div>
          <div className="service-item">
            <h3>Terapia de Casal</h3>
            <span>R$ 250,00 • 60 min</span>
          </div>
          <div className="service-item">
            <h3>Orientação Parental</h3>
            <span>R$ 200,00 • 50 min</span>
          </div>
          <div className="service-item">
            <h3>Primeira Consulta</h3>
            <span>R$ 150,00 • 50 min</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
