import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

// AABB Logo as base64
const AABB_LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateApplicationHTML(data: any): string {
  const dependentsHTML = data.dependents && data.dependents.length > 0 
    ? `
      <h3 style="color: #1e40af; margin-top: 20px;">DEPENDENTES</h3>
      ${data.dependents.map((dep: any, index: number) => `
        <div style="margin: 10px 0; padding: 10px; background: #f9fafb; border-left: 3px solid #1e40af;">
          <strong>Dependente ${index + 1}:</strong><br>
          Nome: ${dep.name}<br>
          Data de Nascimento: ${dep.birthDate}<br>
          Sexo: ${dep.sex === 'M' ? 'Masculino' : 'Feminino'}<br>
          Parentesco: ${dep.kinship}<br>
          ${dep.email ? `E-mail: ${dep.email}<br>` : ''}
          ${dep.isUniversity ? 'Universitário: Sim' : ''}
        </div>
      `).join('')}
    `
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #1e40af; }
        .header { text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin: 20px 0; page-break-inside: avoid; }
        .field { margin: 8px 0; }
        .signature-section { margin-top: 60px; page-break-before: always; }
        .signature-line { border-top: 2px solid #000; width: 300px; margin: 80px 20px 10px; display: inline-block; }
        .terms { margin: 30px 0; padding: 15px; background: #f9fafb; border-left: 4px solid #1e40af; }
        @media print {
          body { margin: 0; }
          .page-break { page-break-after: always; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>FICHA DE INSCRIÇÃO</h1>
        <h2>AABB Jequié</h2>
      </div>

      <div class="section">
        <h3>DADOS PESSOAIS</h3>
        <div class="field"><strong>Nome Completo:</strong> ${data.full_name}</div>
        <div class="field"><strong>Data de Nascimento:</strong> ${data.birth_date}</div>
        <div class="field"><strong>Sexo:</strong> ${data.sex === 'M' ? 'Masculino' : 'Feminino'}</div>
        <div class="field"><strong>Estado Civil:</strong> ${data.civil_status}</div>
        <div class="field"><strong>CPF:</strong> ${data.cpf}</div>
        <div class="field"><strong>RG:</strong> ${data.rg}</div>
        <div class="field"><strong>E-mail:</strong> ${data.email}</div>
      </div>

      <div class="section">
        <h3>ENDEREÇO RESIDENCIAL</h3>
        <div class="field"><strong>Rua/Avenida:</strong> ${data.residential_street}</div>
        <div class="field"><strong>Número:</strong> ${data.residential_number}</div>
        <div class="field"><strong>Bairro:</strong> ${data.residential_neighborhood}</div>
        <div class="field"><strong>CEP:</strong> ${data.residential_cep}</div>
        <div class="field"><strong>Cidade:</strong> ${data.residential_city}</div>
        <div class="field"><strong>WhatsApp:</strong> ${data.residential_whatsapp}</div>
      </div>

      <div class="section">
        <h3>ENDEREÇO COMERCIAL</h3>
        <div class="field"><strong>Rua/Avenida:</strong> ${data.commercial_street}</div>
        <div class="field"><strong>Número:</strong> ${data.commercial_number}</div>
        <div class="field"><strong>Bairro:</strong> ${data.commercial_neighborhood}</div>
        <div class="field"><strong>CEP:</strong> ${data.commercial_cep}</div>
        <div class="field"><strong>Cidade:</strong> ${data.commercial_city}</div>
        ${data.commercial_whatsapp ? `<div class="field"><strong>WhatsApp:</strong> ${data.commercial_whatsapp}</div>` : ''}
      </div>

      <div class="section">
        <h3>FORMA DE PAGAMENTO</h3>
        <div class="field"><strong>Método de Pagamento da Taxa:</strong> ${data.payment_method}</div>
        <div class="field"><strong>Método de Pagamento Mensal:</strong> ${data.monthly_payment_method}</div>
        <div class="field"><strong>Dia de Vencimento:</strong> ${data.due_date}</div>
      </div>

      ${dependentsHTML}

      <div class="page-break"></div>

      <div class="signature-section">
        <div class="terms">
          <p><strong>Declaro para devidos fins que aceito e estou ciente das normas e regulamentos vigentes (ESTATUTO/ REGIMENTO INTERNO E OUTROS REGULAMENTOS DA AABB).</strong></p>
          <p><strong>Autorizo o uso de minha imagem e de meus dependentes em fotos e filmagens com fins não comerciais nas publicações realizadas em eventos produzidos pela Associação em suas dependências, sejam eles culturais/esportivos.</strong></p>
        </div>

        <div style="margin-top: 80px;">
          <div style="display: inline-block; width: 45%; text-align: center;">
            <div class="signature-line"></div>
            <div><strong>Associado</strong></div>
          </div>
          <div style="display: inline-block; width: 45%; text-align: center; margin-left: 5%;">
            <div class="signature-line"></div>
            <div><strong>Associação Atlética Banco do Brasil</strong></div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 60px; color: #666; font-size: 12px;">
          Data da Inscrição: ${new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>
    </body>
    </html>
  `;
}

// Validation schemas
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
const cepRegex = /^\d{5}-?\d{3}$/;

const dependentSchema = z.object({
  name: z.string().trim().min(3).max(200),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  emissor: z.string().optional(),
  uf: z.string().optional(),
  birthDate: z.string(),
  sex: z.enum(['M', 'F']),
  kinship: z.string().min(1),
  email: z.union([z.string().email().max(255), z.literal("")]).optional(),
  isUniversity: z.boolean(),
});

const applicationSchema = z.object({
  fullName: z.string().trim().min(3).max(200),
  birthDate: z.string(),
  sex: z.enum(['M', 'F']),
  civilStatus: z.string().min(1),
  cpf: z.string().regex(cpfRegex),
  rg: z.string().trim().min(5).max(20),
  email: z.string().email().max(255),
  residentialStreet: z.string().trim().min(3).max(200),
  residentialNumber: z.string().trim().min(1).max(10),
  residentialNeighborhood: z.string().trim().min(2).max(100),
  residentialCep: z.string().regex(cepRegex),
  residentialCity: z.string().trim().min(2).max(100),
  residentialWhatsapp: z.string().regex(phoneRegex),
  residentialPhone: z.string().regex(phoneRegex).optional(),
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

    // Generate comprehensive PDF for user and admin
    console.log('Generating comprehensive PDF...');
    
    const adminPdf = new jsPDF();
    let yPos = 20;
    
    // Header
    adminPdf.setFontSize(18);
    adminPdf.setFont('helvetica', 'bold');
    adminPdf.text('FICHA DE INSCRIÇÃO COMPLETA', 105, yPos, { align: 'center' });
    yPos += 10;
    adminPdf.setFontSize(14);
    adminPdf.text('AABB Jequié', 105, yPos, { align: 'center' });
    yPos += 15;
    
    // Personal Data
    adminPdf.setFontSize(12);
    adminPdf.setFont('helvetica', 'bold');
    adminPdf.text('DADOS PESSOAIS', 20, yPos);
    yPos += 7;
    adminPdf.setFont('helvetica', 'normal');
    adminPdf.setFontSize(10);
    adminPdf.text(`Nome Completo: ${validatedData.fullName}`, 20, yPos); yPos += 6;
    adminPdf.text(`CPF: ${validatedData.cpf}`, 20, yPos); yPos += 6;
    adminPdf.text(`RG: ${validatedData.rg}`, 20, yPos); yPos += 6;
    adminPdf.text(`Data de Nascimento: ${validatedData.birthDate}`, 20, yPos); yPos += 6;
    adminPdf.text(`Sexo: ${validatedData.sex === 'M' ? 'Masculino' : 'Feminino'}`, 20, yPos); yPos += 6;
    adminPdf.text(`Estado Civil: ${validatedData.civilStatus}`, 20, yPos); yPos += 6;
    adminPdf.text(`E-mail: ${validatedData.email}`, 20, yPos); yPos += 10;
    
    // Residential Address
    adminPdf.setFontSize(12);
    adminPdf.setFont('helvetica', 'bold');
    adminPdf.text('ENDEREÇO RESIDENCIAL', 20, yPos);
    yPos += 7;
    adminPdf.setFont('helvetica', 'normal');
    adminPdf.setFontSize(10);
    adminPdf.text(`Rua/Avenida: ${validatedData.residentialStreet}`, 20, yPos); yPos += 6;
    adminPdf.text(`Número: ${validatedData.residentialNumber}`, 20, yPos); yPos += 6;
    adminPdf.text(`Bairro: ${validatedData.residentialNeighborhood}`, 20, yPos); yPos += 6;
    adminPdf.text(`CEP: ${validatedData.residentialCep}`, 20, yPos); yPos += 6;
    adminPdf.text(`Cidade: ${validatedData.residentialCity}`, 20, yPos); yPos += 6;
    adminPdf.text(`WhatsApp: ${validatedData.residentialWhatsapp}`, 20, yPos); yPos += 6;
    if (validatedData.residentialPhone) {
      adminPdf.text(`Telefone: ${validatedData.residentialPhone}`, 20, yPos); yPos += 6;
    }
    yPos += 4;
    
    // Commercial Address
    adminPdf.setFontSize(12);
    adminPdf.setFont('helvetica', 'bold');
    adminPdf.text('ENDEREÇO COMERCIAL', 20, yPos);
    yPos += 7;
    adminPdf.setFont('helvetica', 'normal');
    adminPdf.setFontSize(10);
    adminPdf.text(`Rua/Avenida: ${validatedData.commercialStreet}`, 20, yPos); yPos += 6;
    adminPdf.text(`Número: ${validatedData.commercialNumber}`, 20, yPos); yPos += 6;
    adminPdf.text(`Bairro: ${validatedData.commercialNeighborhood}`, 20, yPos); yPos += 6;
    adminPdf.text(`CEP: ${validatedData.commercialCep}`, 20, yPos); yPos += 6;
    adminPdf.text(`Cidade: ${validatedData.commercialCity}`, 20, yPos); yPos += 6;
    if (validatedData.commercialWhatsapp) {
      adminPdf.text(`WhatsApp: ${validatedData.commercialWhatsapp}`, 20, yPos); yPos += 6;
    }
    if (validatedData.commercialPhone) {
      adminPdf.text(`Telefone: ${validatedData.commercialPhone}`, 20, yPos); yPos += 6;
    }
    yPos += 4;
    
    // Payment Info
    adminPdf.setFontSize(12);
    adminPdf.setFont('helvetica', 'bold');
    adminPdf.text('FORMA DE PAGAMENTO', 20, yPos);
    yPos += 7;
    adminPdf.setFont('helvetica', 'normal');
    adminPdf.setFontSize(10);
    adminPdf.text(`Método de Pagamento da Taxa: ${validatedData.paymentMethod}`, 20, yPos); yPos += 6;
    adminPdf.text(`Método de Pagamento Mensal: ${validatedData.monthlyPaymentMethod}`, 20, yPos); yPos += 6;
    adminPdf.text(`Dia de Vencimento: ${validatedData.dueDate}`, 20, yPos); yPos += 10;
    
    // Dependents
    if (validatedData.dependents && validatedData.dependents.length > 0) {
      adminPdf.setFontSize(12);
      adminPdf.setFont('helvetica', 'bold');
      adminPdf.text('DEPENDENTES', 20, yPos);
      yPos += 7;
      adminPdf.setFont('helvetica', 'normal');
      adminPdf.setFontSize(10);
      
      validatedData.dependents.forEach((dep: any, index: number) => {
        if (yPos > 250) {
          adminPdf.addPage();
          yPos = 20;
        }
        adminPdf.setFont('helvetica', 'bold');
        adminPdf.text(`Dependente ${index + 1}:`, 20, yPos); yPos += 6;
        adminPdf.setFont('helvetica', 'normal');
        adminPdf.text(`Nome: ${dep.name}`, 25, yPos); yPos += 6;
        adminPdf.text(`CPF: ${dep.cpf || 'Não informado'}`, 25, yPos); yPos += 6;
        adminPdf.text(`RG: ${dep.rg || 'Não informado'}`, 25, yPos); yPos += 6;
        if (dep.emissor || dep.uf) {
          adminPdf.text(`Emissor: ${dep.emissor || ''} - ${dep.uf || ''}`, 25, yPos); yPos += 6;
        }
        adminPdf.text(`Data de Nascimento: ${dep.birthDate}`, 25, yPos); yPos += 6;
        adminPdf.text(`Sexo: ${dep.sex === 'M' ? 'Masculino' : 'Feminino'}`, 25, yPos); yPos += 6;
        adminPdf.text(`Parentesco: ${dep.kinship}`, 25, yPos); yPos += 6;
        adminPdf.text(`E-mail: ${dep.email || 'Não informado'}`, 25, yPos); yPos += 6;
        adminPdf.text(`Universitário: ${dep.isUniversity ? 'Sim' : 'Não'}`, 25, yPos); yPos += 8;
      });
    }
    
    // Terms
    if (yPos > 220) {
      adminPdf.addPage();
      yPos = 20;
    }
    adminPdf.setFontSize(12);
    adminPdf.setFont('helvetica', 'bold');
    adminPdf.text('TERMOS ACEITOS', 20, yPos);
    yPos += 10;
    adminPdf.setFont('helvetica', 'normal');
    adminPdf.setFontSize(10);
    
    // First term with checkbox
    adminPdf.setDrawColor(0, 0, 0);
    adminPdf.setLineWidth(0.3);
    adminPdf.rect(20, yPos - 3, 4, 4);
    adminPdf.text('✓', 21, yPos + 1);
    const terms1 = adminPdf.splitTextToSize(
      'Declaro para devidos fins que aceito e estou ciente das normas e regulamentos vigentes (ESTATUTO/ REGIMENTO INTERNO E OUTROS REGULAMENTOS DA AABB).', 
      165
    );
    adminPdf.text(terms1, 27, yPos);
    yPos += (terms1.length * 6) + 5;
    
    // Second term with checkbox
    adminPdf.rect(20, yPos - 3, 4, 4);
    adminPdf.text('✓', 21, yPos + 1);
    const terms2 = adminPdf.splitTextToSize(
      'Autorizo o uso de minha imagem e de meus dependentes em fotos e filmagens com fins não comerciais nas publicações realizadas em eventos produzidos pela Associação em suas dependências, sejam eles culturais/esportivos.', 
      165
    );
    adminPdf.text(terms2, 27, yPos);
    yPos += (terms2.length * 6) + 10;
    
    // Footer
    adminPdf.setFontSize(9);
    adminPdf.setFont('helvetica', 'italic');
    adminPdf.text(`Data da Inscrição: ${new Date().toLocaleString('pt-BR')}`, 20, yPos);
    
    const adminPdfBase64 = adminPdf.output('datauristring').split(',')[1];
    
    // Send email to user with complete PDF
    try {
      const emailResult = await resend.emails.send({
        from: "AABB Jequié <cadastro@aabbjequie.online>",
        to: [validatedData.email],
        subject: "Confirmação de Inscrição - AABB Jequié",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Inscrição Recebida com Sucesso!</h1>
            <p>Olá <strong>${validatedData.fullName}</strong>,</p>
            <p>Recebemos sua inscrição na janela de adesão AABB Jequié com sucesso!</p>
            <p><strong>Próximos passos:</strong></p>
            <ul>
              <li>Compareça à sede da AABB Jequié na data informada com os documentos originais em mãos.</li>
            </ul>
            <p style="margin-top: 10px;"><strong>OBS:</strong> O preenchimento deste formulário não garante a sua vaga. As vagas serão preenchidas de acordo ordem de chegada e o número de vagas é limitado, podendo encerrar a janela de adesão antes da data determinada.</p>
            <p style="margin-top: 20px;">Atenciosamente,<br><strong>AABB Jequié</strong></p>
          </div>
        `,
        attachments: [
          {
            filename: `inscricao-completa-${validatedData.cpf.replace(/\D/g, '')}.pdf`,
            content: adminPdfBase64,
          },
        ],
      });
      console.log('User email sent successfully:', emailResult);
    } catch (emailError) {
      console.error('Error sending user email:', emailError);
      console.error('Email error details:', JSON.stringify(emailError, null, 2));
      // Don't fail the whole request if user email fails
    }
    
    // Send email to admin with complete PDF
    try {
      await resend.emails.send({
        from: "AABB Jequié <cadastro@aabbjequie.online>",
        to: ["hudsonargollo2@gmail.com", "w.aabbjequie@gmail.com"],
        subject: `Nova Inscrição - ${validatedData.fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Nova Inscrição Recebida</h1>
            <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #1e40af; margin: 20px 0;">
              <p><strong>Nome:</strong> ${validatedData.fullName}</p>
              <p><strong>CPF:</strong> ${validatedData.cpf}</p>
              <p><strong>E-mail:</strong> ${validatedData.email}</p>
              <p><strong>WhatsApp:</strong> ${validatedData.residentialWhatsapp}</p>
              <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            </div>
            <p>Arquivo anexado com todos os dados da inscrição.</p>
          </div>
        `,
        attachments: [
          {
            filename: `inscricao-completa-${validatedData.cpf.replace(/\D/g, '')}.pdf`,
            content: adminPdfBase64,
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
