export type PersonaKey = 'A' | 'B' | 'C';

export type EmptyTabKey = '소비분석' | '알림' | '미션' | '신용';

export type IntensityKey = '약하게' | '보통' | '강하게';

export type BizTypeKey = '소상공인' | '개인사업자';

export type ProductTabKey = '전체' | '목표' | '신용';

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
  /** true once the phase-2 (verification) UC chain has been completed for the current mission. */
  recovered: boolean;
  incomeMonthly: number;
  incomeAssets: number;
  incomeFixed: number;
}
