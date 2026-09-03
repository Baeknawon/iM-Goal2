import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useJourney } from '../viewmodel/useJourney';
import { acctDefs } from '../data/personas';
import { phase2Start } from '../data/ucDefs';
import { Screen, Brand, TicketShell, CtaButton, BarcodeStrip, Mascot } from '../components/ui';
import { AlertOverlay } from '../components/AlertOverlay';
import { GoalCompleteOverlay } from '../components/GoalCompleteOverlay';
import { color } from '../styles/theme';

export function HomeScreen() {
  const navigate = useNavigate();
  const { persona, P, fueled, spent, remaining, over, grade, dday, eta, etaFull, etaNote, saved, savedPct } = useJourney();
  const deposit = useAppStore((s) => s.deposit);
  const alertOn = useAppStore((s) => s.alertOn);
  const big = useAppStore((s) => s.big);
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
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-.04em' }}>NOW</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(22,25,28,.63)', marginTop: 1 }}>{AP.now}</div>
                </div>
                <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 17, animation: 'fly 3s ease-in-out infinite', color: over ? '#C4472A' : color.navy }}>✈</div>
                  <div style={{ width: 56, height: 2, background: 'repeating-linear-gradient(90deg,#C9D6D2 0 5px,transparent 5px 10px)' }} />
                  <div style={{ padding: '3px 9px', borderRadius: 9999, fontSize: 10.5, fontWeight: 900, whiteSpace: 'nowrap', background: over ? '#FFE2DA' : color.mintTintLight, color: over ? '#C4472A' : color.mintDark }}>{eta}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-.03em', color: '#0A8873', whiteSpace: 'nowrap' }}>GOAL</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(22,25,28,.63)', marginTop: 1 }}>{etaFull}</div>
                </div>
              </div>
              <div style={{ marginTop: 18, height: 11, borderRadius: 9999, background: '#E9ECEE', overflow: 'hidden' }}>
                <div style={{ width: `${savedPct}%`, height: '100%', borderRadius: 9999, transition: 'width .6s ease', background: over ? '#C4472A' : color.navy }} />
              </div>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: 'rgba(22,25,28,.63)' }}>
                <span>{saved} · {savedPct}% 비행</span>
                {over || alertOn ? (
                  <span style={{ padding: '5px 11px', borderRadius: 9999, fontSize: 11, fontWeight: 900, whiteSpace: 'nowrap', background: '#FFE2DA', color: '#C4472A' }}>{AP.delayNote}</span>
                ) : (
                  <span>{etaNote}</span>
                )}
              </div>
            </>
          }
          bottom={
            <>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.58)' }}>
                    {over ? '오늘 예산 초과' : `오늘 남은 예산 (하루 ${P.dailyBudget.toLocaleString()}원)`}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 3, whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: big ? 44 : 34, fontWeight: 900, letterSpacing: '-.04em', transition: 'font-size .2s ease', color: over ? '#C4472A' : color.ink }}>
                      {over ? '-' + Math.abs(remaining).toLocaleString() : remaining.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 17, fontWeight: 900 }}>원</span>
                  </div>
                </div>
                <div style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.58)' }}>SEAT</div>
                  <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-.02em', marginTop: 2 }}>{dday}</div>
                </div>
              </div>
              <div style={{ marginTop: 16, height: 12, borderRadius: 9999, background: '#E9ECEE', overflow: 'hidden' }}>
                <div style={{ width: `${fuelPct}%`, height: '100%', borderRadius: 9999, transition: 'width .5s ease', background: over ? '#C4472A' : color.mint }} />
              </div>
              <BarcodeStrip />
              <CtaButton height={52} bg={color.ink} fg="#fff" arrowBg={color.mint} style={{ marginTop: 16, fontSize: 15 }} onClick={() => navigate('/detail')}>
                {over ? '왜 이탈했는지 보기' : '여정 상세 보기'}
              </CtaButton>
            </>
          }
        />

        <div style={{ marginTop: 20, fontSize: 18, fontWeight: 900, letterSpacing: '-.02em' }}>진행 중인 항목</div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {missionOn && (
            <div onClick={() => navigate('/token')} style={{ background: color.mint, borderRadius: 26, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', color: color.ink }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: color.ink, color: color.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>₩</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-.015em' }}>저축 보증금 {deposit.toLocaleString()}원 예치 중</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, opacity: 0.6, marginTop: 2 }}>9/14일 진행 · 목표 달성 시 전액 환급</div>
              </div>
              <RowChevron />
            </div>
          )}

          {!fueled && (
            <div onClick={() => navigate('/salary')} style={{ background: 'rgba(22,25,28,.09)', borderRadius: 26, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: color.sky, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>급</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-.015em' }}>급여 입금 감지 · {AP.total}원</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(22,25,28,.63)', marginTop: 2 }}>3계좌 자동 분배 확인하기</div>
              </div>
              <RowChevron />
            </div>
          )}

          <div onClick={() => navigate('/salary')} style={{ background: '#fff', border: '1px solid rgba(22,25,28,.10)', borderRadius: 26, padding: '18px 20px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(22,25,28,.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, background: fueled ? color.mint : 'rgba(22,25,28,.10)', color: color.ink }}>
                {fueled ? '✓' : '▤'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 900, letterSpacing: '-.015em' }}>{fueled ? `예산 분배 완료 · ${AP.total}원` : '내 계좌 현황 · 3계좌'}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(22,25,28,.63)', marginTop: 2 }}>{fueled ? '오늘 07:12 · 3계좌 자동 분배' : `어제 23:50 기준 · 페르소나 ${persona}`}</div>
              </div>
              <div style={{ flex: 'none', padding: '5px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 900, background: fueled ? color.mintTintLight : 'rgba(125,181,255,.22)', color: fueled ? '#077264' : '#2E6BD0' }}>
                {fueled ? '방금 변동' : '분배 대기'}
              </div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(22,25,28,.10)', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {acctRows.map((a) => (
                <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 'none', width: 12, height: 12, borderRadius: 4, background: a.dotColor }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 900, letterSpacing: '-.01em' }}>{a.name}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(22,25,28,.58)', marginTop: 1 }}>{a.desc}</div>
                  </div>
                  <div style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: 14, fontWeight: 900 }}>{a.amount}원</div>
                    <div style={{ fontSize: 11.5, fontWeight: 900, marginTop: 1, color: a.delta.includes('+') ? '#077264' : a.delta.includes('-') ? '#D0512E' : 'rgba(22,25,28,.62)' }}>{a.delta}</div>
                  </div>
                </div>
              ))}
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
