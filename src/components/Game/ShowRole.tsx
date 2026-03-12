import { GameState } from '../../types';
import './ShowRole.css';

interface ShowRoleProps {
  gameState: GameState;
  impostorsKnowEachOther: boolean;
  impostorsGetHint: boolean;
  onNext: () => void;
  onEndGame: () => void;
}

export default function ShowRole({
  gameState,
  impostorsKnowEachOther,
  impostorsGetHint,
  onNext,
  onEndGame,
}: ShowRoleProps) {
  const { currentNode, allImpostors, everyoneIsImposter, fakeImpostorMap, currentIndex, totalPlayers } = gameState;

  if (!currentNode) return null;

  const isImposter = currentNode.role === 'imposter';
  const isLastPlayer = currentNode.next === null;
  // When everyone is an imposter, show a randomised fake list instead of the real one
  const fellowImpostors = everyoneIsImposter
    ? (fakeImpostorMap[currentNode.name] ?? [])
    : allImpostors.filter((name) => name !== currentNode.name);
  const roleClass = isImposter ? 'reveal-imposter' : 'reveal-civilian';

  return (
    <div className={`screen reveal-screen ${roleClass}`}>
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${(currentIndex / totalPlayers) * 100}%` }}
        />
      </div>

      <p className="progress-label">
        Player {currentIndex} of {totalPlayers}
      </p>

      <div className="reveal-content">
        {isImposter ? (
          <>
            <div className="role-badge role-badge-imposter">!</div>
            <h2 className="role-label imposter-label">IMPOSTER</h2>
            <p className="imposter-category">Category: <strong>{gameState.category}</strong></p>
                <p className="imposter-hint">
                  You don't know the secret word. Blend in and don't get caught!
                </p>
                {impostorsGetHint && (
                  <div className="hint-card">
                    <p className="hint-label">Hint</p>
                    <p className="hint-text">{gameState.hint}</p>
                  </div>
                )}

            {impostorsKnowEachOther && fellowImpostors.length > 0 && (
              <div className="fellow-imposters-card">
                <p className="fellow-imposters-label">Your fellow imposters</p>
                <ul className="fellow-imposters-list">
                  {fellowImpostors.map((name) => (
                    <li key={name} className="fellow-imposter-name">
                      <span className="fellow-imposter-dot" />
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="role-badge role-badge-civilian">+</div>
            <h2 className="role-label civilian-label">CIVILIAN</h2>
            <div className="word-reveal-card">
              <p className="word-reveal-category">{gameState.category}</p>
              <p className="word-reveal-label">The secret word is</p>
              <h1 className="word-reveal-word">{currentNode.word}</h1>
            </div>
            <p className="civilian-hint">
              Describe the word without saying it. Find the imposter!
            </p>
          </>
        )}
      </div>

      <div className="screen-footer">
        <button
          className={`btn btn-large next-player-btn`}
          onClick={onNext}
        >
          {isLastPlayer ? 'Start Discussion' : 'Next Player'}
        </button>
        <button className="btn btn-ghost" onClick={onEndGame}>
          End Game
        </button>
      </div>
    </div>
  );
}
