import { GoalEditor } from '../components/GoalEditor';
import { useState } from 'react';
import { useJourney } from '../viewmodel/useJourney';
import { Screen, BackToHome, Pill, ScreenBody } from '../components/ui';
import { Globe3D } from '../components/Globe3D';
import { useSpending } from '../viewmodel/useSpending';
import { INITIAL_SPEND_MONTH } from '../data/spendPeriod';
import { journeyEventsDefs, type JourneyEvent, type JourneyEventKind } from '../data/personas';
import { useAppStore } from '../store/appStore';
import { failureReasons } from '../viewmodel/adaptiveMission';
import { formatDate } from '../viewmodel/finance';
import type { FcpsEntry, PersonaKey } from '../types';
import { color } from '../styles/theme';

type JourneyEventWithId = JourneyEvent & { id: string };

const LEGEND: { kind: JourneyEventKind; label: string; c: string }[] = [
  { kind: 'deviation', label: '이탈', c: 'var(--color-danger)' },
  { kind: 'boost', label: '가속', c: 'var(--im-lime)' },
  { kind: 'recovery', label: '회복', c: 'var(--im-mint)' },
  { kind: 'mission', label: '미션', c: 'var(--im-blue)' },
];

export function DetailScreen() {
  const { plan, P, AP, dday, saved, savedPct, delayed } = useJourney();
  const persona = useAppStore((s) => s.persona);
  const fcpsLog = useAppStore((s) => s.fcpsLog);
  const alertOn = useAppStore((s) => s.alertOn);
  const missionOn = useAppStore((s) => s.missionOn);
  const spending=useSpending(INITIAL_SPEND_MONTH);
  const nowProgress = Math.min(1, Math.max(0, savedPct / 100));

  // 여정 루트 = 배경 예시(시작 전 맥락, 개수 축소) + 실제 사용자 활동(미션 성공/실패/포기 · 트리거 이탈)을
  // 시간순으로 차곡차곡 쌓아, 현재 진행률(now) 직전까지 배치한다. 실제 활동이 발생할수록 루트가 늘어난다.
  const events = buildJourneyEvents({
    persona, nowProgress, savedPct, saved, goalName: plan.goal.name, goalTarget: plan.goal.target,
    fcpsLog, alertOn, missionOn, virtualNow: plan.virtualNow,
  });

  // 선택은 이벤트의 고유 id로 관리 (같은 kind가 여러 번 나올 수 있으므로). 기본은 현재(now).
  const nowId = events.find((e) => e.kind === 'now')?.id ?? events[events.length - 1]?.id;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const activeId = selectedId ?? nowId;
  const selected = events.find((e) => e.id === activeId) ?? events[events.length - 1];
  const setSelected = (e: JourneyEventWithId) => setSelectedId(e.id);
  // 타임라인: start 제외한 여정 이벤트. 접힘 상태에선 최근 3개만, 펼치면 전체.
  const timelineEvents = events.filter((e) => e.kind !== 'start');
  const COLLAPSED_COUNT = 3;
  const hiddenCount = Math.max(0, timelineEvents.length - COLLAPSED_COUNT);
  const shownEvents = timelineOpen ? timelineEvents : timelineEvents.slice(-COLLAPSED_COUNT);

  return (
      <Screen>
        <div style={{ padding: '68px var(--screen-padding-x) 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <BackToHome />
            <Pill bg={color.mint} fg={color.ink}>{dday}</Pill>
          </div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>GOAL 0725 · {P.goalName}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-1)', marginTop: 'var(--space-0-5)' }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)' }}>여정 상세</div>
            <GoalEditor />
          </div>
        </div>

        <ScreenBody>
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
              <Globe3D events={events} onSelect={(e) => { if (e?.id) setSelectedId(e.id); }} />
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
                    {delayed ? `지연 예상 · ${AP.predicted} 도착 예정` : `현재 예산이면 ${AP.predicted} 도착 예정`}
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
                  <div style={{ marginTop: 'var(--space-0-5)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', color: 'var(--im-white)' }}>{saved}</div>
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
                <span>목표 {AP.target} · {delayed ? AP.predicted : AP.eta}</span>
              </div>
            </div>
          </div>

          {/* 여정 타임라인 (접기/펼치기 · 탭으로 지구본 선택 연동) */}
          <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', color: color.ink }}>
            <button
                type="button"
                onClick={() => setTimelineOpen((v) => !v)}
                aria-expanded={timelineOpen}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-1)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', textAlign: 'left' }}
            >
              <span style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>여정 타임라인 · {timelineEvents.length}개</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-accent-text)' }}>
                {timelineOpen ? '접기' : (hiddenCount > 0 ? `전체 보기` : '펼치기')}
                <span aria-hidden="true" style={{ display: 'inline-block', transform: timelineOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }}>▾</span>
              </span>
            </button>
            {!timelineOpen && hiddenCount > 0 && (
                <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-60-text-secondary)' }}>이전 {hiddenCount}개 여정이 접혀 있어요</div>
            )}
            <div style={{ marginTop: 'var(--space-1-5)' }}>
              {shownEvents.map((e, i, arr) => (
                  <div key={e.id} onClick={() => setSelected(e)} style={{ display: 'flex', gap: 'var(--space-1-5)', cursor: 'pointer', opacity: selected?.id === e.id ? 1 : 0.72 }}>
                    <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: eventColor(e.kind), border: selected?.id === e.id ? '2px solid var(--color-60-border)' : 'none' }} />
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
              {/* 계획 도착: 목표 기간 기준의 고정 baseline(AP.eta = plannedEta). 트리거와 무관하게 변하지 않는다. */}
              <div style={{ flex: 1, background: 'rgba(var(--color-white-rgb),.1)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)' }}>
                <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-on-dark-muted)' }}>계획 도착</div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginTop: 3 }}>{AP.eta}</div>
              </div>
              {/* 예측/지연 도착: 현재 페이스+초과지출을 반영한 예측 도착일(AP.predicted). delayed 여부로 지연/빠름 라벨을 고른다.
                  트리거 후에는 predicted가 계획보다 늦거나 같아(후≥전) 지연 카드로, 빠르면 예측(빠름) 카드로 표시된다. */}
              {delayed ? (
                  <div style={{ flex: 1, background: 'var(--color-danger-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)', color: 'var(--color-60-text-primary)' }}>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', opacity: 0.6 }}>지연 도착</div>
                    <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginTop: 3 }}>{AP.predicted}</div>
                  </div>
              ) : (
                  <div style={{ flex: 1, background: color.mint, borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)', color: color.ink }}>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', opacity: 0.6 }}>예측 도착 · 빠름</div>
                    <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginTop: 3 }}>{AP.predicted}</div>
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

