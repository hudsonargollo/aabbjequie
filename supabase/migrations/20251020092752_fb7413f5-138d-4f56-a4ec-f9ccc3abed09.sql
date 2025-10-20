-- Criar tabela para armazenar as inscrições
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Dados Pessoais
  full_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  sex TEXT NOT NULL,
  civil_status TEXT NOT NULL,
  cpf TEXT NOT NULL,
  rg TEXT NOT NULL,
  emissor TEXT NOT NULL,
  uf TEXT NOT NULL,
  
  -- Endereço Residencial
  residential_street TEXT NOT NULL,
  residential_number TEXT NOT NULL,
  residential_neighborhood TEXT NOT NULL,
  residential_cep TEXT NOT NULL,
  residential_city TEXT NOT NULL,
  residential_whatsapp TEXT NOT NULL,
  residential_phone TEXT,
  email TEXT NOT NULL,
  
  -- Endereço Comercial
  commercial_street TEXT NOT NULL,
  commercial_number TEXT NOT NULL,
  commercial_neighborhood TEXT NOT NULL,
  commercial_cep TEXT NOT NULL,
  commercial_city TEXT NOT NULL,
  commercial_whatsapp TEXT,
  commercial_phone TEXT,
  
  -- Pagamento
  payment_method TEXT NOT NULL,
  monthly_payment_method TEXT NOT NULL,
  bank_agency TEXT,
  bank_account TEXT,
  bank_dv TEXT,
  card_number TEXT,
  card_validity TEXT,
  card_flag TEXT,
  due_date TEXT NOT NULL,
  
  -- Dependentes (armazenado como JSONB)
  dependents JSONB DEFAULT '[]'::jsonb,
  
  -- Termos
  accept_statute BOOLEAN NOT NULL DEFAULT false,
  accept_image_usage BOOLEAN NOT NULL DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (formulário aberto)
CREATE POLICY "Qualquer um pode inserir inscrições" 
ON public.applications 
FOR INSERT 
WITH CHECK (true);

-- Política para leitura apenas por admins (futuramente pode adicionar auth)
CREATE POLICY "Admins podem ver todas as inscrições" 
ON public.applications 
FOR SELECT 
USING (true);