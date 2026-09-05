import { FCPS_INITIAL_SCORE, mockMileageHistory } from '../data/mileageHistory';

export const FCPS_BASE_SCORE = FCPS_INITIAL_SCORE + mockMileageHistory.reduce((sum, entry) => sum + entry.delta, 0);
export function calculateFcps(entries: readonly { delta: number }[]) {
  const change = entries.reduce((sum, entry) => sum + entry.delta, 0);
  return { base: FCPS_BASE_SCORE, change, total: FCPS_BASE_SCORE + change };
}
