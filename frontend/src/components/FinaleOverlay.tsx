import { useState } from 'react';
import type { HuntFinale } from '../types';

interface Props {
  show: boolean;
  finale: HuntFinale;
  onClose: () => void;
}

export default function FinaleOverlay({ show, finale, onClose }: Props) {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function handleShare() {
    const title = 'The Sultanahmet Cipher';
    const url = window.location.href;
    const text = 'I solved The Sultanahmet Cipher — a grounded symbology hunt through real Istanbul landmarks.';
    // Cast once so TypeScript doesn't narrow clipboard away in the else-branch.
    const nav = window.navigator as Navigator & {
      share?(data: { title: string; text: string; url: string }): Promise<void>;
    };

    try {
      if (nav.share) {
        await nav.share({ title, text, url });
        setShareStatus('idle');
        return;
      }

      if (nav.clipboard?.writeText) {
        await nav.clipboard.writeText(url);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
        return;
      }

      setShareStatus('failed');
      setTimeout(() => setShareStatus('idle'), 2500);
    } catch {
      // User cancelled share, or clipboard blocked — not fatal.
      setShareStatus('idle');
    }
  }

  return (
    <div className={`overlay${show ? ' show' : ''}`}>
      <div className="card">
        <div className="kicker">{finale.kicker}</div>
        <h2>{finale.heading}</h2>
        {finale.body.map((line, i) => {
          if (line.includes('PALIMPSEST')) {
            return (
              <p key={i} className="quote">
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
        <div className="card-actions">
          <button className="btn ghost" onClick={handleShare}>Share</button>
          <button className="btn" onClick={onClose}>Close the File</button>
        </div>
        <div className="card-status" aria-live="polite">
          {shareStatus === 'copied' ? 'Link copied.' : shareStatus === 'failed' ? 'Copy not available.' : ''}
        </div>
      </div>
    </div>
  );
}
