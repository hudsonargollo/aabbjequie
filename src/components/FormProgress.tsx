interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const FormProgress = ({ currentStep, totalSteps }: FormProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Etapa {currentStep} de {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-accent to-secondary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
