/**
 * Core Data Catalog for the CodeBloom Beginner Learning Layer.
 * Defines declarative metadata for Onboarding, Mental Models, Contextual Vocabulary,
 * "Why" Explanations, Predict Challenges, Micro Debugs, and Problem Decomposition.
 */

// ============================================================================
// 1. ZERO-TO-C++ ONBOARDING (12 STEPS)
// ============================================================================
export const ONBOARDING_STEPS = [
  {
    step: 1,
    id: 'what-is-programming',
    title: '1. What is Programming?',
    summary: 'A computer cannot read your mind; it follows instructions.',
    content: `A **computer** is extremely fast, but it is also completely literal. It only does exactly what you tell it to do.

**Programming** is simply writing a list of clear, unambiguous instructions that a computer can follow to solve a problem or build something new.

Think of it like a recipe for baking bread:
1. Measure the flour.
2. Add water and yeast.
3. Mix and bake.

If you skip a step, the bread fails. Programming works the same way!`,
    actionPrompt: 'Read the explanation above, then click "Continue" to discover what a program looks like.'
  },
  {
    step: 2,
    id: 'what-is-a-program',
    title: '2. What is a Program?',
    summary: 'A program is a text document with instructions.',
    content: `A **program** is just a plain text file saved on your computer (like \`main.cpp\`).

Inside that file, every line gives the computer a task:
- Read a number
- Add two values together
- Display a word on the screen

When the program runs, the computer executes your instructions in order, from top to bottom, one step at a time.`,
    actionPrompt: 'Click "Continue" to learn how humans talk to computers.'
  },
  {
    step: 3,
    id: 'what-is-code',
    title: '3. What is Code?',
    summary: 'Code is human-readable text that gets translated for hardware.',
    content: `Computers only operate with electrical signals (1s and 0s). Trying to write billions of 1s and 0s by hand would take forever.

**Code** is a language designed for humans to write easily, which a special tool called a **compiler** automatically translates into machine instructions.

When you write:
\`\`\`cpp
cout << "Hello!";
\`\`\`
You are saying: *"Please display the word Hello! on the screen."*`,
    actionPrompt: 'Click "Continue" to see why we chose C++.'
  },
  {
    step: 4,
    id: 'what-is-cpp',
    title: '4. What is C++?',
    summary: 'C++ is one of the fastest, most capable languages ever built.',
    content: `**C++** was created in 1979 by Bjarne Stroustrup. It gives you maximum control over the computer's memory and processor.

Because it is so incredibly fast and efficient, C++ powers:
- 🎮 Triple-A video games (Unreal Engine)
- 🚀 Spaceflight guidance systems (NASA & SpaceX)
- 🌐 Web browsers (Google Chrome engine)
- 🚗 Self-driving cars and robotics

By learning C++, you will understand how computers truly operate under the hood.`,
    actionPrompt: 'Click "Continue" to learn what happens behind the scenes when you press Run.'
  },
  {
    step: 5,
    id: 'what-happens-on-run',
    title: '5. What Happens When You Press "Run"?',
    summary: 'Two steps: Compilation, then Execution.',
    content: `When you click **▷ Run Code**:
1. **Compilation**: The C++ compiler reads your text. It checks every rule and punctuation mark. If there are no mistakes, it converts your C++ text into an executable binary program.
2. **Execution**: The computer loads your program into memory and runs your instructions from start to finish.
3. **Output**: Any text your program printed is sent to the output console.

If you made a typo, compilation stops and tells you what went wrong so you can fix it.`,
    actionPrompt: 'Click "Continue" to see your first real C++ program!'
  },
  {
    step: 6,
    id: 'first-real-program',
    title: '6. Your First Real C++ Program',
    summary: 'Every C++ program has a few basic building blocks.',
    content: `Look at the editor below. This is real C++ code:

- \`#include <iostream>\`: Gives our program access to screen output tools.
- \`int main() {\`: The starting line where execution always begins.
- \`std::cout << "Hello, world!";\`: Sends the text to your screen.
- \`return 0;\`: Signals that our program completed successfully with 0 errors.

Click **▷ Run Code** below to compile and execute your very first program!`,
    starterCode: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!";\n    return 0;\n}\n`,
    expectedOutput: 'Hello, world!',
    requiresRun: true,
    actionPrompt: 'Click "▷ Run Code" below to compile and execute your first C++ program.'
  },
  {
    step: 7,
    id: 'changing-code',
    title: '7. Making Your First Change',
    summary: 'Programs are meant to be changed and improved.',
    content: `Great job running the code! Now let's customize it.

Inside the quotation marks \`"Hello, world!"\`, replace the text with:
\`"Hello, CodeBloom!"\`

Notice that the quotation marks \`""\` must stay around the text. In C++, words wrapped in quotes are called **strings**.`,
    starterCode: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!";\n    return 0;\n}\n`,
    targetCodeSnippet: 'Hello, CodeBloom!',
    requiresCodeEdit: true,
    actionPrompt: 'Change the text inside the quotes to "Hello, CodeBloom!"'
  },
  {
    step: 8,
    id: 'running-changed-code',
    title: '8. Running Your Modified Program',
    summary: 'See your changes come to life.',
    content: `Now click **▷ Run Code** to compile your updated program.

Watch the output console: you should see your new greeting printed exactly as you typed it!`,
    starterCode: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, CodeBloom!";\n    return 0;\n}\n`,
    expectedOutput: 'Hello, CodeBloom!',
    requiresRun: true,
    actionPrompt: 'Click "▷ Run Code" to see your new output.'
  },
  {
    step: 9,
    id: 'making-a-mistake',
    title: '9. Making an Intentional Mistake',
    summary: 'Errors are normal in programming. Let\'s see one on purpose.',
    content: `Every programmer makes mistakes every single day! The compiler is your helper, not your enemy.

In C++, almost every instruction must end with a semicolon \`;\`. It tells the compiler: *"This instruction is finished."*

**Your Task**: Delete the semicolon \`;\` at the end of the \`std::cout\` line, then click **▷ Run Code**.`,
    starterCode: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, CodeBloom!";\n    return 0;\n}\n`,
    requiresRun: true,
    expectCompileError: true,
    actionPrompt: 'Delete the semicolon at the end of line 4, then click "▷ Run Code".'
  },
  {
    step: 10,
    id: 'reading-compiler-feedback',
    title: '10. Reading Compiler Feedback',
    summary: 'The compiler tells you the exact line and problem.',
    content: `Look at the red message below! Notice what the compiler said:
\`error: expected ';' before 'return'\`

It even told you the line number!
The compiler is simply saying: *"I was reading your instructions, but before I reached 'return', I expected a semicolon to finish the previous thought."*

Once you learn to read these clues, debugging becomes easy.`,
    requiresInspection: true,
    actionPrompt: 'Inspect the compiler diagnostic below, then click "Continue" to fix the error.'
  },
  {
    step: 11,
    id: 'fixing-the-error',
    title: '11. Fixing the Error',
    summary: 'Put the semicolon back and recompile.',
    content: `Now, add the semicolon \`;\` back to the end of the \`std::cout\` line:
\`\`\`cpp
std::cout << "Hello, CodeBloom!";
\`\`\`

Then click **▷ Run Code** to verify that your program compiles cleanly again!`,
    starterCode: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, CodeBloom!"\n    return 0;\n}\n`,
    expectedOutput: 'Hello, CodeBloom!',
    requiresRun: true,
    actionPrompt: 'Add the semicolon back and click "▷ Run Code".'
  },
  {
    step: 12,
    id: 'first-mini-challenge',
    title: '12. Your First Independent Mini-Challenge',
    summary: 'Write two lines of output on your own.',
    content: `You understand what programming is, how to write code, how to compile, and how to recover from an error.

**Final Onboarding Challenge**:
Write a program that displays two lines of output:
\`\`\`text
I am learning C++!
My journey begins today!
\`\`\`

When you run it and both lines are printed, you will graduate from Onboarding and unlock the full learning path!`,
    starterCode: `#include <iostream>\n\nint main() {\n    // Write your code here to output two lines:\n    \n    return 0;\n}\n`,
    expectedOutput: 'I am learning C++!\nMy journey begins today!',
    expectedLines: ['I am learning C++!', 'My journey begins today!'],
    requiresRun: true,
    actionPrompt: 'Write code to print both lines and click "▷ Run Code".'
  }
];

