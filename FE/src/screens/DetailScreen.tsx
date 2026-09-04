import { useState } from 'react';
import { useJourney } from '../viewmodel/useJourney';
import { Screen, BackToHome, Pill, ScreenBody } from '../components/ui';
import { Globe3D } from '../components/Globe3D';
import { paceTargets } from '../data/staticContent';
import { journeyEventsDefs, type JourneyEvent, type JourneyEventKind } from '../data/personas';
import { color } from '../styles/theme';

const LEGEND: { kind: JourneyEventKind; label: string; c: string }[] = [
  { kind: 'deviation', label: '이탈', c: '#FF7A5C' },
  { kind: 'boost', label: '가속', c: '#E2F15E' },
  { kind: 'recovery', label: '회복', c: '#00C7A9' },
  { kind: 'mission', label: '미션', c: '#7DB5FF' },
];

export function DetailScreen() {
  const { persona, P, AP, dday, saved, savedPct, delayed } = useJourney();
  const events = journeyEventsDefs[persona];
  const [selected, setSelected] = useState<JourneyEvent>(() => events.find((e) => e.kind === 'now') ?? events[events.length - 1]);

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
          {/* 3D 지구본 항로 카드 */}
          <div
              style={{
                borderRadius: 30, position: 'relative', overflow: 'hidden',
                background: 'radial-gradient(130% 100% at 50% 0%, #12283F 0%, #0A1626 50%, #050C16 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.06), 0 12px 30px rgba(6,16,27,.42)',
              }}
          >
            {/* 헤더 오버레이 */}
            <div style={{ position: 'absolute', top: 14, left: 16, right: 16, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 900, color: '#fff' }}>
                <span>Start</span><span style={{ opacity: 0.4 }}>✈</span><span style={{ color: color.mint }}>{P.code}</span>
              </div>
              <div style={{ padding: '4px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 900, letterSpacing: '.08em', background: 'rgba(255,255,255,.1)', color: delayed ? '#FF7A5C' : color.mint }}>
                {savedPct}% · {delayed ? '난기류' : '순항'}
              </div>
            </div>

            <div style={{ height: 230, paddingTop: 44 }}>
              <Globe3D events={events} onSelect={(e) => e && setSelected(e)} />
            </div>

            <div style={{ position: 'absolute', top: 42, left: '50%', transform: 'translateX(-50%)', zIndex: 5, fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,.6)', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
              지점을 눌러 확인하세요
            </div>

            {/* 선택 이벤트 정보 */}
            <div style={{ position: 'relative', zIndex: 5, margin: '0 14px 12px', background: 'rgba(6,16,27,.62)', backdropFilter: 'blur(6px)', borderRadius: 20, padding: 16, border: '1px solid rgba(255,255,255,.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: eventColor(selected.kind) }} />
                <span style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: '.06em', color: 'rgba(255,255,255,.55)' }}>{selected.date} · {kindLabel(selected.kind)}</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 16, fontWeight: 900, letterSpacing: '-.02em', color: '#fff' }}>{selected.label}</div>
              <div style={{ marginTop: 4, fontSize: 12.5, fontWeight: 500, lineHeight: 1.55, color: 'rgba(255,255,255,.66)' }}>{selected.detail}</div>
              {selected.kind === 'now' && (
                  <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 900, color: delayed ? '#FF7A5C' : color.mint }}>
                    {delayed ? `지연 예상 · ${AP.etaDelayed} 도착 예정` : `지금 페이스면 ${AP.etaFast} 도착 예정`}
                  </div>
              )}
            </div>

            {/* 범례 */}
            <div style={{ position: 'relative', zIndex: 5, display: 'flex', gap: 12, padding: '0 18px 12px', flexWrap: 'wrap' }}>
              {LEGEND.map((l) => (
                  <div key={l.kind} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: l.c }} />
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: 'rgba(255,255,255,.6)' }}>{l.label}</span>
                  </div>
              ))}
            </div>

            {/* 모은 금액 + 굵은 진행 바 */}
            <div style={{ position: 'relative', zIndex: 5, padding: '0 18px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: '.1em', color: 'rgba(255,255,255,.5)' }}>모은 금액</div>
                  <div style={{ marginTop: 2, fontSize: 22, fontWeight: 900, letterSpacing: '-.03em', color: '#fff' }}>{saved}원</div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-.03em', color: delayed ? '#FF7A5C' : color.mint }}>{savedPct}%</div>
              </div>
              <div style={{ position: 'relative', height: 20, borderRadius: 9999, background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
                <div style={{ width: `${savedPct}%`, height: '100%', borderRadius: 9999, background: delayed ? '#FF7A5C' : 'linear-gradient(90deg,#0A8873,#00C7A9)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#06101B' }}>{savedPct}%</span>
                </div>
              </div>
              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.45)' }}>
                <span>출발 · {AP.now}</span>
                <span>목표 {AP.target} · {delayed ? AP.etaDelayed : AP.eta}</span>
              </div>
            </div>
          </div>

          {/* 여정 타임라인 (탭으로 지구본 선택 연동) */}
          <div style={{ marginTop: 14, background: '#fff', borderRadius: 26, padding: 20, color: color.ink }}>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.55)' }}>여정 타임라인</div>
            <div style={{ marginTop: 14 }}>
              {events.filter((e) => e.kind !== 'start').map((e, i, arr) => (
                  <div key={i} onClick={() => setSelected(e)} style={{ display: 'flex', gap: 12, cursor: 'pointer', opacity: selected === e ? 1 : 0.72 }}>
                    <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: eventColor(e.kind), border: selected === e ? '2px solid rgba(22,25,28,.25)' : 'none' }} />
                      {i < arr.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 22, background: 'rgba(22,25,28,.12)' }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(22,25,28,.5)' }}>{e.date} · {kindLabel(e.kind)}</div>
                      <div style={{ fontSize: 14.5, fontWeight: 900, letterSpacing: '-.01em', marginTop: 1 }}>{e.label}</div>
                    </div>
                  </div>
              ))}
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

        </ScreenBody>
      </Screen>
  );
}

function eventColor(kind: JourneyEventKind): string {
  return { start: '#ffffff', deviation: '#FF7A5C', boost: '#E2F15E', recovery: '#00C7A9', mission: '#7DB5FF', now: '#00C7A9' }[kind];
}
function kindLabel(kind: JourneyEventKind): string {
  return { start: '출발', deviation: '항로 이탈', boost: '가속', recovery: '회복', mission: '회복 미션', now: '현재 위치' }[kind];
}
