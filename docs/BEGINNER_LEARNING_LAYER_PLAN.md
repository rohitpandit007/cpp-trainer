# CodeBloom Beginner Learning Layer: Architectural & Implementation Plan

## Executive Summary
This document establishes the architectural blueprint, integration specifications, and verification strategy for the **CodeBloom Beginner Learning Layer**.
CodeBloom currently excels at structured practice, automated assessment, and objective transfer benchmarking. The Beginner Learning Layer introduces a thin, pedagogically sound layer **above** the existing architecture to take a complete beginner with zero programming experience and progressively develop them into an independent C++ problem solver.

---

## 1. Non-Negotiable Product Invariants

1. **Strictly Zero Sound**: No Web Audio API, `new Audio()`, `<audio>`, speech synthesis, voice systems, or sound configuration.
2. **Strictly Zero Runtime Tracing**: No `gdb`, `lldb`, `ptrace`, binary execution instruction tracers, or dynamic instrumentation. Conceptual visualization remains purely static/analytical.
3. **Existing Architecture is Authoritative**:
   - Reuse existing curriculum (75 catalog exercises, 8 benchmark transfer problems, 20 syllabus lessons, 5 modules).
   - Reuse existing exercise schema and runner pipelines (`/api/execute`, `/api/assess`).
   - Reuse Phase C 6-tier concept mastery engine (`src/masteryEngine.js`).
   - Reuse Phase D4A Gamification & EventBus architecture (`src/eventBus.js`, `src/gamification/`).
   - Reuse Pikachu Companion (`src/companion/`).
   - Reuse E7 Independent Transfer Benchmark (`src/benchmark/`).
   - **No parallel or competing engines**: Do not create a duplicate mastery engine, duplicate exercise catalog, or separate XP system.
4. **Original Syllabus Remains Authoritative**: No unintroduced C++ topics (templates, STL containers, exceptions, lambdas remain excluded).
5. **Coding Ability Remains the Primary Outcome**: Guided coding → Independent coding → Unseen problems. No abstract theory walls.
6. **Existing Learners Must Not Be Regressed**: Existing learner profiles, completed topics, concept masteries, and benchmark scores remain intact.
7. **E7 Independence Must Not Be Weakened**: Scaffolding fades until the learner writes code independently.

---

## 2. System Architecture

```
                       BEGINNER LEARNING LAYER
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
    Mental Models            Beginner Practice      Beginner Support
    - Input→Process→Output   - Predict-Before-Run   - Micro Debugging
    - Store→Change→Use       - Progressive Fading   - Decomposition
    - Condition→Decision     - Recognition/Ordering - Vocabulary Inspector
    - Action→Check→Repeat    - Fill-in/Line/Func    - "Why Am I Writing This?"
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  ↓
                       EXISTING EXERCISE ENGINE
                                  ↓
                        EXISTING ASSESSMENT
                                  ↓
                         EXISTING MASTERY
                                  ↓
                       EXISTING CURRICULUM
                                  ↓
                      INDEPENDENT PROBLEMS
                                  ↓
                          E7 BENCHMARK
```

### Module Organization
All beginner features reside modularly in `src/beginner/`:
- `src/beginner/beginnerData.js`: Curated mental models, vocabulary dictionary, "Why" metadata, predict challenges, debug scenarios, decomposition templates, and worked/faded progressions.
- `src/beginner/onboardingEngine.js`: 12-step interactive Zero-to-C++ onboarding manager.
- `src/beginner/mentalModels.js`: Reusable UI/logic primitives for Models A, B, C, D, and E.
- `src/beginner/vocabularyEngine.js`: Plain-language contextual glossary and term inspector.
- `src/beginner/whyExplanations.js`: Contextual "Why am I writing this?" explanation provider.
- `src/beginner/predictEngine.js`: Predict-Before-Run engine (PREDICT → RUN → COMPARE).
- `src/beginner/debugEngine.js`: Progressive micro-debugging flow.
- `src/beginner/decompositionEngine.js`: 9-step pre-coding decomposition framework.
- `src/beginner/scaffoldingEngine.js`: 8-level progressive assistance & worked→faded→independent ladder.
- `src/beginner/beginnerUI.js`: Dedicated Beginner Hub and contextual workspace integration.
- `src/beginner/index.js`: Clean public barrel export.

---

## 3. Detailed Feature Specifications

### 3.1 Zero-to-C++ Onboarding (Feature #1)
- **Target Audience**: Pure beginners with zero prior coding knowledge.
- **12 Interactive Steps**:
  1. *What programming is*: Giving explicit instructions to a computer.
  2. *What a program is*: A text file with instructions that solve a task.
  3. *What code is*: Human-readable instructions translated for hardware.
  4. *What C++ is*: A blazing-fast, industry-standard language.
  5. *What happens when Run is clicked*: Code is compiled into machine instructions and executed.
  6. *First real C++ program*: Inspecting `#include <iostream>`, `int main()`, `std::cout`, `return 0;`.
  7. *Modifying code*: Changing the greeting to personal text.
  8. *Running modified code*: Real compilation and execution via `/api/execute`.
  9. *Intentional error*: Removing a semicolon to trigger compiler feedback.
  10. *Reading compiler diagnostics*: Interpreting line numbers and messages.
  11. *Fixing the error*: Restoring the semicolon and re-running.
  12. *First tiny challenge*: Outputting two custom lines of text.
- **Routing**: Automatically recommended on clean profile boot (`completed.length === 0`). Existing learners with progress bypass it, with an option to revisit at any time.

