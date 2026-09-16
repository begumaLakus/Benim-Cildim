import { Ionicons } from '@react-native-vector-icons/ionicons';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Text } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';

/** B2B/katalog genişletilebilirliği için — şu an hiçbir yerden veri beslenmiyor, Faz 3'teki katalog bekliyor. */
export interface AffiliatedProduct {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
}

export function ProductSlot({ product }: { product: AffiliatedProduct }) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: product.imageUrl }} style={styles.thumb} />
      <View style={styles.info}>
        <Text variant="caption" secondary numberOfLines={1}>
          {product.brand}
        </Text>
        <Text variant="bodyMedium" numberOfLines={1}>
          {product.name}
        </Text>
      </View>
      <View style={styles.cta}>
        <Text variant="caption" style={styles.ctaLabel}>
          İncele
        </Text>
        <Ionicons name="chevron-forward" size={14} color={colors.accent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.background,
  },
  thumb: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  info: {
    flex: 1,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ctaLabel: {
    color: colors.accent,
  },
});
