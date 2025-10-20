import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "@/types/form";

interface PaymentStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export const PaymentStep = ({ data, onChange }: PaymentStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Forma de Pagamento</h2>
        <p className="text-muted-foreground">Como você prefere pagar?</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Taxa de Adesão *</Label>
          <RadioGroup
            value={data.paymentMethod}
            onValueChange={(value) => onChange("paymentMethod", value)}
            className="flex flex-col gap-3 mt-2"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="dinheiro" id="cash" />
              <Label htmlFor="cash" className="font-normal cursor-pointer flex-1">Dinheiro</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="credito" id="credit" />
              <Label htmlFor="credit" className="font-normal cursor-pointer flex-1">Cartão de Crédito</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="debito" id="debit" />
              <Label htmlFor="debit" className="font-normal cursor-pointer flex-1">Cartão de Débito</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="pix" id="pix" />
              <Label htmlFor="pix" className="font-normal cursor-pointer flex-1">PIX</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Mensalidades *</Label>
          <RadioGroup
            value={data.monthlyPaymentMethod}
            onValueChange={(value) => onChange("monthlyPaymentMethod", value)}
            className="flex flex-col gap-3 mt-2"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="conta_corrente" id="checking" />
              <Label htmlFor="checking" className="font-normal cursor-pointer flex-1">Conta Corrente BB</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="cartao_credito" id="cc" />
              <Label htmlFor="cc" className="font-normal cursor-pointer flex-1">Cartão de Crédito</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="boleto" id="boleto" />
              <Label htmlFor="boleto" className="font-normal cursor-pointer flex-1">Boleto Bancário</Label>
            </div>
          </RadioGroup>
        </div>

        {data.monthlyPaymentMethod === "conta_corrente" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            <div>
              <Label htmlFor="bankAgency">Agência</Label>
              <Input id="bankAgency" value={data.bankAgency} onChange={(e) => onChange("bankAgency", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="bankAccount">Conta</Label>
              <Input id="bankAccount" value={data.bankAccount} onChange={(e) => onChange("bankAccount", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="bankDv">DV</Label>
              <Input id="bankDv" value={data.bankDv} onChange={(e) => onChange("bankDv", e.target.value)} />
            </div>
          </div>
        )}

        {data.monthlyPaymentMethod === "cartao_credito" && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input id="cardNumber" value={data.cardNumber} onChange={(e) => onChange("cardNumber", e.target.value)} placeholder="0000 0000 0000 0000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardValidity">Validade</Label>
                <Input id="cardValidity" value={data.cardValidity} onChange={(e) => onChange("cardValidity", e.target.value)} placeholder="MM/AA" />
              </div>
              <div>
                <Label htmlFor="cardFlag">Bandeira</Label>
                <Input id="cardFlag" value={data.cardFlag} onChange={(e) => onChange("cardFlag", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="dueDate">Dia de Vencimento da Mensalidade *</Label>
          <Select value={data.dueDate} onValueChange={(value) => onChange("dueDate", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione o dia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="04">Dia 04</SelectItem>
              <SelectItem value="12">Dia 12</SelectItem>
              <SelectItem value="20">Dia 20</SelectItem>
              <SelectItem value="31">Dia 31</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
