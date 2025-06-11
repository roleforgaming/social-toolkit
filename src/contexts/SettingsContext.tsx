"use client";

import type { AppSettings, WildcardTone } from '@/types/core';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SettingsContextType extends AppSettings {
  setSelectedWildcardTone: (tone: WildcardTone | null) => void;
  setHardcoreMode: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  selectedWildcardTone: null,
  hardcoreMode: false,
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('interactiveSagaSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    }
    return defaultSettings;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('interactiveSagaSettings', JSON.stringify(settings));
    }
  }, [settings]);

  const setSelectedWildcardTone = (tone: WildcardTone | null) => {
    setSettings(prev => ({ ...prev, selectedWildcardTone: tone }));
  };

  const setHardcoreMode = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, hardcoreMode: enabled }));
  };

  return (
    <SettingsContext.Provider value={{ ...settings, setSelectedWildcardTone, setHardcoreMode }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
