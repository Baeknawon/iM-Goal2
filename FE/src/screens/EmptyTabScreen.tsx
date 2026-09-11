import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Brand, CtaButton } from '../components/ui';
import type { EmptyTabKey } from '../types';

const copy: Record<EmptyTabKey, { title: string; desc: string; icon: string }> = {
  소비분석: { title: '분석할 지출이 모이는 중', desc: '자산을 연결한 날부터 카테고리별 소비 흐름이 쌓입니다.', icon: '▥' },
  알림: { title: '아직 감지된 이탈이 없어요', desc: '금융 목표를 등록하면 결제 60초 안에 위험을 알려드립니다.', icon: '◍' },
  미션: { title: '진행 중인 구간 미션이 없어요', desc: '이탈이 감지되면 AI가 회복 미션을 제안합니다.', icon: '⚿' },
  신용: { title: '기록이 아직 비어 있어요', desc: '미션 성공과 목표 준수가 첫 신용 궤적이 됩니다.', icon: '◆' },
};

/** Shown when a bottom-nav tab is opened before any goal has been registered. */
export function EmptyTabScreen() {
  const navigate = useNavigate();
  const emptyTab = useAppStore((s) => s.emptyTab);
  const c = copy[emptyTab];

  return (
    <Screen>
      <div style={{ padding: 'var(--screen-pad-top) var(--screen-padding-x) 0', flex: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--component-gap)' }}>
          <Brand size={23} />
          <div style={{ padding: '9px 15px', borderRadius: 'var(--radius-pill)', background: 'var(--color-30-surface-sub)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>목표 미등록</div>
        </div>
        <div style={{ marginTop: 18, fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)' }}>{emptyTab}</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '22px 22px 120px' }}>
        <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-2xl)', padding: '38px 26px', textAlign: 'center' }}>
          <div style={{ width: 74, height: 74, borderRadius: '50%', background: 'var(--color-30-surface-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-3xl)', color: 'rgba(var(--color-ink-rgb),.35)', margin: '0 auto' }}>
            {c.icon}
          </div>
          <div style={{ marginTop: 18, fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.025em' }}>{c.title}</div>
          <div style={{ marginTop: 9, fontSize: 'var(--font-size-sm)', lineHeight: 1.7, fontWeight: 'var(--font-weight-medium)', color: 'var(--color-60-text-secondary)' }}>{c.desc}</div>
          <CtaButton height={54} bg="var(--color-action-bg)" fg="var(--color-action-text)" arrowBg="var(--color-action-text)" style={{ marginTop: 'var(--space-2-5)', fontSize: 'var(--font-size-sm)' }} onClick={() => navigate('/input')}>
            금융 목표 등록하기
          </CtaButton>
        </div>
      </div>
    </Screen>
  );
}