// ============================================================================
// 2. PROGRAMMING MENTAL MODELS (MODELS A TO E)
// ============================================================================
export const MENTAL_MODELS = [
  {
    id: 'model-a',
    code: 'MODEL_A',
    title: 'Model A: INPUT → PROCESS → OUTPUT',
    tagline: 'The universal flow of all computer programs.',
    concept: 'Program Flow & I/O',
    summary: 'Every program takes some information in, does work on it, and sends information out.',
    steps: [
      { name: 'INPUT', desc: 'Data from keyboard, file, sensor, or hardcoded values', icon: '📥' },
      { name: 'PROCESS', desc: 'Calculations, transformations, comparisons', icon: '⚙️' },
      { name: 'OUTPUT', desc: 'Text printed to screen, saved to file, or returned', icon: '📤' }
    ],
    example: {
      input: '5 and 3',
      process: '5 + 3 = 8',
      output: '8',
      cpp: `int a = 5, b = 3;  // Input\nint sum = a + b;   // Process\ncout << sum;       // Output`
    },
    check: {
      question: 'In the expression "cin >> age; int next = age + 1; cout << next;", what is the PROCESS step?',
      options: ['cin >> age', 'int next = age + 1', 'cout << next', 'return 0'],
      correctIndex: 1,
      explanation: '"int next = age + 1" calculates a new value from the input. That is the processing step!'
    }
  },
  {
    id: 'model-b',
    code: 'MODEL_B',
    title: 'Model B: STORE → CHANGE → USE',
    tagline: 'How computers remember and mutate information.',
    concept: 'Variables & Memory',
    summary: 'Variables are labeled storage boxes in the computer\'s memory. You store a value, change it when needed, and use it later.',
    steps: [
      { name: 'STORE', desc: 'Declare a variable and give it a starting value', icon: '📦' },
      { name: 'CHANGE', desc: 'Update or modify the stored value over time', icon: '🔄' },
      { name: 'USE', desc: 'Read the stored value in calculations or display it', icon: '👁️' }
    ],
    example: {
      store: 'int score = 10;',
      change: 'score = score + 5;  // Now 15',
      use: 'cout << score;         // Displays 15',
      cpp: `int score = 10;        // 1. STORE\nscore = score + 5;     // 2. CHANGE\ncout << "Score: " << score; // 3. USE`
    },
    check: {
      question: 'What happens to the old value inside a variable when you assign a new value to it?',
      options: ['It is saved in a backup list', 'It is replaced by the new value', 'It is added to the new value automatically', 'The program crashes'],
      correctIndex: 1,
      explanation: 'Variables hold exactly one value at a time. Assigning a new value overwrites the old one.'
    }
  },
  {
    id: 'model-c',
    code: 'MODEL_C',
    title: 'Model C: CONDITION → DECISION',
    tagline: 'How computers make choices based on facts.',
    concept: 'Branching & If/Else',
    summary: 'A condition is a question with a Yes/No (true/false) answer. The computer checks the condition and takes the matching path.',
    steps: [
      { name: 'CONDITION', desc: 'Evaluate a test: Is score >= 50? (true or false)', icon: '⚖️' },
      { name: 'DECISION', desc: 'If true, do Path A. If false, do Path B.', icon: '🔀' }
    ],
    example: {
      condition: 'marks >= 40',
      decision: 'true → Print "Pass" | false → Print "Fail"',
      cpp: `if (marks >= 40) {\n    cout << "Pass";\n} else {\n    cout << "Fail";\n}`
    },
    check: {
      question: 'If "marks" is 35, which branch will "if (marks >= 40)" execute?',
      options: ['The "if" branch ("Pass")', 'The "else" branch ("Fail")', 'Both branches', 'Neither branch'],
      correctIndex: 1,
      explanation: 'Since 35 is not >= 40, the condition is false, so the "else" branch runs.'
    }
  },
  {
    id: 'model-d',
    code: 'MODEL_D',
    title: 'Model D: ACTION → CHECK → REPEAT',
    tagline: 'How computers do repetitive tasks without tiring.',
    concept: 'Loops (For & While)',
    summary: 'Instead of copying code 100 times, a loop performs an action, checks if it should continue, and repeats until finished.',
    steps: [
      { name: 'ACTION', desc: 'Execute the instructions inside the loop body', icon: '⚡' },
      { name: 'CHECK', desc: 'Test: Should we keep going? (e.g. i <= 5)', icon: '🔍' },
      { name: 'REPEAT', desc: 'Advance the counter and run the action again', icon: '🔁' }
    ],
    example: {
      action: 'Print number i',
      check: 'Is i <= 3?',
      repeat: 'Add 1 to i and repeat',
      cpp: `for (int i = 1; i <= 3; i++) {\n    cout << i << " ";\n}\n// Output: 1 2 3`
    },
    check: {
      question: 'What stops a loop from running forever?',
      options: ['The computer automatically turns off', 'The loop condition eventually becomes false', 'Semicolons at the end of each line', 'The variable runs out of numbers'],
      correctIndex: 1,
      explanation: 'A loop continues as long as its condition is true. When the condition evaluates to false, the loop terminates!'
    }
  },
  {
    id: 'model-e',
    code: 'MODEL_E',
    title: 'Model E: BIG PROBLEM → SMALLER PARTS',
    tagline: 'How programmers conquer complex challenges.',
    concept: 'Functions & Decomposition',
    summary: 'Nobody builds a car in one giant piece. You build wheels, an engine, and brakes, then connect them. In code, functions break big problems into small, manageable jobs.',
    steps: [
      { name: 'IDENTIFY', desc: 'Break the problem into 2-3 smaller tasks', icon: '🎯' },
      { name: 'SOLVE EACH', desc: 'Write a dedicated function for each specific task', icon: '🧩' },
      { name: 'COMBINE', desc: 'Call the functions together in main()', icon: '🔗' }
    ],
    example: {
      problem: 'Calculate student final grade',
      parts: '1. Calculate average marks → 2. Determine letter grade → 3. Print report',
      cpp: `double calcAvg(int a, int b) { return (a + b) / 2.0; }\nchar getGrade(double avg) { return avg >= 50 ? 'P' : 'F'; }`
    },
    check: {
      question: 'Why do we package code into functions instead of writing everything in main()?',
      options: ['It makes the code harder to read', 'It lets us test and reuse small parts independently', 'C++ forbids writing more than 5 lines in main()', 'Functions make code run 100x slower'],
      correctIndex: 1,
      explanation: 'Functions isolate responsibilities, making programs easier to read, test, and reuse!'
    }
  }
];

