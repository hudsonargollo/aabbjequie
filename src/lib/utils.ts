import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export const jequieNeighborhoods = [
  "Alto da Bela Vista",
  "Bairro da Urbis",
  "Bela Vista",
  "Boa Vista",
  "Bomfim",
  "Braquinha",
  "Brooklin",
  "Cansanção",
  "Centro",
  "Cidade Nova",
  "Curral Novo",
  "Joaquim Romão",
  "Jequiezinho",
  "Mandacaru",
  "Mutirão",
  "PAC",
  "Pal Esso",
  "Pau Ferro",
  "Portal da Cidade",
  "São Judas Tadeu",
  "São Luiz",
  "Vila Lígia",
];
