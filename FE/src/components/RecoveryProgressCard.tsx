import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CtaButton } from './ui';
import { recoveryLabels, type RecoveryTracking } from '../viewmodel/recoveryTracking';

export function RecoveryProgressCard({ recovery, detail = false }: { recovery: RecoveryTracking; detail?: boolean }) {
  const navigate = useNavigate();
  const financial = recovery.observations.some(o => o.stage === 'finance' && o.status === 'monitoring');
  const steps = [
    { name: '행동 실천', text: '미션 기준 충족', done: true },
    { name: '재무 변화', text: financial ? '지표 개선 확인' : '변화 확인 중', done: financial },
    { name: '4주 유지', text: recovery.status === 'confirmed' ? '4주 연속 충족' : '유지 여부 확인 중', done: recovery.status === 'confirmed' },
  ];
  const doneCount = steps.filter(s => s.done).length;

  // 상세 화면(detail)에서는 항상 펼친 상태. 그 외에는 접기 가능하며 기본은 접힘.
  const [open, setOpen] = useState(detail);
  const expanded = detail || open;

  return (
    <Card style={{ marginTop: 16, marginBottom: 16 }}>
      {/* 헤더: 접기 토글 (detail 모드에서는 버튼이 아닌 정적 표시) */}
      <button
        type="button"
        onClick={detail ? undefined : () => setOpen(v => !v)}
        aria-expanded={detail ? undefined : expanded}
        style={{ width: '100%', padding: 0, background: 'transparent', border: 'none', textAlign: 'left', cursor: detail ? 'default' : 'pointer', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}
      >
        <h2 className="fcps-section-title" style={{ margin: 0 }}>신용 회복 단계</h2>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-accent-text)' }}>
          {doneCount}/3 단계
          {!detail && <span aria-hidden="true" style={{ display: 'inline-block', transition: 'transform .2s ease', transform: expanded ? 'rotate(180deg)' : 'none', color: 'var(--color-60-text-secondary)', fontSize: 11 }}>▾</span>}
        </span>
      </button>

      {/* 접힘 상태: 1·2·3 원이 가로로 나열된 미니 프로그레스만 노출 */}
      {!expanded && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
          {steps.map((step, i) => (
            <div key={step.name} style={{ display: 'contents' }}>
              <span
                aria-label={`${i + 1}단계 ${step.name} ${step.done ? '완료' : '진행 중'}`}
                style={{
                  flex: 'none', width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center',
                  fontSize: 'var(--font-size-xs)', fontWeight: 700,
                  background: step.done ? 'var(--im-mint)' : 'var(--color-30-surface-sub)',
                  color: step.done ? 'var(--im-gray-dark)' : 'var(--color-60-text-secondary)',
                }}
              >
                {step.done ? '✓' : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span aria-hidden="true" style={{ flex: 1, height: 2, borderRadius: 'var(--radius-pill)', background: steps[i + 1].done || step.done ? 'var(--im-mint)' : 'var(--color-chart-track)' }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* 펼침 상태: 상세 단계 리스트 + 안내 + (요약 화면일 때) 근거 보기 CTA */}
      {expanded && (
        <>
          <p className="fcps-description" style={{ marginTop: 6, marginBottom: 4 }}>{recoveryLabels[recovery.status]}</p>
          <ol className="recovery-stages">{steps.map((step, i) => <li key={step.name} data-done={step.done}><span aria-hidden="true">{step.done ? '✓' : i + 1}</span><div><b>{step.name}</b><p>{step.text}</p></div></li>)}</ol>
          <p className="insight-caption">기간 경과를 가정한 관찰 흐름 · 실제 금융 판정 아님</p>
          {!detail && <CtaButton onClick={() => navigate('/recovery?completedAt=' + encodeURIComponent(recovery.completedAt))}>회복 단계와 근거 보기</CtaButton>}
        </>
      )}
    </Card>
  );
}
