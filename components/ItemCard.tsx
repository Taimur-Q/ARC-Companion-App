import React, { useState } from 'react';
import { Item, Rarity, QuestProgress } from '../types';
import { ITEMS, QUESTS } from '../constants';
import { Coins, Recycle, AlertTriangle, Wrench, ChevronDown, ChevronUp, Database, Globe, CheckCircle2 } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  questProgress?: Record<string, QuestProgress>;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, questProgress }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRarityColor = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.COMMON: return 'border-l-gray-400 text-gray-200';
      case Rarity.UNCOMMON: return 'border-l-green-500 text-green-400';
      case Rarity.RARE: return 'border-l-blue-500 text-blue-400';
      case Rarity.EPIC: return 'border-l-purple-500 text-purple-400';
      case Rarity.LEGENDARY: return 'border-l-orange-500 text-orange-400';
      default: return 'border-l-gray-500';
    }
  };

  const getRarityBg = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.LEGENDARY: return 'bg-orange-500/10';
      case Rarity.EPIC: return 'bg-purple-500/10';
      default: return 'bg-white/5';
    }
  };

  // Resolve Recycle items
  const recycleItems = item.recycleYield?.map(yieldData => {
    const resolvedItem = ITEMS.find(i => i.id === yieldData.itemId);
    return { ...yieldData, name: resolvedItem?.name || 'Unknown' };
  });

  // Dynamically find Quests that require this item
  const relatedQuests = QUESTS.filter(quest => 
    quest.objectives.some(obj => obj.targetItemId === item.id)
  );

  // Check if there are any quests that are NOT completed
  const activeQuests = relatedQuests.filter(q => !questProgress?.[q.id]?.completed);

  return (
    <div 
      className={`group relative border border-white/10 rounded-md overflow-hidden transition-all duration-300 hover:border-arc-orange/50 ${getRarityBg(item.rarity)}`}
    >
      {/* Header / Main Info */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-4">
          <div className={`pl-3 border-l-4 ${getRarityColor(item.rarity)} flex-1`}>
            <h3 className="text-lg font-bold leading-tight uppercase tracking-wide break-words">{item.name}</h3>
            <span className="text-xs font-mono text-gray-500 uppercase mt-1 block">{item.rarity} // {item.type}</span>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1 bg-black/40 px-2 py-1 rounded border border-white/5">
            <Coins size={14} className="text-yellow-500" />
            <span className="text-sm font-mono text-yellow-500 font-bold">{item.sellPrice}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-1">
            {/* Indicators */}
            <div className="flex flex-wrap gap-2">
                {item.requiredForWorkshop && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-900/30 border border-blue-500/30 rounded text-[10px] text-blue-300 uppercase tracking-wider">
                        <Wrench size={10} /> Workshop
                    </div>
                )}
                {item.requiredForExpedition && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-900/30 border border-emerald-500/30 rounded text-[10px] text-emerald-300 uppercase tracking-wider">
                        <Globe size={10} /> Expedition
                    </div>
                )}
                {/* Only show warning tag if active quests exist */}
                {activeQuests.length > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-orange-900/30 border border-orange-500/30 rounded text-[10px] text-orange-300 uppercase tracking-wider">
                        <AlertTriangle size={10} /> Quest
                    </div>
                )}
                {/* Show a green check tag if all quests are done but were relevant */}
                {relatedQuests.length > 0 && activeQuests.length === 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-900/30 border border-green-500/30 rounded text-[10px] text-green-300 uppercase tracking-wider">
                        <CheckCircle2 size={10} /> Quests Done
                    </div>
                )}
            </div>
        </div>

        <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 w-full h-10 flex items-center justify-center gap-2 bg-white/5 active:bg-white/10 hover:bg-white/10 rounded text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-all touch-manipulation"
        >
            {isExpanded ? 'Close Details' : 'Inspect Item'}
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Expanded Details (The "Loot Menu" logic) */}
      {isExpanded && (
        <div className="bg-black/40 border-t border-white/10 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
           <p className="text-sm text-gray-400 italic leading-relaxed">"{item.description}"</p>
           
           {/* Recycle Section */}
           {recycleItems && recycleItems.length > 0 && (
             <div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                    <Recycle size={12} /> Recycles Into
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {recycleItems.map((r, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 px-3 py-2.5 rounded border border-white/5">
                            <span className="text-sm text-gray-300">{r.name}</span>
                            <span className="text-xs font-mono text-arc-orange">x{r.amount}</span>
                        </div>
                    ))}
                </div>
             </div>
           )}

           {/* Usage Section */}
           {(relatedQuests.length > 0) && (
               <div>
                   <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                       <Database size={12} /> Required For
                   </div>
                   <ul className="space-y-1">
                       {relatedQuests.map(q => {
                           const isComplete = questProgress?.[q.id]?.completed;
                           return (
                               <li key={q.id} className={`text-sm flex items-start gap-2 p-2 rounded ${isComplete ? 'bg-white/5 text-gray-500' : 'bg-orange-500/5 text-orange-300'}`}>
                                   <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${isComplete ? 'bg-gray-600' : 'bg-orange-500'}`}></span>
                                   <span className={`flex-1 ${isComplete ? 'line-through decoration-gray-600' : ''}`}>
                                       {q.name} <span className="text-gray-500 text-xs">({q.giver})</span>
                                   </span>
                                   {isComplete && <CheckCircle2 size={14} className="text-green-500/50" />}
                               </li>
                           );
                       })}
                   </ul>
               </div>
           )}

           {!recycleItems?.length && relatedQuests.length === 0 && !item.requiredForWorkshop && !item.requiredForExpedition && (
               <div className="text-center py-2 text-xs text-gray-600 font-mono">
                   NO KNOWN UTILITY OR YIELD
               </div>
           )}
        </div>
      )}
    </div>
  );
};