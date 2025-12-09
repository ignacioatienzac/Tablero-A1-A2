import React, { useState } from 'react';
import { Board } from './components/Board';
import { Dice } from './components/Dice';
import { GameModal } from './components/GameModal';
import { QUESTIONS, INITIAL_PLAYERS, BOARD_SIZE } from './constants';
import { Player, GamePhase } from './types';
import { playSound, initAudio } from './utils/audio';

export default function App() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [phase, setPhase] = useState<GamePhase>(GamePhase.ROLLING);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const currentPlayer = players[currentPlayerIdx];

  // Helper function to animate movement step by step
  const animateMovement = (startPos: number, endPos: number, callback: () => void) => {
    setPhase(GamePhase.MOVING);
    
    let current = startPos;
    const direction = endPos > startPos ? 1 : -1;
    
    if (startPos === endPos) {
        callback();
        return;
    }

    const step = () => {
        current += direction;
        
        // Play step sound
        playSound('move');

        setPlayers(prev => prev.map((p, i) => 
            i === currentPlayerIdx ? { ...p, position: current } : p
        ));

        if (current !== endPos) {
            // Wait before next step (speed of movement)
            setTimeout(step, 400); 
        } else {
            // Finished moving
            setTimeout(callback, 200);
        }
    };

    // Start first step
    setTimeout(step, 400);
  };

  const handleRollDice = () => {
    if (phase !== GamePhase.ROLLING) return;
    
    // Initialize audio context on first user interaction
    initAudio();

    setIsRolling(true);
    
    // 1. Dice Animation Time
    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rolled);
      setIsRolling(false);
      
      // 2. Pause to let user see the dice result clearly
      setTimeout(() => {
          let newPos = currentPlayer.position + rolled;
          if (newPos >= BOARD_SIZE - 1) newPos = BOARD_SIZE - 1;
          
          // 3. Start Animation
          animateMovement(currentPlayer.position, newPos, () => {
             if (newPos === BOARD_SIZE - 1) {
                 playSound('correct');
                 setPhase(GamePhase.WIN);
             } else {
                 setPhase(GamePhase.WAITING_FOR_INTERACTION);
             }
          });
          
      }, 1000); // 1 second pause to read dice

    }, 1000);
  };

  const handleSquareClick = (index: number) => {
    if (phase !== GamePhase.WAITING_FOR_INTERACTION) return;
    if (currentPlayer.position !== index) return;

    setPhase(GamePhase.ANSWERING);
    setModalOpen(true);
  };

  const handleModalComplete = (success: boolean, message: string) => {
    setModalOpen(false);
    
    const endTurn = () => {
        setCurrentPlayerIdx(prev => (prev === 0 ? 1 : 0));
        setPhase(GamePhase.ROLLING);
        // We do NOT reset diceValue to 1 immediately so the user remembers what happened
    };

    // Slight delay to process result
    setTimeout(() => {
        if (!success) {
            // Move back 2 squares with animation
            const penaltyPos = Math.max(0, currentPlayer.position - 2);
            animateMovement(currentPlayer.position, penaltyPos, endTurn);
        } else {
            endTurn();
        }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 font-sans">
      
      {/* Header */}
      <header className="text-center mb-8">
        <div className="inline-block bg-white px-6 py-2 rounded-full shadow-sm mb-4 border border-slate-100">
            <span className="text-2xl mr-2">🇪🇸</span>
            <span className="font-bold text-slate-700">A1/A2 Español</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">
          Aventura de Gramática
        </h1>
      </header>

      {/* Game Area */}
      <div className="w-full max-w-5xl flex flex-col-reverse lg:flex-row gap-8 items-start">
        
        {/* Left: Board */}
        <div className="flex-1 w-full bg-slate-100 p-2 sm:p-6 rounded-[2.5rem] shadow-inner border border-slate-200">
           <Board 
             players={players} 
             activePlayerId={currentPlayerIdx}
             highlightIndex={currentPlayer.position}
             onSquareClick={handleSquareClick}
             waitingForInteraction={phase === GamePhase.WAITING_FOR_INTERACTION}
           />
        </div>

        {/* Right: Controls & Info */}
        <div className="w-full lg:w-72 flex flex-col gap-6 sticky top-8">
            
            {/* Player Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {players.map((p, idx) => {
                    const isActive = idx === currentPlayerIdx;
                    return (
                        <div 
                            key={p.id}
                            className={`p-4 rounded-2xl transition-all duration-300 border-b-4 ${isActive ? 'bg-white border-yellow-400 shadow-xl scale-105' : 'bg-slate-200 border-slate-300 opacity-80'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${p.color} text-white flex items-center justify-center font-bold shadow-md border-2 border-white`}>
                                    {p.name.charAt(0)}{p.id + 1}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-700">{p.name}</div>
                                    <div className="text-xs text-slate-500">Casilla {p.position}</div>
                                </div>
                                {isActive && <div className="ml-auto text-xl animate-bounce">👈</div>}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Action Area */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border-b-8 border-slate-200 flex flex-col items-center justify-center min-h-[200px]">
                {phase === GamePhase.WIN ? (
                    <div className="text-center animate-bounceIn">
                        <div className="text-6xl mb-4">🏆</div>
                        <h3 className="text-2xl font-bold text-yellow-500 mb-2">¡VICTORIA!</h3>
                        <p className="text-slate-600 font-bold">{currentPlayer.name} ha ganado.</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition"
                        >
                            Jugar de nuevo
                        </button>
                    </div>
                ) : phase === GamePhase.ROLLING || phase === GamePhase.MOVING ? (
                    <>
                        <div className="text-slate-400 font-bold mb-4 uppercase tracking-wider text-sm">Tu Turno</div>
                        <Dice 
                            value={diceValue} 
                            rolling={isRolling} 
                            onRoll={handleRollDice} 
                            disabled={phase !== GamePhase.ROLLING}
                        />
                    </>
                ) : (
                   <div className="text-center animate-pulse">
                        <div className="text-5xl mb-2">👆</div>
                        <p className="font-bold text-slate-700">¡Pulsa tu ficha!</p>
                        <p className="text-sm text-slate-400">Para ver la pregunta</p>
                   </div>
                )}
            </div>

        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
          <GameModal 
            question={QUESTIONS[currentPlayer.position]} 
            onComplete={handleModalComplete}
            isOpen={modalOpen}
          />
      )}

      {/* Footer */}
      <footer className="mt-12 text-slate-400 text-sm font-semibold">
        Practica español divirtiéndote • Nivel A1/A2
      </footer>

    </div>
  );
}