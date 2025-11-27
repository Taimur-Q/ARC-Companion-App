import React from 'react';
import { Quest, QuestProgress } from '../types';
import { ITEMS } from '../constants';
import { MapPin, User, Award, Package, CheckSquare, Square } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  progress?: QuestProgress;
  onToggleQuest: () => void;
  onToggleObjective: (index: number) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, progress, onToggleQuest, onToggleObjective }) => {
  // Resolve Reward Items
  const rewardItems = quest.rewards.itemIds?.map(id => ITEMS.find(i => i.id === id)).filter(Boolean);
  const isQuestComplete = progress?.completed || false;

  return (
    <div className={`bg-arc-gray border rounded-lg p-5 relative overflow-hidden transition-all duration-300 
      ${isQuestComplete 
        ? 'border-green-500/20 opacity-80' 
        : 'border-white/10 hover:border-arc-orange/30'
      }`}>
      
      <div className={`absolute top-0 right-0 p-3 transition-opacity ${isQuestComplete ? 'opacity-5 text-green-500' : 'opacity-10'}`}>
         <MapPin size={64} />
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-start gap-4">
          <div>
              <div className="flex items-center gap-2 text-xs font-mono text-arc-orange mb-1 uppercase tracking-wider">
                  <User size={12} />
                  Contractor: {quest.giver}
              </div>
              <h3 className={`text-xl font-bold transition-colors ${isQuestComplete ? 'text-green-500 line-through decoration-2 decoration-green-500/50' : 'text-white'}`}>
                {quest.name}
              </h3>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">{quest.description}</p>
          </div>
          
          <button 
            onClick={onToggleQuest}
            className={`flex-shrink-0 transition-colors p-1 rounded hover:bg-white/5 ${isQuestComplete ? 'text-green-500' : 'text-gray-500 hover:text-white'}`}
            aria-label={isQuestComplete ? "Mark quest as incomplete" : "Mark quest as complete"}
          >
             {isQuestComplete ? <CheckSquare size={28} /> : <Square size={28} />}
          </button>
        </div>

        <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Objectives</h4>
            <ul className="space-y-2">
                {quest.objectives.map((obj, idx) => {
                    const isObjComplete = progress?.objectives?.[idx] || false;
                    return (
                      <li 
                        key={idx} 
                        onClick={() => onToggleObjective(idx)}
                        className={`flex items-start gap-3 p-2 rounded border cursor-pointer transition-all select-none group
                          ${isObjComplete 
                            ? 'bg-green-500/10 border-green-500/20' 
                            : 'bg-black/20 border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                      >
                          <div className={`mt-0.5 transition-colors ${isObjComplete ? 'text-green-500' : 'text-gray-600 group-hover:text-gray-400'}`}>
                              {isObjComplete ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>
                          <div className="flex-1">
                              <span className={`text-sm transition-all ${isObjComplete ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                {obj.description}
                              </span>
                              {obj.targetItemId && (
                                  <div className="text-xs font-mono text-gray-500 mt-0.5">
                                      REQ: {ITEMS.find(i => i.id === obj.targetItemId)?.name || obj.targetItemId} x{obj.count}
                                  </div>
                              )}
                          </div>
                      </li>
                    );
                })}
            </ul>
        </div>

        <div className={`mt-2 pt-4 border-t border-dashed transition-colors ${isQuestComplete ? 'border-green-500/20' : 'border-white/10'}`}>
             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Award size={12} /> Rewards
             </h4>
             <div className="flex flex-wrap gap-3 opacity-90">
                 {quest.rewards.currency && (
                   <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-500 font-mono font-bold">
                      {quest.rewards.currency} CR
                   </span>
                 )}
                 {quest.rewards.xp && (
                   <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-400 font-mono font-bold">
                      {quest.rewards.xp} XP
                   </span>
                 )}
                 {quest.rewards.text?.map((txt, i) => (
                   <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300 font-mono font-bold">
                      {txt}
                   </span>
                 ))}
                 {rewardItems?.map((item, i) => (
                     <span key={item?.id || i} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-400 font-mono font-bold flex items-center gap-1">
                         <Package size={10} /> {item?.name}
                     </span>
                 ))}
             </div>
        </div>
      </div>
    </div>
  );
};