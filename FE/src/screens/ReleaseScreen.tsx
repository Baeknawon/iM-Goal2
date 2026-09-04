import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { missionDefs } from '../data/personas';
import { Screen, Pill, ScreenBody, CtaButton } from '../components/ui';
import { color } from '../styles/theme';
import type { MissionResult } from '../types';

/**
 * 보증금 반환 + 결과 처리 화면.
 * 미션 결과(성공/실패/포기)에 따라 문구가 달라지지만, 세 경우 모두 보증금은 iMKRW 지갑으로
 * 전액 반환됩니다. 금전 처리는 동일하고 FCPS 기록만 다릅니다.
 * - MissionLive에서 진입: 이미 finishMission(result)로 처리됨 → 여기선 결과만 표시
 * - 홈 "회복 미션 성공 확인" 트리거(phase2)에서 진입: missionResult가 없으므로 여기서 성공 처리
 */
export function ReleaseScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const deposit = useAppStore((s) => s.deposit);
  const missionResult = useAppStore((s) => s.missionResult);
  const wallet = useAppStore((s) => s.wallet);
  const completeRecovery = useAppStore((s) => s.completeRecovery);
  const MI = missionDefs[persona];
  const legCode = MI.leg.split(' · ')[0];
  const depositLabel = deposit.toLocaleString();

  // 아직 결과 처리가 안 된 채로 들어온 경우(phase2 성공 흐름) → 성공으로 마무리
  useEffect(() => {
    if (missionResult === null) completeRecovery();
  }, [missionResult, completeRecovery]);

  const result: MissionResult = missionResult ?? 'success';
  const V = resultView[result];

  return (
      <Screen>
        <div style={{ padding: '68px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pill onClick={() => navigate('/missions')}>‹ 미션</Pill>
            <Pill bg={V.chipBg} fg={V.chipFg}>{V.chip}</Pill>
          </div>
          <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>{legCode} · {V.sub}</div>
          <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>{V.title}</div>
        </div>

        <ScreenBody>
          {/* 지갑 반환 카드 — 세 결과 모두 전액 반환 */}
          <div style={{ background: V.cardBg, borderRadius: 30, padding: 24, color: V.cardFg }}>
            <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', opacity: 0.65 }}>iMKRW 지갑으로 반환</div>
            <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>+{depositLabel}</span>
              <span style={{ fontSize: 18, fontWeight: 900 }}>iMKRW</span>
            </div>
            <div style={{ marginTop: 14, fontSize: 14, lineHeight: 1.65, fontWeight: 700, opacity: 0.72 }}>{V.moneyNote}</div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,.10)', fontSize: 13, fontWeight: 900 }}>
              지갑 잔액 {wallet.toLocaleString()} iMKRW
            </div>
          </div>

          {/* FCPS 반영 */}
          <div style={{ marginTop: 14, background: color.ink, borderRadius: 28, padding: 22, color: '#fff' }}>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: color.mint }}>FCPS에 기록됨</div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-.035em', color: V.delta >= 0 ? color.mint : color.coral }}>
              {V.delta >= 0 ? '+' : ''}{V.delta}
            </span>
              <span style={{ fontSize: 15, fontWeight: 900, opacity: 0.65 }}>{V.fcpsLabel}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.6)', lineHeight: 1.6 }}>{V.fcpsNote}</div>
            <CtaButton height={50} style={{ marginTop: 16, fontSize: 15 }} arrowBg={color.ink} onClick={() => navigate('/mileage')}>FCPS 궤적 보기</CtaButton>
          </div>

          <CtaButton height={62} style={{ marginTop: 14 }} onClick={() => navigate('/home')}>
            탑승권으로 돌아가기
          </CtaButton>
        </ScreenBody>
      </Screen>
  );
}

const resultView: Record<MissionResult, {
  chip: string; chipBg: string; chipFg: string; sub: string; title: string;
  cardBg: string; cardFg: string; moneyNote: string;
  delta: number; fcpsLabel: string; fcpsNote: string;
}> = {
  success: {
    chip: '미션 성공', chipBg: color.mint, chipFg: color.ink, sub: '완주했어요', title: '보증금을 돌려드려요',
    cardBg: color.mint, cardFg: color.ink,
    moneyNote: '기한 내 미션을 완수해 보증금이 iMKRW 지갑으로 전액 반환됐어요.',
    delta: 18, fcpsLabel: '미션 성공 기록', fcpsNote: '성공 이력이 신용 궤적에 긍정적으로 반영됩니다.',
  },
  fail: {
    chip: '미션 실패', chipBg: color.coralTint, chipFg: color.coralDark, sub: '이번엔 아쉬웠어요', title: '보증금은 돌려드려요',
    cardBg: color.coralTintLight, cardFg: '#3A1A11',
    moneyNote: '실패했지만 보증금은 소각 없이 iMKRW 지갑으로 전액 반환됩니다.',
    delta: -8, fcpsLabel: '미션 실패 기록', fcpsNote: '실패 이력도 신용 궤적에 기록돼요. 다음 미션으로 회복할 수 있어요.',
  },
  give_up: {
    chip: '미션 포기', chipBg: 'rgba(22,25,28,.12)', chipFg: color.ink, sub: '미션을 중단했어요', title: '보증금은 돌려드려요',
    cardBg: '#EDEFF1', cardFg: color.ink,
    moneyNote: '포기해도 보증금은 iMKRW 지갑으로 전액 반환됩니다.',
    delta: -5, fcpsLabel: '미션 포기 기록', fcpsNote: '포기 이력이 신용 궤적에 기록돼요. 언제든 다시 시작할 수 있어요.',
  },
};
