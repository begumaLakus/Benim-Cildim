import React, { useState } from 'react';

import { OptionCard } from '../../../shared/components';
import { Gender } from '../../../types';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { QuestionStepLayout } from '../components/QuestionStepLayout';
import { GENDER_OPTIONS } from '../data/questions';
import { StepProps } from './types';

export function GenderStep({ stepNumber, totalSteps, onNext, onBack }: StepProps) {
  const storedGender = useOnboardingStore((state) => state.gender);
  const setGender = useOnboardingStore((state) => state.setGender);
  const [selected, setSelected] = useState<Gender | null>(storedGender);

  const handleContinue = () => {
    if (!selected) return;
    setGender(selected);
    onNext();
  };

  return (
    <QuestionStepLayout
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      onBack={onBack}
      title="Cinsiyetin nedir?"
      subtitle="Bu bilgi, önerilerin sana daha uygun olması için kullanılır."
      ctaLabel="Devam Et"
      ctaDisabled={!selected}
      onCta={handleContinue}
    >
      {GENDER_OPTIONS.map((option) => (
        <OptionCard
          key={option.value}
          label={option.label}
          selected={selected === option.value}
          onPress={() => setSelected(option.value)}
        />
      ))}
    </QuestionStepLayout>
  );
}
