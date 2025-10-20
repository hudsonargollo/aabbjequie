import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormData } from "@/types/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCEP, jequieNeighborhoods } from "@/lib/utils";

interface CommercialAddressStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export const CommercialAddressStep = ({ data, onChange }: CommercialAddressStepProps) => {
  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    onChange('commercialCep', formatted);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Endereço Comercial</h2>
        <p className="text-muted-foreground">Informações do seu trabalho (opcional)</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="commercialStreet">Rua/Avenida</Label>
            <Input
              id="commercialStreet"
              value={data.commercialStreet}
              onChange={(e) => onChange("commercialStreet", e.target.value)}
              placeholder="Nome da rua"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="commercialNumber">Número</Label>
            <Input
              id="commercialNumber"
              value={data.commercialNumber}
              onChange={(e) => onChange("commercialNumber", e.target.value)}
              placeholder="Nº"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="commercialNeighborhood">Bairro</Label>
            <Select
              value={data.commercialNeighborhood}
              onValueChange={(value) => onChange('commercialNeighborhood', value)}
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
            <Label htmlFor="commercialCep">CEP</Label>
            <Input
              id="commercialCep"
              value={data.commercialCep}
              onChange={handleCEPChange}
              placeholder="00000-000"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="commercialCity">Cidade</Label>
          <Input
            id="commercialCity"
            value={data.commercialCity}
            onChange={(e) => onChange("commercialCity", e.target.value)}
            placeholder="Cidade"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="commercialWhatsapp">Telefone/WhatsApp</Label>
          <Input
            id="commercialWhatsapp"
            value={data.commercialWhatsapp}
            onChange={(e) => onChange("commercialWhatsapp", e.target.value)}
            placeholder="(00) 00000-0000"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};
