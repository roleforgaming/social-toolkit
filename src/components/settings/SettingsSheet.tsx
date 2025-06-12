"use client";

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from '@/contexts/SettingsContext';
import type { WildcardTone } from '@/types/core';
import { WILDCARD_TONES } from '@/lib/constants';

interface SettingsSheetProps {
  children: React.ReactNode; // Trigger element
}

export const SettingsSheet: React.FC<SettingsSheetProps> = ({ children }) => {
  const { selectedWildcardTone, setSelectedWildcardTone, hardcoreMode, setHardcoreMode } = useSettings();

  return (
    <Sheet>
      {children} {/* This will be the <SheetTrigger> which is the button from AppHeader */}
      <SheetContent className="bg-card text-card-foreground">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">Game Settings</SheetTitle>
          <SheetDescription>
            Customize your Interactive Saga experience.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="hardcore-mode" className="text-base text-foreground">
                Hardcore Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Restrict dialogues to initial three tones.
              </p>
            </div>
            <Switch
              id="hardcore-mode"
              checked={hardcoreMode}
              onCheckedChange={setHardcoreMode}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="wildcard-tone" className="text-base text-foreground">
                Wildcard Tone
              </Label>
              <span className="text-xs text-muted-foreground">This tone will be duplicated in your deck and can force special outcomes.</span>
            </div>
            <select
              id="wildcard-tone"
              className="ml-4 rounded border px-2 py-1 text-foreground bg-background"
              value={selectedWildcardTone ?? ''}
              onChange={e => setSelectedWildcardTone(e.target.value ? e.target.value as any : null)}
            >
              <option value="">None</option>
              {WILDCARD_TONES.map(tone => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </select>
          </div>
        </div>
        <SheetFooter className="mt-auto">
          <SheetClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
