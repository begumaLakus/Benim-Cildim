import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ScreenContainer, Text } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import { routes } from '../../../navigation/routes';
import { deleteLocalPhoto, mockSubmitOnboarding } from '../../../services';
import { SubmitOnboardingRequest } from '../../../types';
import { useOnboardingStore } from '../../../store/useOnboardingStore';

/**
 * Anket + fotoğraf gönderildikten sonraki bekleme ekranı.
 *
 * GEÇİCİ: Gerçek Express backend'i hazır olana kadar `mockSubmitOnboarding`
 * kullanılıyor — backend hazır olduğunda `services/api.ts` içindeki gerçek
 * `submitOnboarding` ile değiştirilecek (aynı request/response sözleşmesi).
 */
export function WaitingScreen() {
  const router = useRouter();
  const hasStarted = useRef(false);
  const gender = useOnboardingStore((state) => state.gender);
  const answers = useOnboardingStore((state) => state.answers);
  const photoConsentGiven = useOnboardingStore((state) => state.photoConsentGiven);
  const photo = useOnboardingStore((state) => state.photo);
  const setRecommendation = useOnboardingStore((state) => state.setRecommendation);
  const setPhoto = useOnboardingStore((state) => state.setPhoto);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const run = async () => {
      const request: SubmitOnboardingRequest = {
        gender: gender ?? 'unspecified',
        answers,
        photoConsentGiven,
        // Faz 1'de fotoğraf backend'e henüz yüklenmiyor; Faz 2'de gerçek
        // yükleme akışı eklendiğinde burası backend referans id'sini taşıyacak.
        photoReferenceId: null,
      };

      const response = await mockSubmitOnboarding(request);
      setRecommendation(response);

      // KVKK: fotoğraf işlendikten hemen sonra yerel kopyayı sil.
      if (photo?.uri) {
        await deleteLocalPhoto(photo.uri);
        setPhoto(null);
      }

      router.replace(routes.results);
    };

    run();
  }, [answers, gender, photo, photoConsentGiven, router, setPhoto, setRecommendation]);

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text variant="heading" style={styles.title}>
          Rutinin hazırlanıyor
        </Text>
        <Text variant="body" secondary style={styles.subtitle}>
          Cevaplarına göre sana özel bir sabah/akşam rutini oluşturuyoruz.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  title: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
});
