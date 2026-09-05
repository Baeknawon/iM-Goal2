import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Brand, Pill, ScreenBody } from '../components/ui';
import { fcpsFactors } from '../data/staticContent';
import { color } from '../styles/theme';
import { calculateFcps } from '../viewmodel/fcpsScore';

const trendBars = [44, 52, 49, 68, 84, 100];

export function MileageScreen() {
  const navigate = useNavigate();
  const fcpsLog = useAppStore((s) => s.fcpsLog);
  const score = calculateFcps(fcpsLog);
  return (
      <Screen>
        <div style={{ padding: '60px var(--screen-padding-x) 0' }}>
          <Brand size={20} style={{ marginBottom: 'var(--space-1-5)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pill>최근 6개월</Pill>
            <Pill bg={color.mint} fg={color.ink}>✚ 확장 기능</Pill>
          </div>
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'flex-end', gap: 'var(--component-gap)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>신용조회 없이 쌓은,</div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>나의 마일리지</div>
            </div>
            <img
                src="/assets/ddokdi-credit.png" alt="신용을 살펴보는 똑디"
                style={{ flex: 'none', width: 118, height: 'auto', display: 'block', margin: '-8px 0 -14px 0' }}
            />
          </div>
        </div>

        <ScreenBody>
          <div style={{ position: 'relative' }}>
            <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: '24px 24px 0 0', padding: '22px 24px', color: color.ink, border: '1px solid var(--color-60-border)', borderBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="credit-score-label">FCPS 점수</div>
                <div style={{ padding: '5px 11px', borderRadius: 'var(--radius-pill)', background: 'var(--color-30-tab-bg)', color: 'var(--color-accent-text)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)' }}>{score.total >= 700 ? 'GOLD' : 'SILVER'} · 데모</div>
              </div>
              <div className="credit-score">
                <strong>{score.total}</strong>
                <span>점</span>
              </div>
              <div className="credit-score-description">예산 준수와 미션 이력으로 쌓은<br />금융 행동 점수예요.</div>
              <div className="credit-score-gain">이번 시연 {score.change >= 0 ? '+' : ''}{score.change}점</div>
              <button type="button" className="fcps-detail-link" onClick={() => navigate('/fcps')}>점수가 어떻게 쌓였나요? <span aria-hidden="true">›</span></button>
              <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', gap: 7, alignItems: 'flex-end', height: 62 }}>
                {trendBars.map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '7px 7px 0 0', background: i === trendBars.length - 1 ? 'var(--im-mint)' : i > 2 ? 'var(--color-chart-muted)' : 'var(--color-chart-track)' }} />
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-1)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: color.textSecondary }}>
                <span>2월 · 예시 추이</span><span>7월</span>
              </div>
            </div>
            <div style={{ position: 'relative', height: 26, background: 'var(--color-60-bg-surface)', display: 'flex', alignItems: 'center', borderLeft: '1px solid var(--color-60-border)', borderRight: '1px solid var(--color-60-border)' }}>
              <div style={{ position: 'absolute', left: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
              <div style={{ position: 'absolute', right: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
              <div style={{ flex: 1, margin: '0 20px', height: 2, background: 'repeating-linear-gradient(90deg,rgba(var(--color-ink-rgb),.25) 0 6px,transparent 6px 12px)' }} />
            </div>
            <div style={{ background: 'var(--color-30-surface-sub)', borderRadius: '0 0 24px 24px', padding: '20px 24px 24px', color: color.ink, border: '1px solid var(--color-60-border)', borderTop: 0 }}>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: color.textPrimary }}>골드 등급까지</div>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)' }}>{Math.max(0, 700 - score.total)}점</span>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: color.textSecondary }}>남았어요</span>
              </div>
              <div style={{ marginTop: 'var(--space-1-5)', height: 11, borderRadius: 'var(--radius-pill)', background: 'var(--color-chart-track)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.max(0, Math.min(100, score.total / 700 * 100))}%`, height: '100%', background: color.mint }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', border: '1px solid var(--color-60-border)' }}>
            <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: color.textPrimary }}>마일리지를 쌓은 행동</div>
            <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 15 }}>
              {fcpsFactors.map((f) => (
                  <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>{f.name}</div>
                      <div style={{ marginTop: 'var(--space-1)', height: 9, borderRadius: 'var(--radius-pill)', background: 'var(--color-chart-track)', overflow: 'hidden' }}>
                        <div style={{ width: `${f.barPct}%`, height: '100%', borderRadius: 'var(--radius-pill)', background: f.good ? color.mint : 'var(--color-lime-text)' }} />
                      </div>
                    </div>
                    <span style={{ flex: 'none', whiteSpace: 'nowrap', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', width: 64, textAlign: 'right', color: f.good ? 'var(--color-accent-text)' : 'var(--color-lime-text)' }}>{f.tag}</span>
                  </div>
              ))}
            </div>
          </div>

          {/* 보증금 미션 이력 (성공/실패/포기) — FCPS에 반영된 기록 */}
          {fcpsLog.length > 0 && (
              <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', color: color.ink }}>
                <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>보증금 미션 이력 · FCPS 반영</div>
                <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
                  {fcpsLog.map((e, i) => {
                    const pos = e.delta >= 0;
                    const bg = e.result === 'success' ? color.mintTintLight : e.result === 'fail' ? color.coralTintLight : 'rgba(var(--color-ink-rgb),.06)';
                    const fg = e.result === 'success' ? 'var(--color-accent-text)' : e.result === 'fail' ? 'var(--color-danger)' : 'var(--color-60-text-secondary)';
                    return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)' }}>
                          <div style={{ flex: 'none', padding: '5px 11px', borderRadius: 'var(--radius-pill)', background: bg, color: fg, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)' }}>{e.label}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.mission}</div>
                            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>보증금 {e.deposit.toLocaleString()}원 반환</div>
                          </div>
                          <div style={{ flex: 'none', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: pos ? 'var(--color-accent-text)' : 'var(--color-danger)' }}>{pos ? '+' : ''}{e.delta}</div>
                        </div>
                    );
                  })}
                </div>
              </div>
          )}

          <div onClick={() => navigate('/products')} style={{ marginTop: 'var(--space-1-5)', background: color.white, border: '1px solid var(--color-60-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', color: color.ink, cursor: 'pointer' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: color.textSecondary }}>iM 상품 라운지</div>
            <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.025em', lineHeight: 1.4 }}>나에게 맞는<br />iM 상품 살펴보기</div>
            <div style={{ minHeight: 'var(--btn-height-lg)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',  marginTop: 'var(--space-1-5)', height: 'var(--btn-height-lg)', borderRadius: 'var(--radius-lg)', background: color.action, color: color.onAction, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--component-gap)' }}>
              라운지 입장 <span style={{ width: 26, height: 26, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)' }}>›</span>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-xs)', lineHeight: 1.7, color: color.textSecondary }}>FCPS는 공식 신용점수와 다르며, 동의 시 여신심사 보조자료로만 활용됩니다.</div>
        </ScreenBody>
      </Screen>
  );
}

