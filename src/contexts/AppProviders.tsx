"use client";

import React, { ReactNode } from 'react';
import { SettingsProvider } from './SettingsContext';
import { NpcProvider } from './NpcContext';
// Import FactionProvider and DialogueProvider when they are created
// import { FactionProvider } from './FactionContext';
// import { DialogueProvider } from './DialogueContext';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <SettingsProvider>
      <NpcProvider>
        {/* <FactionProvider> */}
          {/* <DialogueProvider> */}
            {children}
          {/* </DialogueProvider> */}
        {/* </FactionProvider> */}
      </NpcProvider>
    </SettingsProvider>
  );
};
