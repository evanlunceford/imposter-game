import { useState, KeyboardEvent } from 'react';
import { GameSettings } from '../../types';
import { CATEGORY_LABELS } from '../../utils/gameLogic';
import { loadLastGame, saveLastGame } from '../../utils/lastGame';
import './SetupScreen.css';

const DEFAULT_SETTINGS: GameSettings = {
  impostorCount: 1,
  impostorsKnowEachOther: false,
  everyoneImpostorChance: 0,
  impostorsGetHint: false,
  selectedCategory: 'random',
};

interface SetupScreenProps {
  onStart: (players: string[], settings: GameSettings) => void;
}

const CATEGORY_OPTIONS = [
  { key: 'random', label: 'Random' },
  ...Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label })),
];

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const [players, setPlayers] = useState<string[]>(() => loadLastGame()?.players ?? []);
  const [settings, setSettings] = useState<GameSettings>(
    () => loadLastGame()?.settings ?? DEFAULT_SETTINGS
  );

  const addPlayer = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || players.includes(trimmed)) {
      setInputValue('');
      return;
    }
    setPlayers((prev) => [...prev, trimmed]);
    setInputValue('');
  };

  const removePlayer = (name: string) => {
    setPlayers((prev) => prev.filter((p) => p !== name));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addPlayer();
  };

  const maxImpostors = Math.max(1, players.length - 1);
  const impostorCountSafe = Math.min(settings.impostorCount, maxImpostors);
  const canStart = players.length >= 2 && impostorCountSafe < players.length;

  const handleStart = () => {
    if (!canStart) return;
    const finalSettings = { ...settings, impostorCount: impostorCountSafe };
    saveLastGame(players, finalSettings);
    onStart(players, finalSettings);
  };

  const decrementImpostors = () => {
    setSettings((s) => ({ ...s, impostorCount: Math.max(1, s.impostorCount - 1) }));
  };

  const incrementImpostors = () => {
    setSettings((s) => ({ ...s, impostorCount: Math.min(maxImpostors, s.impostorCount + 1) }));
  };

  return (
    <div className="screen setup-screen">
      <div className="setup-inner">
        <div className="setup-header">
          <h1 className="game-title">
            <span className="title-imposter">IMPOSTER</span>
            <span className="title-game"> GAME</span>
          </h1>
        </div>

        {/* Players */}
        <div className="card">
          <h2 className="section-title">Players</h2>
          <div className="input-row">
            <input
              className="text-input"
              type="text"
              placeholder="Enter player name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={24}
              autoComplete="off"
              autoCapitalize="words"
            />
            <button className="btn btn-add" onClick={addPlayer} disabled={!inputValue.trim()}>
              Add
            </button>
          </div>

          {players.length > 0 ? (
            <ul className="player-list">
              {players.map((name) => (
                <li key={name} className="player-chip">
                  <span className="player-chip-name">{name}</span>
                  <button
                    className="player-chip-remove"
                    onClick={() => removePlayer(name)}
                    aria-label={`Remove ${name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-hint">Add at least 2 players to get started.</p>
          )}

          <p className="player-count">{players.length} player{players.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Category */}
        <div className="card">
          <h2 className="section-title">Category</h2>
          <div className="category-pills">
            {CATEGORY_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                className={`category-pill${settings.selectedCategory === key ? ' category-pill-active' : ''}`}
                onClick={() => setSettings((s) => ({ ...s, selectedCategory: key }))}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="card">
          <h2 className="section-title">Settings</h2>

          <div className="setting-row">
            <span className="setting-label">Number of Impostors</span>
            <div className="stepper">
              <button
                className="stepper-btn"
                onClick={decrementImpostors}
                disabled={impostorCountSafe <= 1}
                aria-label="Decrease impostors"
              >
                −
              </button>
              <span className="stepper-value">{impostorCountSafe}</span>
              <button
                className="stepper-btn"
                onClick={incrementImpostors}
                disabled={impostorCountSafe >= maxImpostors}
                aria-label="Increase impostors"
              >
                +
              </button>
            </div>
          </div>

          <div className="setting-row">
            <label className="setting-label" htmlFor="knowEachOther">
              Impostors know each other
            </label>
            <label className="toggle">
              <input
                id="knowEachOther"
                type="checkbox"
                checked={settings.impostorsKnowEachOther}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, impostorsKnowEachOther: e.target.checked }))
                }
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="setting-row">
            <label className="setting-label" htmlFor="impostorsGetHint">
              Give impostors a hint
            </label>
            <label className="toggle">
              <input
                id="impostorsGetHint"
                type="checkbox"
                checked={settings.impostorsGetHint}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, impostorsGetHint: e.target.checked }))
                }
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="setting-row setting-row-stacked">
            <div className="setting-label-row">
              <label className="setting-label" htmlFor="everyoneChance">
                Everyone is an imposter %
              </label>
              <span className="setting-value-badge">{settings.everyoneImpostorChance}%</span>
            </div>
            <p className="setting-description">
              Chance that all players are imposters this round
            </p>
            <input
              id="everyoneChance"
              className="range-input"
              type="range"
              min={0}
              max={100}
              step={1}
              value={settings.everyoneImpostorChance}
              onChange={(e) =>
                setSettings((s) => ({ ...s, everyoneImpostorChance: Number(e.target.value) }))
              }
            />
            <div className="range-labels">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {!canStart && players.length >= 2 && (
          <p className="warning-text">
            Need at least 1 civilian. Reduce impostors or add more players.
          </p>
        )}

        <button
          className="btn btn-start"
          onClick={handleStart}
          disabled={!canStart}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
