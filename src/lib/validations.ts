import { z } from "zod";

// Brazilian CPF validation regex
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

// Brazilian phone regex (with or without country code)
const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;

// Brazilian CEP regex
const cepRegex = /^\d{5}-?\d{3}$/;

export const personalDataSchema = z.object({
  fullName: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres").max(200, "Nome muito longo"),
  birthDate: z.string().refine((date) => {
    const d = new Date(date);
    const now = new Date();
    const minDate = new Date('1900-01-01');
    return d < now && d > minDate;
  }, "Data de nascimento inválida"),
  sex: z.enum(['M', 'F'], { errorMap: () => ({ message: "Selecione o sexo" }) }),
  civilStatus: z.string().min(1, "Selecione o estado civil"),
  cpf: z.string().regex(cpfRegex, "CPF deve estar no formato XXX.XXX.XXX-XX"),
  rg: z.string().trim().min(5, "RG inválido").max(20),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
});

export const residentialAddressSchema = z.object({
  residentialStreet: z.string().trim().min(3, "Rua muito curta").max(200),
  residentialNumber: z.string().trim().min(1, "Número obrigatório").max(10),
  residentialNeighborhood: z.string().trim().min(1, "Selecione o bairro").max(100),
  residentialCep: z.string().regex(cepRegex, "CEP deve estar no formato XXXXX-XXX"),
  residentialCity: z.string().trim().min(2, "Cidade muito curta").max(100),
  residentialWhatsapp: z.string().regex(phoneRegex, "Telefone/WhatsApp inválido"),
});

export const commercialAddressSchema = z.object({
  commercialStreet: z.string().trim().min(3, "Rua muito curta").max(200),
  commercialNumber: z.string().trim().min(1, "Número obrigatório").max(10),
  commercialNeighborhood: z.string().trim().min(1, "Selecione o bairro").max(100),
  commercialCep: z.string().regex(cepRegex, "CEP deve estar no formato XXXXX-XXX"),
  commercialCity: z.string().trim().min(2, "Cidade muito curta").max(100),
  commercialWhatsapp: z.string().regex(phoneRegex, "Telefone/WhatsApp inválido").optional().or(z.literal('')),
});

export const paymentSchema = z.object({
  paymentMethod: z.string().min(1, "Selecione a forma de pagamento"),
  monthlyPaymentMethod: z.string().min(1, "Selecione a forma de pagamento mensal"),
  dueDate: z.string().min(1, "Selecione o dia de vencimento"),
  // Payment processor fields (no sensitive data stored)
  paymentToken: z.string().optional(),
  paymentProcessor: z.string().optional(),
  lastFourDigits: z.string().max(4).optional(),
});

export const dependentSchema = z.object({
  name: z.string().trim().min(3).max(200),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  emissor: z.string().optional(),
  uf: z.string().optional(),
  birthDate: z.string().refine((date) => {
    const d = new Date(date);
    const now = new Date();
    return d < now;
  }),
  sex: z.enum(['M', 'F']),
  kinship: z.string().min(1),
  email: z.union([z.string().email().max(255), z.literal("")]).optional(),
  isUniversity: z.boolean(),
});

export const termsSchema = z.object({
  acceptStatute: z.boolean().refine(val => val === true, "Você deve aceitar o estatuto"),
  acceptImageUsage: z.boolean().refine(val => val === true, "Você deve aceitar o uso de imagem"),
});

export type PersonalDataInput = z.infer<typeof personalDataSchema>;
export type ResidentialAddressInput = z.infer<typeof residentialAddressSchema>;
export type CommercialAddressInput = z.infer<typeof commercialAddressSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type DependentInput = z.infer<typeof dependentSchema>;
export type TermsInput = z.infer<typeof termsSchema>;
