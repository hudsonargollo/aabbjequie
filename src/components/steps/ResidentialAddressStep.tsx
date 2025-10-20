import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/form";

interface ResidentialAddressStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export const ResidentialAddressStep = ({ data, onChange }: ResidentialAddressStepProps) => {
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
            <Input
              id="residentialNeighborhood"
              value={data.residentialNeighborhood}
              onChange={(e) => onChange("residentialNeighborhood", e.target.value)}
              placeholder="Bairro"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="residentialCep">CEP *</Label>
            <Input
              id="residentialCep"
              value={data.residentialCep}
              onChange={(e) => onChange("residentialCep", e.target.value)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="residentialWhatsapp">Celular WhatsApp *</Label>
            <Input
              id="residentialWhatsapp"
              value={data.residentialWhatsapp}
              onChange={(e) => onChange("residentialWhatsapp", e.target.value)}
              placeholder="(00) 00000-0000"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="residentialPhone">Celular</Label>
            <Input
              id="residentialPhone"
              value={data.residentialPhone}
              onChange={(e) => onChange("residentialPhone", e.target.value)}
              placeholder="(00) 00000-0000"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
