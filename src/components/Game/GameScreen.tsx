import { useState } from 'react';
import { GameState, GameSettings } from '../../types';
import PassPhone from './PassPhone';
import ShowRole from './ShowRole';
import './GameScreen.css';

interface GameScreenProps {
  gameState: GameState;
  settings: GameSettings;
  setGameState: (state: GameState) => void;
  onEndGame: () => void;
}

export default function GameScreen({
  gameState,
  settings,
  setGameState,
  onEndGame,
}: GameScreenProps) {
  const [revealed, setRevealed] = useState(false);

  const handleHavePhone = () => {
    setGameState({ ...gameState, phase: 'reveal' });
  };

  const handleNext = () => {
    const nextNode = gameState.currentNode?.next ?? null;
    if (nextNode === null) {
      setRevealed(false);
      setGameState({ ...gameState, phase: 'done' });
    } else {
      setGameState({
        ...gameState,
        phase: 'passing',
        currentNode: nextNode,
        currentIndex: gameState.currentIndex + 1,
      });
    }
  };

  if (gameState.phase === 'done') {
    if (!revealed) {
      return (
        <div className="screen done-screen">
          <div className="done-header">
            <h2 className="done-title">Time to Vote!</h2>
            <p className="done-subtitle">
              Discuss, debate, and find the imposter{gameState.allImpostors.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="screen-footer">
            <button className="btn btn-primary btn-large" onClick={() => setRevealed(true)}>
              Reveal Imposters &amp; Word
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="screen done-screen">
        <div className="done-header">
          <h2 className="done-title">The Results</h2>
        </div>

        <div className="done-cards">
          <div className="card summary-card">
            <h3 className="summary-section-title">Secret Word</h3>
            {gameState.everyoneIsImposter ? (
              <p className="summary-everyone-imposter">
                Everyone was the impostor!
              </p>
            ) : (
              <>
                <p className="summary-category">Category: <strong>{gameState.category}</strong></p>
                <p className="summary-word">{gameState.word}</p>
              </>
            )}
          </div>

          <div className="card summary-card">
            <h3 className="summary-section-title">
              The Imposter{gameState.allImpostors.length > 1 ? 's' : ''}
            </h3>
            <ul className="summary-imposters-list">
              {gameState.allImpostors.map((name) => (
                <li key={name} className="summary-imposter-item">
                  <span className="summary-imposter-marker" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="screen-footer">
          <button className="btn btn-primary btn-large" onClick={onEndGame}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (gameState.phase === 'passing') {
    return (
      <PassPhone
        gameState={gameState}
        onHavePhone={handleHavePhone}
        onEndGame={onEndGame}
      />
    );
  }

  if (gameState.phase === 'reveal') {
    return (
      <ShowRole
        gameState={gameState}
        impostorsKnowEachOther={settings.impostorsKnowEachOther}
        impostorsGetHint={settings.impostorsGetHint}
        onNext={handleNext}
        onEndGame={onEndGame}
      />
    );
  }

  return null;
}
