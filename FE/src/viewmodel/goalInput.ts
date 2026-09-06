/** Explicit amount/period input only; reject ambiguous prose instead of guessing. */
export function parseGoalNumber(text:string,period=false):number {
 const raw=text.replaceAll(',','').replace(/\s/g,'');
 if(period){const m=raw.match(/^(\d+(?:\.\d+)?)(개월|달|년)?$/);if(!m)return NaN;const n=Number(m[1])*(m[2]==='년'?12:1);return Number.isInteger(n)?n:NaN;}
 const m=raw.match(/^(\d+(?:\.\d+)?)(억|천만|백만|만|천)?원?$/);if(!m)return NaN;
 const units:Record<string,number>={'억':1e8,'천만':1e7,'백만':1e6,'만':1e4,'천':1e3};return Math.round(Number(m[1])*(units[m[2]]??1));
}
