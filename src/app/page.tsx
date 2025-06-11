"use client";

import { AppHeader } from '@/components/layout/AppHeader';
import { NpcList } from '@/components/npc/NpcList';
import { FactionList } from '@/components/faction/FactionList'; // Placeholder
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

export default function InteractiveSagaPage() {
  const handleUpdateAllRelationships = () => {
    // Placeholder function
    alert("Update All Relationships clicked (not implemented)");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-screen-xl">
        <div className="mb-8 flex justify-end">
          <Button onClick={handleUpdateAllRelationships} variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Zap className="mr-2 h-4 w-4" />
            Update All Relationships
          </Button>
        </div>
        
        <NpcList />
        
        <FactionList />
        
        {/* Dialogue Simulation and other features will be triggered from NPC/Faction items or global actions */}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        Interactive Saga &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
