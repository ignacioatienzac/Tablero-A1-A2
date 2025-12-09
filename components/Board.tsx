import React from 'react';
import { Player } from '../types';
import { BOARD_SIZE } from '../constants';

interface BoardProps {
  players: Player[];
  activePlayerId: number;
  highlightIndex: number | null;
  onSquareClick: (index: number) => void;
  waitingForInteraction: boolean;
}

export const Board: React.FC<BoardProps> = ({ 
  players, 
  activePlayerId,
  highlightIndex, 
  onSquareClick,
  waitingForInteraction
}) => {
  
  const cells = Array.from({ length: BOARD_SIZE }, (_, i) => i);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Grid Layout */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
        {cells.map((index) => {
          const isTarget = index === highlightIndex;
          const isActive = isTarget && waitingForInteraction;
          const isStart = index === 0;
          const isFinish = index === BOARD_SIZE - 1;

          // Check if any player is on this square
          const playersHere = players.filter(p => p.position === index);

          // Base styles for the "3D" tile look
          let bgClass = "bg-white";
          let borderClass = "border-slate-300";
          let textClass = "text-slate-300";
          
          if (isStart) {
            bgClass = "bg-emerald-50";
            borderClass = "border-emerald-300";
            textClass = "text-emerald-400";
          } else if (isFinish) {
            bgClass = "bg-amber-50";
            borderClass = "border-amber-300";
            textClass = "text-amber-400";
          } else if (isActive) {
             // If active waiting for click, we override later, but base is white
          }

          return (
            <div
              key={index}
              onClick={() => {
                if (isActive) onSquareClick(index);
              }}
              className={`
                aspect-square relative rounded-2xl flex flex-col items-center justify-center 
                shadow-sm transition-all duration-300 
                border-b-[6px] active:border-b-0 active:translate-y-[6px]
                ${isActive 
                  ? 'bg-yellow-100 border-yellow-400 cursor-pointer animate-pulse ring-4 ring-yellow-300 transform -translate-y-1 z-10' 
                  : `${bgClass} ${borderClass}`}
              `}
            >
              {/* Tile Number / Label */}
              <div className={`absolute top-2 left-3 font-black text-xl select-none ${isActive ? 'text-yellow-600' : textClass}`}>
                {isStart ? 'INICIO' : isFinish ? 'META' : index}
              </div>

              {/* Decorative dots for empty tiles */}
              {!isStart && !isFinish && (
                  <div className={`absolute bottom-3 right-3 w-2 h-2 rounded-full opacity-20 ${isActive ? 'bg-yellow-500' : 'bg-slate-400'}`}></div>
              )}

              {/* Player Tokens */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none pl-1 pb-1">
                {playersHere.map((player) => (
                  <div
                    key={player.id}
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full border-[3px] border-white shadow-[0_4px_6px_rgba(0,0,0,0.3)] flex items-center justify-center
                      text-white font-black text-xs sm:text-sm transform transition-transform duration-300 ease-in-out
                      ${player.color}
                      ${player.id === activePlayerId ? 'scale-110 -translate-y-1 z-20' : 'scale-90 opacity-90 z-10'}
                      ${playersHere.length > 1 ? '-ml-4 hover:ml-0 transition-all' : ''}
                    `}
                  >
                    {player.name.charAt(0)}{player.id + 1}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};