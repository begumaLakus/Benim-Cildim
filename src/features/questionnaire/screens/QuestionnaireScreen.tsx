import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, OptionCard, ScreenContainer, Text } from '../../../shared/components';
import { spacing } from '../../../shared/theme';
import { routes } from '../../../navigation/routes';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { SKIN_CONCERN_OPTIONS, SKIN_TYPE_OPTIONS } from '../data/questions';
import { YesNoRow } from '../components/YesNoRow';

export function QuestionnaireScreen() {
  const router = useRouter();
  const answers = useOnboardingStore((state) => state.answers);
  const setAnswers = useOnboardingStore((state) => state.setAnswers);
  const toggleConcern = useOnboardingStore((state) => state.toggleConcern);

  const isComplete =
    answers.skinType !== null &&
    answers.usesActiveIngredients !== null &&
    answers.hasKnownSensitivities !== null;

  const handleContinue = () => {
    if (!isComplete) return;
    router.push(routes.resultsWaiting);
  };

  return (
    <ScreenContainer scrollable>
      <Text variant="heading">Birkaç soru daha</Text>
      <Text variant="body" secondary style={styles.subtitle}>
        Cevapların, sana özel içerik/aktif madde önerilerini şekillendirecek.
      </Text>

      <View style={styles.section}>
        <Text variant="bodyMedium">Cilt tipin nedir?</Text>
        <View style={styles.options}>
          {SKIN_TYPE_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={answers.skinType === option.value}
              onPress={() => setAnswers({ ...answers, skinType: option.value })}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="bodyMedium">Cilt endişelerin (birden fazla seçebilirsin)</Text>
        <View style={styles.options}>
          {SKIN_CONCERN_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={answers.concerns.includes(option.value)}
              onPress={() => toggleConcern(option.value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="bodyMedium">Şu anda aktif madde içerikli ürün kullanıyor musun?</Text>
        <YesNoRow
          value={answers.usesActiveIngredients}
          onChange={(value) => setAnswers({ ...answers, usesActiveIngredients: value })}
        />
      </View>

      <View style={styles.section}>
        <Text variant="bodyMedium">Bilinen bir cilt hassasiyetin/alerjin var mı?</Text>
        <YesNoRow
          value={answers.hasKnownSensitivities}
          onChange={(value) => setAnswers({ ...answers, hasKnownSensitivities: value })}
        />
      </View>

      <Button label="Rutini Oluştur" onPress={handleContinue} disabled={!isComplete} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  options: {
    gap: spacing.sm,
  },
});
