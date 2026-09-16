import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';

import { routes } from '../../../navigation/routes';
import { ActiveIngredientsStep } from '../steps/ActiveIngredientsStep';
import { AgeRangeStep } from '../steps/AgeRangeStep';
import { CameraStep } from '../steps/CameraStep';
import { ConcernsStep } from '../steps/ConcernsStep';
import { GenderStep } from '../steps/GenderStep';
import { SensitivitiesStep } from '../steps/SensitivitiesStep';
import { SkinTypeStep } from '../steps/SkinTypeStep';

/** Adım sırası: yaş -> cinsiyet -> kamera -> kalan anket soruları. */
const STEP_ORDER = [
  'ageRange',
  'gender',
  'camera',
  'skinType',
  'concerns',
  'activeIngredients',
  'sensitivities',
] as const;

type StepId = (typeof STEP_ORDER)[number];

/** "Tek soru, tek ekran" anket sihirbazı — adım index'ini kendi içinde tutar, ayrı route'lar yok. */
export function QuestionnaireFlowScreen() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);

  const goNext = useCallback(() => {
    setStepIndex((index) => {
      if (index >= STEP_ORDER.length - 1) {
        router.push(routes.resultsWaiting);
        return index;
      }
      return index + 1;
    });
  }, [router]);

  const goBack = useCallback(() => {
    setStepIndex((index) => {
      if (index === 0) {
        router.back();
        return index;
      }
      return index - 1;
    });
  }, [router]);

  const stepNumber = stepIndex + 1;
  const totalSteps = STEP_ORDER.length;
  const currentStep: StepId = STEP_ORDER[stepIndex];
  const stepProps = { stepNumber, totalSteps, onNext: goNext, onBack: goBack };

  switch (currentStep) {
    case 'ageRange':
      return <AgeRangeStep {...stepProps} />;
    case 'gender':
      return <GenderStep {...stepProps} />;
    case 'camera':
      return <CameraStep {...stepProps} />;
    case 'skinType':
      return <SkinTypeStep {...stepProps} />;
    case 'concerns':
      return <ConcernsStep {...stepProps} />;
    case 'activeIngredients':
      return <ActiveIngredientsStep {...stepProps} />;
    case 'sensitivities':
      return <SensitivitiesStep {...stepProps} />;
  }
}
