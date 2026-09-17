import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { RoutineCard } from '../components/RoutineCard';
import { RoutineProgressBar } from '../components/RoutineProgressBar';
import { getLocalDateKey } from '../utils/date';
import { formatRoutineReason } from '../utils/routineReason';
import { formatSkinSummary } from '../utils/skinSummary';
import { Card, ScreenContainer, SegmentedControl, Text } from '../../../shared/components';
import { borderRadius, colors, spacing, tabColors } from '../../../shared/theme';
import {
  ApiRequestError,
  getLatestRoutineHistory,
  getRoutineProgress,
  toggleRoutineProgress,
} from '../../../services';
import { useAuthStore } from '../../../store/useAuthStore';
import { useOnboardingStore } from '../../../store/useOnboardingStore';

type RoutineSlot = 'morning' | 'evening';

const SLOT_OPTIONS: { value: RoutineSlot; label: string }[] = [
  { value: 'morning', label: 'Sabah' },
  { value: 'evening', label: 'Akşam' },
];

// Kutlama mesajında kullanılan Türkçe etiket — SLOT_OPTIONS'taki label'lar
// büyük harfle başlıyor ("Sabah"), cümle içinde küçük harfle daha doğal
// duruyor ("Bugünkü sabah rutinini tamamladın").
const SLOT_CELEBRATION_LABEL: Record<RoutineSlot, string> = {
  morning: 'sabah',
  evening: 'akşam',
};

