import { useState, useEffect, useCallback, useRef } from 'react';
import type { Hunt } from './types';
import { fetchHunt, checkAnswer, loadProgress, saveProgress } from './api/hunt';
import HuntMap from './components/HuntMap';
import ClueCard from './components/ClueCard';
import Cryptex from './components/Cryptex';
import IntroOverlay from './components/IntroOverlay';
import FinaleOverlay from './components/FinaleOverlay';

const HUNT_ID = 'sultanahmet';

export default function App() {
  const [hunt, setHunt] = useState<Hunt | null>(null);
  const [solved, setSolved] = useState(0);
  const [viewing, setViewing] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showFinale, setShowFinale] = useState(false);
  const cluePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([fetchHunt(HUNT_ID), loadProgress(HUNT_ID)]).then(([h, s]) => {
      setHunt(h);
      setSolved(s);
      if (s > 0) {
        setShowIntro(false);
        setViewing(Math.min(s, h.stops.length - 1));
      }
    });
  }, []);

  const handleStart = useCallback(() => {
    if (!hunt) return;
    setShowIntro(false);
    setViewing(Math.min(solved, hunt.stops.length - 1));
  }, [hunt, solved]);

  const handleFlash = useCallback(() => {
    const el = cluePanelRef.current;
    if (!el) return;
    el.classList.remove('unlock-flash');
    void el.offsetWidth; // force reflow to restart animation
    el.classList.add('unlock-flash');
  }, []);

  const handleSubmit = useCallback(async (answer: string): Promise<boolean> => {
    if (!hunt) return false;
    const { correct } = await checkAnswer(HUNT_ID, viewing, answer);
    if (correct) {
      const newSolved = Math.max(solved, viewing + 1);
      setSolved(newSolved);
      await saveProgress(HUNT_ID, newSolved);
      if (hunt.stops[viewing].final) {
        setTimeout(() => setShowFinale(true), 500);
      } else {
        setTimeout(() => setViewing(v => v + 1), 550);
      }
    }
    return correct;
  }, [hunt, viewing, solved]);

  const handleReset = useCallback(async () => {
    setSolved(0);
    setViewing(0);
    await saveProgress(HUNT_ID, 0);
    setShowFinale(false);
    setShowIntro(true);
  }, []);

  if (!hunt) return null;

  return (
    <>
      <div className="wrap">
        <header>
          <div className="kicker">A Symbology Hunt Through Old Stamboul</div>
          <h1>
            {hunt.title}
            <span className="sub">{hunt.subtitle}</span>
          </h1>
          <div className="rule"><span>✦</span></div>
        </header>

        <div className="board">
          <div className="panel">
            <HuntMap
              stops={hunt.stops}
              solved={solved}
              viewing={viewing}
              mapTitle={hunt.mapTitle}
              mapSub={hunt.mapSub}
              onSelect={setViewing}
            />
          </div>

          <div className="panel" ref={cluePanelRef}>
            <div className="panel-pad stage">
              <ClueCard
                stop={hunt.stops[viewing]}
                index={viewing}
                total={hunt.stops.length}
                isSolved={viewing < solved}
                onSubmit={handleSubmit}
                onFlash={handleFlash}
              />
            </div>
          </div>
        </div>

        <Cryptex stops={hunt.stops} solved={solved} />

        <p className="foot">{hunt.footer}</p>
      </div>

      <IntroOverlay show={showIntro} intro={hunt.intro} onStart={handleStart} />
      <FinaleOverlay show={showFinale} finale={hunt.finale} onClose={() => setShowFinale(false)} />

      <button className="btn ghost reset" onClick={handleReset}>↺ Reset</button>
    </>
  );
}
