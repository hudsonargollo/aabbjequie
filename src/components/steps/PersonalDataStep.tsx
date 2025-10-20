import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "@/types/form";
import { formatCPF } from "@/lib/utils";
interface PersonalDataStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}
export const PersonalDataStep = ({
  data,
  onChange
}: PersonalDataStepProps) => {
  return <div className="space-y-6 animate-fade-in">
      <div>
        
        
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Nome Completo *</Label>
          <Input id="fullName" value={data.fullName} onChange={e => onChange("fullName", e.target.value)} placeholder="Digite seu nome completo" className="mt-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="birthDate">Data de Nascimento *</Label>
            <Input id="birthDate" type="date" value={data.birthDate} onChange={e => onChange("birthDate", e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label>Sexo *</Label>
            <RadioGroup value={data.sex} onValueChange={value => onChange("sex", value)} className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="M" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">Masculino</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="F" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">Feminino</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div>
          <Label htmlFor="civilStatus">Estado Civil *</Label>
          <Select value={data.civilStatus} onValueChange={value => onChange("civilStatus", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
              <SelectItem value="casado">Casado(a)</SelectItem>
              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input id="cpf" value={data.cpf} onChange={e => onChange("cpf", formatCPF(e.target.value))} placeholder="000.000.000-00" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="rg">RG *</Label>
            <Input id="rg" value={data.rg} onChange={e => onChange("rg", e.target.value)} placeholder="00.000.000" className="mt-1" />
          </div>
        </div>

        <div>
          <Label htmlFor="email">E-mail *</Label>
          <Input id="email" type="email" value={data.email} onChange={e => onChange("email", e.target.value)} placeholder="seu@email.com" className="mt-1" />
        </div>
      </div>
    </div>;
};