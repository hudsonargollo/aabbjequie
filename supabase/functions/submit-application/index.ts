import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import PDFDocument from "https://esm.sh/pdfkit@0.13.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateApplicationPDF(data: any): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Uint8Array[] = [];

    doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    doc.on('end', () => {
      const result = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
      resolve(result);
    });
    doc.on('error', reject);

    // Header
    doc.fontSize(18).font('Helvetica-Bold').text('FICHA DE INSCRIÇÃO', { align: 'center' });
    doc.fontSize(16).text('AABB Jequié', { align: 'center' });
    doc.moveDown(2);

    // Dados Pessoais
    doc.fontSize(12).font('Helvetica-Bold').text('DADOS PESSOAIS');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Nome Completo: ${data.full_name}`);
    doc.text(`Data de Nascimento: ${data.birth_date}`);
    doc.text(`Sexo: ${data.sex === 'M' ? 'Masculino' : 'Feminino'}`);
    doc.text(`Estado Civil: ${data.civil_status}`);
    doc.text(`CPF: ${data.cpf}`);
    doc.text(`RG: ${data.rg}`);
    doc.text(`Órgão Emissor: ${data.emissor}`);
    doc.text(`UF: ${data.uf}`);
    doc.text(`E-mail: ${data.email}`);
    doc.moveDown();

    // Endereço Residencial
    doc.fontSize(12).font('Helvetica-Bold').text('ENDEREÇO RESIDENCIAL');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Rua/Avenida: ${data.residential_street}`);
    doc.text(`Número: ${data.residential_number}`);
    doc.text(`Bairro: ${data.residential_neighborhood}`);
    doc.text(`CEP: ${data.residential_cep}`);
    doc.text(`Cidade: ${data.residential_city}`);
    doc.text(`WhatsApp: ${data.residential_whatsapp}`);
    doc.moveDown();

    // Endereço Comercial
    doc.fontSize(12).font('Helvetica-Bold').text('ENDEREÇO COMERCIAL');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Rua/Avenida: ${data.commercial_street}`);
    doc.text(`Número: ${data.commercial_number}`);
    doc.text(`Bairro: ${data.commercial_neighborhood}`);
    doc.text(`CEP: ${data.commercial_cep}`);
    doc.text(`Cidade: ${data.commercial_city}`);
    if (data.commercial_whatsapp) {
      doc.text(`WhatsApp: ${data.commercial_whatsapp}`);
    }
    doc.moveDown();

    // Forma de Pagamento
    doc.fontSize(12).font('Helvetica-Bold').text('FORMA DE PAGAMENTO');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Método de Pagamento da Taxa: ${data.payment_method}`);
    doc.text(`Método de Pagamento Mensal: ${data.monthly_payment_method}`);
    doc.text(`Dia de Vencimento: ${data.due_date}`);
    doc.moveDown();

    // Dependentes
    if (data.dependents && data.dependents.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('DEPENDENTES');
      doc.fontSize(10).font('Helvetica');
      data.dependents.forEach((dep: any, index: number) => {
        doc.text(`\nDependente ${index + 1}:`);
        doc.text(`Nome: ${dep.name}`);
        doc.text(`CPF: ${dep.cpf}`);
        doc.text(`RG: ${dep.rg}`);
        doc.text(`Parentesco: ${dep.kinship}`);
      });
      doc.moveDown();
    }

    // New page for terms and signatures
    doc.addPage();
    doc.moveDown(2);

    // Terms
    doc.fontSize(10).font('Helvetica');
    doc.text('Declaro para devidos fins que aceito e estou ciente das normas e regulamentos vigentes (ESTATUTO/REGIMENTO).', {
      width: 500,
      align: 'justify'
    });
    doc.moveDown();
    doc.text('Autorizo o uso de minha imagem e de meus dependentes em fotos e filmagens com fins não comerciais nas publicações realizadas em eventos produzidos pela Associação em suas dependências, sejam eles culturais/esportivos.', {
      width: 500,
      align: 'justify'
    });
    doc.moveDown(3);

    // Signature lines
    const signatureY = doc.y + 50;
    doc.moveTo(50, signatureY).lineTo(250, signatureY).stroke();
    doc.moveTo(350, signatureY).lineTo(550, signatureY).stroke();
    
    doc.fontSize(10).text('Associado', 50, signatureY + 10);
    doc.text('Associação Atlética Banco do Brasil', 350, signatureY + 10);

    // Footer
    doc.fontSize(8).text(`Data da Inscrição: ${new Date().toLocaleDateString('pt-BR')}`, 50, 750, {
      align: 'center',
      width: 500
    });

    doc.end();
  });
}

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
  commercialWhatsapp: z.string().regex(phoneRegex).optional().or(z.literal("")),
  commercialPhone: z.string().regex(phoneRegex).optional().or(z.literal("")),
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
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

    // Generate PDF
    const pdfBuffer = await generateApplicationPDF(data);
    const pdfBase64 = btoa(String.fromCharCode(...pdfBuffer));
    
    // Send email to user
    try {
      await resend.emails.send({
        from: "AABB Jequié <onboarding@resend.dev>",
        to: [validatedData.email],
        subject: "Confirmação de Inscrição - AABB Jequié",
        html: `
          <h1>Inscrição Recebida com Sucesso!</h1>
          <p>Olá ${validatedData.fullName},</p>
          <p>Recebemos sua inscrição na AABB Jequié com sucesso!</p>
          <p>Em anexo, você encontrará o PDF com todos os dados fornecidos. Por favor, imprima, assine e entregue na sede da associação.</p>
          <p><strong>Próximos passos:</strong></p>
          <ul>
            <li>Imprima o documento em anexo</li>
            <li>Assine no campo indicado como "Associado"</li>
            <li>Leve o documento à sede da AABB Jequié para finalizar o processo</li>
          </ul>
          <p>Qualquer dúvida, entre em contato através do WhatsApp: ${validatedData.residentialWhatsapp}</p>
          <p>Atenciosamente,<br>AABB Jequié</p>
        `,
        attachments: [
          {
            filename: `inscricao-aabb-${data.id}.pdf`,
            content: pdfBase64,
          },
        ],
      });
      console.log('User email sent successfully');
    } catch (emailError) {
      console.error('Error sending user email:', emailError);
    }

    // Send email to admin
    try {
      await resend.emails.send({
        from: "AABB Jequié <onboarding@resend.dev>",
        to: ["hudsonargollo2@gmail.com"],
        subject: `Nova Inscrição - ${validatedData.fullName}`,
        html: `
          <h1>Nova Inscrição Recebida</h1>
          <p><strong>Nome:</strong> ${validatedData.fullName}</p>
          <p><strong>CPF:</strong> ${validatedData.cpf}</p>
          <p><strong>E-mail:</strong> ${validatedData.email}</p>
          <p><strong>WhatsApp:</strong> ${validatedData.residentialWhatsapp}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <p>O PDF completo com todos os dados está em anexo.</p>
        `,
        attachments: [
          {
            filename: `inscricao-aabb-${data.id}.pdf`,
            content: pdfBase64,
          },
        ],
      });
      console.log('Admin email sent successfully');
    } catch (emailError) {
      console.error('Error sending admin email:', emailError);
    }

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
