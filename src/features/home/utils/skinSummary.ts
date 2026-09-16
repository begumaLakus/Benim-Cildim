import { SkinConcern, SkinSummary, SkinType } from '../../../types';

/** Türkçe etiketleme bilerek burada, RN tarafında yapılıyor — backend sadece ham veriyi taşıyor. */
const SKIN_TYPE_LABELS: Record<SkinType, string> = {
  dry: 'Kuru Cilt',
  oily: 'Yağlı Cilt',
  combination: 'Karma Cilt',
  normal: 'Normal Cilt',
  sensitive: 'Hassas Cilt',
};

const SKIN_CONCERN_LABELS: Record<SkinConcern, string> = {
  acne: 'Akne',
  redness: 'Kızarıklık',
  darkSpots: 'Leke',
  fineLines: 'İnce Çizgiler',
  dullness: 'Donukluk',
  largePores: 'Gözenek',
};

/** En fazla kaç endişe etikette gösterilsin — daha fazlası etiketi çok uzatır. */
const MAX_CONCERNS_SHOWN = 2;

/** Rutinim başlığındaki kompakt cilt etiketini üretir (örn. "Karma Cilt • Kızarıklık"). Cilt tipi yoksa `null` döner. */
export function formatSkinSummary(summary: SkinSummary | null | undefined): string | null {
  if (!summary?.skinType) return null;

  const skinTypeLabel = SKIN_TYPE_LABELS[summary.skinType];
  const concernLabels = summary.concerns
    .slice(0, MAX_CONCERNS_SHOWN)
    .map((concern) => SKIN_CONCERN_LABELS[concern]);

  if (concernLabels.length === 0) return skinTypeLabel;

  return `${skinTypeLabel} • ${concernLabels.join(', ')}`;
}
