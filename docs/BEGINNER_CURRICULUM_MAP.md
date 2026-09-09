# CodeBloom Beginner Curriculum Mapping & Pedagogical Progression

## Overview
This document specifies how the Beginner Learning Layer maps to the existing 20-lesson CodeBloom curriculum, its mental model progressions, vocabulary sequencing, worked-to-independent trajectories, and decomposition workflows.

---

## 1. Curriculum Progression Matrix

| Module | Lesson ID | Lesson Title | Mental Model Primary | Core Vocabulary Introduced | Beginner Scaffold Level | Worked → Faded → Independent Concept |
|--------|-----------|--------------|----------------------|----------------------------|-------------------------|--------------------------------------|
| **Module 1: Start Writing C++** |
| 01 | `cpp-basics` | Your first C++ program | **Model A**: Input → Process → Output | `#include`, `iostream`, `main`, `cout`, `return`, `;`, `<<`, `"{}"`, `"()"` | Level 1 (Recognition) & Level 3 (Fill Blank) | First C++ greeting, newline stream |
| 02 | `keywords` | Variables, types & keywords | **Model B**: Store → Change → Use | `int`, `float`, `char`, `cin`, `>>`, `=`, `+`, `-`, `*`, `/`, `%` | Level 3 (Fill Blank) & Level 4 (Complete Line) | Variable declaration, arithmetic sum |
| 03 | `memory` | Dynamic memory: new & delete | **Model B**: Store → Change → Use (Heap Edition) | `new`, `delete`, `*`, `&`, `pointer`, `address` | Level 4 (Complete Line) & Level 5 (Function) | Dynamic heap allocation & release |
| 04 | `functions` | Functions that do one job | **Model E**: Big Problem → Smaller Parts | `function`, `parameter`, `argument`, `return type`, `void` | Level 4 (Complete Line) & Level 5 (Function) | Function definition, return value |
| **Module 2: Classes & Objects** |
| 05 | `classes` | Structures, classes & objects | **Model E**: Big Problem → Smaller Parts | `class`, `object`, `member`, `struct` | Level 5 (Function) & Level 6 (Complete Program) | Class blueprint & instance instantiation |
| 06 | `access` | Access, data & member functions | **Model B** + **Model E** | `public`, `private`, `data member`, `getter`, `setter` | Level 5 (Function) | Encapsulation & access guards |
| 07 | `member-functions` | Inside and outside class functions | **Model E** | `::` (scope resolution), `method` | Level 5 (Function) | Outside member definition syntax |
| 08 | `object-flow` | Arrays and passing objects | **Model B** + **Model E** | `object array`, `pass-by-value`, `pass-by-reference` | Level 6 (Complete Program) | Array iteration with objects |
| 09 | `static` | Static members | **Model B** (Shared Class Memory) | `static`, `class variable` | Level 5 (Function) | Shared object counter |
| 10 | `friends` | Friend functions & classes | **Model E** (Trusted Bridges) | `friend`, `privileged access` | Level 5 (Function) | Non-member friend accessor |
| **Module 3: Object Lifetime** |
| 11 | `constructors` | Constructors | **Model B**: Initialization Guarantee | `constructor`, `default constructor`, `parameterized` | Level 5 (Function) & Level 6 (Complete Program) | Automatic constructor initialization |
| 12 | `destructors` | Destructors | **Model B**: Cleanup Guarantee | `destructor`, `~`, `resource leak` | Level 5 (Function) | Safe memory deletion on teardown |
| **Module 4: Inheritance** |
| 13 | `inheritance` | Inheritance | **Model E**: Shared Taxonomy | `base class`, `derived class`, `protected`, `is-a` | Level 6 (Complete Program) | Derived class feature extension |
| 14 | `abstract` | Virtual bases & abstract classes | **Model E**: Contractual Blueprints | `virtual`, `= 0`, `pure virtual`, `abstract class` | Level 6 (Complete Program) & Level 7 (Guided) | Abstract shape contract |
| 15 | `derived-constructors` | Derived constructors | **Model E**: Layered Construction | `base constructor call`, `initialization list` | Level 6 (Complete Program) | Base-first constructor invocation |
| **Module 5: Polymorphism** |
| 16 | `overloading` | Function & operator overloading | **Model E**: Same Name, Diverse Signatures | `overload`, `signature`, `operator+` | Level 6 (Complete Program) | Custom coordinate / complex addition |
| 17 | `operators` | Unary, binary & friend operators | **Model E**: Natural Mathematical Notation | `unary`, `binary`, `operator-` | Level 6 (Complete Program) | Unary negation & binary operators |
| 18 | `streams` | Overload << and >> | **Model A**: Input & Output Streams | `operator<<`, `operator>>`, `ostream`, `istream` | Level 6 (Complete Program) & Level 7 (Guided) | Stream extraction & insertion |
| 19 | `string-operators` | String manipulation operators | **Model E**: Compound Custom Types | `operator==`, `operator[]`, `buffer` | Level 7 (Guided) | Safe custom string concatenation |
| 20 | `runtime` | Runtime polymorphism | **Model E**: Dynamic Dispatch | `virtual function`, `vtable`, `override`, `polymorphism` | Level 7 (Guided) & Level 8 (Independent) | Base pointer dynamic method dispatch |

