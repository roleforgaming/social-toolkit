# Solo RPG Companion Test Plan

## 1. KEEPING CONTACT! System Verification

### 1.1. NPC and Faction Core Mechanics
Test cases for verifying core NPC mechanics:

1. **NPC Creation & Initial Attitude**
   - Create new NPC
   - Verify attitude levels correspond to narrative descriptions (-2 to +2)
   - Document actual vs expected descriptions

2. **Approval Rating Changes**
   - Test "approves that" action with friendly (+1) NPC
   - Verify 1d6 roll outcomes:
     - Roll 1-3: +0 AR
     - Roll 4-6: +1 AR
   - Test "disapproves that" action for angering NPC
   - Verify 1d6 roll outcomes:
     - Roll 1-3: -1 AR
     - Roll 4-6: -2 AR 

3. **Condition Acquisition**
   - Test default AR limits (-4/+6)
   - Verify "Pleased" condition triggers at +6 AR
   - Verify "Stressed" condition triggers at -4 AR

4. **Attitude Evolution** 
   - Test "Update Relationships" button
   - Verify rolls and outcomes for Pleased condition:
     - Roll 1-3: Increase attitude, reset condition/AR
     - Roll 4-6: Reset condition/AR only
   
### 1.2. Relationship Stages and Actions

1. **Bonds Testing**
   - Create Bond with neutral (0) NPC
   - Verify 2d6 + attitude roll outcomes:
     - 10+: Success
     - 7-9: Try again later with +2
     - 6-: Fail and -1 AR
   - Confirm AR changes to -5/+5 on success

2. **Romance Testing**
   - Setup NPC with Bond, Pleased condition, +2 attitude
   - Test romance initiation
   - Verify stage changes correctly
   - Test AR doubling with romance (+1 becomes +2)

## 2. LET'S TALK! System Verification 

### 2.1. Dialogue Setup

1. **Initiation Testing**
   - Start dialogue with Very Unfriendly (-2) NPC
   - Verify correct attitude identification
   - Test mood roll (2d10) against table

2. **Tone Deck Validation**
   - Verify Charming tone blocked for Very Unfriendly
   - Verify Flirting allowed for Friendly +1
   
### 2.2. Complex Flow Testing

1. **Advanced Moods**
   - Setup Neutral NPC with Nitpicking mood
   - Use Humorous tone
   - Force 7 on reaction roll
   - Verify chain:
     - Neutral + 7 = Somewhat positive
     - Nitpicking shifts to Somewhat negative
     - Final reaction should be Disagreement

### 2.3. Optional Rules

1. **Wildcard Testing**
   - Set PC Wildcard to Questioning 
   - Test wildcard mechanic
   - Verify manual reaction selection

2. **Hardcore Mode**
   - Enable mode
   - Verify 3 tone initial draw
   - Test restriction to those 3 tones only

## Test Results Template

For each test case:

1. Test ID:
2. Description:
3. Expected Result:
4. Actual Result:
5. Pass/Fail:
6. Notes:

Log all deviations for reporting.
