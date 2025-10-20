import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
}

export const TermsDialog = ({ open, onOpenChange, onConfirm, loading }: TermsDialogProps) => {
  const [acceptStatute, setAcceptStatute] = useState(false);
  const [acceptImageUsage, setAcceptImageUsage] = useState(false);

  const handleConfirm = () => {
    if (acceptStatute && acceptImageUsage) {
      onConfirm();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setAcceptStatute(false);
      setAcceptImageUsage(false);
    }
    onOpenChange(newOpen);
  };

  const canSubmit = acceptStatute && acceptImageUsage;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Termos e Condições</DialogTitle>
          <DialogDescription>
            Por favor, leia e aceite os termos abaixo para finalizar sua inscrição
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="statute"
                checked={acceptStatute}
                onCheckedChange={(checked) => setAcceptStatute(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="statute" className="font-normal cursor-pointer leading-relaxed text-sm">
                Declaro para devidos fins que aceito e estou ciente das normas e regulamentos vigentes (ESTATUTO/ REGIMENTO).
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="imageUsage"
                checked={acceptImageUsage}
                onCheckedChange={(checked) => setAcceptImageUsage(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="imageUsage" className="font-normal cursor-pointer leading-relaxed text-sm">
                Autorizo o uso de minha imagem e de meus dependentes em fotos e filmagens com fins não comerciais nas publicações realizadas em eventos produzidos pela Associação em suas dependências, sejam eles culturais/esportivos...
              </Label>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t">
            <div className="space-y-2">
              <div className="border-b border-foreground pb-1">
                <p className="text-sm font-medium">Associado</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="border-b border-foreground pb-1">
                <p className="text-sm font-medium">Associação Atlética Bando do Brasil</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canSubmit || loading}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {loading ? "Enviando..." : "Confirmar e Enviar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
