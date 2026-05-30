import type { HuntIntro } from '../types';

interface Props {
  show: boolean;
  intro: HuntIntro;
  onStart: () => void;
}

export default function IntroOverlay({ show, intro, onStart }: Props) {
  return (
    <div className={`overlay${show ? ' show' : ''}`}>
      <div className="card">
        <div className="kicker">{intro.kicker}</div>
        <p className="coin"><span className="spin">🪙</span></p>
        <h2>{intro.heading}</h2>
        {intro.body.map((line, i) => (
          <p key={i} style={i === 1 ? { fontStyle: 'italic', color: '#e9cd7d' } : undefined}>
            {line}
          </p>
        ))}
        <button className="btn" onClick={onStart}>{intro.ctaLabel}</button>
      </div>
    </div>
  );
}
