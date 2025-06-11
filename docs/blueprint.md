# **App Name**: Interactive Saga

## Core Features:

- NPC & Faction Management: Create, Read, Update, and Delete NPCs and Factions. Manage core attributes like Relationship Stage, Attitude Level, AR, Conditions, and Quest Progress. Implement an in-place expandable list for entities.
- "Keeping Contact!" Automation: Automate the 'Keeping Contact!' system with action buttons for each entity. Automate dice rolls and state changes for actions like Approves/Disapproves That!, Update Relationships, Create/Break Bond, Start/End Romance. Use stateful UI to disable actions based on preconditions. Implement a global 'Update All Relationships' button.
- "Let's Talk!" Dialogue Simulation: Provide a dedicated Dialogue Interface that appears when a 'Start Dialogue' action is triggered. Automate table lookups for Topic and Mood. Generate a virtual tone deck, including conditional and Wildcard Tones. Calculate and display NPC reactions by performing the Reaction Roll, applying mood effects, and displaying the final Reaction. Disable restricted tones in the UI.
- Player Customization & Game Modes: Provide a 'Settings' section for player customization. Allow Wildcard Tone selection and add it to the dialogue deck. Include a toggle to enable 'Hardcore Mode,' restricting dialogues to the initial three tones.
- NPC Backstory Inspiration: Include an 'Inspire Backstory' button within the NPC creation/edit view. When clicked, this tool will perform a 1d6 roll and present the corresponding text snippet from the 'FIRST IMPRESSIONS & BACKSTORY' table as a creative prompt for the user. The AI's role is strictly as a table-lookup tool, not a text generator.

## Style Guidelines:

- A clean, single-page application design using collapsible sections/accordions for NPC/Faction management and the dialogue interface to keep the UI uncluttered. The layout must be fully responsive and functional on desktop, tablet, and mobile screens.
- Primary: Desaturated Cyan (#77B5FE) — Used for buttons, active states, and key interactive elements.
- Background: Dark Navy Blue (#1A237E) — Provides a comfortable, high-contrast backdrop for text and elements.
- Accent: Deep Violet (#673AB7) — Used for highlights, notifications, or secondary information.
- Text: An off-white or light grey color to ensure high readability against the dark background.
- Headlines & Titles: 'Playfair Display' (serif) — To give the application a classic, elegant feel.
- Body & UI Text: 'PT Sans' (sans-serif) — For modern, crisp, and highly readable interface text.
- Utilize a simple, clear, and minimalist icon set (e.g., Feather Icons or Heroicons).
- Assign icons to represent NPCs, factions, relationship statuses (e.g., a heart for Romance, chains for a Bond, a broken heart for Toxic), and dialogue tones to provide quick visual cues.