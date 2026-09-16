/**
 * Gunluk rutin tik atma sozlesmesi — RN'deki src/types/api.ts ile elle senkron.
 * `date`, kullanicinin YEREL gun anahtari ("YYYY-MM-DD"), sunucunun UTC gunu degil.
 */
export interface RoutineProgressResponseBody {
  date: string;
  completedStepIds: string[];
}

export interface ToggleRoutineProgressRequestBody {
  date: string;
  stepId: string;
}
