# Phase F1: Freeze & Release Baseline Report

> **CodeBloom C++ Interactive Trainer**  
> **Status:** Completed & Verified  
> **Release Candidate Version:** `1.0.0-rc1`  
> **Generated:** Automated release manifest committed to `release-manifest.json`

---

## 1. Executive Summary

Subphase F1 has established the immutable baseline for the CodeBloom codebase before executing production hardening. All syllabus modules, lesson exercise slots, catalog exercises, benchmark transfer problems, companion assets, test files, and critical file hashes have been programmatically cataloged and verified.

---

## 2. Frozen Repository Inventories

| Metric / Dimension | Baseline Count | Verification Status |
| :--- | :--- | :--- |
| **Syllabus Modules** | **5 modules** (`Start Writing C++`, `Classes & Objects`, `Object Lifetime`, `Inheritance`, `Polymorphism`) | Verified in `src/courseData.js` |
| **Syllabus Lessons** | **20 lessons** | Verified in `src/courseData.js` |
| **Lesson Exercise Slots** | **60 slots** (mini, medium, hard per lesson) | 100% mapped without default fallbacks |
| **Catalog Exercises** | **75 exercises** (60 slot + 15 combined/mastery) | Catalog frozen; 0 drift |
| **Level 5 Independent Problems** | **18 exercises** | Concept-hidden prompts audited |
| **Benchmark Transfer Battery** | **8 held-out transfer problems** | Paired 1-to-1 across 8 paradigms |
| **Live GCC Reference Solutions** | **66 solutions** (58 curriculum + 8 benchmark) | Verified under host `g++` |
| **Companion Illustrations** | **12 PNG assets** (`assets/companion/*.png`) | All 12 verified on disk |
| **Automated Test Files** | **15 test files** (426+ assertions) | Node.js built-in test runner |
| **Build Syntax Checks** | **28 files** | `node --check` clean via `npm run build` |
| **Audio / Sound Elements** | **0** | Absolute invariant verified |
| **Runtime Debuggers (GDB/LLDB)** | **0** | Absolute invariant verified |

---

## 3. Verified Companion Assets

All 12 illustrations mapped in `src/companion/assetRegistry.js` (`PIKACHU_ASSET_MAP`) exist on disk in `assets/companion/`:
1. `IDLE` -> `default.png` (5.63 MB)
2. `THINKING` -> `thinking.png` (5.55 MB)
3. `CODING` -> `coding.png` (5.62 MB)
4. `TEST_PASSED` -> `test passed.png` (5.88 MB)
5. `WRONG_OUTPUT` -> `wrong answer.png` (5.93 MB)
6. `COMPILE_ERROR` -> `compile error.png` (5.80 MB)
7. `RUNTIME_ERROR` -> `runtime error.png` (5.61 MB)
8. `TIRED` -> `repeated failure.png` (6.04 MB)
9. `CELEBRATION` -> `all tests passed.png` (5.63 MB)
10. `INDEPENDENT_SUCCESS` -> `solved without hints.png` (5.55 MB)
11. `MASTERY` -> `concept mastered.png` (6.14 MB)
12. `ULTIMATE_MASTERY` -> `ultimate mastery.png` (5.87 MB)

---

## 4. Release Tooling Created

- [`scripts/generateReleaseManifest.js`](file:///d:/website%20project/sample%20cpp/scripts/generateReleaseManifest.js): Automated generator calculating SHA-256 digests and inventory counts.
- [`tests/baselineIntegrity.test.js`](file:///d:/website%20project/sample%20cpp/tests/baselineIntegrity.test.js): Automated unit test ensuring manifest integrity.
- `release-manifest.json`: Immutable machine-readable artifact.
- `package.json`: Added `npm run baseline`.

---

## 5. Exit Criteria & Release Gates

- **Gate 01 (Build Syntax):** PASS (28/28 files clean).
- **Gate 02 (Baseline Regression):** PASS (All baseline tests green).
- **Subphase F1 Verdict:** **COMPLETE & CERTIFIED**.
