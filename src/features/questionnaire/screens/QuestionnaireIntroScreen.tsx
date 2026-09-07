import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, ScreenContainer, Text } from '../../../shared/components';
import { spacing } from '../../../shared/theme';
import { routes } from '../../../navigation/routes';

/**
 * Anket akışının başlangıç ekranı: kullanıcıyı, ilerideki soruların tek
 * tek/tek ekranda geleceği konusunda hazırlar. Burada henüz soru sorulmaz —
 * "Başla" ile sihirbaz akışına (QuestionnaireFlowScreen) geçilir.
 */
export function QuestionnaireIntroScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push(routes.questionnaireFlow);
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text variant="display">Sana Özel Rutin</Text>
        <Text variant="body" secondary style={styles.subtitle}>
          Sana en uygun cilt bakım rutinini oluşturabilmemiz için birkaç soru soracağız ve kayıt
          amaçlı birkaç fotoğraf çekeceğiz. Sorular tek tek gelecek, istediğin an geri dönüp
          cevabını değiştirebilirsin.
        </Text>
      </View>
      <Button label="Başla" onPress={handleStart} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
});