export function HomeScreen() {
  const token = useAuthStore((state) => state.token);
  const recommendation = useOnboardingStore((state) => state.recommendation);
  const setRecommendation = useOnboardingStore((state) => state.setRecommendation);
  const markRecommendationSynced = useOnboardingStore((state) => state.markRecommendationSynced);
  // Lazy init: token yoksa `isLoading` hiç true'dan geçmeden false başlar —
  // bu sayede effect içinde senkron bir setState çağrısına gerek kalmıyor.
  const [isLoading, setIsLoading] = useState(() => Boolean(token));
  const [loadError, setLoadError] = useState<string | undefined>();
  // Üst bardaki "Tekrar dene" isteği sürerken sadece o küçük alanda spinner
  // gösterir — `isLoading` gibi tüm ekranı kaplayan bir yükleniyor durumuna
  // düşürmez, çünkü `recommendation` zaten ekranda gösterilmeye devam eder.
  const [isRetrying, setIsRetrying] = useState(false);
  const [activeSlot, setActiveSlot] = useState<RoutineSlot>('morning');
  const [completedStepIds, setCompletedStepIds] = useState<Set<string>>(new Set());
  const [isTogglingStepId, setIsTogglingStepId] = useState<string | null>(null);

  const todayKey = useMemo(() => getLocalDateKey(), []);

  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadLatestRoutine = useCallback(
    async (mode: 'initial' | 'retry') => {
      if (!token) {
        return;
      }

      try {
        const latest = await getLatestRoutineHistory(token);
        if (!isMountedRef.current) return;

        if (latest) {
          setRecommendation(latest);
          // Bu kayit zaten backend'de var (az once oradan cektik) — tekrar
          // POST edilmesin diye senkron olarak isaretle (bkz.
          // useAuthStore.ts -> syncGuestRoutineIfPresent).
          markRecommendationSynced();
        }

        // Rutinle birlikte bugünün ilerlemesini de çek — ayrı bir yükleme
        // göstergesi açmaya değmeyecek kadar hızlı bir çağrı, bu yüzden
        // `isLoading` bunu beklemiyor.
        const progress = await getRoutineProgress(todayKey, token);
        if (!isMountedRef.current) return;
        if (progress) {
          setCompletedStepIds(new Set(progress.completedStepIds));
        }
      } catch (error) {
        if (!isMountedRef.current) return;
        setLoadError(
          error instanceof ApiRequestError ? error.message : 'Rutin yüklenirken bir sorun oluştu.',
        );
      } finally {
        if (!isMountedRef.current) return;
        if (mode === 'initial') {
          setIsLoading(false);
        } else {
          setIsRetrying(false);
        }
      }
    },
    [token, todayKey, setRecommendation, markRecommendationSynced],
  );

  useEffect(() => {
    // `loadLatestRoutine` ilk `await`e kadar hicbir state guncellemiyor (bkz.
    // yukarisi); ESLint bunu derin analiz etmeden isaretliyor, bilerek kapatildi.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLatestRoutine('initial');
  }, [loadLatestRoutine]);

  const handleRetryLoad = useCallback(() => {
    // Bu setState'ler bir tıklama olayindan (effect degil) cagrildigi icin sorun yok.
    setIsRetrying(true);
    setLoadError(undefined);
    loadLatestRoutine('retry');
  }, [loadLatestRoutine]);

  const skinTag = useMemo(() => formatSkinSummary(recommendation?.skinSummary), [recommendation]);

  async function toggleStepCompleted(stepId: string) {
    if (!token || isTogglingStepId) return;

    setIsTogglingStepId(stepId);
    try {
      // İyimser güncelleme yapılmıyor — checkbox, backend'in döndürdüğü
      // GÜNCEL TAM listeyle güncelleniyor, böylece iki hızlı dokunuşta
      // (çift toggle) ya da bir istek başarısız olduğunda arayüz asla
      // sunucudaki gerçek durumdan sapmıyor.
      const updated = await toggleRoutineProgress({ date: todayKey, stepId }, token);
      setCompletedStepIds(new Set(updated.completedStepIds));
    } catch (error) {
      setLoadError(
        error instanceof ApiRequestError
          ? error.message
          : 'İşaretleme kaydedilirken bir sorun oluştu.',
      );
    } finally {
      setIsTogglingStepId(null);
    }
  }

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </ScreenContainer>
    );
  }

  if (!recommendation) {
    return (
      <ScreenContainer>
        <View style={styles.emptyState}>
          <Text variant="heading">Henüz bir rutinin yok</Text>
          <Text variant="body" secondary style={styles.emptyNote}>
            {loadError ?? 'Anketi tamamlayarak sana özel bir cilt bakım rutini oluşturabilirsin.'}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const steps = recommendation.routine[activeSlot];
  const completedInSlot = steps.filter((step) => completedStepIds.has(step.id)).length;

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text variant="heading">Bugünkü Rutinin</Text>
        {skinTag ? (
          <View style={styles.skinTag}>
            <Text variant="caption" style={styles.skinTagLabel}>
              {skinTag}
            </Text>
          </View>
        ) : null}
      </View>

      {loadError ? (
        <Card style={styles.errorBanner}>
          <Text variant="caption" style={styles.errorBannerLabel}>
            {loadError}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tekrar dene"
            accessibilityState={{ disabled: isRetrying }}
            disabled={isRetrying}
            hitSlop={8}
            onPress={handleRetryLoad}
            style={styles.retryButton}
          >
            {isRetrying ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Text variant="bodyMedium" style={styles.retryLabel}>
                Tekrar dene
              </Text>
            )}
          </Pressable>
        </Card>
      ) : null}

      <SegmentedControl options={SLOT_OPTIONS} value={activeSlot} onChange={setActiveSlot} />

      <RoutineProgressBar
        completed={completedInSlot}
        total={steps.length}
        slotLabel={SLOT_CELEBRATION_LABEL[activeSlot]}
      />

      <View style={styles.list}>
        {steps.map((step) => (
          <RoutineCard
            key={step.id}
            step={step}
            completed={completedStepIds.has(step.id)}
            onToggleComplete={() => toggleStepCompleted(step.id)}
            isToggling={isTogglingStepId === step.id}
            reason={formatRoutineReason(step.productCategory, recommendation.skinSummary)}
            // Faz 3'teki güzellik merkezi kataloğu bekliyor (bkz. ADR-015) —
            // gerçek veri kaynağı olmadığı için bilerek her zaman `undefined`;
            // dolduğunda kart kendiliğinden ürün satırını açacak.
            affiliatedProduct={undefined}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  skinTag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: tabColors.highlight,
    borderRadius: borderRadius.button,
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
  },
  skinTagLabel: {
    color: colors.textPrimary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  errorBannerLabel: {
    flex: 1,
    color: colors.error,
  },
  retryButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  retryLabel: {
    color: colors.accent,
  },
  list: {
    marginTop: spacing.sm,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emptyNote: {
    marginTop: spacing.xs,
  },
});
