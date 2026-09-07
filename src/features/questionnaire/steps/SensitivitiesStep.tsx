import React from 'react';

import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { QuestionStepLayout } from '../components/QuestionStepLayout';
import { YesNoRow } from '../components/YesNoRow';
import { StepProps } from './types';

/**
 * Anket akışının son sorusu. Devam butonu burada normal "Devam Et" değil,
 * kullanıcının akışı bilinçli şekilde bitirdiğini belirten
 * "Rutinimi Oluştur, Sonucu Göster" metnini taşır.
 */
export function SensitivitiesStep({ stepNumber, totalSteps, onNext, onBack }: StepProps) {
  const answers = useOnboardingStore((state) => state.answers);
  const setAnswers = useOnboardingStore((state) => state.setAnswers);

  return (
    <QuestionStepLayout
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      onBack={onBack}
      title="Bilinen bir cilt hassasiyetin/alerjin var mı?"
      ctaLabel="Rutinimi Oluştur, Sonucu Göster"
      ctaDisabled={answers.hasKnownSensitivities === null}
      onCta={onNext}
    >
      <YesNoRow
        value={answers.hasKnownSensitivities}
        onChange={(value) => setAnswers({ ...answers, hasKnownSensitivities: value })}
      />
    </QuestionStepLayout>
  );
}
