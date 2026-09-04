import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, OptionCard, ScreenContainer, Text } from '../../../shared/components';
import { spacing } from '../../../shared/theme';
import { routes } from '../../../navigation/routes';
import { Gender } from '../../../types';
import { useOnboardingStore } from '../../../store/useOnboardingStore';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'female', label: 'Kadın' },
  { value: 'male', label: 'Erkek' },
  { value: 'unspecified', label: 'Belirtmek istemiyorum' },
];

export function GenderScreen() {
  const router = useRouter();
  const storedGender = useOnboardingStore((state) => state.gender);
  const setGender = useOnboardingStore((state) => state.setGender);
  const [selected, setSelected] = useState<Gender | null>(storedGender);

  const handleContinue = () => {
    if (!selected) return;
    setGender(selected);
    router.push(routes.camera);
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text variant="heading">Cinsiyetin nedir?</Text>
        <Text variant="body" secondary style={styles.subtitle}>
          Bu bilgi, önerilerin sana daha uygun olması için kullanılır.
        </Text>

        <View style={styles.options}>
          {GENDER_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={selected === option.value}
              onPress={() => setSelected(option.value)}
            />
          ))}
        </View>
      </View>

      <Button label="Devam Et" onPress={handleContinue} disabled={!selected} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  options: {
    gap: spacing.sm,
  },
});
