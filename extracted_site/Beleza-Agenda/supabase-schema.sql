-- Schema para o Sistema de Agendamento
-- Execute este SQL no Supabase Dashboard (SQL Editor)

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS appointments (
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

-- Index para busca rápida por data e status
CREATE INDEX IF NOT EXISTS idx_appointments_date_status ON appointments(date, status);

-- Habilitar RLS (Row Level Security)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (caso esteja recriando)
DROP POLICY IF EXISTS "Allow public read" ON appointments;
DROP POLICY IF EXISTS "Allow public insert" ON appointments;
DROP POLICY IF EXISTS "Allow public update" ON appointments;

-- Política para permitir leitura pública
CREATE POLICY "Allow public read" ON appointments FOR SELECT USING (true);

-- Política para permitir inserção pública
CREATE POLICY "Allow public insert" ON appointments FOR INSERT WITH CHECK (true);

-- Política para permitir atualização pública (para o admin)
-- NOTA: Em produção, considere usar uma Edge Function com service_role para maior segurança
CREATE POLICY "Allow public update" ON appointments FOR UPDATE USING (true);
