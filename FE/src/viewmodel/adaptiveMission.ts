import type { AppState } from '../types';
import { missionDefs } from '../data/personas';
import { recoveryCriteria } from './recoveryFlow';
export const failureReasons = {difficulty:'목표 횟수·기준이 부담됐어요',time:'시간이 부족하거나 잊었어요',expense:'예상하지 못한 지출이 있었어요',unknown:'아직 이유를 모르겠어요'};
export type FailureReason = keyof typeof failureReasons;
export interface MissionProposal {
 title1:string;title2:string;leg:string;difficulty:string;why:string;how:string;
 criteria:{rule:string;success:string;fail:string;source:string};
 level:number;weeklySavings:number;allowDeposit:boolean;
}
export function recommendMission(s:Pick<AppState,'persona'|'fcpsLog'>):MissionProposal {
 const base=missionDefs[s.persona],latest=s.fcpsLog[0];
 const baseline={...base,criteria:recoveryCriteria[s.persona],level:0,weeklySavings:{A:16000,B:42000,C:22000}[s.persona],allowDeposit:true};
 if(!latest || latest.result==='success')return baseline;
 let failures=0;for(const entry of s.fcpsLog){if(entry.result==='success')break;failures++;}
 const reason=latest.failureReason??'unknown';
 const previousLevel=latest.missionSnapshot?.level??0;
 const prep=failures>=2 || reason==='time' || reason==='expense' || previousLevel>=2;
 const level=prep?2:1;
 const titles=prep?{A:['배달앱 알림을 끄고','대체 식사 1개 정하기'],B:['고정비 1건을 고르고','납부일 알림 설정하기'],C:['카드 결제일을 확인하고','지출 알림 설정하기']}:{A:['배달 주문을','주 2회 이하로 줄이기'],B:['고정비 2건을','점검하고 조정안 적기'],C:['새로운 리볼빙 신청 없이','주 2회 사용액 확인하기']};
 const title=titles[s.persona];
 const rule=prep?{A:'배달앱 알림 끄기와 대체 식사 1개 기록을 기간 내 모두 완료',B:'고정비 1건 선택과 납부일 알림 설정을 기간 내 모두 완료',C:'결제일 확인과 카드 지출 알림 설정을 기간 내 모두 완료'}[s.persona]
 :{A:'각 주의 배달 결제가 2회 이하',B:'기간 내 고정비 2건 점검 및 항목별 유지·변경 계획 기록',C:'각 주 사용액 확인 기록 2회 이상 및 기간 중 신규 리볼빙 신청 0건'}[s.persona];
 return {...baseline,title1:title[0],title2:title[1],level,difficulty:prep?'난이도 가볍게':'난이도 낮춤',weeklySavings:s.persona==='A'&&!prep?8000:0,allowDeposit:!prep,
 why:(reason==='unknown'?'실패 원인은 아직 확인하지 못했어요.':failureReasons[reason]+'라고 알려주셨어요.')+' '+(failures>=2?'연속 '+failures+'회 미완료여서 준비 행동부터 다시 시작해요.':prep?'횟수 목표보다 실행 준비를 먼저 해요.':'한 번에 해야 할 행동과 기준을 줄였어요.'),
 how:rule+'해 주세요. '+(prep?'금액 절약을 약속하는 미션이 아니라 실행 준비를 돕는 미션이에요.':'실행한 항목을 기록하고 기간이 끝나면 기준을 확인해요.'),
 criteria:{rule,success:rule+' · 기준 충족 기록',fail:rule+' · 일부 항목 미충족 기록',source:s.persona==='A'&&!prep?'배달 결제 내역':'사용자 실천 기록'+(s.persona==='C'&&!prep?' · 리볼빙 신청 내역':'')}};
}
export function currentMission(s:AppState):MissionProposal {return s.missionOn&&s.activeMission?s.activeMission:recommendMission(s);}
