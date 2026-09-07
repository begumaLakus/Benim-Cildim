import React, { useState } from 'react';

import { OptionCard } from '../../../shared/components';
import { AgeRange } from '../../../types';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { QuestionStepLayout } from '../components/QuestionStepLayout';
import { AGE_RANGE_OPTIONS } from '../data/questions';
import { StepProps } from './types';

export function AgeRangeStep({ stepNumber, totalSteps, onNext, onBack }: StepProps) {
  const answers = useOnboardingStore((state) => state.answers);
  const setAnswers = useOnboardingStore((state) => state.setAnswers);
  const [selected, setSelected] = useState<AgeRange | null>(answers.ageRange);

  const handleContinue = () => {
    if (!selected) return;
    setAnswers({ ...answers, ageRange: selected });
    onNext();
  };

  return (
    <QuestionStepLayout
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      onBack={onBack}
      title="Yaş aralığın nedir?"
      subtitle="Rutin önerilerini yaşına uygun şekilde şekillendiriyoruz."
      ctaLabel="Devam Et"
      ctaDisabled={!selected}
      onCta={handleContinue}
    >
      {AGE_RANGE_OPTIONS.map((option) => (
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
