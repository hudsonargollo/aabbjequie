import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

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
          CPF: ${dep.cpf}<br>
          RG: ${dep.rg}<br>
          Parentesco: ${dep.kinship}
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
          <p><strong>Declaro para devidos fins que aceito e estou ciente das normas e regulamentos vigentes (ESTATUTO/ REGIMENTO E OUTROS REGULAMENTOS DA AABB).</strong></p>
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

    // Generate HTML for email
    const applicationHTML = generateApplicationHTML(data);
    
    // Send email to user with PDF attachment
    console.log('Attempting to send confirmation email to user:', validatedData.email);
    
    // Generate PDF for user attachment (same as admin PDF)
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const columnWidth = pageWidth / 2;
    
    // Function to add content to one column
    const addColumn = (xOffset: number) => {
      let yPos = 15;
      
      // Header
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('FICHA DE INSCRIÇÃO', xOffset + columnWidth / 2, yPos, { align: 'center' });
      yPos += 7;
      pdf.setFontSize(12);
      pdf.text('AABB Jequié', xOffset + columnWidth / 2, yPos, { align: 'center' });
      yPos += 10;
      
      // Personal Data
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DADOS PESSOAIS', xOffset + 5, yPos);
      yPos += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(`Nome: ${validatedData.fullName}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
      pdf.text(`CPF: ${validatedData.cpf}`, xOffset + 5, yPos); yPos += 4;
      pdf.text(`RG: ${validatedData.rg}`, xOffset + 5, yPos); yPos += 4;
      pdf.text(`Nasc: ${validatedData.birthDate}`, xOffset + 5, yPos); yPos += 4;
      pdf.text(`Sexo: ${validatedData.sex === 'M' ? 'M' : 'F'}`, xOffset + 5, yPos); yPos += 4;
      pdf.text(`Est. Civil: ${validatedData.civilStatus}`, xOffset + 5, yPos); yPos += 6;
      
      // Residential Address
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ENDEREÇO RESIDENCIAL', xOffset + 5, yPos);
      yPos += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(`${validatedData.residentialStreet}, ${validatedData.residentialNumber}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
      pdf.text(`${validatedData.residentialNeighborhood} - ${validatedData.residentialCity}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
      pdf.text(`CEP: ${validatedData.residentialCep}`, xOffset + 5, yPos); yPos += 4;
      pdf.text(`WhatsApp: ${validatedData.residentialWhatsapp}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 6;
      
      // Commercial Address
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ENDEREÇO COMERCIAL', xOffset + 5, yPos);
      yPos += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(`${validatedData.commercialStreet}, ${validatedData.commercialNumber}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
      pdf.text(`${validatedData.commercialNeighborhood} - ${validatedData.commercialCity}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
      pdf.text(`CEP: ${validatedData.commercialCep}`, xOffset + 5, yPos); yPos += 6;
      
      // Dependents
      if (validatedData.dependents && validatedData.dependents.length > 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('DEPENDENTES', xOffset + 5, yPos);
        yPos += 5;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        
        validatedData.dependents.forEach((dep: any, index: number) => {
          pdf.text(`${index + 1}. ${dep.name}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 });
          yPos += 3;
          pdf.text(`CPF: ${dep.cpf}`, xOffset + 5, yPos);
          yPos += 4;
        });
        yPos += 3;
      }
      
      // Terms
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DECLARO E ACEITO', xOffset + 5, yPos);
      yPos += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      const termsText1 = 'Declaro para devidos fins que aceito e estou ciente das normas e regulamentos vigentes (ESTATUTO/ REGIMENTO E OUTROS REGULAMENTOS DA AABB).';
      const splitTerms1 = pdf.splitTextToSize(termsText1, columnWidth - 10);
      pdf.text(splitTerms1, xOffset + 5, yPos);
      yPos += splitTerms1.length * 3 + 3;
      
      const termsText2 = 'Autorizo o uso de minha imagem e de meus dependentes em fotos e filmagens com fins não comerciais nas publicações realizadas em eventos produzidos pela Associação.';
      const splitTerms2 = pdf.splitTextToSize(termsText2, columnWidth - 10);
      pdf.text(splitTerms2, xOffset + 5, yPos);
      yPos += splitTerms2.length * 3 + 8;
      
      // First Signature
      pdf.setFontSize(8);
      pdf.line(xOffset + 10, yPos, xOffset + columnWidth - 10, yPos);
      yPos += 4;
      pdf.setFont('helvetica', 'bold');
      pdf.text('ASSINATURA DO TITULAR', xOffset + columnWidth / 2, yPos, { align: 'center' });
      yPos += 8;
      
      // Payment Info
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PAGAMENTO', xOffset + 5, yPos);
      yPos += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(`Taxa: ${validatedData.paymentMethod}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
      pdf.text(`Mensal: ${validatedData.monthlyPaymentMethod}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
      pdf.text(`Vencimento: ${validatedData.dueDate}`, xOffset + 5, yPos); yPos += 8;
      
      // Second Signature
      pdf.setFontSize(8);
      pdf.line(xOffset + 10, yPos, xOffset + columnWidth - 10, yPos);
      yPos += 4;
      pdf.setFont('helvetica', 'bold');
      pdf.text('ASSINATURA DO TITULAR', xOffset + columnWidth / 2, yPos, { align: 'center' });
      yPos += 8;
      
      // Date
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, xOffset + 5, yPos);
    };
    
    // Add both columns
    addColumn(0); // Left column
    
    // Add vertical dividing line
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineDash([2, 2]);
    pdf.line(pageWidth / 2, 10, pageWidth / 2, pageHeight - 10);
    pdf.setLineDash([]);
    
    addColumn(columnWidth); // Right column
    
    const pdfBase64 = pdf.output('datauristring').split(',')[1];
    
    try {
      const emailResult = await resend.emails.send({
        from: "AABB Jequié <onboarding@resend.dev>",
        to: [validatedData.email],
        subject: "Confirmação de Inscrição - AABB Jequié",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Inscrição Recebida com Sucesso!</h1>
            <p>Olá <strong>${validatedData.fullName}</strong>,</p>
            <p>Recebemos sua inscrição na AABB Jequié com sucesso!</p>
            <p><strong>Próximos passos:</strong></p>
            <ul>
              <li>Imprima o documento em anexo</li>
              <li>Assine no campo indicado como "ASSINATURA DO TITULAR"</li>
              <li>Leve o documento à sede da AABB Jequié para finalizar o processo</li>
            </ul>
            <p>Qualquer dúvida, entre em contato através do WhatsApp: ${validatedData.residentialWhatsapp}</p>
            <p>Atenciosamente,<br><strong>AABB Jequié</strong></p>
          </div>
        `,
        attachments: [
          {
            filename: `ficha-inscricao-${validatedData.cpf.replace(/\D/g, '')}.pdf`,
            content: pdfBase64,
          },
        ],
      });
      console.log('User email sent successfully:', emailResult);
    } catch (emailError) {
      console.error('Error sending user email:', emailError);
      console.error('Email error details:', JSON.stringify(emailError, null, 2));
      // Don't fail the whole request if user email fails
    }

    // Send email to admin with PDF attachment (reusing same PDF)
    // PDF already generated above for user email
    // Send email to admin with PDF attachment
    try {
      await resend.emails.send({
        from: "AABB Jequié <onboarding@resend.dev>",
        to: ["hudsonargollo2@gmail.com"],
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
            <p>O recibo completo está em anexo.</p>
          </div>
        `,
        attachments: [
          {
            filename: `recibo-${validatedData.cpf.replace(/\D/g, '')}.pdf`,
            content: pdfBase64,
          },
        ],
      });
      console.log('Admin email sent successfully with PDF attachment');
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
