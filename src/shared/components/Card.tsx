import React, { PropsWithChildren } from 'react';
import { View, ViewStyle } from 'react-native';

import { borderRadius, colors, spacing, tabColors } from '../theme';

export interface CardProps {
  style?: ViewStyle;
  /** İçeriği dolgu olmadan yerleştirmek için (örn. görsel kartları). */
  noPadding?: boolean;
  /** bkz. ScreenContainer'daki `tone` açıklaması — 'tabs' deneme pembesini kullanır. */
  tone?: 'default' | 'tabs';
}

/**
 * Tasarım sisteminin düz yüzey bileşeni. Gölge KULLANILMAZ — sadece surface
 * arka planı ve 16px köşe yarıçapı ile ayrışır. Organik/damla süsleme yok.
 */
export function Card({
  children,
  style,
  noPadding,
  tone = 'default',
}: PropsWithChildren<CardProps>) {
  const backgroundColor = tone === 'tabs' ? tabColors.surface : colors.surface;

  return (
    <View
      style={[
        {
          backgroundColor,
          borderRadius: borderRadius.card,
          padding: noPadding ? 0 : spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
