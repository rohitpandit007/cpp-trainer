# Phase D1 Execution & Animation Architecture Report

**Project**: CodeBloom C++ Trainer  
**Phase**: D1 — Companion & Animation Architecture  
**Status**: Completed & Verified (All Tests Passing)  
**Date**: September 2026  

---

## 1. Executive Summary & Objective

Phase D1 establishes a decoupled, modular, and deterministic companion and animation state engine for the interactive C++ trainer. The animated companion (Pikachu) reacts in real-time to learning milestones, compiler errors, runtime crashes, multi-test results, and concept mastery progressions without coupling visual rendering to core learning or assessment engines.

### Key Principles Enforced in Phase D1:
- **Zero Asset Generation**: Reuses the 12 existing PNG assets located in `assets/companion/`.
- **Strict Decoupling**: Phase C remains the single source of truth for learner mastery and profile persistence. The companion is a pure, reactive subscriber to `src/eventBus.js`.
- **No Keystroke Compilation**: Editor typing updates companion state to `CODING` via a 1.5-second debounce heartbeat without invoking the C++ compiler or running tests.
- **Priority-Driven Preemption**: Prevents animation thrashing through an explicit priority hierarchy (10 to 100) and automatic expiration timers.
- **Accessibility by Design**: Native `reducedMotion` mode scales durations and eliminates jarring flashes.
- **Extensible Character Themes**: Supports pluggable skins (`pikachu`, `robot`, etc.) via `AssetRegistry`.

---

## 2. Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    LEARNER ACTIONS                          │
│  - Typing in editor         - Running single C++ file       │
│  - Requesting hint          - Submitting multi-test assess  │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
        (Keystroke Debounce)            (HTTP Requests)
               │                               │
               ▼                               ▼
       ┌───────────────┐               ┌───────────────┐
       │ notifyTyping()│               │   Server /    │
       │  (No compile) │               │   Assessor    │
       └───────┬───────┘               └───────┬───────┘
               │                               │
               │                      (Assessment Result)
               │                               │
               │                               ▼
               │                       ┌───────────────┐
               │                       │ MasteryEngine │
               │                       └───────┬───────┘
               │                               │
               │ (Emits Learning Events)       │ (Emits Learning Events)
               └───────────────┬───────────────┘
                               ▼
               ┌───────────────────────────────┐
               │        LearningEventBus       │
               │      ('src/eventBus.js')      │
               └───────────────┬───────────────┘
                               │
                      (Pub/Sub Events)
                               │
                               ▼
               ┌───────────────────────────────┐
               │      CompanionController      │
               │  - Priority Evaluation        │
               │  - State Machine Transition   │
               │  - Expiration & Return Timers │
               └───────────────┬───────────────┘
                               │
                      (State Snapshot)
                               │
                               ▼
               ┌───────────────────────────────┐
               │   Presentation Layer / UI     │
               │     (Phase D2 Consumer)       │
               └───────────────────────────────┘
