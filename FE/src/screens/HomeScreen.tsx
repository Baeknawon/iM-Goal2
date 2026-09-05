import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useJourney } from '../viewmodel/useJourney';
import { acctDefs } from '../data/personas';
import { phase2Start } from '../data/ucDefs';
import { Screen, Brand, TicketShell, CtaButton, Mascot } from '../components/ui';
import { AlertOverlay } from '../components/AlertOverlay';
import { GoalCompleteOverlay } from '../components/GoalCompleteOverlay';
import { RecoveryPlanCard } from '../components/RecoveryPlanCard';
import { color } from '../styles/theme';

export function HomeScreen() {
  const navigate = useNavigate();
  const { persona, P, fueled, spent, remaining, over, grade, dday, etaFull, etaNote, saved, savedPct, totalBalance } = useJourney();
  const deposit = useAppStore((s) => s.deposit);
  const alertOn = useAppStore((s) => s.alertOn);
  const missionOn = useAppStore((s) => s.missionOn);
  const latest = useAppStore((s) => s.fcpsLog[0]);
  const recovered = useAppStore((s) => s.recovered);
  const goalCompleteSeen = useAppStore((s) => s.goalCompleteSeen);
  const triggerPersonaAlert = useAppStore((s) => s.triggerPersonaAlert);

  const showRecoverTrigger = missionOn && !recovered && !alertOn;
  const showGoalComplete = fueled && !goalCompleteSeen && !alertOn;

  const AP = acctDefs[persona];
  const acctRows = fueled ? AP.post : AP.pre;
  const fuelPct = Math.min(100, Math.round((spent / 8000) * 100));

  return (
      <Screen>
        <div style={{ padding: '68px var(--screen-padding-x) 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--component-gap)', minWidth: 0 }}>
              <Brand size={23} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: '9px 15px', borderRadius: 'var(--radius-pill)', background: 'var(--color-30-surface-sub)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>
                GOAL 0725 · {P.goalName} <span style={{ opacity: 0.5 }}>▾</span>
              </div>
            </div>
            <div
                onClick={() => navigate('/settings')}
                style={{ flex: 'none', width: 46, height: 46, cursor: 'pointer', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            >
              <img
                  src="/assets/dandi-hi.png" alt="단디"
                  style={{ height: 52, width: 'auto', display: 'block', animation: 'nod 3.2s ease-in-out infinite', filter: 'drop-shadow(0 5px 10px rgba(var(--color-ink-rgb),.18))' }}
              />
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>{over ? '항로를 벗어났어요,' : '순항 중입니다,'}</div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>{over ? '오늘 예산 초과' : '오늘도 예정대로'}</div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-2) var(--screen-padding-x) 120px' }}>
          <TicketShell
              watermark={{ width: 300, opacity: 0.13, zIndex: 2 }}
              top={
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.1em', color: 'var(--color-60-text-secondary)' }}>BOARDING PASS · TODAY</div>
                    <div style={{ flex: 'none', whiteSpace: 'nowrap', padding: '5px 11px', borderRadius: 'var(--radius-pill)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', background: over ? 'var(--color-danger-surface)' : color.mintTintLight, color: over ? 'var(--color-danger)' : color.mintDark }}>
                      항로 {grade}
                    </div>
                  </div>
                  {/* NOW → GOAL 항로 (기존 컨셉 유지) */}
                  <div style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)' }}>START</div>
                      <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{AP.now}</div>
                    </div>
                    <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 'var(--font-size-sm)', animation: 'fly 3s ease-in-out infinite', color: over ? 'var(--color-danger)' : color.navy }}>✈</div>
                      <div style={{ width: 50, height: 2, background: 'repeating-linear-gradient(90deg,var(--color-60-border) 0 5px,transparent 5px 10px)' }} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', color: 'var(--color-accent-text)', whiteSpace: 'nowrap' }}>GOAL</div>
                      <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{etaFull}</div>
                    </div>
                  </div>

                  {/* 목표 진행 — 주인공: 큰 퍼센트 + 모은/목표 금액 */}
                  <div style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-1-5)' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 'var(--space-0-5)' }}>
                        <span style={{ fontSize: 52, fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 1, color: over ? 'var(--color-danger)' : 'var(--color-accent-text)' }}>{savedPct}</span>
                        <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: over ? 'var(--color-danger)' : 'var(--color-accent-text)' }}>%</span>
                      </div>
                    </div>
                    <div style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em' }}>{saved}원</div>
                      <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>목표 {AP.target}</div>
                    </div>
                  </div>

                  {/* 굵은 진행 바 (NOW → GOAL) */}
                  <div style={{ marginTop: 'var(--space-1-5)', position: 'relative', height: 18, borderRadius: 'var(--radius-pill)', background: 'var(--color-30-tab-bg)', overflow: 'hidden' }}>
                    <div style={{ width: `${savedPct}%`, height: '100%', borderRadius: 'var(--radius-pill)', transition: 'width .6s ease', background: over ? 'var(--color-danger)' : 'linear-gradient(90deg,var(--color-accent-text),var(--im-mint))', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    </div>
                  </div>
                  <div style={{ marginTop: 'var(--space-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>
                    <span></span>
                    {over || alertOn ? (
                        <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap', background: 'var(--color-danger-surface)', color: 'var(--color-danger)' }}>{AP.delayNote}</span>
                    ) : (
                        <span style={{ color: 'var(--color-accent-text)', fontWeight: 'var(--font-weight-bold)' }}>{etaNote}</span>
                    )}
                    <span style={{ color: 'var(--color-accent-text)', fontWeight: 'var(--font-weight-bold)' }}></span>
                  </div>
                </>
              }
              bottom={
                <>
                  {/* 오늘 예산 · D-day — 보조 정보(작게) */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-1-5)' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.06em', color: 'var(--color-60-text-secondary)' }}>
                        {over ? '오늘 예산 초과' : '오늘 남은 예산'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 'var(--space-0-5)', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', color: over ? 'var(--color-danger)' : color.ink }}>
                      {over ? '-' + Math.abs(remaining).toLocaleString() : remaining.toLocaleString()}
                    </span>
                        <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)' }}>원</span>
                        <span style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginLeft: 2 }}>/ 하루 {P.dailyBudget.toLocaleString()}</span>
                      </div>
                    </div>
                    <div style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>SEAT</div>
                      <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em', marginTop: 'var(--space-0-5)' }}>{dday}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, height: 8, borderRadius: 'var(--radius-pill)', background: 'var(--color-30-tab-bg)', overflow: 'hidden' }}>
                    <div style={{ width: `${fuelPct}%`, height: '100%', borderRadius: 'var(--radius-pill)', transition: 'width .5s ease', background: over ? 'var(--color-danger)' : 'rgba(var(--color-ink-rgb),.28)' }} />
                  </div>
                  <CtaButton height={52} bg="var(--color-action-bg)" fg="var(--color-action-text)" arrowBg="var(--color-action-text)" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }} onClick={() => navigate('/detail')}>
                    {over ? '왜 이탈했는지 보기' : '여정 상세 보기'}
                  </CtaButton>
                </>
              }
          />

          {recovered && !fueled && latest?.recoveryPlan && <div style={{ marginTop: 16 }}><RecoveryPlanCard plan={latest.recoveryPlan} success /><div className="recovery-note"><b>다음 행동: 절약 여유를 목표 저축으로 이어가세요</b><p>반환된 보증금은 기존 자금이에요. 목표 저축액은 아직 늘리지 않았습니다. 아래 분배 화면에서 계획을 확인하세요.</p></div></div>}
          {/* 급여 입금 알림 — 회복 완료 후 마지막 단계로만 노출 (분배 → 목표 달성) */}
          {recovered && !fueled && (
              <div
                  onClick={() => navigate('/salary')}
                  style={{
                    position: 'relative', marginTop: 'var(--space-2)', borderRadius: 'var(--radius-xl)', padding: '20px 22px', cursor: 'pointer', overflow: 'hidden',
                    background: 'var(--color-hero)', color: 'var(--im-white)',
                    boxShadow: '0 10px 26px rgba(var(--color-mint-rgb),.34)',
                  }}
              >
                {/* 반짝이는 데코 원 */}
                <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(var(--color-white-rgb),.14)' }} />
                <div style={{ position: 'absolute', right: 34, bottom: -44, width: 90, height: 90, borderRadius: '50%', background: 'rgba(var(--color-white-rgb),.10)' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--radius-pill)', background: 'rgba(var(--color-white-rgb),.22)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.04em' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-60-bg-surface)', animation: 'ringPulse 1.4s infinite' }} />
                      방금 급여 입금 감지
                    </div>
                    <div style={{ marginTop: 10, fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)' }}>{AP.total}원 들어왔어요</div>
                    <div style={{ marginTop: 4, fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-on-dark-muted)' }}>3계좌로 자동 분배할까요?</div>
                    <div style={{ marginTop: 'var(--space-1-5)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', padding: '9px 16px', borderRadius: 'var(--radius-pill)', background: 'var(--color-hero)', color: 'var(--im-white)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                      분배 확인하기
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-xs)' }}>›</span>
                    </div>
                  </div>
                  <img
                      src="/assets/dandi-cheer.png" alt="단디"
                      style={{ flex: 'none', width: 82, height: 'auto', display: 'block', alignSelf: 'flex-end', marginBottom: -20, marginRight: -4, filter: 'drop-shadow(0 8px 14px rgba(var(--color-ink-rgb),.18))', animation: 'bob 3.4s ease-in-out infinite' }}
                  />
                </div>
              </div>
          )}

          <div style={{ marginTop: 'var(--space-2-5)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em' }}>진행 중인 항목</div>
          <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', flexDirection: 'column', gap: 'var(--component-gap)' }}>
            {missionOn && (
                <div onClick={() => navigate('/missions')} style={{ background: color.mintTint, borderRadius: 'var(--radius-xl)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)', cursor: 'pointer', color: color.ink }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-hero)', color: color.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>₩</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.015em' }}>저축 보증금 {deposit.toLocaleString()}원 예치 중</div>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', opacity: 0.6, marginTop: 'var(--space-0-5)' }}>9/14일 진행 · 목표 달성 시 전액 환급</div>
                  </div>
                  <RowChevron />
                </div>
            )}

            <div onClick={() => navigate('/accounts')} style={{ background: 'var(--color-60-bg-surface)', border: '1px solid var(--color-60-border)', borderRadius: 'var(--radius-xl)', padding: '18px 20px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(var(--color-ink-rgb),.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)' }}>
                <div style={{ flex: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', background: fueled ? color.mint : 'rgba(var(--color-ink-rgb),.10)', color: color.ink }}>
                  {fueled ? '✓' : '▤'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-.015em' }}>내 계좌 현황 · {totalBalance}원</div>
                  <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{fueled ? '오늘 07:12 · 3계좌 자동 분배' : '3계좌 · 자세히 보기'}</div>
                </div>
                {/* 계좌 색점 미니 요약 */}
                <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {acctRows.map((a) => (
                      <div key={a.name} style={{ width: 9, height: 9, borderRadius: 3, background: a.dotColor }} />
                  ))}
                </div>
                <RowChevron />
              </div>
            </div>

            <div onClick={() => navigate('/mileage')} style={{ background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)', cursor: 'pointer' }}>
              <div style={{ width: 60, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                <Mascot
                    name="ddokdi" pose="credit" height={64}
                    style={{ animation: 'nod 3.6s ease-in-out infinite', filter: 'drop-shadow(0 6px 12px rgba(var(--color-ink-rgb),.16))' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.015em' }}>리워드 포인트 612점 <span style={{ color: 'var(--color-accent-text)' }}>+18</span></div>
                <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>실버 등급 · 골드까지 88점</div>
              </div>
              <RowChevron />
            </div>
          </div>

          <div
              onClick={() => triggerPersonaAlert(persona)}
              style={{ marginTop: 18, height: 52, borderRadius: 'var(--radius-pill)', border: '1.5px dashed var(--color-60-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', cursor: 'pointer' }}
          >
            데모 · {P.triggerLabel}
          </div>
          <div style={{ marginTop: 7, textAlign: 'center', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>실제 상황처럼 알림이 먼저 도착합니다</div>
          {showRecoverTrigger && (
              <div
                  onClick={() => navigate(`/uc/${phase2Start[persona]}`)}
                  style={{ minHeight: 'var(--btn-height-xl)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',  marginTop: 'var(--space-1-5)', height: 'var(--btn-height-xl)', borderRadius: 'var(--radius-lg)', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--component-gap)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer' }}
              >
                데모 · 회복 미션 성공 확인
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-hero)', color: color.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)' }}>✓</span>
              </div>
          )}
        </div>

        {alertOn && <AlertOverlay />}
        {showGoalComplete && <GoalCompleteOverlay />}
      </Screen>
  );
}

function RowChevron() {
  return (
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-30-surface-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
        ›
      </div>
  );
}
