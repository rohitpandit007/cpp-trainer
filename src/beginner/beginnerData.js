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
    whatItMeans: 'Whole numbers (positive, negative, or zero) with no decimal points.',
    whatItDoesHere: 'Allocates memory to hold integer values like scores, counters, or ages.',
    whyNeeded: 'Computers must know how much memory to reserve and what binary format to use for numbers.',
    plainDefinition: 'Whole numbers (positive, negative, or zero) with no decimals.',
    analogy: 'Counting coins in your pocket: 1, 5, -2, but never 3.5.',
    example: 'int score = 100;'
  },
  'double': {
    term: 'double',
    category: 'Data Type',
    whatItMeans: 'Double-precision floating-point numbers that support decimal fractions.',
    whatItDoesHere: 'Stores numbers with decimal points such as averages, percentages, and prices.',
    whyNeeded: 'Integer division truncates decimals; double preserves precision up to ~15 decimal digits.',
    plainDefinition: 'Numbers with a decimal point (double-precision floating point).',
    analogy: 'A precise digital scale measuring 3.14159 grams.',
    example: 'double price = 19.99;'
  },
  'float': {
    term: 'float',
    category: 'Data Type',
    whatItMeans: 'Single-precision floating point numbers with decimal fractions.',
    whatItDoesHere: 'Stores smaller decimal numbers where memory savings matter more than extreme precision.',
    whyNeeded: 'Provides lightweight decimal storage for graphics or memory-limited devices.',
    plainDefinition: 'Numbers with a decimal point (fractions).',
    analogy: 'Measuring temperature or milk: 98.6°F, 2.5 liters.',
    example: 'float price = 19.99f;'
  },
  'char': {
    term: 'char',
    category: 'Data Type',
    whatItMeans: 'A single text character (letter, digit, or symbol) stored as an ASCII byte.',
    whatItDoesHere: 'Holds one individual character enclosed in single quotes like \'A\' or \'#\'.',
    whyNeeded: 'Allows handling single keystrokes, letter grades, and character-by-character processing.',
    plainDefinition: 'A single keyboard character wrapped in single quotes.',
    analogy: 'One letter block: \'A\', \'z\', \'9\', or \'!\'.',
    example: 'char grade = \'A\';'
  },
  'bool': {
    term: 'bool',
    category: 'Data Type',
    whatItMeans: 'A Boolean truth value that can only ever be true (1) or false (0).',
    whatItDoesHere: 'Stores flag states, condition outcomes, and decision results.',
    whyNeeded: 'Provides direct binary logic so if-statements and loops can evaluate branch decisions.',
    plainDefinition: 'A truth value that is either true (1) or false (0).',
    analogy: 'A light switch: strictly on or off.',
    example: 'bool isGameOver = false;'
  },
  'string': {
    term: 'string',
    category: 'Data Type',
    whatItMeans: 'A sequence of characters representing human-readable words or sentences.',
    whatItDoesHere: 'Stores names, messages, prompts, and formatted text wrapped in double quotes.',
    whyNeeded: 'Individual char variables only hold one letter; string manages full sentences dynamically.',
    plainDefinition: 'A sequence of text characters wrapped in double quotes (std::string).',
    analogy: 'A sentence written on a strip of paper.',
    example: 'string name = "Alice";'
  },
  'void': {
    term: 'void',
    category: 'Keyword',
    whatItMeans: 'Represents the absence of a value or type.',
    whatItDoesHere: 'Indicates that a function performs an action but returns nothing back to the caller.',
    whyNeeded: 'Tells the compiler not to expect or require a return statement with a value.',
    plainDefinition: 'A return type indicating that a function produces no output value.',
    analogy: 'Dropping a letter into a mailbox: action is performed, no receipt returned.',
    example: 'void printGreeting() { cout << "Hello!"; }'
  },
  'main': {
    term: 'main',
    category: 'Function',
    whatItMeans: 'The special entry-point function where every C++ program begins execution.',
    whatItDoesHere: 'Contains or orchestrates the first instructions the operating system runs.',
    whyNeeded: 'A project may have thousands of functions; the OS needs an unambiguous starting door.',
    plainDefinition: 'The special starting function where every C++ program begins execution.',
    analogy: 'The front door of a building: all visitors enter here.',
    example: 'int main() {\n    return 0;\n}'
  },
  'cout': {
    term: 'cout',
    category: 'I/O Tool',
    whatItMeans: 'Short for "character output stream". Sends text and numbers to the terminal.',
    whatItDoesHere: 'Displays program results, prompts, and messages on the user\'s screen.',
    whyNeeded: 'Without an output stream, the program executes silently with no visible feedback.',
    plainDefinition: 'Short for "character output". Sends text and numbers to the screen.',
    analogy: 'A megaphone shouting words to the user.',
    example: 'cout << "Hello, World!";'
  },
  'cin': {
    term: 'cin',
    category: 'I/O Tool',
    whatItMeans: 'Short for "character input stream". Reads data typed by the user from keyboard.',
    whatItDoesHere: 'Captures user input from stdin and parses it into specified variables.',
    whyNeeded: 'Allows programs to be interactive and process dynamic user data rather than hardcoded constants.',
    plainDefinition: 'Short for "character input". Reads information typed by the user on the keyboard.',
    analogy: 'An open ear listening for user input.',
    example: 'int age;\ncin >> age;'
  },
  'endl': {
    term: 'endl',
    category: 'I/O Tool',
    whatItMeans: 'End-line manipulator that inserts a newline and flushes the output stream.',
    whatItDoesHere: 'Moves the terminal cursor to the start of the next line after printing.',
    whyNeeded: 'Prevents consecutive print statements from merging into one unbroken horizontal line.',
    plainDefinition: 'Inserts a newline character into the output stream and flushes the buffer.',
    analogy: 'Hitting the Enter key on your keyboard.',
    example: 'cout << "Line 1" << endl;'
  },
  'return': {
    term: 'return',
    category: 'Keyword',
    whatItMeans: 'Exits the current function and optionally passes a value back to the caller.',
    whatItDoesHere: 'Stops execution of the function immediately and returns control to whoever called it.',
    whyNeeded: 'Delivers computed answers back to calling expressions and signals program exit status.',
    plainDefinition: 'Exits a function and optionally hands a result back to whoever called it.',
    analogy: 'Returning a signed receipt when a job is done.',
    example: 'return 0;'
  },
  '#include': {
    term: '#include',
    category: 'Preprocessor',
    whatItMeans: 'A preprocessor directive that pastes the contents of an external header file.',
    whatItDoesHere: 'Loads declarations for standard tools like iostream, vector, or string before compilation.',
    whyNeeded: 'Core C++ is minimal; standard tools live in library headers that must be explicitly loaded.',
    plainDefinition: 'Tells the compiler to load an external library or header before building.',
    analogy: 'Grabbing a toolbox from the shelf before starting work.',
    example: '#include <iostream>'
  },
  'iostream': {
    term: 'iostream',
    category: 'Library Header',
    whatItMeans: 'Standard C++ header providing stream tools for console input and output.',
    whatItDoesHere: 'Declares cin, cout, endl, and the stream insertion/extraction operators.',
    whyNeeded: 'Required whenever a program needs to interact with the console terminal.',
    plainDefinition: 'Standard C++ library header providing input and output stream tools like cout and cin.',
    analogy: 'The standard postal and speaker system of C++.',
    example: '#include <iostream>'
  },
  'using': {
    term: 'using',
    category: 'Keyword',
    whatItMeans: 'Imports symbols or namespaces into the current scope.',
    whatItDoesHere: 'Allows calling library functions without typing their namespace prefix every time.',
    whyNeeded: 'Saves repetitive typing like std::cout by letting you write cout directly.',
    plainDefinition: 'Brings symbols or an entire namespace into the current scope.',
    analogy: 'Saving a speed-dial contact so you do not have to dial the area code every time.',
    example: 'using namespace std;'
  },
  'namespace': {
    term: 'namespace',
    category: 'Keyword',
    whatItMeans: 'A declarative region that groups related code names under an organizing umbrella.',
    whatItDoesHere: 'Prevents name clashes when different libraries define functions with the same name.',
    whyNeeded: 'Without namespaces, two libraries defining a function called "print" would conflict.',
    plainDefinition: 'A named container that groups related functions, classes, and variables.',
    analogy: 'Last names in a school: John Smith vs. John Davis.',
    example: 'namespace Math { int add(int a, int b); }'
  },
  'std': {
    term: 'std',
    category: 'Namespace',
    whatItMeans: 'The Standard Library namespace where all official C++ utilities reside.',
    whatItDoesHere: 'Houses cout, cin, string, vector, endl, and other foundational tools.',
    whyNeeded: 'Protects your custom variable and function names from colliding with C++ standard tools.',
    plainDefinition: 'The namespace of the standard C++ library.',
    analogy: 'The government dictionary of official, reserved words.',
    example: 'std::cout << "Hello";'
  },
  ';': {
    term: '; (Semicolon)',
    category: 'Punctuation',
    whatItMeans: 'The statement terminator in C++.',
    whatItDoesHere: 'Marks the unambiguous end of an instruction or declaration.',
    whyNeeded: 'C++ ignores line breaks and whitespace; the semicolon tells the compiler where one instruction ends.',
    plainDefinition: 'The end-of-statement mark. Tells the compiler an instruction is complete.',
    analogy: 'A period at the end of an English sentence.',
    example: 'int x = 5;'
  },
  '{}': {
    term: '{} (Curly Braces)',
    category: 'Punctuation',
    whatItMeans: 'Defines a compound statement or block scope.',
    whatItDoesHere: 'Groups multiple instructions together into the body of a function, loop, or if-statement.',
    whyNeeded: 'Tells the compiler which statements belong inside a function, loop, or branch.',
    plainDefinition: 'Defines a block of code belonging together in a function, loop, or condition.',
    analogy: 'Bookends holding a cluster of books together.',
    example: 'int main() { /* block */ }'
  },
  '()': {
    term: '() (Parentheses)',
    category: 'Punctuation',
    whatItMeans: 'Encloses function parameters, condition expressions, or controls math precedence.',
    whatItDoesHere: 'Passes arguments to functions and wraps boolean tests in if/while statements.',
    whyNeeded: 'Disambiguates operator order in expressions and bounds function parameter lists.',
    plainDefinition: 'Used for function parameter lists and mathematical precedence.',
    analogy: 'Parentheses in math: (2 + 3) * 4.',
    example: 'if (x > 5)'
  },
  '<<': {
    term: '<< (Stream Insertion)',
    category: 'Operator',
    whatItMeans: 'Stream insertion operator that pushes data into an output stream.',
    whatItDoesHere: 'Directs string literals, numbers, or variables toward cout for printing.',
    whyNeeded: 'Chains multiple values seamlessly in a single output statement.',
    plainDefinition: 'Pushes data into an output stream (like cout). Notice the arrows point toward cout.',
    analogy: 'An arrow directing words onto the screen: cout << words.',
    example: 'cout << "Hi";'
  },
  '>>': {
    term: '>> (Stream Extraction)',
    category: 'Operator',
    whatItMeans: 'Stream extraction operator that pulls data out of an input stream.',
    whatItDoesHere: 'Takes typed input from cin and assigns it into the destination variable.',
    whyNeeded: 'Extracts formatted text from the keyboard buffer into typed variables.',
    plainDefinition: 'Extracts data from an input stream (like cin) and stores it into a variable.',
    analogy: 'An arrow directing keyboard input into a box: cin >> box.',
    example: 'cin >> age;'
  },
  '=': {
    term: '= (Assignment)',
    category: 'Operator',
    whatItMeans: 'Assignment operator: assigns the right-hand value into the left-hand variable.',
    whatItDoesHere: 'Calculates the expression on the right and stores the result in the container on the left.',
    whyNeeded: 'Allows variables to be initialized and mutated during program execution.',
    plainDefinition: 'Stores the value on the right into the variable on the left. NOT a comparison!',
    analogy: 'Placing an item into a labeled box.',
    example: 'x = 10;'
  },
  '==': {
    term: '== (Equal To)',
    category: 'Comparison Operator',
    whatItMeans: 'Equality comparison operator: evaluates whether two expressions are equal.',
    whatItDoesHere: 'Returns boolean true if both sides match, false otherwise.',
    whyNeeded: 'Enables conditional statements to test whether values match without accidentally reassigning them.',
    plainDefinition: 'Checks whether two values are equal. Returns true if they match, false otherwise.',
    analogy: 'Asking: "Are these two twins identical?"',
    example: 'if (x == 10)'
  },
  '!=': {
    term: '!= (Not Equal)',
    category: 'Comparison Operator',
    whatItMeans: 'Inequality comparison operator: evaluates whether two expressions differ.',
    whatItDoesHere: 'Returns true if left and right values are different, false if they are equal.',
    whyNeeded: 'Allows conditions to trigger when a variable deviates from an expected value.',
    plainDefinition: 'Returns true if two values are different from each other.',
    analogy: 'Asking: "Are these two items different?"',
    example: 'if (x != 0)'
  },
  '<': {
    term: '< (Less Than)',
    category: 'Comparison Operator',
    whatItMeans: 'Strictly less than comparison operator.',
    whatItDoesHere: 'Returns true only if the left operand has a smaller value than the right operand.',
    whyNeeded: 'Tests boundary limits in conditions and for-loop continuation tests.',
    plainDefinition: 'Checks if the left value is strictly smaller than the right value.',
    analogy: 'Comparing heights: is Child shorter than Doorway?',
    example: 'if (age < 18)'
  },
  '>': {
    term: '> (Greater Than)',
    category: 'Comparison Operator',
    whatItMeans: 'Strictly greater than comparison operator.',
    whatItDoesHere: 'Returns true only if the left operand has a larger value than the right operand.',
    whyNeeded: 'Tests upper thresholds in conditions and validation checks.',
    plainDefinition: 'Checks if the left value is strictly larger than the right value.',
    analogy: 'Comparing weights.',
    example: 'if (speed > 60)'
  },
  '<=': {
    term: '<= (Less Than or Equal)',
    category: 'Comparison Operator',
    whatItMeans: 'Less than or equal comparison operator.',
    whatItDoesHere: 'Returns true if the left operand is smaller than or exactly equal to the right.',
    whyNeeded: 'Allows inclusive boundary testing without needing separate < and == checks.',
    plainDefinition: 'True if left is smaller than or exactly equal to right.',
    analogy: 'Speed limit enforcement: 65 mph or below is fine.',
    example: 'if (speed <= 65)'
  },
  '>=': {
    term: '>= (Greater Than or Equal)',
    category: 'Comparison Operator',
    whatItMeans: 'Greater than or equal comparison operator.',
    whatItDoesHere: 'Returns true if the left operand is larger than or exactly equal to the right.',
    whyNeeded: 'Allows inclusive qualification testing (e.g. passing grade of 40 or higher).',
    plainDefinition: 'True if left is larger than or exactly equal to right.',
    analogy: 'Minimum height requirement for a roller coaster.',
    example: 'if (height >= 120)'
  },
  '&&': {
    term: '&& (Logical AND)',
    category: 'Logical Operator',
    whatItMeans: 'Combines two conditions; returns true only if BOTH conditions are true.',
    whatItDoesHere: 'Guards an action until all required prerequisites are simultaneously satisfied.',
    whyNeeded: 'Avoids deep nested if-statements when multiple criteria must hold.',
    plainDefinition: 'Logical AND operator: true only when both conditions evaluate to true.',
    analogy: 'A lock requiring two separate keys turned at the same time.',
    example: 'if (age >= 18 && hasID) { ... }'
  },
  '||': {
    term: '|| (Logical OR)',
    category: 'Logical Operator',
    whatItMeans: 'Combines two conditions; returns true if AT LEAST ONE condition is true.',
    whatItDoesHere: 'Triggers a branch if either condition A or condition B is satisfied.',
    whyNeeded: 'Handles alternative valid criteria without duplicating code blocks.',
    plainDefinition: 'Logical OR operator: true if at least one condition evaluates to true.',
    analogy: 'A door that opens with either a keycard OR a passcode.',
    example: 'if (isWeekend || isHoliday) { ... }'
  },
  '!': {
    term: '! (Logical NOT)',
    category: 'Logical Operator',
    whatItMeans: 'Inverts a boolean value: converts true to false, and false to true.',
    whatItDoesHere: 'Flips the truth value of a condition or boolean variable.',
    whyNeeded: 'Allows concise testing for negative conditions (e.g. !isDone).',
    plainDefinition: 'Logical NOT operator: flips true to false and false to true.',
    analogy: 'An inverter switch: turns yes into no.',
    example: 'if (!isFound) { ... }'
  },
  'if': {
    term: 'if',
    category: 'Control Flow',
    whatItMeans: 'Branching keyword that executes a block of code only if a condition is true.',
    whatItDoesHere: 'Evaluates the test in parentheses and runs the following block if true.',
    whyNeeded: 'Allows programs to make dynamic decisions based on data.',
    plainDefinition: 'Conditional statement that executes code when its condition is true.',
    analogy: 'A fork in the road: take Path A if it is raining.',
    example: 'if (score >= 50) {\n    cout << "Pass";\n}'
  },
  'else': {
    term: 'else',
    category: 'Control Flow',
    whatItMeans: 'The alternative branch executed when an if-condition evaluates to false.',
    whatItDoesHere: 'Catches all cases that failed the preceding if or else-if tests.',
    whyNeeded: 'Guarantees an alternative action runs when a condition is not met.',
    plainDefinition: 'Specifies the alternative block to execute when the if condition is false.',
    analogy: 'Plan B: what to do if Plan A fails.',
    example: 'if (x > 0) cout << "Pos"; else cout << "Not Pos";'
  },
  'while': {
    term: 'while',
    category: 'Control Flow',
    whatItMeans: 'A loop that repeats a block of code as long as its condition remains true.',
    whatItDoesHere: 'Checks condition before each iteration; runs body while true; stops when false.',
    whyNeeded: 'Automates repetitive tasks where the number of repetitions is not known in advance.',
    plainDefinition: 'Repeats a block of code as long as a specified condition evaluates to true.',
    analogy: 'Stirring soup while it is still lumpy.',
    example: 'while (count < 5) {\n    count++;\n}'
  },
  'for': {
    term: 'for',
    category: 'Control Flow',
    whatItMeans: 'A compact loop with initialization, condition test, and step update in one header.',
    whatItDoesHere: 'Counts through a range of values and runs the loop body for each step.',
    whyNeeded: 'Provides a clean, readable loop structure when repeating a known number of times.',
    plainDefinition: 'Counter-controlled loop containing initialization, condition, and step in one line.',
    analogy: 'Running laps around a track: start at 1, stop after 5, add 1 each lap.',
    example: 'for (int i = 0; i < 5; i++) {\n    cout << i << " ";\n}'
  },
  '&': {
    term: '& (Address-of / Reference)',
    category: 'Operator',
    whatItMeans: 'Gets the memory address of a variable, or creates a reference alias in parameter lists.',
    whatItDoesHere: 'Passes variables by reference so functions can modify the original caller data without copying.',
    whyNeeded: 'Prevents expensive copying of large data structures and enables direct in-place mutation.',
    plainDefinition: 'Gets the memory address of a variable, or creates a reference alias in function parameters.',
    analogy: 'Getting the street address of a house, or a nickname for a friend.',
    example: 'void doubleVal(int &x);'
  },
  '*': {
    term: '* (Pointer / Dereference)',
    category: 'Operator',
    whatItMeans: 'Declares a pointer variable or dereferences a memory address to access stored data.',
    whatItDoesHere: 'Stores the numeric address of another variable and accesses the value at that address.',
    whyNeeded: 'Enables dynamic memory allocation, efficient polymorphism, and low-level hardware control.',
    plainDefinition: 'Declares a pointer (a variable that stores a memory address) or accesses the value at that address.',
    analogy: 'A GPS coordinate pointing to a physical location.',
    example: 'int *ptr = &x;'
  },
  '::': {
    term: ':: (Scope Resolution)',
    category: 'Operator',
    whatItMeans: 'Scope resolution operator identifying which namespace or class owns a name.',
    whatItDoesHere: 'Disambiguates symbols: std::cout specifies the cout inside namespace std.',
    whyNeeded: 'Prevents name collisions and clarifies the exact location of a function or class member.',
    plainDefinition: 'Tells C++ which namespace or class a name belongs to.',
    analogy: 'Specifying city and street: "std::cout" means "the cout that lives inside std".',
    example: 'std::cout << 5;'
  },
  'variable': {
    term: 'variable',
    category: 'Concept',
    whatItMeans: 'A named memory location with a specific type that holds a changeable value.',
    whatItDoesHere: 'Stores numbers, text, or states that the program needs to read or modify later.',
    whyNeeded: 'Without variables, programs could only compute static constants and could not store user data.',
    plainDefinition: 'A named storage location in memory whose value can change during execution.',
    analogy: 'A labeled box holding a single item.',
    example: 'int count = 0;'
  },
  'function': {
    term: 'function',
    category: 'Concept',
    whatItMeans: 'A reusable, self-contained block of instructions that performs one specific job.',
    whatItDoesHere: 'Accepts input arguments, executes instructions, and optionally returns a result.',
    whyNeeded: 'Prevents duplicate code, isolates responsibilities, and makes programs clean and testable.',
    plainDefinition: 'A reusable, self-contained block of instructions that performs one specific job.',
    analogy: 'A kitchen blender: you put ingredients in, press start, and get a smoothie out.',
    example: 'int square(int n) { return n * n; }'
  },
  'parameter': {
    term: 'parameter',
    category: 'Concept',
    whatItMeans: 'A placeholder variable listed in a function\'s declaration header.',
    whatItDoesHere: 'Receives the data values passed into the function when it is invoked.',
    whyNeeded: 'Allows functions to generalize their logic for any inputs rather than fixed numbers.',
    plainDefinition: 'The placeholder variable listed in a function\'s declaration that receives input.',
    analogy: 'The input slot on a vending machine.',
    example: 'void greet(string name)'
  },
  'argument': {
    term: 'argument',
    category: 'Concept',
    whatItMeans: 'The concrete value or expression passed to a function at the moment of call.',
    whatItDoesHere: 'Fills the function\'s parameters with real data for that specific invocation.',
    whyNeeded: 'Supplies the actual data a function needs to carry out its task.',
    plainDefinition: 'The actual concrete value you pass into a function when you call it.',
    analogy: 'The coin you physically drop into the vending machine.',
    example: 'greet("Alice");'
  },
  'class': {
    term: 'class',
    category: 'OOP Concept',
    whatItMeans: 'A user-defined type that bundles data attributes and member functions together.',
    whatItDoesHere: 'Acts as an architectural blueprint for creating real object instances.',
    whyNeeded: 'Enables Object-Oriented Programming, encapsulating state and behavior in modular units.',
    plainDefinition: 'A custom blueprint for creating objects, defining their data and actions.',
    analogy: 'An architectural blueprint for a house.',
    example: 'class Student { ... };'
  },
  'object': {
    term: 'object',
    category: 'OOP Concept',
    whatItMeans: 'An actual concrete instance of a class instantiated in memory.',
    whatItDoesHere: 'Maintains its own copy of member variables and executes class methods.',
    whyNeeded: 'Brings classes to life so code can model real-world entities (students, accounts, game items).',
    plainDefinition: 'A concrete instance created from a class blueprint.',
    analogy: 'The actual physical house built from the blueprint.',
    example: 'Student alice;'
  },
  'constructor': {
    term: 'constructor',
    category: 'OOP Concept',
    whatItMeans: 'A special member function automatically called whenever a new object is created.',
    whatItDoesHere: 'Initializes the object\'s member variables to valid starting states.',
    whyNeeded: 'Guarantees that an object is never left in an uninitialized or corrupt memory state.',
    plainDefinition: 'A special member function automatically called whenever a new object is created.',
    analogy: 'A factory setup checklist that runs before an item leaves the assembly line.',
    example: 'Student() { roll = 0; }'
  },
  'destructor': {
    term: 'destructor',
    category: 'OOP Concept',
    whatItMeans: 'A special member function automatically called when an object goes out of scope.',
    whatItDoesHere: 'Releases dynamic memory, closes open files, and cleans up external resources.',
    whyNeeded: 'Prevents memory leaks and dangling resources in C++ programs.',
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
    whatIsThis: 'It tells the compiler to load the basic input/output stream declarations into your program.',
    whyDoINeedIt: 'Core C++ does not contain built-in console commands. <iostream> provides the declarations for std::cout, std::cin, and std::endl.',
    whatHappensIfRemoved: 'The compiler halts with an error like "\'cout\' was not declared in this scope" because it has no idea what cout means.'
  },
  'using namespace std;': {
    target: 'using namespace std;',
    title: 'Why do people write using namespace std;?',
    whatIsThis: 'It imports all names from the C++ standard library namespace into your current file.',
    whyDoINeedIt: 'Without it, you have to write std::cout, std::cin, and std::endl every single time. With it, you can just type cout and cin.',
    whatHappensIfRemoved: 'You must prefix standard library tools with std::, such as std::cout << "Hello";.'
  },
  'int main()': {
    target: 'int main()',
    title: 'Why do I need int main()?',
    whatIsThis: 'The main function: the official operating system entry point for every C++ program.',
    whyDoINeedIt: 'A project may contain thousands of lines of code across many files. The operating system needs an agreed-upon entry point where execution begins.',
    whatHappensIfRemoved: 'The linker fails with "undefined reference to \'main\'" and no executable binary can be created.'
  },
  'return 0;': {
    target: 'return 0;',
    title: 'Why do I write return 0; at the end?',
    whatIsThis: 'It passes an exit status code of 0 back to the operating system when main() finishes.',
    whyDoINeedIt: 'In computer operating systems, exit code 0 universally means "Execution completed successfully with zero errors". Non-zero codes signal failures.',
    whatHappensIfRemoved: 'In modern C++, omitting return 0; from main() implicitly returns 0, but writing it explicitly is best practice and documents clean completion.'
  },
  ';': {
    target: '; (Semicolon)',
    title: 'Why must statements end with a semicolon?',
    whatIsThis: 'The mandatory statement-terminator punctuation mark in C++.',
    whyDoINeedIt: 'C++ ignores line breaks and indentation. The semicolon is how the compiler knows one instruction has concluded and the next has begun.',
    whatHappensIfRemoved: 'The compiler thinks multiple consecutive instructions are smashed together into one command and halts with "expected \';\' before ...".'
  },
  '<<': {
    target: '<< (Stream Insertion)',
    title: 'Why do I use << with cout?',
    whatIsThis: 'The stream insertion operator that routes data into an output destination.',
    whyDoINeedIt: 'Think of << as arrows pointing toward cout: text and variables flow leftward into the screen output stream.',
    whatHappensIfRemoved: 'Using commas or wrong operators causes compilation syntax errors like "expected \';\'" or operator type mismatch.'
  },
  '>>': {
    target: '>> (Stream Extraction)',
    title: 'Why do I use >> with cin?',
    whatIsThis: 'The stream extraction operator that pulls input data out of the keyboard stream.',
    whyDoINeedIt: 'Think of >> as arrows pointing into your variable: user keystrokes flow rightward from cin into your storage variable.',
    whatHappensIfRemoved: 'Using << with cin or omitting >> causes compiler errors because data cannot be extracted.'
  },
  'int': {
    target: 'int (Variable Type)',
    title: 'Why do I have to specify variable types like int?',
    whatIsThis: 'A type declaration that tells C++ what kind of data a variable will hold.',
    whyDoINeedIt: 'C++ is a statically-typed language. The compiler must know exactly how many bytes of memory to allocate and which operations are legal.',
    whatHappensIfRemoved: 'The compiler will fail with an error like "\'x\' was not declared in this scope" because variables must always have a type before use.'
  },
  'double': {
    target: 'double (Decimal Type)',
    title: 'Why should I use double instead of int for fractions?',
    whatIsThis: 'A floating-point numeric type that stores numbers with decimal points.',
    whyDoINeedIt: 'Dividing two integers in C++ drops the decimal portion entirely (e.g. 7 / 2 = 3). Using double preserves the fractional value (3.5).',
    whatHappensIfRemoved: 'Your calculations will suffer from integer truncation, producing wrong mathematical results for averages and percentages.'
  },
  'bool': {
    target: 'bool (Boolean Type)',
    title: 'Why do we have a special bool type?',
    whatIsThis: 'A dedicated data type that holds strictly true or false.',
    whyDoINeedIt: 'It makes decision logic crystal clear. Conditions in if-statements and while-loops naturally evaluate to bool.',
    whatHappensIfRemoved: 'You would have to use integer flags (0 and 1), which makes code harder to read, debug, and reason about.'
  },
  'string': {
    target: 'string (Text Type)',
    title: 'Why do I need std::string for words and sentences?',
    whatIsThis: 'A standard container type designed for holding sequences of characters.',
    whyDoINeedIt: 'A char variable can only ever store one single letter block. string handles dynamic words, names, and sentences with ease.',
    whatHappensIfRemoved: 'Attempting to store text inside an int or single char causes type conversion errors and data corruption.'
  },
  'if': {
    target: 'if / else (Conditionals)',
    title: 'Why do programs need if and else branches?',
    whatIsThis: 'Control flow structures that evaluate a condition and choose between execution paths.',
    whyDoINeedIt: 'Without conditionals, a program could only execute the exact same instructions in a straight line, unable to react to different inputs.',
    whatHappensIfRemoved: 'Programs would be incapable of validation, game logic, grading, or making any intelligent choices.'
  },
  'while': {
    target: 'while (Condition Loops)',
    title: 'Why do we use while loops?',
    whatIsThis: 'A repetitive loop that continues running as long as its test condition remains true.',
    whyDoINeedIt: 'When you do not know beforehand how many times an action must repeat (e.g. waiting for valid user input), while is the ideal tool.',
    whatHappensIfRemoved: 'You would have to duplicate code manually, which is error-prone, inflexible, and cannot handle arbitrary repeat counts.'
  },
  'for': {
    target: 'for (Counting Loops)',
    title: 'Why do we use for loops instead of while loops?',
    whatIsThis: 'A loop structure that packs counter initialization, continuation condition, and increment into one line.',
    whyDoINeedIt: 'When repeating an action a known number of times, a for-loop keeps counter logic organized in one spot so you never forget to increment.',
    whatHappensIfRemoved: 'Counter variables easily get forgotten, causing dangerous infinite loops.'
  },
  'functions': {
    target: 'functions (Modular Blocks)',
    title: 'Why do we write separate functions instead of putting everything in main()?',
    whatIsThis: 'Named, self-contained subprograms that execute a specific task when called.',
    whyDoINeedIt: 'Functions allow you to test small parts in isolation, reuse code without copy-pasting, and keep main() clean and readable.',
    whatHappensIfRemoved: 'Your main() function becomes a thousand-line tangled mess that is almost impossible to debug or maintain.'
  },
  'endl': {
    target: 'endl (End Line)',
    title: 'Why do we write << endl or "\\n" at the end of output?',
    whatIsThis: 'A stream manipulator that inserts a line break and flushes the output stream.',
    whyDoINeedIt: 'Without a newline, subsequent cout commands will print on the exact same line, smashing separate messages together.',
    whatHappensIfRemoved: 'Your output will appear as one long horizontal jumble instead of neat, readable lines.'
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
// 6. MICRO DEBUGGING SCENARIOS (ALL 8 BEGINNER ERROR CATEGORIES)
// ============================================================================
export const MICRO_DEBUG_CHALLENGES = [
  {
    id: 'debug-01-semicolon',
    title: 'Debug 1: The Missing Semicolon',
    category: 'missing semicolon',
    difficulty: 'Easy',
    problem: 'The program below has a syntax error preventing it from compiling. Locate the issue, explain why it fails, and fix it.',
    symptom: "error: expected ';' before 'return'",
    brokenCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Ready to learn"\n    return 0;\n}\n`,
    buggyLine: 5,
    lineOptions: [3, 4, 5, 6],
    explainQuestion: 'Why is the compiler rejecting the code around lines 5–6?',
    explainOptions: [
      'Line 5 is missing the terminating semicolon (;) which tells C++ where the instruction ends',
      'Quotation marks cannot be used with cout',
      'main() cannot return 0',
      'cout cannot print strings'
    ],
    correctExplainIndex: 0,
    hints: [
      'Syntax Rule: Every single statement in C++ must conclude with a semicolon (;).',
      'Target Location: Inspect the end of line 5 right after "Ready to learn".',
      'Fix Pattern: Append a semicolon: cout << "Ready to learn";'
    ],
    fixedSnippet: 'cout << "Ready to learn";',
    expectedOutput: 'Ready to learn',
    // Backwards-compatibility aliases
    hint: 'Look at line 5. Every instruction in C++ must end with a specific punctuation mark.',
    scaffoldQuestion: 'What is missing from line 5?',
    scaffoldOptions: ['A semicolon (;)', 'A quotation mark (")', 'A curly brace (})', 'A hashtag (#)'],
    correctScaffoldIndex: 0
  },
  {
    id: 'debug-02-variable-name',
    title: 'Debug 2: Wrong Variable Name',
    category: 'wrong variable name',
    difficulty: 'Easy',
    problem: 'The compiler reports that a variable was not declared in this scope. Inspect the variable names used in declaration vs output.',
    symptom: "error: 'totalScore' was not declared in this scope; did you mean 'score'?",
    brokenCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int score = 95;\n    cout << "Final score: " << totalScore << endl;\n    return 0;\n}\n`,
    buggyLine: 6,
    lineOptions: [4, 5, 6, 7],
    explainQuestion: 'Why does the compiler refuse to compile line 6?',
    explainOptions: [
      'totalScore was never declared; the variable created on line 5 is named score',
      'Variables cannot be printed alongside text in cout',
      'endl is not a valid identifier',
      'score must be a double to be printed'
    ],
    correctExplainIndex: 0,
    hints: [
      'Identifier Rule: C++ variable names are case-sensitive and must match their declaration character-for-character.',
      'Target Location: Line 6 references "totalScore", but line 5 created "score".',
      'Fix Pattern: Replace "totalScore" with "score" in the cout statement.'
    ],
    fixedSnippet: 'cout << "Final score: " << score << endl;',
    expectedOutput: 'Final score: 95',
    hint: 'Look at how the variable was declared on line 5 compared to how it is used on line 6.',
    scaffoldQuestion: 'Why does the compiler reject "totalScore"?',
    scaffoldOptions: ['totalScore was never declared (the variable is named score)', 'Variables cannot be printed', 'endl is not allowed', 'score is reserved'],
    correctScaffoldIndex: 0
  },
  {
    id: 'debug-03-comparison-operator',
    title: 'Debug 3: Wrong Comparison Operator',
    category: 'wrong comparison/operator',
    difficulty: 'Easy',
    problem: 'This code compiles without errors, but produces the wrong output! When count is 10, the program prints "Keep going!" instead of "Goal reached!".',
    symptom: 'Logical Flaw: Even when target is reached (count is 10), the code prints "Keep going!".',
    brokenCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int count = 10;\n    if (count != 10) {\n        cout << "Goal reached!";\n    } else {\n        cout << "Keep going!";\n    }\n    return 0;\n}\n`,
    buggyLine: 6,
    lineOptions: [5, 6, 7, 9],
    explainQuestion: 'Why does the program print "Keep going!" when count is 10?',
    explainOptions: [
      '!= tests for inequality; when count is 10, (count != 10) is false so the else branch runs',
      'if statements cannot compare integer variables',
      'else blocks only run when the condition is true',
      'count was initialized incorrectly'
    ],
    correctExplainIndex: 0,
    hints: [
      'Operator Rule: "==" tests if two values are equal. "!=" tests if they are different.',
      'Target Location: Line 6 checks "count != 10", which is false when count is 10.',
      'Fix Pattern: Replace "!=" with "==" so the true branch prints "Goal reached!".'
    ],
    fixedSnippet: 'if (count == 10) {',
    expectedOutput: 'Goal reached!',
    hint: 'Check the operator on line 6: does != test for equality or inequality?',
    scaffoldQuestion: 'Why does this program print "Keep going!" when count is 10?',
    scaffoldOptions: ['Line 6 uses != (not equal) instead of == (equal to)', 'count cannot be 10', 'cout only prints numbers', 'Curly braces are wrong'],
    correctScaffoldIndex: 0
  },
  {
    id: 'debug-04-if-condition',
    title: 'Debug 4: Inverted If Condition',
    category: 'incorrect if condition',
    difficulty: 'Medium',
    problem: 'The program should print "Pass" if marks are 40 or above, and "Fail" otherwise. Currently, a student with 75 marks gets "Fail"!',
    symptom: 'Logic Error: Input marks 75 produces "Fail", but 75 is a passing score (>= 40).',
    brokenCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int marks = 75;\n    if (marks < 40) {\n        cout << "Pass";\n    } else {\n        cout << "Fail";\n    }\n    return 0;\n}\n`,
    buggyLine: 6,
    lineOptions: [5, 6, 7, 9],
    explainQuestion: 'How should the logic on line 6 be corrected?',
    explainOptions: [
      'Change condition to "marks >= 40", so marks of 40 and above run the "Pass" branch',
      'Change marks to 10',
      'Remove the else block entirely',
      'Replace if with while'
    ],
    correctExplainIndex: 0,
    hints: [
      'Condition Rule: The if branch executes only when its condition is true.',
      'Target Location: Line 6 currently tests "marks < 40" which is false for 75.',
      'Fix Pattern: Change "< 40" to ">= 40" on line 6.'
    ],
    fixedSnippet: 'if (marks >= 40) {',
    expectedOutput: 'Pass',
    hint: 'Look at the comparison: `marks < 40`. Should that branch lead to "Pass" or "Fail"?',
    scaffoldQuestion: 'How should the logic on line 6 be corrected?',
    scaffoldOptions: ['Change condition to "marks >= 40", or swap the Pass and Fail messages', 'Change marks to 10', 'Remove the else block entirely', 'Replace if with while'],
    correctScaffoldIndex: 0
  },
  {
    id: 'debug-05-loop-error',
    title: 'Debug 5: Simple Loop Off-by-One',
    category: 'simple loop error',
    difficulty: 'Medium',
    problem: 'The loop is intended to print numbers 1 through 5 inclusive, but it stops at 4.',
    symptom: 'Output Error: Program prints "1 2 3 4 " instead of the required "1 2 3 4 5 ".',
    brokenCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 1; i < 5; i++) {\n        cout << i << " ";\n    }\n    return 0;\n}\n`,
    buggyLine: 5,
    lineOptions: [4, 5, 6, 8],
    explainQuestion: 'Why does the loop terminate before printing 5?',
    explainOptions: [
      'The condition "i < 5" becomes false when i reaches 5, so the loop body never runs for 5',
      'The counter variable i cannot start at 1',
      'i++ increments by 2',
      'cout cannot print inside a loop'
    ],
    correctExplainIndex: 0,
    hints: [
      'Loop Rule: "<" strictly excludes the limit. "<=" includes the limit.',
      'Target Location: Look at the test condition "i < 5" on line 5.',
      'Fix Pattern: Change "i < 5" to "i <= 5" (or "i < 6").'
    ],
    fixedSnippet: 'for (int i = 1; i <= 5; i++) {',
    expectedOutput: '1 2 3 4 5 ',
    hint: 'Check the condition in the for loop header. Is < inclusive or exclusive?',
    scaffoldQuestion: 'Why does this loop stop at 4?',
    scaffoldOptions: ['Line 5 tests "i < 5" instead of "i <= 5"', 'i cannot be printed', 'The increment is wrong', 'The loop runs backwards'],
    correctScaffoldIndex: 0
  },
  {
    id: 'debug-06-function-argument',
    title: 'Debug 6: Incorrect Function Argument',
    category: 'incorrect function argument',
    difficulty: 'Medium',
    problem: 'Program calculates the area of a rectangle with width 5 and height 10, but prints 25 instead of 50.',
    symptom: 'Output Flaw: Area calculated as 25 instead of 50 (5 * 10).',
    brokenCode: `#include <iostream>\nusing namespace std;\n\nint calcArea(int width, int height) {\n    return width * height;\n}\n\nint main() {\n    int w = 5;\n    int h = 10;\n    int area = calcArea(w, w);\n    cout << "Area: " << area;\n    return 0;\n}\n`,
    buggyLine: 12,
    lineOptions: [9, 10, 11, 12],
    explainQuestion: 'Why does calcArea calculate 25 instead of 50 on line 12?',
    explainOptions: [
      'Line 12 passes w twice (w, w) instead of passing width and height (w, h)',
      'calcArea cannot accept two arguments',
      'w and h must be float types',
      'Functions cannot be called in variable initializations'
    ],
    correctExplainIndex: 0,
    hints: [
      'Argument Rule: Function arguments map positionally: 1st argument -> width, 2nd argument -> height.',
      'Target Location: Inspect the arguments passed to calcArea(w, w) on line 12.',
      'Fix Pattern: Change the second argument from w to h: calcArea(w, h);'
    ],
    fixedSnippet: 'int area = calcArea(w, h);',
    expectedOutput: 'Area: 50',
    hint: 'Look closely at the arguments passed into calcArea on line 12.',
    scaffoldQuestion: 'Why does calcArea produce 25 instead of 50?',
    scaffoldOptions: ['calcArea is passed (w, w) instead of (w, h)', 'w is negative', 'h cannot be 10', 'return is missing'],
    correctScaffoldIndex: 0
  },
  {
    id: 'debug-07-return-value',
    title: 'Debug 7: Incorrect Return Value',
    category: 'incorrect return value',
    difficulty: 'Medium',
    problem: 'The cube function should calculate n * n * n, but cube(3) returns 9 instead of 27.',
    symptom: 'Output Mismatch: cube(3) prints 9 instead of 27.',
    brokenCode: `#include <iostream>\nusing namespace std;\n\nint cube(int n) {\n    return n * n;\n}\n\nint main() {\n    cout << "Cube of 3 is " << cube(3);\n    return 0;\n}\n`,
    buggyLine: 5,
    lineOptions: [4, 5, 8, 9],
    explainQuestion: 'Why does the cube function return 9 instead of 27 when given 3?',
    explainOptions: [
      'Line 5 computes n * n (squaring) rather than n * n * n (cubing)',
      'The function must return a double',
      'cout cannot invoke functions',
      'n is not initialized'
    ],
    correctExplainIndex: 0,
    hints: [
      'Math & Return Rule: Cubing a number means multiplying it by itself three times: n * n * n.',
      'Target Location: Look at the return calculation on line 5.',
      'Fix Pattern: Change "return n * n;" to "return n * n * n;".'
    ],
    fixedSnippet: 'return n * n * n;',
    expectedOutput: 'Cube of 3 is 27',
    hint: 'Check line 5: how many times is n multiplied by itself?',
    scaffoldQuestion: 'Why does cube(3) return 9?',
    scaffoldOptions: ['Line 5 computes n * n (square) instead of n * n * n (cube)', 'cube must return void', '3 is an odd number', 'cout cannot print numbers'],
    correctScaffoldIndex: 0
  },
  {
    id: 'debug-08-output-format',
    title: 'Debug 8: Incorrect Output Formatting',
    category: 'incorrect output',
    difficulty: 'Easy',
    problem: 'The specification requires the output to be "Result: 42", but the code prints "Result:42" with no separating space.',
    symptom: 'Output Mismatch: Actual output was "Result:42" (missing space after colon).',
    brokenCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int answer = 42;\n    cout << "Result:" << answer << endl;\n    return 0;\n}\n`,
    buggyLine: 6,
    lineOptions: [4, 5, 6, 7],
    explainQuestion: 'Why is there no space between "Result:" and "42"?',
    explainOptions: [
      'The string literal "Result:" does not contain a space before the closing quote',
      'cout automatically strips all spaces',
      'answer must be converted to a string to have space',
      'endl removes spaces'
    ],
    correctExplainIndex: 0,
    hints: [
      'Formatting Rule: cout prints string literals verbatim. Spaces must be inside the quotation marks.',
      'Target Location: Inspect the text inside quotes on line 6: "Result:".',
      'Fix Pattern: Add a space after the colon: cout << "Result: " << answer << endl;'
    ],
    fixedSnippet: 'cout << "Result: " << answer << endl;',
    expectedOutput: 'Result: 42',
    hint: 'Inspect the string literal on line 6. Is there a space before the quote ends?',
    scaffoldQuestion: 'Why is the space missing in "Result:42"?',
    scaffoldOptions: ['The string literal lacks a space after the colon: "Result: "', 'cout does not allow spaces', 'answer is too large', 'endl cancels spaces'],
    correctScaffoldIndex: 0
  }
];

// ============================================================================
// 7. PROBLEM DECOMPOSITION FRAMEWORK (REQUIREMENT-VALIDATED TEMPLATES)
// ============================================================================
export const DECOMPOSITION_TEMPLATES = [
  {
    id: 'decomp-01-pass-fail',
    problem: 'Read a student\'s marks and print "Pass" if marks are 40 or greater, otherwise print "Fail".',
    steps: {
      input: 'A single integer representing student marks read from cin (e.g. 65)',
      output: 'The word "Pass" or "Fail" printed to cout',
      memory: 'int marks',
      operations: 'Check if marks is >= 40 using conditional branching',
      decisions: 'if (marks >= 40) -> print "Pass", else -> print "Fail"',
      repetition: 'None (happens once)',
      concepts: ['int', 'cin', 'cout', 'if-else'],
      pseudocode: `READ marks\nIF marks >= 40 THEN\n    PRINT "Pass"\nELSE\n    PRINT "Fail"`
    },
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int marks;\n    cin >> marks;\n    if (marks >= 40) {\n        cout << "Pass";\n    } else {\n        cout << "Fail";\n    }\n    return 0;\n}`,
    requiredInputKeywords: ['integer', 'mark', 'cin', 'number'],
    requiredStateKeywords: ['int', 'marks', 'variable'],
    requiredProcessingKeywords: ['if', 'else', 'check', '>=', 'compare'],
    requiredOutputKeywords: ['cout', 'pass', 'fail', 'print'],
    minPseudocodeSteps: 2
  },
  {
    id: 'decomp-02-sum-positive',
    problem: 'Read N numbers and print the sum of only the positive numbers (numbers strictly greater than 0).',
    steps: {
      input: 'First integer N (count of numbers), followed by N integers read via cin',
      output: 'A single integer showing the accumulated sum of positive numbers printed to cout',
      memory: 'int n, int num, int sum = 0',
      operations: 'Loop N times: read num; if num > 0, sum = sum + num',
      decisions: 'if (num > 0) add to accumulator',
      repetition: 'for loop running N times',
      concepts: ['variables', 'loop', 'condition', 'accumulator'],
      pseudocode: `READ n\nSET sum = 0\nFOR i = 1 TO n DO\n    READ num\n    IF num > 0 THEN\n        sum = sum + num\n    END IF\nEND FOR\nPRINT sum`
    },
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    int sum = 0;\n    for (int i = 0; i < n; i++) {\n        int val;\n        cin >> val;\n        if (val > 0) sum += val;\n    }\n    cout << sum;\n    return 0;\n}`,
    requiredInputKeywords: ['n', 'count', 'integer', 'cin', 'number'],
    requiredStateKeywords: ['int', 'sum', 'n', 'val', 'num', 'variable'],
    requiredProcessingKeywords: ['loop', 'for', 'while', 'if', 'sum', 'add', '> 0', 'positive'],
    requiredOutputKeywords: ['cout', 'sum', 'print', 'output'],
    minPseudocodeSteps: 3
  },
  {
    id: 'decomp-03-temperature-converter',
    problem: 'Read a temperature in Celsius (double) from cin and output the equivalent in Fahrenheit using the formula F = (C * 9.0 / 5.0) + 32.0.',
    steps: {
      input: 'A decimal number (double) representing temperature in Celsius read via cin',
      output: 'The calculated Fahrenheit temperature printed to cout',
      memory: 'double celsius, double fahrenheit',
      operations: 'Calculate fahrenheit = (celsius * 9.0 / 5.0) + 32.0',
      decisions: 'None (direct linear arithmetic)',
      repetition: 'None (single conversion calculation)',
      concepts: ['double', 'cin', 'cout', 'arithmetic formula'],
      pseudocode: `READ celsius\nSET fahrenheit = (celsius * 9.0 / 5.0) + 32.0\nPRINT fahrenheit`
    },
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    double celsius;\n    if (cin >> celsius) {\n        double fahrenheit = (celsius * 9.0 / 5.0) + 32.0;\n        cout << fahrenheit;\n    }\n    return 0;\n}`,
    requiredInputKeywords: ['celsius', 'double', 'temperature', 'cin', 'decimal'],
    requiredStateKeywords: ['double', 'celsius', 'fahrenheit', 'float'],
    requiredProcessingKeywords: ['multiply', 'formula', 'calculate', '9.0', '32', '*', '/'],
    requiredOutputKeywords: ['cout', 'fahrenheit', 'print', 'output'],
    minPseudocodeSteps: 2
  },
  {
    id: 'decomp-04-even-counter',
    problem: 'Given an integer limit, loop from 1 to limit and count how many even numbers exist (using num % 2 == 0), then print the count.',
    steps: {
      input: 'An integer limit read from cin or hardcoded as boundary',
      output: 'The total count of even numbers printed to cout',
      memory: 'int limit, int evenCount = 0',
      operations: 'Loop i from 1 to limit; if i % 2 == 0, increment evenCount by 1',
      decisions: 'if (i % 2 == 0) -> evenCount++',
      repetition: 'for loop counting from 1 to limit',
      concepts: ['for loop', 'modulo operator %', 'if conditional', 'counter variable'],
      pseudocode: `READ limit\nSET count = 0\nFOR i = 1 TO limit DO\n    IF i % 2 == 0 THEN\n        count = count + 1\n    END IF\nEND FOR\nPRINT count`
    },
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int limit = 10;\n    int count = 0;\n    for (int i = 1; i <= limit; i++) {\n        if (i % 2 == 0) count++;\n    }\n    cout << count;\n    return 0;\n}`,
    requiredInputKeywords: ['limit', 'integer', 'number', 'cin'],
    requiredStateKeywords: ['int', 'count', 'limit', 'i', 'variable'],
    requiredProcessingKeywords: ['loop', 'for', 'while', '% 2', 'even', 'count++', 'increment'],
    requiredOutputKeywords: ['cout', 'count', 'print'],
    minPseudocodeSteps: 3
  },
  {
    id: 'decomp-05-max-two',
    problem: 'Create a function named getMax(int a, int b) that returns the larger of two integers, and test it in main().',
    steps: {
      input: 'Two integers a and b passed as arguments to getMax',
      output: 'The larger integer returned by the function and printed in main()',
      memory: 'int a, int b parameters, return value',
      operations: 'Compare a and b using if (a > b)',
      decisions: 'if (a > b) return a; else return b;',
      repetition: 'None',
      concepts: ['function definition', 'parameters', 'return statement', 'if-else'],
      pseudocode: `FUNCTION getMax(a, b)\n    IF a > b THEN\n        RETURN a\n    ELSE\n        RETURN b\n    END IF\nEND FUNCTION`
    },
    starterCode: `#include <iostream>\nusing namespace std;\n\nint getMax(int a, int b) {\n    if (a > b) return a;\n    return b;\n}\n\nint main() {\n    cout << getMax(12, 25);\n    return 0;\n}`,
    requiredInputKeywords: ['two', 'parameters', 'arguments', 'a', 'b', 'integer'],
    requiredStateKeywords: ['int', 'parameters', 'a', 'b', 'function'],
    requiredProcessingKeywords: ['compare', 'if', '>', 'larger', 'return'],
    requiredOutputKeywords: ['return', 'cout', 'larger', 'max', 'print'],
    minPseudocodeSteps: 2
  }
];

