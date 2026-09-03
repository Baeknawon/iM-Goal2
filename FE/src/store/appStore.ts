import { create } from 'zustand';
import type { AppState, PersonaKey } from '../types';
import { incomeDefs } from '../data/personas';

const defaultConsents = [true, true, true, true, true, false];

interface AppStore extends AppState {
  setPersona: (p: PersonaKey) => void;
  toggleConsent: (i: number) => void;
  toggleConsentAll: () => void;
  pickQuiz: (i: number) => void;
  resetQuiz: () => void;
  setMissionOn: (v: boolean) => void;
  completeRecovery: () => void;
  incMonthly: (v: number) => void;
  incAssets: (v: number) => void;
  incFixed: (v: number) => void;
  setAlertOn: (v: boolean) => void;
  setPush: (p: PersonaKey | null) => void;
  triggerPersonaAlert: (p: PersonaKey) => void;
  dismissAlert: () => void;
  toggleAccepted: () => void;
  toggleBig: () => void;
  setFueled: (v: boolean) => void;
  dismissGoalComplete: () => void;
  setHasGoal: (v: boolean) => void;
  setEmptyTab: (t: AppState['emptyTab']) => void;
  setIntensity: (t: AppState['intensity']) => void;
  setDeposit: (n: number) => void;
  setBiz: (t: AppState['biz']) => void;
  setProdTab: (t: AppState['prodTab']) => void;
  setMissionDays: (n: number) => void;
  resetOnboarding: () => void;
  finishGoal: () => void;
  simulateOverspend: () => void;
}

// Per-persona "risk event just happened" spend figures, ported from pTrigger().
const triggerSpend: Record<PersonaKey, number> = { A: 45600, B: 16800, C: 19200 };

export const useAppStore = create<AppStore>((set) => ({
  alertOn: false,
  accepted: false,
  spent: 3200,
  big: false,
  fueled: false,
  goalCompleteSeen: false,
  persona: 'A',
  push: null,
  hasGoal: true,
  emptyTab: '소비분석',
  intensity: '보통',
  deposit: 30000,
  biz: '소상공인',
  prodTab: '전체',
  missionDays: 14,
  consents: defaultConsents,
  quizPick: null,
  missionOn: false,
  recovered: false,
  incomeMonthly: incomeDefs.A.monthly,
  incomeAssets: incomeDefs.A.assets,
  incomeFixed: incomeDefs.A.fixed,

  setPersona: (p) => set({
    persona: p, alertOn: false, push: null, spent: 3200, missionOn: false, recovered: false,
    fueled: false, goalCompleteSeen: false,
    incomeMonthly: incomeDefs[p].monthly, incomeAssets: incomeDefs[p].assets, incomeFixed: incomeDefs[p].fixed,
  }),
  toggleConsent: (i) => set((s) => {
    const next = s.consents.slice();
    next[i] = !next[i];
    return { consents: next };
  }),
  toggleConsentAll: () => set((s) => {
    const allOn = s.consents.every(Boolean);
    return { consents: s.consents.map(() => !allOn) };
  }),
  pickQuiz: (i) => set({ quizPick: i }),
  resetQuiz: () => set({ quizPick: null }),
  setMissionOn: (v) => set({ missionOn: v }),
  completeRecovery: () => set({ missionOn: false, recovered: true, alertOn: false, spent: 3200 }),
  incMonthly: (v) => set({ incomeMonthly: Math.max(0, v) }),
  incAssets: (v) => set({ incomeAssets: Math.max(0, v) }),
  incFixed: (v) => set({ incomeFixed: Math.max(0, v) }),
  setAlertOn: (v) => set({ alertOn: v }),
  setPush: (p) => set({ push: p }),
  triggerPersonaAlert: (p) =>
    set({ push: null, alertOn: true, hasGoal: true, spent: triggerSpend[p], missionOn: false, recovered: false }),
  dismissAlert: () => set({ alertOn: false }),
  toggleAccepted: () => set((s) => ({ accepted: !s.accepted })),
  toggleBig: () => set((s) => ({ big: !s.big })),
  setFueled: (v) => set((s) => ({ fueled: v, goalCompleteSeen: v ? false : s.goalCompleteSeen })),
  dismissGoalComplete: () => set({ goalCompleteSeen: true }),
  setHasGoal: (v) => set({ hasGoal: v }),
  setEmptyTab: (t) => set({ emptyTab: t }),
  setIntensity: (t) => set({ intensity: t }),
  setDeposit: (n) => set({ deposit: n }),
  setBiz: (t) => set({ biz: t }),
  setProdTab: (t) => set({ prodTab: t }),
  setMissionDays: (n) => set({ missionDays: n }),
  resetOnboarding: () => set({ hasGoal: false, fueled: false, goalCompleteSeen: false, alertOn: false, spent: 3200, missionOn: false, recovered: false }),
  finishGoal: () => set({ hasGoal: true, alertOn: false, spent: 3200 }),
  simulateOverspend: () => set({ alertOn: true, spent: 26200 }),
}));
