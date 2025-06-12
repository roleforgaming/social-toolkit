"use client";

import type { NPC } from '@/types/core';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { NPC_PLACEHOLDER_AVATAR, RELATIONSHIP_STAGES } from '@/lib/constants';
import { clampAttitudeLevel, clampAR, AR_MIN_DEFAULT, AR_MAX_DEFAULT, CONDITIONS } from '@/lib/utils';

// Ensure uuid is installed: npm install uuid @types/uuid

interface NpcContextType {
  npcs: NPC[];
  addNpc: (npcData: Omit<NPC, 'id' | 'avatarUrl'>) => void;
  updateNpc: (id: string, updates: Partial<NPC>) => void;
  deleteNpc: (id: string) => void;
  getNpcById: (id: string) => NPC | undefined;
}

const NpcContext = createContext<NpcContextType | undefined>(undefined);

const initialNpcs: NPC[] = [
  {
    id: uuidv4(),
    name: 'Elara Meadowlight',
    avatarUrl: NPC_PLACEHOLDER_AVATAR,
    relationshipStage: RELATIONSHIP_STAGES[3], // Friendly
    attitudeLevel: 5,
    ar: 12,
    conditions: ['Healthy'],
    questProgress: 'Met in Greenhaven',
    isBonded: false,
    isRomance: false,
    backstorySnippet: 'A kind herbalist with a mysterious past.',
    notes: 'Seems to know a lot about ancient ruins.'
  },
  {
    id: uuidv4(),
    name: 'Grak Ironhide',
    avatarUrl: NPC_PLACEHOLDER_AVATAR,
    relationshipStage: RELATIONSHIP_STAGES[2], // Neutral
    attitudeLevel: 0,
    ar: 10,
    conditions: ['Wary'],
    questProgress: 'None',
    isBonded: true,
    isRomance: false,
    backstorySnippet: 'A stoic warrior guarding an old secret.',
    notes: 'Responds well to shows of strength.'
  }
];


export const NpcProvider = ({ children }: { children: ReactNode }) => {
  const [npcs, setNpcs] = useState<NPC[]>(initialNpcs);
  const [hasHydrated, setHasHydrated] = React.useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNpcs = localStorage.getItem('interactiveSagaNpcs');
      if (savedNpcs) {
        setNpcs(JSON.parse(savedNpcs));
      }
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && hasHydrated) {
      localStorage.setItem('interactiveSagaNpcs', JSON.stringify(npcs));
    }
  }, [npcs, hasHydrated]);

  const addNpc = (npcData: Omit<NPC, 'id' | 'avatarUrl'>) => {
    const newNpc: NPC = {
      ...npcData,
      id: uuidv4(),
      avatarUrl: NPC_PLACEHOLDER_AVATAR,
      attitudeLevel: clampAttitudeLevel(npcData.attitudeLevel ?? 0),
      ar: clampAR(npcData.ar ?? 0, AR_MIN_DEFAULT, AR_MAX_DEFAULT),
      conditions: (npcData.conditions ?? []).filter(c => CONDITIONS.includes(c as any)),
    };
    setNpcs(prevNpcs => [...prevNpcs, newNpc]);
  };

  const updateNpc = (id: string, updates: Partial<NPC>) => {
    setNpcs(prevNpcs =>
      prevNpcs.map(npc => {
        if (npc.id !== id) return npc;
        // Clamp attitude/ar and filter conditions
        const attitudeLevel = updates.attitudeLevel !== undefined ? clampAttitudeLevel(updates.attitudeLevel) : npc.attitudeLevel;
        const ar = updates.ar !== undefined ? clampAR(updates.ar, AR_MIN_DEFAULT, AR_MAX_DEFAULT) : npc.ar;
        const conditions = updates.conditions !== undefined ? updates.conditions.filter(c => CONDITIONS.includes(c as any)) : npc.conditions;
        return { ...npc, ...updates, attitudeLevel, ar, conditions };
      })
    );
  };

  const deleteNpc = (id: string) => {
    setNpcs(prevNpcs => prevNpcs.filter(npc => npc.id !== id));
  };

  const getNpcById = (id: string) => {
    return npcs.find(npc => npc.id === id);
  };
  

  return (
    <NpcContext.Provider value={{ npcs, addNpc, updateNpc, deleteNpc, getNpcById }}>
      {hasHydrated ? children : null}
    </NpcContext.Provider>
  );
};

export const useNpcs = (): NpcContextType => {
  const context = useContext(NpcContext);
  if (context === undefined) {
    throw new Error('useNpcs must be used within an NpcProvider');
  }
  return context;
};