---

## 2. Worked → Faded → Guided → Independent → Transfer Trajectory

To illustrate how the 5-stage pedagogical ladder operates without duplicating the frozen exercise catalog (75 exercises + 8 benchmarks), here is the trajectory for **Module 1 (Variables & Arithmetic)**:

```
Step 1: WORKED EXAMPLE
    - Problem: "Given two numbers 12 and 8, calculate and display their sum."
    - Full solution presented with interactive line-by-line annotations:
      #include <iostream>
      using namespace std;
      int main() {
          int a = 12;
          int b = 8;
          int sum = a + b;
          cout << "Sum: " << sum;
          return 0;
      }
    - Beginner annotation: Explains where `int` stores whole numbers, `+` adds them, and `cout` prints the result.

Step 2: FADED EXAMPLE (Level 3 - Fill Blank)
    - Problem: "Complete the code to calculate the product of 6 and 7."
    - Code presented with blanks:
      #include <iostream>
      using namespace std;
      int main() {
          int x = 6;
          int y = 7;
          int product = x ___ y;  // [Fill in operator]
          cout << product;
          return 0;
      }

Step 3: GUIDED PRACTICE (Level 7 - Decomposition + Skeleton)
    - Exercise: `keywords-mini` ("Create int age = 18; and print it.")
    - Decomposition guidance:
      - Input: None (hardcoded)
      - Memory: Variable `age` of type `int`
      - Process: Assignment of 18
      - Output: Send `age` to `cout`

Step 4: INDEPENDENT PRACTICE (Level 8 - Problem Only)
    - Exercise: `keywords-hard` ("Read marks for three subjects and print the total.")
    - Zero hints, full automated test suite with hidden test cases.

Step 5: UNSEEN TRANSFER BENCHMARK (Level 9 - Novel Domain)
    - Benchmark Problem: `benchmark-01` ("Read employee hours and hourly rate, compute weekly pay with overtime.")
    - Verified isolated transfer evaluation.
```

---

## 3. Predict-Before-Run Conceptual Ladders

1. **Literal Output**: `cout << "Hello World";` → Predict exact string.
2. **Variable Lookup**: `int score = 42; cout << score;` → Distinguish variable output from quoted text `"score"`.
3. **Sequential Mutation**: `int count = 5; count = count + 3; cout << count;` → Predict state after re-assignment.
4. **Integer Division**: `int result = 7 / 2; cout << result;` → Learn that integer division truncates decimals in C++ (`3` instead of `3.5`).
5. **Branching Evaluation**: `int temp = 30; if (temp > 25) cout << "Hot"; else cout << "Cold";` → Trace condition branch.
6. **Loop Accumulator**: `int total = 0; for (int i = 1; i <= 3; i++) total += i; cout << total;` → Trace 1+2+3 = 6.
7. **Function Return Value**: `int add(int a, int b) { return a + b; } ... cout << add(4, 5);` → Trace function argument passing and return.

---

## 4. Micro Debugging Scenarios

1. **Bug 1 (Missing Semicolon)**:
   ```cpp
   #include <iostream>
   using namespace std;
   int main() {
       cout << "Welcome to C++"  // Missing semicolon
       return 0;
   }
   ```
   - Target line identified. Learner adds `;` and runs compiler.

2. **Bug 2 (Case & Typo Sensitivity)**:
   ```cpp
   #include <iostream>
   using namespace std;
   int main() {
       Int score = 100; // 'Int' instead of 'int'
       cout << score;
       return 0;
   }
   ```
   - Diagnostic indicates `Int` does not name a type. Learner fixes lowercase `int`.

3. **Bug 3 (Unmatched String Quotation)**:
   ```cpp
   #include <iostream>
   using namespace std;
   int main() {
       cout << "Hello C++; // Missing closing quote
       return 0;
   }
   ```
   - Diagnostic indicates missing terminating `"` character.

4. **Bug 4 (Incorrect Operator Logic)**:
   ```cpp
   #include <iostream>
   using namespace std;
   int main() {
       int a = 20, b = 10;
       int difference = a + b; // Intent was difference, used + instead of -
       cout << difference;
       return 0;
   }
   ```
   - Compiler passes, but output is 30 instead of 10. Learner adjusts operator.

---

## 5. Problem Decomposition Framework (9 Steps)

For any non-trivial programming problem, the learner progresses through:
1. **INPUT**: What does the problem provide? (stdin types, quantities)
2. **OUTPUT**: What must be outputted? (exact strings, numbers, formats)
3. **MEMORY**: What variables are needed to store state?
4. **OPERATIONS**: What arithmetic, assignments, or transformations occur?
5. **DECISIONS**: Does the logic branch on conditions (`if`, `else`)?
6. **REPETITION**: Does any part repeat (`for`, `while`)?
7. **REQUIRED CONCEPTS**: Which C++ language features are required?
8. **PSEUDOCODE**: Plain structured language step-by-step logic.
9. **C++ IMPLEMENTATION**: Real C++ code compiled and tested against test cases.
