import React, { ReactNode } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface SectionAccordionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  onAddNew?: () => void;
  addNewLabel?: string;
  defaultOpen?: boolean;
}

export const SectionAccordion: React.FC<SectionAccordionProps> = ({
  title,
  icon,
  children,
  onAddNew,
  addNewLabel = "Add New",
  defaultOpen = true,
}) => {
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? "item-1" : undefined} className="w-full mb-8">
      <AccordionItem value="item-1" className="border rounded-lg shadow-md bg-card">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center space-x-3">
            {icon && <span className="text-primary">{icon}</span>}
            <h2 className="text-xl font-headline font-semibold">{title}</h2>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pt-0 pb-6">
          {onAddNew && (
            <div className="mb-4">
              <Button onClick={onAddNew} variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                {addNewLabel}
              </Button>
            </div>
          )}
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
