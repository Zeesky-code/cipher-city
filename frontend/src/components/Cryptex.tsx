import type { Stop } from '../types';

interface Props {
  stops: Stop[];
  solved: number;
}

export default function Cryptex({ stops, solved }: Props) {
  return (
    <div className="cryptex">
      <h3>◆ The Cryptex ◆ fragments recovered</h3>
      <div className="frags">
        {stops.map((stop, i) => {
          const got = i < solved;
          return (
            <div key={stop.name} className={`frag${got ? ' got' : ''}`}>
              <span className="dot" />
              <span>{got ? stop.frag : '—— sealed ——'}</span>
              {got && <span className="frag-key">{stop.key}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
