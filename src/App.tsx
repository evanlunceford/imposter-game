import { useState } from 'react';
import { GameSettings, GameState } from './types';
import { initGame } from './utils/gameLogic';
import SetupScreen from './components/Setup/SetupScreen';
import GameScreen from './components/Game/GameScreen';
import './styles/base.css';

export default function App() {
  const [settings, setSettings] = useState<GameSettings>({
    impostorCount: 1,
    impostorsKnowEachOther: false,
    everyoneImpostorChance: 0,
    impostorsGetHint: false,
    selectedCategory: 'random',
  });
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStart = (newPlayers: string[], newSettings: GameSettings) => {
    setSettings(newSettings);
    const state = initGame(newPlayers, newSettings);
    setGameState(state);
  };

  const handleEndGame = () => {
    setGameState(null);
  };

  if (gameState) {
    return (
      <GameScreen
        gameState={gameState}
        settings={settings}
        setGameState={setGameState}
        onEndGame={handleEndGame}
      />
    );
  }

  return (
    <SetupScreen onStart={handleStart} />
  );
}