### 3.2 Programming Mental Models (Feature #2)
- **Model A (Input → Process → Output)**: For program flow and basic I/O.
- **Model B (Store → Change → Use)**: For variables and memory mutation.
- **Model C (Condition → Decision)**: For branching logic (`if` / `else`).
- **Model D (Action → Check → Repeat)**: For loops (`for` / `while`).
- **Model E (Big Problem → Smaller Parts)**: For functions, modules, and decomposition.
- **Primitives**: `MentalModelCard`, `MentalModelDiagram`, `MentalModelExample`, `MentalModelCheck`.

### 3.3 Contextual C++ Vocabulary (Feature #5)
- Contextual definitions for syntax tokens: `int`, `float`, `char`, `bool`, `main`, `cout`, `cin`, `return`, `#include`, `iostream`, `;`, `{}`, `()`, `<<`, `>>`, `=`, `==`, `!=`, `<`, `>`, `<=`, `>=`, `&`, `*`, `::`.
- Progressively unlocks OOP concepts as learners advance: `class`, `object`, `constructor`, `destructor`, `private`, `public`, `reference`, `pointer`, `virtual`, `inheritance`.
- Plain-English definitions with zero technical jargon.

### 3.4 "Why Am I Writing This?" (Feature #6)
- Reusable explanation cards answering:
  1. What is this?
  2. Why do I need it?
  3. What happens if I remove or change it?
- Attached to critical boilerplate elements (`#include <iostream>`, `int main()`, `return 0;`, `using namespace std;`).

### 3.5 Predict-Before-Run (Feature #3)
- Practice mode: Predict output before execution.
- Progression: Literal output → Variables → Assignment → Arithmetic → Conditions → Loops → Functions.
- Pipeline: User selects/enters prediction → Real execution runs → Feedback compares predicted vs actual stdout.
- Emits `PREDICTION_SUBMITTED`, `PREDICTION_CORRECT`, `PREDICTION_INCORRECT`.
- **Mastery Isolation**: Awards small gamification XP (+15 XP) without inflating Phase C coding mastery.

### 3.6 Micro Debugging (Feature #4)
- Structured debugging ladder: Broken code → Inspect → Hypothesize → Fix → Run → Verify.
- Progression: Missing semicolon → Syntax typo → Arithmetic operator mistake → Condition mistake → Logic bug.
- Scaffolding levels: Identify broken line → Choose hypothesis → Fix character/token → Fix line → Independent repair.

### 3.7 Problem Decomposition Trainer (Feature #7)
- 9-step pre-coding template:
  1. Input
  2. Output
  3. Information to remember
  4. Operations / Steps
  5. Decisions
  6. Repetition
  7. Required Concepts
  8. Pseudocode
  9. Code
- Fades progressively as learner demonstrates competence.

### 3.8 Progressive Scaffolding & Worked → Faded → Independent (Features #8 & #10)
- 8-level assistance hierarchy:
  - Level 1: Recognition (Pick correct line/block)
  - Level 2: Ordering (Arrange scrambled lines)
  - Level 3: Fill-in-the-blank (Fill missing keyword or expression)
  - Level 4: Complete Line (Write missing line)
  - Level 5: Complete Function (Write function body)
  - Level 6: Complete Program (Complete body with skeleton provided)
  - Level 7: Guided Problem (Decomposition + pseudocode provided)
  - Level 8: Independent Problem (Problem description only)
  - Level 9: Unseen Transfer Benchmark (Phase E7 battery)
- Pedagogical sequence: Worked Example → Faded Example → Guided Practice → Independent Practice → Transfer.

---

## 4. State & Storage Integration

- Stored in learner profile under `profile.beginner`:
```json
{
  "onboarding": { "completed": false, "currentStep": 0, "skipped": false },
  "mentalModelsViewed": [],
  "predictionsCompleted": 0,
  "predictionsCorrect": 0,
  "debugsCompleted": 0,
  "decompositionsCompleted": 0,
  "scaffoldHistory": {}
}
```
- Schema v3 validation in `src/masteryEngine.js` accepts optional `profile.beginner` seamlessly.
- Migration in `migrateProfile()` guarantees legacy profiles receive a valid default beginner partition without losing any completed lessons or topic wins.

---

## 5. EventBus & Gamification Integration

- New Events in `LEARNING_EVENTS`:
  - `ONBOARDING_STARTED`, `ONBOARDING_STEP_COMPLETED`, `ONBOARDING_COMPLETED`
  - `PREDICTION_SUBMITTED`, `PREDICTION_CORRECT`, `PREDICTION_INCORRECT`
  - `MICRO_DEBUG_COMPLETED`
  - `DECOMPOSITION_COMPLETED`
  - `SCAFFOLD_COMPLETED`
- Pikachu Companion reacts contextually to beginner milestones (idle, thinking during prediction, celebration on onboarding completion, encouraging on mistake).
- Anti-farming limits prevent repeated XP inflation on non-coding interactions.

---

## 6. Testing Strategy

1. **Unit Tests**: `tests/beginnerLayer.test.js` covering:
   - Onboarding flow, step completion, and skip behavior.
   - Mental models rendering and verification checks.
   - Vocabulary resolution and missing term fallbacks.
   - "Why" explanation integrity.
   - Predict-Before-Run execution and event dispatching.
   - Micro debugging fixes and compiler verification.
   - Problem decomposition step transitions and scaffolding fading.
   - Worked → Faded → Independent progression without solution leakage.
   - Profile migration idempotency and persistence.
2. **Workflow Tests**: Verify seamless transition from beginner scaffolding to existing curriculum exercises.
3. **Regression Tests**: All 489 existing unit tests and 15 release gates must pass without error.
