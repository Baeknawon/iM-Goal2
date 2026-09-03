import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Pill, ScreenBody } from '../components/ui';
import { spendMap, dayTxns } from '../data/staticContent';
import { color } from '../styles/theme';

const TODAY = 18;

export function CalendarScreen() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(TODAY);

  const cells = useMemo(() => {
    const out: { day: number | null; amt: number | undefined }[] = [];
    for (let i = 0; i < 35; i++) {
      const day = i - 2;
      out.push(day < 1 || day > 31 ? { day: null, amt: undefined } : { day, amt: spendMap[day] });
    }
    return out;
  }, []);

  return (
    <Screen>
      <div style={{ padding: '68px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill onClick={() => navigate('/spend')}>‹ 소비분석</Pill>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 900 }}>
            <span style={{ opacity: 0.4 }}>‹</span>7월<span style={{ opacity: 0.4 }}>›</span>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>예산을 아낀 날은 민트색이에요</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>소비 달력</div>
      </div>

      <ScreenBody>
        <div style={{ background: '#fff', borderRadius: 30, padding: 22, color: color.ink }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, fontSize: 11, fontWeight: 900, color: 'rgba(22,25,28,.56)', textAlign: 'center' }}>
            {['일', '월', '화', '수', '목', '금', '토'].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
            {cells.map((c, i) => {
              if (c.day === null) return <div key={i} style={{ height: 46 }} />;
              const has = c.amt !== undefined;
              const kind = !has ? 'none' : c.amt === 0 ? 'save' : c.amt! > 8000 ? 'over' : 'ok';
              const bg = kind === 'save' ? color.mint : kind === 'over' ? '#C4472A' : kind === 'ok' ? '#EDF2F0' : 'transparent';
              const fg = kind === 'over' ? '#fff' : kind === 'save' ? color.ink : 'rgba(10,30,26,.55)';
              const isSelected = c.day === selectedDay;
              return (
                <div
                  key={i}
                  onClick={() => has && setSelectedDay(c.day!)}
                  style={{
                    height: 46, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 1, background: bg, cursor: has ? 'pointer' : undefined,
                    outline: isSelected ? '2px solid #16191C' : undefined, outlineOffset: isSelected ? 1 : undefined,
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 900, color: fg }}>{c.day}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 900, color: fg, opacity: 0.7 }}>
                    {has && c.amt! > 0 ? `${Math.round(c.amt! / 1000)}k` : kind === 'save' ? '0' : ''}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(22,25,28,.08)', display: 'flex', gap: 14, fontSize: 11.5, fontWeight: 900 }}>
            <Legend color={color.mint} label="예산 절약" />
            <Legend color="#E9ECEE" label="보통" />
            <Legend color="#C4472A" label="초과" />
          </div>
        </div>

        <div style={{ marginTop: 14, background: 'rgba(22,25,28,.08)', borderRadius: 28, padding: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.63)' }}>7월 {selectedDay}일 · 주요 내역</div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(selectedDay === TODAY ? dayTxns : []).map((t) => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, background: t.iconBg, color: t.iconFg }}>{t.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 900 }}>{t.name}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(22,25,28,.61)', marginTop: 1 }}>{t.meta}</div>
                </div>
                <div style={{ flex: 'none', whiteSpace: 'nowrap', fontSize: 16, fontWeight: 900 }}>{t.amount}</div>
              </div>
            ))}
            {selectedDay !== TODAY && (
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'rgba(22,25,28,.5)' }}>내역이 없습니다.</div>
            )}
          </div>
        </div>
      </ScreenBody>
    </Screen>
  );
}

function Legend({ color: c, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 12, height: 12, borderRadius: 4, background: c }} />
      <span style={{ color: 'rgba(22,25,28,.63)' }}>{label}</span>
    </div>
  );
}
