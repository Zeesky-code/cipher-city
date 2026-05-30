import type { Stop } from '../types';

interface Props {
  stops: Stop[];
  solved: number;
  viewing: number;
  mapTitle: string;
  mapSub: string;
  onSelect: (index: number) => void;
}

export default function HuntMap({ stops, solved, viewing, mapTitle, mapSub, onSelect }: Props) {
  const routeD = stops
    .map((s, i) => `${i === 0 ? 'M' : 'L'}${s.mapXY[0]},${s.mapXY[1]}`)
    .join(' ');

  return (
    <>
      <div className="map-title">{mapTitle}</div>
      <div className="map-sub">{mapSub}</div>
      <svg className="map" viewBox="0 0 620 470" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="parchG" cx="35%" cy="25%" r="90%">
            <stop offset="0%" stopColor="#e7d6ac" />
            <stop offset="60%" stopColor="#d4bd8c" />
            <stop offset="100%" stopColor="#b89e6c" />
          </radialGradient>
          <filter id="rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={3} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={3} />
          </filter>
        </defs>

        {/* parchment */}
        <rect x={14} y={14} width={592} height={442} rx={6} fill="url(#parchG)" />
        <rect x={14} y={14} width={592} height={442} rx={6} fill="none" stroke="#8a6f3e" strokeWidth={2} opacity={0.6} />
        <rect x={26} y={26} width={568} height={418} rx={3} fill="none" stroke="#8a6f3e" strokeWidth={1} opacity={0.35} />

        {/* water */}
        <path d="M14,70 Q150,40 300,58 T606,46 L606,14 L14,14 Z" fill="#9fb09a" opacity={0.35} />
        <text x={120} y={44} fontFamily="Cinzel" fontSize={13} fill="#5d6b50" opacity={0.7} fontStyle="italic">The Golden Horn</text>
        <path d="M560,30 Q585,200 560,440 L606,440 L606,30 Z" fill="#9fb09a" opacity={0.35} />
        <text x={566} y={250} fontFamily="Cinzel" fontSize={12} fill="#5d6b50" opacity={0.7} transform="rotate(90 575,250)">The Bosphorus</text>

        <text x={60} y={250} fontFamily="Cinzel" fontSize={15} fill="#7c5a2e" opacity={0.5} letterSpacing={3}>SARAYBURNU</text>

        {/* serpent doodle (Delphi nod) */}
        <path d="M80,400 q18,-26 0,-44 q-18,-18 4,-36 q22,-16 6,-34"
          fill="none" stroke="#7c2118" strokeWidth={2.4} opacity={0.5}
          strokeLinecap="round" filter="url(#rough)" />
        <circle cx={96} cy={252} r={3.4} fill="#7c2118" opacity={0.5} />

        {/* compass rose */}
        <g transform="translate(530,395)" opacity={0.75}>
          <circle r={30} fill="none" stroke="#7c5a2e" strokeWidth={1} />
          <path d="M0,-30 L6,0 L0,30 L-6,0 Z" fill="#7c2118" />
          <path d="M-30,0 L0,-6 L30,0 L0,6 Z" fill="#8a6f3e" />
          <text x={0} y={-34} fontFamily="Cinzel" fontSize={11} fill="#5a3f1d" textAnchor="middle">N</text>
        </g>

        {/* route */}
        <path d={routeD} fill="none" stroke="#7c2118" strokeWidth={2.6}
          strokeDasharray="2 8" strokeLinecap="round" opacity={0.75} />

        {/* seals */}
        {stops.map((stop, i) => {
          const [x, y] = stop.mapXY;
          const state = i < solved ? 'solved' : i === solved ? 'current' : 'locked';
          const clickable = i <= solved;
          const active = i === viewing;
          return (
            <g
              key={stop.name}
              className={`seal ${state}${active ? ' active' : ''}`}
              transform={`translate(${x},${y})`}
              onClick={clickable ? () => onSelect(i) : undefined}
              style={{ cursor: clickable ? 'pointer' : 'not-allowed' }}
            >
              <circle className="ring" r={20} fill="none" stroke="#c9a24a" strokeWidth={2} />
              <circle
                className="disc"
                r={14}
                fill={i < solved ? '#8d2418' : 'rgba(124,33,24,.18)'}
                stroke="#c9a24a"
                strokeWidth={2}
              />
              <text className="num" y={5}>{i < solved ? '✦' : i + 1}</text>
            </g>
          );
        })}
      </svg>

      <div className="legend">
        <span><i style={{ background: '#8d2418' }} />solved</span>
        <span><i style={{ background: '#c9a24a' }} />current trail</span>
        <span><i style={{ background: 'rgba(201,162,74,.3)' }} />sealed</span>
      </div>
    </>
  );
}
