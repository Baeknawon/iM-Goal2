/** 시연용 과거 이력. 미션 탭과 FCPS 상세에서 같은 기록을 사용한다. */
export const mockMissionHistory = [
  { leg: 'LEG 03 · 완료', name: '카페 지출 주 2회로 줄이기', days: '14일 수행', amount: 20000, startDate: '2026.07.01', endDate: '2026.07.14', delta: 18 },
  { leg: 'LEG 02 · 완료', name: '구독 서비스 2건 정리하기', days: '7일 수행', amount: 10000, startDate: '2026.06.15', endDate: '2026.06.21', delta: 18 },
  { leg: 'LEG 01 · 완료', name: '주간 예산 기록 습관 만들기', days: '7일 수행', amount: 0, startDate: '2026.06.01', endDate: '2026.06.07', delta: 18 },
];

export const FCPS_INITIAL_SCORE = 500;
const events = [
  { date: '2026.03.31', title: '3월 일일 예산 준수', description: '31일 중 24일 동안 설정한 일일 예산을 지켰어요.', delta: 20 },
  { date: '2026.04.30', title: '4월 소비 패턴 안정화', description: '주간 예산을 4주 연속 지키며 지출 편차를 줄였어요.', delta: 22 },
  { date: '2026.05.31', title: '목표 저축 3개월 연속 달성', description: '3월부터 5월까지 매달 계획한 목표 저축액을 채웠어요.', delta: 16 },
  ...[...mockMissionHistory].reverse().map((mission) => ({
    date: mission.endDate, title: mission.name,
    description: `${mission.startDate} ~ ${mission.endDate} · 미션 성공`, delta: mission.delta,
  })),
];

export const mockMileageHistory = events.map((event, index) => ({
  ...event,
  balance: FCPS_INITIAL_SCORE + events.slice(0, index + 1).reduce((sum, item) => sum + item.delta, 0),
}));

export function formatMissionDate(value?: string | null) {
  if (!value) return '날짜 미기록';
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(new Date(value)).replaceAll('-', '.');
}
