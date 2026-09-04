import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useJourney } from '../viewmodel/useJourney';
import { acctDefs } from '../data/personas';
import { phase2Start } from '../data/ucDefs';
import { Screen, Brand, TicketShell, CtaButton, Mascot } from '../components/ui';
import { AlertOverlay } from '../components/AlertOverlay';
import { GoalCompleteOverlay } from '../components/GoalCompleteOverlay';
import { color } from '../styles/theme';

export function HomeScreen() {
  const navigate = useNavigate();
  const { persona, P, fueled, spent, remaining, over, grade, dday, etaFull, etaNote, saved, savedPct, totalBalance } = useJourney();
  const deposit = useAppStore((s) => s.deposit);
  const alertOn = useAppStore((s) => s.alertOn);
  const missionOn = useAppStore((s) => s.missionOn);
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
        <div style={{ padding: '68px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
              <Brand size={23} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 15px', borderRadius: 9999, background: 'rgba(22,25,28,.12)', fontSize: 13, fontWeight: 900, whiteSpace: 'nowrap' }}>
                GOAL 0725 · {P.goalName} <span style={{ opacity: 0.5 }}>▾</span>
              </div>
            </div>
            <div
                onClick={() => navigate('/settings')}
                style={{ flex: 'none', width: 46, height: 46, cursor: 'pointer', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            >
              <img
                  src="/assets/dandi-hi.png" alt="단디"
                  style={{ height: 52, width: 'auto', display: 'block', animation: 'nod 3.2s ease-in-out infinite', filter: 'drop-shadow(0 5px 10px rgba(22,25,28,.18))' }}
              />
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>{over ? '항로를 벗어났어요,' : '순항 중입니다,'}</div>
          <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>{over ? '오늘 예산 초과' : '오늘도 예정대로'}</div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '16px 22px 120px' }}>
          <TicketShell
              watermark={{ width: 300, opacity: 0.13, zIndex: 2 }}
              top={
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.1em', color: 'rgba(22,25,28,.58)' }}>BOARDING PASS · TODAY</div>
                    <div style={{ flex: 'none', whiteSpace: 'nowrap', padding: '5px 11px', borderRadius: 9999, fontSize: 11.5, fontWeight: 900, background: over ? '#FFE2DA' : color.mintTintLight, color: over ? '#C4472A' : color.mintDark }}>
                      항로 {grade}
                    </div>
                  </div>
                  {/* NOW → GOAL 항로 (기존 컨셉 유지) */}
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-.04em' }}>START</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(22,25,28,.6)', marginTop: 1 }}>{AP.now}</div>
                    </div>
                    <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 15, animation: 'fly 3s ease-in-out infinite', color: over ? '#C4472A' : color.navy }}>✈</div>
                      <div style={{ width: 50, height: 2, background: 'repeating-linear-gradient(90deg,#C9D6D2 0 5px,transparent 5px 10px)' }} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-.03em', color: '#0A8873', whiteSpace: 'nowrap' }}>GOAL</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(22,25,28,.6)', marginTop: 1 }}>{etaFull}</div>
                    </div>
                  </div>

                  {/* 목표 진행 — 주인공: 큰 퍼센트 + 모은/목표 금액 */}
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
                        <span style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-.05em', lineHeight: 1, color: over ? '#C4472A' : '#0A8873' }}>{savedPct}</span>
                        <span style={{ fontSize: 22, fontWeight: 900, color: over ? '#C4472A' : '#0A8873' }}>%</span>
                      </div>
                    </div>
                    <div style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 16.5, fontWeight: 900, letterSpacing: '-.02em' }}>{saved}원</div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(22,25,28,.55)', marginTop: 1 }}>목표 {AP.target}</div>
                    </div>
                  </div>

                  {/* 굵은 진행 바 (NOW → GOAL) */}
                  <div style={{ marginTop: 12, position: 'relative', height: 18, borderRadius: 9999, background: '#E9ECEE', overflow: 'hidden' }}>
                    <div style={{ width: `${savedPct}%`, height: '100%', borderRadius: 9999, transition: 'width .6s ease', background: over ? '#C4472A' : 'linear-gradient(90deg,#0A8873,#00C7A9)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    </div>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>
                    <span></span>
                    {over || alertOn ? (
                        <span style={{ padding: '4px 10px', borderRadius: 9999, fontSize: 10.5, fontWeight: 900, whiteSpace: 'nowrap', background: '#FFE2DA', color: '#C4472A' }}>{AP.delayNote}</span>
                    ) : (
                        <span style={{ color: '#0A8873', fontWeight: 900 }}>{etaNote}</span>
                    )}
                    <span style={{ color: '#0A8873', fontWeight: 900 }}></span>
                  </div>
                </>
              }
              bottom={
                <>
                  {/* 오늘 예산 · D-day — 보조 정보(작게) */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '.06em', color: 'rgba(22,25,28,.55)' }}>
                        {over ? '오늘 예산 초과' : '오늘 남은 예산'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2, whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-.03em', color: over ? '#C4472A' : color.ink }}>
                      {over ? '-' + Math.abs(remaining).toLocaleString() : remaining.toLocaleString()}
                    </span>
                        <span style={{ fontSize: 13, fontWeight: 900 }}>원</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(22,25,28,.45)', marginLeft: 2 }}>/ 하루 {P.dailyBudget.toLocaleString()}</span>
                      </div>
                    </div>
                    <div style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.5)' }}>SEAT</div>
                      <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-.02em', marginTop: 1 }}>{dday}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, height: 8, borderRadius: 9999, background: '#EEF1F2', overflow: 'hidden' }}>
                    <div style={{ width: `${fuelPct}%`, height: '100%', borderRadius: 9999, transition: 'width .5s ease', background: over ? '#C4472A' : 'rgba(22,25,28,.28)' }} />
                  </div>
                  <CtaButton height={52} bg={color.ink} fg="#fff" arrowBg={color.mint} style={{ marginTop: 16, fontSize: 15 }} onClick={() => navigate('/detail')}>
                    {over ? '왜 이탈했는지 보기' : '여정 상세 보기'}
                  </CtaButton>
                </>
              }
          />

          {/* 급여 입금 알림 — 회복 완료 후 마지막 단계로만 노출 (분배 → 목표 달성) */}
          {recovered && !fueled && (
              <div
                  onClick={() => navigate('/salary')}
                  style={{
                    position: 'relative', marginTop: 16, borderRadius: 26, padding: '20px 22px', cursor: 'pointer', overflow: 'hidden',
                    background: `linear-gradient(120deg, ${color.mint} 0%, #0A8873 100%)`, color: '#fff',
                    boxShadow: '0 10px 26px rgba(0,199,169,.34)',
                  }}
              >
                {/* 반짝이는 데코 원 */}
                <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,.14)' }} />
                <div style={{ position: 'absolute', right: 34, bottom: -44, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,.10)' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 9999, background: 'rgba(255,255,255,.22)', fontSize: 11, fontWeight: 900, letterSpacing: '.04em' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', animation: 'ringPulse 1.4s infinite' }} />
                      방금 급여 입금 감지
                    </div>
                    <div style={{ marginTop: 10, fontSize: 22, fontWeight: 900, letterSpacing: '-.03em' }}>{AP.total}원 들어왔어요</div>
                    <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.82)' }}>3계좌로 자동 분배할까요?</div>
                    <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 9999, background: color.ink, color: '#fff', fontSize: 14, fontWeight: 900 }}>
                      분배 확인하기
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>›</span>
                    </div>
                  </div>
                  <img
                      src="/assets/dandi-cheer.png" alt="단디"
                      style={{ flex: 'none', width: 82, height: 'auto', display: 'block', alignSelf: 'flex-end', marginBottom: -20, marginRight: -4, filter: 'drop-shadow(0 8px 14px rgba(0,0,0,.18))', animation: 'bob 3.4s ease-in-out infinite' }}
                  />
                </div>
              </div>
          )}

          <div style={{ marginTop: 20, fontSize: 18, fontWeight: 900, letterSpacing: '-.02em' }}>진행 중인 항목</div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {missionOn && (
                <div onClick={() => navigate('/missions')} style={{ background: color.mint, borderRadius: 26, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', color: color.ink }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: color.ink, color: color.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>₩</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-.015em' }}>저축 보증금 {deposit.toLocaleString()}원 예치 중</div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, opacity: 0.6, marginTop: 2 }}>9/14일 진행 · 목표 달성 시 전액 환급</div>
                  </div>
                  <RowChevron />
                </div>
            )}

            <div onClick={() => navigate('/accounts')} style={{ background: '#fff', border: '1px solid rgba(22,25,28,.10)', borderRadius: 26, padding: '18px 20px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(22,25,28,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, background: fueled ? color.mint : 'rgba(22,25,28,.10)', color: color.ink }}>
                  {fueled ? '✓' : '▤'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 900, letterSpacing: '-.015em' }}>내 계좌 현황 · {totalBalance}원</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(22,25,28,.63)', marginTop: 2 }}>{fueled ? '오늘 07:12 · 3계좌 자동 분배' : '3계좌 · 자세히 보기'}</div>
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

            <div onClick={() => navigate('/mileage')} style={{ background: 'rgba(22,25,28,.09)', borderRadius: 26, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
              <div style={{ width: 60, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                <Mascot
                    name="ddokdi" pose="credit" height={64}
                    style={{ animation: 'nod 3.6s ease-in-out infinite', filter: 'drop-shadow(0 6px 12px rgba(22,25,28,.16))' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-.015em' }}>리워드 포인트 612점 <span style={{ color: '#077264' }}>+18</span></div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(22,25,28,.63)', marginTop: 2 }}>실버 등급 · 골드까지 88점</div>
              </div>
              <RowChevron />
            </div>
          </div>

          <div
              onClick={() => triggerPersonaAlert(persona)}
              style={{ marginTop: 18, height: 52, borderRadius: 9999, border: '1.5px dashed rgba(22,25,28,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13.5, fontWeight: 900, color: 'rgba(22,25,28,.66)', cursor: 'pointer' }}
          >
            데모 · {P.triggerLabel}
          </div>
          <div style={{ marginTop: 7, textAlign: 'center', fontSize: 11.5, fontWeight: 700, color: 'rgba(22,25,28,.5)' }}>실제 상황처럼 알림이 먼저 도착합니다</div>
          {showRecoverTrigger && (
              <div
                  onClick={() => navigate(`/uc/${phase2Start[persona]}`)}
                  style={{ marginTop: 12, height: 56, borderRadius: 9999, background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontSize: 15, fontWeight: 900, cursor: 'pointer' }}
              >
                데모 · 회복 미션 성공 확인
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: color.ink, color: color.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✓</span>
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
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(22,25,28,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>
        ›
      </div>
  );
}
