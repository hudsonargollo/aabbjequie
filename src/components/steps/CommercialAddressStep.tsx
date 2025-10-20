import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/form";

interface CommercialAddressStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export const CommercialAddressStep = ({ data, onChange }: CommercialAddressStepProps) => {
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
            <Input
              id="commercialNeighborhood"
              value={data.commercialNeighborhood}
              onChange={(e) => onChange("commercialNeighborhood", e.target.value)}
              placeholder="Bairro"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="commercialCep">CEP</Label>
            <Input
              id="commercialCep"
              value={data.commercialCep}
              onChange={(e) => onChange("commercialCep", e.target.value)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="commercialWhatsapp">Celular WhatsApp</Label>
            <Input
              id="commercialWhatsapp"
              value={data.commercialWhatsapp}
              onChange={(e) => onChange("commercialWhatsapp", e.target.value)}
              placeholder="(00) 00000-0000"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="commercialPhone">Celular</Label>
            <Input
              id="commercialPhone"
              value={data.commercialPhone}
              onChange={(e) => onChange("commercialPhone", e.target.value)}
              placeholder="(00) 00000-0000"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
