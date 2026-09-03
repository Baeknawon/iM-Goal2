import { useNavigate } from 'react-router-dom';
import { useJourney } from '../viewmodel/useJourney';
import { Screen, BackToHome, Pill, ScreenBody, CtaButton } from '../components/ui';
import { causesByPersona } from '../data/personas';
import { color } from '../styles/theme';

export function CauseScreen() {
  const navigate = useNavigate();
  const { persona, P, AP, remaining, over } = useJourney();
  const causes = causesByPersona[persona];
  return (
    <Screen bg="#EDEFF1">
      <div style={{ padding: '68px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackToHome />
          <Pill bg="#FF7A5C" fg="#2B0B03">✚ 확장 기능</Pill>
        </div>
        <div style={{ marginTop: 18, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>난기류 원인을 분석했어요,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>왜 이탈했나요?</div>
      </div>

      <ScreenBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {causes.map((c) => (
            <div key={c.rank} style={{ borderRadius: 26, padding: 20, background: c.highlighted ? '#fff' : 'rgba(22,25,28,.09)', color: color.ink }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div
                  style={{
                    flex: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 900, background: c.highlighted ? '#C4472A' : 'rgba(22,25,28,.14)', color: c.highlighted ? '#fff' : color.ink,
                  }}
                >
                  {c.rank}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16.5, fontWeight: 900, letterSpacing: '-.015em' }}>{c.name}</div>
                  <div style={{ marginTop: 3, fontSize: 12.5, fontWeight: 700, opacity: 0.55 }}>{c.type} · 기여도 {c.weight}</div>
                </div>
                <div style={{ flex: 'none', whiteSpace: 'nowrap', fontSize: 15, fontWeight: 900, color: '#C4472A' }}>{c.delta}</div>
              </div>
              <div style={{ marginTop: 14, height: 9, borderRadius: 9999, overflow: 'hidden', background: c.highlighted ? '#F0EAE8' : 'rgba(22,25,28,.14)' }}>
                <div style={{ width: `${c.barPct}%`, height: '100%', borderRadius: 9999, background: c.highlighted ? '#C4472A' : 'rgba(22,25,28,.61)' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, background: 'rgba(22,25,28,.09)', borderRadius: 28, padding: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: '#077264' }}>1순위 원인이 항로에 미친 영향</div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(22,25,28,.66)' }}>하루 예산</div>
              <div style={{ marginTop: 5, display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 21, fontWeight: 900, color: 'rgba(22,25,28,.56)' }}>{P.dailyBudget.toLocaleString()}원</span>
                <span style={{ color: 'rgba(22,25,28,.56)' }}>→</span>
                <span style={{ fontSize: 26, fontWeight: 900, color: '#D0512E' }}>
                  {over ? '-' + Math.abs(remaining).toLocaleString() : remaining.toLocaleString()}원
                </span>
              </div>
            </div>
            <div style={{ height: 1, background: 'rgba(22,25,28,.12)' }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(22,25,28,.66)' }}>도착 예정일</div>
              <div style={{ marginTop: 5, display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 21, fontWeight: 900, color: 'rgba(22,25,28,.56)' }}>{AP.eta}</span>
                <span style={{ color: 'rgba(22,25,28,.56)' }}>→</span>
                <span style={{ fontSize: 26, fontWeight: 900, color: '#D0512E' }}>{AP.etaDelayed}</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 13, fontWeight: 900, color: '#D0512E' }}>{AP.delayNote}</div>
            </div>
          </div>
        </div>

        <CtaButton height={62} style={{ marginTop: 16 }} onClick={() => navigate('/missionDetail')}>항로 복귀 미션 받기</CtaButton>
        <div style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.65, fontWeight: 700, color: 'rgba(22,25,28,.61)' }}>
          기여도 차이가 작은 원인은 상위 항목으로 묶어 보여줍니다. 이 수치는 공식 신용점수 산정에 사용되지 않습니다.
        </div>
      </ScreenBody>
    </Screen>
  );
}
