import type { JourneyEvent, JourneyEventKind } from '../data/personas';

const KIND_COLOR: Record<JourneyEventKind, string> = {
    start: '#ffffff',
    deviation: '#FF7A5C',
    boost: '#E2F15E',
    recovery: '#00C7A9',
    mission: '#7DB5FF',
    now: '#00C7A9',
};

interface Props {
    events: JourneyEvent[];
    onSelect?: (e: JourneyEvent | null) => void;
}

/**
 * 반구형 지구 위의 여정 항로 (정적, CSS/SVG). 움직임 없음.
 * 지구를 아래쪽에 크게 두고 위쪽 반구만 보이게 하고, 그 둥근 표면을 따라
 * 출발 → 현재 → 도착 항로가 호를 그리며 지나간다. 정상은 매끄러운 호, 이탈만 살짝 벗어남.
 */
export function Globe3D({ events, onSelect }: Props) {
    const W = 320, H = 220;
    const cx = W / 2;
    const cy = 250;        // 지구 중심을 화면 아래로 → 위쪽 반구만 보임
    const R = 210;         // 큰 반지름 (곡률 완만)

    // 경로는 지구를 가로지르는 완만한 호: x는 좌측 가장자리 근처 → 우측 가장자리 근처,
    // y는 지구 중심보다 위(반구 안, 하단쪽)에서 살짝 볼록하게. progress 0~1 → 좌→우.
    const xL = cx - R * 0.82;
    const xR = cx + R * 0.82;
    const baseY = cy - R * 0.42;      // 경로 기준선(지구 하단부를 가로지름)
    const arcLift = R * 0.16;         // 호의 볼록함(가운데가 살짝 위로)
    // 이벤트 종류별 y오프셋(정상=경로선, 이탈은 아래로 처지고 가속은 위로 솟음)
    const altOffset: Record<JourneyEventKind, number> = {
        start: 0, now: 0, boost: -14, deviation: 16, recovery: 0, mission: 7,
    };
    const posFor = (prog: number, kind: JourneyEventKind) => {
        const x = xL + (xR - xL) * prog;
        // 가운데가 볼록한 완만한 호 (sin)
        const arc = Math.sin(prog * Math.PI) * arcLift;
        const y = baseY - arc + altOffset[kind];
        return { x, y };
    };

    const pts = events.map((e) => ({ e, ...posFor(e.progress, e.kind) }));
    const pathD = smoothPath(pts.map((p) => [p.x, p.y]));

    const nowIdx = pts.findIndex((p) => p.e.kind === 'now');
    const traveledPts = pts.slice(0, (nowIdx >= 0 ? nowIdx : pts.length - 1) + 1).map((p) => [p.x, p.y] as [number, number]);
    const traveledD = smoothPath(traveledPts);

    const dest = posFor(1, 'now');

    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', display: 'block' }}>
            <defs>
                <radialGradient id="hemi" cx="42%" cy="88%" r="70%">
                    <stop offset="0%" stopColor="#3A7CE0" />
                    <stop offset="45%" stopColor="#1A4B7C" />
                    <stop offset="78%" stopColor="#0A2340" />
                    <stop offset="100%" stopColor="#071B33" />
                </radialGradient>
                <clipPath id="hemiClip"><circle cx={cx} cy={cy} r={R} /></clipPath>
            </defs>

            {/* 별 */}
            {STARS.map(([sx, sy, r], i) => (
                <circle key={i} cx={sx} cy={sy} r={r} fill="#fff" opacity={0.7} />
            ))}

            {/* 반구 가장자리 글로우 */}
            <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="rgba(80,150,255,.3)" strokeWidth={6} opacity={0.5} clipPath="url(#hemiClip)" />
            {/* 지구 본체 (위 반구만 노출) */}
            <circle cx={cx} cy={cy} r={R} fill="url(#hemi)" />

            {/* 위경도 그리드 */}
            <g clipPath="url(#hemiClip)" stroke="rgba(125,181,255,.2)" strokeWidth={1} fill="none">
                {[0.4, 0.72, 1].map((k, i) => (
                    <ellipse key={`m${i}`} cx={cx} cy={cy} rx={R * k} ry={R} />
                ))}
                {[0.28, 0.52, 0.76].map((lat, i) => {
                    const yy = cy - lat * R;
                    const rx = R * Math.sqrt(Math.max(0, 1 - lat * lat));
                    return <ellipse key={`p${i}`} cx={cx} cy={yy} rx={rx} ry={R * 0.09} />;
                })}
                {/* 능선(적도 라인) 강조 */}
                <ellipse cx={cx} cy={cy} rx={R} ry={R * 0.11} stroke="rgba(125,181,255,.28)" />
            </g>

            {/* 우측 야간 명암 */}
            <ellipse cx={cx + R * 0.5} cy={cy} rx={R * 0.62} ry={R} fill="rgba(3,8,16,.45)" clipPath="url(#hemiClip)" />

            {/* 항로: 남은 경로(점선) + 지나온 경로(실선) */}
            <path d={`${pathD} L${dest.x.toFixed(1)},${dest.y.toFixed(1)}`} fill="none" stroke="rgba(255,255,255,.3)" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1 7" />
            <path d={traveledD} fill="none" stroke="#00C7A9" strokeWidth={3.5} strokeLinecap="round" />

            {/* 이벤트 마커 */}
            {pts.map((p, i) => {
                const isBig = p.e.kind === 'now' || p.e.kind === 'start';
                return (
                    <g key={i} style={{ cursor: 'pointer' }} onClick={() => onSelect?.(p.e)}>
                        {p.e.kind === 'now' && <circle cx={p.x} cy={p.y} r={13} fill="#00C7A9" opacity={0.22} />}
                        {p.e.kind === 'start' && <circle cx={p.x} cy={p.y} r={12} fill="none" stroke="#fff" strokeWidth={2} opacity={0.7} />}
                        <circle cx={p.x} cy={p.y} r={isBig ? 6.5 : 5} fill={KIND_COLOR[p.e.kind]} />
                        <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
                    </g>
                );
            })}

            {/* 도착 지점 (목표 100%) — 이중 링 마커 */}
            <circle cx={dest.x} cy={dest.y} r={11} fill="none" stroke="#E2F15E" strokeWidth={2} opacity={0.75} />
            <circle cx={dest.x} cy={dest.y} r={6} fill="#E2F15E" />
        </svg>
    );
}

/** 점들을 부드러운 SVG path로 (Catmull-Rom → cubic bezier). */
function smoothPath(p: [number, number][]): string {
    if (p.length === 0) return '';
    if (p.length === 1) return `M${p[0][0]},${p[0][1]}`;
    let d = `M${p[0][0]},${p[0][1]}`;
    for (let i = 0; i < p.length - 1; i++) {
        const p0 = p[i - 1] ?? p[i];
        const p1 = p[i];
        const p2 = p[i + 1];
        const p3 = p[i + 2] ?? p2;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
}

const STARS: [number, number, number][] = [
    [24, 26, 1.4], [70, 16, 1], [120, 36, 1.2], [180, 20, 1], [240, 30, 1.3], [292, 40, 1],
    [40, 60, 1], [214, 52, 1.2], [286, 84, 1], [16, 90, 1.3], [150, 12, 1], [96, 30, 1.1],
];
