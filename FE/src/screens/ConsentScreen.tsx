import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, ScreenHeader, Pill, InfoNote, CtaButton } from '../components/ui';
import { color } from '../styles/theme';

const items: { name: string; desc: string; required: boolean }[] = [
  { name: 'iM뱅크 계좌 연결', desc: '입출금·예금 계좌 잔액과 거래내역 조회', required: true },
  { name: '마이데이터 통합조회', desc: '타 금융기관 계좌·카드·대출 정보 통합 조회', required: true },
  { name: '개인정보 수집·이용', desc: '목표 설계와 소비 분석에 필요한 최소 정보', required: true },
  { name: '금융거래정보 제공', desc: 'AI 분석을 위한 거래내역 제공 (조회 전용)', required: true },
  { name: 'FCPS 행동데이터 축적', desc: '미션 수행 기록을 신용 보완 지표로 축적', required: true },
  { name: '마케팅 정보 수신', desc: '상품 추천·이벤트 알림 (선택)', required: false },
];

/** 동의 1/4 — CLiMB bank-home banner opens MyData consent before linking. */
export function ConsentScreen() {
  const navigate = useNavigate();
  const consents = useAppStore((s) => s.consents);
  const toggleConsent = useAppStore((s) => s.toggleConsent);
  const toggleConsentAll = useAppStore((s) => s.toggleConsentAll);

  const allOn = consents.every(Boolean);
  const requiredOk = consents.slice(0, 5).every(Boolean);

  return (
    <Screen>
      <ScreenHeader
        onBack={() => navigate('/bank')}
        rightChip={<Pill>동의 1/4</Pill>}
        sub="시작하기 전에,"
        title="동의가 필요해요"
      />
      <div className="consent-body" style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--space-2) var(--screen-padding-x) var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--component-gap)' }}>
        <div
          onClick={toggleConsentAll}
          style={{ minHeight: 80, display: 'flex', alignItems: 'center', gap: 'var(--component-gap)', padding: 'var(--space-2) var(--space-2-5)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', background: color.selected, color: color.ink, border: '1px solid var(--color-notification-unread-border)' }}
        >
          <div style={{ flex: 'none', width: 28, height: 28, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-notification-unread-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', background: allOn ? color.mint : color.white, color: allOn ? color.ink : 'transparent' }}>✓</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.015em' }}>전체 동의</div>
            <div style={{ marginTop: 'var(--space-0-5)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: color.textSecondary }}>선택 항목까지 한 번에</div>
          </div>
        </div>

        {items.map((c, i) => {
          const on = consents[i];
          return (
            <div
              key={c.name}
              onClick={() => toggleConsent(i)}
              style={{ minHeight: 80, display: 'flex', alignItems: 'center', gap: 'var(--component-gap)', padding: 'var(--space-2) var(--space-2-5)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', background: color.white, border: `1px solid ${on ? 'var(--color-notification-unread-border)' : color.line}` }}
            >
              <div style={{ flex: 'none', width: 28, height: 28, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-60-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', background: on ? color.mint : color.bg, color: on ? color.ink : 'transparent' }}>✓</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: 'var(--letter-spacing-normal)' }}>{c.name}</span>
                  <span style={{ flex: 'none', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: c.required ? color.mintDark : 'var(--color-60-text-secondary)' }}>{c.required ? '필수' : '선택'}</span>
                </div>
                <div style={{ marginTop: 'var(--space-0-5)', fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-normal)', fontWeight: 'var(--font-weight-medium)', color: color.textSecondary }}>{c.desc}</div>
              </div>
            </div>
          );
        })}

        <InfoNote>모든 연결은 조회 전용입니다. 신용조회 기록이 남지 않고, 설정에서 언제든 해제할 수 있어요.</InfoNote>
      </div>
      <div style={{ flex: 'none', padding: 'var(--space-2) var(--screen-padding-x) max(34px, env(safe-area-inset-bottom))', background: color.white, borderTop: '1px solid var(--color-60-border)' }}>
        <CtaButton
          disabled={!requiredOk}
          onClick={() => { if (requiredOk) navigate('/linking'); }}
          bg={requiredOk ? color.action : color.bgAlt}
          fg={requiredOk ? color.onAction : color.textSecondary}
          style={{ opacity: 1 }}
        >
          동의하고 계속
        </CtaButton>
      </div>
    </Screen>
  );
}
