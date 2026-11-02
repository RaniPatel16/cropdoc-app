export function getConfidenceBadgeColor(confidence: number): string {
  if (confidence >= 90) return '#2E7D32';
  if (confidence >= 75) return '#F57C00';
  return '#D32F2F';
}
