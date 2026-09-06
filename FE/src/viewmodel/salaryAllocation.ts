import type { AppState } from '../types';
export type SalarySplit = [number,number,number];
export interface SalaryRecord { id:string;date:string;income:number;reserved:number;saving:number;wallet:number;living:number }
export const validSplit=(v:unknown):v is SalarySplit=>Array.isArray(v)&&v.length===3&&v.every(n=>Number.isInteger(n)&&n>=0&&n<=100)&&v.reduce((a,b)=>a+b,0)===100;
export function redistribute(split:SalarySplit,index:number,value:number):SalarySplit {
 const next=Math.round(Math.max(0,Math.min(100,value))),others=[0,1,2].filter(i=>i!==index),remainder=100-next,sum=split[others[0]]+split[others[1]];
 const first=sum?Math.round(remainder*split[others[0]]/sum):Math.floor(remainder/2);
 const result:[number,number,number]=[0,0,0];result[index]=next;result[others[0]]=first;result[others[1]]=remainder-first;return result;
}
export function allocation(income:number,fixed:number,repayment:number,split:SalarySplit,remainingGoal:number) {
 const reserved=Math.min(income,fixed+repayment),disposable=Math.max(0,income-reserved);
 const saving=Math.min(remainingGoal,Math.floor(disposable*split[0]/100)),wallet=Math.floor(disposable*split[1]/100),living=disposable-saving-wallet;
 return {income,reserved,disposable,saving,wallet,living};
}
export function suggestedSplit(s:Pick<AppState,'goal'|'incomeMonthly'|'incomeFixed'>):SalarySplit {
 const disposable=Math.max(0,s.incomeMonthly-s.incomeFixed-s.goal.repayment);
 const saving=disposable?Math.min(100,Math.max(0,Math.round((s.goal.target-s.goal.saved)/s.goal.months/disposable*100))):0;
 return [saving,0,100-saving];
}
