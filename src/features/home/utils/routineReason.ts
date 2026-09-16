import { SkinConcern, SkinSummary, SkinType } from '../../../types';

const SKIN_TYPE_ADJECTIVE: Record<SkinType, string> = {
  dry: 'Kuru',
  oily: 'Yağlı',
  combination: 'Karma',
  normal: 'Normal',
  sensitive: 'Hassas',
};

const CONCERN_NOUN: Record<SkinConcern, string> = {
  acne: 'akne',
  redness: 'kızarıklık',
  darkSpots: 'leke',
  fineLines: 'ince çizgi',
  dullness: 'donukluk',
  largePores: 'gözenek',
};

export function formatRoutineReason(
  productCategory: string,
  skinSummary: SkinSummary | null | undefined,
): string | null {
  if (!skinSummary?.skinType) return null;

  const adjective = SKIN_TYPE_ADJECTIVE[skinSummary.skinType];
  const primaryConcern = skinSummary.concerns[0];

  switch (productCategory) {
    case 'Temizleyici':
      return `${adjective} cildini kurutmadan günlük kiri temizler.`;
    case 'Serum':
      return primaryConcern
        ? `${adjective} cildinde ${CONCERN_NOUN[primaryConcern]} görünümünü azaltmaya yardımcı olur.`
        : `${adjective} cildine yönelik hedefli bir bakım sağlar.`;
    case 'Güneş koruyucu':
      return `${adjective} cildini gün boyu geniş spektrumlu korur.`;
    case 'Nemlendirici':
      return `${adjective} cildinin nem bariyerini güçlendirir.`;
    default:
      return null;
  }
}