// ============================================================================
// 3. CONTEXTUAL C++ VOCABULARY
// ============================================================================
export const VOCABULARY_TERMS = {
  'int': {
    term: 'int',
    category: 'Data Type',
    plainDefinition: 'Whole numbers (positive, negative, or zero) with no decimals.',
    analogy: 'Counting coins in your pocket: 1, 5, -2, but never 3.5.',
    example: 'int score = 100;'
  },
  'float': {
    term: 'float',
    category: 'Data Type',
    plainDefinition: 'Numbers with a decimal point (fractions).',
    analogy: 'Measuring temperature or milk: 98.6°F, 2.5 liters.',
    example: 'float price = 19.99;'
  },
  'char': {
    term: 'char',
    category: 'Data Type',
    plainDefinition: 'A single keyboard character wrapped in single quotes.',
    analogy: 'One letter block: \'A\', \'z\', \'9\', or \'!\'.',
    example: 'char grade = \'A\';'
  },
  'bool': {
    term: 'bool',
    category: 'Data Type',
    plainDefinition: 'A truth value that is either true (1) or false (0).',
    analogy: 'A light switch: strictly on or off.',
    example: 'bool isGameOver = false;'
  },
  'main': {
    term: 'main',
    category: 'Function',
    plainDefinition: 'The special starting function where every C++ program begins execution.',
    analogy: 'The front door of a building: all visitors enter here.',
    example: 'int main() { ... }'
  },
  'cout': {
    term: 'cout',
    category: 'I/O Tool',
    plainDefinition: 'Short for "character output". Sends text and numbers to the screen.',
    analogy: 'A megaphone shouting words to the user.',
    example: 'cout << "Hello";'
  },
  'cin': {
    term: 'cin',
    category: 'I/O Tool',
    plainDefinition: 'Short for "character input". Reads information typed by the user on the keyboard.',
    analogy: 'An open ear listening for user input.',
    example: 'cin >> age;'
  },
  'return': {
    term: 'return',
    category: 'Keyword',
    plainDefinition: 'Exits a function and optionally hands a result back to whoever called it.',
    analogy: 'Returning a signed receipt when a job is done.',
    example: 'return 0;'
  },
  '#include': {
    term: '#include',
    category: 'Preprocessor',
    plainDefinition: 'Tells the compiler to load an external library or header before building.',
    analogy: 'Grabbing a toolbox from the shelf before starting work.',
    example: '#include <iostream>'
  },
  'iostream': {
    term: 'iostream',
    category: 'Library Header',
    plainDefinition: 'Standard C++ library header providing input and output stream tools like cout and cin.',
    analogy: 'The standard postal and speaker system of C++.',
    example: '#include <iostream>'
  },
  ';': {
    term: '; (Semicolon)',
    category: 'Punctuation',
    plainDefinition: 'The end-of-statement mark. Tells the compiler an instruction is complete.',
    analogy: 'A period at the end of an English sentence.',
    example: 'int x = 5;'
  },
  '{}': {
    term: '{} (Curly Braces)',
    category: 'Punctuation',
    plainDefinition: 'Defines a block of code belonging together in a function, loop, or condition.',
    analogy: 'Bookends holding a cluster of books together.',
    example: 'int main() { /* block */ }'
  },
  '()': {
    term: '() (Parentheses)',
    category: 'Punctuation',
    plainDefinition: 'Used for function parameter lists and mathematical precedence.',
    analogy: 'Parentheses in math: (2 + 3) * 4.',
    example: 'if (x > 5)'
  },
  '<<': {
    term: '<< (Stream Insertion)',
    category: 'Operator',
    plainDefinition: 'Pushes data into an output stream (like cout). Notice the arrows point toward cout.',
    analogy: 'An arrow directing words onto the screen: screen << words.',
    example: 'cout << "Hi";'
  },
  '>>': {
    term: '>> (Stream Extraction)',
    category: 'Operator',
    plainDefinition: 'Extracts data from an input stream (like cin) and stores it into a variable.',
    analogy: 'An arrow directing keyboard input into a box: cin >> box.',
    example: 'cin >> age;'
  },
  '=': {
    term: '= (Assignment)',
    category: 'Operator',
    plainDefinition: 'Stores the value on the right into the variable on the left. NOT a comparison!',
    analogy: 'Placing an item into a labeled box.',
    example: 'x = 10;'
  },
  '==': {
    term: '== (Equal To)',
    category: 'Comparison Operator',
    plainDefinition: 'Checks whether two values are equal. Returns true if they match, false otherwise.',
    analogy: 'Asking: "Are these two twins identical?"',
    example: 'if (x == 10)'
  },
  '!=': {
    term: '!= (Not Equal)',
    category: 'Comparison Operator',
    plainDefinition: 'Returns true if two values are different from each other.',
    analogy: 'Asking: "Are these two items different?"',
    example: 'if (x != 0)'
  },
  '<': {
    term: '< (Less Than)',
    category: 'Comparison Operator',
    plainDefinition: 'Checks if the left value is strictly smaller than the right value.',
    analogy: 'Comparing heights.',
    example: 'if (age < 18)'
  },
  '>': {
    term: '> (Greater Than)',
    category: 'Comparison Operator',
    plainDefinition: 'Checks if the left value is strictly larger than the right value.',
    analogy: 'Comparing weights.',
    example: 'if (speed > 60)'
  },
  '<=': {
    term: '<= (Less Than or Equal)',
    category: 'Comparison Operator',
    plainDefinition: 'True if left is smaller than or exactly equal to right.',
    analogy: 'Speed limit enforcement: 65 mph or below is fine.',
    example: 'if (speed <= 65)'
  },
  '>=': {
    term: '>= (Greater Than or Equal)',
    category: 'Comparison Operator',
    plainDefinition: 'True if left is larger than or exactly equal to right.',
    analogy: 'Minimum height requirement for a roller coaster.',
    example: 'if (height >= 120)'
  },
  '&': {
    term: '& (Address-of / Reference)',
    category: 'Operator',
    plainDefinition: 'Gets the memory address of a variable, or creates a reference alias in function parameters.',
    analogy: 'Getting the street address of a house, or a nickname for a friend.',
    example: 'void doubleVal(int &x);'
  },
  '*': {
    term: '* (Pointer / Dereference)',
    category: 'Operator',
    plainDefinition: 'Declares a pointer (a variable that stores a memory address) or accesses the value at that address.',
    analogy: 'A GPS coordinate pointing to a physical location.',
    example: 'int *ptr = &x;'
  },
  '::': {
    term: ':: (Scope Resolution)',
    category: 'Operator',
    plainDefinition: 'Tells C++ which namespace or class a name belongs to.',
    analogy: 'Specifying city and street: "std::cout" means "the cout that lives inside std".',
    example: 'std::cout << 5;'
  },
  'variable': {
    term: 'variable',
    category: 'Concept',
    plainDefinition: 'A named storage location in memory whose value can change during execution.',
    analogy: 'A labeled box holding a single item.',
    example: 'int count = 0;'
  },
  'function': {
    term: 'function',
    category: 'Concept',
    plainDefinition: 'A reusable, self-contained block of instructions that performs one specific job.',
    analogy: 'A kitchen blender: you put ingredients in, press start, and get a smoothie out.',
    example: 'int square(int n) { return n * n; }'
  },
  'parameter': {
    term: 'parameter',
    category: 'Concept',
    plainDefinition: 'The placeholder variable listed in a function\'s declaration that receives input.',
    analogy: 'The input slot on a vending machine.',
    example: 'void greet(string name)'
  },
  'argument': {
    term: 'argument',
    category: 'Concept',
    plainDefinition: 'The actual concrete value you pass into a function when you call it.',
    analogy: 'The coin you physically drop into the vending machine.',
    example: 'greet("Alice");'
  },
  'class': {
    term: 'class',
    category: 'OOP Concept',
    plainDefinition: 'A custom blueprint for creating objects, defining their data and actions.',
    analogy: 'An architectural blueprint for a house.',
    example: 'class Student { ... };'
  },
  'object': {
    term: 'object',
    category: 'OOP Concept',
    plainDefinition: 'A concrete instance created from a class blueprint.',
    analogy: 'The actual physical house built from the blueprint.',
    example: 'Student alice;'
  },
  'constructor': {
    term: 'constructor',
    category: 'OOP Concept',
    plainDefinition: 'A special member function automatically called whenever a new object is created.',
    analogy: 'A factory setup checklist that runs before an item leaves the assembly line.',
    example: 'Student() { roll = 0; }'
  },
  'destructor': {
    term: 'destructor',
    category: 'OOP Concept',
    plainDefinition: 'A special function automatically called when an object is destroyed to clean up resources.',
    analogy: 'Turning off the lights and locking the doors when closing a shop.',
    example: '~Student() { delete ptr; }'
  }
};

