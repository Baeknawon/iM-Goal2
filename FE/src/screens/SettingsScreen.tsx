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
      <div style={{ padding: '68px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackToHome />
          <Pill>MY PASSPORT</Pill>
        </div>
        <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>iM뱅크 주거래 · SILVER</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>김서준님</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 22px 40px' }}>
        <div
          onClick={toggleBig}
          style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: 22, borderRadius: 28, cursor: 'pointer',
            background: big ? color.mint : 'rgba(22,25,28,.08)', color: big ? color.ink : '#fff',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-.015em' }}>큰 글씨 모드</div>
            <div style={{ marginTop: 3, fontSize: 13, fontWeight: 700, opacity: 0.6 }}>탑승권 금액 숫자를 34px → 44px로</div>
          </div>
          <div style={{ flex: 'none', width: 62, height: 36, borderRadius: 9999, padding: 3, boxSizing: 'border-box', display: 'flex', justifyContent: big ? 'flex-end' : 'flex-start', background: big ? color.ink : 'rgba(22,25,28,.16)', transition: 'all .2s ease' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: big ? color.mint : '#fff' }} />
          </div>
        </div>

        <div style={{ marginTop: 12, background: 'rgba(22,25,28,.08)', borderRadius: 28, padding: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.63)' }}>기내 안내방송 · 개입 강도</div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            {INTENSITIES.map((i) => {
              const on = intensity === i;
              return (
                <div
                  key={i}
                  onClick={() => setIntensity(i)}
                  style={{
                    flex: 1, height: 50, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 900, cursor: 'pointer',
                    background: on ? color.mint : 'rgba(22,25,28,.08)', color: on ? color.ink : 'rgba(22,25,28,.6)',
                  }}
                >
                  {i}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, fontSize: 13.5, lineHeight: 1.65, fontWeight: 500, color: 'rgba(22,25,28,.6)' }}>{intensityDescs[intensity]}</div>
        </div>

        <div style={{ marginTop: 12, background: 'rgba(22,25,28,.08)', borderRadius: 28, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.63)' }}>안심 장치</div>
          <SettingsRow icon="데" title="연동 데이터 관리" desc="언제든 해지 · 즉시 삭제" />
          <SettingsRow icon="F" title="FCPS 제공 동의 관리" desc="여신심사 보조자료 제공 여부" />
          <SettingsRow icon="비" iconBg="#FFD9CF" iconFg="#C4472A" title="비상 착륙 안내 다시 보기" desc="위험 등급일 때 자동으로 열립니다" onClick={() => navigate('/support')} />
        </div>

        <div style={{ marginTop: 14, height: 66, borderRadius: 9999, background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 18, fontWeight: 900, cursor: 'pointer' }}>
          <span style={{ width: 32, height: 32, borderRadius: '50%', background: color.ink, color: color.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>☎</span>
          전화 상담 1566-0000
        </div>
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'rgba(22,25,28,.58)' }}>평일 09:00~18:00 · 대기 없이 담당자 연결</div>
      </div>
    </Screen>
  );
}

function SettingsRow({
  icon, iconBg = color.mintTintLight, iconFg = '#077264', title, desc, onClick,
}: { icon: string; iconBg?: string; iconFg?: string; title: string; desc: string; onClick?: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, cursor: onClick ? 'pointer' : undefined }} onClick={onClick}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: iconBg, color: iconFg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15.5, fontWeight: 900 }}>{title}</div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(22,25,28,.63)', marginTop: 1 }}>{desc}</div>
      </div>
      <span style={{ fontSize: 19, opacity: 0.35 }}>›</span>
    </div>
  );
}
