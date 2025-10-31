import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log('Generating test application data...');

    const testData = {
      fullName: "Maria Silva Santos",
      birthDate: "1985-05-15",
      sex: "F",
      civilStatus: "Casada",
      cpf: "123.456.789-00",
      rg: "1234567",
      email: "maria.silva@email.com",
      residentialStreet: "Rua das Flores",
      residentialNumber: "123",
      residentialNeighborhood: "Centro",
      residentialCep: "45200-000",
      residentialCity: "Jequié",
      residentialWhatsapp: "(73) 98765-4321",
      commercialStreet: "Avenida Brasil",
      commercialNumber: "456",
      commercialNeighborhood: "Jequiezinho",
      commercialCep: "45206-000",
      commercialCity: "Jequié",
      commercialWhatsapp: "(73) 98888-7777",
      paymentMethod: "PIX",
      monthlyPaymentMethod: "Débito em Conta",
      dueDate: "10",
      dependents: [
        {
          name: "João Silva Santos",
          birthDate: "2010-03-20",
          sex: "M",
          kinship: "Filho",
          email: "joao.silva@email.com",
          isUniversity: false,
          cpf: "987.654.321-00",
          rg: "7654321",
          emissor: "SSP",
          uf: "BA"
        }
      ],
      acceptStatute: true,
      acceptImageUsage: true
    };

    console.log('Calling submit-application function...');

    const { data, error } = await supabaseClient.functions.invoke('submit-application', {
      body: testData
    });

    if (error) {
      console.error('Error from submit-application:', error);
      return new Response(
        JSON.stringify({ error: error.message, details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Test application submitted successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test application submitted successfully',
        result: data 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
