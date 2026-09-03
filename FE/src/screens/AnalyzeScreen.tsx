import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Pill, CtaButton } from '../components/ui';
import { color } from '../styles/theme';

const DURATION_MS = 3200;

export function AnalyzeScreen() {
  const navigate = useNavigate();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    setPct(0);
    const start = Date.now();
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / DURATION_MS);
      setPct(Math.round(t * 100));
      if (t >= 1) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, []);

  const done = pct >= 100;

  return (
    <Screen>
      <div style={{ padding: '74px 22px 34px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill>CHECK-IN · 2/3</Pill>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: color.mint }} />
        </div>
        <div style={{ marginTop: 18, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>AI가 항로를 계산하고 있어요,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>연결된 12개월 내역을<br />읽고 있어요</div>

        <div style={{ marginTop: 24, background: '#fff', borderRadius: 30, padding: 24, color: color.ink }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                position: 'relative', width: 120, height: 120, borderRadius: '50%', flex: 'none',
                background: `conic-gradient(#16191C 0turn ${pct / 100}turn, #E6EDEA ${pct / 100}turn 1turn)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <div style={{ width: 94, height: 94, borderRadius: '50%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 29, fontWeight: 900, letterSpacing: '-.03em' }}>{pct}<span style={{ fontSize: 15 }}>%</span></div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(22,25,28,.61)' }}>분석 중</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <AnalyzeRow label="고정비 · 예산" done />
              <AnalyzeRow label="소비 우선순위" done />
              <AnalyzeRow label="기간 실현 가능성" done={done} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 22, padding: '13px 18px', fontSize: 13.5, lineHeight: 1.6, fontWeight: 700, textAlign: 'center', color: 'rgba(22,25,28,.78)' }}>
            단디와 똑디가 항로도를 펼쳐 놓고<br />가장 무리 없는 경로를 찾고 있어요
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 14 }} />
        <div style={{ position: 'relative', height: 236, margin: '0 -22px -34px', flex: 'none' }}>
          <img
            src="/assets/pair-map.png" alt="항로도를 함께 보는 단디와 똑디"
            style={{ position: 'absolute', left: '50%', marginLeft: -176, bottom: 36, width: 352, height: 'auto', display: 'block', animation: 'unfurl 3.2s ease-in-out infinite', filter: 'drop-shadow(0 14px 22px rgba(22,25,28,.16))' }}
          />
        </div>
        <div style={{ flex: 1 }} />
        {done && (
          <CtaButton height={62} style={{ animation: 'fadeUp .5s ease both' }} onClick={() => navigate('/plan')}>
            계산 결과 보기
          </CtaButton>
        )}
      </div>
    </Screen>
  );
}

function AnalyzeRow({ label, done }: { label: string; done: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div
        style={{
          width: 22, height: 22, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: done ? color.mint : '#E6EDEA',
        }}
      >
        {!done && <div style={{ width: 11, height: 11, borderRadius: '50%', border: '2px solid #16191C', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />}
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 900, color: done ? color.ink : 'rgba(22,25,28,.63)' }}>{label}</span>
    </div>
  );
}
