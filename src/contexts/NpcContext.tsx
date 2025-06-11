"use client";

import type { NPC } from '@/types/core';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { NPC_PLACEHOLDER_AVATAR, RELATIONSHIP_STAGES, ATTITUDE_LEVELS } from '@/lib/constants';

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
  const [npcs, setNpcs] = useState<NPC[]>(() => {
     if (typeof window !== 'undefined') {
      const savedNpcs = localStorage.getItem('interactiveSagaNpcs');
      return savedNpcs ? JSON.parse(savedNpcs) : initialNpcs;
    }
    return initialNpcs;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('interactiveSagaNpcs', JSON.stringify(npcs));
    }
  }, [npcs]);

  const addNpc = (npcData: Omit<NPC, 'id' | 'avatarUrl'>) => {
    const newNpc: NPC = {
      ...npcData,
      id: uuidv4(),
      avatarUrl: NPC_PLACEHOLDER_AVATAR,
    };
    setNpcs(prevNpcs => [...prevNpcs, newNpc]);
  };

  const updateNpc = (id: string, updates: Partial<NPC>) => {
    setNpcs(prevNpcs =>
      prevNpcs.map(npc => (npc.id === id ? { ...npc, ...updates } : npc))
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
      {children}
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
