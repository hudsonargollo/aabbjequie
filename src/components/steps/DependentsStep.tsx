import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { FormData, Dependent } from "@/types/form";
import { Plus, Trash2 } from "lucide-react";

interface DependentsStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export const DependentsStep = ({ data, onChange }: DependentsStepProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentDependent, setCurrentDependent] = useState<Dependent>({
    name: "", cpf: "", rg: "", emissor: "", uf: "", birthDate: "", sex: "", kinship: "", email: "", isUniversity: false
  });

  const handleAddDependent = () => {
    if (editingIndex !== null) {
      const updated = [...data.dependents];
      updated[editingIndex] = currentDependent;
      onChange("dependents", updated);
      setEditingIndex(null);
    } else {
      onChange("dependents", [...data.dependents, currentDependent]);
    }
    setCurrentDependent({ name: "", cpf: "", rg: "", emissor: "", uf: "", birthDate: "", sex: "", kinship: "", email: "", isUniversity: false });
    setShowForm(false);
  };

  const handleEdit = (index: number) => {
    setCurrentDependent(data.dependents[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleRemove = (index: number) => {
    onChange("dependents", data.dependents.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Dependentes</h2>
        <p className="text-muted-foreground">Adicione seus dependentes (se houver)</p>
      </div>

      <div className="space-y-4">
        {data.dependents.map((dep, index) => (
          <Card key={index} className="p-4 bg-muted/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{dep.name}</p>
                <p className="text-sm text-muted-foreground">{dep.kinship} - CPF: {dep.cpf}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(index)}>Editar</Button>
                <Button variant="destructive" size="sm" onClick={() => handleRemove(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        ))}

        {!showForm ? (
          <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Adicionar Dependente
          </Button>
        ) : (
          <Card className="p-6 space-y-4">
            <div>
              <Label htmlFor="depName">Nome Completo *</Label>
              <Input id="depName" value={currentDependent.name} onChange={(e) => setCurrentDependent({ ...currentDependent, name: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="depCpf">CPF *</Label>
                <Input id="depCpf" value={currentDependent.cpf} onChange={(e) => setCurrentDependent({ ...currentDependent, cpf: e.target.value })} placeholder="000.000.000-00" />
              </div>
              <div>
                <Label htmlFor="depRg">RG *</Label>
                <Input id="depRg" value={currentDependent.rg} onChange={(e) => setCurrentDependent({ ...currentDependent, rg: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="depEmissor">Emissor *</Label>
                <Input id="depEmissor" value={currentDependent.emissor} onChange={(e) => setCurrentDependent({ ...currentDependent, emissor: e.target.value })} placeholder="SSP" />
              </div>
              <div>
                <Label htmlFor="depUf">UF *</Label>
                <Input id="depUf" value={currentDependent.uf} onChange={(e) => setCurrentDependent({ ...currentDependent, uf: e.target.value })} maxLength={2} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="depBirthDate">Data de Nascimento *</Label>
                <Input id="depBirthDate" type="date" value={currentDependent.birthDate} onChange={(e) => setCurrentDependent({ ...currentDependent, birthDate: e.target.value })} />
              </div>
              <div>
                <Label>Sexo *</Label>
                <RadioGroup value={currentDependent.sex} onValueChange={(value) => setCurrentDependent({ ...currentDependent, sex: value })} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="M" id="depMale" />
                    <Label htmlFor="depMale" className="font-normal cursor-pointer">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="F" id="depFemale" />
                    <Label htmlFor="depFemale" className="font-normal cursor-pointer">Feminino</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div>
              <Label htmlFor="depKinship">Parentesco *</Label>
              <Input id="depKinship" value={currentDependent.kinship} onChange={(e) => setCurrentDependent({ ...currentDependent, kinship: e.target.value })} placeholder="Ex: Filho(a), Cônjuge, etc" />
            </div>

            <div>
              <Label htmlFor="depEmail">E-mail</Label>
              <Input id="depEmail" type="email" value={currentDependent.email} onChange={(e) => setCurrentDependent({ ...currentDependent, email: e.target.value })} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="depUniversity" checked={currentDependent.isUniversity} onCheckedChange={(checked) => setCurrentDependent({ ...currentDependent, isUniversity: checked as boolean })} />
              <Label htmlFor="depUniversity" className="font-normal cursor-pointer">Estudante universitário</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddDependent} className="flex-1">{editingIndex !== null ? "Salvar" : "Adicionar"}</Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditingIndex(null); setCurrentDependent({ name: "", cpf: "", rg: "", emissor: "", uf: "", birthDate: "", sex: "", kinship: "", email: "", isUniversity: false }); }}>Cancelar</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
