import { CameraType, CameraView } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button, Text } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';

const FACING: CameraType = 'front';

export interface CameraCaptureProps {
  /** Bu açı için kısa başlık, örn. "Sol Profilden Fotoğraf". */
  instructionTitle: string;
  /** Kullanıcıya pozisyon talimatı, örn. "Başını hafifçe sola çevir." */
  instruction: string;
  onCaptured: (uri: string) => void;
}

export function CameraCapture({ instructionTitle, instruction, onCaptured }: CameraCaptureProps) {
  const cameraRef = useRef<CameraView>(null);

  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

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
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetake = () => {
    setPreviewUri(null);
    setIsCameraReady(false);
  };

  const handleConfirm = () => {
    if (!previewUri) return;
    onCaptured(previewUri);
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.captionBar}>
        <Text variant="heading" onAccent>
          {instructionTitle}
        </Text>
        {!previewUri ? (
          <Text variant="body" onAccent style={styles.instructionText}>
            {instruction}
          </Text>
        ) : null}
        <View style={styles.controls}>
          {previewUri ? (
            <>
              <Button label="Tekrar Çek" variant="secondary" onPress={handleRetake} />
              <Button label="Kullan" onPress={handleConfirm} />
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewArea: {
    flex: 1,
    backgroundColor: colors.textPrimary,
  },
  captionBar: {
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.textPrimary,
  },
  instructionText: {
    opacity: 0.85,
  },
  controls: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
