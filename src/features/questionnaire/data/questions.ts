import { SkinConcern, SkinType } from '../../../types';

export const SKIN_TYPE_OPTIONS: { value: SkinType; label: string }[] = [
  { value: 'dry', label: 'Kuru' },
  { value: 'oily', label: 'Yağlı' },
  { value: 'combination', label: 'Karma' },
  { value: 'normal', label: 'Normal' },
  { value: 'sensitive', label: 'Hassas' },
];

export const SKIN_CONCERN_OPTIONS: { value: SkinConcern; label: string }[] = [
  { value: 'acne', label: 'Akne / sivilce' },
  { value: 'redness', label: 'Kızarıklık' },
  { value: 'darkSpots', label: 'Lekeler' },
  { value: 'fineLines', label: 'İnce çizgiler' },
  { value: 'dullness', label: 'Donukluk' },
  { value: 'largePores', label: 'Büyük gözenekler' },
];
