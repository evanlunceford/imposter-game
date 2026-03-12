import { GameState } from '../../types';
import './PassPhone.css';

interface PassPhoneProps {
  gameState: GameState;
  onHavePhone: () => void;
  onEndGame: () => void;
}

export default function PassPhone({ gameState, onHavePhone, onEndGame }: PassPhoneProps) {
  const { currentNode, currentIndex, totalPlayers } = gameState;

  return (
    <div className="screen pass-screen">
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${(currentIndex / totalPlayers) * 100}%` }}
        />
      </div>

      <p className="progress-label">
        Player {currentIndex} of {totalPlayers}
      </p>

      <div className="pass-content">
        <p className="pass-instruction">Pass the phone to</p>
        <div className="pass-name-card">
          <h2 className="pass-name">{currentNode?.name ?? '—'}</h2>
        </div>
        <p className="pass-subtitle">Make sure only they can see the screen</p>
      </div>

      <div className="screen-footer">
        <button className="btn btn-primary btn-large" onClick={onHavePhone}>
          I have the phone
        </button>
        <button className="btn btn-ghost" onClick={onEndGame}>
          End Game
        </button>
      </div>
    </div>
  );
}
