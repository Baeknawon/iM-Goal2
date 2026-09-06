import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { financePlan } from '../viewmodel/finance';
export function GoalEditor() {
  const state=useAppStore();
  const [open,setOpen]=useState(false);
  const [draft,setDraft]=useState(state.goal);
  const preview=financePlan({...state,goal:draft});
  return <section className="insight-section" style={{marginTop:16}}>
    <div className="insight-section-heading"><h2>목표 입력 확인</h2><button onClick={()=>{setDraft(state.goal);setOpen(!open);}}>{open?'닫기':'수정하기'}</button></div>
    <p className="insight-secondary">{state.goal.name} · {state.goal.months}개월 · 모아둔 돈 {state.goal.saved.toLocaleString()}원</p>
    {open&&<form className="goal-editor" onSubmit={e=>{e.preventDefault();state.updateGoal(draft);setOpen(false);}}>
      <label>목표 이름<input required maxLength={40} value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label>
      {([{key:'target',label:'목표 금액 (원)',min:1,max:1e12},{key:'saved',label:'목표에 모아둔 금액 (원)',min:0,max:draft.target},{key:'months',label:'남은 목표 기간 (개월)',min:1,max:600},{key:'repayment',label:'월 부채 상환액 (원)',min:0,max:1e9}] as const).map(field=><label key={field.key}>{field.label}<input type="number" required min={field.min} max={field.max} step="1" value={draft[field.key]} onChange={e=>setDraft({...draft,[field.key]:e.target.value===''?0:Number(e.target.value)})}/></label>)}
      <p className="insight-secondary">저축 가능액 {preview.monthlySaving.toLocaleString()}원 / 월<br/>예상 도착 {preview.eta}</p>
      <p className="insight-caption">보유 자산 전체가 아닌 이 목표에 배정한 돈을 입력하세요. 상환액은 고정비와 중복으로 넣지 않아요.</p>
      <button className="goal-save" type="submit">목표에 반영하기</button>
    </form>}
  </section>;
}
