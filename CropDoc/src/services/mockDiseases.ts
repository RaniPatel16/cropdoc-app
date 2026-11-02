import { DiseaseDiagnosis } from '../types/crop';

export const COMMON_DISEASES: Record<string, Partial<DiseaseDiagnosis>> = {
  tomatoEarlyBlight: {
    crop: 'Tomato',
    disease: 'Early Blight',
    confidence: 94,
    emoji: '🍅',
  },
  potatoLateBlight: {
    crop: 'Potato',
    disease: 'Late Blight',
    confidence: 91,
    emoji: '🥔',
  },
};
