import type { AppState } from '../types';
import { INITIAL_SPEND_MONTH, monthParts } from '../data/spendPeriod';
import { mockMissionHistory } from '../data/mileageHistory';
export function longTermHistory(s:AppState,count=6){
 const periodOf=(date:string)=>{const d=new Date(/^\d{4}\.\d{2}\.\d{2}$/.test(date)?date.replaceAll('.','-'):date);return d.getUTCFullYear()*12+d.getUTCMonth();};
 const events=[...mockMissionHistory.map(e=>({period:periodOf(e.endDate),success:true})),...s.fcpsLog.filter(e=>e.completedAt).map(e=>({period:periodOf(e.completedAt!),success:e.result==='success'}))];
 const end=Math.max(INITIAL_SPEND_MONTH,...events.map(e=>e.period));
 const rows=Array.from({length:count},(_,i)=>{
   const period=end-count+1+i,{year,month}=monthParts(period);
   const entries=s.transactions.filter(e=>e.period===period),observedDays=new Set(entries.map(e=>e.day)).size;
   const days=new Date(year,month,0).getDate(),budget=s.monthlyBudgets[period];
   const compliant=budget===undefined?null:[...new Set(entries.map(e=>e.day))].filter(day=>entries.filter(e=>e.day===day).reduce((sum,e)=>sum+e.amount,0)<=budget/days).length;
   const missions=events.filter(e=>e.period===period);
   const salary=s.salaryLog.filter(e=>e.id===s.persona+'-'+period);
   return {period,label:year+'.'+String(month).padStart(2,'0'),spending:entries.reduce((sum,e)=>sum+e.amount,0),observedDays,days,budget,compliant,missions:missions.length,successes:missions.filter(e=>e.success).length,saving:salary.reduce((sum,e)=>sum+e.saving,0),savingRecords:salary.length};
 });
 return {rows,missions:rows.reduce((n,r)=>n+r.missions,0),successes:rows.reduce((n,r)=>n+r.successes,0),observedDays:rows.reduce((n,r)=>n+r.observedDays,0),savingMonths:rows.filter(r=>r.savingRecords>0&&r.saving>0).length,maintenance:s.fcpsLog.filter(e=>e.recovery?.status==='confirmed'&&!e.recovery.interrupted&&e.completedAt&&periodOf(e.completedAt)>=end-count+1&&periodOf(e.completedAt)<=end).length};
}

export function behaviorFactors(s:AppState){const h=longTermHistory(s);return [
 {name:'지출 관찰',tag:h.observedDays+'일',description:'최근 6개월 중 거래 내역이 있는 날짜 수예요. 자료가 없는 날은 준수일로 계산하지 않아요.'},
 {name:'미션 실천',tag:h.successes+' / '+h.missions+'건 성공',description:'초기 예시 이력과 이후 저장된 미션 결과를 함께 집계해요.'},
 {name:'목표 저축',tag:h.savingMonths+'개월 기록',description:'급여 분배에서 목표 저축액을 실제로 기록한 달의 수예요. 자동 이체 실행을 뜻하지 않아요.'},
 {name:'회복 유지',tag:h.maintenance+'건 확인',description:'현재 보관된 4주 유지 확인 기록이에요. 후속 관찰은 기간 경과를 가정한 자료입니다.'}
 ];}
