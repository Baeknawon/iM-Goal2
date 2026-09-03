import type { CSSProperties, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { color } from '../styles/theme';

/** Screen root: full-height column, matches each `sc-if` screen's outer div. */
export function Screen({ children, bg = color.bg, style }: { children: ReactNode; bg?: string; style?: CSSProperties }) {
  return (
    <div style={{ height: '100%', background: bg, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', ...style }}>
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
    <div style={{ padding: `${padTop}px 22px 0`, flex: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {onBack ? <Pill onClick={onBack}>{backLabel}</Pill> : <span />}
        {rightChip}
      </div>
      <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>{sub}</div>
      <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>{title}</div>
    </div>
  );
}

export function BackToHome({ label = '‹ 탑승권' }: { label?: string }) {
  const navigate = useNavigate();
  return <Pill onClick={() => navigate('/home')}>{label}</Pill>;
}

export function Pill({
  children, onClick, bg = 'rgba(22,25,28,.12)', fg = color.ink, style,
}: { children: ReactNode; onClick?: () => void; bg?: string; fg?: string; style?: CSSProperties }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '9px 15px', borderRadius: 9999, background: bg, color: fg,
        fontSize: 13, fontWeight: 900, cursor: onClick ? 'pointer' : undefined,
        display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Full-width pill CTA button with the recurring trailing circle-arrow. */
export function CtaButton({
  children, onClick, bg = color.mint, fg = color.ink, height = 62, arrowBg, style,
}: { children: ReactNode; onClick?: () => void; bg?: string; fg?: string; height?: number; arrowBg?: string; style?: CSSProperties }) {
  return (
    <div
      onClick={onClick}
      style={{
        height, borderRadius: 9999, background: bg, color: fg, fontSize: 17, fontWeight: 900,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', ...style,
      }}
    >
      {children}
      {arrowBg && (
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: arrowBg, color: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
          ›
        </span>
      )}
    </div>
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

/**
 * "climb" wordmark, drawn in CSS (no image): a lowercase c, a leaning flagpole standing in
 * for the l/i, a mint dot for the i's tick, then "mb". Matches climb-demo.dc.html's logo.
 * `size` is the letter font-size in px; all other dimensions scale off it.
 */
export function Brand({ size = 23, ink = color.ink, accent = color.mint, style }: { size?: number; ink?: string; accent?: string; style?: CSSProperties }) {
  const r = size / 23;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 0, flex: 'none', ...style }}>
      <span style={{ fontSize: size, fontWeight: 900, letterSpacing: '-.05em', color: ink, marginRight: -4 * r }}>c</span>
      <span style={{ position: 'relative', width: 10 * r, height: 18 * r, flex: 'none' }}>
        <span style={{ position: 'absolute', left: 2 * r, bottom: 0, width: 3 * r, height: 25 * r, background: ink, borderRadius: 9999, transform: 'rotate(26deg)', transformOrigin: 'bottom center' }} />
      </span>
      <span style={{ position: 'relative', fontSize: size, fontWeight: 900, letterSpacing: '-.05em', color: accent, marginLeft: -1 * r }}>
        ım
        <span style={{ position: 'absolute', left: -1 * r, bottom: 24 * r, width: 7 * r, height: 7 * r, borderRadius: '50%', background: accent }} />
      </span>
      <span style={{ fontSize: size, fontWeight: 900, letterSpacing: '-.05em', color: ink }}>b</span>
    </span>
  );
}

export function Card({ children, style, bg = '#fff' }: { children: ReactNode; style?: CSSProperties; bg?: string }) {
  return <div style={{ background: bg, borderRadius: 26, padding: 20, color: color.ink, ...style }}>{children}</div>;
}

/** Scrollable body region below a ScreenHeader. */
export function ScreenBody({ children, padBottom = 120, style }: { children: ReactNode; padBottom?: number; style?: CSSProperties }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: `16px 22px ${padBottom}px`, ...style }}>
      {children}
    </div>
  );
}

/**
 * Boarding-pass ticket shell: top card, perforated middle seam, bottom card.
 * `watermark` overlays the faint iM mark behind the whole ticket (opacity/size vary by screen).
 */
export function TicketShell({
  top, bottom, watermark,
}: { top: ReactNode; bottom: ReactNode; watermark?: { width?: number; opacity?: number; zIndex?: number } }) {
  return (
    <div style={{ position: 'relative' }}>
      {watermark && (
        <img
          src="/assets/im-mark.png" alt=""
          style={{
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
            width: watermark.width ?? 180, height: 'auto', opacity: watermark.opacity ?? 0.06,
            pointerEvents: 'none', zIndex: watermark.zIndex,
          }}
        />
      )}
      <div style={{ background: '#fff', borderRadius: '28px 28px 0 0', padding: '22px 24px 20px', color: color.ink, position: 'relative' }}>{top}</div>
      <div style={{ position: 'relative', height: 26, background: '#fff', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
        <div style={{ position: 'absolute', right: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
        <div style={{ flex: 1, margin: '0 20px', height: 2, background: 'repeating-linear-gradient(90deg,#D8E2DF 0 6px,transparent 6px 12px)' }} />
      </div>
      <div style={{ background: '#fff', borderRadius: '0 0 28px 28px', padding: '20px 24px 24px', color: color.ink }}>{bottom}</div>
    </div>
  );
}

export function ProgressBar({ pct, color: barColor = color.mint, bg = '#E9ECEE', height = 11 }: { pct: number; color?: string; bg?: string; height?: number }) {
  return (
    <div style={{ height, borderRadius: 9999, background: bg, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 9999, background: barColor, transition: 'width .5s ease' }} />
    </div>
  );
}

export function InfoNote({ children, bg = 'rgba(22,25,28,.08)' }: { children: ReactNode; bg?: string }) {
  return (
    <div style={{ marginTop: 14, background: bg, borderRadius: 24, padding: 20, fontSize: 13.5, lineHeight: 1.7, fontWeight: 500, color: 'rgba(22,25,28,.6)' }}>
      {children}
    </div>
  );
}

export function BarcodeStrip({ height = 42 }: { height?: number }) {
  return (
    <div
      style={{
        marginTop: 16, height,
        background: 'repeating-linear-gradient(90deg,#16191C 0 2px,transparent 2px 4px,#16191C 4px 7px,transparent 7px 9px,#16191C 9px 10px,transparent 10px 14px)',
        opacity: 0.85,
      }}
    />
  );
}
