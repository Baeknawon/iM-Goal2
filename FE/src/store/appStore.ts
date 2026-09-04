import { create } from 'zustand';
import type { AppState, PersonaKey, MissionResult, FcpsEntry } from '../types';
import { incomeDefs, missionDefs } from '../data/personas';

/** iMKRW 지갑 초기 잔액. */
const WALLET_INITIAL = 50000;

/** 미션 결과별 FCPS 점수 변화 + 라벨. 금전(보증금 반환)은 동일하고 기록만 다름. */
const fcpsByResult: Record<MissionResult, { label: string; delta: number }> = {
  success: { label: '회복 미션 성공', delta: 18 },
  fail: { label: '회복 미션 실패', delta: -8 },
  give_up: { label: '회복 미션 포기', delta: -5 },
};

const defaultConsents = [true, true, true, true, true, false];

interface AppStore extends AppState {
  setPersona: (p: PersonaKey) => void;
  toggleConsent: (i: number) => void;
  toggleConsentAll: () => void;
  pickQuiz: (i: number) => void;
  resetQuiz: () => void;
  setMissionOn: (v: boolean) => void;
  completeRecovery: () => void;
  /** 미션 시작: 지갑에서 보증금만큼 차감하고 미션을 진행 상태로 만듦. */
  startMission: (deposit: number) => void;
  /** 미션 종료(성공/실패/포기): 보증금을 지갑으로 반환하고 결과를 FCPS에 기록. */
  finishMission: (result: MissionResult) => void;
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
  wallet: WALLET_INITIAL,
  locked: 0,
  autoTopUp: 0,
  missionResult: null,
  fcpsLog: [],

  setPersona: (p) => set({
    persona: p, alertOn: false, push: null, spent: 3200, missionOn: false, recovered: false,
    fueled: false, goalCompleteSeen: false,
    wallet: WALLET_INITIAL, locked: 0, autoTopUp: 0, missionResult: null, fcpsLog: [],
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

  // 미션 시작: iMKRW 머니에서 보증금만큼 묶임. 잔액이 부족하면 에이전트가 자동 충전 후 묶음.
  startMission: (dep) => set((s) => {
    const topUp = Math.max(0, dep - s.wallet); // 부족분 자동 충전
    const walletAfterTopUp = s.wallet + topUp; // 부족하면 dep만큼으로 채워짐
    return {
      missionOn: true, recovered: false, missionResult: null,
      deposit: dep,
      wallet: walletAfterTopUp - dep, // 보증금만큼 빠져나감 (묶임)
      locked: s.locked + dep,
      autoTopUp: topUp,
    };
  }),

  // 미션 종료(성공/실패/포기): 묶인 보증금이 iMKRW 머니로 반환되고 결과가 FCPS에 기록됨.
  finishMission: (result) => set((s) => {
    const meta = fcpsByResult[result];
    const MI = missionDefs[s.persona];
    const entry: FcpsEntry = {
      result, label: meta.label, mission: `${MI.title1} ${MI.title2}`,
      deposit: s.deposit, delta: meta.delta,
    };
    return {
      missionOn: false,
      recovered: result === 'success',
      missionResult: result,
      wallet: s.wallet + s.deposit,          // 묶였던 보증금 반환
      locked: Math.max(0, s.locked - s.deposit),
      fcpsLog: [entry, ...s.fcpsLog],
      alertOn: false, spent: 3200,
    };
  }),

  // 성공 회복 (기존 흐름 유지 — ReleaseScreen에서 호출)
  completeRecovery: () => set((s) => {
    const meta = fcpsByResult.success;
    const MI = missionDefs[s.persona];
    const entry: FcpsEntry = {
      result: 'success', label: meta.label, mission: `${MI.title1} ${MI.title2}`,
      deposit: s.deposit, delta: meta.delta,
    };
    return {
      missionOn: false, recovered: true, missionResult: 'success',
      wallet: s.wallet + s.deposit,
      locked: Math.max(0, s.locked - s.deposit),
      fcpsLog: [entry, ...s.fcpsLog],
      alertOn: false, spent: 3200,
    };
  }),
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
  resetOnboarding: () => set({ hasGoal: false, fueled: false, goalCompleteSeen: false, alertOn: false, spent: 3200, missionOn: false, recovered: false, wallet: WALLET_INITIAL, locked: 0, autoTopUp: 0, missionResult: null, fcpsLog: [] }),
  finishGoal: () => set({ hasGoal: true, alertOn: false, spent: 3200 }),
  simulateOverspend: () => set({ alertOn: true, spent: 26200 }),
}));
