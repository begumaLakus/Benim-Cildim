import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ResultsScreen } from './ResultsScreen';
import { AnalyzingOverlay } from '../../../shared/components';
import { deleteLocalPhoto, mockSubmitOnboarding } from '../../../services';
import { routes } from '../../../navigation/routes';
import { CAMERA_ANGLES, SubmitOnboardingRequest } from '../../../types';
import { useOnboardingStore } from '../../../store/useOnboardingStore';

/** Dönen durum mesajları — mekanizmayı olduğu gibi anlatır, "yapay zeka" gibi yanlış bir iddiada bulunmaz. */
const STATUS_MESSAGES = [
  'Fotoğrafların değerlendiriliyor',
  'Cilt tipin eşleştiriliyor',
  'Aktif madde uyumu kontrol ediliyor',
  'Sana özel rutin oluşturuluyor',
];

/**
 * Anket + fotoğraflar gönderildikten sonraki geçiş ekranı ("Analiz Ekranı").
 *
 * `ResultsScreen`, rutin hazır olur olmaz bu bileşenin İÇİNDE render edilir
 * (henüz görünmez — `AnalyzingOverlay` onu örtüyor); köpük kalkınca zaten
 * hazır olan içerik görünür, ancak ONDAN SONRA route değişir. Böylece köpük
 * açılırken görünenle bir sonraki route'ta görünen birebir aynı olur.
 *
 * GEÇİCİ: gerçek backend hazır olana kadar `mockSubmitOnboarding` kullanılıyor.
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
  const [dataReady, setDataReady] = useState(false);

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

      setDataReady(true);
    };

    run();
  }, [answers, gender, photos, photoConsentGiven, resetPhotos, setRecommendation]);

  const handleOverlayFinished = useCallback(() => {
    router.replace(routes.results);
  }, [router]);

  return (
    <View style={styles.root}>
      {dataReady ? <ResultsScreen /> : null}
      <AnalyzingOverlay
        ready={dataReady}
        statusMessages={STATUS_MESSAGES}
        onFinished={handleOverlayFinished}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
