import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormProgress } from "@/components/FormProgress";
import { PersonalDataStep } from "@/components/steps/PersonalDataStep";
import { ResidentialAddressStep } from "@/components/steps/ResidentialAddressStep";
import { CommercialAddressStep } from "@/components/steps/CommercialAddressStep";
import { PaymentStep } from "@/components/steps/PaymentStep";
import { FormData } from "@/types/form";
import { toast } from "sonner";
import topoImage from "@/assets/topo.png";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "", birthDate: "", sex: "", civilStatus: "", cpf: "", rg: "", emissor: "", uf: "",
    residentialStreet: "", residentialNumber: "", residentialNeighborhood: "", residentialCep: "",
    residentialCity: "", residentialWhatsapp: "", residentialPhone: "", email: "",
    commercialStreet: "", commercialNumber: "", commercialNeighborhood: "", commercialCep: "",
    commercialCity: "", commercialWhatsapp: "", commercialPhone: "",
    paymentMethod: "", monthlyPaymentMethod: "", bankAgency: "", bankAccount: "", bankDv: "",
    cardNumber: "", cardValidity: "", cardFlag: "", dueDate: "",
    dependents: [], acceptStatute: false, acceptImageUsage: false
  });

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    toast.success("Formulário enviado! Você receberá uma confirmação por email e WhatsApp.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <img src={topoImage} alt="AABB Jequié - Janela Relâmpago" className="w-full rounded-lg shadow-lg mb-8" />
        
        <Card className="p-6 md:p-8 shadow-xl">
          <FormProgress currentStep={currentStep} totalSteps={totalSteps} />
          
          <div className="mt-8">
            {currentStep === 1 && <PersonalDataStep data={formData} onChange={handleChange} />}
            {currentStep === 2 && <ResidentialAddressStep data={formData} onChange={handleChange} />}
            {currentStep === 3 && <CommercialAddressStep data={formData} onChange={handleChange} />}
            {currentStep === 4 && <PaymentStep data={formData} onChange={handleChange} />}
          </div>

          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Voltar
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button onClick={handleNext} className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Próximo
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-accent to-secondary hover:opacity-90">
                Enviar Inscrição
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
