import { useJourney } from '../viewmodel/useJourney';
import { Screen, Pill, ScreenBody } from '../components/ui';
import { verifyGates } from '../data/staticContent';
import { verifyImpactDefs } from '../data/personas';
import { color } from '../styles/theme';

export function VerifyScreen() {
  const { persona, P, AP, remaining, over } = useJourney();
  const impact = verifyImpactDefs[persona];
  return (
    <Screen bg="#EDEFF1">
      <div style={{ padding: '68px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill bg={color.mint} fg={color.ink}>회복 진행 중</Pill>
          <Pill bg="rgba(22,25,28,.14)">✚ 확장 기능</Pill>
        </div>
        <div style={{ marginTop: 18, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>미션 완료 ≠ 도착,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>미션 검증 3단계</div>
      </div>

      <ScreenBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {verifyGates.map((l) => (
            <div
              key={l.level}
              style={{
                borderRadius: 28, padding: 22, color: color.ink,
                background: l.passed ? 'rgba(201,160,82,.12)' : 'rgba(22,25,28,.08)',
                border: `1px solid ${l.passed ? 'rgba(201,160,82,.4)' : 'rgba(22,25,28,.12)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div
                  style={{
                    flex: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 900, background: l.passed ? color.mint : 'rgba(22,25,28,.14)', color: l.passed ? color.ink : 'rgba(22,25,28,.6)',
                  }}
                >
                  {l.passed ? '✓' : '3'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', opacity: 0.55 }}>{l.level}</div>
                  <div style={{ marginTop: 3, fontSize: 17, fontWeight: 900, letterSpacing: '-.02em' }}>{l.title}</div>
                </div>
                <div
                  style={{
                    flex: 'none', whiteSpace: 'nowrap', padding: '7px 13px', borderRadius: 9999, fontSize: 12, fontWeight: 900,
                    background: l.passed ? color.mint : 'rgba(22,25,28,.14)', color: l.passed ? color.ink : 'rgba(22,25,28,.7)',
                  }}
                >
                  {l.tag}
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.65, opacity: 0.7 }}>{l.body}</div>
              <div style={{ marginTop: 14, height: 8, borderRadius: 9999, background: 'rgba(22,25,28,.14)', overflow: 'hidden' }}>
                <div style={{ width: `${l.barPct}%`, height: '100%', borderRadius: 9999, background: color.mint }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, background: '#fff', borderRadius: 28, padding: 22, color: color.ink }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.58)' }}>탑승 전후 비교</div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 13 }}>
            <CompareRow label={impact.label} value={impact.value} />
            <CompareRow
              label="하루 예산"
              value={`${(over ? '-' + Math.abs(remaining).toLocaleString() : remaining.toLocaleString())} → ${P.dailyBudget.toLocaleString()}원`}
            />
            <CompareRow label="도착 예정일" value={`${AP.etaDelayed} → ${AP.etaFast}`} accent />
          </div>
        </div>

        <div style={{ marginTop: 14, borderRadius: 28, border: '1.5px dashed rgba(203,224,75,.5)', background: 'rgba(203,224,75,.08)', padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', width: 104, height: 84, flex: 'none', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2 }}>
            <img src="/assets/dandi-jump.png" alt="단디" style={{ height: 80, width: 'auto', display: 'block', animation: 'hop 2.6s ease-in-out infinite', transformOrigin: 'bottom center', filter: 'drop-shadow(0 8px 14px rgba(22,25,28,.14))' }} />
            <img src="/assets/ddokdi-jump.png" alt="똑디" style={{ height: 92, width: 'auto', display: 'block', animation: 'hop 2.6s ease-in-out .34s infinite', transformOrigin: 'bottom center', filter: 'drop-shadow(0 8px 14px rgba(22,25,28,.14))' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: '.08em', color: '#077264' }}>단디 · 똑디</div>
            <div style={{ marginTop: 6, fontSize: 15, fontWeight: 900, lineHeight: 1.45 }}>3단계 검증 통과 순간<br />축하 점프 0.8초</div>
          </div>
        </div>

        <div style={{ marginTop: 14, fontSize: 12.5, lineHeight: 1.65, color: 'rgba(22,25,28,.61)' }}>
          지속 기간 중 이탈이 재발하면 "재개입 필요"로 바뀌고 새 구간이 만들어집니다.
        </div>
      </ScreenBody>
    </Screen>
  );
}

function CompareRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontSize: 14.5, fontWeight: 700, opacity: 0.65 }}>{label}</span>
      <span style={{ flex: 'none', whiteSpace: 'nowrap', fontSize: 16, fontWeight: 900, color: accent ? '#0A8873' : undefined }}>{value}</span>
    </div>
  );
}
