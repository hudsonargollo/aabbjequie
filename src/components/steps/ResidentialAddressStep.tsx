import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormData } from "@/types/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCEP, jequieNeighborhoods } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface ResidentialAddressStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export const ResidentialAddressStep = ({ data, onChange }: ResidentialAddressStepProps) => {
  const [loadingCEP, setLoadingCEP] = useState(false);

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    onChange('residentialCep', formatted);

    // Only fetch if CEP is complete (9 characters with dash: 00000-000)
    if (formatted.length === 9) {
      setLoadingCEP(true);
      try {
        const cepNumbers = formatted.replace('-', '');
        const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);
        const data = await response.json();

        if (data.erro) {
          toast.error('CEP não encontrado');
          return;
        }

        // Auto-fill the fields
        if (data.logradouro) {
          onChange('residentialStreet', data.logradouro);
        }
        if (data.bairro) {
          onChange('residentialNeighborhood', data.bairro);
        }
        if (data.localidade) {
          onChange('residentialCity', data.localidade);
        }
        
        toast.success('Endereço encontrado!');
      } catch (error) {
        console.error('Error fetching CEP:', error);
        toast.error('Erro ao buscar CEP');
      } finally {
        setLoadingCEP(false);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Endereço Residencial</h2>
        <p className="text-muted-foreground">Onde você mora atualmente</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="residentialCep">CEP *</Label>
          <Input
            id="residentialCep"
            value={data.residentialCep}
            onChange={handleCEPChange}
            placeholder="00000-000"
            className="mt-1"
            disabled={loadingCEP}
          />
          {loadingCEP && <p className="text-xs text-muted-foreground mt-1">Buscando endereço...</p>}
        </div>

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
            {data.residentialNeighborhood === "Outro" && (
              <Input
                value={data.residentialNeighborhood === "Outro" ? "" : data.residentialNeighborhood}
                onChange={(e) => onChange('residentialNeighborhood', e.target.value)}
                placeholder="Digite o bairro"
                className="mt-2"
              />
            )}
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
      </div>
    </div>
  );
};
