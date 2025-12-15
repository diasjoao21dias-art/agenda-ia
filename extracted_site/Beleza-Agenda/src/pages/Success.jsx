import { Link, useLocation } from 'react-router-dom'

function Success() {
  const location = useLocation()
  const { service, date, time, name } = location.state || {}

  return (
    <div className="container">
      <div className="card" style={{ marginTop: '40px', textAlign: 'center' }}>
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 style={{ color: '#10b981' }}>Agendamento Realizado!</h1>
        
        <p style={{ marginTop: '16px', marginBottom: '24px' }}>
          Olá <strong>{name || 'Cliente'}</strong>, seu agendamento foi registrado com sucesso!
        </p>

        {service && (
          <div style={{ background: '#f0f7f4', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
            <p style={{ margin: 0, textAlign: 'left', color: '#333' }}>
              <strong>Atendimento:</strong> {service}<br />
              <strong>Data:</strong> {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR')}<br />
              <strong>Horário:</strong> {time}
            </p>
          </div>
        )}

        <div style={{ 
          background: '#e0f2fe', 
          padding: '16px', 
          borderRadius: '10px', 
          marginBottom: '24px',
          border: '1px solid #7dd3fc'
        }}>
          <p style={{ margin: 0, color: '#0369a1', fontSize: '14px' }}>
            <strong>Aguarde a confirmação!</strong><br />
            Entraremos em contato pelo WhatsApp para confirmar sua consulta.
          </p>
        </div>

        <Link to="/">
          <button className="btn btn-primary">
            Voltar ao Início
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Success
