import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Text } from '../../../shared/components';
import { borderRadius, colors, fontFamily, spacing } from '../../../shared/theme';
import { routes } from '../../../navigation/routes';
import { setStoredPhotoConsent } from '../../../services';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { ConsentCheckbox } from '../components/ConsentCheckbox';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// `colors.accent` (#8C7A6B) %16 opaklıkla — palete yeni bir renk eklemeden,
// üst gradyanın fotoğrafın sıcak tonuyla kartın zemini arasında yumuşak bir
// köprü kurmasını sağlar (bkz. tasarım sistemi, shared/theme/colors.ts).
const ACCENT_WASH = 'rgba(140, 122, 107, 0.16)';
// `colors.textPrimary` (#262220) düşük opaklıkla — fotoğrafın alt kenarını
// hafifçe karartıp başlığın okunurluğunu ve karta geçişi güçlendirir.
const IMAGE_FADE = 'rgba(38, 34, 32, 0.4)';

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
      {}
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

        {/* Fotoğrafın alt kenarını karta bağlayan yumuşak karartma — iPhone
            ana ekranındaki duvar kağıdı/ikon geçişiyle aynı derinlik hissini
            verir; ayrıca başlığın her fotoğrafta okunur kalmasına yardım eder. */}
        <LinearGradient
          colors={['transparent', IMAGE_FADE]}
          style={styles.imageFade}
          pointerEvents="none"
        />
      </ImageBackground>

      {/* Kartın zemini artık düz değil — fotoğraftan gelen sıcak tonun (accent)
          çok hafif bir izini taşıyıp kartın kendi zeminine (surface -> background)
          yumuşakça eriyor. Üçüncü/dördüncü durak aynı renk olduğu için buton
          alanı her zaman düz background üstünde, okunurluk kaybı yok. */}
      <LinearGradient
        colors={[ACCENT_WASH, colors.surface, colors.background, colors.background]}
        locations={[0, 0.18, 0.55, 1]}
        style={styles.bottomCard}
      >
        <Text variant="heading" style={styles.tagline}>
          Cildini tanı,{'\n'}sana özel rutinini keşfet.
        </Text>

        <View style={styles.bottomActions}>
          <ConsentCheckbox
            checked={consentChecked}
            onToggle={() => setConsentChecked((prev) => !prev)}
            label="Kayıt amaçlı çekilecek fotoğrafımın, KVKK kapsamında yalnızca bu öneriyi oluşturmak için kısa süreliğine işleneceğini ve sonrasında silineceğini anladım, açık rızam ile onaylıyorum."
          />
          <Button label="Hemen başla" onPress={handleContinue} disabled={!consentChecked} />
          {/* Bilerek ikinci bir dolgulu/outline buton değil — tek birincil CTA
              (Hemen başla) net kalsın diye "zaten hesabım var" burada daha
              hafif bir metin bağlantısı olarak duruyor (bkz. Button.tsx: aynı
              ekranda iki eşit ağırlıklı buton olmamalı kuralı). */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Zaten hesabım var, giriş yap"
            hitSlop={8}
            onPress={() => router.push(routes.authLogin)}
            style={styles.secondaryLink}
          >
            <Text variant="body" style={styles.secondaryLinkText}>
              Zaten hesabım var? <Text style={styles.secondaryLinkAccent}>Giriş yap</Text>
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
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
    // Tagline artık kartın içinde daha fazla yer kaplıyor (bkz. altta) — görsel
    // biraz kısaltıldı ki kart küçük ekranlarda da nefes alabilsin.
    height: SCREEN_HEIGHT * 0.54,
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
  imageFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
  bottomCard: {
    flex: 1,
    borderTopLeftRadius: borderRadius.card + 12,
    borderTopRightRadius: borderRadius.card + 12,
    marginTop: -spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    justifyContent: 'space-between',
  },
  // Eski küçük "chip" etiketin yerine — Cormorant Garamond ile, kendi başına
  // duran, editoryal bir tagline. Sadece başlıklarda kullanılan font burada
  // da bir başlık/vurgu metni olarak kullanılıyor, tıklanabilir değil.
  tagline: {
    textAlign: 'center',
    color: colors.textPrimary,
  },
  bottomActions: {
    gap: spacing.sm,
  },
  secondaryLink: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
  },
  secondaryLinkText: {
    color: colors.textSecondary,
  },
  secondaryLinkAccent: {
    color: colors.accent,
    fontFamily: fontFamily.bodyMedium,
  },
});
