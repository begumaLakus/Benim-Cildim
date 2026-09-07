import { useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CameraCapture } from '../../camera/components/CameraCapture';
import { ScreenContainer } from '../../../shared/components';
import { spacing } from '../../../shared/theme';
import { CAMERA_ANGLES, CameraAngle } from '../../../types';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { QuestionStepLayout } from '../components/QuestionStepLayout';
import { StepHeader } from '../components/StepHeader';
import { StepProps } from './types';

const ANGLE_TITLE: Record<CameraAngle, string> = {
  front: 'Önden Fotoğraf',
  left: 'Sol Profilden Fotoğraf',
  right: 'Sağ Profilden Fotoğraf',
};

const ANGLE_INSTRUCTION: Record<CameraAngle, string> = {
  front: 'Yüzünü kameraya doğru düz tutarak çek.',
  left: 'Başını hafifçe sola çevirip çek.',
  right: 'Başını hafifçe sağa çevirip çek.',
};

/**
 * Anket akışındaki kamera adımı: kullanıcıdan sırasıyla önden, soldan ve
 * sağdan birer fotoğraf ister. Diğer sorularla aynı geri/ilerleme başlığını
 * (StepHeader, tone="dark") kullanarak akışla görsel bütünlüğü korur.
 *
 * Yerleşim kararı: bu adım, cinsiyet sorusundan hemen sonra ve kalan
 * cilt/anket sorularından önce gelir — kilitli akışın "cinsiyet seçimi ->
 * fotoğraf çekimi -> anket" sırasını korur ve en donanım-yoğun adımı
 * akışın başında bitirir.
 */
export function CameraStep({ stepNumber, totalSteps, onNext, onBack }: StepProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [angleIndex, setAngleIndex] = useState(0);
  const setPhoto = useOnboardingStore((state) => state.setPhoto);
  const angle = CAMERA_ANGLES[angleIndex];

  const handleCaptured = (uri: string) => {
    setPhoto(angle, { uri, takenAt: new Date().toISOString() });
    if (angleIndex < CAMERA_ANGLES.length - 1) {
      setAngleIndex((index) => index + 1);
    } else {
      onNext();
    }
  };

  const handleStepBack = () => {
    if (angleIndex === 0) {
      onBack();
      return;
    }
    setAngleIndex((index) => index - 1);
  };

  if (!permission) {
    return <ScreenContainer />;
  }

  if (!permission.granted) {
    return (
      <QuestionStepLayout
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        onBack={onBack}
        title="Kamera izni gerekli"
        subtitle="Sana özel rutin önerebilmemiz için önden, sağdan ve soldan birer fotoğraf çekmemiz gerekiyor."
        ctaLabel="İzin Ver"
        onCta={requestPermission}
      />
    );
  }

  return (
    <ScreenContainer style={styles.noPadding}>
      <View style={styles.overlayHeader}>
        <StepHeader
          stepNumber={stepNumber}
          totalSteps={totalSteps}
          onBack={handleStepBack}
          tone="dark"
        />
      </View>
      <CameraCapture
        key={angle}
        instructionTitle={`${ANGLE_TITLE[angle]} (${angleIndex + 1}/${CAMERA_ANGLES.length})`}
        instruction={ANGLE_INSTRUCTION[angle]}
        onCaptured={handleCaptured}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noPadding: {
    padding: 0,
  },
  overlayHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: 'rgba(38, 34, 32, 0.45)',
  },
});