// ============================================================================
// 4. "WHY AM I WRITING THIS?" (EXPLANATIONS)
// ============================================================================
export const WHY_EXPLANATIONS = {
  '#include <iostream>': {
    target: '#include <iostream>',
    title: 'Why do I need #include <iostream>?',
    whatIsThis: 'It tells the compiler to load the basic input/output stream definitions into your program.',
    whyDoINeedIt: 'By default, core C++ does not know how to talk to your keyboard or screen. <iostream> provides `std::cout` and `std::cin`.',
    whatHappensIfRemoved: 'The compiler will fail with an error like "\'cout\' was not declared in this scope".'
  },
  'int main()': {
    target: 'int main()',
    title: 'Why do I need int main()?',
    whatIsThis: 'The main function: the official starting gate for all C++ programs.',
    whyDoINeedIt: 'A program might have thousands of lines of code. The operating system needs to know where to begin executing.',
    whatHappensIfRemoved: 'The linker will fail with "undefined reference to \'main\'". The computer will not know where to start.'
  },
  'return 0;': {
    target: 'return 0;',
    title: 'Why do I write return 0; at the end?',
    whatIsThis: 'It sends an exit status code of 0 back to the operating system.',
    whyDoINeedIt: 'In operating systems, an exit code of 0 universally means "Everything succeeded without any errors". Non-zero codes signal failures.',
    whatHappensIfRemoved: 'In modern C++, omitting return 0; from main() will default to 0, but writing it explicitly is best practice and ensures clarity.'
  },
  'using namespace std;': {
    target: 'using namespace std;',
    title: 'Why do people write using namespace std;?',
    whatIsThis: 'It brings all names from the standard library namespace into the current file.',
    whyDoINeedIt: 'Without it, you have to write `std::cout` and `std::cin` every single time. With it, you can just write `cout` and `cin`.',
    whatHappensIfRemoved: 'You must prefix standard tools with `std::`, such as `std::cout`.'
  },
  ';': {
    target: '; (Semicolon)',
    title: 'Why must statements end with a semicolon?',
    whatIsThis: 'A statement terminator punctuation mark.',
    whyDoINeedIt: 'C++ ignores line breaks and whitespace. The semicolon is how the compiler knows one instruction has ended and the next has started.',
    whatHappensIfRemoved: 'The compiler thinks multiple lines are smashed into one gigantic command and halts with a syntax error.'
  }
};

