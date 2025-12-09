import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import { playSound } from '../utils/audio';

interface GameModalProps {
  question: Question;
  onComplete: (success: boolean, message: string) => void;
  isOpen: boolean;
}

export const GameModal: React.FC<GameModalProps> = ({ question, onComplete, isOpen }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [mode, setMode] = useState<'CHOICE' | 'CORRECTION' | 'RESULT'>('CHOICE');
  const [correctionInput, setCorrectionInput] = useState('');
  const [attempts, setAttempts] = useState(2);
  const [resultMessage, setResultMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Timer Logic
  useEffect(() => {
    if (!isOpen || mode === 'RESULT') return;
    
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, mode]);

  // Focus input when entering correction mode
  useEffect(() => {
    if (mode === 'CORRECTION' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  const handleTimeOut = () => {
    playSound('timeout');
    finishTurn(false, "¡Tiempo agotado!");
  };

  const finishTurn = (success: boolean, msg: string) => {
    if (success) {
        playSound('correct');
    } else {
        // If it wasn't a timeout (which plays its own sound first), play wrong
        if (msg !== "¡Tiempo agotado!") playSound('wrong');
    }

    setIsSuccess(success);
    setResultMessage(msg);
    setMode('RESULT');
    
    // Auto close after showing result
    setTimeout(() => {
      onComplete(success, msg);
    }, 2500);
  };

  const handleIsCorrect = () => {
    if (question.ok) {
      finishTurn(true, "¡Correcto! La frase está bien.");
    } else {
      finishTurn(false, "¡Error! La frase tenía fallos.");
    }
  };

  const handleGoToCorrection = () => {
    if (question.ok) {
        finishTurn(false, "¡Error! La frase era correcta, no necesitaba corrección.");
        return;
    }
    setMode('CORRECTION');
  };

  const checkCorrection = () => {
    if (!question.ans) return;

    const cleanInput = correctionInput.trim().toLowerCase().replace(/[.|!|¡]/g, "");
    let isMatch = false;

    question.ans.forEach(ans => {
        const cleanAns = ans.trim().toLowerCase().replace(/[.|!|¡]/g, "");
        if (cleanInput === cleanAns) isMatch = true;
    });

    if (isMatch) {
      finishTurn(true, "¡Muy bien! Has corregido la frase.");
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      if (newAttempts <= 0) {
        finishTurn(false, `Has fallado. La respuesta era: "${question.ans[0]}"`);
      } else {
        playSound('wrong'); // Minor fail sound for attempt
        setCorrectionInput('');
        inputRef.current?.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
        
        {/* Header / Timer */}
        <div className="relative h-2 bg-slate-100">
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear ${timeLeft < 10 ? 'bg-red-500' : 'bg-sky-500'}`}
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          ></div>
        </div>
        
        <div className="p-8 text-center">
          {mode !== 'RESULT' && (
             <div className="mb-2 font-bold text-slate-400 text-sm">TIEMPO: {timeLeft}s</div>
          )}

          {/* Question Display */}
          <div className="bg-slate-50 border-l-4 border-sky-500 p-6 rounded-r-lg mb-8 shadow-inner">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-700">
              {question.t}
            </h2>
          </div>

          {/* Mode: CHOICE */}
          {mode === 'CHOICE' && (
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={handleIsCorrect}
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>✅</span> La frase es correcta
              </button>
              <button 
                onClick={handleGoToCorrection}
                className="bg-sky-500 hover:bg-sky-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-sky-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>✏️</span> Hay un error (Corregir)
              </button>
            </div>
          )}

          {/* Mode: CORRECTION */}
          {mode === 'CORRECTION' && (
            <div className="flex flex-col gap-4 animate-slideUp">
              <p className="text-slate-500 font-medium">Escribe la frase corregida:</p>
              <input
                ref={inputRef}
                type="text"
                value={correctionInput}
                onChange={(e) => setCorrectionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkCorrection()}
                className="w-full p-4 border-2 border-slate-200 rounded-xl text-lg focus:border-sky-500 focus:outline-none transition-colors"
                placeholder="Escribe aquí..."
                autoComplete="off"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-slate-400 font-bold">Intentos: {attempts}</span>
                <button 
                    onClick={checkCorrection}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-transform active:scale-95"
                >
                    Comprobar
                </button>
              </div>
              {attempts < 2 && (
                 <p className="text-rose-500 font-bold animate-pulse">¡Incorrecto! Inténtalo de nuevo.</p>
              )}
            </div>
          )}

          {/* Mode: RESULT */}
          {mode === 'RESULT' && (
            <div className="animate-bounceIn">
                <div className={`text-6xl mb-4`}>
                    {isSuccess ? '🎉' : '❌'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isSuccess ? '¡Excelente!' : '¡Vaya...!'}
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                    {resultMessage}
                </p>
                {!isSuccess && (
                    <p className="text-sm text-rose-500 font-bold mt-4 uppercase tracking-wide">Retrocedes 2 casillas</p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};