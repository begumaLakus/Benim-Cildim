import React from 'react';

import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { QuestionStepLayout } from '../components/QuestionStepLayout';
import { YesNoRow } from '../components/YesNoRow';
import { StepProps } from './types';

export function ActiveIngredientsStep({ stepNumber, totalSteps, onNext, onBack }: StepProps) {
  const answers = useOnboardingStore((state) => state.answers);
  const setAnswers = useOnboardingStore((state) => state.setAnswers);

  return (
    <QuestionStepLayout
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      onBack={onBack}
      title="Şu anda aktif madde içerikli ürün kullanıyor musun?"
      ctaLabel="Devam Et"
      ctaDisabled={answers.usesActiveIngredients === null}
      onCta={onNext}
    >
      <YesNoRow
        value={answers.usesActiveIngredients}
        onChange={(value) => setAnswers({ ...answers, usesActiveIngredients: value })}
      />
    </QuestionStepLayout>
  );
}