// ============================================================================
// 5. PREDICT-BEFORE-RUN CHALLENGES
// ============================================================================
export const PREDICT_CHALLENGES = [
  {
    id: 'predict-01-literal',
    title: 'Challenge 1: Literal Text Output',
    concept: 'Output Streams',
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "C++ is awesome!";\n    return 0;\n}`,
    question: 'What will this program print to the screen?',
    options: ['"C++ is awesome!" (with quotes)', 'C++ is awesome! (without quotes)', 'cout', 'Nothing'],
    correctIndex: 1,
    expectedOutput: 'C++ is awesome!',
    explanation: 'Quotation marks tell C++ that text is a string literal. When printed via cout, the quotation marks are not displayed.'
  },
  {
    id: 'predict-02-variables',
    title: 'Challenge 2: Variable vs Quoted Word',
    concept: 'Variables',
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int score = 42;\n    cout << score;\n    return 0;\n}`,
    question: 'What will this program print?',
    options: ['score', '42', '"score"', '0'],
    correctIndex: 1,
    expectedOutput: '42',
    explanation: 'Because score is written without quotes, C++ looks up the value stored in the variable score (which is 42).'
  },
  {
    id: 'predict-03-assignment',
    title: 'Challenge 3: Variable Re-assignment',
    concept: 'Mutation',
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 5;\n    x = x + 3;\n    cout << x;\n    return 0;\n}`,
    question: 'What will this program print?',
    options: ['5', '8', '5 + 3', '3'],
    correctIndex: 1,
    expectedOutput: '8',
    explanation: 'x starts at 5. The line "x = x + 3;" computes 5 + 3 = 8 and stores 8 back into x. When printed, x is 8.'
  },
  {
    id: 'predict-04-integer-division',
    title: 'Challenge 4: Integer Division in C++',
    concept: 'Arithmetic',
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 7;\n    int b = 2;\n    cout << a / b;\n    return 0;\n}`,
    question: 'What will this program print?',
    options: ['3.5', '3', '4', '7/2'],
    correctIndex: 1,
    expectedOutput: '3',
    explanation: 'In C++, dividing an integer by an integer always results in an integer! The decimal portion is dropped (truncated), so 7 / 2 = 3.'
  },
  {
    id: 'predict-05-if-else',
    title: 'Challenge 5: Branching Decision',
    concept: 'Conditionals',
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int temp = 18;\n    if (temp >= 20) {\n        cout << "Warm";\n    } else {\n        cout << "Cool";\n    }\n    return 0;\n}`,
    question: 'What will this program print?',
    options: ['Warm', 'Cool', 'WarmCool', 'Nothing'],
    correctIndex: 1,
    expectedOutput: 'Cool',
    explanation: 'Since 18 is not greater than or equal to 20, the condition (temp >= 20) is false. Therefore, the "else" branch executes.'
  },
  {
    id: 'predict-06-loop',
    title: 'Challenge 6: Loop Repetition',
    concept: 'Loops',
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int total = 0;\n    for (int i = 1; i <= 3; i++) {\n        total = total + i;\n    }\n    cout << total;\n    return 0;\n}`,
    question: 'What will this program print?',
    options: ['3', '6', '0', '123'],
    correctIndex: 1,
    expectedOutput: '6',
    explanation: 'The loop runs 3 times: total becomes 0+1=1, then 1+2=3, then 3+3=6. When the loop ends, 6 is printed.'
  },
  {
    id: 'predict-07-function',
    title: 'Challenge 7: Function Return Value',
    concept: 'Functions',
    code: `#include <iostream>\nusing namespace std;\n\nint doubleNum(int n) {\n    return n * 2;\n}\n\nint main() {\n    cout << doubleNum(6);\n    return 0;\n}`,
    question: 'What will this program print?',
    options: ['6', '12', 'doubleNum(6)', '0'],
    correctIndex: 1,
    expectedOutput: '12',
    explanation: 'doubleNum(6) passes 6 to the function parameter n. The function calculates 6 * 2 and returns 12, which is printed.'
  }
];

