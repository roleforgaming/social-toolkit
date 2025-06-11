"use client";

import React from 'react';
import type { NPC } from '@/types/core';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { NPC_PLACEHOLDER_AVATAR } from '@/lib/constants';

interface DialogueInterfaceDialogProps {
  npc: NPC;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DialogueInterfaceDialog: React.FC<DialogueInterfaceDialogProps> = ({ npc, open, onOpenChange }) => {
  // Placeholder logic
  const handleToneSelection = (tone: string) => {
    alert(`Selected tone: ${tone} (not implemented)`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card text-card-foreground">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src={npc.avatarUrl || NPC_PLACEHOLDER_AVATAR}
              alt={npc.name}
              width={80}
              height={80}
              className="rounded-full border-2 border-primary"
              data-ai-hint="portrait person"
            />
          </div>
          <DialogTitle className="font-headline text-2xl">Dialogue with {npc.name}</DialogTitle>
          <DialogDescription>
            Current Mood: Neutral | Current Topic: Small Talk (Placeholders)
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div className="p-4 border rounded-md min-h-[100px] bg-background/50">
            <p className="italic text-muted-foreground">{npc.name} looks at you expectantly.</p>
            {/* NPC dialogue would appear here */}
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-foreground">Your Tones:</h3>
            <div className="flex flex-wrap gap-2">
              {["Friendly", "Neutral", "Assertive", "Sarcastic (Wildcard)"].map(tone => (
                <Button key={tone} variant="outline" onClick={() => handleToneSelection(tone)}>
                  {tone}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4 border rounded-md bg-background/50">
            <h4 className="font-semibold text-foreground">NPC Reaction:</h4>
            <p className="text-sm text-muted-foreground">Awaiting your response... (Reaction will appear here)</p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="destructive">End Dialogue</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
