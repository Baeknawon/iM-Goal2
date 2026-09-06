import { failureReasons, type FailureReason } from '../viewmodel/adaptiveMission';
export function FailureReasonPicker({value,onChange}:{value:FailureReason;onChange:(reason:FailureReason)=>void}) {
 return <fieldset className="recovery-options"><legend>무엇이 어려웠나요?</legend>{Object.entries(failureReasons).map(([key,label])=><label key={key}><input type="radio" name="failure-reason" checked={key===value} onChange={()=>onChange(key as FailureReason)}/>{label}</label>)}</fieldset>;
}