// ============================================================================
// 6. MICRO DEBUGGING SCENARIOS
// ============================================================================
export const MICRO_DEBUG_CHALLENGES = [
  {
    id: 'debug-01-semicolon',
    title: 'Debug 1: The Missing Semicolon',
    category: 'Syntax Error',
    difficulty: 'Easy',
    problem: 'The program below has a syntax error preventing it from compiling. Locate the issue and fix it.',
    brokenCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Ready to learn"\n    return 0;\n}\n`,
    hint: 'Look at line 5. Every instruction in C++ must end with a specific punctuation mark.',
    fixedSnippet: 'cout << "Ready to learn";',
    expectedOutput: 'Ready to learn',
    scaffoldQuestion: 'What is missing from line 5?',
    scaffoldOptions: ['A semicolon (;)', 'A quotation mark (")', 'A curly brace (})', 'A hashtag (#)'],
    correctScaffoldIndex: 0
  },
  {
    id: 'debug-02-typo-keyword',
    title: 'Debug 2: Case Sensitivity Typo',
    category: 'Syntax Error',
    difficulty: 'Easy',
    problem: 'C++ is strictly case-sensitive. The compiler cannot recognize one of the keywords here.',
    brokenCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    Int score = 100;\n    cout << score;\n    return 0;\n}\n`,
    hint: 'Look at how the integer type is written on line 5. In C++, keywords are lowercase.',
    fixedSnippet: 'int score = 100;',
    expectedOutput: '100',
    scaffoldQuestion: 'Why does the compiler reject "Int score = 100;"?',
    scaffoldOptions: ['C++ keywords must be strictly lowercase (int, not Int)', 'Variables cannot store numbers over 50', 'score is a reserved word', 'Semicolons cannot follow numbers'],
    correctScaffoldIndex: 0
  },
  {
    id: 'debug-03-quote-mismatch',
    title: 'Debug 3: Unmatched Quotation Mark',
    category: 'Syntax Error',
    difficulty: 'Easy',
    problem: 'The string literal on line 5 is open-ended, confusing the compiler.',
    brokenCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to C++;\n    return 0;\n}\n`,
    hint: 'Strings must start AND end with matching double quotation marks `"`',
    fixedSnippet: 'cout << "Welcome to C++";',
    expectedOutput: 'Welcome to C++',
    scaffoldQuestion: 'What is wrong with line 5?',
    scaffoldOptions: ['Missing closing quote before the semicolon', 'cout is spelled wrong', 'return should be above cout', 'Double quotes are not allowed'],
    correctScaffoldIndex: 0
  },
  {
    id: 'debug-04-operator-mismatch',
    title: 'Debug 4: Arithmetic Operator Mistake',
    category: 'Logic Error',
    difficulty: 'Medium',
    problem: 'This code compiles without errors, but produces the wrong answer! It was supposed to calculate the difference between 20 and 5 (15), but it prints 25.',
    brokenCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 20;\n    int b = 5;\n    int diff = a + b;\n    cout << diff;\n    return 0;\n}\n`,
    hint: 'Check line 7: difference means subtraction (-), not addition (+).',
    fixedSnippet: 'int diff = a - b;',
    expectedOutput: '15',
    scaffoldQuestion: 'Why does this program print 25 instead of 15?',
    scaffoldOptions: ['Line 7 uses addition (+) instead of subtraction (-)', 'Variables cannot be subtracted in C++', 'cout only adds numbers', 'a must be smaller than b'],
    correctScaffoldIndex: 0
  },
  {
    id: 'debug-05-condition-inversion',
    title: 'Debug 5: Inverted Condition Logic',
    category: 'Logic Error',
    difficulty: 'Medium',
    problem: 'The program should print "Pass" if marks are 40 or above, and "Fail" otherwise. Currently, a student with 75 marks gets "Fail"!',
    brokenCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int marks = 75;\n    if (marks < 40) {\n        cout << "Pass";\n    } else {\n        cout << "Fail";\n    }\n    return 0;\n}\n`,
    hint: 'Look at the comparison: `marks < 40`. Should that branch lead to "Pass" or "Fail"?',
    fixedSnippet: 'if (marks >= 40)',
    expectedOutput: 'Pass',
    scaffoldQuestion: 'How should the logic on line 6 be corrected?',
    scaffoldOptions: ['Change condition to "marks >= 40", or swap the Pass and Fail messages', 'Change marks to 10', 'Remove the else block entirely', 'Replace if with while'],
    correctScaffoldIndex: 0
  }
];

