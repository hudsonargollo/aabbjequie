interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

const stepTitles = [
  "Dados Pessoais",
  "Endereço Residencial", 
  "Endereço Comercial",
  "Pagamento e Termos"
];

export const FormProgress = ({ currentStep, totalSteps }: FormProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full space-y-6">
      {/* Step Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {stepTitles[currentStep - 1]}
        </h2>
        <p className="text-sm text-muted-foreground">
          Etapa {currentStep} de {totalSteps}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div
                key={step}
                className={`
                  w-12 h-1.5 rounded-full transition-all duration-500
                  ${step <= currentStep ? "bg-gradient-to-r from-primary to-accent" : "bg-muted"}
                `}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-primary">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};
