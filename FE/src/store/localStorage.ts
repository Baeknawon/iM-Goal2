import { validSplit } from '../viewmodel/salaryAllocation';
import type { StateStorage } from 'zustand/middleware';
let warning='';
export const reportStorageError=()=>{warning='저장된 기록을 읽지 못해 시작 상태로 열었어요. 기기 기록 관리에서 초기화할 수 있어요.';};
const memory=new Map<string,string>();
export const storageWarning=()=>warning;
export const localStateStorage:StateStorage={
 getItem:key=>{try{return typeof window==='undefined'?memory.get(key)??null:window.localStorage.getItem(key);}catch{warning='브라우저 저장소를 사용할 수 없어 이번 실행 중에만 기록을 유지해요.';return memory.get(key)??null;}},
 setItem:(key,value)=>{memory.set(key,value);try{if(typeof window!=='undefined')window.localStorage.setItem(key,value);}catch{warning='기록을 기기에 저장하지 못했어요. 새로고침 전에 저장 공간과 브라우저 설정을 확인해주세요.';}},
 removeItem:key=>{memory.delete(key);try{if(typeof window!=='undefined')window.localStorage.removeItem(key);}catch{warning='기기 저장 기록을 삭제하지 못했어요. 브라우저 사이트 데이터에서 삭제해주세요.';}}
};
export function mergeStored<T extends object>(saved:unknown,current:T):T {
 if(!saved||typeof saved!=='object')return current;
 const value=saved as Record<string,unknown>,base=current as Record<string,unknown>;
 // Discard incompatible/corrupt snapshots as a unit, preserving store actions.
 for(const [key,expected] of Object.entries(base)) {
   if(typeof expected==='function')continue;
   if(!(key in value))return current;
   const actual=value[key];
   if(expected!==null&&(typeof expected!==typeof actual||Array.isArray(expected)!==Array.isArray(actual)))return current;
   if(typeof actual==='number'&&!Number.isFinite(actual))return current;
 }
 const goal=value.goal as Record<string,unknown>;
 if(!goal||typeof goal.name!=='string'||!['target','saved','months','repayment'].every(k=>typeof goal[k]==='number'&&Number.isFinite(goal[k]))||Number(goal.target)<=0||Number(goal.months)<=0)return current;
 if(!['A','B','C'].includes(String(value.persona)))return current;
 if(value.salarySplit!==null&&!validSplit(value.salarySplit))return current;
 const validRows=(key:string,fields:string[])=>Array.isArray(value[key])&&(value[key] as unknown[]).every(row=>row!==null&&typeof row==='object'&&fields.every(field=>typeof (row as Record<string,unknown>)[field]==='number'&&Number.isFinite((row as Record<string,unknown>)[field])));
 if(!validRows('transactions',['amount','day','period','category'])||!validRows('fcpsLog',['delta','deposit'])||!validRows('salaryLog',['income','reserved','saving','wallet','living']))return current;
 if((value.fcpsLog as Record<string,unknown>[]).some(e=>!['success','fail','give_up'].includes(String(e.result))||typeof e.mission!=='string'))return current;
 if(Object.values(value.monthlyBudgets as object).some(v=>typeof v!=='number'||!Number.isFinite(v)||v<0))return current;
 if(Object.values(value.supportChecks as object).some(v=>!Array.isArray(v)||v.length!==3||v.some(x=>typeof x!=='boolean')))return current;
 const result={...current};for(const key of Object.keys(base))if(typeof base[key]!=='function')(result as Record<string,unknown>)[key]=value[key];return result;
}