// ============================================================================
// 8. HANDS-ON INPUT (cin) LAB SNIPPETS
// ============================================================================
export const INPUT_LAB_SNIPPETS = {
  doubler: {
    id: 'doubler',
    title: '1. Number Doubler',
    tagline: 'See how different numbers produce different calculations',
    description: 'Reads an integer from cin, multiplies it by 2, and prints the result.',
    defaultInput: '7',
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int num;\n  cout << "Reading number from cin..." << endl;\n  if (cin >> num) {\n    cout << "Input received: " << num << endl;\n    cout << "Double that number is: " << (num * 2) << endl;\n  } else {\n    cout << "Invalid input. Please enter a whole number." << endl;\n  }\n  return 0;\n}`
  },
  greeter: {
    id: 'greeter',
    title: '2. Name Greeter',
    tagline: 'See text input customized in real-time',
    description: 'Reads a word from cin and greets you by name.',
    defaultInput: 'Alex',
    code: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string name;\n  cout << "Reading your name from cin..." << endl;\n  if (cin >> name) {\n    cout << "Hello, " << name << "!" << endl;\n    cout << "Welcome to CodeBloom interactive C++ learning!" << endl;\n  } else {\n    cout << "Please provide a name." << endl;\n  }\n  return 0;\n}`
  },
  sum: {
    id: 'sum',
    title: '3. Two-Number Adder',
    tagline: 'See cin read multiple sequential inputs separated by spaces',
    description: 'Reads two numbers separated by a space and prints their sum.',
    defaultInput: '15 25',
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int a, b;\n  cout << "Reading two numbers from cin..." << endl;\n  if (cin >> a >> b) {\n    cout << "First number:  " << a << endl;\n    cout << "Second number: " << b << endl;\n    cout << "Sum:           " << (a + b) << endl;\n  } else {\n    cout << "Please provide two integers separated by space." << endl;\n  }\n  return 0;\n}`
  }
};

export * from './workedExamplesData.js';

