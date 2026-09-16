import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Text } from './Text';
import { colors, spacing, tabColors } from '../theme';

const WASH_COUNT = 20;
const DETAIL_COUNT = 64;
const POP_REVEAL_THRESHOLD = 20;
const MIN_VISIBLE_MS = 2200;
const AUTO_REVEAL_DELAY_MS = 1600;
const STATUS_INTERVAL_MS = 1400;
const WIPE_DURATION_MS = 620;
const HINT_DELAY_MS = 1500;

/** `colors.background`'ın (#F9F8F6) düşük alfalı hâli — parlaklık/rim için
 * yeni bir renk DEĞİL, mevcut tonun saydam versiyonu. */
const SHEEN_STRONG = 'rgba(249, 248, 246, 0.75)';
const SHEEN_SOFT = 'rgba(249, 248, 246, 0.45)';

interface BubbleSpec {
  id: number;
  left: number;
  top: number;
  size: number;
  tone: 'cream' | 'pink';
  baseOpacity: number;
  entranceDelay: number;
  /** Sürekli "nefes alma" döngüsünün en düşük noktası (1 = tam görünür). */
  breatheFloor: number;
  /** Bir nefes alma yarım-döngüsünün süresi (ms). */
  breathePeriod: number;
  /** Dokunulabilir mi (üst/detay katman) yoksa sadece görsel mi (dip/wash). */
  interactive: boolean;
  /** Küçük parlaklık noktası + ince parlak kenar çizgisi çizilsin mi. */
  highlight: boolean;
}

function createWashSpecs(startId: number): BubbleSpec[] {
  return Array.from({ length: WASH_COUNT }, (_, index) => {
    const isPink = index % 6 === 0;
    return {
      id: startId + index,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 90 + Math.random() * 130,
      tone: isPink ? 'pink' : 'cream',
      baseOpacity: isPink ? 0.22 + Math.random() * 0.12 : 0.22 + Math.random() * 0.2,
      entranceDelay: Math.random() * 260,
      breatheFloor: 0.55 + Math.random() * 0.2,
      breathePeriod: 2200 + Math.random() * 1800,
      interactive: false,
      highlight: false,
    };
  });
}

function createDetailSpecs(startId: number): BubbleSpec[] {
  return Array.from({ length: DETAIL_COUNT }, (_, index) => {
    const isPink = index % 5 === 0;
    return {
      id: startId + index,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 12 + Math.random() * 34,
      tone: isPink ? 'pink' : 'cream',
      baseOpacity: isPink ? 0.6 + Math.random() * 0.3 : 0.5 + Math.random() * 0.35,
      entranceDelay: Math.random() * 420,
      breatheFloor: 0.3 + Math.random() * 0.25,
      breathePeriod: 850 + Math.random() * 950,
      interactive: true,
      highlight: true,
    };
  });
}

function createBubbles(): BubbleSpec[] {
  const wash = createWashSpecs(0);
  const detail = createDetailSpecs(wash.length);
  return [...wash, ...detail];
}

interface BubbleProps {
  spec: BubbleSpec;
  popped: boolean;
  reduceMotion: boolean;
  onPop: () => void;
}

/** Tek bir köpük parçası. "presence": 0→1 belirme, sonra breatheFloor↔1 arası sonsuz "nefes alma". */
function Bubble({ spec, popped, reduceMotion, onPop }: BubbleProps) {
  const presence = useSharedValue(reduceMotion ? 1 : 0);
  const pop = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    presence.value = withDelay(
      spec.entranceDelay,
      withSequence(
        withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) }),
        withRepeat(
          withTiming(spec.breatheFloor, {
            duration: spec.breathePeriod,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true,
        ),
      ),
    );
    // Yalnızca ilk mount'ta çalışsın — spec/presence referansları stabil.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  useEffect(() => {
    if (popped) {
      pop.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popped]);

  const animatedStyle = useAnimatedStyle(() => {
    const presenceScale = interpolate(presence.value, [0, 1], [0.4, 1]);
    const presenceOpacity = interpolate(presence.value, [0, 1], [0, spec.baseOpacity]);
    const popScale = interpolate(pop.value, [0, 1], [1, 1.5]);
    const popOpacity = interpolate(pop.value, [0, 1], [1, 0]);

    return {
      opacity: presenceOpacity * popOpacity,
      transform: [{ scale: presenceScale * popScale }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          left: `${spec.left}%`,
          top: `${spec.top}%`,
          width: spec.size,
          height: spec.size,
          borderRadius: spec.size / 2,
          backgroundColor: spec.tone === 'pink' ? tabColors.highlight : colors.surface,
          borderWidth: spec.highlight ? 1 : 0,
          borderColor: SHEEN_SOFT,
        },
        animatedStyle,
      ]}
    >
      {spec.highlight ? (
        <View
          style={[
            styles.sheenDot,
            {
              width: spec.size * 0.34,
              height: spec.size * 0.34,
              borderRadius: (spec.size * 0.34) / 2,
              left: spec.size * 0.16,
              top: spec.size * 0.14,
            },
          ]}
        />
      ) : null}
      {spec.interactive && !popped ? (
        <Pressable style={StyleSheet.absoluteFill} onPress={onPop} />
      ) : null}
    </Animated.View>
  );
}

