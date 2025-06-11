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

          <div className="space-y-2 rounded-lg border p-4">
            <Label htmlFor="wildcard-tone" className="text-base text-foreground">Select Wildcard Tone</Label>
            <Select
              value={selectedWildcardTone || ""}
              onValueChange={(value) => setSelectedWildcardTone(value as WildcardTone || null)}
            >
              <SelectTrigger id="wildcard-tone" className="w-full bg-input text-foreground">
                <SelectValue placeholder="Select a wildcard tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {WILDCARD_TONES.map(tone => (
                  <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              This tone will be added to your dialogue options.
            </p>
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
