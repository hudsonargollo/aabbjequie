import { jsPDF } from 'jspdf';

interface ApplicationData {
  id: string;
  full_name: string;
  birth_date: string;
  sex: string;
  civil_status: string;
  cpf: string;
  rg: string;
  email: string;
  residential_street: string;
  residential_number: string;
  residential_neighborhood: string;
  residential_cep: string;
  residential_city: string;
  residential_whatsapp: string;
  commercial_street: string;
  commercial_number: string;
  commercial_neighborhood: string;
  commercial_cep: string;
  commercial_city: string;
  commercial_whatsapp?: string;
  payment_method: string;
  monthly_payment_method: string;
  due_date: string;
  dependents?: any[];
}

export const generateApplicationPDF = (application: ApplicationData) => {
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
    pdf.text(`Nome: ${application.full_name}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
    pdf.text(`CPF: ${application.cpf}`, xOffset + 5, yPos); yPos += 4;
    pdf.text(`RG: ${application.rg}`, xOffset + 5, yPos); yPos += 4;
    pdf.text(`Nasc: ${application.birth_date}`, xOffset + 5, yPos); yPos += 4;
    pdf.text(`Sexo: ${application.sex === 'M' ? 'M' : 'F'}`, xOffset + 5, yPos); yPos += 4;
    pdf.text(`Est. Civil: ${application.civil_status}`, xOffset + 5, yPos); yPos += 6;
    
    // Residential Address
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ENDEREÇO RESIDENCIAL', xOffset + 5, yPos);
    yPos += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text(`${application.residential_street}, ${application.residential_number}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
    pdf.text(`${application.residential_neighborhood} - ${application.residential_city}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
    pdf.text(`CEP: ${application.residential_cep}`, xOffset + 5, yPos); yPos += 4;
    pdf.text(`WhatsApp: ${application.residential_whatsapp}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 6;
    
    // Commercial Address
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ENDEREÇO COMERCIAL', xOffset + 5, yPos);
    yPos += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text(`${application.commercial_street}, ${application.commercial_number}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
    pdf.text(`${application.commercial_neighborhood} - ${application.commercial_city}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
    pdf.text(`CEP: ${application.commercial_cep}`, xOffset + 5, yPos); yPos += 6;
    
    // Dependents
    if (application.dependents && application.dependents.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DEPENDENTES', xOffset + 5, yPos);
      yPos += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      
      application.dependents.forEach((dep: any, index: number) => {
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
    pdf.text(`Taxa: ${application.payment_method}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
    pdf.text(`Mensal: ${application.monthly_payment_method}`, xOffset + 5, yPos, { maxWidth: columnWidth - 10 }); yPos += 4;
    pdf.text(`Vencimento: ${application.due_date}`, xOffset + 5, yPos); yPos += 8;
    
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
  pdf.line(pageWidth / 2, 10, pageWidth / 2, pageHeight - 10);
  
  addColumn(columnWidth); // Right column
  
  // Download PDF
  pdf.save(`recibo-${application.cpf.replace(/\D/g, '')}.pdf`);
};