interface BuildArgs {
  persona: PersonaKey;
  nowProgress: number;
  savedPct: number;
  saved: string;          // "29,190,000원" (원 포함)
  goalName: string;
  goalTarget: number;
  fcpsLog: FcpsEntry[];
  alertOn: boolean;
  missionOn: boolean;
  /** 가상 현재 시점(YYYY.MM.DD). 실제 시계 시각 대신 데모 세계관의 "지금"을 표시할 때 사용. */
  virtualNow: string;
}

/**
 * 여정 루트 이벤트 생성 (실시간).
 *  1) 배경: 시작 지점 + 페르소나 예시 여정에서 앞쪽 일부(시작 전 맥락).
 *  2) 실제 활동: fcpsLog(오래된→최신)의 각 미션을 회복미션 지점으로, 결과에 따라 성공=회복 / 실패·포기=이탈로.
 *  3) 진행 중 미션·방금 발생한 이탈(alertOn)을 뒤에 잇는다.
 *  4) 현재 위치(now).
 * progress는 0(출발)~nowProgress(현재) 사이에 순서대로 균등 배치해 "차곡차곡 쌓인" 항로를 만든다.
 */
function buildJourneyEvents(a: BuildArgs): JourneyEventWithId[] {
  const startEvent: JourneyEventWithId = {
    id: 'start', progress: 0, kind: 'start', label: '목표 계획', date: '계획',
    detail: a.goalName + ' ' + a.goalTarget.toLocaleString() + '원',
  };

  // 배경 예시: start/now를 뺀 중간 이벤트 중 앞쪽 2개만 (시작 전 맥락, 너무 많지 않게).
  const backdrop: JourneyEventWithId[] = journeyEventsDefs[a.persona]
    .filter((e) => e.kind !== 'start' && e.kind !== 'now')
    .slice(0, 2)
    .map((e, i) => ({ ...e, id: 'bg-' + i }));

  // 실제 활동: fcpsLog는 최신순 → 시간순(오래된→최신)으로 뒤집는다.
  const activity: JourneyEventWithId[] = [];
  const chrono = [...a.fcpsLog].reverse();
  chrono.forEach((entry, i) => {
    const when = formatDate(entry.completedAt, '기록');
    const reason = entry.failureReason ? ' · ' + failureReasons[entry.failureReason] : '';
    if (entry.result === 'success') {
      activity.push({ id: 'm-' + i, progress: 0, kind: 'recovery', label: entry.mission + ' 성공', date: when, detail: '회복 미션을 완료했어요' + (entry.recovery ? ' · 회복 확인 진행' : '') });
    } else {
      const label = entry.result === 'fail' ? '미션 실패' : '미션 포기';
      activity.push({ id: 'm-' + i, progress: 0, kind: 'deviation', label: entry.mission + ' · ' + label, date: when, detail: '기준에 미치지 못했어요' + reason });
    }
  });

  // 진행 중 미션(아직 결과 전).
  //  미션 시작 시각은 실제 시계(missionStartedAt)가 아니라 데모 세계관의 가상 시점 기준으로 표기한다.
  //  진행 중인 미션은 "지금" 수행 중이므로 가상 현재 시점(virtualNow)에 "진행 중" 라벨을 함께 붙인다.
  if (a.missionOn) {
    activity.push({ id: 'live', progress: 0, kind: 'mission', label: '회복 미션 진행 중', date: a.virtualNow + ' · 진행 중', detail: '보증금을 걸고 수행 중이에요' });
  }
  // 방금 발생한 이탈(트리거) — 실제 시계 시각이 아닌 가상 현재 시점을 표시한다.
  if (a.alertOn) {
    activity.push({ id: 'alert', progress: 0, kind: 'deviation', label: '항로 이탈 감지', date: a.virtualNow, detail: '오늘 예산을 초과했어요 · 회복 미션으로 되돌릴 수 있어요' });
  }

  // 현재 위치(now) — 실제 시계 시각이 아닌 가상 현재 시점을 표시한다.
  const nowEvent: JourneyEventWithId = {
    id: 'now', progress: a.nowProgress, kind: 'now', date: a.virtualNow,
    label: '현재 위치', detail: '목표에 ' + a.saved + ' 모았어요 · ' + a.savedPct + '%',
  };

  // 중간 이벤트들(배경+활동)을 0~nowProgress 사이에 순서대로 균등 배치.
  const middle = [...backdrop, ...activity];
  const spaced = middle.map((e, i) => ({ ...e, progress: a.nowProgress * (i + 1) / (middle.length + 1) }));

  return [startEvent, ...spaced, nowEvent];
}
