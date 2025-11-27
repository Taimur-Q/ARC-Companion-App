import React from 'react';
import { ViewState } from '../types';
import { Backpack, ScrollText, Recycle } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  return (
    <nav className="sticky top-0 z-40 bg-arc-dark/95 backdrop-blur-md border-b border-white/10 px-4 py-3 safe-top">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-arc-orange rounded-sm flex items-center justify-center rotate-45 shadow-[0_0_10px_rgba(255,85,0,0.3)]">
            <div className="-rotate-45 font-bold text-black">A</div>
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-white">
            ARC <span className="text-arc-orange">WIKI</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => setView('ITEMS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all duration-200
              ${currentView === 'ITEMS' 
                ? 'bg-white text-black font-bold' 
                : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Backpack size={16} />
            DATABASE
          </button>
          <button
            onClick={() => setView('QUESTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all duration-200
              ${currentView === 'QUESTS' 
                ? 'bg-white text-black font-bold' 
                : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <ScrollText size={16} />
            QUESTS
          </button>
          <button
            onClick={() => setView('RECYCLED')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all duration-200
              ${currentView === 'RECYCLED' 
                ? 'bg-white text-black font-bold' 
                : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Recycle size={16} />
            RECYCLING
          </button>
        </div>
      </div>
    </nav>
  );
};