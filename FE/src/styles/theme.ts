// Shared aliases for 디자인스킬.md. CSS tokens are the source of truth.
// Brand: iM 민트 (mint), iM 라임 (lime accent), 잉크 블랙 (ink), 천공 탑승권 (boarding-pass ticket motif).

export const color = {
  mint: 'var(--im-mint)',
  mintDark: 'var(--color-accent-text)',
  mintDarker: 'var(--color-accent-text)',
  mintTint: 'var(--color-30-surface-sub)',
  mintTintLight: 'var(--color-30-surface-sub)',
  lime: 'var(--im-lime)',
  limeText: 'var(--color-lime-text)',
  limeTintText: 'var(--color-lime-text)',
  hero: 'var(--color-hero)',
  action: 'var(--color-action-bg)',
  onAction: 'var(--color-action-text)',
  selected: 'var(--color-selected-bg)',
  selectedText: 'var(--color-selected-text)',
  ink: 'var(--color-60-text-primary)',
  navy: 'var(--color-60-text-primary)',
  bg: 'var(--color-60-bg-base)',
  bgAlt: 'var(--color-30-tab-bg)',
  white: 'var(--color-60-bg-surface)',
  sky: 'var(--im-blue)',
  skyText: 'var(--color-info-text)',
  coral: 'var(--color-danger)',
  coralDark: 'var(--color-danger)',
  coralDarker: 'var(--color-danger)',
  coralInk: 'var(--color-60-text-primary)',
  coralTint: 'var(--color-danger-surface)',
  coralTintLight: 'var(--color-danger-surface)',
  gold: 'var(--im-beige)',
  purple: 'var(--color-purple-text)',
  line: 'var(--color-60-border)',
  textPrimary: 'var(--color-60-text-primary)',
  textSecondary: 'var(--color-60-text-secondary)',
  textTertiary: 'var(--color-60-text-secondary)',
} as const;

export const radius = {
  pill: 9999,
  card: 20,
  cardLg: 24,
  cardSm: 16,
};

export const font = {
  family: 'var(--font-family-sans)',
};

/** rgba helper matching the source doc's inline `rgba(22,25,28,.NN)` usages */
export function ink(alpha: number): string {
  return `rgba(var(--color-ink-rgb),${alpha})`;
}

export function white(alpha: number): string {
  return `rgba(var(--color-white-rgb),${alpha})`;
}
