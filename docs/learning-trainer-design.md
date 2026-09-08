# C++ Coding Trainer — Design

## Understanding
- A standalone, interactive coding trainer for complete C++ programs.
- Its scope follows the supplied syllabus: foundations, classes, constructors, inheritance, and polymorphism.
- It is for beginners who learn by typing, testing, debugging, and progressively solving problems.
- The UI favors short explanations and a coding workspace over long theory.
- Practice, Challenge, and a final mastery test require independent solutions.
- Progress and mistake patterns remain local to the learner's browser.

## Assumptions and constraints
- The initial delivery is a responsive local web app with no account or backend.
- Arbitrary C++ is not executed by a server in this version; feedback is deterministic source analysis and sample-output guidance, explicitly labeled as a learning check.
- A secure native compiler integration is a future infrastructure addition, not silently simulated as a real compiler.

## Decisions
| Decision | Alternatives | Rationale |
| --- | --- | --- |
| React + Vite | Static page, backend platform | Componentized learning surfaces and simple local delivery. |
| Browser local storage | Accounts/database | Privacy and no setup for a single learner. |
| Rule-based learning feedback | Unsafe browser/native execution | Immediate, predictable beginner feedback without pretending to compile code. |
| Data-driven lesson catalogue | Hardcoded per screen | Makes all 20 syllabus topics easy to expand and navigate. |

## Architecture
- `courseData`: syllabus modules, lessons, examples, exercises, and problem ladders.
- `learningEngine`: source checks, hints, result messages, adaptive difficulty, and learner persistence.
- React views: learning map, lesson workspace, practice/challenge, and mastery test.
- CSS: responsive visual system, beginner-readable editor, and clear feedback states.

## Testing
- Unit tests first for adaptive progression and code-feedback behavior.
- A production build validates module wiring and styling imports.