export interface AnalyzingOverlayProps {
  /** Arkadaki gerçek işlem (backend/mock çağrısı) tamamlandı mı? */
  ready: boolean;
  /** Dönen durum yazıları — mekanizmayı olduğu gibi anlat, "yapay zeka" gibi yanlış bir iddiada bulunma. */
  statusMessages: string[];
  /** Kapanış (köpüğün kayıp gitmesi) tamamlanınca bir kez çağrılır. */
  onFinished: () => void;
}

/**
 * Anket bitip sonuç gösterilmeden önceki geçiş ekranı ("Analiz Ekranı").
 *
 * Hibrit etkileşim: baloncuklar kendiliğinden dolar, kullanıcı dokunup
 * patlatarak da hızlandırabilir; veri hazır olur olmaz otomatik açılır.
 * "Hareketi Azalt" açıksa animasyon atlanır, sade bir gösterge gösterilir.
 *
 * Kendi başına bir ekran değil — çağıran taraf asıl sonuç ekranını bunun
 * ALTINDA zaten render eder, bu sadece üstündeki köpüğü kaldırır.
 */
export function AnalyzingOverlay({ ready, statusMessages, onFinished }: AnalyzingOverlayProps) {
  const { height: screenHeight } = useWindowDimensions();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [reduceMotionChecked, setReduceMotionChecked] = useState(false);
  const [popped, setPopped] = useState<Record<number, boolean>>({});
  const [statusIndex, setStatusIndex] = useState(0);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const revealTriggered = useRef(false);
  const sheetTranslateY = useSharedValue(0);
  const bubbles = useMemo(() => createBubbles(), []);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) {
        setReduceMotion(enabled);
        setReduceMotionChecked(true);
      }
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), HINT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((index) => (index + 1) % statusMessages.length);
    }, STATUS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [statusMessages.length]);

  const canReveal = ready && minTimeElapsed;

  const triggerReveal = useCallback(() => {
    if (revealTriggered.current) return;
    revealTriggered.current = true;

    if (reduceMotion) {
      onFinished();
      return;
    }

    // Reanimated'ın "shared value" mutasyonu kasıtlı ve resmi API'nin
    // kendisi — React Compiler'ın hook-değişmezliği kuralı bunu tanımıyor.
    // eslint-disable-next-line react-hooks/immutability
    sheetTranslateY.value = withTiming(
      -screenHeight,
      { duration: WIPE_DURATION_MS, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(onFinished)();
      },
    );
  }, [onFinished, reduceMotion, screenHeight, sheetTranslateY]);

  useEffect(() => {
    if (!canReveal) return;
    const timer = setTimeout(triggerReveal, AUTO_REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [canReveal, triggerReveal]);

  const poppedCount = Object.keys(popped).length;

  useEffect(() => {
    if (canReveal && poppedCount >= POP_REVEAL_THRESHOLD) {
      triggerReveal();
    }
  }, [canReveal, poppedCount, triggerReveal]);

  const handlePop = useCallback((id: number) => {
    setPopped((current) => (current[id] ? current : { ...current, [id]: true }));
  }, []);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  // Erişilebilirlik tercihi netleşmeden hiçbir şey çizmiyoruz — aksi halde
  // köpük bir an görünüp "hareketi azalt" açık kullanıcılarda hemen kaybolur.
  if (!reduceMotionChecked) {
    return <View style={styles.sheet} />;
  }

  if (reduceMotion) {
    return (
      <View style={styles.sheet}>
        <View style={styles.captionWrap}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text variant="heading" style={styles.title}>
            Rutinin hazırlanıyor
          </Text>
          <Text variant="body" secondary style={styles.subtitle}>
            {statusMessages[statusIndex]}…
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.sheet, sheetStyle]}>
      {bubbles.map((bubble) => (
        <Bubble
          key={bubble.id}
          spec={bubble}
          popped={!!popped[bubble.id]}
          reduceMotion={reduceMotion}
          onPop={() => handlePop(bubble.id)}
        />
      ))}
      <View style={styles.captionWrap} pointerEvents="none">
        <Text variant="heading" style={styles.title}>
          Rutinin hazırlanıyor
        </Text>
        <Text variant="body" secondary style={styles.subtitle}>
          {statusMessages[statusIndex]}…
        </Text>
        {showHint ? (
          <Text variant="caption" style={styles.hint}>
            Temizlemek için baloncuklara dokun
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
  },
  sheenDot: {
    position: 'absolute',
    backgroundColor: SHEEN_STRONG,
  },
  captionWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  hint: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
