import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schemas
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
const cepRegex = /^\d{5}-?\d{3}$/;

const dependentSchema = z.object({
  name: z.string().trim().min(3).max(200),
  cpf: z.string().regex(cpfRegex),
  rg: z.string().trim().min(5).max(20),
  emissor: z.string().trim().min(2).max(20),
  uf: z.string().length(2),
  birthDate: z.string(),
  sex: z.enum(['M', 'F']),
  kinship: z.string().min(1),
  email: z.string().email().max(255),
  isUniversity: z.boolean(),
});

const applicationSchema = z.object({
  fullName: z.string().trim().min(3).max(200),
  birthDate: z.string(),
  sex: z.enum(['M', 'F']),
  civilStatus: z.string().min(1),
  cpf: z.string().regex(cpfRegex),
  rg: z.string().trim().min(5).max(20),
  emissor: z.string().trim().min(2).max(20),
  uf: z.string().length(2),
  residentialStreet: z.string().trim().min(3).max(200),
  residentialNumber: z.string().trim().min(1).max(10),
  residentialNeighborhood: z.string().trim().min(2).max(100),
  residentialCep: z.string().regex(cepRegex),
  residentialCity: z.string().trim().min(2).max(100),
  residentialWhatsapp: z.string().regex(phoneRegex),
  residentialPhone: z.string().regex(phoneRegex).optional(),
  email: z.string().email().max(255),
  commercialStreet: z.string().trim().min(3).max(200),
  commercialNumber: z.string().trim().min(1).max(10),
  commercialNeighborhood: z.string().trim().min(2).max(100),
  commercialCep: z.string().regex(cepRegex),
  commercialCity: z.string().trim().min(2).max(100),
  commercialWhatsapp: z.string().regex(phoneRegex).optional(),
  commercialPhone: z.string().regex(phoneRegex).optional(),
  paymentMethod: z.string().min(1),
  monthlyPaymentMethod: z.string().min(1),
  dueDate: z.string().min(1),
  paymentToken: z.string().optional(),
  paymentProcessor: z.string().optional(),
  lastFourDigits: z.string().max(4).optional(),
  dependents: z.array(dependentSchema),
  hasCriminalRecord: z.boolean().refine(val => val === false, {
    message: 'Applications from individuals with criminal records are not accepted'
  }),
  acceptStatute: z.boolean().refine(val => val === true),
  acceptImageUsage: z.boolean().refine(val => val === true),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Parse and validate request body
    const body = await req.json();
    const validatedData = applicationSchema.parse(body);

    // Explicit server-side enforcement for criminal record check
    if (validatedData.hasCriminalRecord === true) {
      console.log('Application rejected: criminal record detected');
      return new Response(
        JSON.stringify({ 
          error: 'Applications from individuals with criminal records cannot be processed',
          code: 'CRIMINAL_RECORD_REJECTION'
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing anonymous application submission');

    // Insert into database (no user_id for anonymous submissions)
    const { data, error: dbError } = await supabaseClient
      .from('applications')
      .insert({
        full_name: validatedData.fullName,
        birth_date: validatedData.birthDate,
        sex: validatedData.sex,
        civil_status: validatedData.civilStatus,
        cpf: validatedData.cpf,
        rg: validatedData.rg,
        emissor: validatedData.emissor,
        uf: validatedData.uf,
        residential_street: validatedData.residentialStreet,
        residential_number: validatedData.residentialNumber,
        residential_neighborhood: validatedData.residentialNeighborhood,
        residential_cep: validatedData.residentialCep,
        residential_city: validatedData.residentialCity,
        residential_whatsapp: validatedData.residentialWhatsapp,
        residential_phone: validatedData.residentialPhone || null,
        email: validatedData.email,
        commercial_street: validatedData.commercialStreet,
        commercial_number: validatedData.commercialNumber,
        commercial_neighborhood: validatedData.commercialNeighborhood,
        commercial_cep: validatedData.commercialCep,
        commercial_city: validatedData.commercialCity,
        commercial_whatsapp: validatedData.commercialWhatsapp || null,
        commercial_phone: validatedData.commercialPhone || null,
        payment_method: validatedData.paymentMethod,
        monthly_payment_method: validatedData.monthlyPaymentMethod,
        due_date: validatedData.dueDate,
        payment_token: validatedData.paymentToken || null,
        payment_processor: validatedData.paymentProcessor || null,
        last_four_digits: validatedData.lastFourDigits || null,
        dependents: validatedData.dependents,
        has_criminal_record: validatedData.hasCriminalRecord,
        accept_statute: validatedData.acceptStatute,
        accept_image_usage: validatedData.acceptImageUsage,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar inscrição' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Application ${data.id} created successfully`);

    // TODO: Send email via Resend
    // TODO: Send WhatsApp via Evolution API

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Inscrição enviada com sucesso!',
        applicationId: data.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Dados inválidos', 
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
