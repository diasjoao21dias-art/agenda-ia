import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const SERVICES = [
  { id: 1, name: 'Sessão Individual', price: 180, duration: 50 },
  { id: 2, name: 'Terapia de Casal', price: 250, duration: 60 },
  { id: 3, name: 'Orientação Parental', price: 200, duration: 50 },
  { id: 4, name: 'Primeira Consulta', price: 150, duration: 50 },
]

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00', '18:00'
]

function Booking() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [unavailableSlots, setUnavailableSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const dates = []
  for (let i = 1; i < 15; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    if (date.getDay() !== 0) {
      dates.push(date)
    }
  }

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  const getDayName = (date) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    return days[date.getDay()]
  }

  useEffect(() => {
    if (selectedDate) {
      fetchUnavailableSlots()
    }
  }, [selectedDate])

  const fetchUnavailableSlots = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', formatDate(selectedDate))
        .in('status', ['reservado', 'confirmado'])

      if (error) throw error
      setUnavailableSlots(data?.map(a => a.time) || [])
    } catch (error) {
      console.error('Error fetching slots:', error)
      setUnavailableSlots([])
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!name.trim() || !whatsapp.trim()) {
      alert('Por favor, preencha todos os campos')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          service_name: selectedService.name,
          service_price: selectedService.price,
          date: formatDate(selectedDate),
          time: selectedTime,
          client_name: name.trim(),
          client_whatsapp: whatsapp.trim(),
          status: 'reservado'
        })

      if (error) throw error
      
      navigate('/sucesso', { 
        state: { 
          service: selectedService.name,
          date: formatDate(selectedDate),
          time: selectedTime,
          name: name
        }
      })
    } catch (error) {
      console.error('Error booking:', error)
      alert('Erro ao fazer reserva. Tente novamente.')
    }
    setSubmitting(false)
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">
        ← Voltar
      </Link>

      {step === 1 && (
        <div className="card">
          <h2>Escolha o Atendimento</h2>
          <div className="service-list">
            {SERVICES.map(service => (
              <div 
                key={service.id}
                className={`service-item ${selectedService?.id === service.id ? 'selected' : ''}`}
                onClick={() => setSelectedService(service)}
              >
                <h3>{service.name}</h3>
                <span>R$ {service.price},00 • {service.duration} min</span>
              </div>
            ))}
          </div>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '20px' }}
            disabled={!selectedService}
            onClick={() => setStep(2)}
          >
            Continuar
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h2>Escolha a Data</h2>
          <div className="date-picker">
            {dates.map(date => (
              <button
                key={formatDate(date)}
                className={`date-btn ${selectedDate && formatDate(selectedDate) === formatDate(date) ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedDate(date)
                  setSelectedTime(null)
                }}
              >
                <div className="day">{getDayName(date)}</div>
                <div className="num">{date.getDate()}</div>
              </button>
            ))}
          </div>

          {selectedDate && (
            <>
              <h2 style={{ marginTop: '20px' }}>Escolha o Horário</h2>
              {loading ? (
                <div className="loading">Carregando horários...</div>
              ) : (
                <div className="time-slots">
                  {TIME_SLOTS.map(time => {
                    const isUnavailable = unavailableSlots.includes(time)
                    return (
                      <div
                        key={time}
                        className={`time-slot ${selectedTime === time ? 'selected' : ''} ${isUnavailable ? 'unavailable' : ''}`}
                        onClick={() => !isUnavailable && setSelectedTime(time)}
                      >
                        {time}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              Voltar
            </button>
            <button 
              className="btn btn-primary" 
              disabled={!selectedTime}
              onClick={() => setStep(3)}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <h2>Seus Dados</h2>
          
          <div style={{ background: '#f0f7f4', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
            <p style={{ margin: 0, textAlign: 'left', color: '#333' }}>
              <strong>{selectedService.name}</strong><br />
              {selectedDate.toLocaleDateString('pt-BR')} às {selectedTime}
            </p>
          </div>

          <div className="input-group">
            <label>Nome</label>
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>WhatsApp</label>
            <input
              type="tel"
              placeholder="(11) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
            Seus dados são tratados com total sigilo e privacidade.
          </p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>
              Voltar
            </button>
            <button 
              className="btn btn-primary"
              disabled={submitting || !name.trim() || !whatsapp.trim()}
              onClick={handleSubmit}
            >
              {submitting ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Booking
