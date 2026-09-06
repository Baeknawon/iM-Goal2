import type { UCBlock } from '../data/ucDefs';
import { color } from '../styles/theme';
import { Mascot } from './ui';

/** Renders one block of a use-case walkthrough screen (u11..u36). */
export function UCBlockView({ block, accent }: { block: UCBlock; accent: string }) {
  switch (block.type) {
    case 'quote':
      return (
        <div style={{ background: 'var(--im-white)', border: '1px solid var(--color-60-border)', borderRadius: 24, padding: 18, fontSize: 15.5, fontWeight: 700, lineHeight: 1.6 }}>
          {block.text}
        </div>
      );

    case 'bubble':
      return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--component-gap)' }}>
          <Mascot name={block.mascot} height={56} style={{ width: 56, objectFit: 'contain' }} />
          <div style={{ flex: 1, borderRadius: '22px 22px 22px 7px', padding: '15px 17px', color: color.ink, fontSize: 14, fontWeight: 'var(--font-weight-semibold)', lineHeight: 1.55, background: block.bg }}>
            {block.text}
          </div>
        </div>
      );

    case 'stat':
      return (
        <div style={{ background: 'var(--im-white)', border: '1px solid var(--color-60-border)', borderRadius: 26, padding: 20, boxShadow: '0 1px 2px rgba(var(--color-ink-rgb),.05)' }}>
          {block.label && <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>{block.label}</div>}
          {block.bigVal !== undefined && (
            <div style={{ marginTop: 5, display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ fontSize: 38, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{block.bigVal}</span>
              <span style={{ fontSize: 17, fontWeight: 'var(--font-weight-bold)' }}>{block.bigUnit}</span>
            </div>
          )}
          {block.headline && <div style={{ fontSize: 19, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em', lineHeight: 1.4 }}>{block.headline}</div>}
          {block.barPct !== undefined && (
            <div style={{ marginTop: 14, height: 11, borderRadius: 9999, background: 'var(--color-60-bg-base)', overflow: 'hidden' }}>
              <div style={{ width: `${block.barPct}%`, height: '100%', borderRadius: 9999, background: accent }} />
            </div>
          )}
          {block.rows && block.rows.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--color-60-border)', display: 'flex', flexDirection: 'column', gap: 'var(--component-gap)' }}>
              {block.rows.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-60-text-secondary)' }}>{r.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 'var(--font-weight-semibold)', color: r.color || color.ink }}>{r.value}</span>
                </div>
              ))}
            </div>
          )}
          {block.note && <div style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.65, fontWeight: 700, color: 'var(--color-60-text-secondary)' }}>{block.note}</div>}
        </div>
      );

    case 'alert': {
      const isRisk = block.tag.includes('감지') || block.tag.includes('위험');
      return (
        <div style={{ background: 'var(--color-hero)', borderRadius: 26, padding: 20, color: 'var(--im-white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--component-gap)' }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--color-danger)', animation: 'ringPulse 1.8s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: isRisk ? 'var(--color-danger-on-dark)' : accent }}>{block.tag}</span>
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-end', gap: 11 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 19, fontWeight: 'var(--font-weight-bold)', lineHeight: 1.4 }}>{block.headline}</div>
              {block.note && <div style={{ marginTop: 5, fontSize: 13, color: 'var(--color-text-on-dark-muted)' }}>{block.note}</div>}
            </div>
            {block.mascot && <Mascot name={block.mascot} height={64} style={{ width: 52, marginBottom: -16, objectFit: 'contain' }} />}
          </div>
        </div>
      );
    }

    case 'bars':
      return (
        <div style={{ background: 'var(--im-white)', border: '1px solid var(--color-60-border)', borderRadius: 26, padding: 20, display: 'flex', flexDirection: 'column', gap: 15, boxShadow: '0 1px 2px rgba(var(--color-ink-rgb),.05)' }}>
          {block.rows.map((r, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 'var(--font-weight-semibold)' }}>{r.name}</span>
                <span style={{ fontSize: 13.5, fontWeight: 'var(--font-weight-semibold)', color: r.color }}>{r.tag}</span>
              </div>
              <div style={{ marginTop: 7, height: 10, borderRadius: 9999, background: 'var(--color-60-bg-base)', overflow: 'hidden' }}>
                <div style={{ width: `${r.pct}%`, height: '100%', borderRadius: 9999, background: r.color }} />
              </div>
              {r.note && <div style={{ marginTop: 5, fontSize: 12, fontWeight: 700, color: 'var(--color-60-text-secondary)' }}>{r.note}</div>}
            </div>
          ))}
        </div>
      );

    case 'shift':
      return (
        <div style={{ background: 'var(--color-hero)', borderRadius: 26, padding: 20, color: 'var(--im-white)' }}>
          <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: accent }}>{block.tag}</div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 'var(--component-gap)', fontSize: 19, fontWeight: 'var(--font-weight-bold)' }}>
            <span style={{ color: 'var(--color-text-on-dark-muted)' }}>{block.from}</span>
            <span style={{ color: 'var(--color-danger-on-dark)' }}>→</span>
            <span>{block.to}</span>
          </div>
          {block.note && <div style={{ marginTop: 6, fontSize: 13, fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-danger-on-dark)' }}>{block.note}</div>}
        </div>
      );

    case 'reasons':
      return (
        <div style={{ background: color.mintTint, border: '1px solid rgba(var(--color-mint-rgb),.3)', borderRadius: 26, padding: 18 }}>
          <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-accent-text)' }}>{block.label}</div>
          <div style={{ marginTop: 11, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5, fontWeight: 700, lineHeight: 1.5 }}>
            {block.items.map((t, i) => <div key={i}>· {t}</div>)}
          </div>
        </div>
      );

    case 'ticket': {
      const lightAccent = accent === color.mint || accent === color.lime;
      return (
        <div style={{ borderRadius: 26, padding: 20, color: lightAccent ? color.ink : 'var(--im-white)', background: accent === 'var(--color-lime-text)' ? color.ink : accent }}>
          <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.1em', color: lightAccent ? 'var(--color-60-text-secondary)' : 'var(--color-text-on-dark-muted)' }}>{block.label}</div>
          {block.big && (
            <div style={{ marginTop: 9, display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ fontSize: 36, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{block.big}</span>
              <span style={{ fontSize: 16, fontWeight: 'var(--font-weight-bold)' }}>원</span>
            </div>
          )}
          <div style={{ marginTop: 8, fontSize: 14.5, fontWeight: 'var(--font-weight-bold)', lineHeight: 1.5 }}>{block.sub}</div>
          {block.rows && block.rows.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--color-60-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {block.rows.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 'var(--font-weight-semibold)' }}>
                  <span style={{ opacity: 0.7 }}>{r.label}</span><span>{r.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    case 'verify':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--component-gap)' }}>
          {block.rows.map((r, i) => (
            <div
              key={i}
              style={{
                background: 'var(--im-white)', borderRadius: 22, padding: 16, display: 'flex', alignItems: 'center', gap: 13,
                border: `1px solid ${r.done ? 'rgba(var(--color-mint-rgb),.35)' : 'var(--color-60-border)'}`,
              }}
            >
              <div
                style={{
                  flex: 'none', width: 32, height: 32, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 'var(--font-weight-semibold)', background: r.done ? accent : 'rgba(var(--color-ink-rgb),.12)', color: r.done ? 'var(--im-white)' : 'var(--color-60-text-secondary)',
                }}
              >
                {r.done ? '✓' : String(i + 1)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.01em' }}>{r.title}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      );

    case 'segmented':
      return (
        <div style={{ display: 'flex', gap: 8 }}>
          {block.options.map((label, i) => {
            const on = i === block.activeIndex;
            const dangerActive = block.options.length === 3;
            return (
              <div
                key={label}
                style={{ minHeight: 'var(--btn-height-lg)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',
                  flex: 1, height: 'var(--btn-height-lg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)',
                  background: on ? (dangerActive ? color.coralDarker : color.ink) : 'var(--im-white)',
                  border: on ? '1px solid transparent' : '1px solid var(--color-60-border)',
                  color: on ? 'var(--im-white)' : 'var(--color-60-text-secondary)',
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      );

    case 'productFit':
      return (
        <div style={{ background: 'var(--im-white)', border: '1px solid rgba(var(--color-mint-rgb),.4)', borderRadius: 26, padding: 20, boxShadow: '0 0 0 3px rgba(var(--color-mint-rgb),.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-accent-text)' }}>가장 먼저 맞는 상품</div>
            <div style={{ padding: '5px 11px', borderRadius: 9999, background: color.mintTintLight, color: 'var(--color-accent-text)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)' }}>{block.chip}</div>
          </div>
          <div style={{ marginTop: 9, fontSize: 21, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.025em' }}>{block.name}</div>
          <div style={{ marginTop: 9, fontSize: 13.5, lineHeight: 1.6, fontWeight: 700, color: 'var(--color-60-text-secondary)' }}>{block.desc}</div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--color-60-border)', fontSize: 12.5, fontWeight: 700, lineHeight: 1.6, color: 'var(--color-60-text-secondary)' }}>{block.note}</div>
        </div>
      );

    default:
      return null;
  }
}
