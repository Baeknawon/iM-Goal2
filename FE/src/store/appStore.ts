import { persist, createJSONStorage } from 'zustand/middleware';
import { localStateStorage, mergeStored, reportStorageError } from './localStorage';
import { validSplit, type SalarySplit } from '../viewmodel/salaryAllocation';
import { currentMission, recommendMission, failureReasons, type FailureReason } from '../viewmodel/adaptiveMission';
import { recoveryBaseline, observationScenario, nextCheckStage, type CheckStage, type CheckScenario } from '../viewmodel/recoveryTracking';
import { initialGoal, initialTransactions, financePlan, type GoalInput } from '../viewmodel/finance';
import { INITIAL_SPEND_MONTH } from '../data/spendPeriod';
import { create } from 'zustand';
import type { AppState, PersonaKey, MissionResult, FcpsEntry } from '../types';
import { incomeDefs } from '../data/personas';
import { recommendMissionDuration } from '../viewmodel/missionDuration';
import { recoveryPlan } from '../viewmodel/recoveryFlow';

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
  setSalarySplit:(split:SalarySplit)=>void;
  toggleSupportCheck:(id:string,index:number)=>void;
  markSupportVisit:(id:string)=>void;

  updateGoal: (goal: GoalInput) => void;
  setMonthlyBudget: (period: number, value: number) => void;
  setPersona: (p: PersonaKey) => void;
  toggleConsent: (i: number) => void;
  toggleConsentAll: () => void;
  pickQuiz: (i: number) => void;
  resetQuiz: () => void;
  setMissionOn: (v: boolean) => void;
  completeRecovery: () => void;
  recordRecoveryCheck: (completedAt: string, stage: CheckStage, scenario: CheckScenario) => void;
  /** 미션 시작: 지갑에서 보증금만큼 차감하고 미션을 진행 상태로 만듦. */
  startMission: (deposit: number) => void;
  /** 미션 종료(성공/실패/포기): 보증금을 지갑으로 반환하고 결과를 FCPS에 기록. */
  finishMission: (result: MissionResult, reason?: FailureReason) => void;
  setFailureReason: (reason: FailureReason) => void;
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