// ============================================================================
// 7. PROBLEM DECOMPOSITION FRAMEWORK
// ============================================================================
export const DECOMPOSITION_TEMPLATES = [
  {
    id: 'decomp-01-pass-fail',
    problem: 'Read a student\'s marks and print "Pass" if marks are 40 or greater, otherwise print "Fail".',
    steps: {
      input: 'A single integer representing student marks (e.g. 65)',
      output: 'The word "Pass" or "Fail"',
      memory: 'int marks',
      operations: 'Check if marks is >= 40',
      decisions: 'if (marks >= 40) -> Pass, else -> Fail',
      repetition: 'None (happens once)',
      concepts: ['int', 'cin', 'cout', 'if-else'],
      pseudocode: `READ marks\nIF marks >= 40 THEN\n    PRINT "Pass"\nELSE\n    PRINT "Fail"`
    },
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int marks;\n    cin >> marks;\n    if (marks >= 40) {\n        cout << "Pass";\n    } else {\n        cout << "Fail";\n    }\n    return 0;\n}`
  },
  {
    id: 'decomp-02-sum-positive',
    problem: 'Read N numbers and print the sum of only the positive numbers (numbers greater than 0).',
    steps: {
      input: 'First N (count of numbers), followed by N integers',
      output: 'A single integer showing the sum of positive numbers',
      memory: 'int n, int num, int sum = 0',
      operations: 'Loop N times: read num; if num > 0, sum = sum + num',
      decisions: 'if (num > 0)',
      repetition: 'for loop running N times',
      concepts: ['variables', 'loop', 'condition', 'accumulator'],
      pseudocode: `READ n\nSET sum = 0\nFOR i = 1 TO n DO\n    READ num\n    IF num > 0 THEN\n        sum = sum + num\n    END IF\nEND FOR\nPRINT sum`
    },
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    int sum = 0;\n    for (int i = 0; i < n; i++) {\n        int val;\n        cin >> val;\n        if (val > 0) sum += val;\n    }\n    cout << sum;\n    return 0;\n}`
  }
];
