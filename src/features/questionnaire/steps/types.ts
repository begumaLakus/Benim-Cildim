/** Sihirbazdaki her adım bileşeninin aldığı ortak proplar. */
export interface StepProps {
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
}
