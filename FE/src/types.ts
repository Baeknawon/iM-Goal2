import type { RecoveryPlan } from './viewmodel/recoveryFlow';
export type PersonaKey = 'A' | 'B' | 'C';

export type EmptyTabKey = '소비분석' | '알림' | '미션' | '신용';

export type IntensityKey = '약하게' | '보통' | '강하게';

export type BizTypeKey = '소상공인' | '개인사업자';

export type ProductTabKey = '전체' | '목표' | '신용';

/** 보증금 미션의 최종 결과. 금전 처리는 동일(전액 반환), FCPS 기록만 다름. */
export type MissionResult = 'success' | 'fail' | 'give_up';

/** FCPS(신용 궤적)에 반영되는 미션 이력 한 건. */
export interface FcpsEntry {
  recoveryPlan?: RecoveryPlan;
  startedAt?: string | null;
  completedAt?: string;
  result: MissionResult;
  label: string;   // "회복 미션 성공" 등
  mission: string; // 미션 이름
  deposit: number; // 예치했던 보증금
  delta: number;   // FCPS 점수 변화 (성공 +, 실패/포기 -)
}

/** The 18 use-case walkthrough screens (u11..u36), 6 per persona chain. */
export type UCScreenId =
    | 'u11' | 'u12' | 'u13' | 'u14' | 'u15' | 'u16' | 'u17'
    | 'u21' | 'u22' | 'u23' | 'u24' | 'u25' | 'u26'
    | 'u31' | 'u32' | 'u33' | 'u34' | 'u35' | 'u36';

/**
 * Simulation state shared across the whole app session — ported 1:1 from the
 * design doc's `Component.state`. Screen navigation itself is owned by the
 * router (see AppRoutes), everything else lives here.
 */
export interface AppState {
  alertOn: boolean;
  accepted: boolean;
  spent: number;
  big: boolean;
  fueled: boolean;
  goalCompleteSeen: boolean;
  persona: PersonaKey;
  push: PersonaKey | null;
  hasGoal: boolean;
  emptyTab: EmptyTabKey;
  intensity: IntensityKey;
  deposit: number;
  biz: BizTypeKey;
  prodTab: ProductTabKey;
  missionDays: number;
  /** consent screen: [계좌연결, 마이데이터, 개인정보, 금융거래정보, FCPS축적, 마케팅수신(선택)] */
  consents: boolean[];
  quizPick: number | null;
  /** whether the current recovery mission (LEG 04) is still live vs. all-done history. */
  missionOn: boolean;
  missionStartedAt: string | null;
  activeRecoveryPlan: RecoveryPlan | null;
  /** true once the phase-2 (verification) UC chain has been completed for the current mission. */
  recovered: boolean;
  incomeMonthly: number;
  incomeAssets: number;
  incomeFixed: number;
  /** iMKRW 머니(지갑) 잔액. 미션 시작 시 보증금만큼 빠져나가(묶이고), 종료 시 반환됨. */
  wallet: number;
  /** 현재 미션에 묶여 있는 보증금 총합. */
  locked: number;
  /** 직전 미션 시작 때 지갑 잔액이 부족해 에이전트가 자동 충전한 금액 (0이면 자동충전 없음). */
  autoTopUp: number;
  /** 마지막 미션 결과 (없으면 null). */
  missionResult: MissionResult | null;
  /** FCPS에 반영된 미션 이력 (최신순). */
  fcpsLog: FcpsEntry[];
}
