import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button, ScreenContainer, Text } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import { routes } from '../../../navigation/routes';
import { useOnboardingStore } from '../../../store/useOnboardingStore';

const FACING: CameraType = 'front';

/**
 * Kayıt amaçlı fotoğraf çekimi ekranı. `expo-camera` kullanılır — Faz 2'de
 * MediaPipe Face Mesh hizalaması eklendiğinde `react-native-vision-camera`ya
 * geçiş ayrı bir kararla yapılacak, bu ekran o zaman değişecek.
 */
export function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  // Native kamera oturumu `onCameraReady` tetiklenene kadar hazır değildir;
  // bundan önce takePictureAsync çağırmak CameraNotReadyException fırlatır.
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const setPhoto = useOnboardingStore((state) => state.setPhoto);

  const handleCapture = async () => {
    if (!isCameraReady || isCapturing) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        setPreviewUri(photo.uri);
      }
    } catch {
      // Kamera oturumu tam hazır olmadan veya kısa süreli bir donanım
      // hatasında burada sessizce yutuyoruz — kullanıcı butona tekrar
      // basabilir; akışı bir hata ekranıyla kesmeye gerek yok.
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetake = () => {
    setPreviewUri(null);
    // CameraView yeniden mount olacağı için onCameraReady tekrar tetiklenene
    // kadar hazır sayılmamalı.
    setIsCameraReady(false);
  };

  const handleConfirm = () => {
    if (!previewUri) return;
    setPhoto({ uri: previewUri, takenAt: new Date().toISOString() });
    router.push(routes.questionnaire);
  };

  if (!permission) {
    return <ScreenContainer />;
  }

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <View style={styles.permissionContent}>
          <Text variant="heading">Kamera izni gerekli</Text>
          <Text variant="body" secondary style={styles.permissionText}>
            Sana özel rutin önerebilmemiz için kayıt amaçlı bir fotoğraf çekmemiz gerekiyor.
          </Text>
          <Button label="İzin Ver" onPress={requestPermission} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.noPadding}>
      <View style={styles.previewArea}>
        {previewUri ? (
          <Image source={{ uri: previewUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={FACING}
            onCameraReady={() => setIsCameraReady(true)}
          />
        )}
      </View>

      <View style={styles.controls}>
        {previewUri ? (
          <>
            <Button label="Tekrar Çek" variant="secondary" onPress={handleRetake} />
            <Button label="Devam Et" onPress={handleConfirm} />
          </>
        ) : (
          <Button
            label="Fotoğraf Çek"
            onPress={handleCapture}
            disabled={!isCameraReady}
            loading={isCapturing}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noPadding: {
    padding: 0,
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  permissionText: {
    marginBottom: spacing.sm,
  },
  previewArea: {
    flex: 1,
    backgroundColor: colors.textPrimary,
  },
  controls: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
});
