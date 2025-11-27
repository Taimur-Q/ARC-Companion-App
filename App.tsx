import React, { useState, useMemo, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { BottomNavigation } from './components/BottomNavigation';
import { ItemCard } from './components/ItemCard';
import { QuestCard } from './components/QuestCard';
import { ITEMS, QUESTS } from './constants';
import { ViewState, ItemType, QuestProgress } from './types';
import { Search, Filter, Recycle, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('ITEMS');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ItemType | 'ALL'>('ALL');
  
  // Quest Progress State with Persistence
  const [questProgress, setQuestProgress] = useState<Record<string, QuestProgress>>(() => {
    try {
      const saved = localStorage.getItem('arc-wiki-quest-progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to load quest progress", e);
      return {};
    }
  });

  // Save progress whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('arc-wiki-quest-progress', JSON.stringify(questProgress));
    } catch (e) {
      console.error("Failed to save quest progress", e);
    }
  }, [questProgress]);

  // Handlers
  const handleToggleQuest = (questId: string) => {
    setQuestProgress(prev => {
      const quest = QUESTS.find(q => q.id === questId);
      if (!quest) return prev;

      const current = prev[questId];
      const isNowComplete = !current?.completed;

      return {
        ...prev,
        [questId]: {
          completed: isNowComplete,
          // If marking as complete, check all objectives. If unmarking, leave objectives as-is (user preference) or uncheck? 
          // Standard behavior: Complete checks all. Incomplete just toggles the master flag but leaves objectives alone (or sets false).
          // Based on prompt "mark off the objectives in the quest as well", we enforce sync when Completing.
          objectives: isNowComplete 
            ? new Array(quest.objectives.length).fill(true) 
            : (current?.objectives || new Array(quest.objectives.length).fill(false))
        }
      };
    });
  };

  const handleToggleObjective = (questId: string, objectiveIndex: number) => {
    setQuestProgress(prev => {
      const quest = QUESTS.find(q => q.id === questId);
      if (!quest) return prev;

      const current = prev[questId] || { completed: false, objectives: new Array(quest.objectives.length).fill(false) };
      const newObjectives = [...(current.objectives || [])];
      
      // Ensure array matches length if schema changed
      while(newObjectives.length < quest.objectives.length) newObjectives.push(false);

      newObjectives[objectiveIndex] = !newObjectives[objectiveIndex];

      // Auto-complete quest if all objectives are done?
      const allObjectivesDone = newObjectives.every(Boolean);
      
      return {
        ...prev,
        [questId]: {
          completed: allObjectivesDone, // Auto-set parent status
          objectives: newObjectives
        }
      };
    });
  };

  // Filter Logic
  const filteredItems = useMemo(() => {
    return ITEMS.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                            item.description.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const filteredQuests = useMemo(() => {
    return QUESTS.filter(quest => {
       return quest.name.toLowerCase().includes(search.toLowerCase()) || 
              quest.description.toLowerCase().includes(search.toLowerCase()) ||
              quest.giver.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

  // Recycling Logic: Reverse Lookup
  const recyclingResults = useMemo(() => {
    if (view !== 'RECYCLED') return [];
    
    // 1. Find potential target items (materials you WANT) based on search
    // If search is empty, show nothing or all? Showing all is too much, show items that ARE yields
    const targets = ITEMS.filter(item => 
        // Only show items that actually match the search query
        (search ? item.name.toLowerCase().includes(search.toLowerCase()) : false)
    );

    // 2. For each target, find who recycles into it
    const results = targets.map(target => {
        const sources = ITEMS.filter(sourceItem => 
            sourceItem.recycleYield?.some(y => y.itemId === target.id)
        ).map(sourceItem => {
            const yieldInfo = sourceItem.recycleYield?.find(y => y.itemId === target.id);
            return {
                item: sourceItem,
                amount: yieldInfo?.amount || 0
            };
        }).sort((a, b) => b.amount - a.amount); // Sort by highest yield first

        return {
            target,
            sources
        };
    }).filter(group => group.sources.length > 0); // Only show if there are sources found

    return results;
  }, [search, view]);

  const getHeaderTitle = () => {
    switch(view) {
      case 'ITEMS': return 'Item Database';
      case 'QUESTS': return 'Active Contracts';
      case 'RECYCLED': return 'Reverse Recycling';
    }
  };

  const getHeaderSubtitle = () => {
    switch(view) {
      case 'ITEMS': return `Indexing ${ITEMS.length} items available in the sector.`;
      case 'QUESTS': return `Tracking ${QUESTS.length} available opportunities.`;
      case 'RECYCLED': return 'Find out which items contain the materials you need.';
    }
  };

  return (
    <div className="min-h-screen bg-arc-dark text-arc-text font-sans pb-32 md:pb-20">
      <Navigation currentView={view} setView={setView} />

      <main className="max-w-6xl mx-auto px-4 pt-6">
        
        {/* Header & Filters */}
        <div className="mb-6 space-y-4">
           <div className="flex flex-col gap-4">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div>
                       <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter text-white">
                           {getHeaderTitle()}
                       </h2>
                       <p className="text-gray-500 text-xs md:text-sm font-mono mt-1">
                           {getHeaderSubtitle()}
                       </p>
                   </div>

                   {/* Search Bar */}
                   <div className="relative group w-full md:w-auto">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Search size={16} className="text-gray-600 group-focus-within:text-arc-orange transition-colors" />
                       </div>
                       <input 
                          type="text" 
                          placeholder={view === 'RECYCLED' ? "SEARCH MATERIAL NEEDED..." : "SEARCH DATABASE..."}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full md:w-80 bg-white/5 border border-white/10 rounded-md py-3 md:py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-arc-orange focus:ring-1 focus:ring-arc-orange/50 transition-all placeholder-gray-600 text-gray-200 font-mono uppercase"
                       />
                   </div>
               </div>
           </div>

           {/* Item Specific Type Filters */}
           {view === 'ITEMS' && (
               <div className="flex items-center gap-2 border-t border-white/5 pt-4 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                   <span className="flex-shrink-0 flex items-center text-xs font-bold text-gray-600 uppercase mr-2">
                       <Filter size={12} className="mr-1" /> Filter:
                   </span>
                   {['ALL', ...Object.values(ItemType)].map(type => (
                       <button
                          key={type}
                          onClick={() => setTypeFilter(type as ItemType | 'ALL')}
                          className={`flex-shrink-0 px-3 py-1.5 text-xs rounded-full border transition-all uppercase tracking-wider font-bold whitespace-nowrap
                            ${typeFilter === type 
                                ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                                : 'bg-transparent text-gray-500 border-gray-800 hover:border-gray-600'}`}
                       >
                           {type}
                       </button>
                   ))}
               </div>
           )}
        </div>

        {/* Content Switcher */}
        {view === 'ITEMS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      questProgress={questProgress}
                    />
                ))}
                {filteredItems.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-600 font-mono">
                        NO ENTRIES FOUND MATCHING QUERY.
                    </div>
                )}
            </div>
        )}

        {view === 'QUESTS' && (
            <div className="grid grid-cols-1 gap-4">
                {filteredQuests.map(quest => (
                    <QuestCard 
                      key={quest.id} 
                      quest={quest} 
                      progress={questProgress[quest.id]}
                      onToggleQuest={() => handleToggleQuest(quest.id)}
                      onToggleObjective={(idx) => handleToggleObjective(quest.id, idx)}
                    />
                ))}
                 {filteredQuests.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-600 font-mono">
                        NO CONTRACTS FOUND MATCHING QUERY.
                    </div>
                )}
            </div>
        )}

        {view === 'RECYCLED' && (
            <div className="grid grid-cols-1 gap-6">
                {recyclingResults.map(({target, sources}) => (
                    <div key={target.id} className="bg-arc-gray border border-white/10 rounded-lg overflow-hidden">
                        <div className="p-4 bg-white/5 border-b border-white/5 flex flex-col md:flex-row md:items-center gap-3">
                             <div className="flex-1">
                                <div className="text-xs text-arc-orange font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                                  Target Material
                                </div>
                                <h3 className="text-xl font-bold text-white">{target.name}</h3>
                             </div>
                             <div className="text-xs text-gray-500 font-mono bg-black/30 px-3 py-2 rounded border border-white/5">
                                Found in {sources.length} items
                             </div>
                        </div>
                        
                        <div className="p-4">
                            <div className="grid gap-2">
                                <div className="grid grid-cols-[1fr_auto] px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/5">
                                    <span>Recycle Source</span>
                                    <span className="text-right">Yield</span>
                                </div>
                                {sources.map(({item, amount}) => (
                                    <div key={item.id} className="grid grid-cols-[1fr_auto] items-center bg-black/20 hover:bg-white/5 px-3 py-3 rounded border border-transparent hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Recycle size={14} className="text-gray-600" />
                                            <span className="font-bold text-gray-200">{item.name}</span>
                                            <span className="text-[10px] text-gray-600 border border-gray-800 rounded px-1 hidden sm:block">{item.rarity}</span>
                                        </div>
                                        <div className="text-right font-mono text-arc-orange font-bold">
                                            {amount}x
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                
                {recyclingResults.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                         <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                             <Recycle size={32} />
                         </div>
                         {search ? (
                             <>
                                <p className="text-gray-400 font-bold mb-1">NO MATERIALS FOUND</p>
                                <p className="text-xs text-gray-600 font-mono">NO ITEMS RECYCLE INTO "{search.toUpperCase()}"</p>
                             </>
                         ) : (
                             <>
                                <p className="text-gray-400 font-bold mb-1">SEARCH FOR A MATERIAL</p>
                                <p className="text-xs text-gray-600 font-mono">Try searching for "Metal Parts" or "Wires"</p>
                             </>
                         )}
                    </div>
                )}
            </div>
        )}
      </main>

      <BottomNavigation currentView={view} setView={setView} />
    </div>
  );
};

export default App;