```

---

## 3. Companion State Machine & Priority Matrix

The state machine classifies states into two distinct categories:
1. **Base Contextual States**: Continuous resting states representing the learner's context (`IDLE`, `THINKING`, `CODING`, `ULTIMATE_MASTERY`).
2. **Temporary Reaction States**: Timed emotional reactions to compiler, test, or mastery outcomes that automatically return to the active base state.

### Complete State Specification Table

| State | Category | Priority | Default Duration | Trigger Event / Method | Target PNG Asset |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `IDLE` | Base | 10 | Infinite | Default state; user idle | `default.png` |
| `THINKING` | Base | 15 | Infinite | `CODE_STARTED` or opening hint | `thinking.png` |
| `CODING` | Base | 20 | Debounced (1.5s) | `notifyTyping()` in code editor | `coding.png` |
| `TEST_PASSED` | Temporary | 40 | 2000 ms | Single test pass event | `test passed.png` |
| `WRONG_OUTPUT` | Temporary | 50 | 3000 ms | `TEST_FAILED` (output mismatch) | `wrong answer.png` |
| `COMPILE_ERROR` | Temporary | 60 | 3500 ms | `COMPILE_FAILED` (syntax/compiler) | `compile error.png` |
| `RUNTIME_ERROR` | Temporary | 60 | 3500 ms | `RUNTIME_FAILED` (crash/timeout) | `runtime error.png` |
| `TIRED` | Temporary | 70 | 4000 ms | $\ge 3$ consecutive failures | `repeated failure.png` |
| `CELEBRATION` | Temporary | 80 | 4000 ms | `EXERCISE_COMPLETED` (with hints) | `all tests passed.png` |
| `INDEPENDENT_SUCCESS` | Temporary | 85 | 4500 ms | `EXERCISE_COMPLETED` (0 hints, no reveals) | `solved without hints.png` |
| `MASTERY` | Temporary | 90 | 5000 ms | `CONCEPT_MASTERED` (Level 6 achieved) | `concept mastered.png` |
| `ULTIMATE_MASTERY` | Base / Persistent | 100 | 6000 ms / Infinite | Full syllabus completion | `ultimate mastery.png` |

### Transition & Preemption Rules
1. **Higher Priority Preempts**: An active temporary reaction is interrupted if and only if an incoming event has a strictly higher priority (`newPriority > currentPriority`).
2. **Lower/Equal Priority Ignored**: An incoming temporary reaction with priority $\le$ active reaction is discarded to prevent animation flickering and thrashing.
3. **Base State Tracking**: If the learner changes contextual base state (e.g. starts typing or opens a hint) while a temporary reaction is active, the base state is updated internally. When the temporary state expires, the companion returns to that updated base state.
4. **Consecutive Failure Tracking**: Failures (`COMPILE_FAILED`, `RUNTIME_FAILED`, `TEST_FAILED`) increment an internal counter. When counter reaches 3, `TIRED` is triggered instead of the individual error state. Passing any exercise resets the counter to 0.

---

## 4. Asset Registry Abstraction (`src/companion/assetRegistry.js`)

Decouples semantic states from filesystem paths and server endpoints:

### URL Resolution & Encoding
Filenames with spaces (such as `compile error.png` and `all tests passed.png`) are URL-encoded into clean paths:
```javascript
registry.getAssetUrl('COMPILE_ERROR'); 
// Returns: "/assets/companion/compile%20error.png"
```

### Fallback Guarantee
If an unrecognized state is requested, or an asset fails to resolve:
```javascript
registry.getFilename('UNKNOWN_STATE'); 
// Returns: "default.png"
```

### Custom Character Theme Registration
Alternative character skins can be registered at runtime without modifying companion controller code:
```javascript
import { assetRegistry, COMPANION_STATES } from './src/companion/index.js';

assetRegistry.registerCharacter('robot', 'RoboCoder', {
  [COMPANION_STATES.IDLE]: 'robot-idle.png',
  [COMPANION_STATES.CODING]: 'robot-coding.png',
  [COMPANION_STATES.CELEBRATION]: 'robot-win.png'
}, '/assets/characters/robot');
```

---

## 5. API Reference (`CompanionController`)

### Initialization
```javascript
import { CompanionController, assetRegistry } from './src/companion/index.js';
import { eventBus } from './src/eventBus.js';

