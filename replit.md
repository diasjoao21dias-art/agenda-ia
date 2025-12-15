# Sistema de Agendamento - Psicóloga

## Overview
Aplicação web simples de agendamento para consultório de psicologia. Permite que pacientes visualizem horários disponíveis, escolham tipo de atendimento e agendem consultas sem necessidade de login.

## Stack
- **Frontend**: React + Vite
- **Backend/Database**: Supabase
- **Estilização**: CSS puro (mobile-first)

## Estrutura do Projeto
```
/src
  /pages
    Home.jsx       - Página inicial com lista de atendimentos
    Booking.jsx    - Fluxo de agendamento (3 etapas)
    Success.jsx    - Confirmação de agendamento
    Admin.jsx      - Painel da psicóloga
  App.jsx          - Rotas da aplicação
  main.jsx         - Entry point
  index.css        - Estilos globais
  supabase.js      - Cliente Supabase
```

## Rotas
- `/` - Página inicial
- `/agendar` - Fluxo de agendamento
- `/sucesso` - Confirmação de agendamento
- `/admin` - Painel da psicóloga (link para uso interno)

## Status dos Agendamentos
- **livre** - Horário disponível
- **reservado** - Paciente agendou, aguardando confirmação
- **confirmado** - Consulta confirmada pela psicóloga

## Tipos de Atendimento
- Sessão Individual - R$ 180,00 (50 min)
- Terapia de Casal - R$ 250,00 (60 min)
- Orientação Parental - R$ 200,00 (50 min)
- Primeira Consulta - R$ 150,00 (50 min)

## Configuração do Supabase

### 1. Criar tabela no Supabase
Execute o seguinte SQL no Supabase Dashboard:

```sql
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  service_price DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_whatsapp TEXT NOT NULL,
  status TEXT DEFAULT 'reservado' CHECK (status IN ('livre', 'reservado', 'confirmado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_date_status ON appointments(date, status);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON appointments FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON appointments FOR UPDATE USING (true);
```

### 2. Variáveis de Ambiente
- `VITE_SUPABASE_URL` - URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave anon/pública do Supabase
- `VITE_ADMIN_TOKEN` - Token secreto para acesso ao painel (padrão: admin123)

## Acesso ao Painel Admin
- Acesse: `/admin?token=admin123`
- Altere o token padrão para maior segurança

## Fluxo do Paciente
1. Visualiza tipos de atendimento na página inicial
2. Clica em "Agendar Consulta"
3. Escolhe atendimento → Escolhe data e horário → Informa nome e WhatsApp
4. Recebe confirmação e aguarda contato

## Fluxo da Psicóloga
1. Acessa `/admin?token=SEU_TOKEN`
2. Visualiza agendamentos pendentes
3. Confirma ou cancela consultas
4. Clica no WhatsApp para contato direto com paciente
