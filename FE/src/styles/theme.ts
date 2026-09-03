// Design tokens ported from the climb-demo design doc.
// Brand: iM 민트 (mint), iM 라임 (lime accent), 잉크 블랙 (ink), 천공 탑승권 (boarding-pass ticket motif).

export const color = {
  mint: '#00C7A9',
  mintDark: '#0A8873',
  mintDarker: '#077264',
  mintTint: '#DDF6F1',
  mintTintLight: '#E0F7F3',
  lime: '#E2F15E',
  limeText: '#5A6608',
  limeTintText: '#6E7A0A',
  ink: '#16191C',
  navy: '#16191C',
  bg: '#F0F2F3',
  bgAlt: '#EDEFF1',
  white: '#ffffff',
  sky: '#7DB5FF',
  skyText: '#2E6BD0',
  coral: '#FF7A5C',
  coralDark: '#C4472A',
  coralDarker: '#D0512E',
  coralInk: '#2B0B03',
  coralTint: '#FFD9CF',
  coralTintLight: '#FFEFEA',
  gold: '#C9A052',
  purple: '#7549C8',
  line: 'rgba(22,25,28,.12)',
  textPrimary: '#16191C',
  textSecondary: 'rgba(22,25,28,.6)',
  textTertiary: 'rgba(22,25,28,.45)',
} as const;

export const radius = {
  pill: 9999,
  card: 26,
  cardLg: 30,
  cardSm: 20,
};

export const font = {
  family: "'Noto Sans KR', system-ui, sans-serif",
};

/** rgba helper matching the source doc's inline `rgba(22,25,28,.NN)` usages */
export function ink(alpha: number): string {
  return `rgba(22,25,28,${alpha})`;
}

export function white(alpha: number): string {
  return `rgba(255,255,255,${alpha})`;
}
