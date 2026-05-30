import { useState, useRef, useEffect } from 'react';
import type { Stop } from '../types';

interface Props {
  stop: Stop;
  index: number;
  total: number;
  isSolved: boolean;
  onSubmit: (answer: string) => Promise<boolean>;
  onFlash: () => void;
}

export default function ClueCard({ stop, index, total, isSolved, onSubmit, onFlash }: Props) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [wrong, setWrong] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset local state when the stop changes
  useEffect(() => {
    setAnswer('');
    setError('');
    setShowHint(false);
    setWrong(false);
    if (!isSolved) inputRef.current?.focus();
  }, [stop.name, isSolved]);

  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`;

  async function handleCheck() {
    const trimmed = answer.trim();
    if (!trimmed) return;
    const correct = await onSubmit(trimmed);
    if (correct) {
      onFlash();
    } else {
      setError('The stones disagree. Look again — the answer is in front of you.');
      setWrong(true);
      setTimeout(() => setWrong(false), 700);
    }
  }

  return (
    <>
      <div className="badge">
        Mark {index + 1} of {total}{isSolved ? ' · solved' : ''}
      </div>
      <div className="stop-name">{stop.name}</div>
      <div className="stop-where">{stop.where}</div>
      <p className="narr">{stop.narr}</p>
      {/* fact contains inline HTML (<b> tags from the grounded corpus) */}
      <p className="fact" dangerouslySetInnerHTML={{ __html: stop.fact }} />

      <div className="cipher-box">
        <div className="cipher-label">{stop.label}</div>
        <div className="cipher-text">{stop.text}</div>
        <div className="cipher-prompt">{stop.prompt}</div>
      </div>

      {isSolved ? (
        <p className="solved-key">✦ Already deciphered: <b>{stop.key}</b></p>
      ) : (
        <>
          <div className="input-row">
            <input
              ref={inputRef}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCheck(); }}
              className={wrong ? 'wrong' : ''}
              autoComplete="off"
              placeholder="your answer"
              maxLength={20}
            />
            <button className="btn" onClick={handleCheck}>Decipher</button>
          </div>
          <div className="err">{error}</div>
        </>
      )}

      <div className="subactions">
        <a className="nav-link" href={navUrl} target="_blank" rel="noopener noreferrer">
          ⌖ Navigate here
        </a>
        {!isSolved && (
          <button className="linkish" onClick={() => setShowHint(h => !h)}>
            Need a hint?
          </button>
        )}
      </div>

      {!isSolved && showHint && <div className="hint">{stop.hint}</div>}
    </>
  );
}
