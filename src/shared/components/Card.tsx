import React, { PropsWithChildren } from 'react';
import { View, ViewStyle } from 'react-native';

import { borderRadius, colors, spacing } from '../theme';

export interface CardProps {
  style?: ViewStyle;
  /** İçeriği dolgu olmadan yerleştirmek için (örn. görsel kartları). */
  noPadding?: boolean;
}

/**
 * Tasarım sisteminin düz yüzey bileşeni. Gölge KULLANILMAZ — sadece surface
 * arka planı ve 16px köşe yarıçapı ile ayrışır. Organik/damla süsleme yok.
 */
export function Card({ children, style, noPadding }: PropsWithChildren<CardProps>) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
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
