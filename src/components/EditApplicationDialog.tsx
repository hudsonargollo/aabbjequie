import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { formatCPF } from '@/lib/utils';

interface EditApplicationDialogProps {
  application: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditApplicationDialog = ({
  application,
  open,
  onOpenChange,
  onSuccess,
}: EditApplicationDialogProps) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(application);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('applications')
        .update({
          full_name: formData.full_name,
          birth_date: formData.birth_date,
          sex: formData.sex,
          civil_status: formData.civil_status,
          cpf: formData.cpf,
          rg: formData.rg,
          email: formData.email,
          residential_street: formData.residential_street,
          residential_number: formData.residential_number,
          residential_neighborhood: formData.residential_neighborhood,
          residential_cep: formData.residential_cep,
          residential_city: formData.residential_city,
          residential_whatsapp: formData.residential_whatsapp,
          residential_phone: formData.residential_phone,
          commercial_street: formData.commercial_street,
          commercial_number: formData.commercial_number,
          commercial_neighborhood: formData.commercial_neighborhood,
          commercial_cep: formData.commercial_cep,
          commercial_city: formData.commercial_city,
          commercial_whatsapp: formData.commercial_whatsapp,
          commercial_phone: formData.commercial_phone,
          payment_method: formData.payment_method,
          monthly_payment_method: formData.monthly_payment_method,
          due_date: formData.due_date,
          dependents: formData.dependents,
          accept_statute: formData.accept_statute,
          accept_image_usage: formData.accept_image_usage,
        })
        .eq('id', application.id);

      if (error) throw error;

      toast.success('Inscrição atualizada com sucesso');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error('Erro ao atualizar inscrição');
      console.error('Error updating application:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Inscrição</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Pessoal</TabsTrigger>
              <TabsTrigger value="residential">Residencial</TabsTrigger>
              <TabsTrigger value="commercial">Comercial</TabsTrigger>
              <TabsTrigger value="payment">Pagamento</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <div>
                <Label>Nome Completo</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => handleChange('birth_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Sexo</Label>
                  <RadioGroup value={formData.sex} onValueChange={(v) => handleChange('sex', v)}>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="M" id="edit-m" />
                        <Label htmlFor="edit-m" className="font-normal">Masculino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id="edit-f" />
                        <Label htmlFor="edit-f" className="font-normal">Feminino</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div>
                <Label>Estado Civil</Label>
                <Select value={formData.civil_status} onValueChange={(v) => handleChange('civil_status', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CPF</Label>
                  <Input
                    value={formData.cpf}
                    onChange={(e) => handleChange('cpf', formatCPF(e.target.value))}
                  />
                </div>
                <div>
                  <Label>RG</Label>
                  <Input
                    value={formData.rg}
                    onChange={(e) => handleChange('rg', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="residential" className="space-y-4 mt-4">
              <div>
                <Label>Rua</Label>
                <Input
                  value={formData.residential_street}
                  onChange={(e) => handleChange('residential_street', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Número</Label>
                  <Input
                    value={formData.residential_number}
                    onChange={(e) => handleChange('residential_number', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Bairro</Label>
                  <Input
                    value={formData.residential_neighborhood}
                    onChange={(e) => handleChange('residential_neighborhood', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CEP</Label>
                  <Input
                    value={formData.residential_cep}
                    onChange={(e) => handleChange('residential_cep', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Cidade</Label>
                  <Input
                    value={formData.residential_city}
                    onChange={(e) => handleChange('residential_city', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    value={formData.residential_whatsapp}
                    onChange={(e) => handleChange('residential_whatsapp', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={formData.residential_phone || ''}
                    onChange={(e) => handleChange('residential_phone', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="commercial" className="space-y-4 mt-4">
              <div>
                <Label>Rua</Label>
                <Input
                  value={formData.commercial_street}
                  onChange={(e) => handleChange('commercial_street', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Número</Label>
                  <Input
                    value={formData.commercial_number}
                    onChange={(e) => handleChange('commercial_number', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Bairro</Label>
                  <Input
                    value={formData.commercial_neighborhood}
                    onChange={(e) => handleChange('commercial_neighborhood', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CEP</Label>
                  <Input
                    value={formData.commercial_cep}
                    onChange={(e) => handleChange('commercial_cep', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Cidade</Label>
                  <Input
                    value={formData.commercial_city}
                    onChange={(e) => handleChange('commercial_city', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    value={formData.commercial_whatsapp || ''}
                    onChange={(e) => handleChange('commercial_whatsapp', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={formData.commercial_phone || ''}
                    onChange={(e) => handleChange('commercial_phone', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-4 mt-4">
              <div>
                <Label>Forma de Pagamento da Taxa de Adesão</Label>
                <Select value={formData.payment_method} onValueChange={(v) => handleChange('payment_method', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Forma de Pagamento Mensalidade</Label>
                <Select value={formData.monthly_payment_method} onValueChange={(v) => handleChange('monthly_payment_method', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debito">Débito em Conta</SelectItem>
                    <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Dia de Vencimento</Label>
                <Select value={formData.due_date} onValueChange={(v) => handleChange('due_date', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Dia 5</SelectItem>
                    <SelectItem value="15">Dia 15</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-statute"
                    checked={formData.accept_statute}
                    onCheckedChange={(v) => handleChange('accept_statute', v)}
                  />
                  <Label htmlFor="edit-statute" className="font-normal">
                    Aceito o estatuto
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-image"
                    checked={formData.accept_image_usage}
                    onCheckedChange={(v) => handleChange('accept_image_usage', v)}
                  />
                  <Label htmlFor="edit-image" className="font-normal">
                    Aceito o uso de imagem
                  </Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
