import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../supabase'

const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || 'admin123'

function Admin() {
  const [searchParams] = useSearchParams()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('reservado')
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token')
    if (token === ADMIN_TOKEN) {
      setAuthorized(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (authorized) {
      fetchAppointments()
    }
  }, [filter, authorized])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (filter !== 'todos') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
    setLoading(false)
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      fetchAppointments()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Erro ao atualizar status')
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR')
  }

  if (!authorized) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: '40px', textAlign: 'center' }}>
          <h1 style={{ color: '#ef4444' }}>Acesso Restrito</h1>
          <p>Você precisa de um link autorizado para acessar esta página.</p>
          <Link to="/">
            <button className="btn btn-primary" style={{ marginTop: '20px' }}>
              Voltar ao Início
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">
        ← Voltar
      </Link>

      <div className="card">
        <h1>Painel da Psicóloga</h1>
        <p>Gerencie seus agendamentos</p>

        <div className="tabs">
          <button 
            className={`tab ${filter === 'reservado' ? 'active' : ''}`}
            onClick={() => setFilter('reservado')}
          >
            Pendentes
          </button>
          <button 
            className={`tab ${filter === 'confirmado' ? 'active' : ''}`}
            onClick={() => setFilter('confirmado')}
          >
            Confirmados
          </button>
          <button 
            className={`tab ${filter === 'todos' ? 'active' : ''}`}
            onClick={() => setFilter('todos')}
          >
            Todos
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            Nenhum agendamento encontrado
          </div>
        ) : (
          <div className="admin-list">
            {appointments.map(apt => (
              <div key={apt.id} className="admin-item">
                <div className="header">
                  <span className="name">{apt.client_name}</span>
                  <span className={`status-badge ${apt.status}`}>
                    {apt.status}
                  </span>
                </div>
                <div className="whatsapp">
                  <a href={`https://wa.me/55${apt.client_whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                    {apt.client_whatsapp}
                  </a>
                </div>
                <div className="details">
                  {apt.service_name} • {formatDate(apt.date)} às {apt.time}
                </div>
                
                {apt.status === 'reservado' && (
                  <div className="admin-actions">
                    <button 
                      className="btn-confirm"
                      onClick={() => updateStatus(apt.id, 'confirmado')}
                    >
                      Confirmar
                    </button>
                    <button 
                      className="btn-cancel"
                      onClick={() => updateStatus(apt.id, 'livre')}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
                
                {apt.status === 'confirmado' && (
                  <div className="admin-actions">
                    <button 
                      className="btn-cancel"
                      onClick={() => updateStatus(apt.id, 'livre')}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
