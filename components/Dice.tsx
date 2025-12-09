import React from 'react';
import { DiceProps } from '../types';

export const Dice: React.FC<DiceProps> = ({ value, rolling, onRoll, disabled }) => {
  
  // Mapping rotation values to show the correct face
  // 1: front, 2: back (flipped), 3: right, 4: left, 5: top, 6: bottom
  // CSS Transforms needed to show 'value' face at the front
  const getTransform = (val: number) => {
    switch(val) {
      case 1: return 'rotateY(0deg) rotateX(0deg)';
      case 2: return 'rotateX(0deg) rotateY(-180deg)'; // Back
      case 3: return 'rotateY(-90deg) rotateX(0deg)'; // Right
      case 4: return 'rotateY(90deg) rotateX(0deg)'; // Left
      case 5: return 'rotateX(-90deg) rotateY(0deg)'; // Top
      case 6: return 'rotateX(90deg) rotateY(0deg)'; // Bottom
      default: return 'rotateY(0deg)';
    }
  };

  // Helper to position dots on the dice face
  const renderDots = (num: number) => {
    const dots = [];
    // Positions: tl, tr, ml, mm, mr, bl, br (top-left, mid-mid, etc.)
    const posMap: Record<string, React.CSSProperties> = {
      tl: { top: '15%', left: '15%' },
      tr: { top: '15%', right: '15%' },
      mm: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      bl: { bottom: '15%', left: '15%' },
      br: { bottom: '15%', right: '15%' },
      ml: { top: '50%', left: '15%', transform: 'translate(0, -50%)' },
      mr: { top: '50%', right: '15%', transform: 'translate(0, -50%)' }
    };

    let positions: string[] = [];
    if (num === 1) positions = ['mm'];
    if (num === 2) positions = ['tl', 'br'];
    if (num === 3) positions = ['tl', 'mm', 'br'];
    if (num === 4) positions = ['tl', 'tr', 'bl', 'br'];
    if (num === 5) positions = ['tl', 'tr', 'mm', 'bl', 'br'];
    if (num === 6) positions = ['tl', 'tr', 'ml', 'mr', 'bl', 'br'];

    positions.forEach((p, i) => {
      dots.push(<div key={i} className="dot" style={posMap[p]}></div>);
    });
    return dots;
  };

  // If rolling, we apply a crazy rotation. If settled, we show the target value.
  const currentTransform = rolling 
    ? `rotateX(${Math.random() * 720 + 360}deg) rotateY(${Math.random() * 720 + 360}deg)`
    : getTransform(value);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="scene">
        <div 
          className="cube" 
          style={{ transform: currentTransform }}
        >
          <div className="cube-face cube-face-front">{renderDots(1)}</div>
          <div className="cube-face cube-face-back">{renderDots(2)}</div>
          <div className="cube-face cube-face-right">{renderDots(3)}</div>
          <div className="cube-face cube-face-left">{renderDots(4)}</div>
          <div className="cube-face cube-face-top">{renderDots(5)}</div>
          <div className="cube-face cube-face-bottom">{renderDots(6)}</div>
        </div>
      </div>
      
      <button 
        onClick={onRoll}
        disabled={disabled || rolling}
        className={`px-6 py-2 rounded-full font-bold shadow-lg transform transition-all active:scale-95 border-b-4 
          ${disabled 
            ? 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed' 
            : 'bg-yellow-400 text-yellow-900 border-yellow-600 hover:bg-yellow-300 hover:-translate-y-1'
          }`}
      >
        {rolling ? '...' : 'TIRAR DADO'}
      </button>
    </div>
  );
};