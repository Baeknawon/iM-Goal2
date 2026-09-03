import { useNavigate } from 'react-router-dom';
import { useJourney } from '../viewmodel/useJourney';
import { Screen, BackToHome, Pill, ScreenBody, ProgressBar } from '../components/ui';
import { paceTargets } from '../data/staticContent';
import { color } from '../styles/theme';

export function DetailScreen() {
  const navigate = useNavigate();
  const { P, AP, dday, saved, savedPct, leftLabel, delayed } = useJourney();

  return (
    <Screen>
      <div style={{ padding: '68px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackToHome />
          <Pill bg={color.mint} fg={color.ink}>{dday}</Pill>
        </div>
        <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>GOAL 0725 · {P.goalName}</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>여정 상세</div>
      </div>

      <ScreenBody>
        <div style={{ background: '#fff', borderRadius: 30, padding: 24, color: color.ink }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.58)' }}>모인 금액</div>
              <div style={{ marginTop: 3, fontSize: 30, fontWeight: 900, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{saved}원</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14 }}>
              <div style={{ flex: 'none', fontSize: 12.5, fontWeight: 900, color: 'rgba(22,25,28,.58)' }}>목표</div>
              <div style={{ flex: 'none', fontSize: 18, fontWeight: 900, whiteSpace: 'nowrap' }}>{AP.target}</div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <ProgressBar pct={savedPct} color={color.ink} />
          </div>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 900, color: 'rgba(22,25,28,.63)' }}>
            <span>{savedPct}% 비행</span><span>남은 {leftLabel}</span>
          </div>
        </div>

        <div style={{ marginTop: 14, background: 'rgba(22,25,28,.08)', borderRadius: 30, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: '#077264' }}>페이스 추이 · 주별 저축</div>
            <div style={{ padding: '5px 11px', borderRadius: 9999, background: 'rgba(203,224,75,.16)', fontSize: 11.5, fontWeight: 900, color: '#5A6608' }}>양호</div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'flex-end', height: 110 }}>
            {paceTargets.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1, height: `${h}%`, borderRadius: '8px 8px 0 0',
                  background: i === 7 ? color.mint : i === 5 ? 'rgba(201,160,82,.55)' : 'rgba(22,25,28,.16)',
                }}
              />
            ))}
          </div>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, color: 'rgba(22,25,28,.58)' }}>
            <span>6월 1주</span><span>목표 페이스</span><span>이번 주</span>
          </div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(22,25,28,.12)', display: 'flex', gap: 22 }}>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 900, color: 'rgba(22,25,28,.58)' }}>주 평균</div>
              <div style={{ fontSize: 19, fontWeight: 900, marginTop: 3 }}>{AP.weekAvg}</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 900, color: 'rgba(22,25,28,.58)' }}>필요 페이스</div>
              <div style={{ fontSize: 19, fontWeight: 900, marginTop: 3, color: '#077264' }}>{AP.needPace}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, background: color.ink, borderRadius: 30, padding: 24, color: '#fff' }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: delayed ? '#FF7A5C' : color.mint }}>AI 도착 예측</div>
          <div style={{ marginTop: 10, fontSize: 20, fontWeight: 900, letterSpacing: '-.025em', lineHeight: 1.45 }}>
            {delayed ? <>지금 페이스면<br />예정보다 늦게 도착합니다</> : <>지금 페이스면<br />예정보다 앞서 도착합니다</>}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,.1)', borderRadius: 20, padding: 16 }}>
              <div style={{ fontSize: 11.5, fontWeight: 900, color: 'rgba(255,255,255,.5)' }}>계획 도착</div>
              <div style={{ fontSize: 18, fontWeight: 900, marginTop: 3 }}>{AP.eta}</div>
            </div>
            {delayed ? (
              <div style={{ flex: 1, background: '#FF7A5C', borderRadius: 20, padding: 16, color: '#2B0B03' }}>
                <div style={{ fontSize: 11.5, fontWeight: 900, opacity: 0.6 }}>지연 도착</div>
                <div style={{ fontSize: 18, fontWeight: 900, marginTop: 3 }}>{AP.etaDelayed}</div>
              </div>
            ) : (
              <div style={{ flex: 1, background: color.mint, borderRadius: 20, padding: 16, color: color.ink }}>
                <div style={{ fontSize: 11.5, fontWeight: 900, opacity: 0.6 }}>예측 도착</div>
                <div style={{ fontSize: 18, fontWeight: 900, marginTop: 3 }}>{AP.etaFast}</div>
              </div>
            )}
          </div>
        </div>

        <div
          onClick={() => navigate('/salary')}
          style={{ marginTop: 14, background: 'rgba(22,25,28,.08)', borderRadius: 26, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: color.sky, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>급</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900 }}>급여 분배 설정</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(22,25,28,.63)', marginTop: 2 }}>매월 25일 · 3계좌 자동 분배</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(22,25,28,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>›</div>
        </div>
      </ScreenBody>
    </Screen>
  );
}
