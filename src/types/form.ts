export interface Dependent {
  name: string;
  cpf: string;
  rg: string;
  emissor: string;
  uf: string;
  birthDate: string;
  sex: string;
  kinship: string;
  email: string;
  isUniversity: boolean;
}

export interface FormData {
  // Dados Pessoais
  fullName: string;
  birthDate: string;
  sex: string;
  civilStatus: string;
  cpf: string;
  rg: string;
  emissor: string;
  uf: string;
  
  // Endereço Residencial
  residentialStreet: string;
  residentialNumber: string;
  residentialNeighborhood: string;
  residentialCep: string;
  residentialCity: string;
  residentialWhatsapp: string;
  email: string;
  
  // Endereço Comercial
  commercialStreet: string;
  commercialNumber: string;
  commercialNeighborhood: string;
  commercialCep: string;
  commercialCity: string;
  commercialWhatsapp: string;
  
  // Pagamento (no sensitive data stored)
  paymentMethod: string;
  monthlyPaymentMethod: string;
  dueDate: string;
  paymentToken?: string;
  paymentProcessor?: string;
  lastFourDigits?: string;
  
  // Dependentes
  dependents: Dependent[];
  
  // Termos
  acceptStatute: boolean;
  acceptImageUsage: boolean;
  
  // Antecedentes
  hasCriminalRecord: boolean;
}
