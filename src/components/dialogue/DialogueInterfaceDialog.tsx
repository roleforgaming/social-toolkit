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
import { drawTones, isToneAvailable, getTopic, getMood, getReaction, getNpcReaction, canExchange, getWildcardForcedTone, getRestrictedTones, applyShiftEffect, getMoodModifier, getHardcoreHand, getLinkedTone } from '@/lib/utils';
import { TONE_DECK } from '@/lib/constants';
import { useSettings } from '@/contexts/SettingsContext';

interface DialogueInterfaceDialogProps {
  npc: NPC;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DialogueInterfaceDialog: React.FC<DialogueInterfaceDialogProps> = ({ npc, open, onOpenChange }) => {
  // Settings for advanced features
  const { selectedWildcardTone, hardcoreMode } = useSettings();
  // Determine the linked tone for the wildcard
  const wildcardLinked = selectedWildcardTone ? getLinkedTone(selectedWildcardTone) : null;

  // Dialogue state
  const [exchange, setExchange] = React.useState(0);
  const [history, setHistory] = React.useState<{tone: string, reaction: string, outcome: string}[]>([]);
  const [tones, setTones] = React.useState<string[]>([]);
  const [usedTones, setUsedTones] = React.useState<string[]>([]);
  const [chosenTone, setChosenTone] = React.useState<string | null>(null);
  const [reaction, setReaction] = React.useState<string | null>(null);
  const [outcome, setOutcome] = React.useState<string | null>(null);
  const [topic, setTopic] = React.useState<string>('');
  const [mood, setMood] = React.useState<string>('');
  const [forcedTone, setForcedTone] = React.useState<string | null>(null);

  // Helper: filter tone deck for optional tones and mood restrictions
  function getAvailableToneDeck() {
    return (TONE_DECK as unknown as string[]).filter(tone => {
      if (tone === 'Flirting' && npc.attitudeLevel < -1) return false;
      if (tone === 'Romantic' && !npc.isRomance) return false;
      if (getRestrictedTones(mood).includes(tone)) return false;
      return true;
    });
  }

  // On open/initiate dialogue
  React.useEffect(() => {
    if (open) {
      setExchange(0);
      setHistory([]);
      setChosenTone(null);
      setReaction(null);
      setOutcome(null);
      setUsedTones([]);
      setTopic(getTopic(true)); // Assume player initiates for now
      const m = getMood(npc.attitudeLevel);
      setMood(m);
      // Draw initial hand (Hardcore: persistent, else per exchange)
      const deck = getAvailableToneDeck();
      if (hardcoreMode) {
        setTones(drawTones(deck));
      } else {
        setTones(drawTones(deck));
      }
      setForcedTone(null);
    }
  }, [open]);

  // Handle tone selection
  const handleToneSelection = (tone: string) => {
    if (!isToneAvailable(tone, npc) || !canExchange(exchange)) return;
    setChosenTone(tone);
    setUsedTones(prev => [...prev, tone]);
    // Wildcard logic: if forced, skip reaction roll
    if (forcedTone && tone === forcedTone) {
      setOutcome('Wildcard');
      setReaction('Choose any reaction!');
      setHistory(h => [...h, { tone, reaction: 'Choose any reaction!', outcome: 'Wildcard' }]);
      setExchange(e => e + 1);
      // Remove wildcard/linked from deck for next exchange
      if (exchange < 2) {
        const deck = getAvailableToneDeck().filter(t => t !== selectedWildcardTone && t !== wildcardLinked);
        setTones(drawTones(deck, [...usedTones, tone]));
      }
      return;
    }
    // Mood modifier
    const mod = getMoodModifier(mood, tone);
    // Reaction outcome (with modifier)
    let outcome = getReaction(npc.attitudeLevel + mod);
    // Mood shift effect
    outcome = applyShiftEffect(mood, outcome);
    const npcReact = getNpcReaction(tone, outcome);
    setOutcome(outcome);
    setReaction(npcReact);
    setHistory(h => [...h, { tone, reaction: npcReact, outcome }]);
    setExchange(e => e + 1);
    // Remove used tone for next exchange (Hardcore: persistent hand)
    if (exchange < 2) {
      let deck = getAvailableToneDeck();
      if (hardcoreMode) {
        deck = getHardcoreHand(deck, [...usedTones, tone]);
      }
      setTones(drawTones(deck, [...usedTones, tone]));
    }
  };

  // Wildcard Tone: check if forced selection is needed
  React.useEffect(() => {
    if (tones.length > 0) {
      const forced = getWildcardForcedTone(tones, selectedWildcardTone, wildcardLinked);
      setForcedTone(forced);
    }
  }, [tones]);

  // Reset chosenTone/reaction for next exchange
  React.useEffect(() => {
    if (chosenTone && exchange < 3) {
      setTimeout(() => {
        setChosenTone(null);
        setReaction(null);
        setOutcome(null);
      }, 800);
    }
  }, [chosenTone, exchange]);

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
            Topic: {topic} | Mood: {mood} {forcedTone && <span className="text-pink-500">(Wildcard: must select {forcedTone})</span>}
            {hardcoreMode && <span className="ml-2 text-orange-500">[Hardcore Mode]</span>}
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <div className="p-4 border rounded-md min-h-[100px] bg-background/50">
            {history.length === 0 ? (
              <p className="italic text-muted-foreground">{npc.name} looks at you expectantly.</p>
            ) : (
              <ul className="text-sm">
                {history.map((h, i) => (
                  <li key={i}>Exchange {i+1}: <b>{h.tone}</b> → <span className="text-primary font-semibold">{h.reaction}</span> <span className="text-xs text-muted-foreground">({h.outcome})</span></li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-foreground">Your Tones:</h3>
            <div className="flex flex-wrap gap-2">
              {tones.map(tone => (
                <Button key={tone} variant="outline" onClick={() => handleToneSelection(tone)}
                  disabled={Boolean(!isToneAvailable(tone, npc) || chosenTone || !canExchange(exchange) || (forcedTone && tone !== forcedTone))}
                  className={!isToneAvailable(tone, npc) || (forcedTone && tone !== forcedTone) ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {tone}
                </Button>
              ))}
            </div>
          </div>
          <div className="p-4 border rounded-md bg-background/50">
            <h4 className="font-semibold text-foreground">NPC Reaction:</h4>
            <p className="text-sm text-muted-foreground">
              {reaction ? reaction + (outcome ? ` (${outcome})` : '') : 'Awaiting your response... (Reaction will appear here)'}
            </p>
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
