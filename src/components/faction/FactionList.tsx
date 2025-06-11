"use client";

import React from 'react';
import { SectionAccordion } from '@/components/common/SectionAccordion';
import { Users } from 'lucide-react';

export const FactionList: React.FC = () => {
  // Placeholder data and logic
  const factions = [
    { id: '1', name: 'The Silent Watchers', ar: 15, description: 'A secretive group observing events from afar.' },
    { id: '2', name: 'Ironclad Mercenaries', ar: 5, description: 'Sellswords known for their brutal efficiency.' },
  ];

  const handleAddNewFaction = () => {
    // Logic to open faction form dialog
    alert('Add new faction clicked (not implemented)');
  };

  return (
    <SectionAccordion
      title="Factions"
      icon={<Users className="h-6 w-6" />}
      onAddNew={handleAddNewFaction}
      addNewLabel="Add New Faction"
    >
      {factions.length > 0 ? (
        <ul className="space-y-2">
          {factions.map(faction => (
            <li key={faction.id} className="p-3 border rounded-md bg-card/50">
              <h3 className="font-semibold text-foreground">{faction.name}</h3>
              <p className="text-sm text-muted-foreground">AR: {faction.ar} - {faction.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No factions yet.</p>
      )}
      {/* FactionFormDialog would go here */}
    </SectionAccordion>
  );
};
