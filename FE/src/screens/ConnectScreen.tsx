import { useNavigate } from 'react-router-dom';
import { Screen, ScreenHeader, Pill, CtaButton, InfoNote } from '../components/ui';
import { connectItems } from '../data/staticContent';
import { color } from '../styles/theme';

export function ConnectScreen() {
  const navigate = useNavigate();

  return (
    <Screen>
      <ScreenHeader
        onBack={() => navigate('/consent')}
        backLabel="‹ 뒤로"
        rightChip={<Pill bg={color.mint} fg={color.ink}>동의 3/4 · 완료</Pill>}
        sub="연결이 끝났어요,"
        title="이 자산을 봅니다"
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 34px', display: 'flex', flexDirection: 'column', gap: 'var(--component-gap)' }}>
        {connectItems.map((c) => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)', background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: '18px 20px' }}>
            <div
              style={{
                flex: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', background: c.linked ? color.mint : 'rgba(var(--color-ink-rgb),.10)', color: c.linked ? color.ink : 'var(--color-60-text-secondary)',
              }}
            >
              {c.linked ? '✓' : '+'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-.015em' }}>{c.name}</div>
              <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{c.desc}</div>
            </div>
            <div style={{ flex: 'none', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: c.linked ? color.mintDark : 'var(--color-60-text-secondary)' }}>{c.tag}</div>
          </div>
        ))}
        <InfoNote>연결은 조회 전용입니다. 신용조회 기록이 남지 않고, 언제든 설정에서 해제할 수 있어요.</InfoNote>
        <CtaButton
          height={56} bg="var(--color-action-bg)" fg="var(--color-action-text)" arrowBg="var(--color-action-text)"
          style={{ marginTop: 4 }}
          onClick={() => navigate('/income')}
        >
          소득·재산 확인하기
        </CtaButton>
      </div>
    </Screen>
  );
}
