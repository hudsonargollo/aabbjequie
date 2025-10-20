import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormData } from "@/types/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCEP, jequieNeighborhoods } from "@/lib/utils";

interface ResidentialAddressStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export const ResidentialAddressStep = ({ data, onChange }: ResidentialAddressStepProps) => {
  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    onChange('residentialCep', formatted);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Endereço Residencial</h2>
        <p className="text-muted-foreground">Onde você mora atualmente</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="residentialStreet">Rua/Avenida *</Label>
            <Input
              id="residentialStreet"
              value={data.residentialStreet}
              onChange={(e) => onChange("residentialStreet", e.target.value)}
              placeholder="Nome da rua"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="residentialNumber">Número *</Label>
            <Input
              id="residentialNumber"
              value={data.residentialNumber}
              onChange={(e) => onChange("residentialNumber", e.target.value)}
              placeholder="Nº"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="residentialNeighborhood">Bairro *</Label>
            <Select
              value={data.residentialNeighborhood}
              onValueChange={(value) => onChange('residentialNeighborhood', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o bairro" />
              </SelectTrigger>
              <SelectContent>
                {jequieNeighborhoods.map((neighborhood) => (
                  <SelectItem key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="residentialCep">CEP *</Label>
            <Input
              id="residentialCep"
              value={data.residentialCep}
              onChange={handleCEPChange}
              placeholder="00000-000"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="residentialCity">Cidade *</Label>
          <Input
            id="residentialCity"
            value={data.residentialCity}
            onChange={(e) => onChange("residentialCity", e.target.value)}
            placeholder="Cidade"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="residentialWhatsapp">Telefone/WhatsApp *</Label>
          <Input
            id="residentialWhatsapp"
            value={data.residentialWhatsapp}
            onChange={(e) => onChange("residentialWhatsapp", e.target.value)}
            placeholder="(00) 00000-0000"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="seu@email.com"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};
