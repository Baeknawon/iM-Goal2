import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { BackToHome, Pill, Screen } from '../components/ui';
import type { IntensityKey } from '../types';
import { color } from '../styles/theme';

const INTENSITIES: IntensityKey[] = ['약하게', '보통', '강하게'];
const intensityDescs: Record<IntensityKey, string> = {
  약하게: '주 1회 요약만 방송합니다. 알림이 부담스러운 분께 권합니다.',
  보통: '예산을 초과한 날에만 알려드립니다. 기본값입니다.',
  강하게: '결제마다 즉시 알리고, 구간도 매일 새로 제안합니다.',
};

export function SettingsScreen() {
  const navigate = useNavigate();
  const big = useAppStore((s) => s.big);
  const toggleBig = useAppStore((s) => s.toggleBig);
  const intensity = useAppStore((s) => s.intensity);
  const setIntensity = useAppStore((s) => s.setIntensity);

  return (
    <Screen>
      <div style={{ padding: '68px var(--screen-padding-x) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackToHome />
          <Pill>MY PASSPORT</Pill>
        </div>
        <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>김서준님 · iM뱅크 주거래</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>마이페이지</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 22px 40px' }}>
        <div
          onClick={toggleBig}
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2-5)', borderRadius: 'var(--radius-xl)', cursor: 'pointer',
            background: big ? color.mint : 'rgba(var(--color-ink-rgb),.08)', color: big ? color.ink : color.textSecondary,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.015em' }}>큰 글씨 모드</div>
            <div style={{ marginTop: 3, fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', opacity: 0.6 }}>탑승권 금액 숫자를 34px → 44px로</div>
          </div>
          <div style={{ flex: 'none', width: 62, height: 36, borderRadius: 'var(--radius-pill)', padding: 3, boxSizing: 'border-box', display: 'flex', justifyContent: big ? 'flex-end' : 'flex-start', background: big ? color.mint : 'rgba(var(--color-ink-rgb),.16)', transition: 'all .2s ease' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: big ? color.mint : 'var(--im-white)' }} />
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)' }}>
          <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>기내 안내방송 · 개입 강도</div>
          <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', gap: 'var(--space-1)' }}>
            {INTENSITIES.map((i) => {
              const on = intensity === i;
              return (
                <div
                  key={i}
                  onClick={() => setIntensity(i)}
                  style={{ minHeight: 'var(--btn-height-lg)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',
                    flex: 1, height: 'var(--btn-height-lg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
                    background: on ? color.mint : 'rgba(var(--color-ink-rgb),.08)', color: on ? color.ink : 'var(--color-60-text-secondary)',
                  }}
                >
                  {i}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 'var(--space-1-5)', fontSize: 'var(--font-size-xs)', lineHeight: 1.65, fontWeight: 'var(--font-weight-medium)', color: 'var(--color-60-text-secondary)' }}>{intensityDescs[intensity]}</div>
        </div>

        <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
          <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>안심 장치</div>
          <SettingsRow icon="데" title="연동 데이터 관리" desc="언제든 해지 · 즉시 삭제" />
          <SettingsRow icon="F" title="FCPS 제공 동의 관리" desc="여신심사 보조자료 제공 여부" />
          <SettingsRow icon="비" iconBg="var(--color-danger-surface)" iconFg="var(--color-danger)" title="비상 착륙 안내 다시 보기" desc="위험 등급일 때 자동으로 열립니다" onClick={() => navigate('/support')} />
        </div>

        <div style={{ minHeight: 'var(--btn-height-xl)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',  marginTop: 'var(--space-1-5)', height: 'var(--btn-height-xl)', borderRadius: 'var(--radius-lg)', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1-5)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer' }}>
          <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-hero)', color: color.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)' }}>☎</span>
          전화 상담 1566-0000
        </div>
        <div style={{ marginTop: 'var(--space-1-5)', textAlign: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>평일 09:00~18:00 · 대기 없이 담당자 연결</div>
      </div>
    </Screen>
  );
}

function SettingsRow({
  icon, iconBg = color.mintTintLight, iconFg = 'var(--color-accent-text)', title, desc, onClick,
}: { icon: string; iconBg?: string; iconFg?: string; title: string; desc: string; onClick?: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, cursor: onClick ? 'pointer' : undefined }} onClick={onClick}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: iconBg, color: iconFg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>{title}</div>
        <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{desc}</div>
      </div>
      <span style={{ fontSize: 'var(--font-size-lg)', opacity: 0.35 }}>›</span>
    </div>
  );
}
