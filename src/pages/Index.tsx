import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
import {
  personalDataSchema,
  residentialAddressSchema,
  commercialAddressSchema,
  paymentSchema,
  termsSchema,
} from "@/lib/validations";

const Index = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "", birthDate: "", sex: "", civilStatus: "", cpf: "", rg: "", emissor: "", uf: "",
    residentialStreet: "", residentialNumber: "", residentialNeighborhood: "", residentialCep: "",
    residentialCity: "", residentialWhatsapp: "", residentialPhone: "", email: "",
    commercialStreet: "", commercialNumber: "", commercialNeighborhood: "", commercialCep: "",
    commercialCity: "", commercialWhatsapp: "", commercialPhone: "",
    paymentMethod: "", monthlyPaymentMethod: "", dueDate: "",
    paymentToken: "", paymentProcessor: "", lastFourDigits: "",
    dependents: [], acceptStatute: false, acceptImageUsage: false
  });

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate all data
      paymentSchema.parse(formData);
      termsSchema.parse(formData);

      setLoading(true);

      const { data, error } = await supabase.functions.invoke('submit-application', {
        body: formData,
      });

      if (error) throw error;

      toast.success("Inscrição enviada com sucesso! Você receberá uma confirmação por email e WhatsApp.");
      
      // Reset form
      setFormData({
        fullName: "", birthDate: "", sex: "", civilStatus: "", cpf: "", rg: "", emissor: "", uf: "",
        residentialStreet: "", residentialNumber: "", residentialNeighborhood: "", residentialCep: "",
        residentialCity: "", residentialWhatsapp: "", residentialPhone: "", email: "",
        commercialStreet: "", commercialNumber: "", commercialNeighborhood: "", commercialCep: "",
        commercialCity: "", commercialWhatsapp: "", commercialPhone: "",
        paymentMethod: "", monthlyPaymentMethod: "", dueDate: "",
        paymentToken: "", paymentProcessor: "", lastFourDigits: "",
        dependents: [], acceptStatute: false, acceptImageUsage: false
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={handleLogout} size="sm">
            Sair
          </Button>
        </div>
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
              <Button 
                onClick={handleSubmit} 
                className="flex-1 bg-gradient-to-r from-accent to-secondary hover:opacity-90"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Inscrição"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
