import React from 'react';
import { ViewState } from '../types';
import { Backpack, ScrollText, Recycle } from 'lucide-react';

interface BottomNavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentView, setView }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-arc-dark/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 pb-6 z-50 flex justify-around items-center shadow-[0_-5px_20px_rgba(0,0,0,0.5)] safe-bottom">
        <button 
            onClick={() => setView('ITEMS')}
            className={`flex flex-col items-center gap-1 p-2 w-20 transition-colors active:scale-95 ${currentView === 'ITEMS' ? 'text-arc-orange' : 'text-gray-500'}`}
        >
            <Backpack size={24} strokeWidth={currentView === 'ITEMS' ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-widest uppercase">Items</span>
        </button>
        <button 
            onClick={() => setView('QUESTS')}
            className={`flex flex-col items-center gap-1 p-2 w-20 transition-colors active:scale-95 ${currentView === 'QUESTS' ? 'text-arc-orange' : 'text-gray-500'}`}
        >
            <ScrollText size={24} strokeWidth={currentView === 'QUESTS' ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-widest uppercase">Quests</span>
        </button>
        <button 
            onClick={() => setView('RECYCLED')}
            className={`flex flex-col items-center gap-1 p-2 w-20 transition-colors active:scale-95 ${currentView === 'RECYCLED' ? 'text-arc-orange' : 'text-gray-500'}`}
        >
            <Recycle size={24} strokeWidth={currentView === 'RECYCLED' ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-widest uppercase">Recycle</span>
        </button>
    </div>
  );
};