const controller = new CompanionController({
  eventBus,              // LearningEventBus instance
  assetRegistry,         // AssetRegistry instance
  reducedMotion: false,  // Boolean accessibility flag
  characterId: 'pikachu' // Active character skin
});
```

### Methods
- `controller.notifyTyping()`: Signals user typing in editor. Transitions to `CODING` and sets a 1500ms debounce timer to restore base state.
- `controller.transitionTo(state, metadata)`: Manually trigger a state transition, subject to priority rules.
- `controller.subscribe(callback)`: Subscribes a UI presentation listener. Immediately dispatches the current state snapshot and returns an unsubscribe function.
- `controller.setReducedMotion(boolean)`: Enables or disables reduced-motion timing (cuts temporary durations by ~60%).
- `controller.setCharacter(characterId)`: Switches active character skin.
- `controller.triggerUltimateMastery()`: Sets companion to ultimate celebration state.
- `controller.reset()`: Resets consecutive failures, timers, and restores `IDLE` state.
- `controller.destroy()`: Unbinds from event bus, clears all timers, and clears subscribers.

### Snapshot Schema Dispatched to Subscribers
```typescript
interface CompanionSnapshot {
  state: string;               // e.g. "COMPILE_ERROR"
  previousState: string | null;// e.g. "CODING"
  baseState: string;           // e.g. "IDLE"
  category: "BASE" | "TEMPORARY";
  priority: number;            // e.g. 60
  assetFilename: string;       // e.g. "compile error.png"
  assetUrl: string;            // e.g. "/assets/companion/compile%20error.png"
  characterId: string;         // e.g. "pikachu"
  reducedMotion: boolean;      // e.g. false
  isTemporary: boolean;        // e.g. true
  consecutiveFailures: number; // e.g. 1
  timestamp: number;           // Unix ms
  reason?: string;             // Optional trigger reason
}
```

---

## 6. Verification & Automated Test Coverage

The new dedicated automated test suite (`tests/companion.test.js`) contains 24 subtests (25 tests total) verifying all functional requirements:

| # | Test Case Description | Result |
| :-: | :--- | :-: |
| 1 | Default initialization starts in `IDLE` base state (priority 10) | PASS |
| 2 | `COMPILE_FAILED` transitions to `COMPILE_ERROR` (priority 60) | PASS |
| 3 | `RUNTIME_FAILED` transitions to `RUNTIME_ERROR` (priority 60) | PASS |
| 4 | `TEST_FAILED` transitions to `WRONG_OUTPUT` (priority 50) | PASS |
| 5 | `TEST_PASSED` transitions to `TEST_PASSED` (priority 40) | PASS |
| 6 | `EXERCISE_COMPLETED` with hints triggers `CELEBRATION` (priority 80) | PASS |
| 7 | `EXERCISE_COMPLETED` without hints triggers `INDEPENDENT_SUCCESS` (priority 85) | PASS |
| 8 | Repeated failure threshold ($\ge 3$) triggers `TIRED` (priority 70) | PASS |
| 9 | Passing an exercise resets consecutive failures to 0 | PASS |
| 10 | `CONCEPT_MASTERED` triggers `MASTERY` (priority 90) | PASS |
| 11 | Temporary state automatically expires back to base state | PASS |
| 12 | Higher priority event preempts lower priority temporary state | PASS |
| 13 | Lower priority event rejected when higher temporary state active | PASS |
| 14 | Equal priority event does not preempt active temporary state | PASS |
| 15 | Base state changes during temporary reaction remembered for return | PASS |
| 16 | `notifyTyping()` transitions to `CODING` and debounces back to `IDLE` | PASS |
| 17 | Reduced motion setting reduces durations and updates snapshot | PASS |
| 18 | Asset registry resolves all 12 verified Pikachu assets accurately | PASS |
| 19 | Asset registry safely falls back to `default.png` for unknown states | PASS |
| 20 | Support for registering and switching to custom character theme | PASS |
| 21 | Asset preloader completes safely in Node / SSR environment | PASS |
| 22 | Rapid event storm stress test ensures deterministic final state | PASS |
| 23 | Malformed event payloads and invalid states handled gracefully | PASS |
| 24 | Subscriber receives synchronous snapshot on subscribe and update | PASS |

---

## 7. Phase D2 Handoff & Visual Presentation Guidelines

Phase D2 will build the visual presentation layer on top of this completed foundation. Phase D2 developers should follow these specific guidelines:

### DO's for Phase D2:
- **Subscribe Directly**: Connect the UI widget by calling `companionController.subscribe(snapshot => renderCompanion(snapshot))`.
- **Use Image Transitions**: Use CSS opacity cross-fades or subtle scale pulses between `snapshot.assetUrl` transitions.
- **Dock Intuitively**: Dock the companion in the lower-right workspace corner or alongside the problem prompt with minimal obstruction to code editing.
- **Honor Reduced Motion**: Query `window.matchMedia('(prefers-reduced-motion: reduce)')` on startup and call `companionController.setReducedMotion(true)`.
- **Support Speech Bubbles**: Display short contextual dialogue cues corresponding to `snapshot.state` (e.g. *"Great job solving this on your own!"* for `INDEPENDENT_SUCCESS`).

### DON'Ts for Phase D2:
- **DO NOT** modify `learningEngine.js`, `masteryEngine.js`, or compiler executor scripts.
- **DO NOT** trigger code compilation on companion interactions.
- **DO NOT** create duplicate event buses or state machines; use `companionController`.
