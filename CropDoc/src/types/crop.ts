export interface DiseaseDiagnosis {
  id: string;
  crop: string;
  disease: string;
  confidence: number;
  date: string;
  emoji: string;
  organicTreatment: string[];
  chemicalTreatment: string[];
  prevention: string[];
}
