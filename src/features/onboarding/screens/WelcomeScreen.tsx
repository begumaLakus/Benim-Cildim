import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Text } from '../../../shared/components';
import { borderRadius, colors, spacing } from '../../../shared/theme';
import { routes } from '../../../navigation/routes';
import { setStoredPhotoConsent } from '../../../services';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { ConsentCheckbox } from '../components/ConsentCheckbox';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Onboarding'in ilk ekranı — Figma tasarımına göre yeniden yapıldı: üstte
 * tam genişlik görsel + marka adı, altta yuvarlatılmış "bottom sheet" kart
 * içinde slogan, KVKK açık rıza onayı ve CTA butonları.
 *
 * Figma tasarımından bilinçli sapma: pasif "Kullanım Şartları..." metni
 * gerçek, tıklanabilir bir onay kutusuna (ConsentCheckbox) dönüştürüldü —
 * KVKK gereği fotoğraf çekimine geçmeden önce açık rıza zorunlu. Görsel
 * ağırlığını dengelemek için metin küçük punto (caption) ve butonun hemen
 * üzerinde, tek blok halinde gruplandı (önceki sürümde ayrı bir orta blok
 * olarak `space-between` ile dağıtılıyordu, bu da ekranın yarısını
 * kaplıyormuş gibi bir görünüme yol açıyordu).
 *
 * "Zaten hesabım var" butonu geri eklendi: dünkü uygulama haritası kararına
 * göre (bkz. ADR-009 taslağı) hesabı olan kullanıcının anketi baştan
 * doldurmadan doğrudan giriş ekranına geçebilmesi gerekiyor. Giriş ekranı
 * şu an yer tutucu (`features/auth/screens/LoginScreen`) — gerçek form ve
 * backend entegrasyonu ADR-009 onaylanınca eklenecek.
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
    <View style={styles.container}>
      {/* NOT: Görsel projede yok — assets/images/manken1.jpg olarak manuel eklenmeli,
          aksi halde Metro bu dosyayı bulamadığı için build hata verir. */}
      <ImageBackground
        source={require('../../../../assets/images/manken1.jpg')}
        style={styles.imageHeader}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeAreaHeader} edges={['top', 'left', 'right']}>
          <Text variant="heading" onAccent style={styles.brandTitle}>
            benim cildim
          </Text>
        </SafeAreaView>
      </ImageBackground>

      <View style={styles.bottomCard}>
        <View style={styles.taglineContainer}>
          <Text variant="caption" style={styles.taglineText}>
            Cildini tanı, sana özel rutinini keşfet.
          </Text>
        </View>

        <View style={styles.bottomActions}>
          <ConsentCheckbox
            checked={consentChecked}
            onToggle={() => setConsentChecked((prev) => !prev)}
            label="Kayıt amaçlı çekilecek fotoğrafımın, KVKK kapsamında yalnızca bu öneriyi oluşturmak için kısa süreliğine işleneceğini ve sonrasında silineceğini anladım, açık rızam ile onaylıyorum."
          />
          <Button label="Hemen başla" onPress={handleContinue} disabled={!consentChecked} />
          <Button
            label="Zaten hesabım var"
            variant="secondary"
            onPress={() => router.push(routes.authLogin)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageHeader: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.58,
    justifyContent: 'flex-start',
  },
  safeAreaHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  brandTitle: {
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.card + 12,
    borderTopRightRadius: borderRadius.card + 12,
    marginTop: -spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    justifyContent: 'space-between',
  },
  taglineContainer: {
    alignSelf: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.button + 4,
  },
  taglineText: {
    textAlign: 'center',
  },
  bottomActions: {
    gap: spacing.sm,
  },
});
