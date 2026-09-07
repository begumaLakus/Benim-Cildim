import React, { useState } from 'react';

import { OptionCard } from '../../../shared/components';
import { SkinType } from '../../../types';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { QuestionStepLayout } from '../components/QuestionStepLayout';
import { SKIN_TYPE_OPTIONS } from '../data/questions';
import { StepProps } from './types';

export function SkinTypeStep({ stepNumber, totalSteps, onNext, onBack }: StepProps) {
  const answers = useOnboardingStore((state) => state.answers);
  const setAnswers = useOnboardingStore((state) => state.setAnswers);
  const [selected, setSelected] = useState<SkinType | null>(answers.skinType);

  const handleContinue = () => {
    if (!selected) return;
    setAnswers({ ...answers, skinType: selected });
    onNext();
  };

  return (
    <QuestionStepLayout
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      onBack={onBack}
      title="Cilt tipin nedir?"
      ctaLabel="Devam Et"
      ctaDisabled={!selected}
      onCta={handleContinue}
    >
      {SKIN_TYPE_OPTIONS.map((option) => (
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
