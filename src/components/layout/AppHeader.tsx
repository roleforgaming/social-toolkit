"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Users, User, MessageSquare } from 'lucide-react';
import { SettingsSheet } from '@/components/settings/SettingsSheet'; // Will be created

export const AppHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span className="hidden font-headline text-xl font-bold sm:inline-block">
              Interactive Saga
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <SettingsSheet>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </SettingsSheet>
        </div>
      </div>
    </header>
  );
};
