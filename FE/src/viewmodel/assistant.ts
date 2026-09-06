import { currentMission } from './adaptiveMission';
import { recoveryLabels } from './recoveryTracking';
import { financePlan } from './finance';
import type { AppState } from '../types';
import { personaDefs } from '../data/personas';
import { calculateFcps } from './fcpsScore';
import { recommendMissionDuration } from './missionDuration';
import { recoveryPlan } from './recoveryFlow';

export interface AssistantReply { text: string; action?: { label: string; to: string } }
export const assistantSuggestions = (path: string): string[] => {
  if (/token/.test(path)) return ['보증금은 왜 필요해?', '보증금 없이 해도 돼?', '보증금 바꾸고 싶어'];
  if (/mileage|fcps/.test(path)) return ['내 점수는 어떻게 쌓였어?', '실패하면 점수가 내려가?', 'FCPS가 신용점수야?'];
  if (/verify|missionLive/.test(path)) return ['미션 성공 기준이 뭐야?', '지금 미션 얼마나 남았어?', '미션을 그만하고 싶어'];
  if (/mission|release/.test(path)) return ['왜 이 기간을 추천했어?', '이 미션이 목표에 얼마나 도움 돼?', '보증금 없이 해도 돼?'];
  if (/spend|category|calendar/.test(path)) return ['오늘 예산 얼마나 남았어?', '소비 내역 보고 싶어', '미션 추천해줘'];
  if (/salary|split|accounts/.test(path)) return ['급여 입금 카드는 언제 떠?', '급여 분배 확인하고 싶어', '내 목표 알려줘'];
  if (/picker|login|consent|empty|chat|connect|income/.test(path)) return ['이 앱은 어떻게 써?', '목표를 만들고 싶어', '보증금은 왜 필요해?'];
  return ['내 목표 알려줘', '오늘 예산 얼마나 남았어?', '미션 추천해줘'];
};

