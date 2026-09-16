import type { IoniconsIconName } from '@react-native-vector-icons/ionicons';

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

/** Sadece cilt tipi/endişe sorularına ikon eklendi — diğerlerine eklemek anketi kalabalıklaştırırdı. */
export const SKIN_TYPE_OPTIONS: { value: SkinType; label: string; icon: IoniconsIconName }[] = [
  { value: 'dry', label: 'Kuru', icon: 'leaf-outline' },
  { value: 'oily', label: 'Yağlı', icon: 'water-outline' },
  { value: 'combination', label: 'Karma', icon: 'contrast-outline' },
  { value: 'normal', label: 'Normal', icon: 'checkmark-circle-outline' },
  { value: 'sensitive', label: 'Hassas', icon: 'alert-circle-outline' },
];

export const SKIN_CONCERN_OPTIONS: { value: SkinConcern; label: string; icon: IoniconsIconName }[] =
  [
    { value: 'acne', label: 'Akne / sivilce', icon: 'medkit-outline' },
    { value: 'redness', label: 'Kızarıklık', icon: 'flame-outline' },
    { value: 'darkSpots', label: 'Lekeler', icon: 'ellipse-outline' },
    { value: 'fineLines', label: 'İnce çizgiler', icon: 'remove-outline' },
    { value: 'dullness', label: 'Donukluk', icon: 'moon-outline' },
    { value: 'largePores', label: 'Büyük gözenekler', icon: 'apps-outline' },
  ];
