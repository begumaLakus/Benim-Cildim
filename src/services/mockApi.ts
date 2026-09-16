import { RoutineRecommendationResponse, SubmitOnboardingRequest } from '../types';

/** GEÇİCİ: backend hazır olana kadar UI'ı test edebilmek için sahte gecikmeli yanıt üretir — `api.ts` ile aynı sözleşme. */
export async function mockSubmitOnboarding(
  request: SubmitOnboardingRequest,
): Promise<RoutineRecommendationResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1800));

  return {
    generatedAt: new Date().toISOString(),
    productSuggestion: null,

    skinSummary: {
      skinType: request.answers.skinType,
      concerns: request.answers.concerns,
    },
    routine: {
      morning: [
        {
          id: 'am-cleanser',
          order: 1,
          activeIngredient: 'Nazik yüzey aktif temizleyici',
          productCategory: 'Temizleyici',
          instructions: 'Ilık suyla, günde bir kez, 30 saniye masaj yaparak uygulayın.',
        },
        {
          id: 'am-niacinamide',
          order: 2,
          activeIngredient: 'Niacinamide (%5)',
          productCategory: 'Serum',
          instructions: 'Temizlik sonrası, güneş kremi öncesi uygulayın.',
        },
        {
          id: 'am-spf',
          order: 3,
          activeIngredient: 'Geniş spektrumlu SPF 50',
          productCategory: 'Güneş koruyucu',
          instructions: 'Rutinin son adımı olarak, dışarı çıkmadan 15 dakika önce uygulayın.',
        },
      ],
      evening: [
        {
          id: 'pm-cleanser',
          order: 1,
          activeIngredient: 'Nazik yüzey aktif temizleyici',
          productCategory: 'Temizleyici',
          instructions: 'Makyaj/güneş kremi kalıntısını çıkarmak için çift temizlik önerilir.',
        },
        {
          id: 'pm-retinol',
          order: 2,
          activeIngredient: 'Retinol (düşük konsantrasyon)',
          productCategory: 'Serum',
          instructions: 'Haftada 2-3 kez başlayın, cilt toleransına göre sıklığı artırın.',
        },
        {
          id: 'pm-moisturizer',
          order: 3,
          activeIngredient: 'Seramid içerikli nemlendirici',
          productCategory: 'Nemlendirici',
          instructions: 'Rutinin son adımı olarak nemi kilitlemek için uygulayın.',
        },
      ],
    },
  };
}
