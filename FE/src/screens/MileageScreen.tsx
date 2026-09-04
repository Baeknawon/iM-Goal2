import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Brand, Pill, ScreenBody } from '../components/ui';
import { fcpsFactors } from '../data/staticContent';
import { color } from '../styles/theme';

const trendBars = [44, 52, 49, 68, 84, 100];

export function MileageScreen() {
  const navigate = useNavigate();
  const fcpsLog = useAppStore((s) => s.fcpsLog);
  return (
      <Screen>
        <div style={{ padding: '60px 22px 0' }}>
          <Brand size={20} style={{ marginBottom: 12 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pill>최근 6개월</Pill>
            <Pill bg={color.mint} fg={color.ink}>✚ 확장 기능</Pill>
          </div>
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>신용조회 없이 쌓은,</div>
              <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>나의 마일리지</div>
            </div>
            <img
                src="/assets/ddokdi-credit.png" alt="신용을 살펴보는 똑디"
                style={{ flex: 'none', width: 118, height: 'auto', display: 'block', margin: '-8px 0 -14px 0' }}
            />
          </div>
        </div>

        <ScreenBody>
          <div style={{ position: 'relative' }}>
            <div style={{ background: color.mint, borderRadius: '28px 28px 0 0', padding: '22px 24px', color: color.ink }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.1em', opacity: 0.6 }}>CLIMB MILEAGE CLUB</div>
                <div style={{ padding: '5px 11px', borderRadius: 9999, background: color.ink, color: color.mint, fontSize: 11.5, fontWeight: 900 }}>SILVER</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-.055em' }}>612</span>
                <span style={{ fontSize: 15, fontWeight: 900 }}>FCPS · 3개월 +54</span>
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 7, alignItems: 'flex-end', height: 62 }}>
                {trendBars.map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '7px 7px 0 0', background: i === trendBars.length - 1 ? color.ink : `rgba(22,25,28,.${Math.min(63, 18 + i * 12)})` }} />
                ))}
              </div>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 900, opacity: 0.6 }}>
                <span>2월</span><span>7월</span>
              </div>
            </div>
            <div style={{ position: 'relative', height: 26, background: color.mint, display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
              <div style={{ position: 'absolute', right: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
              <div style={{ flex: 1, margin: '0 20px', height: 2, background: 'repeating-linear-gradient(90deg,rgba(22,25,28,.25) 0 6px,transparent 6px 12px)' }} />
            </div>
            <div style={{ background: color.mint, borderRadius: '0 0 28px 28px', padding: '20px 24px 24px', color: color.ink }}>
              <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', opacity: 0.6 }}>골드 등급까지</div>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-.03em' }}>88점</span>
                <span style={{ fontSize: 14, fontWeight: 900, opacity: 0.6 }}>남았어요</span>
              </div>
              <div style={{ marginTop: 12, height: 11, borderRadius: 9999, background: 'rgba(22,25,28,.15)', overflow: 'hidden' }}>
                <div style={{ width: '66%', height: '100%', background: color.ink }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, background: 'rgba(22,25,28,.08)', borderRadius: 28, padding: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.63)' }}>마일리지를 쌓은 행동</div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 15 }}>
              {fcpsFactors.map((f) => (
                  <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 900 }}>{f.name}</div>
                      <div style={{ marginTop: 8, height: 9, borderRadius: 9999, background: 'rgba(22,25,28,.14)', overflow: 'hidden' }}>
                        <div style={{ width: `${f.barPct}%`, height: '100%', borderRadius: 9999, background: f.good ? color.mint : '#6E7A0A' }} />
                      </div>
                    </div>
                    <span style={{ flex: 'none', whiteSpace: 'nowrap', fontSize: 12.5, fontWeight: 900, width: 64, textAlign: 'right', color: f.good ? '#077264' : '#6E7A0A' }}>{f.tag}</span>
                  </div>
              ))}
            </div>
          </div>

          {/* 보증금 미션 이력 (성공/실패/포기) — FCPS에 반영된 기록 */}
          {fcpsLog.length > 0 && (
              <div style={{ marginTop: 14, background: '#fff', borderRadius: 28, padding: 22, color: color.ink }}>
                <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.63)' }}>보증금 미션 이력 · FCPS 반영</div>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {fcpsLog.map((e, i) => {
                    const pos = e.delta >= 0;
                    const bg = e.result === 'success' ? color.mintTintLight : e.result === 'fail' ? color.coralTintLight : 'rgba(22,25,28,.06)';
                    const fg = e.result === 'success' ? '#077264' : e.result === 'fail' ? '#C4472A' : 'rgba(22,25,28,.6)';
                    return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ flex: 'none', padding: '5px 11px', borderRadius: 9999, background: bg, color: fg, fontSize: 11.5, fontWeight: 900 }}>{e.label}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '-.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.mission}</div>
                            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(22,25,28,.55)', marginTop: 1 }}>보증금 {e.deposit.toLocaleString()}원 반환</div>
                          </div>
                          <div style={{ flex: 'none', fontSize: 15, fontWeight: 900, color: pos ? '#077264' : '#C4472A' }}>{pos ? '+' : ''}{e.delta}</div>
                        </div>
                    );
                  })}
                </div>
              </div>
          )}

          <div onClick={() => navigate('/products')} style={{ marginTop: 14, background: color.sky, borderRadius: 28, padding: 22, color: color.ink, cursor: 'pointer' }}>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.1em', opacity: 0.55 }}>실버 등급 라운지</div>
            <div style={{ marginTop: 8, fontSize: 19, fontWeight: 900, letterSpacing: '-.025em', lineHeight: 1.4 }}>612점으로 열린<br />iM 상품 4개 보기</div>
            <div style={{ marginTop: 14, height: 50, borderRadius: 9999, background: color.navy, color: '#fff', fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              라운지 입장 <span style={{ width: 26, height: 26, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>›</span>
            </div>
          </div>

          <div style={{ marginTop: 14, fontSize: 12.5, lineHeight: 1.7, color: 'rgba(22,25,28,.58)' }}>FCPS는 공식 신용점수와 다르며, 동의 시 여신심사 보조자료로만 활용됩니다.</div>
        </ScreenBody>
      </Screen>
  );
}