/** Local demo responder. Reads a snapshot only; never performs financial or mission actions. */
export function answerAssistant(question: string, state: AppState): AssistantReply {
  const q = question.replace(/\s/g, '').toLowerCase();
  const finance=financePlan(state);
  const p = {...personaDefs[state.persona],dailyBudget:finance.dailyBudget,goalName:finance.goal.name,goalAmountLabel:finance.goal.target.toLocaleString()+'원'};
  const mission = currentMission(state);
  const go = (text: string, label: string, to: string): AssistantReply => ({ text, action: { label, to } });
  if (/실패이유|미션바뀐|다시추천|너무어려|부담/.test(q))return go(mission.why+' 다음 행동은 '+mission.title1+' '+mission.title2+'예요.','추천 미션 보기','/missionDetail');
  if (/회복단계|회복됐|회복완료|유지확인|재무변화/.test(q)) {
    const r=state.fcpsLog[0]?.recovery;
    return r?go('현재 '+recoveryLabels[r.status]+' 단계예요. 행동 성공과 재무 회복은 따로 확인하며, 개선 이후 4주 유지 기록이 필요해요. 후속 기록은 기간 경과를 가정한 체험 데이터입니다.','회복 확인 상세','/recovery'):go('미션 행동을 완료한 뒤 재무 변화와 4주 유지를 차례로 확인해요.','미션 보기','/missions');
  }
  if (/이앱|어떻게써|사용방법/.test(q)) return go('목표와 기간을 정하고 저축 계획을 확인해요. 소비가 계획에서 벗어나면 회복 미션을 선택하고, 판정 기록과 목표 회복 예상치를 확인할 수 있어요. 보증금은 선택 사항이에요.', state.hasGoal ? '내 목표부터 보기' : '목표부터 만들기', state.hasGoal ? '/home' : '/chat');
  if (/초기화|대화삭제/.test(q)) return { text: '채팅창 위의 ‘대화 지우기’를 누르면 현재 상황의 대화만 지울 수 있어요. 목표와 미션 기록은 유지됩니다.' };
  if (/급여|분배|입금카드/.test(q)) return go('저축 계획 카드는 행동 미션 성공 후 분배 전 단계에서 표시돼요. 실제 입금을 감지하거나 회복을 확인한 결과는 아니에요. 분배 화면에서 금액과 계획을 먼저 확인할 수 있어요.', '급여 분배 확인', '/salary');
  if (/포기|중단|그만|취소/.test(q)) return state.missionOn
    ? go('미션을 중단해도 예치한 보증금은 전액 반환돼요. 현재 기준으로는 FCPS −5점으로 기록됩니다. 진행 화면에서 ‘중단하기’를 누르고 내용을 확인한 뒤 결정하세요.', '진행 중인 미션 보기', '/missionLive')
    : go('현재 진행 중인 미션은 없어요. 새 미션의 기간과 보증금을 확인한 뒤 시작할 수 있어요.', '미션 목록 보기', '/missions');
  if (/신용점수|공식|대출/.test(q)) return go('FCPS는 예산 준수·미션 같은 금융 행동을 기록하는 행동 점수예요. 공식 신용점수를 대체하지 않으며, 대출 승인이나 금리를 보장하지 않아요.', 'FCPS 상세 확인', '/fcps');
  if (/점수|fcps|마일리지|실패/.test(q)) {
    const score = calculateFcps(state.fcpsLog);
    return go(`현재 FCPS는 ${score.total}점이에요. 시작 500점에 과거 적립 112점, 최근 미션 변동 ${score.change >= 0 ? '+' : ''}${score.change}점을 합쳤어요. 미션 성공 +18점, 실패 −8점, 중단 −5점이며 보증금 액수는 점수에 영향을 주지 않아요.`, '점수가 쌓인 기록 보기', '/fcps');
  }
  if (/보증금|예치|imkrw/.test(q)) return go(
    state.missionOn
      ? `현재 미션에 ${state.locked.toLocaleString()}원을 예치 중이에요. 보증금은 소비 가능한 돈을 잠시 분리하는 선택 사항이며, 성공·실패·중단 모두 전액 반환됩니다. 보증금 없이도 같은 판정 기준과 점수가 적용돼요.`
      : '보증금은 미션 동안 소비 가능한 돈을 잠시 분리해 실천을 돕는 선택 사항이에요. 없어도 참여할 수 있고, 점수와 성공 기준은 같아요. 미션 상세에서 보증금 없이 시작하거나 추천 금액을 확인한 뒤 직접 조정할 수 있어요.',
    state.missionOn ? '진행 중인 미션 보기' : '기간·보증금 선택하기', state.missionOn ? '/missionLive' : '/missionDetail');
  if (/예산|소비|지출|잔액/.test(q)) {
    const remaining = p.dailyBudget - finance.today;
    return go(`현재 화면 기준으로 하루 예산은 ${p.dailyBudget.toLocaleString()}원, 오늘 지출은 ${finance.today.toLocaleString()}원이에요. ${remaining >= 0 ? `${remaining.toLocaleString()}원 남았어요.` : `${Math.abs(remaining).toLocaleString()}원 초과했어요.`} 7월 31일 기준이며 소비분석과 같은 거래 내역을 사용해요.`, '소비분석 보기', '/spend');
  }
  if (/기간|며칠|14일|21일|7일|얼마나남/.test(q)) {
    const rec = recommendMissionDuration(state.persona, state.fcpsLog[0]?.result);
    const days = state.activeRecoveryPlan?.missionDays ?? state.missionDays;
    return go(state.missionOn
      ? `진행 중인 미션은 총 ${days}일 약정이에요. 진행 화면에서 시작일과 남은 기간을 확인할 수 있어요. 시작 후에는 약정 기간을 바꾸지 않으며, 다음 미션에서 다시 선택할 수 있어요.`
      : `${rec.days}일을 추천해요. ${rec.reason}\n현재 선택은 ${state.missionDays}일이에요. ‘세부 조정’에서 7~28일을 7일 단위로 바꿀 수 있어요.`, state.missionOn ? '남은 기간 확인' : '기간 세부 조정', state.missionOn ? '/missionLive' : '/missionDetail');
  }
  if (/기준|판정|성공|인증/.test(q)) return go(`${mission.title1} ${mission.title2}의 완료 기준은 ‘${mission.criteria.rule}’예요. ${mission.criteria.source}를 연결하는 기획이며, 현재는 판정 근거를 확인한 뒤 결과를 확정합니다.`, '미션 기준 확인', state.missionOn ? '/missionLive' : '/missionDetail');
  if (/도움|회복|얼마나|절약|도착/.test(q)) {
    const plan = state.missionOn && state.activeRecoveryPlan ? state.activeRecoveryPlan : recoveryPlan(state.persona, state.missionDays, finance.today, finance, mission.weeklySavings);
    return go(`${plan.missionDays}일 실천 시 절약 예상액은 ${plan.savings.toLocaleString()}원이고, 전액 목표 저축으로 이어가면 ${plan.recoverDays}일 회복을 예상해요. 월 목표 저축액의 하루분으로 환산한 추정치이며, 보증금 반환은 절약액에 포함하지 않아요.`, '회복 계획 확인', state.missionOn ? '/missionLive' : '/missionDetail');
  }
  if (/목표/.test(q)) return state.hasGoal
    ? go(`현재 선택한 목표는 ‘${p.goalName}’예요. 홈에서 진행 상황과 회복 예상치를 확인할 수 있어요. 미션으로 절약한 여유를 실제 목표 저축으로 이어가는 것이 다음 행동이에요.`, '내 목표 보기', '/home')
    : go('아직 목표를 만들지 않았어요. 원하는 목표와 기간부터 정하면 저축 계획과 회복 미션을 안내받을 수 있어요.', '목표 만들기', '/chat');
  if (/미션|추천/.test(q)) return go(`현재 상황에는 ‘${mission.title1} ${mission.title2}’를 제안해요. ${mission.why}`, state.missionOn ? '내 미션 이어보기' : '추천 이유와 기간 확인', state.missionOn ? '/missionLive' : '/missionDetail');
  if (/안녕|고마|반가/.test(q)) return { text: '안녕하세요, 똑디예요! 목표·소비·미션·FCPS에 대해 물어보세요. 아래 추천 질문으로 시작해도 좋아요.' };
  return { text: '저는 현재 앱의 목표·예산·미션·보증금·FCPS를 안내하는 똑디예요. 자유로운 AI 답변은 아직 연결되지 않았어요. “왜 이 기간을 추천했어?”처럼 앱 기능을 구체적으로 물어보거나 아래 추천 질문을 선택해 주세요.' };
}
