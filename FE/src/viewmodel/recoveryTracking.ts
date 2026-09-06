import type { AppState, PersonaKey } from '../types';
import { INITIAL_SPEND_MONTH } from '../data/spendPeriod';
export type RecoveryStatus = 'awaiting' | 'monitoring' | 'confirmed' | 'reintervene' | 'unverifiable';
export type CheckStage = 'finance' | 'maintenance';
export type CheckScenario = 'improved' | 'worse' | 'missing';
export interface RecoveryBaseline { persona: PersonaKey; label:string; value:number; unit:string; lowerBetter:boolean; source:string }
export interface RecoveryObservation { stage:CheckStage; from:string; to:string; values:(number|null)[]; source:string; status:RecoveryStatus }
export interface RecoveryTracking { interrupted?:boolean; baseline:RecoveryBaseline; completedAt:string; status:RecoveryStatus; observations:RecoveryObservation[] }
export const recoveryLabels:Record<RecoveryStatus,string> = {awaiting:'재무 변화 확인 대기',monitoring:'개선 확인 · 유지 관찰 중',confirmed:'4주 유지 확인',reintervene:'추가 조정 필요',unverifiable:'자료 부족 · 판단 보류'};
export function recoveryBaseline(s:AppState):RecoveryBaseline {
 if(s.persona==='A')return {persona:s.persona,label:'주당 배달 지출',value:Math.round(s.transactions.filter(e=>e.period===INITIAL_SPEND_MONTH&&e.category===0).reduce((n,e)=>n+e.amount,0)/31*7),unit:'원',lowerBetter:true,source:'7월 배달 거래의 주당 환산액'};
 if(s.persona==='B')return {persona:s.persona,label:'월 영업 여유금',value:s.incomeMonthly-s.incomeFixed-s.goal.repayment,unit:'원',lowerBetter:false,source:'월매출 − 고정비 − 상환액'};
 return {persona:s.persona,label:'리볼빙 잔액',value:3260000,unit:'원',lowerBetter:true,source:'신용 시나리오의 시작 잔액 가정'};
}
export function addDays(iso:string,days:number){return new Date(Date.parse(iso)+days*86400000).toISOString();}
export function nextCheckStage(r:RecoveryTracking):CheckStage {
 return r.observations.some(o=>o.stage==='finance'&&o.status==='monitoring') ? 'maintenance' : 'finance';
}
export function observationScenario(r:RecoveryTracking,scenario:CheckScenario):RecoveryObservation {
 const stage=nextCheckStage(r), b=r.baseline;
 const first=r.observations.find(o=>o.stage==='finance'&&o.status==='monitoring');
 const reference=stage==='finance'?b.value:first!.values[0]!;
 const change=Math.max(1000,Math.round(Math.abs(reference)*.15));
 const improved=b.lowerBetter?Math.max(0,reference-change):Math.max(1,reference+change);
 const worse=b.lowerBetter?reference+change:reference-change;
 const values=stage==='finance'?[scenario==='missing'?null:scenario==='improved'?improved:worse]
   : scenario==='missing'?[reference,null,reference,reference]:scenario==='worse'?[reference,reference,worse,reference]:[reference,reference,reference,reference];
 const from=stage==='finance'?r.completedAt:first!.to;
 const status:RecoveryStatus=values.some(v=>v===null)?'unverifiable':stage==='finance'
   ? ((b.lowerBetter?values[0]!<b.value:values[0]!>b.value&&values[0]!>0)?'monitoring':'reintervene')
   : values.every(v=>b.lowerBetter?v!<=reference:v!>=reference&&v!>0)?'confirmed':'reintervene';
 return {stage,from,to:addDays(from,stage==='finance'?7:28),values,source:'기간 경과를 가정한 관찰 기록 · 실제 금융 조회 아님',status};
}
