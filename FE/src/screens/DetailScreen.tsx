import { GoalEditor } from '../components/GoalEditor';
import { useState } from 'react';
import { useJourney } from '../viewmodel/useJourney';
import { Screen, BackToHome, Pill, ScreenBody } from '../components/ui';
import { Globe3D } from '../components/Globe3D';
import { useSpending } from '../viewmodel/useSpending';
import { INITIAL_SPEND_MONTH } from '../data/spendPeriod';
import { type JourneyEvent, type JourneyEventKind } from '../data/personas';
import { color } from '../styles/theme';

const LEGEND: { kind: JourneyEventKind; label: string; c: string }[] = [
  { kind: 'deviation', label: '이탈', c: 'var(--color-danger)' },
  { kind: 'boost', label: '가속', c: 'var(--im-lime)' },
  { kind: 'recovery', label: '회복', c: 'var(--im-mint)' },
  { kind: 'mission', label: '미션', c: 'var(--im-blue)' },
];

export function DetailScreen() {
  const { plan, P, AP, dday, saved, savedPct, delayed } = useJourney();
  const spending=useSpending(INITIAL_SPEND_MONTH);
  const events:JourneyEvent[]=[{progress:0,kind:'start',label:'목표 계획',date:'계획',detail:plan.goal.name+' '+plan.goal.target.toLocaleString()+'원'}, {progress:savedPct/100,kind:'now',label:'현재 위치',date:'7월 31일',detail:'목표에 '+saved.toLocaleString()+' 모았어요 · '+savedPct+'%'}];
  const [selectedKind, setSelectedKind] = useState<JourneyEventKind>('now');
  const selected=events.find(e=>e.kind===selectedKind) ?? events[events.length-1];
  const setSelected=(e:JourneyEvent)=>setSelectedKind(e.kind);

  return (
      <Screen>
        <div style={{ padding: '68px var(--screen-padding-x) 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <BackToHome />
            <Pill bg={color.mint} fg={color.ink}>{dday}</Pill>
          </div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>GOAL 0725 · {P.goalName}</div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>여정 상세</div>
        </div>

        <ScreenBody>
        <GoalEditor />
          {/* 3D 지구본 항로 카드 */}
          <div
              style={{
                borderRadius: 'var(--radius-2xl)', position: 'relative', overflow: 'hidden',
                background: 'radial-gradient(130% 100% at 50% 0%, var(--color-hero) 0%, var(--color-hero-deep) 50%, var(--color-hero-deep) 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(var(--color-white-rgb),.06), 0 12px 30px rgba(var(--color-ink-rgb),.42)',
              }}
          >
            {/* 헤더 오버레이 */}
            <div style={{ position: 'absolute', top: 14, left: 16, right: 16, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--im-white)' }}>
                <span>Start</span><span style={{ opacity: 0.4 }}>✈</span><span style={{ color: color.mint }}>{P.code}</span>
              </div>
              <div style={{ padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', background: 'rgba(var(--color-white-rgb),.1)', color: delayed ? 'var(--color-danger-on-dark)' : color.mint }}>
                {savedPct}% · {delayed ? '난기류' : '순항'}
              </div>
            </div>

            <div style={{ height: 230, paddingTop: 44 }}>
              <Globe3D events={events} onSelect={(e) => e && setSelected(e)} />
            </div>

            <div style={{ position: 'absolute', top: 42, left: '50%', transform: 'translateX(-50%)', zIndex: 5, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-on-dark-muted)', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
              지점을 눌러 확인하세요
            </div>

            {/* 선택 이벤트 정보 */}
            <div style={{ position: 'relative', zIndex: 5, margin: '0 14px 12px', background: 'rgba(var(--color-ink-rgb),.62)', backdropFilter: 'blur(6px)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)', border: '1px solid rgba(var(--color-white-rgb),.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: eventColor(selected.kind) }} />
                <span style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.06em', color: 'var(--color-text-on-dark-muted)' }}>{selected.date} · {kindLabel(selected.kind)}</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em', color: 'var(--im-white)' }}>{selected.label}</div>
              <div style={{ marginTop: 4, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-medium)', lineHeight: 1.55, color: 'var(--color-text-on-dark-muted)' }}>{selected.detail}</div>
              {selected.kind === 'now' && (
                  <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: delayed ? 'var(--color-danger-on-dark)' : color.mint }}>
                    {delayed ? `지연 예상 · ${AP.etaDelayed} 도착 예정` : `현재 예산이면 ${AP.etaFast} 도착 예정`}
                  </div>
              )}
            </div>

            {/* 범례 */}
            <div style={{ position: 'relative', zIndex: 5, display: 'flex', gap: 'var(--space-1-5)', padding: '0 18px 12px', flexWrap: 'wrap' }}>
              {LEGEND.map((l) => (
                  <div key={l.kind} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: l.c }} />
                    <span style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-on-dark-muted)' }}>{l.label}</span>
                  </div>
              ))}
            </div>

            {/* 모은 금액 + 굵은 진행 바 */}
            <div style={{ position: 'relative', zIndex: 5, padding: '0 18px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.1em', color: 'var(--color-text-on-dark-muted)' }}>모은 금액</div>
                  <div style={{ marginTop: 'var(--space-0-5)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', color: 'var(--im-white)' }}>{saved}원</div>
                </div>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', color: delayed ? 'var(--color-danger-on-dark)' : color.mint }}>{savedPct}%</div>
              </div>
              <div style={{ position: 'relative', height: 20, borderRadius: 'var(--radius-pill)', background: 'rgba(var(--color-white-rgb),.12)', overflow: 'hidden' }}>
                <div style={{ width: `${savedPct}%`, height: '100%', borderRadius: 'var(--radius-pill)', background: delayed ? 'var(--color-danger)' : 'linear-gradient(90deg,var(--color-accent-text),var(--im-mint))', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
                  <span style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-hero-deep)' }}>{savedPct}%</span>
                </div>
              </div>
              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-on-dark-muted)' }}>
                <span>출발 · {AP.now}</span>
                <span>목표 {AP.target} · {delayed ? AP.etaDelayed : AP.eta}</span>
              </div>
            </div>
          </div>

          {/* 여정 타임라인 (탭으로 지구본 선택 연동) */}
          <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', color: color.ink }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>여정 타임라인</div>
            <div style={{ marginTop: 'var(--space-1-5)' }}>
              {events.filter((e) => e.kind !== 'start').map((e, i, arr) => (
                  <div key={i} onClick={() => setSelected(e)} style={{ display: 'flex', gap: 'var(--space-1-5)', cursor: 'pointer', opacity: selected === e ? 1 : 0.72 }}>
                    <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: eventColor(e.kind), border: selected === e ? '2px solid var(--color-60-border)' : 'none' }} />
                      {i < arr.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 22, background: 'var(--color-30-surface-sub)' }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 14 }}>
                      <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>{e.date} · {kindLabel(e.kind)}</div>
                      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-.01em', marginTop: 'var(--space-0-5)' }}>{e.label}</div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-accent-text)' }}>소비 추이 · 7월 주차별</div>
              <div style={{ padding: '5px 11px', borderRadius: 'var(--radius-pill)', background: 'rgba(var(--color-mint-rgb),.16)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-lime-text)' }}>거래 기준</div>
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 'var(--space-1)', alignItems: 'flex-end', height: 110 }}>
              {spending.weeks.map((week, i) => (
                  <div
                      key={i}
                      style={{
                        flex: 1, height: `${week.amount/Math.max(1,...spending.weeks.map(w=>w.amount))*100}%`, borderRadius: '8px 8px 0 0',
                        background: i === 7 ? color.mint : i === 5 ? 'var(--im-beige)' : 'rgba(var(--color-ink-rgb),.16)',
                      }}
                  />
              ))}
            </div>
            <div style={{ marginTop: 'var(--space-1)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>
              <span>7월 1주</span><span>주차별 소비</span><span>마지막 주</span>
            </div>
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--color-60-border)', display: 'flex', gap: 22 }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>주 평균</div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginTop: 3 }}>{Math.round(spending.total/spending.weeks.length).toLocaleString()}원</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>주 예산 환산</div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginTop: 3, color: 'var(--color-accent-text)' }}>{AP.needPace}</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-hero)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-3)', color: 'var(--im-white)' }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: delayed ? 'var(--color-danger-on-dark)' : color.mint }}>AI 도착 예측</div>
            <div style={{ marginTop: 10, fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.025em', lineHeight: 1.45 }}>
              {delayed ? <>지금 페이스면<br />예정보다 늦게 도착합니다</> : <>지금 페이스면<br />예정보다 앞서 도착합니다</>}
            </div>
            <div style={{ marginTop: 'var(--space-2)', display: 'flex', gap: 'var(--component-gap)' }}>
              <div style={{ flex: 1, background: 'rgba(var(--color-white-rgb),.1)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)' }}>
                <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-on-dark-muted)' }}>계획 도착</div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginTop: 3 }}>{AP.eta}</div>
              </div>
              {delayed ? (
                  <div style={{ flex: 1, background: 'var(--color-danger-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)', color: 'var(--color-60-text-primary)' }}>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', opacity: 0.6 }}>지연 도착</div>
                    <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginTop: 3 }}>{AP.etaDelayed}</div>
                  </div>
              ) : (
                  <div style={{ flex: 1, background: color.mint, borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)', color: color.ink }}>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', opacity: 0.6 }}>예측 도착</div>
                    <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginTop: 3 }}>{AP.etaFast}</div>
                  </div>
              )}
            </div>
          </div>

        </ScreenBody>
      </Screen>
  );
}

function eventColor(kind: JourneyEventKind): string {
  return { start: 'var(--im-white)', deviation: 'var(--color-danger)', boost: 'var(--im-lime)', recovery: 'var(--im-mint)', mission: 'var(--im-blue)', now: 'var(--im-mint)' }[kind];
}
function kindLabel(kind: JourneyEventKind): string {
  return { start: '출발', deviation: '항로 이탈', boost: '가속', recovery: '회복', mission: '회복 미션', now: '현재 위치' }[kind];
}
