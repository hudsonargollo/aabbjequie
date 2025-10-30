import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from "@/types/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCEP, jequieNeighborhoods } from "@/lib/utils";

interface CommercialAddressStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export const CommercialAddressStep = ({ data, onChange }: CommercialAddressStepProps) => {
  const [sameAsResidential, setSameAsResidential] = useState(false);
  const [skipCommercial, setSkipCommercial] = useState(false);

  useEffect(() => {
    if (sameAsResidential) {
      onChange("commercialStreet", data.residentialStreet);
      onChange("commercialNumber", data.residentialNumber);
      onChange("commercialNeighborhood", data.residentialNeighborhood);
      onChange("commercialCep", data.residentialCep);
      onChange("commercialCity", data.residentialCity);
      onChange("commercialWhatsapp", data.residentialWhatsapp);
      setSkipCommercial(false);
    }
  }, [sameAsResidential]);

  useEffect(() => {
    if (skipCommercial) {
      onChange("commercialStreet", "N/A");
      onChange("commercialNumber", "0");
      onChange("commercialNeighborhood", "N/A");
      onChange("commercialCep", "00000-000");
      onChange("commercialCity", "N/A");
      onChange("commercialWhatsapp", "");
      setSameAsResidential(false);
    }
  }, [skipCommercial]);

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

      <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="sameAsResidential" 
            checked={sameAsResidential} 
            onCheckedChange={(checked) => setSameAsResidential(checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="sameAsResidential" className="font-normal cursor-pointer leading-relaxed">
            Usar o mesmo endereço residencial
          </Label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox 
            id="skipCommercial" 
            checked={skipCommercial} 
            onCheckedChange={(checked) => setSkipCommercial(checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="skipCommercial" className="font-normal cursor-pointer leading-relaxed">
            Não possuo endereço comercial
          </Label>
        </div>
      </div>


      <div className="space-y-4" style={{ opacity: sameAsResidential || skipCommercial ? 0.5 : 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="commercialStreet">Rua/Avenida</Label>
            <Input
              id="commercialStreet"
              value={data.commercialStreet}
              onChange={(e) => onChange("commercialStreet", e.target.value)}
              placeholder="Nome da rua"
              className="mt-1"
              disabled={sameAsResidential || skipCommercial}
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
              disabled={sameAsResidential || skipCommercial}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="commercialNeighborhood">Bairro</Label>
            <div className={`grid gap-4 mt-1 ${data.commercialNeighborhood && !jequieNeighborhoods.includes(data.commercialNeighborhood) && !sameAsResidential && !skipCommercial ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <Select
                value={data.commercialNeighborhood && jequieNeighborhoods.includes(data.commercialNeighborhood) ? data.commercialNeighborhood : "Outro"}
                onValueChange={(value) => {
                  if (value === "Outro") {
                    onChange('commercialNeighborhood', '');
                  } else {
                    onChange('commercialNeighborhood', value);
                  }
                }}
                disabled={sameAsResidential || skipCommercial}
              >
                <SelectTrigger>
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
              {data.commercialNeighborhood && !jequieNeighborhoods.includes(data.commercialNeighborhood) && !sameAsResidential && !skipCommercial && (
                <Input
                  value={data.commercialNeighborhood}
                  onChange={(e) => onChange('commercialNeighborhood', e.target.value)}
                  placeholder="Digite o bairro"
                  disabled={sameAsResidential || skipCommercial}
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="commercialCep">CEP</Label>
            <Input
              id="commercialCep"
              value={data.commercialCep}
              onChange={handleCEPChange}
              placeholder="00000-000"
              className="mt-1"
              disabled={sameAsResidential || skipCommercial}
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
            disabled={sameAsResidential || skipCommercial}
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
            disabled={sameAsResidential || skipCommercial}
          />
        </div>
      </div>
    </div>
  );
};
