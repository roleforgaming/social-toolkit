"use client";

import React from 'react';
import type { NPC } from '@/types/core';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, MessageSquare, Heart, Link2, AlertTriangle, Smile, Meh, Zap, ShieldAlert, Users } from 'lucide-react'; // Added Zap, ShieldAlert
import { RELATIONSHIP_STATUS_ICONS, NPC_PLACEHOLDER_AVATAR } from '@/lib/constants';
import { ATTITUDE_LEVELS } from '@/lib/constants';
import { Progress } from "@/components/ui/progress";


interface NpcItemProps {
  npc: NPC;
  onEdit: (npc: NPC) => void;
  onDelete: (id: string) => void;
  onStartDialogue: (npc: NPC) => void;
  // Add more action handlers as needed
}

const getRelationshipIcon = (npc: NPC) => {
  if (npc.isRomance) return <Heart className="h-4 w-4 text-red-500" />;
  if (npc.isBonded) return <Link2 className="h-4 w-4 text-blue-500" />;
  // Example for toxic based on very low attitude or specific condition
  if (npc.attitudeLevel < -7 || npc.conditions.includes("Betrayed")) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
  
  // General relationship stage icons (simplified)
  if (npc.relationshipStage === "Friendly" || npc.relationshipStage === "Supportive" || npc.relationshipStage === "Ally" || npc.relationshipStage === "Devoted") return <Smile className="h-4 w-4 text-green-500" />;
  if (npc.relationshipStage === "Neutral") return <Meh className="h-4 w-4 text-yellow-500" />;
  if (npc.relationshipStage === "Hostile" || npc.relationshipStage === "Unfriendly") return <ShieldAlert className="h-4 w-4 text-red-600" />; // Using ShieldAlert for hostile
  return null;
};

const AttitudeBar: React.FC<{ attitudeLevel: number }> = ({ attitudeLevel }) => {
  const min = ATTITUDE_LEVELS.min;
  const max = ATTITUDE_LEVELS.max;
  const percentage = ((attitudeLevel - min) / (max - min)) * 100;
  
  let colorClass = "bg-primary"; // Default (cyan)
  if (attitudeLevel < -3) colorClass = "bg-destructive"; // Red for very negative
  else if (attitudeLevel < 0) colorClass = "bg-orange-500"; // Orange for negative
  else if (attitudeLevel > 3) colorClass = "bg-green-500"; // Green for very positive
  else if (attitudeLevel > 0) colorClass = "bg-sky-500"; // Light blue for positive

  return (
    <div className="w-full">
      <Progress value={percentage} className="h-2 [&>div]:bg-transparent" indicatorClassName={colorClass} />
      <p className="text-xs text-muted-foreground text-center mt-1">{attitudeLevel}</p>
    </div>
  );
};


export const NpcItem: React.FC<NpcItemProps> = ({ npc, onEdit, onDelete, onStartDialogue }) => {
  const factionIcon = npc.factionId ? <Users className="h-4 w-4 text-purple-500" title="Faction Member" /> : null;

  return (
    <Card className="mb-4 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start space-x-4 pb-3 pt-4 px-4">
        <Image
          src={npc.avatarUrl || NPC_PLACEHOLDER_AVATAR}
          alt={npc.name}
          width={64}
          height={64}
          className="rounded-full border-2 border-primary"
          data-ai-hint="portrait person"
        />
        <div className="flex-1">
          <CardTitle className="font-headline text-lg text-foreground">{npc.name}</CardTitle>
          <div className="flex items-center space-x-2 mt-1">
            {getRelationshipIcon(npc)}
            {factionIcon}
            <Badge variant="secondary" className="text-xs">{npc.relationshipStage}</Badge>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(npc)} aria-label={`Edit ${npc.name}`}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(npc.id)} aria-label={`Delete ${npc.name}`}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <p className="font-semibold">Attitude: {npc.attitudeLevel}</p>
          <AttitudeBar attitudeLevel={npc.attitudeLevel} />
        </div>
        <p><span className="font-semibold">AR:</span> {npc.ar}</p>
        <p className="md:col-span-2"><span className="font-semibold">Conditions:</span> {npc.conditions.length > 0 ? npc.conditions.join(', ') : 'None'}</p>
        <p className="md:col-span-2"><span className="font-semibold">Quest Progress:</span> {npc.questProgress || 'N/A'}</p>
        {npc.backstorySnippet && <CardDescription className="md:col-span-2 mt-1 text-xs italic">"{npc.backstorySnippet}"</CardDescription>}
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-2 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => onStartDialogue(npc)}>
          <MessageSquare className="mr-2 h-4 w-4" /> Start Dialogue
        </Button>
        <Button variant="outline" size="sm" disabled> {/* Placeholder for Approve/Disapprove */}
          <Zap className="mr-2 h-4 w-4" /> Action
        </Button>
        {/* Add more action buttons here: Create/Break Bond, Start/End Romance */}
      </CardFooter>
    </Card>
  );
};
