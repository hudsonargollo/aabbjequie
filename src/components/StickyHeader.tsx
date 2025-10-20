import { useEffect, useState } from "react";
import aabbLogo from "@/assets/aabb-logo.webp";

interface StickyHeaderProps {
  currentStep: number;
  totalSteps: number;
}

const stepNames = [
  "Dados Pessoais",
  "Endereço Residencial",
  "Endereço Comercial",
  "Pagamento"
];

export const StickyHeader = ({ currentStep, totalSteps }: StickyHeaderProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show header after scrolling 200px
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b shadow-sm transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={aabbLogo} alt="AABB" className="h-10 w-auto" />
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-foreground">Janela Relâmpago</h2>
            <p className="text-xs text-muted-foreground">Inscrição de Sócio</p>
          </div>
        </div>

        {/* Steps Navigation */}
        <nav className="flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300
                  ${
                    step === currentStep
                      ? "bg-primary text-primary-foreground shadow-lg scale-110"
                      : step < currentStep
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }
                `}
                title={stepNames[step - 1]}
              >
                {step}
              </div>
              {step < totalSteps && (
                <div
                  className={`w-8 h-0.5 transition-colors duration-300 ${
                    step < currentStep ? "bg-accent" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </nav>

        {/* Progress percentage - mobile only */}
        <div className="sm:hidden">
          <span className="text-xs font-bold text-primary">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
      </div>
    </header>
  );
};