export const useAppStore = create<AppStore>()(persist((set, get) => ({
  salarySplit:null,salaryLog:[],supportChecks:{},supportVisits:{},
  appliedRiskEvents: [], goal: initialGoal('A'), transactions: initialTransactions(), monthlyBudgets: {},
  alertOn: false,
  accepted: false,
  spent: initialTransactions().filter(e=>e.period===INITIAL_SPEND_MONTH&&e.day===31).reduce((sum,e)=>sum+e.amount,0),
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
  missionStartedAt: null,
  activeMission: null, activeRecoveryPlan: null, recoveryBaseline: null,
  recovered: false,
  incomeMonthly: incomeDefs.A.monthly,
  incomeAssets: incomeDefs.A.assets,
  incomeFixed: incomeDefs.A.fixed,
  wallet: WALLET_INITIAL,
  locked: 0,
  autoTopUp: 0,
  missionResult: null,
  fcpsLog: [],

  setSalarySplit: split=>set(s=>{if(!validSplit(split))return {};const budgets={...s.monthlyBudgets};delete budgets[INITIAL_SPEND_MONTH];return {salarySplit:[...split] as SalarySplit,monthlyBudgets:budgets};}),
  toggleSupportCheck:(id,index)=>set(s=>{if(!['youth','business','debt','general'].includes(id)||!Number.isInteger(index)||index<0||index>2)return {};const checks=[...(s.supportChecks[id]??[false,false,false])];checks[index]=!checks[index];return {supportChecks:{...s.supportChecks,[id]:checks}};}),
  markSupportVisit:id=>set(s=>['youth','business','debt','general'].includes(id)?{supportVisits:{...s.supportVisits,[id]:new Date().toISOString()}}:{}),
  updateGoal: (goal) => set(() => goal.name.trim() && [goal.target,goal.saved,goal.months,goal.repayment].every(Number.isFinite) && goal.target>0 && goal.target<=1e12 && goal.saved>=0 && goal.saved<=goal.target && Number.isInteger(goal.months) && goal.months>=1 && goal.months<=600 && goal.repayment>=0 ? {goal:{...goal,name:goal.name.trim()}} : {}),
  setMonthlyBudget: (period,value) => set(s => Number.isInteger(period) && Number.isFinite(value) && value>=0 && value<=1e9 ? {monthlyBudgets:{...s.monthlyBudgets,[period]:Math.round(value)}} : {}),
  setPersona: (p) => set({
    salarySplit:null,salaryLog:[],supportChecks:{},supportVisits:{},
    appliedRiskEvents: [], goal: initialGoal(p), transactions: initialTransactions(), monthlyBudgets: {},
    persona: p, missionDays: recommendMissionDuration(p).days, alertOn: false, push: null, spent: initialTransactions().filter(e=>e.period===INITIAL_SPEND_MONTH&&e.day===31).reduce((sum,e)=>sum+e.amount,0), missionOn: false, missionStartedAt: null, activeMission: null, activeRecoveryPlan: null, recoveryBaseline: null, recovered: false,
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
  setMissionOn: (v) => set((s) => ({ missionOn: v, missionStartedAt: v ? (s.missionStartedAt ?? new Date().toISOString()) : s.missionStartedAt })),

  // 미션 시작: iMKRW 머니에서 보증금만큼 묶임. 잔액이 부족하면 에이전트가 자동 충전 후 묶음.
  startMission: (dep) => set((s) => {
    if (s.missionOn || !Number.isFinite(dep) || dep < 0) return {};
    const proposal = recommendMission(s);
    if(!proposal.allowDeposit && dep>0)return {};
    const topUp = Math.max(0, dep - s.wallet); // 부족분 자동 충전
    const walletAfterTopUp = s.wallet + topUp; // 부족하면 dep만큼으로 채워짐
    return {
      activeMission: proposal,
      recoveryBaseline: recoveryBaseline(s),
      missionOn: true, alertOn: false, recovered: false, missionResult: null,
      missionStartedAt: new Date().toISOString(),
      activeRecoveryPlan: recoveryPlan(s.persona, s.missionDays, financePlan(s).today, financePlan(s), proposal.weeklySavings),
      deposit: dep,
      wallet: walletAfterTopUp - dep, // 보증금만큼 빠져나감 (묶임)
      locked: s.locked + dep,
      autoTopUp: topUp,
    };
  }),

  // 미션 종료(성공/실패/포기): 묶인 보증금이 iMKRW 머니로 반환되고 결과가 FCPS에 기록됨.
  finishMission: (result, reason = 'unknown') => set((s) => {
    if (!s.missionOn || s.missionResult !== null) return {};
    const meta = fcpsByResult[result];
    const MI = currentMission(s);
    const completedAt = new Date().toISOString();
    const entry: FcpsEntry = {
      missionSnapshot: MI, failureReason: result==='success'?undefined:(reason in failureReasons?reason:'unknown'),
      result, label: meta.label, mission: `${MI.title1} ${MI.title2}`,
      startedAt: s.missionStartedAt, completedAt,
      recovery: result === 'success' ? {baseline:s.recoveryBaseline ?? recoveryBaseline(s),completedAt,status:'awaiting',observations:[]} : undefined,
      recoveryPlan: s.activeRecoveryPlan ?? undefined,
      deposit: s.deposit, delta: meta.delta,
    };
    return {
      missionOn: false,
      recovered: false,
      missionResult: result,
      missionDays: recommendMissionDuration(s.persona, result).days,
      wallet: s.wallet + s.deposit,          // 묶였던 보증금 반환
      locked: Math.max(0, s.locked - s.deposit),
      fcpsLog: [entry, ...s.fcpsLog],
      alertOn: false,
    };
  }),

  setFailureReason: reason => set(s => !s.missionOn && reason in failureReasons && s.fcpsLog[0] && s.fcpsLog[0].result!=='success' ? {fcpsLog:[{...s.fcpsLog[0],failureReason:reason},...s.fcpsLog.slice(1)]} : {}),
  // Legacy entry point only settles the behavioral mission; it cannot confirm recovery.
  completeRecovery: () => get().finishMission('success'),
  recordRecoveryCheck: (completedAt, stage, scenario) => set(s => {
    if(s.missionOn || !['improved','worse','missing'].includes(scenario))return {};
    const latest=s.fcpsLog[0];
    if(!latest?.recovery || latest.completedAt!==completedAt || latest.recovery.status==='confirmed' || latest.recovery.interrupted || nextCheckStage(latest.recovery)!==stage)return {};
    const observation=observationScenario(latest.recovery,scenario);
    const previous=latest.recovery.observations.at(-1);
    if(previous && JSON.stringify(previous)===JSON.stringify(observation))return {};
    const recovery={...latest.recovery,status:observation.status,observations:[...latest.recovery.observations,observation]};
    return {recovered:observation.status==='confirmed',fcpsLog:[{...latest,recovery},...s.fcpsLog.slice(1)]};
  }),
  incMonthly: (v) => set({ incomeMonthly: Number.isFinite(v) ? Math.max(0, v) : 0 }),
  incAssets: (v) => set({ incomeAssets: Math.max(0, v) }),
  incFixed: (v) => set({ incomeFixed: Math.max(0, v) }),
  setAlertOn: (v) => set({ alertOn: v }),
  setPush: (p) => set({ push: p }),
  triggerPersonaAlert: (p) =>
      set(s => {
        const id='trigger-'+p;
        const fcpsLog=s.fcpsLog.map((entry,i)=>i===0&&entry.recovery?{...entry,recovery:{...entry.recovery,status:'reintervene' as const,interrupted:true}}:entry);
        if(p==='B')return {fcpsLog,incomeMonthly:s.appliedRiskEvents.includes(id)?s.incomeMonthly:Math.round(s.incomeMonthly*.82),appliedRiskEvents:[...new Set([...s.appliedRiskEvents,id])],push:null,alertOn:true,hasGoal:true,recovered:false};
        const transactions=s.transactions.some(e=>e.id===id)?s.transactions:[...s.transactions,{id,period:INITIAL_SPEND_MONTH,day:31,category:p==='A'?0:3,name:p==='A'?'배달앱 추가 결제':'카드 추가 결제',amount:p==='A'?23000:148000}];
        return {fcpsLog,transactions,push:null,alertOn:true,hasGoal:true,spent:transactions.filter(e=>e.period===INITIAL_SPEND_MONTH&&e.day===31).reduce((sum,e)=>sum+e.amount,0),recovered:false};
      }),
  dismissAlert: () => set({ alertOn: false }),
  toggleAccepted: () => set((s) => ({ accepted: !s.accepted })),
  toggleBig: () => set((s) => ({ big: !s.big })),
  setFueled: v=>set(s=>{
    const id=s.persona+'-'+INITIAL_SPEND_MONTH;
    if(!v)return {fueled:false};
    if(s.salaryLog.some(r=>r.id===id))return {fueled:true};
    const plan=financePlan(s);
    const a={income:s.incomeMonthly,reserved:Math.min(s.incomeMonthly,s.incomeFixed+s.goal.repayment),saving:Math.min(plan.left,plan.monthlySaving),wallet:plan.walletReserve,living:Math.max(0,plan.disposable-Math.min(plan.left,plan.monthlySaving)-plan.walletReserve)};
    if(a.income<=0)return {};
    return {fueled:true,goalCompleteSeen:false,goal:{...s.goal,saved:s.goal.saved+a.saving},wallet:s.wallet+a.wallet,salaryLog:[{id,date:new Date().toISOString(),...a},...s.salaryLog]};
  }),
  dismissGoalComplete: () => set({ goalCompleteSeen: true }),
  setHasGoal: (v) => set({ hasGoal: v }),
  setEmptyTab: (t) => set({ emptyTab: t }),
  setIntensity: (t) => set({ intensity: t }),
  setDeposit: (n) => set({ deposit: n }),
  setBiz: (t) => set({ biz: t }),
  setProdTab: (t) => set({ prodTab: t }),
  setMissionDays: (n) => set((s) => !s.missionOn && [7, 14, 21, 28].includes(n) ? { missionDays: n } : {}),
  resetOnboarding: () => set({ salarySplit:null,salaryLog:[],supportChecks:{},supportVisits:{}, activeMission: null, activeRecoveryPlan: null, recoveryBaseline: null, missionStartedAt: null, hasGoal: false, fueled: false, goalCompleteSeen: false, alertOn: false, missionOn: false, recovered: false, wallet: WALLET_INITIAL, locked: 0, autoTopUp: 0, missionResult: null, fcpsLog: [] }),
  finishGoal: () => set({ hasGoal: true, alertOn: false }),
  simulateOverspend: () => get().triggerPersonaAlert(get().persona),
}), {name:'im-goal-state-v1',version:1,onRehydrateStorage:()=> (_state,error)=>{if(error)reportStorageError();},storage:createJSONStorage(()=>localStateStorage),merge:mergeStored}));
