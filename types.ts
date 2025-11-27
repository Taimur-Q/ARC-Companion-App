export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary'
}

export enum ItemType {
  MATERIAL = 'Material',
  WEAPON = 'Weapon',
  CONSUMABLE = 'Consumable',
  KEY_ITEM = 'Key Item',
  VALUABLE = 'Valuable'
}

export interface RecycleYield {
  itemId: string;
  amount: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  type: ItemType;
  sellPrice: number; // In Crypto/Currency
  weight: number;
  recycleYield?: RecycleYield[];
  requiredForQuestIds?: string[]; // IDs of quests that need this item
  requiredForWorkshop?: boolean;
  requiredForExpedition?: boolean;
  image?: string;
}

export interface QuestObjective {
  description: string;
  targetItemId?: string; // If the objective is to collect/deposit an item
  count?: number;
}

export interface Quest {
  id: string;
  name: string;
  giver: string;
  description: string;
  objectives: QuestObjective[];
  rewards: {
    xp?: number;
    currency?: number;
    itemIds?: string[];
    text?: string[]; // For rewards like "Renegade I" that aren't items in DB
  };
}

export interface QuestProgress {
  completed: boolean;
  objectives: boolean[];
}

export type ViewState = 'ITEMS' | 'QUESTS' | 'RECYCLED';