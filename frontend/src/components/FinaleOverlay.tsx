import type { HuntFinale } from '../types';

interface Props {
  show: boolean;
  finale: HuntFinale;
  onClose: () => void;
}

export default function FinaleOverlay({ show, finale, onClose }: Props) {
  return (
    <div className={`overlay${show ? ' show' : ''}`}>
      <div className="card">
        <div className="kicker">{finale.kicker}</div>
        <h2>{finale.heading}</h2>
        {finale.body.map((line, i) => {
          if (line.includes('PALIMPSEST')) {
            return (
              <p key={i} style={{ color: '#e9cd7d' }}>
                You have been reading a <b>PALIMPSEST</b> all along.{' '}
                {line.split('PALIMPSEST all along.')[1]}
              </p>
            );
          }
          if (line.startsWith('Case')) {
            return <p key={i} style={{ fontStyle: 'italic' }}>{line}</p>;
          }
          return <p key={i}>{line}</p>;
        })}
        <button className="btn" onClick={onClose}>Close the File</button>
      </div>
    </div>
  );
}
