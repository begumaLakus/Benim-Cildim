import { AgeRange, Gender, SkinConcern, SkinType } from '../../../types';

export const AGE_RANGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: 'under18', label: '18 yaş altı' },
  { value: '18-24', label: '18-24' },
  { value: '25-34', label: '25-34' },
  { value: '35-44', label: '35-44' },
  { value: '45-54', label: '45-54' },
  { value: '55plus', label: '55 ve üzeri' },
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'female', label: 'Kadın' },
  { value: 'male', label: 'Erkek' },
  { value: 'unspecified', label: 'Belirtmek istemiyorum' },
];

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
