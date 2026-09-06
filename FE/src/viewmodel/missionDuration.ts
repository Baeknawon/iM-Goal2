import type { MissionResult, PersonaKey } from '../types';

/** 미션 특성과 최근 결과를 반영하는 시연용 추천 규칙. */
export function recommendMissionDuration(persona: PersonaKey, lastResult?: MissionResult | null) {
  if (lastResult === 'fail' || lastResult === 'give_up') return {
    days: 7, reason: '최근 미션을 끝내지 못해 부담이 적은 7일을 추천해요. 한 주 동안 실천해 보고 다음 기간을 정할 수 있어요.',
  };
  if (persona === 'B') return {
    days: 21, reason: '고정비 4건을 점검하고 카드 사용 변화를 확인할 시간이 필요해요. 점검과 실천을 나눠 진행할 수 있도록 3주를 추천해요.',
  };
  return { days: 14, reason: persona === 'A'
    ? '배달 주문을 주 1회로 줄이는 습관을 두 주 동안 확인할 수 있도록 14일을 추천해요. 한 주만의 우연한 변화보다 반복 실천을 살펴볼 수 있어요.'
    : '카드 사용을 줄이고 신규 리볼빙을 멈추는 행동을 두 주 동안 이어가도록 14일을 추천해요. 잔액 변화와 실천 여부를 함께 살펴볼 수 있어요.' };
}
