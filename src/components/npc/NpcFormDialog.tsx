"use client";

import React, { useState, useEffect, useTransition } from 'react';
import type { NPC } from '@/types/core';
import { useNpcs } from '@/contexts/NpcContext';
import { generateNpcBackstory } from '@/ai/flows/generate-npc-backstory';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { RELATIONSHIP_STAGES, ATTITUDE_LEVELS } from '@/lib/constants';

interface NpcFormDialogProps {
  npc?: NPC | null; // NPC to edit, or null/undefined to create new
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NpcFormDialog: React.FC<NpcFormDialogProps> = ({ npc, open, onOpenChange }) => {
  const { addNpc, updateNpc } = useNpcs();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState('');
  const [relationshipStage, setRelationshipStage] = useState<NPC['relationshipStage']>(RELATIONSHIP_STAGES[2]);
  const [attitudeLevel, setAttitudeLevel] = useState<number>(ATTITUDE_LEVELS.default);
  const [ar, setAr] = useState<number>(10);
  const [conditions, setConditions] = useState<string>(''); // Comma-separated
  const [questProgress, setQuestProgress] = useState('');
  const [isBonded, setIsBonded] = useState(false);
  const [isRomance, setIsRomance] = useState(false);
  const [backstorySnippet, setBackstorySnippet] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (npc) {
      setName(npc.name);
      setRelationshipStage(npc.relationshipStage);
      setAttitudeLevel(npc.attitudeLevel);
      setAr(npc.ar);
      setConditions(npc.conditions.join(', '));
      setQuestProgress(npc.questProgress);
      setIsBonded(npc.isBonded);
      setIsRomance(npc.isRomance);
      setBackstorySnippet(npc.backstorySnippet || '');
      setNotes(npc.notes || '');
    } else {
      // Reset form for new NPC
      setName('');
      setRelationshipStage(RELATIONSHIP_STAGES[2]);
      setAttitudeLevel(ATTITUDE_LEVELS.default);
      setAr(10);
      setConditions('');
      setQuestProgress('');
      setIsBonded(false);
      setIsRomance(false);
      setBackstorySnippet('');
      setNotes('');
    }
  }, [npc, open]);

  const handleInspireBackstory = async () => {
    startTransition(async () => {
      try {
        const roll = Math.floor(Math.random() * 6) + 1;
        const result = await generateNpcBackstory({ roll });
        if (result.backstorySnippet) {
          setBackstorySnippet(prev => prev ? `${prev}\n\nInspired: ${result.backstorySnippet}` : `Inspired: ${result.backstorySnippet}`);
          toast({ title: "Backstory Inspired!", description: `Rolled ${roll}: ${result.backstorySnippet}` });
        }
      } catch (error) {
        console.error("Failed to generate backstory:", error);
        toast({ title: "Error", description: "Could not generate backstory snippet.", variant: "destructive" });
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const npcData = {
      name,
      relationshipStage,
      attitudeLevel,
      ar,
      conditions: conditions.split(',').map(c => c.trim()).filter(c => c),
      questProgress,
      isBonded,
      isRomance,
      backstorySnippet,
      notes,
    };

    if (npc) {
      updateNpc(npc.id, npcData);
      toast({ title: "NPC Updated", description: `${name} has been updated.` });
    } else {
      addNpc(npcData);
      toast({ title: "NPC Created", description: `${name} has been added.` });
    }
    onOpenChange(false);
  };
  
  const attitudeOptions = Array.from({length: ATTITUDE_LEVELS.max - ATTITUDE_LEVELS.min + 1}, (_, i) => ATTITUDE_LEVELS.min + i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground">
        <ScrollArea className="max-h-[80vh] p-1">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">{npc ? 'Edit NPC' : 'Create New NPC'}</DialogTitle>
              <DialogDescription>
                {npc ? `Update details for ${npc.name}.` : 'Fill in the details for the new NPC.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-6 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-input text-foreground" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="ar" className="text-foreground">Attitude Rating (AR)</Label>
                  <Input id="ar" type="number" value={ar} onChange={(e) => setAr(parseInt(e.target.value))} required className="bg-input text-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="relationshipStage" className="text-foreground">Relationship Stage</Label>
                  <Select value={relationshipStage} onValueChange={(value) => setRelationshipStage(value as NPC['relationshipStage'])}>
                    <SelectTrigger id="relationshipStage" className="bg-input text-foreground">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIP_STAGES.map(stage => (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attitudeLevel" className="text-foreground">Attitude Level ({ATTITUDE_LEVELS.min} to {ATTITUDE_LEVELS.max})</Label>
                   <Select value={String(attitudeLevel)} onValueChange={(value) => setAttitudeLevel(Number(value))}>
                    <SelectTrigger id="attitudeLevel" className="bg-input text-foreground">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {attitudeOptions.map(level => (
                        <SelectItem key={level} value={String(level)}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="conditions" className="text-foreground">Conditions (comma-separated)</Label>
                <Input id="conditions" value={conditions} onChange={(e) => setConditions(e.target.value)} className="bg-input text-foreground" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="questProgress" className="text-foreground">Quest Progress</Label>
                <Input id="questProgress" value={questProgress} onChange={(e) => setQuestProgress(e.target.value)} className="bg-input text-foreground" />
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox id="isBonded" checked={isBonded} onCheckedChange={(checked) => setIsBonded(!!checked)} />
                  <Label htmlFor="isBonded" className="text-foreground">Bonded</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="isRomance" checked={isRomance} onCheckedChange={(checked) => setIsRomance(!!checked)} />
                  <Label htmlFor="isRomance" className="text-foreground">Romance</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="backstorySnippet" className="text-foreground">Backstory Snippet</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleInspireBackstory} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Inspire
                  </Button>
                </div>
                <Textarea id="backstorySnippet" value={backstorySnippet} onChange={(e) => setBackstorySnippet(e.target.value)} className="bg-input text-foreground min-h-[100px]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-foreground">Notes</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-input text-foreground min-h-[100px]" />
              </div>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {npc ? 'Save Changes' : 'Create NPC'}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
