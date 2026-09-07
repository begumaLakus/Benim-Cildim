import React from 'react';

import { OptionCard } from '../../../shared/components';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { QuestionStepLayout } from '../components/QuestionStepLayout';
import { SKIN_CONCERN_OPTIONS } from '../data/questions';
import { StepProps } from './types';

export function ConcernsStep({ stepNumber, totalSteps, onNext, onBack }: StepProps) {
  const answers = useOnboardingStore((state) => state.answers);
  const toggleConcern = useOnboardingStore((state) => state.toggleConcern);

  return (
    <QuestionStepLayout
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      onBack={onBack}
      title="Cilt endişelerin neler?"
      subtitle="Birden fazla seçebilirsin."
      ctaLabel="Devam Et"
      ctaDisabled={answers.concerns.length === 0}
      onCta={onNext}
    >
      {SKIN_CONCERN_OPTIONS.map((option) => (
        <OptionCard
          key={option.value}
          label={option.label}
          selected={answers.concerns.includes(option.value)}
          onPress={() => toggleConcern(option.value)}
        />
      ))}
    </QuestionStepLayout>
  );
}
