# Solo RPG Companion: Relationship System Roadmap

## 1. AR Limit Enforcement

- [ ] Enforce AR min/max dynamically based on relationship stage (Default, Bond, Romance).
- [ ] Automatically update AR limits when Bond or Romance status changes.
- [ ] UI feedback for when AR is clamped or an action would exceed limits.
- [ ] Add tests for AR clamping in all relationship actions.

## 2. Romance-Specific AR/Roll Bonuses

- [ ] Implement +1 bonus to all ROLL(2d6) actions involving a romantic partner (per rules).
- [ ] Modify AR changes for romance: +1 AR becomes +2, -2 AR becomes -3, etc. (except +0).
- [ ] Ensure romance bonuses stack correctly with other modifiers (e.g., social skills).
- [ ] Add UI indicators for romance bonuses applied to rolls.
- [ ] Add tests for romance-specific roll and AR logic.

## 3. Advanced Edge Case Automation

- [ ] Automate condition changes for edge cases (e.g., simultaneous Pleased & Stressed, Bond break at -2, etc.).
- [ ] Handle cooldowns and restrictions for repeated actions (e.g., Create Bond, Start Romance retries).
- [ ] Automate AR/condition resets on relationship stage transitions (e.g., Bond → Romance, Romance → Ended).
- [ ] Add support for custom AR limits for special NPCs or quest outcomes.
- [ ] Add comprehensive tests for all edge cases and transitions.

## 4. UI/UX Enhancements

- [ ] Display current AR limits and relationship stage in the NPC UI.
- [ ] Show tooltips or warnings when actions are restricted by cooldowns or prerequisites.
- [ ] Visual feedback for condition changes and relationship transitions.

## 5. Documentation & Testing

- [ ] Update user documentation to explain AR/roll bonuses and edge case handling.
- [ ] Add example scenarios to test plan and automated test suite.

---
This roadmap ensures full compliance with the rulebooks and a robust, user-friendly relationship system.
