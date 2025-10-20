import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from "@/types/form";

interface TermsStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export const TermsStep = ({ data, onChange }: TermsStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Termos e Condições</h2>
        <p className="text-muted-foreground">Leia e aceite os termos para finalizar</p>
      </div>

      <div className="space-y-6 bg-muted/30 p-6 rounded-lg">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="acceptStatute" 
              checked={data.acceptStatute} 
              onCheckedChange={(checked) => onChange("acceptStatute", checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="acceptStatute" className="font-normal cursor-pointer leading-relaxed">
              Declaro para devidos fins que aceito e estou ciente das normas e regulamentos vigentes 
              (ESTATUTO/ REGIMENTO E OUTROS REGULAMENTOS DA AABB). *
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="acceptImageUsage" 
              checked={data.acceptImageUsage} 
              onCheckedChange={(checked) => onChange("acceptImageUsage", checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="acceptImageUsage" className="font-normal cursor-pointer leading-relaxed">
              Autorizo a utilização da minha imagem e/ou dos meus dependentes em fotografias e 
              vídeos realizados nas dependências da AABB Jequié para fins de divulgação institucional 
              em materiais impressos e digitais. *
            </Label>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Os campos marcados com * são obrigatórios. Ao enviar este formulário, você confirma 
            que todas as informações fornecidas são verdadeiras e está ciente de que dados falsos 
            podem resultar no cancelamento da sua inscrição.
          </p>
        </div>
      </div>
    </div>
  );
};
