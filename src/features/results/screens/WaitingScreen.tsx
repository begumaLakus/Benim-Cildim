import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ScreenContainer, Text } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import { routes } from '../../../navigation/routes';
import { deleteLocalPhoto, mockSubmitOnboarding } from '../../../services';
import { CAMERA_ANGLES, SubmitOnboardingRequest } from '../../../types';
import { useOnboardingStore } from '../../../store/useOnboardingStore';

/**
 * Rutin dinamik olarak "belirleniyor" hissi vermesi için sırayla değişen
 * durum mesajları — gerçek ilerlemeyi temsil etmez (Faz 1'de tek bir mock
 * çağrısı var), yalnızca sonucun adım adım oluşturulduğu izlenimini verir.
 */
const STATUS_MESSAGES = [
  'Fotoğrafların değerlendiriliyor',
  'Cilt tipin analiz ediliyor',
  'Cevapların eşleştiriliyor',
  'Sana özel rutin oluşturuluyor',
];

const STATUS_INTERVAL_MS = 1400;

/**
 * Anket + fotoğraflar gönderildikten sonraki bekleme ekranı.
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
  const photos = useOnboardingStore((state) => state.photos);
  const setRecommendation = useOnboardingStore((state) => state.setRecommendation);
  const resetPhotos = useOnboardingStore((state) => state.resetPhotos);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((index) => (index + 1) % STATUS_MESSAGES.length);
    }, STATUS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const run = async () => {
      const request: SubmitOnboardingRequest = {
        gender: gender ?? 'unspecified',
        answers,
        photoConsentGiven,
        // Faz 1'de fotoğraflar backend'e henüz yüklenmiyor; Faz 2'de gerçek
        // yükleme akışı eklendiğinde burası backend referans id'lerini
        // açı bazında taşıyacak.
        photoReferenceIds: null,
      };

      const response = await mockSubmitOnboarding(request);
      setRecommendation(response);

      // KVKK: fotoğraflar işlendikten hemen sonra yerel kopyaları sil.
      await Promise.all(
        CAMERA_ANGLES.map((angle) => {
          const photo = photos[angle];
          return photo ? deleteLocalPhoto(photo.uri) : Promise.resolve();
        }),
      );
      resetPhotos();

      router.replace(routes.results);
    };

    run();
  }, [answers, gender, photos, photoConsentGiven, resetPhotos, router, setRecommendation]);

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text variant="heading" style={styles.title}>
          Rutinin hazırlanıyor
        </Text>
        <Text variant="body" secondary style={styles.subtitle}>
          {STATUS_MESSAGES[statusIndex]}…
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
