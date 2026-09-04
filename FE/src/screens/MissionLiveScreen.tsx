import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Pill } from '../components/ui';
import { missionDefs, personaDefs } from '../data/personas';
import { color } from '../styles/theme';

/** Live progress tracker for the persona's current recovery mission, opened from the missions list. */
export function MissionLiveScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const deposit = useAppStore((s) => s.deposit);
  const finishMission = useAppStore((s) => s.finishMission);
  const MI = missionDefs[persona];
  const P = personaDefs[persona];

  const daysLeft = Math.max(1, MI.daysTotal - MI.daysDone);
  const pct = Math.round((MI.daysDone / MI.daysTotal) * 100);

  const checks = [
    { label: '보증금', value: `${deposit.toLocaleString()}원` },
    { label: '기간', value: `${MI.daysTotal}일` },
    { label: '난이도', value: MI.difficulty },
    { label: '목표', value: P.goalName },
  ];

  return (
      <Screen>
        <div style={{ padding: '68px 22px 0', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pill onClick={() => navigate('/missions')}>‹ 미션</Pill>
            <Pill bg={color.mint} fg={color.ink}>진행 중</Pill>
          </div>
          <div style={{ marginTop: 18, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>{MI.leg}</div>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-.035em', lineHeight: 1.22, marginTop: 1 }}>
            {MI.title1}<br />{MI.title2}
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 120px', display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div style={{ background: color.ink, borderRadius: 30, padding: 24, color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: color.mint }}>남은 기간</div>
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-.04em' }}>{daysLeft}</span>
                  <span style={{ fontSize: 17, fontWeight: 900 }}>일</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 900, color: 'rgba(255,255,255,.66)' }}>{MI.daysDone} / {MI.daysTotal}일 수행</div>
            </div>
            <div style={{ marginTop: 16, height: 11, borderRadius: 9999, background: 'rgba(255,255,255,.16)', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', borderRadius: 9999, background: color.mint, transition: 'width .5s ease' }} />
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 30, padding: 24, display: 'flex', flexDirection: 'column', gap: 13 }}>
            {checks.map((c) => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: 'rgba(22,25,28,.62)' }}>{c.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-.015em' }}>{c.value}</span>
                </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: 30, padding: 24 }}>
            <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.58)' }}>지금 해야 하는 것</div>
            <div style={{ marginTop: 9, fontSize: 14.5, lineHeight: 1.7, fontWeight: 700 }}>{MI.how}</div>
          </div>
          <div style={{ background: 'rgba(22,25,28,.07)', borderRadius: 24, padding: 18, fontSize: 12.5, lineHeight: 1.7, fontWeight: 500, color: 'rgba(22,25,28,.62)' }}>
            결제·거래 데이터로 자동 확인되니 따로 인증하지 않아도 됩니다. 성공·실패·포기 어느 경우든 보증금 {deposit.toLocaleString()}원은 지갑으로 돌아오고, 결과만 FCPS에 기록됩니다.
          </div>

          {/* 데모: 미션 결과 처리 (성공 / 실패 / 포기) */}
          <div style={{ marginTop: 4, fontSize: 11.5, fontWeight: 900, letterSpacing: '.06em', color: 'rgba(22,25,28,.5)' }}>데모 · 미션 결과 처리</div>
          <div
              onClick={() => { finishMission('success'); navigate('/release'); }}
              style={{ height: 56, borderRadius: 9999, background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontSize: 15.5, fontWeight: 900, cursor: 'pointer' }}
          >
            미션 성공 · 보증금 반환
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: color.ink, color: color.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✓</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div
                onClick={() => { finishMission('fail'); navigate('/release'); }}
                style={{ flex: 1, height: 52, borderRadius: 9999, background: 'rgba(196,71,42,.1)', color: '#C4472A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14.5, fontWeight: 900, cursor: 'pointer' }}
            >
              미션 실패
            </div>
            <div
                onClick={() => { finishMission('give_up'); navigate('/release'); }}
                style={{ flex: 1, height: 52, borderRadius: 9999, background: 'rgba(22,25,28,.08)', color: 'rgba(22,25,28,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14.5, fontWeight: 900, cursor: 'pointer' }}
            >
              미션 포기
            </div>
          </div>
        </div>
      </Screen>
  );
}
