import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Brand } from '../components/ui';
import { color } from '../styles/theme';
import type { PersonaKey } from '../types';

interface Card {
  key: PersonaKey;
  badge: string;
  name: string;
  hook: string;
  desc: string;
  accent: string;
  meta: string;
}

const cards: Card[] = [
  { key: 'A', badge: '🧑‍🎓', name: '자립준비청년', hook: '신용 이력이 없어요', desc: '전세보증금 3,000만원을 24개월 안에 모으고 싶지만, 신용조회 기록도 대출 이력도 없습니다.', accent: color.mint, meta: '신파일러 · 24세' },
  { key: 'C', badge: '💳', name: '리볼빙 청년', hook: '한도가 자꾸 차요', desc: '카드 한도 소진율 82%, 리볼빙 잔액 326만원. 결제 60초 안에 개입합니다.', accent: 'var(--im-lime)', meta: '청년 직장인 · 29세' },
];

/** Persona/situation picker: climb-demo's dark entry screen shown before the app itself. */
export function PickerScreen() {
  const navigate = useNavigate();
  const setPersona = useAppStore((s) => s.setPersona);
  const resetOnboarding = useAppStore((s) => s.resetOnboarding);

  const pick = (key: PersonaKey) => {
    setPersona(key);
    resetOnboarding();
    navigate('/bank');
  };

  return (
    <div
      style={{
        height: '100%', background: color.bg, color: color.ink, boxSizing: 'border-box',
        padding: 'var(--screen-pad-top) 22px 30px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'auto',
      }}
    >
      <div style={{ position: 'absolute', top: -90, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(var(--color-mint-rgb),.3),transparent 70%)', pointerEvents: 'none' }} />

      <Brand size={38} ink="var(--im-white)" accent={color.mint} style={{ position: 'relative' }} />

      <div style={{ position: 'relative', marginTop: 26, fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: color.textSecondary }}>어떤 상황을 보시겠어요?</div>
      <div style={{ position: 'relative', marginTop: 4, fontSize: 27, fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)' }}>
        상황을 하나 고르면<br />그 사람의 앱이 열립니다
      </div>
      <div style={{ position: 'relative', marginTop: 10, fontSize: 'var(--font-size-xs)', lineHeight: 1.65, fontWeight: 'var(--font-weight-medium)', color: color.textSecondary }}>
        iM뱅크 홈에서 CLiMB를 만나고, 자산 연결부터 목표 등록, 실시간 감지, 회복 미션까지 이어집니다.
      </div>

      <div style={{ position: 'relative', marginTop: 'var(--space-2-5)', display: 'flex', flexDirection: 'column', gap: 'var(--component-gap)' }}>
        {cards.map((c) => (
          <div
            key={c.key}
            onClick={() => pick(c.key)}
            style={{ background: color.white, borderRadius: 'var(--radius-xl)', padding: 'var(--space-2)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ flex: 'none', width: 54, height: 54, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 27, lineHeight: 1, background: c.accent }}>
                {c.badge}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.02em', color: color.mintDark }}>{c.hook}</div>
                <div style={{ marginTop: 'var(--space-0-5)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.025em' }}>{c.name}</div>
              </div>
              <div style={{ flex: 'none', width: 30, height: 30, borderRadius: '50%', background: color.mintTint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>›</div>
            </div>
            <div style={{ marginTop: 11, fontSize: 'var(--font-size-xs)', lineHeight: 1.65, fontWeight: 'var(--font-weight-medium)', color: color.textSecondary }}>{c.desc}</div>
            <div style={{ marginTop: 11, paddingTop: 11, borderTop: '1px solid var(--color-60-border)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <div style={{ flex: 'none', width: 22, height: 22, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: color.ink, background: c.accent }}>{c.key}</div>
              <span style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.05em', color: color.textSecondary }}>{c.meta}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', marginTop: 'auto', paddingTop: 22, fontSize: 'var(--font-size-2xs)', lineHeight: 1.65, fontWeight: 'var(--font-weight-semibold)', color: color.textSecondary }}>
        iM금융그룹 공모전 · 금융 목표를 향한 작은 실천
      </div>
    </div>
  );
}

