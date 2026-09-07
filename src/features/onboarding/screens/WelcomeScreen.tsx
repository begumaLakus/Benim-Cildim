import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, ScreenContainer, Text } from '../../../shared/components';
import { spacing } from '../../../shared/theme';
import { routes } from '../../../navigation/routes';
import { setStoredPhotoConsent } from '../../../services';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { ConsentCheckbox } from '../components/ConsentCheckbox';

/**
 * Onboarding'in ilk ekranı: karşılama metni + KVKK açık rıza onayı.
 * Fotoğraf çekimi adımına (features/camera) geçilebilmesi için bu onayın
 * verilmiş olması zorunludur.
 */
export function WelcomeScreen() {
  const router = useRouter();
  const [consentChecked, setConsentChecked] = useState(false);
  const setPhotoConsentGiven = useOnboardingStore((state) => state.setPhotoConsentGiven);

  const handleContinue = async () => {
    setPhotoConsentGiven(consentChecked);
    await setStoredPhotoConsent(consentChecked);
    router.push(routes.questionnaireIntro);
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text variant="display">Benim Cildim</Text>
        <Text variant="body" secondary style={styles.subtitle}>
          Fotoğrafın ve birkaç sorunun cevabıyla, sana özel içerik/aktif madde bazlı bir cilt bakım
          rutini hazırlıyoruz.
        </Text>
      </View>

      <View style={styles.consentSection}>
        <ConsentCheckbox
          checked={consentChecked}
          onToggle={() => setConsentChecked((prev) => !prev)}
          label="Kayıt amaçlı çekilecek fotoğrafımın, KVKK kapsamında yalnızca bu öneriyi
oluşturmak için kısa süreliğine işleneceğini ve sonrasında silineceğini
anladım, açık rızam ile onaylıyorum."
        />
      </View>

      <Button label="Devam Et" onPress={handleContinue} disabled={!consentChecked} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  consentSection: {
    marginBottom: spacing.lg,
  },
});
