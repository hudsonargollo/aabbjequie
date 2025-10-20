import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormProgress } from "@/components/FormProgress";
import { StickyHeader } from "@/components/StickyHeader";
import { PersonalDataStep } from "@/components/steps/PersonalDataStep";
import { ResidentialAddressStep } from "@/components/steps/ResidentialAddressStep";
import { CommercialAddressStep } from "@/components/steps/CommercialAddressStep";
import { PaymentStep } from "@/components/steps/PaymentStep";
import { TermsDialog } from "@/components/TermsDialog";
import { FormData } from "@/types/form";
import { toast } from "sonner";
import topoImage from "@/assets/topo.png";
import { personalDataSchema, residentialAddressSchema, commercialAddressSchema, paymentSchema } from "@/lib/validations";
const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    birthDate: "",
    sex: "",
    civilStatus: "",
    cpf: "",
    rg: "",
    emissor: "",
    uf: "",
    residentialStreet: "",
    residentialNumber: "",
    residentialNeighborhood: "",
    residentialCep: "",
    residentialCity: "Jequié",
    residentialWhatsapp: "",
    email: "",
    commercialStreet: "",
    commercialNumber: "",
    commercialNeighborhood: "",
    commercialCep: "",
    commercialCity: "Jequié",
    commercialWhatsapp: "",
    paymentMethod: "",
    monthlyPaymentMethod: "",
    dueDate: "",
    paymentToken: "",
    paymentProcessor: "",
    lastFourDigits: "",
    dependents: [],
    acceptStatute: false,
    acceptImageUsage: false,
    hasCriminalRecord: false
  });
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleNext = () => {
    // Validate current step before proceeding
    try {
      if (currentStep === 1) {
        personalDataSchema.parse(formData);
      } else if (currentStep === 2) {
        residentialAddressSchema.parse(formData);
      } else if (currentStep === 3) {
        commercialAddressSchema.parse(formData);
      }
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    } catch (error: any) {
      if (error.errors) {
        toast.error(error.errors[0].message);
      }
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  const handleSubmitClick = () => {
    try {
      // Validate payment data before showing terms dialog
      paymentSchema.parse(formData);
      setShowTermsDialog(true);
    } catch (error: any) {
      if (error.errors) {
        toast.error(error.errors[0].message);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Set the terms acceptance in form data
      const submissionData = {
        ...formData,
        acceptStatute: true,
        acceptImageUsage: true
      };

      const {
        data,
        error
      } = await supabase.functions.invoke('submit-application', {
        body: submissionData
      });
      if (error) throw error;
      
      toast.success("Inscrição enviada com sucesso! Você receberá uma confirmação por email e WhatsApp.");
      setShowTermsDialog(false);

      // Reset form
      setFormData({
        fullName: "",
        birthDate: "",
        sex: "",
        civilStatus: "",
        cpf: "",
        rg: "",
        emissor: "",
        uf: "",
        residentialStreet: "",
        residentialNumber: "",
        residentialNeighborhood: "",
        residentialCep: "",
        residentialCity: "Jequié",
        residentialWhatsapp: "",
        email: "",
        commercialStreet: "",
        commercialNumber: "",
        commercialNeighborhood: "",
        commercialCep: "",
        commercialCity: "Jequié",
        commercialWhatsapp: "",
        paymentMethod: "",
        monthlyPaymentMethod: "",
        dueDate: "",
        paymentToken: "",
        paymentProcessor: "",
        lastFourDigits: "",
        dependents: [],
        acceptStatute: false,
        acceptImageUsage: false,
        hasCriminalRecord: false
      });
      setCurrentStep(1);
    } catch (error: any) {
      console.error('Submission error:', error);
      if (error.errors) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Erro ao enviar inscrição. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };
  return <>
      <StickyHeader currentStep={currentStep} totalSteps={totalSteps} />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Hero Section - Only show on step 1 */}
          {currentStep === 1 && <div className="space-y-4 animate-fade-in">
              <img src={topoImage} alt="AABB Jequié - Janela Relâmpago" className="w-full rounded-2xl shadow-2xl" />
              <div className="text-center">
                
                
              </div>
            </div>}
          
          {/* Form Card */}
          <Card className="p-6 md:p-10 shadow-2xl border-2 animate-scale-in">
            <FormProgress currentStep={currentStep} totalSteps={totalSteps} />
            
            <div className="mt-8">
              {currentStep === 1 && <PersonalDataStep data={formData} onChange={handleChange} />}
              {currentStep === 2 && <ResidentialAddressStep data={formData} onChange={handleChange} />}
              {currentStep === 3 && <CommercialAddressStep data={formData} onChange={handleChange} />}
              {currentStep === 4 && <PaymentStep data={formData} onChange={handleChange} />}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-10">
              {currentStep > 1 && <Button variant="outline" onClick={handleBack} className="flex-1 h-12 text-base font-bold border-2 hover:bg-muted">
                  ← Voltar
                </Button>}
              {currentStep < totalSteps ? <Button onClick={handleNext} className="flex-1 h-14 text-base font-bold uppercase bg-primary text-primary-foreground border-2 border-primary-foreground/20 hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300">
                  CONTINUAR
                </Button> : <Button onClick={handleSubmitClick} className="flex-1 h-14 text-base font-bold uppercase bg-accent text-accent-foreground border-2 border-accent-foreground/20 hover:bg-accent/90 shadow-lg hover:shadow-xl transition-all duration-300" disabled={formData.hasCriminalRecord}>
                  ✓ Enviar Inscrição
                </Button>}
            </div>
          </Card>
        </div>
      </div>

      <TermsDialog
        open={showTermsDialog}
        onOpenChange={setShowTermsDialog}
        onConfirm={handleSubmit}
        loading={loading}
      />
    </>;
};
export default Index;