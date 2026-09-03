import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Brand } from '../components/ui';
import { missionDefs } from '../data/personas';
import { color } from '../styles/theme';

interface Ticket {
  leg: string;
  name: string;
  days: string;
  amount: number;
  status: string;
  live: boolean;
  go: string;
}

/** 미션 tab: every recovery mission (deposit-backed "LEG" tickets) — the current one plus completed history. */
export function MissionsScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const deposit = useAppStore((s) => s.deposit);
  const missionOn = useAppStore((s) => s.missionOn);
  const MI = missionDefs[persona];

  const tickets: Ticket[] = [
    ...(missionOn
      ? [{
          leg: MI.leg, name: `${MI.title1} ${MI.title2}`, days: `D-${Math.max(1, MI.daysTotal - MI.daysDone)}`,
          amount: deposit, status: '예치 중', live: true, go: '/missionLive',
        }]
      : []),
    { leg: 'LEG 03 · 완료', name: '카페 지출 주 2회로 줄이기', days: '14일 수행', amount: 20000, status: '전액 환원', live: false, go: '/release' },
    { leg: 'LEG 02 · 완료', name: '구독 서비스 2건 정리하기', days: '7일 수행', amount: 10000, status: '전액 환원', live: false, go: '/release' },
    { leg: 'LEG 01 · 완료', name: '주간 예산 기록 습관 만들기', days: '7일 수행', amount: 0, status: '보증금 없음', live: false, go: '/release' },
  ];

  return (
    <Screen>
      <div style={{ padding: '60px 22px 0', flex: 'none' }}>
        <Brand size={20} style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>약속하고, 지키고, 돌려받기</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>회복 미션</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 120px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {missionOn && <div style={{ fontSize: 12.5, fontWeight: 900, letterSpacing: '.06em', color: 'rgba(22,25,28,.58)' }}>진행 중</div>}
        {tickets.map((t) => (
          <div
            key={t.leg}
            onClick={() => navigate(t.go)}
            style={{ position: 'relative', display: 'flex', alignItems: 'stretch', borderRadius: 20, cursor: 'pointer', background: t.live ? color.ink : '#fff', color: t.live ? '#fff' : color.ink }}
          >
            <div style={{ flex: 1, minWidth: 0, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: '.06em', color: t.live ? color.mint : 'rgba(22,25,28,.55)' }}>{t.leg}</div>
              <div style={{ fontSize: 15.5, fontWeight: 900, letterSpacing: '-.02em', lineHeight: 1.35 }}>{t.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 2 }}>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 700, opacity: 0.6 }}>{t.days}</span>
                <span style={{ flex: 'none', fontSize: 11.5, fontWeight: 900, color: t.live ? color.mint : color.mintDark }}>{t.status}</span>
              </div>
            </div>
            <div style={{ position: 'relative', flex: 'none', width: 2, margin: '12px 0', background: `repeating-linear-gradient(180deg,${t.live ? 'rgba(255,255,255,.34)' : 'rgba(22,25,28,.20)'} 0 5px,transparent 5px 10px)` }}>
              <div style={{ position: 'absolute', left: -8, top: -20, width: 18, height: 18, borderRadius: '50%', background: color.bg }} />
              <div style={{ position: 'absolute', left: -8, bottom: -20, width: 18, height: 18, borderRadius: '50%', background: color.bg }} />
            </div>
            <div style={{ flex: 'none', width: 88, borderRadius: '0 20px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '16px 0', background: t.live ? color.mint : 'rgba(22,25,28,.06)', color: color.ink }}>
              <div style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: '.1em', opacity: 0.6 }}>DEPOSIT</div>
              <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-.02em' }}>{t.amount > 0 ? `${t.amount.toLocaleString()}원` : '—'}</div>
              <div style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: '.08em', opacity: 0.55 }}>iMKRW</div>
            </div>
          </div>
        ))}
        <div style={{ background: 'rgba(22,25,28,.07)', borderRadius: 24, padding: 18, fontSize: 12.5, lineHeight: 1.7, fontWeight: 500, color: 'rgba(22,25,28,.62)' }}>
          보증금은 벌칙이 아닙니다. 기한 내 수행하면 전액 돌려받고, 실패해도 소각 없이 내 목표 계좌로 옮겨집니다.
        </div>
      </div>
    </Screen>
  );
}
