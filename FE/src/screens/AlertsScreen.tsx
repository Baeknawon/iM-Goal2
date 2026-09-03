import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Brand, Pill } from '../components/ui';
import { alertDefs, personaDefs } from '../data/personas';
import { color } from '../styles/theme';

type Kind = 'warn' | 'quiz' | 'ok' | 'info';

/** 알림 tab: full notification list (route/mission/product/quiz alerts), replacing the old single-alert jump. */
export function AlertsScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const AL = alertDefs[persona];
  const P = personaDefs[persona];

  const rows: { title: string; body: string; time: string; kind: Kind; icon: string; go: string }[] = [
    { title: '경로 이탈 경고', body: AL.tag, time: '방금', kind: 'warn', icon: '◍', go: '/cause' },
    { title: '경제 퀴즈 도착', body: '오늘의 1문제 · 맞히면 마일리지 +5점', time: '10분 전', kind: 'quiz', icon: '?', go: '/quiz' },
    { title: '하루 예산 초과', body: `오늘 ${P.dailyBudget.toLocaleString()}원 중 초과 사용이 감지됐어요`, time: '1시간 전', kind: 'warn', icon: '!', go: '/calendar' },
    { title: '급여 입금·자동 분배 완료', body: '입금 감지 후 3개 계좌로 자동 분배했어요', time: '어제', kind: 'ok', icon: '✓', go: '/salary' },
    { title: '마일리지 적립·등급 변동', body: 'FCPS 실버 612점 · 골드까지 88점', time: '어제', kind: 'info', icon: '◆', go: '/mileage' },
    { title: '상품 추천 도착', body: '자격이 맞는 iM 상품 4종을 찾았어요', time: '2일 전', kind: 'info', icon: '★', go: '/products' },
    { title: '목표 달성 임박', body: '남은 금액이 10% 아래로 내려왔어요', time: '3일 전', kind: 'ok', icon: '✈', go: '/detail' },
  ];

  return (
    <Screen>
      <div style={{ padding: '60px 22px 0', flex: 'none' }}>
        <Brand size={20} style={{ marginBottom: 12 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>놓치면 안 되는 것만,</div>
          <Pill bg="#C4472A" fg="#fff">새 알림 3</Pill>
        </div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>알림</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 120px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((a) => {
          const isQ = a.kind === 'quiz';
          const isW = a.kind === 'warn';
          const big = isQ || isW;
          const c = isW ? '#C4472A' : isQ ? color.purple : a.kind === 'ok' ? color.mintDark : color.ink;
          return (
            <div
              key={a.title}
              onClick={() => navigate(a.go)}
              style={{
                display: 'flex', gap: 14, alignItems: 'flex-start', borderRadius: 26, padding: big ? 22 : '18px 20px', cursor: 'pointer',
                background: isQ ? color.purple : '#fff', color: isQ ? '#fff' : color.ink,
                boxShadow: isW ? `0 0 0 2px #C4472A` : undefined,
              }}
            >
              <div
                style={{
                  flex: 'none', width: big ? 46 : 38, height: big ? 46 : 38, borderRadius: big ? 16 : 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: big ? 19 : 16, fontWeight: 900,
                  background: isQ ? '#fff' : c, color: isQ ? color.purple : '#fff',
                }}
              >
                {a.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ flex: 1, fontSize: big ? 17 : 15, fontWeight: 900, letterSpacing: '-.02em' }}>{a.title}</span>
                  <span style={{ flex: 'none', fontSize: 11.5, fontWeight: 900, color: isQ ? 'rgba(255,255,255,.62)' : 'rgba(22,25,28,.5)' }}>{a.time}</span>
                </div>
                <div style={{ marginTop: 5, fontSize: big ? 13.5 : 13, lineHeight: 1.6, fontWeight: 700, color: isQ ? 'rgba(255,255,255,.78)' : 'rgba(22,25,28,.62)' }}>{a.body}</div>
                {big && (
                  <div
                    style={{
                      marginTop: 14, height: 46, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      fontSize: 14.5, fontWeight: 900, background: isQ ? color.mint : color.ink, color: isQ ? color.ink : '#fff',
                    }}
                  >
                    {isQ ? '풀러 가기' : '원인 보러 가기'} ›
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
