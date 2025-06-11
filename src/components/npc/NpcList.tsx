"use client";

import React, { useState } from 'react';
import { useNpcs } from '@/contexts/NpcContext';
import { NpcItem } from './NpcItem';
import type { NPC } from '@/types/core';
import { NpcFormDialog } from './NpcFormDialog';
import { SectionAccordion } from '@/components/common/SectionAccordion';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

// Dialogue related imports (placeholders for now)
import { DialogueInterfaceDialog } from '@/components/dialogue/DialogueInterfaceDialog';
import { useToast } from "@/hooks/use-toast";


export const NpcList: React.FC = () => {
  const { npcs, deleteNpc } = useNpcs();
  const { toast } = useToast();
  const [editingNpc, setEditingNpc] = useState<NPC | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [dialogueTargetNpc, setDialogueTargetNpc] = useState<NPC | null>(null);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);

  const handleAddNew = () => {
    setEditingNpc(null);
    setIsFormOpen(true);
  };

  const handleEdit = (npc: NPC) => {
    setEditingNpc(npc);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    // Confirmation dialog could be added here
    const npcToDelete = npcs.find(npc => npc.id === id);
    if (npcToDelete) {
      deleteNpc(id);
      toast({ title: "NPC Deleted", description: `${npcToDelete.name} has been removed.` });
    }
  };
  
  const handleStartDialogue = (npc: NPC) => {
    setDialogueTargetNpc(npc);
    setIsDialogueOpen(true);
    // Placeholder: In a real app, this would open a dialogue interface
    // toast({ title: "Dialogue Started", description: `Talking with ${npc.name}.` });
  };

  const filteredNpcs = npcs.filter(npc =>
    npc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SectionAccordion
      title="Non-Player Characters"
      icon={<User className="h-6 w-6" />}
      onAddNew={handleAddNew}
      addNewLabel="Add New NPC"
    >
      <Input
        type="text"
        placeholder="Search NPCs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 bg-input text-foreground placeholder:text-muted-foreground"
      />
      {filteredNpcs.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-20rem)] pr-3"> {/* Adjust height as needed */}
          {filteredNpcs.map(npc => (
            <NpcItem
              key={npc.id}
              npc={npc}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStartDialogue={handleStartDialogue}
            />
          ))}
        </ScrollArea>
      ) : (
        <p className="text-muted-foreground text-center py-4">No NPCs found. Add one to get started!</p>
      )}

      <NpcFormDialog
        npc={editingNpc}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
      {dialogueTargetNpc && (
        <DialogueInterfaceDialog
          npc={dialogueTargetNpc}
          open={isDialogueOpen}
          onOpenChange={setIsDialogueOpen}
        />
      )}
    </SectionAccordion>
  );
};
