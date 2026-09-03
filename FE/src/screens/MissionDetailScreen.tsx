import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, BackToHome, Pill, ScreenBody } from '../components/ui';
import { missionDefs, missionProfileTags, acctDefs } from '../data/personas';
import { color } from '../styles/theme';

const DAY_OPTIONS = [7, 14, 21, 28];
const weeklySaveRate: Record<string, number> = { A: 16000, B: 42000, C: 22000 };

export function MissionDetailScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const missionDays = useAppStore((s) => s.missionDays);
  const setMissionDays = useAppStore((s) => s.setMissionDays);
  const accepted = useAppStore((s) => s.accepted);
  const toggleAccepted = useAppStore((s) => s.toggleAccepted);
  const setMissionOn = useAppStore((s) => s.setMissionOn);
  const MI = missionDefs[persona];
  const AP = acctDefs[persona];
  const missionSave = Math.round((missionDays / 7) * weeklySaveRate[persona]).toLocaleString() + '원';

  return (
    <Screen>
      <div style={{ padding: '68px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackToHome />
          <Pill>미션 DB 630건</Pill>
        </div>
        <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>AI 에이전트가 골라낸,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>회복 미션</div>
      </div>

      <ScreenBody>
        <div style={{ position: 'relative' }}>
          <div style={{ background: '#fff', borderRadius: '28px 28px 0 0', padding: '22px 24px', color: color.ink }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.1em', color: 'rgba(22,25,28,.58)' }}>{MI.leg}</div>
              <div style={{ padding: '5px 11px', borderRadius: 9999, background: color.mintTintLight, fontSize: 11.5, fontWeight: 900, color: '#0A8873' }}>{MI.difficulty}</div>
            </div>
            <div style={{ marginTop: 12, fontSize: 24, fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1.3 }}>{MI.title1}<br />{MI.title2}</div>
            <div style={{ marginTop: 14, display: 'flex', gap: 20 }}>
              <Stat label="기간" value={`${missionDays}일`} />
              <Stat label="절약 금액" value={missionSave} />
              <Stat label="도착일" value={AP.etaShort} accent />
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 900, color: 'rgba(22,25,28,.58)' }}>
                <span>기간 조정</span><span>7 · 14 · 21 · 28일</span>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 7 }}>
                {DAY_OPTIONS.map((d) => (
                  <div
                    key={d}
                    onClick={() => setMissionDays(d)}
                    style={{
                      flex: 1, height: 44, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 900, cursor: 'pointer',
                      background: missionDays === d ? color.navy : '#F2F5F4', color: missionDays === d ? '#fff' : 'rgba(10,30,26,.5)',
                    }}
                  >
                    {d}일
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', height: 26, background: '#fff', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
            <div style={{ position: 'absolute', right: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
            <div style={{ flex: 1, margin: '0 20px', height: 2, background: 'repeating-linear-gradient(90deg,#D8E2DF 0 6px,transparent 6px 12px)' }} />
          </div>
          <div style={{ background: '#fff', borderRadius: '0 0 28px 28px', padding: '20px 24px 24px', color: color.ink }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <div style={{ background: color.mintTintLight, borderRadius: 20, padding: 15 }}>
                <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '.08em', color: '#0A8873' }}>① 왜 이 구간인가요</div>
                <div style={{ marginTop: 6, fontSize: 14.5, lineHeight: 1.65, fontWeight: 500 }}>{MI.why}</div>
              </div>
              <div style={{ background: '#F2F5F4', borderRadius: 20, padding: 15 }}>
                <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.58)' }}>② 어떻게 하나요</div>
                <div style={{ marginTop: 6, fontSize: 14.5, lineHeight: 1.65, fontWeight: 500 }}>{MI.how}</div>
              </div>
            </div>
            <div
              onClick={() => { setMissionOn(true); navigate('/token'); }}
              style={{ marginTop: 16, height: 56, borderRadius: 9999, background: color.ink, color: '#fff', fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }}
            >
              보증금 걸고 탑승하기
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>›</span>
            </div>
            <div
              onClick={() => { toggleAccepted(); setMissionOn(true); }}
              style={{
                marginTop: 9, height: 52, borderRadius: 9999, fontSize: 15.5, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                background: accepted ? color.mintTintLight : '#F2F5F4', color: accepted ? color.mintDark : 'rgba(10,30,26,.6)',
              }}
            >
              {accepted ? `탑승 완료 · D-${missionDays}` : '보증금 없이 탑승하기'}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, fontSize: 18, fontWeight: 900, letterSpacing: '-.02em' }}>이 티켓을 만든 근거</div>
        <div style={{ marginTop: 12, background: 'rgba(22,25,28,.08)', borderRadius: 26, padding: 20 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {missionProfileTags[persona].map((p) => (
              <div key={p} style={{ padding: '9px 14px', borderRadius: 9999, background: 'rgba(203,224,75,.22)', fontSize: 13, fontWeight: 900, color: '#5A6608' }}>{p}</div>
            ))}
          </div>
        </div>
      </ScreenBody>
    </Screen>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 900, color: 'rgba(22,25,28,.58)' }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 900, marginTop: 2, color: accent ? '#0A8873' : color.ink }}>{value}</div>
    </div>
  );
}
