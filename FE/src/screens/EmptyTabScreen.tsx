import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Brand, CtaButton } from '../components/ui';
import type { EmptyTabKey } from '../types';

const copy: Record<EmptyTabKey, { title: string; desc: string; icon: string }> = {
  소비분석: { title: '분석할 지출이 모이는 중', desc: '자산을 연결한 날부터 카테고리별 소비 흐름이 쌓입니다.', icon: '▥' },
  알림: { title: '아직 감지된 이탈이 없어요', desc: '금융 목표를 등록하면 결제 60초 안에 위험을 알려드립니다.', icon: '◍' },
  미션: { title: '진행 중인 구간 미션이 없어요', desc: '이탈이 감지되면 AI가 회복 미션을 제안합니다.', icon: '⚿' },
  신용: { title: '기록이 아직 비어 있어요', desc: '미션 성공과 목표 준수가 첫 신용 궤적이 됩니다.', icon: '◆' },
};

/** Shown when a bottom-nav tab is opened before any goal has been registered. */
export function EmptyTabScreen() {
  const navigate = useNavigate();
  const emptyTab = useAppStore((s) => s.emptyTab);
  const c = copy[emptyTab];

  return (
    <Screen>
      <div style={{ padding: '68px 22px 0', flex: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <Brand size={23} />
          <div style={{ padding: '9px 15px', borderRadius: 9999, background: 'rgba(22,25,28,.12)', fontSize: 13, fontWeight: 900, whiteSpace: 'nowrap' }}>목표 미등록</div>
        </div>
        <div style={{ marginTop: 18, fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16 }}>{emptyTab}</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '22px 22px 120px' }}>
        <div style={{ background: '#fff', borderRadius: 30, padding: '38px 26px', textAlign: 'center' }}>
          <div style={{ width: 74, height: 74, borderRadius: '50%', background: 'rgba(22,25,28,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'rgba(22,25,28,.35)', margin: '0 auto' }}>
            {c.icon}
          </div>
          <div style={{ marginTop: 18, fontSize: 19, fontWeight: 900, letterSpacing: '-.025em' }}>{c.title}</div>
          <div style={{ marginTop: 9, fontSize: 14, lineHeight: 1.7, fontWeight: 500, color: 'rgba(22,25,28,.62)' }}>{c.desc}</div>
          <CtaButton height={54} bg="#16191C" fg="#fff" arrowBg="#00C7A9" style={{ marginTop: 20, fontSize: 15.5 }} onClick={() => navigate('/input')}>
            금융 목표 등록하기
          </CtaButton>
        </div>
      </div>
    </Screen>
  );
}
