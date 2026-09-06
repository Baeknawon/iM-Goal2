import type { CSSProperties, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { color } from '../styles/theme';

/** Screen root: full-height column, matches each `sc-if` screen's outer div. */
export function Screen({ children, bg = color.bg, style }: { children: ReactNode; bg?: string; style?: CSSProperties }) {
  return (
    <div className="app-screen" style={{ height: '100%', background: bg, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', ...style }}>
      {children}
    </div>
  );
}

/** Standard header block: back pill + right-side chip, then sub/title pair. */
export function ScreenHeader({
  onBack, backLabel = '‹ 뒤로', rightChip, sub, title, padTop = 68,
}: {
  onBack?: () => void; backLabel?: string; rightChip?: ReactNode; sub: ReactNode; title: ReactNode; padTop?: number;
}) {
  return (
    <div className="screen-header" style={{ padding: `${padTop}px var(--screen-padding-x) 0`, flex: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {onBack ? <Pill onClick={onBack}>{backLabel}</Pill> : <span />}
        {rightChip}
      </div>
      <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', lineHeight: 'var(--line-height-normal)', color: 'var(--color-60-text-secondary)' }}>{sub}</div>
      <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-tight)', marginTop: 'var(--space-0-5)' }}>{title}</div>
    </div>
  );
}

export function BackToHome({ label = '‹ 탑승권' }: { label?: string }) {
  const navigate = useNavigate();
  return <Pill onClick={() => navigate('/home')}>{label}</Pill>;
}

export function Pill({
  children, onClick, bg = 'var(--color-30-tab-bg)', fg = color.ink, style,
}: { children: ReactNode; onClick?: () => void; bg?: string; fg?: string; style?: CSSProperties }) {
  const Element = onClick ? 'button' : 'span';
  return (
    <Element
      onClick={onClick}
      style={{
        minHeight: onClick ? 'var(--touch-target-min)' : undefined, padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-pill)', background: bg, color: fg,
        fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', cursor: onClick ? 'pointer' : undefined,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flexShrink: 0, gap: 'var(--space-1)', whiteSpace: 'nowrap', ...style,
      }}
    >
      {children}
    </Element>
  );
}

/** Standard 56px CTA (52px compact), with an optional trailing arrow. */
export function CtaButton({
  children, onClick, bg = color.mint, fg = color.ink, height = 56, arrowBg, style, disabled = false,
}: { children: ReactNode; onClick?: () => void; bg?: string; fg?: string; height?: number; arrowBg?: string; style?: CSSProperties; disabled?: boolean }) {
  return (
    <button type="button" className="primary-cta"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', height: height >= 56 ? 'var(--btn-height-xl)' : 'var(--btn-height-lg)', borderRadius: 'var(--radius-lg)', background: bg, color: fg, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1)', cursor: disabled ? 'not-allowed' : 'pointer', ...style,
        minHeight: height >= 56 ? 'var(--btn-height-xl)' : 'var(--btn-height-lg)',
        flexShrink: 0,
      }}
    >
      {children}
      {arrowBg && (
        <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: '50%', background: arrowBg === bg ? fg : arrowBg, color: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)' }}>
          ›
        </span>
      )}
    </button>
  );
}

/** Mascot art. `pose` selects the illustration variant (default 't' = the original static icon). */
export function Mascot({
  name, pose = 't', height = 60, style, delay = 0,
}: { name: 'dandi' | 'ddokdi'; pose?: string; height?: number; style?: CSSProperties; delay?: number }) {
  return (
    <img
      src={`/assets/${name}${pose ? `-${pose}` : ''}.png`}
      alt={name === 'dandi' ? '단디' : '똑디'}
      style={{ height, width: 'auto', display: 'block', animation: `bob ${3.6 + delay}s ease-in-out infinite`, animationDelay: `${delay}s`, ...style }}
    />
  );
}

/** Shared logo image, scaled proportionally for each screen. */
export function Brand({ size = 23, style }: { size?: number; ink?: string; accent?: string; style?: CSSProperties }) {
  return (
    <img
      src="/assets/climb_logo.png"
      alt="climb"
      style={{ display: 'block', width: size * 3.5, height: 'auto', objectFit: 'contain', flex: 'none', ...style }}
    />
  );
}
export function Card({ children, style, bg = 'var(--color-60-bg-surface)' }: { children: ReactNode; style?: CSSProperties; bg?: string }) {
  return <div className="surface-card" style={{ background: bg, borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', color: color.ink, ...style }}>{children}</div>;
}

/** Scrollable body region below a ScreenHeader. */
export function ScreenBody({ children, padBottom = 120, style }: { children: ReactNode; padBottom?: number; style?: CSSProperties }) {
  return (
    <div className="screen-body" style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: `24px var(--screen-padding-x) ${padBottom}px`, ...style }}>
      {children}
    </div>
  );
}

/**
 * Boarding-pass ticket shell: top card, perforated middle seam, bottom card.
 * `watermark` overlays the faint climb logo behind the whole ticket (opacity/size vary by screen).
 */
export function TicketShell({
  top, bottom, watermark,
}: { top: ReactNode; bottom: ReactNode; watermark?: { width?: number; opacity?: number; zIndex?: number } }) {
  return (
    <div className="ticket-shell" style={{ position: 'relative' }}>
      {watermark && (
        <img
          src="/assets/climb_logo.png" alt=""
          style={{
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
            width: watermark.width ?? 180, height: 'auto', opacity: watermark.opacity ?? 0.06,
            pointerEvents: 'none', zIndex: watermark.zIndex,
          }}
        />
      )}
      <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0', padding: 'var(--card-padding-x)', color: color.ink, position: 'relative' }}>{top}</div>
      <div style={{ position: 'relative', height: 26, background: 'var(--color-60-bg-surface)', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
        <div style={{ position: 'absolute', right: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
        <div style={{ flex: 1, margin: '0 20px', height: 2, background: 'repeating-linear-gradient(90deg,var(--color-60-border) 0 6px,transparent 6px 12px)' }} />
      </div>
      <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)', padding: 'var(--card-padding-x)', color: color.ink }}>{bottom}</div>
    </div>
  );
}

export function ProgressBar({ pct, color: barColor = color.mint, bg = 'var(--color-30-tab-bg)', height = 11 }: { pct: number; color?: string; bg?: string; height?: number }) {
  return (
    <div style={{ height, borderRadius: 'var(--radius-pill)', background: bg, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 'var(--radius-pill)', background: barColor, transition: 'width .5s ease' }} />
    </div>
  );
}

export function InfoNote({ children, bg = 'var(--color-60-border)' }: { children: ReactNode; bg?: string }) {
  return (
    <div style={{ marginTop: 'var(--space-1-5)', background: bg, borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-relaxed)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-60-text-secondary)' }}>
      {children}
    </div>
  );
}

export function BarcodeStrip({ height = 42 }: { height?: number }) {
  return (
    <div
      style={{
        marginTop: 'var(--space-2)', height,
        background: 'repeating-linear-gradient(90deg,var(--color-60-text-primary) 0 2px,transparent 2px 4px,var(--color-60-text-primary) 4px 7px,transparent 7px 9px,var(--color-60-text-primary) 9px 10px,transparent 10px 14px)',
        opacity: 0.85,
      }}
    />
  );
}
