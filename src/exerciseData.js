/**
 * Data-driven programming exercises for C++ Trainer.
 * Supports Level 1 (fill-in) through Level 5 (independent full program).
 * Features 3-tier progressive hints, combined-concept problems,
 * and comprehensive mastery evaluations.
 */

export const exerciseCatalog = {
  // ==========================================
  // LESSON 1: Your first C++ program
  // ==========================================
  'cpp-basics-mini': {
    id: 'cpp-basics-mini',
    title: 'Personalized Greeting',
    concepts: ['cout', 'strings'],
    difficulty: 'easy',
    level: 1,
    problemStatement: 'Modify the program so it prints "Hello, Alex!" (without quotes) to standard output.',
    constraints: ['Must output exactly "Hello, Alex!" followed by a newline or end of output.'],
    inputFormat: 'No input.',
    outputFormat: 'A single line containing: Hello, Alex!',
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n  // TODO: Change the greeting to your name Alex\n  cout << "Hello, C++!";\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Check exact output',
        input: '',
        expectedOutput: 'Hello, Alex!',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Hidden test: verify newline termination',
        input: '\n',
        expectedOutput: 'Hello, Alex!',
        isHidden: true
      },
      {
        id: 'test-3',
        description: 'Hidden test: verify execution with trailing whitespace input',
        input: '   \n',
        expectedOutput: 'Hello, Alex!',
        isHidden: true
      }
    ],
    expectedBehavior: 'Prints "Hello, Alex!"',
    hints: [
      'What part of the program sends text to the screen?',
      'Look at the text inside the double quotes after cout <<.',
      'Replace the greeting text inside the double quotes with Alex.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, Alex!";\n  return 0;\n}`,
    prerequisiteConcepts: []
  },

  'cpp-basics-medium': {
    id: 'cpp-basics-medium',
    title: 'Two-Line City Greeting',
    concepts: ['cout', 'newlines', 'endl'],
    difficulty: 'medium',
    level: 4,
    problemStatement: 'Write a program that prints your name on the first line and your city on the second line: "Name: Taylor" on line 1, and "City: Seattle" on line 2.',
    constraints: ['Must output exactly two lines.'],
    inputFormat: 'No input.',
    outputFormat: 'Line 1: Name: Taylor\nLine 2: City: Seattle',
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n  // Print Name on first line and City on second line\n  cout << "Name: Taylor" << endl;\n  cout << "City: Seattle" << endl;\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Multi-line greeting check',
        input: '',
        expectedOutput: 'Name: Taylor\nCity: Seattle',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Hidden test: check line termination',
        input: '\n',
        expectedOutput: 'Name: Taylor\nCity: Seattle',
        isHidden: true
      },
      {
        id: 'test-3',
        description: 'Hidden test: empty input buffer stability',
        input: ' ',
        expectedOutput: 'Name: Taylor\nCity: Seattle',
        isHidden: true
      }
    ],
    expectedBehavior: 'Prints two lines with Name and City.',
    hints: [
      'How does C++ separate text onto multiple lines?',
      'You can use either endl or the \\n escape character to begin a new line.',
      'Output "Name: Taylor" followed by a newline, then output "City: Seattle" on the next line.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Name: Taylor\\nCity: Seattle" << endl;\n  return 0;\n}`,
    prerequisiteConcepts: ['cout']
  },

  'cpp-basics-hard': {
    id: 'cpp-basics-hard',
    title: 'Interactive Name Greeting',
    concepts: ['cin', 'cout', 'strings'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Write a complete C++ program that reads a single word name from standard input (cin) and prints "Welcome to C++, <name>!".',
    constraints: ['The name is a single word with length 1 to 50 characters.'],
    inputFormat: 'A single string name from cin.',
    outputFormat: 'Welcome to C++, <name>!',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string name;\n  // Read name and print greeting\n  cin >> name;\n  cout << "Welcome to C++, " << name << "!";\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible name (Jordan)',
        input: 'Jordan',
        expectedOutput: 'Welcome to C++, Jordan!',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Hidden test: different name (Morgan)',
        input: 'Morgan',
        expectedOutput: 'Welcome to C++, Morgan!',
        isHidden: true
      },
      {
        id: 'test-3',
        description: 'Hidden test: single letter name (A)',
        input: 'A',
        expectedOutput: 'Welcome to C++, A!',
        isHidden: true
      }
    ],
    expectedBehavior: 'Reads name from standard input and prints greeting.',
    hints: [
      'Where will the user input come from and where should it be stored?',
      'Declare a std::string variable and read into it using the stream extraction operator >>.',
      'Use cin >> name; followed by cout << "Welcome to C++, " << name << "!";'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string name;\n  if (cin >> name) {\n    cout << "Welcome to C++, " << name << "!";\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['cin', 'cout']
  },

  // ==========================================
  // LESSON 2: Variables, types & keywords
  // ==========================================
  'keywords-mini': {
    id: 'keywords-mini',
    title: 'Store and Display Age',
    concepts: ['variables', 'int', 'cout'],
    difficulty: 'easy',
    level: 1,
    problemStatement: 'Declare an integer variable age with the value 18, and print: "Age: 18".',
    constraints: ['age must be an integer set to 18.'],
    inputFormat: 'No input.',
    outputFormat: 'Age: 18',
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int age = 18;\n  // Print Age: 18\n  cout << "Age: " << age;\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Check age output',
        input: '',
        expectedOutput: 'Age: 18',
        isHidden: false
      }
    ],
    expectedBehavior: 'Prints Age: 18 using an int variable.',
    hints: [
      'Which C++ keyword is used for whole numbers?',
      'Declare int age = 18; before printing.',
      'Use cout << "Age: " << age;'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int age = 18;\n  cout << "Age: " << age << endl;\n  return 0;\n}`,
    prerequisiteConcepts: ['variables']
  },

  'keywords-medium': {
    id: 'keywords-medium',
    title: 'Sum of Two Numbers',
    concepts: ['variables', 'cin', 'arithmetic'],
    difficulty: 'medium',
    level: 4,
    problemStatement: 'Write a C++ program that reads two space-separated integers from standard input and prints their sum.',
    constraints: ['Integers can be positive, negative, or zero.'],
    inputFormat: 'Two integers a and b separated by space.',
    outputFormat: 'A single integer representing a + b.',
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int a, b;\n  // Read a and b, then print their sum\n  if (cin >> a >> b) {\n    cout << a + b;\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible test: 5 10',
        input: '5 10',
        expectedOutput: '15',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible test: 20 30',
        input: '20 30',
        expectedOutput: '50',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: zeros',
        input: '0 0',
        expectedOutput: '0',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: negative numbers',
        input: '-15 25',
        expectedOutput: '10',
        isHidden: true
      },
      {
        id: 'test-5',
        description: 'Hidden test: both negative',
        input: '-40 -60',
        expectedOutput: '-100',
        isHidden: true
      }
    ],
    expectedBehavior: 'Reads two integers from cin and prints the sum.',
    hints: [
      'How do you read two values from the keyboard in one line?',
      'You can chain extraction operators: cin >> a >> b;',
      'Print the sum directly using cout << a + b << endl;'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int a, b;\n  if (cin >> a >> b) {\n    cout << a + b << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['cin', 'arithmetic']
  },

  'keywords-hard': {
    id: 'keywords-hard',
    title: 'Average Marks of Three Subjects',
    concepts: ['float', 'variables', 'arithmetic'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Write a C++ program to calculate the average marks of three subjects. Read three integers representing marks from standard input, and output the exact integer or decimal average.',
    constraints: ['Marks are between 0 and 100.'],
    inputFormat: 'Three space-separated integers m1, m2, m3.',
    outputFormat: 'The average value printed to standard output.',
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n  double m1, m2, m3;\n  if (cin >> m1 >> m2 >> m3) {\n    double avg = (m1 + m2 + m3) / 3.0;\n    cout << avg;\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible test: 80 90 100',
        input: '80 90 100',
        expectedOutput: '90',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible test: 70 75 80',
        input: '70 75 80',
        expectedOutput: '75',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: perfect scores',
        input: '100 100 100',
        expectedOutput: '100',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: zero scores',
        input: '0 0 0',
        expectedOutput: '0',
        isHidden: true
      },
      {
        id: 'test-5',
        description: 'Hidden test: floating point average (10 20 25 = 18.3333)',
        input: '10 20 25',
        expectedOutput: '18.3333',
        isHidden: true
      }
    ],
    expectedBehavior: 'Computes and prints the average of three scores.',
    hints: [
      'What happens if you divide integers in C++? Does it truncate decimal parts?',
      'Declare variables as double or cast the divisor to 3.0 to keep decimals.',
      'Compute (m1 + m2 + m3) / 3.0 and output the result.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n  double a, b, c;\n  if (cin >> a >> b >> c) {\n    cout << (a + b + c) / 3.0 << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['types', 'arithmetic']
  },

  // ==========================================
  // LESSON 3: Dynamic memory: new and delete
  // ==========================================
  'memory-mini': {
    id: 'memory-mini',
    title: 'Fix Heap Memory Allocation & Deallocation',
    syllabusModule: 'Start Writing C++',
    concepts: ['memory', 'new', 'delete', 'pointers'],
    difficulty: 'easy',
    level: 1,
    problemStatement: 'The starter program attempts to dynamically allocate an integer on the heap to store a score, read a value from input, print the doubled score, and clean up. However, the pointer is uninitialized (causing a crash) and the memory is never deallocated. Fix the program so it allocates an integer with new, stores the input value, prints double that value, releases the heap memory with delete, and sets the pointer to nullptr.',
    constraints: ['Must use new to allocate an int on the heap.', 'Must use delete to free the memory before exiting.'],
    inputFormat: 'A single integer value.',
    outputFormat: 'A single integer equal to input * 2.',
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int val;\n  if (cin >> val) {\n    // BUG: Raw pointer is null and not allocated on the heap\n    int* ptr = nullptr;\n    *ptr = val;\n    cout << (*ptr) * 2 << endl;\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: 7 -> 14',
        input: '7',
        expectedOutput: '14',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: 0 -> 0',
        input: '0',
        expectedOutput: '0',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: negative number (-15 -> -30)',
        input: '-15',
        expectedOutput: '-30',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: large value (1024 -> 2048)',
        input: '1024',
        expectedOutput: '2048',
        isHidden: true
      }
    ],
    expectedBehavior: 'Allocates integer on heap with new, prints doubled value, frees with delete.',
    hints: [
      'How do you create an integer on the heap using dynamic memory in C++?',
      'Use the new operator to allocate an int, storing the returned address in a pointer variable (int* ptr = new int(val); or *ptr = val;).',
      'After printing (*ptr) * 2, call delete ptr; to release the heap memory back to the operating system.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int val;\n  if (cin >> val) {\n    int* ptr = new int(val);\n    cout << (*ptr) * 2 << endl;\n    delete ptr;\n    ptr = nullptr;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['pointers', 'variables'],
    isIndependent: false,
    isMultiConcept: false
  },

  'memory-medium': {
    id: 'memory-medium',
    title: 'Dynamic Array Allocation & Reversal',
    syllabusModule: 'Start Writing C++',
    concepts: ['dynamic-memory', 'new', 'delete', 'pointers', 'arrays'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Read an integer N (the number of elements), followed by N integers. Dynamically allocate an array on the heap using new int[N]. Read the N values into the array. Print the elements in reverse order separated by spaces on a single line. Finally, safely release the heap memory using delete[].',
    constraints: ['1 <= N <= 1000', 'Elements are integers between -100000 and 100000.'],
    inputFormat: 'N followed by N space-separated integers.',
    outputFormat: 'N space-separated integers in reverse order.',
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int n;\n  if (cin >> n && n > 0) {\n    // TODO: Allocate dynamic array of size n with new int[n]\n    // TODO: Read elements, print in reverse, and deallocate with delete[]\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: 4 elements -> reversed',
        input: '4\n10 20 30 40',
        expectedOutput: '40 30 20 10',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: 3 elements with negative number',
        input: '3\n5 -2 8',
        expectedOutput: '8 -2 5',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: single element (99 -> 99)',
        input: '1\n99',
        expectedOutput: '99',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: multiple zeros',
        input: '5\n0 0 1 0 2',
        expectedOutput: '2 0 1 0 0',
        isHidden: true
      }
    ],
    expectedBehavior: 'Allocates dynamic array, reads N values, prints in reverse, deallocates with delete[].',
    hints: [
      'How do you allocate an array of size N dynamically on the heap?',
      'Use int* arr = new int[n]; to allocate storage for n integers.',
      'Iterate from index n - 1 down to 0 to print each element, and remember to use delete[] arr; when finished.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int n;\n  if (cin >> n && n > 0) {\n    int* arr = new int[n];\n    for (int i = 0; i < n; i++) {\n      cin >> arr[i];\n    }\n    for (int i = n - 1; i >= 0; i--) {\n      cout << arr[i] << (i > 0 ? " " : "");\n    }\n    cout << endl;\n    delete[] arr;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['dynamic-memory', 'arrays', 'pointers'],
    isIndependent: false,
    isMultiConcept: true
  },

  'memory-hard': {
    id: 'memory-hard',
    title: 'Dynamic Buffer Filtering & Compaction',
    syllabusModule: 'Start Writing C++',
    concepts: ['dynamic-memory', 'new', 'delete', 'pointers', 'arrays'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Given an integer N followed by N integers, count how many numbers are strictly positive (> 0). Dynamically allocate an exact-sized heap array to store only those positive values. Copy the positive values into this array in their original order. Print the count of positive numbers on line 1, and the positive numbers separated by spaces on line 2 (or print "None" if count is 0). Properly deallocate all dynamically allocated heap memory before exiting.',
    constraints: ['0 <= N <= 1000'],
    inputFormat: 'N followed by N integers.',
    outputFormat: 'Line 1: count of positive numbers. Line 2: positive numbers separated by space or "None".',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write a complete program that filters positive integers into a dynamically allocated buffer.\n\nint main() {\n  // Read N, process values, manage heap memory cleanly\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: mixed positive and negative',
        input: '5\n-3 10 0 25 -7',
        expectedOutput: '2\n10 25',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: no positive numbers',
        input: '4\n-1 -2 -3 -4',
        expectedOutput: '0\nNone',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: all positive numbers',
        input: '4\n1 2 3 4',
        expectedOutput: '4\n1 2 3 4',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: single zero element',
        input: '1\n0',
        expectedOutput: '0\nNone',
        isHidden: true
      }
    ],
    expectedBehavior: 'Dynamically allocates raw and filtered buffers, prints count and elements, deallocates cleanly.',
    hints: [
      'Count how many positive numbers exist first so you know the exact size needed for the filtered heap array.',
      'Allocate the filtered array with new int[count] only if count > 0, otherwise handle the "None" case.',
      'Make sure every buffer allocated with new[] has a matching delete[] call before the program exits.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int n;\n  if (!(cin >> n) || n <= 0) {\n    cout << "0\\nNone" << endl;\n    return 0;\n  }\n  int* raw = new int[n];\n  int posCount = 0;\n  for (int i = 0; i < n; i++) {\n    cin >> raw[i];\n    if (raw[i] > 0) posCount++;\n  }\n  cout << posCount << endl;\n  if (posCount == 0) {\n    cout << "None" << endl;\n  } else {\n    int* posArr = new int[posCount];\n    int idx = 0;\n    for (int i = 0; i < n; i++) {\n      if (raw[i] > 0) {\n        posArr[idx++] = raw[i];\n      }\n    }\n    for (int i = 0; i < posCount; i++) {\n      cout << posArr[i] << (i + 1 < posCount ? " " : "");\n    }\n    cout << endl;\n    delete[] posArr;\n  }\n  delete[] raw;\n  return 0;\n}`,
    prerequisiteConcepts: ['dynamic-memory', 'pointers', 'arrays'],
    isIndependent: true,
    isMultiConcept: true
  },

  // ==========================================
  // LESSON 4: Functions
  // ==========================================
  'functions-mini': {
    id: 'functions-mini',
    title: 'Function square(int n)',
    concepts: ['functions', 'parameters', 'return'],
    difficulty: 'easy',
    level: 2,
    problemStatement: 'Implement the function int square(int n) that returns the square of the given integer n. Read an integer from cin, call square, and print the result.',
    constraints: ['n is between -1000 and 1000.'],
    inputFormat: 'A single integer n.',
    outputFormat: 'The value n * n.',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// TODO: Implement square function\nint square(int n) {\n  return n * n;\n}\n\nint main() {\n  int n;\n  if (cin >> n) {\n    cout << square(n);\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: 4 -> 16',
        input: '4',
        expectedOutput: '16',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: 7 -> 49',
        input: '7',
        expectedOutput: '49',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: negative number (-5 -> 25)',
        input: '-5',
        expectedOutput: '25',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: zero (0 -> 0)',
        input: '0',
        expectedOutput: '0',
        isHidden: true
      }
    ],
    conceptChecks: [
      {
        id: 'has-square-function',
        description: 'Must define int square(int n) function',
        pattern: 'int\\s+square\\s*\\(\\s*int',
        message: 'You must define an int square(int) function rather than computing the result only inside main().'
      }
    ],
    hints: [
      'What should the function return type, name, and parameter be?',
      'Define int square(int n) above main() and return n * n.',
      'Multiply the parameter n by itself and return that product, then pass the user input to square() in main().'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nint square(int n) {\n  return n * n;\n}\n\nint main() {\n  int n;\n  if (cin >> n) {\n    cout << square(n) << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['functions']
  },

  'functions-medium': {
    id: 'functions-medium',
    title: 'In-Place Stat Accumulator via Reference',
    syllabusModule: 'Start Writing C++',
    concepts: ['functions', 'pass-by-reference', 'references', 'parameters'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Implement a function void updateStats(int val, int& sum, int& maxVal) that updates caller-owned running statistics in place. sum must be incremented by val, and maxVal must be updated to max(maxVal, val). In main(), read an integer N followed by N positive integers. Initialize sum = 0 and maxVal = -1. For each number, call updateStats. Finally, output: Sum: <sum>, Max: <maxVal>.',
    constraints: ['N >= 1', 'Numbers are positive integers.'],
    inputFormat: 'N followed by N integers.',
    outputFormat: 'Sum: <sum>, Max: <maxVal>',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// TODO: Implement updateStats with pass-by-reference parameters\nvoid updateStats(int val, int sum, int maxVal) {\n  // Fix parameter types so changes update the caller variables!\n}\n\nint main() {\n  int n;\n  if (cin >> n && n > 0) {\n    int sum = 0, maxVal = -1;\n    for (int i = 0; i < n; i++) {\n      int val;\n      cin >> val;\n      updateStats(val, sum, maxVal);\n    }\n    cout << "Sum: " << sum << ", Max: " << maxVal << endl;\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: 3 numbers',
        input: '3\n10 25 5',
        expectedOutput: 'Sum: 40, Max: 25',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: equal values',
        input: '4\n7 7 7 7',
        expectedOutput: 'Sum: 28, Max: 7',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: single number (42)',
        input: '1\n42',
        expectedOutput: 'Sum: 42, Max: 42',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: peak value in middle',
        input: '5\n1 99 2 50 3',
        expectedOutput: 'Sum: 155, Max: 99',
        isHidden: true
      }
    ],
    conceptChecks: [
      {
        id: 'has-reference-param',
        description: 'Must use reference parameters',
        pattern: 'void\\s+updateStats\\s*\\([^)]*&',
        message: 'You must use reference parameters (&) to modify caller state.'
      }
    ],
    expectedBehavior: 'Updates sum and maxVal in place using pass-by-reference.',
    hints: [
      'Why do normal function arguments not change the caller variables when modified inside a function?',
      'Add the & symbol after the parameter types for sum and maxVal (e.g. int& sum, int& maxVal) to pass them by reference.',
      'Inside the function, add val to sum and update maxVal if val is greater than maxVal.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nvoid updateStats(int val, int& sum, int& maxVal) {\n  sum += val;\n  if (val > maxVal) {\n    maxVal = val;\n  }\n}\n\nint main() {\n  int n;\n  if (cin >> n && n > 0) {\n    int sum = 0, maxVal = -1;\n    for (int i = 0; i < n; i++) {\n      int val;\n      cin >> val;\n      updateStats(val, sum, maxVal);\n    }\n    cout << "Sum: " << sum << ", Max: " << maxVal << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['functions', 'parameters'],
    isIndependent: false,
    isMultiConcept: true
  },

  'functions-hard': {
    id: 'functions-hard',
    title: 'Dual-Result Integer Division',
    syllabusModule: 'Start Writing C++',
    concepts: ['functions', 'references', 'pass-by-reference', 'parameters'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'In C++, a function can return only one value directly via return. Write a function divide(int dividend, int divisor, int& quotient, int& remainder) that computes both integer quotient and remainder, returning them through caller-owned variables. In main(), read dividend and divisor. If divisor == 0, output "Error: Division by zero". Otherwise, call your function and output "Quotient: <quotient>, Remainder: <remainder>".',
    constraints: ['Inputs are non-negative integers.'],
    inputFormat: 'dividend divisor',
    outputFormat: 'Quotient: <q>, Remainder: <r> or Error: Division by zero',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your division function and main driver here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: 17 / 5 -> Q:3, R:2',
        input: '17 5',
        expectedOutput: 'Quotient: 3, Remainder: 2',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: division by zero',
        input: '10 0',
        expectedOutput: 'Error: Division by zero',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: exact multiple (100 / 10)',
        input: '100 10',
        expectedOutput: 'Quotient: 10, Remainder: 0',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: dividend smaller than divisor (7 / 12)',
        input: '7 12',
        expectedOutput: 'Quotient: 0, Remainder: 7',
        isHidden: true
      }
    ],
    expectedBehavior: 'Computes quotient and remainder via reference arguments or handles division by zero.',
    hints: [
      'How can a void function return multiple calculated results back to its caller?',
      'Declare quotient and remainder as reference parameters (int& quotient, int& remainder).',
      'Assign quotient = dividend / divisor; and remainder = dividend % divisor; only after checking that divisor is non-zero.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nvoid divide(int dividend, int divisor, int& quotient, int& remainder) {\n  quotient = dividend / divisor;\n  remainder = dividend % divisor;\n}\n\nint main() {\n  int a, b;\n  if (cin >> a >> b) {\n    if (b == 0) {\n      cout << "Error: Division by zero" << endl;\n    } else {\n      int q = 0, r = 0;\n      divide(a, b, q, r);\n      cout << "Quotient: " << q << ", Remainder: " << r << endl;\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['functions', 'references'],
    isIndependent: true,
    isMultiConcept: true
  },

  // ==========================================
  // LESSON 5: Structures, classes & objects
  // ==========================================
  'classes-mini': {
    id: 'classes-mini',
    title: 'Student Class Blueprint',
    concepts: ['classes', 'objects', 'member-variables'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Define a class named Student with public members: string name and int rollNo. In main(), read name and rollNo from input, instantiate a Student object, and display: "Student: <name>, Roll: <rollNo>".',
    constraints: ['Class name must be Student.'],
    inputFormat: 'A string name and an int rollNo separated by space.',
    outputFormat: 'Student: <name>, Roll: <rollNo>',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\npublic:\n  string name;\n  int rollNo;\n};\n\nint main() {\n  Student s;\n  if (cin >> s.name >> s.rollNo) {\n    cout << "Student: " << s.name << ", Roll: " << s.rollNo;\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample student: Alice 101',
        input: 'Alice 101',
        expectedOutput: 'Student: Alice, Roll: 101',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Hidden test: Bob 202',
        input: 'Bob 202',
        expectedOutput: 'Student: Bob, Roll: 202',
        isHidden: true
      }
    ],
    conceptChecks: [
      {
        id: 'has-class-student',
        description: 'Must declare class Student',
        pattern: 'class\\s+Student',
        message: 'You must declare a class named Student.'
      }
    ],
    hints: [
      'How is a class defined in C++ with accessible members?',
      'Declare the class with public member variables for name and rollNo, remembering the closing semicolon.',
      'Create an instance Student s; and read with cin >> s.name >> s.rollNo;'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\npublic:\n  string name;\n  int rollNo;\n};\n\nint main() {\n  Student s;\n  if (cin >> s.name >> s.rollNo) {\n    cout << "Student: " << s.name << ", Roll: " << s.rollNo << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes']
  },

  // ==========================================
  // LESSON 6: Access, data & member functions
  // ==========================================
  'access-mini': {
    id: 'access-mini',
    title: 'Repair Encapsulation in Bounded Counter',
    syllabusModule: 'Classes & Objects',
    concepts: ['access-control', 'private', 'public', 'classes'],
    difficulty: 'easy',
    level: 1,
    problemStatement: 'The starter program has a Counter class where count was left public, allowing external code to illegally corrupt its state with negative numbers. Repair the class: (1) Make count private. (2) Provide a constructor initializing count to 0. (3) Provide void increment() adding 1 to count. (4) Provide void set(int val) that updates count only if val >= 0. (5) Provide int get() const returning count. In main(), read initial and steps, set initial, increment steps times, and print: Final Count: <count>.',
    constraints: ['count cannot be modified directly from outside the class.'],
    inputFormat: 'initial steps',
    outputFormat: 'Final Count: <count>',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Counter {\n  // BUG: count is public and unvalidated\npublic:\n  int count;\n  void increment() { count++; }\n};\n\nint main() {\n  Counter c;\n  int init, steps;\n  if (cin >> init >> steps) {\n    // Repair Counter class so count is protected by private access\n    c.count = init; // This should NOT be allowed directly\n    for (int i = 0; i < steps; i++) c.increment();\n    cout << "Final Count: " << c.count << endl;\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: 5 with 3 increments -> 8',
        input: '5 3',
        expectedOutput: 'Final Count: 8',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: negative initial value (-10 ignored -> 0) with 4 increments -> 4',
        input: '-10 4',
        expectedOutput: 'Final Count: 4',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: zero initial and zero steps',
        input: '0 0',
        expectedOutput: 'Final Count: 0',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: negative initial with zero steps',
        input: '-5 0',
        expectedOutput: 'Final Count: 0',
        isHidden: true
      }
    ],
    expectedBehavior: 'Encapsulates Counter state with private member, validated setter, and getter.',
    hints: [
      'Place int count; under a private: section so external code cannot modify it directly.',
      'Under public:, implement Counter() : count(0) {}, void set(int val) { if (val >= 0) count = val; }, and int get() const { return count; }.',
      'In main(), use c.set(init) instead of direct assignment, and c.get() to retrieve the final count.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Counter {\nprivate:\n  int count;\npublic:\n  Counter() : count(0) {}\n  void set(int val) {\n    if (val >= 0) count = val;\n  }\n  void increment() {\n    count++;\n  }\n  int get() const {\n    return count;\n  }\n};\n\nint main() {\n  Counter c;\n  int init, steps;\n  if (cin >> init >> steps) {\n    c.set(init);\n    for (int i = 0; i < steps; i++) c.increment();\n    cout << "Final Count: " << c.get() << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'access-control'],
    isIndependent: false,
    isMultiConcept: false
  },

  'access-medium': {
    id: 'access-medium',
    title: 'Bank Account Invariant Protection',
    syllabusModule: 'Classes & Objects',
    concepts: ['access-control', 'private', 'public', 'classes', 'methods'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Design an encapsulated BankAccount class with private double balance. Provide: (1) BankAccount(double initialBalance) setting balance if >= 0, else 0. (2) bool deposit(double amount) adding amount and returning true if amount > 0, else returning false. (3) bool withdraw(double amount) subtracting amount and returning true if amount > 0 and amount <= balance, else returning false. (4) double getBalance() const returning current balance. In main(), read initial deposit withdraw, run transactions, and output Deposit status, Withdraw status, and final Balance.',
    constraints: ['balance cannot become negative.', 'All transactions must validate invariants.'],
    inputFormat: 'initial deposit withdraw',
    outputFormat: 'Deposit: OK|REJECTED\nWithdraw: OK|REJECTED\nBalance: <balance>',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Implement BankAccount with private balance and validating methods\n\nint main() {\n  double init, dep, wth;\n  if (cin >> init >> dep >> wth) {\n    // Instantiate BankAccount and test deposit/withdraw invariants\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: valid deposit and withdraw',
        input: '100 50 30',
        expectedOutput: 'Deposit: OK\nWithdraw: OK\nBalance: 120',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: negative deposit and overdraft withdraw',
        input: '100 -20 200',
        expectedOutput: 'Deposit: REJECTED\nWithdraw: REJECTED\nBalance: 100',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: zero deposit rejected, exact withdraw accepted',
        input: '50 0 50',
        expectedOutput: 'Deposit: REJECTED\nWithdraw: OK\nBalance: 0',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: zero initial balance with valid deposit',
        input: '0 200 150',
        expectedOutput: 'Deposit: OK\nWithdraw: OK\nBalance: 50',
        isHidden: true
      }
    ],
    expectedBehavior: 'Enforces bank balance invariants through private data and validating methods.',
    hints: [
      'Keep balance in the private section so outside code cannot bypass deposit or withdraw validation.',
      'In withdraw(), verify both that amount > 0 and amount <= balance before subtracting.',
      'Return true on successful transactions and false on invalid transactions to drive the OK/REJECTED output.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass BankAccount {\nprivate:\n  double balance;\npublic:\n  BankAccount(double init) : balance(init >= 0 ? init : 0) {}\n  bool deposit(double amount) {\n    if (amount > 0) {\n      balance += amount;\n      return true;\n    }\n    return false;\n  }\n  bool withdraw(double amount) {\n    if (amount > 0 && amount <= balance) {\n      balance -= amount;\n      return true;\n    }\n    return false;\n  }\n  double getBalance() const {\n    return balance;\n  }\n};\n\nint main() {\n  double init, dep, wth;\n  if (cin >> init >> dep >> wth) {\n    BankAccount acct(init);\n    cout << "Deposit: " << (acct.deposit(dep) ? "OK" : "REJECTED") << endl;\n    cout << "Withdraw: " << (acct.withdraw(wth) ? "OK" : "REJECTED") << endl;\n    cout << "Balance: " << acct.getBalance() << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'access-control', 'methods'],
    isIndependent: false,
    isMultiConcept: true
  },

  'access-hard': {
    id: 'access-hard',
    title: 'Thermostat Temperature Invariant Enforcement',
    syllabusModule: 'Classes & Objects',
    concepts: ['access-control', 'private', 'public', 'classes', 'methods'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'In thermodynamics, temperature cannot drop below absolute zero (0 Kelvin, or -273.15 Celsius). Design an independent Thermostat class that stores its internal state strictly in Kelvins as private double kelvin. Provide: (1) Default constructor setting 293.15 K (20 C). (2) bool setCelsius(double c): if c >= -273.15, stores c + 273.15 and returns true; otherwise leaves state unchanged and returns false. (3) double getCelsius() const returning kelvin - 273.15. (4) double getFahrenheit() const returning (getCelsius() * 9.0 / 5.0) + 32.0. In main(), read 3 Celsius values. For each, if setCelsius succeeds, print "C: <int(celsius)> F: <int(fahrenheit)>"; otherwise print "Invalid temperature".',
    constraints: ['Internal state must strictly remain private in Kelvins.'],
    inputFormat: '3 space-separated Celsius values.',
    outputFormat: '3 lines with "C: <c> F: <f>" or "Invalid temperature".',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write complete Thermostat class and main program\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: 0C, 100C, below absolute zero (-300C)',
        input: '0 100 -300',
        expectedOutput: 'C: 0 F: 32\nC: 100 F: 212\nInvalid temperature',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: room temp, crossover temp (-40C == -40F), absolute zero limit',
        input: '25 -40 -273.15',
        expectedOutput: 'C: 25 F: 77\nC: -40 F: -40\nC: -273 F: -459',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: impossible low temp first, followed by valid warm and cold',
        input: '-500 50 -10',
        expectedOutput: 'Invalid temperature\nC: 50 F: 122\nC: -10 F: 14',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: high temperature and freezing boundary',
        input: '1000 0 -1',
        expectedOutput: 'C: 1000 F: 1832\nC: 0 F: 32\nC: -1 F: 30',
        isHidden: true
      }
    ],
    expectedBehavior: 'Stores temperature strictly in Kelvin privately, validates thermodynamic invariant, converts to C/F.',
    hints: [
      'Store kelvin as a private double to guarantee no outside code can violate the absolute zero invariant.',
      'In setCelsius(double c), check c >= -273.15 before updating kelvin = c + 273.15.',
      'Cast getCelsius() and getFahrenheit() results to long long or int when printing to match the required integer display.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Thermostat {\nprivate:\n  double kelvin;\npublic:\n  Thermostat() : kelvin(293.15) {}\n  bool setCelsius(double c) {\n    if (c >= -273.15) {\n      kelvin = c + 273.15;\n      return true;\n    }\n    return false;\n  }\n  double getCelsius() const {\n    return kelvin - 273.15;\n  }\n  double getFahrenheit() const {\n    return (getCelsius() * 9.0 / 5.0) + 32.0;\n  }\n};\n\nint main() {\n  Thermostat t;\n  double c;\n  for (int i = 0; i < 3; i++) {\n    if (cin >> c) {\n      if (t.setCelsius(c)) {\n        cout << "C: " << (long long)t.getCelsius() << " F: " << (long long)t.getFahrenheit() << endl;\n      } else {\n        cout << "Invalid temperature" << endl;\n      }\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'access-control', 'methods'],
    isIndependent: true,
    isMultiConcept: true
  },

  // ==========================================
  // LESSON 11: Constructors
  // ==========================================
  'constructors-mini': {
    id: 'constructors-mini',
    title: 'Parameterized Rectangle Constructor',
    concepts: ['constructors', 'classes'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Create a class Rectangle with a parameterized constructor Rectangle(int w, int h) that initializes width and height, and a method int area() that returns width * height. Read width and height from cin, construct a Rectangle, and print the area.',
    constraints: ['Width and height are positive integers.'],
    inputFormat: 'Two integers w and h.',
    outputFormat: 'A single integer representing the area.',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Rectangle {\n  int width, height;\npublic:\n  // TODO: Add parameterized constructor Rectangle(int w, int h)\n  Rectangle(int w, int h) : width(w), height(h) {}\n  int area() { return width * height; }\n};\n\nint main() {\n  int w, h;\n  if (cin >> w >> h) {\n    Rectangle r(w, h);\n    cout << r.area();\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: 4 5 -> 20',
        input: '4 5',
        expectedOutput: '20',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Hidden test: 10 12 -> 120',
        input: '10 12',
        expectedOutput: '120',
        isHidden: true
      },
      {
        id: 'test-3',
        description: 'Hidden test: square 7 7 -> 49',
        input: '7 7',
        expectedOutput: '49',
        isHidden: true
      }
    ],
    conceptChecks: [
      {
        id: 'has-constructor',
        description: 'Must define Rectangle constructor',
        pattern: 'Rectangle\\s*\\([^)]*\\)',
        message: 'You must define a Rectangle constructor to initialize the dimensions.'
      }
    ],
    hints: [
      'What is special about the constructor name and return type?',
      'The constructor has the exact same name as the class and has NO return type.',
      'Declare Rectangle(int w, int h) : width(w), height(h) {} inside the public section.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Rectangle {\n  int width, height;\npublic:\n  Rectangle(int w, int h) : width(w), height(h) {}\n  int area() const { return width * height; }\n};\n\nint main() {\n  int w, h;\n  if (cin >> w >> h) {\n    Rectangle r(w, h);\n    cout << r.area() << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'constructors']
  },

  'constructors-medium': {
    id: 'constructors-medium',
    title: 'Box Constructor with Volume',
    concepts: ['constructors', 'classes', 'methods'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Create a class Box with private members length, width, height. Implement a constructor Box(int l, int w, int h) and a method int volume() that returns l * w * h. Read 3 integers from cin, construct the Box, and output its volume.',
    constraints: ['Dimensions are positive integers up to 100.'],
    inputFormat: 'Three space-separated integers.',
    outputFormat: 'Single integer volume.',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Box {\n  int l, w, h;\npublic:\n  Box(int l_, int w_, int h_) : l(l_), w(w_), h(h_) {}\n  int volume() { return l * w * h; }\n};\n\nint main() {\n  int a, b, c;\n  if (cin >> a >> b >> c) {\n    Box box(a, b, c);\n    cout << box.volume();\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible test: 2 3 4 -> 24',
        input: '2 3 4',
        expectedOutput: '24',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Hidden test: cube 5 5 5 -> 125',
        input: '5 5 5',
        expectedOutput: '125',
        isHidden: true
      },
      {
        id: 'test-3',
        description: 'Hidden test: flat box 10 1 2 -> 20',
        input: '10 1 2',
        expectedOutput: '20',
        isHidden: true
      }
    ],
    hints: [
      'Store dimensions in member variables when the object is instantiated.',
      'Use member initializer list in the constructor: Box(int l_, int w_, int h_) : l(l_), w(w_), h(h_) {}',
      'Call box.volume() and output the result with cout.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Box {\n  int l, w, h;\npublic:\n  Box(int l_, int w_, int h_) : l(l_), w(w_), h(h_) {}\n  int volume() const { return l * w * h; }\n};\n\nint main() {\n  int a, b, c;\n  if (cin >> a >> b >> c) {\n    Box box(a, b, c);\n    cout << box.volume() << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['constructors']
  },

  // ==========================================
  // LESSON 12: Destructors
  // ==========================================
  'destructors-mini': {
    id: 'destructors-mini',
    title: 'Destructor Resource Release Verification',
    syllabusModule: 'Object Lifetime',
    concepts: ['destructors', 'object-lifecycle', 'cleanup', 'classes'],
    difficulty: 'easy',
    level: 2,
    problemStatement: 'When an object goes out of scope, C++ invokes its destructor automatically. Complete the destructor ~Tracker() for class Tracker. The constructor Tracker(int id) prints "Created <id>". In the destructor ~Tracker(), print "Destroyed <id>". In main(), read an integer id, enter an inner block { Tracker t(id); }, and observe that creation and destruction occur as the object enters and exits the block scope.',
    constraints: ['Destructor must be defined as ~Tracker().'],
    inputFormat: 'A single integer id.',
    outputFormat: 'Created <id>\nDestroyed <id>\nScope exit',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Tracker {\n  int id;\npublic:\n  Tracker(int id_) : id(id_) {\n    cout << "Created " << id << endl;\n  }\n  // TODO: Add destructor ~Tracker() to output "Destroyed <id>"\n};\n\nint main() {\n  int id;\n  if (cin >> id) {\n    {\n      Tracker t(id);\n    }\n    cout << "Scope exit" << endl;\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: id 42',
        input: '42',
        expectedOutput: 'Created 42\nDestroyed 42\nScope exit',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: id 1',
        input: '1',
        expectedOutput: 'Created 1\nDestroyed 1\nScope exit',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: id 999',
        input: '999',
        expectedOutput: 'Created 999\nDestroyed 999\nScope exit',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: id 0',
        input: '0',
        expectedOutput: 'Created 0\nDestroyed 0\nScope exit',
        isHidden: true
      }
    ],
    expectedBehavior: 'Observes object creation, automatic destructor execution on scope exit, and subsequent statements.',
    hints: [
      'A destructor is declared using a tilde (~) followed by the class name, taking no parameters and returning nothing.',
      'Define ~Tracker() inside the public section of class Tracker.',
      'Output "Destroyed " << id << endl; inside the destructor body.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Tracker {\n  int id;\npublic:\n  Tracker(int id_) : id(id_) {\n    cout << "Created " << id << endl;\n  }\n  ~Tracker() {\n    cout << "Destroyed " << id << endl;\n  }\n};\n\nint main() {\n  int id;\n  if (cin >> id) {\n    {\n      Tracker t(id);\n    }\n    cout << "Scope exit" << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['constructors', 'destructors', 'classes'],
    isIndependent: false,
    isMultiConcept: false
  },

  'destructors-medium': {
    id: 'destructors-medium',
    title: 'Encapsulated Dynamic Array with RAII Cleanup',
    syllabusModule: 'Object Lifetime',
    concepts: ['destructors', 'dynamic-memory', 'classes', 'cleanup', 'new', 'delete'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Implement a class DynamicBuffer that owns a dynamically allocated integer array using RAII (Resource Acquisition Is Initialization): (1) DynamicBuffer(int size) allocates new int[size] on the heap and saves size. (2) ~DynamicBuffer() releases the array with delete[] and prints "Buffer of size <size> freed". (3) void set(int idx, int val) sets data[idx] = val if 0 <= idx < size. (4) int get(int idx) const returns data[idx]. In main(), read size N, then N integers into a DynamicBuffer in an inner block. Print the elements separated by space, and verify the buffer frees cleanly upon block exit.',
    constraints: ['Heap buffer must be freed using delete[] in the destructor.'],
    inputFormat: 'N followed by N integers.',
    outputFormat: 'Line 1: space-separated integers.\nLine 2: Buffer of size <N> freed',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass DynamicBuffer {\n  int* data;\n  int size;\npublic:\n  // TODO: Constructor allocating dynamic memory\n  // TODO: Destructor releasing memory and printing message\n  // TODO: set and get methods\n};\n\nint main() {\n  int n;\n  if (cin >> n && n > 0) {\n    {\n      DynamicBuffer buf(n);\n      for (int i = 0; i < n; i++) {\n        int v; cin >> v;\n        buf.set(i, v);\n      }\n      for (int i = 0; i < n; i++) {\n        cout << buf.get(i) << (i + 1 < n ? " " : "");\n      }\n      cout << endl;\n    }\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: 3 elements',
        input: '3\n10 20 30',
        expectedOutput: '10 20 30\nBuffer of size 3 freed',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: 2 elements',
        input: '2\n5 9',
        expectedOutput: '5 9\nBuffer of size 2 freed',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: single element (100)',
        input: '1\n100',
        expectedOutput: '100\nBuffer of size 1 freed',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: 4 zeros',
        input: '4\n0 0 0 0',
        expectedOutput: '0 0 0 0\nBuffer of size 4 freed',
        isHidden: true
      }
    ],
    expectedBehavior: 'Encapsulates dynamic array in constructor and guarantees cleanup via destructor delete[].',
    hints: [
      'In the constructor, initialize data with new int[size].',
      'In the destructor, call delete[] data; and print the release message.',
      'Verify that set checks bounds (0 <= idx < size) and get returns data[idx].'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass DynamicBuffer {\n  int* data;\n  int size;\npublic:\n  DynamicBuffer(int s) : size(s), data(new int[s]) {}\n  ~DynamicBuffer() {\n    delete[] data;\n    cout << "Buffer of size " << size << " freed" << endl;\n  }\n  void set(int idx, int val) {\n    if (idx >= 0 && idx < size) data[idx] = val;\n  }\n  int get(int idx) const {\n    return data[idx];\n  }\n};\n\nint main() {\n  int n;\n  if (cin >> n && n > 0) {\n    {\n      DynamicBuffer buf(n);\n      for (int i = 0; i < n; i++) {\n        int v; cin >> v;\n        buf.set(i, v);\n      }\n      for (int i = 0; i < n; i++) {\n        cout << buf.get(i) << (i + 1 < n ? " " : "");\n      }\n      cout << endl;\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['destructors', 'dynamic-memory', 'constructors', 'classes'],
    isIndependent: false,
    isMultiConcept: true
  },

  'destructors-hard': {
    id: 'destructors-hard',
    title: 'LIFO Destruction Order Verification',
    syllabusModule: 'Object Lifetime',
    concepts: ['destructors', 'object-lifecycle', 'classes', 'cleanup'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'In C++, local stack objects are destroyed in the exact reverse order of their construction (Last-In, First-Out). Design a class ScopeGuard that takes a string name. In constructor: print "Enter: <name>". In destructor: print "Exit: <name>". In main(), read two labels A and B. Construct ScopeGuard first(A);, then inside an inner block construct ScopeGuard second(B);. When the inner block ends, second is destroyed. Then main() prints "Checkpoint". When main() ends, first is destroyed.',
    constraints: ['Must use nested block scopes to demonstrate deterministic destruction timing.'],
    inputFormat: 'Two space-separated string names A and B.',
    outputFormat: '5 lines showing Enter/Exit order.',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\n// Implement ScopeGuard and demonstrate reverse destruction order\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: Alpha and Beta',
        input: 'Alpha Beta',
        expectedOutput: 'Enter: Alpha\nEnter: Beta\nExit: Beta\nCheckpoint\nExit: Alpha',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: Outer and Inner',
        input: 'Outer Inner',
        expectedOutput: 'Enter: Outer\nEnter: Inner\nExit: Inner\nCheckpoint\nExit: Outer',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Scope1 and Scope2',
        input: 'Scope1 Scope2',
        expectedOutput: 'Enter: Scope1\nEnter: Scope2\nExit: Scope2\nCheckpoint\nExit: Scope1',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Single characters X and Y',
        input: 'X Y',
        expectedOutput: 'Enter: X\nEnter: Y\nExit: Y\nCheckpoint\nExit: X',
        isHidden: true
      }
    ],
    expectedBehavior: 'Demonstrates deterministic LIFO destructor sequencing across nested scopes.',
    hints: [
      'Design class ScopeGuard with string name; storing the passed name parameter.',
      'Print "Enter: " in constructor and "Exit: " in destructor.',
      'In main, declare the outer ScopeGuard first, open braces { } for the inner ScopeGuard, and print "Checkpoint" after the braces close.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass ScopeGuard {\n  string name;\npublic:\n  ScopeGuard(const string& n) : name(n) {\n    cout << "Enter: " << name << endl;\n  }\n  ~ScopeGuard() {\n    cout << "Exit: " << name << endl;\n  }\n};\n\nint main() {\n  string a, b;\n  if (cin >> a >> b) {\n    ScopeGuard first(a);\n    {\n      ScopeGuard second(b);\n    }\n    cout << "Checkpoint" << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['destructors', 'classes', 'object-lifecycle'],
    isIndependent: true,
    isMultiConcept: true
  },

  // ==========================================
  // LESSON 13: Inheritance
  // ==========================================
  'inheritance-mini': {
    id: 'inheritance-mini',
    title: 'Person and Student Inheritance',
    concepts: ['inheritance', 'classes'],
    difficulty: 'medium',
    level: 4,
    problemStatement: 'Create a base class Person with a method void speak() that prints "Hello from Person". Create a derived class Student that inherits from Person and overrides/adds void study() printing "Studying C++". In main(), instantiate a Student and call both speak() and study() on separate lines.',
    constraints: ['Student must publicly inherit from Person.'],
    inputFormat: 'No input.',
    outputFormat: 'Hello from Person\nStudying C++',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Person {\npublic:\n  void speak() { cout << "Hello from Person" << endl; }\n};\n\nclass Student : public Person {\npublic:\n  void study() { cout << "Studying C++" << endl; }\n};\n\nint main() {\n  Student s;\n  s.speak();\n  s.study();\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Check inheritance method execution',
        input: '',
        expectedOutput: 'Hello from Person\nStudying C++',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Hidden test: verify correct multi-line ordering',
        input: '\n',
        expectedOutput: 'Hello from Person\nStudying C++',
        isHidden: true
      },
      {
        id: 'test-3',
        description: 'Hidden test: ensure derived method study() and base speak() are distinct',
        input: ' ',
        expectedOutput: 'Hello from Person\nStudying C++',
        isHidden: true
      }
    ],
    conceptChecks: [
      {
        id: 'has-inheritance-syntax',
        description: 'Student must inherit from Person',
        pattern: 'class\\s+Student\\s*:\\s*(public|protected|private)\\s+Person',
        message: 'The Student class must inherit from Person using class Student : public Person.'
      }
    ],
    hints: [
      'How does a derived class specify its base class in C++?',
      'Use the colon syntax: class Student : public Person { ... };',
      'Inside main(), instantiate Student s; then call s.speak(); and s.study();.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Person {\npublic:\n  void speak() { cout << "Hello from Person" << endl; }\n};\n\nclass Student : public Person {\npublic:\n  void study() { cout << "Studying C++" << endl; }\n};\n\nint main() {\n  Student s;\n  s.speak();\n  s.study();\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'inheritance']
  },

  // ==========================================
  // COMBINED-CONCEPT PROBLEMS
  // ==========================================
  'combined-classes-constructors': {
    id: 'combined-classes-constructors',
    title: 'Solid Geometry: Box Surface & Volume',
    concepts: ['classes', 'constructors', 'methods', 'cin', 'cout'],
    difficulty: 'medium',
    level: 4,
    problemStatement: 'Write a complete C++ program to represent rectangular boxes. Read length, width, and height from standard input. Calculate and display the volume followed by the total surface area on a single line separated by a space.',
    constraints: ['1 <= length, width, height <= 1000'],
    inputFormat: 'Three integers l, w, h.',
    outputFormat: 'volume surface_area (separated by space)',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: 2 3 4 -> 24 52',
        input: '2 3 4',
        expectedOutput: '24 52',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible: 5 5 5 -> 125 150',
        input: '5 5 5',
        expectedOutput: '125 150',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: unit cube 1 1 1 -> 1 6',
        input: '1 1 1',
        expectedOutput: '1 6',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: large dimensions 10 20 30 -> 6000 2200',
        input: '10 20 30',
        expectedOutput: '6000 2200',
        isHidden: true
      }
    ],
    conceptChecks: [
      {
        id: 'has-class-construct',
        description: 'Must organize geometry into a class structure',
        pattern: 'class\\s+\\w+',
        message: 'Model your geometry using a C++ class.'
      }
    ],
    hints: [
      'What formulas compute volume and surface area of a box?',
      'Volume = l * w * h, Surface Area = 2 * (l*w + w*h + h*l).',
      'Create a class Box with a constructor to store the dimensions and methods to compute volume and surface area.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Box {\n  long long l, w, h;\npublic:\n  Box(long long l_, long long w_, long long h_) : l(l_), w(w_), h(h_) {}\n  long long volume() const { return l * w * h; }\n  long long surfaceArea() const { return 2 * (l * w + w * h + h * l); }\n};\n\nint main() {\n  long long l, w, h;\n  if (cin >> l >> w >> h) {\n    Box b(l, w, h);\n    cout << b.volume() << " " << b.surfaceArea() << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'constructors']
  },

  'combined-classes-arrays': {
    id: 'combined-classes-arrays',
    title: 'Shopping Cart Total',
    concepts: ['classes', 'arrays', 'methods', 'cin', 'cout'],
    difficulty: 'hard',
    level: 4,
    problemStatement: 'Write a C++ program to compute the total cost of items in a shopping cart. Read an integer N representing the number of items. For each item, read the quantity and the unit price. Output the final total cost of all items.',
    constraints: ['1 <= N <= 50', 'Quantity and price are positive integers.'],
    inputFormat: 'N followed by N pairs of (quantity price).',
    outputFormat: 'Total integer cost.',
    starterCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Write your solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: 2 items: 2 10, 3 5 -> 35',
        input: '2 2 10 3 5',
        expectedOutput: '35',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible: 1 item: 5 20 -> 100',
        input: '1 5 20',
        expectedOutput: '100',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: 3 items: 1 15 2 25 4 10 -> 105',
        input: '3 1 15 2 25 4 10',
        expectedOutput: '105',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: 4 items: 10 2 5 3 2 10 1 50 -> 105',
        input: '4 10 2 5 3 2 10 1 50',
        expectedOutput: '105',
        isHidden: true
      }
    ],
    hints: [
      'How would you represent a single item in the cart?',
      'Create an Item class with quantity and price, and a method cost() { return qty * price; }.',
      'Loop N times reading each item, accumulating total += item.cost().'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Item {\n  int qty, price;\npublic:\n  Item(int q = 0, int p = 0) : qty(q), price(p) {}\n  int cost() const { return qty * price; }\n};\n\nint main() {\n  int n;\n  if (cin >> n) {\n    int total = 0;\n    for (int i = 0; i < n; ++i) {\n      int q, p;\n      cin >> q >> p;\n      Item it(q, p);\n      total += it.cost();\n    }\n    cout << total << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'loops']
  },

  'combined-inheritance-virtual': {
    id: 'combined-inheritance-virtual',
    title: 'Payroll Polymorphism',
    concepts: ['inheritance', 'runtime-polymorphism', 'virtual-functions', 'classes'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Create a base class Employee with a virtual function double getPay(). Derive two classes: SalariedEmployee (fixed monthly pay) and HourlyEmployee (hours * hourlyRate). Read type (1 for salaried, 2 for hourly). For salaried read monthly pay; for hourly read hours and rate. Calculate and display pay via a base Employee pointer.',
    constraints: ['Pay values are positive numbers.'],
    inputFormat: 'Type followed by values: 1 <monthly> OR 2 <hours> <rate>',
    outputFormat: 'Computed pay value.',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: Salaried 5000 -> 5000',
        input: '1 5000',
        expectedOutput: '5000',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible: Hourly 40 25 -> 1000',
        input: '2 40 25',
        expectedOutput: '1000',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Hourly overtime 50 30 -> 1500',
        input: '2 50 30',
        expectedOutput: '1500',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Salaried executive 12500 -> 12500',
        input: '1 12500',
        expectedOutput: '12500',
        isHidden: true
      }
    ],
    conceptChecks: [
      {
        id: 'has-virtual-function',
        description: 'Must use virtual function for pay calculation',
        pattern: 'virtual\\s+.*getPay',
        message: 'You must declare getPay() as virtual in the Employee base class.'
      },
      {
        id: 'has-inheritance',
        description: 'Must inherit from Employee',
        pattern: ':\\s*(public|protected|private)\\s+Employee',
        message: 'SalariedEmployee and HourlyEmployee must inherit from Employee.'
      }
    ],
    hints: [
      'How does runtime polymorphism allow calling derived behavior through a base pointer?',
      'Declare virtual double getPay() = 0; in class Employee.',
      'Instantiate the derived class and assign its address to Employee* emp; then call emp->getPay().'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Employee {\npublic:\n  virtual double getPay() = 0;\n  virtual ~Employee() {}\n};\n\nclass SalariedEmployee : public Employee {\n  double salary;\npublic:\n  SalariedEmployee(double s) : salary(s) {}\n  double getPay() override { return salary; }\n};\n\nclass HourlyEmployee : public Employee {\n  double hours, rate;\npublic:\n  HourlyEmployee(double h, double r) : hours(h), rate(r) {}\n  double getPay() override { return hours * rate; }\n};\n\nint main() {\n  int type;\n  if (cin >> type) {\n    Employee* emp = nullptr;\n    if (type == 1) {\n      double s;\n      cin >> s;\n      emp = new SalariedEmployee(s);\n    } else {\n      double h, r;\n      cin >> h >> r;\n      emp = new HourlyEmployee(h, r);\n    }\n    cout << emp->getPay() << endl;\n    delete emp;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['inheritance', 'runtime-polymorphism']
  },

  // ==========================================
  // MASTERY ASSESSMENT CATALOG (Syllabus-spanning)
  // ==========================================
  'mastery-student-manager': {
    id: 'mastery-student-manager',
    title: 'Mastery: Student Grade Manager',
    concepts: ['classes', 'constructors', 'methods', 'cin', 'cout'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Write a complete C++ program to manage student grades. Read an integer N representing the number of scores, followed by N space-separated integer scores. Calculate and print the highest score, the lowest score, and the integer average (truncated sum / N), separated by spaces.',
    constraints: ['1 <= N <= 100', 'Each score is between 0 and 100.'],
    inputFormat: 'N followed by N scores.',
    outputFormat: 'max min avg (separated by space)',
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n  // Implement complete program\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: 3 scores: 80 90 100',
        input: '3 80 90 100',
        expectedOutput: '100 80 90',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible: 4 scores: 50 60 70 80',
        input: '4 50 60 70 80',
        expectedOutput: '80 50 65',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: single score (1 75 -> 75 75 75)',
        input: '1 75',
        expectedOutput: '75 75 75',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: multiple identical scores',
        input: '5 40 40 40 40 40',
        expectedOutput: '40 40 40',
        isHidden: true
      },
      {
        id: 'test-5',
        description: 'Hidden test: varied scores',
        input: '5 10 90 20 80 50',
        expectedOutput: '90 10 50',
        isHidden: true
      }
    ],
    hints: [
      'What variables do you need to maintain as you iterate through the scores?',
      'Keep track of max_val, min_val, and total_sum in a loop.',
      'Initialize max_val = -1, min_val = 101, read each score, update max and min, then print max min (sum / N).'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int n;\n  if (cin >> n && n > 0) {\n    int sum = 0, val;\n    int mx = -1, mn = 1000;\n    for (int i = 0; i < n; ++i) {\n      cin >> val;\n      sum += val;\n      if (val > mx) mx = val;\n      if (val < mn) mn = val;\n    }\n    cout << mx << " " << mn << " " << (sum / n) << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['loops', 'variables', 'arithmetic']
  },

  'mastery-bank-hierarchy': {
    id: 'mastery-bank-hierarchy',
    title: 'Mastery: Bank Account Hierarchy',
    concepts: ['inheritance', 'constructors', 'access-control', 'classes'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Implement a banking system with a base class BankAccount that tracks balance with a deposit() method. Create a derived class SavingsAccount that has an interest rate percentage and an addInterest() method. Read initial balance, deposit amount, and interest percentage. Output the final balance after deposit and applying interest (truncated to integer).',
    constraints: ['All amounts are non-negative numbers.'],
    inputFormat: 'initial_balance deposit_amount interest_percent',
    outputFormat: 'Final integer balance.',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: 1000 initial, 500 deposit, 10% interest -> 1650',
        input: '1000 500 10',
        expectedOutput: '1650',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Hidden test: 2000 initial, 0 deposit, 5% interest -> 2100',
        input: '2000 0 5',
        expectedOutput: '2100',
        isHidden: true
      },
      {
        id: 'test-3',
        description: 'Hidden test: 500 initial, 500 deposit, 0% interest -> 1000',
        input: '500 500 0',
        expectedOutput: '1000',
        isHidden: true
      }
    ],
    conceptChecks: [
      {
        id: 'has-inheritance',
        description: 'SavingsAccount inherits from BankAccount',
        pattern: 'class\\s+SavingsAccount\\s*:\\s*(public|protected|private)\\s+BankAccount',
        message: 'SavingsAccount must inherit from BankAccount.'
      }
    ],
    hints: [
      'How should balance be shared with derived classes?',
      'Make balance protected in BankAccount so SavingsAccount can directly access or calculate with it.',
      'Deposit first, then add balance * (interest / 100.0) to balance, and cast to int.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass BankAccount {\nprotected:\n  double balance;\npublic:\n  BankAccount(double b) : balance(b) {}\n  void deposit(double amount) { balance += amount; }\n  double getBalance() const { return balance; }\n};\n\nclass SavingsAccount : public BankAccount {\n  double interestRate;\npublic:\n  SavingsAccount(double b, double rate) : BankAccount(b), interestRate(rate) {}\n  void addInterest() { balance += balance * (interestRate / 100.0); }\n};\n\nint main() {\n  double init, dep, rate;\n  if (cin >> init >> dep >> rate) {\n    SavingsAccount sa(init, rate);\n    sa.deposit(dep);\n    sa.addInterest();\n    cout << (long long)sa.getBalance() << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['inheritance', 'constructors']
  },

  'mastery-complex-calculator': {
    id: 'mastery-complex-calculator',
    title: 'Mastery: Complex Number Operator Overloading',
    concepts: ['operator-overloading', 'classes', 'constructors'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Implement a Complex class with real and imag parts. Overload operator+ to add two Complex numbers. Read real1, imag1, real2, imag2. Output the result in the format: "<real>+<imag>i" or "<real>-<imag>i".',
    constraints: ['Input parts are integers.'],
    inputFormat: 'r1 i1 r2 i2',
    outputFormat: '<r>+<i>i or <r>-<i>i',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: 3 4 1 2 -> 4+6i',
        input: '3 4 1 2',
        expectedOutput: '4+6i',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible: 5 -3 2 -1 -> 7-4i',
        input: '5 -3 2 -1',
        expectedOutput: '7-4i',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: negative real 10 5 -15 2 -> -5+7i',
        input: '10 5 -15 2',
        expectedOutput: '-5+7i',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: zero parts 0 0 0 0 -> 0+0i',
        input: '0 0 0 0',
        expectedOutput: '0+0i',
        isHidden: true
      }
    ],
    conceptChecks: [
      {
        id: 'has-operator-plus',
        description: 'Must overload operator+',
        pattern: 'operator\\s*\\+',
        message: 'You must overload operator+ for adding Complex numbers.'
      }
    ],
    hints: [
      'What is the formula for adding complex numbers (a + bi) + (c + di)?',
      'The real sum is a + c, and the imaginary sum is b + d.',
      'Create a member function named operator+ taking const Complex& other that returns a new Complex object with the sum of the real parts and the sum of the imaginary parts.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Complex {\npublic:\n  int real, imag;\n  Complex(int r = 0, int i = 0) : real(r), imag(i) {}\n  Complex operator+(const Complex& o) const {\n    return Complex(real + o.real, imag + o.imag);\n  }\n};\n\nint main() {\n  int r1, i1, r2, i2;\n  if (cin >> r1 >> i1 >> r2 >> i2) {\n    Complex c1(r1, i1), c2(r2, i2);\n    Complex c3 = c1 + c2;\n    if (c3.imag >= 0) {\n      cout << c3.real << "+" << c3.imag << "i" << endl;\n    } else {\n      cout << c3.real << c3.imag << "i" << endl;\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['operator-overloading', 'classes']
  },

  // ==========================================
  // LESSON 18: Overload << and >>
  // ==========================================
  'streams-mini': {
    id: 'streams-mini',
    title: 'Point Stream Output (operator<<)',
    syllabusModule: 'Polymorphism',
    concepts: ['stream-operators', 'operator-overloading', 'classes', 'cout'],
    difficulty: 'easy',
    level: 2,
    problemStatement: 'Overload the stream insertion operator operator<< for a class Point representing a 2D coordinate (x, y). The operator should format the output as (x, y). In main(), read two integers a and b, construct Point p(a, b), and print "Point: " followed by p.',
    constraints: ['Must overload operator<<(ostream&, const Point&) as a non-member or friend function.'],
    inputFormat: 'Two space-separated integers a b.',
    outputFormat: 'Point: (a, b)',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Point {\n  int x, y;\npublic:\n  Point(int x_ = 0, int y_ = 0) : x(x_), y(y_) {}\n  // TODO: Overload operator<< as a friend function\n};\n\nint main() {\n  int a, b;\n  if (cin >> a >> b) {\n    Point p(a, b);\n    cout << "Point: " << p << endl;\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: (3, 7)',
        input: '3 7',
        expectedOutput: 'Point: (3, 7)',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: origin (0, 0)',
        input: '0 0',
        expectedOutput: 'Point: (0, 0)',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: negative coordinates (-5, 12)',
        input: '-5 12',
        expectedOutput: 'Point: (-5, 12)',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: mixed large coordinates',
        input: '100 -200',
        expectedOutput: 'Point: (100, -200)',
        isHidden: true
      }
    ],
    conceptChecks: [
      {
        id: 'has-stream-insertion',
        description: 'Must overload operator<<',
        pattern: 'operator\\s*<<',
        message: 'You must overload operator<< for class Point.'
      }
    ],
    expectedBehavior: 'Overloads stream insertion operator to print Point objects in (x, y) format.',
    hints: [
      'Stream insertion operator<< takes ostream& as its first parameter and const Point& as its second.',
      'Declare it as friend ostream& operator<<(ostream& os, const Point& p) inside class Point.',
      'Output "(" << p.x << ", " << p.y << ")" to os and return os.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Point {\n  int x, y;\npublic:\n  Point(int x_ = 0, int y_ = 0) : x(x_), y(y_) {}\n  friend ostream& operator<<(ostream& os, const Point& p) {\n    os << "(" << p.x << ", " << p.y << ")";\n    return os;\n  }\n};\n\nint main() {\n  int a, b;\n  if (cin >> a >> b) {\n    Point p(a, b);\n    cout << "Point: " << p << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['operator-overloading', 'classes', 'cout'],
    isIndependent: false,
    isMultiConcept: false
  },

  'streams-medium': {
    id: 'streams-medium',
    title: 'Chained Fraction Stream Extraction & Insertion',
    syllabusModule: 'Polymorphism',
    concepts: ['stream-operators', 'operator-overloading', 'classes', 'cin', 'cout'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Implement a Fraction class with numerator and denominator. Overload: (1) istream& operator>>(istream& is, Fraction& f) to read num and den. (2) ostream& operator<<(ostream& os, const Fraction& f) to write num/den. Both operators must return stream references to support chained stream operations (e.g. cin >> f1 >> f2; cout << f1 << " + " << f2;). In main(), read two fractions from input and print them in the format "<f1> + <f2>".',
    constraints: ['Both operators must return stream references to support chaining.'],
    inputFormat: 'Four integers: n1 d1 n2 d2',
    outputFormat: 'n1/d1 + n2/d2',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Fraction {\n  int num, den;\npublic:\n  Fraction(int n = 0, int d = 1) : num(n), den(d) {}\n  // TODO: Overload operator>> and operator<<\n};\n\nint main() {\n  Fraction f1, f2;\n  if (cin >> f1 >> f2) {\n    cout << f1 << " + " << f2 << endl;\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: 1/2 and 3/4',
        input: '1 2 3 4',
        expectedOutput: '1/2 + 3/4',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: whole number and fraction (5/1 + 2/3)',
        input: '5 1 2 3',
        expectedOutput: '5/1 + 2/3',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: identical denominators (7/8 + 1/8)',
        input: '7 8 1 8',
        expectedOutput: '7/8 + 1/8',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: negative numerator (-3/5 + 4/9)',
        input: '-3 5 4 9',
        expectedOutput: '-3/5 + 4/9',
        isHidden: true
      }
    ],
    conceptChecks: [
      {
        id: 'has-stream-extraction',
        description: 'Must overload operator>>',
        pattern: 'operator\\s*>>',
        message: 'You must overload operator>> for Fraction extraction.'
      }
    ],
    expectedBehavior: 'Overloads chained >> and << stream operators for Fraction input and output.',
    hints: [
      'Both stream extraction >> and insertion << must return their stream reference parameter (is or os).',
      'Declare friend istream& operator>>(istream& is, Fraction& f) and friend ostream& operator<<(ostream& os, const Fraction& f).',
      'In >>, read is >> f.num >> f.den; and in <<, send os << f.num << "/" << f.den; returning the stream reference.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Fraction {\n  int num, den;\npublic:\n  Fraction(int n = 0, int d = 1) : num(n), den(d) {}\n  friend istream& operator>>(istream& is, Fraction& f) {\n    is >> f.num >> f.den;\n    return is;\n  }\n  friend ostream& operator<<(ostream& os, const Fraction& f) {\n    os << f.num << "/" << f.den;\n    return os;\n  }\n};\n\nint main() {\n  Fraction f1, f2;\n  if (cin >> f1 >> f2) {\n    cout << f1 << " + " << f2 << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['stream-operators', 'classes'],
    isIndependent: false,
    isMultiConcept: true
  },

  'streams-hard': {
    id: 'streams-hard',
    title: 'Vector2D Stream Pipeline & Addition',
    syllabusModule: 'Polymorphism',
    concepts: ['stream-operators', 'operator-overloading', 'classes', 'binary-operators'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Design a complete Vector2D class with int x, y. Overload: (1) operator>> to read x and y. (2) operator<< to format output as "<x, y>". (3) operator+ to return component-wise sum of two vectors. In main(), read an integer N (the number of vector pairs). For each pair, read two vectors v1 and v2, compute v3 = v1 + v2, and print "<v1> + <v2> = <v3>" on a new line.',
    constraints: ['All vector coordinates are integers.'],
    inputFormat: 'N followed by N sets of 4 integers (x1 y1 x2 y2).',
    outputFormat: 'N lines formatted as <x1, y1> + <x2, y2> = <x3, y3>',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write complete Vector2D class and vector stream addition program\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: 2 pairs of vectors',
        input: '2\n1 2 3 4\n5 -1 -2 3',
        expectedOutput: '<1, 2> + <3, 4> = <4, 6>\n<5, -1> + <-2, 3> = <3, 2>',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: zero vector addition',
        input: '1\n0 0 0 0',
        expectedOutput: '<0, 0> + <0, 0> = <0, 0>',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: opposing vectors canceling out',
        input: '2\n10 20 -10 -20\n7 8 1 2',
        expectedOutput: '<10, 20> + <-10, -20> = <0, 0>\n<7, 8> + <1, 2> = <8, 10>',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: all negative vector coordinates',
        input: '1\n-5 -10 -15 -20',
        expectedOutput: '<-5, -10> + <-15, -20> = <-20, -30>',
        isHidden: true
      }
    ],
    expectedBehavior: 'Parses, adds, and prints Vector2D pairs using overloaded >>, +, and <<.',
    hints: [
      'Overload operator>> to read x and y, operator<< to display <x, y>, and operator+ to add coordinates.',
      'Inside main, loop N times reading Vector2D v1, v2 using cin >> v1 >> v2.',
      'Output v1 << " + " << v2 << " = " << (v1 + v2) << endl; directly using the overloaded stream insertion operator.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Vector2D {\npublic:\n  int x, y;\n  Vector2D(int x_ = 0, int y_ = 0) : x(x_), y(y_) {}\n  Vector2D operator+(const Vector2D& o) const {\n    return Vector2D(x + o.x, y + o.y);\n  }\n  friend istream& operator>>(istream& is, Vector2D& v) {\n    is >> v.x >> v.y;\n    return is;\n  }\n  friend ostream& operator<<(ostream& os, const Vector2D& v) {\n    os << "<" << v.x << ", " << v.y << ">";\n    return os;\n  }\n};\n\nint main() {\n  int n;\n  if (cin >> n) {\n    for (int i = 0; i < n; i++) {\n      Vector2D v1, v2;\n      if (cin >> v1 >> v2) {\n        Vector2D v3 = v1 + v2;\n        cout << v1 << " + " << v2 << " = " << v3 << endl;\n      }\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['stream-operators', 'operator-overloading', 'classes'],
    isIndependent: true,
    isMultiConcept: true
  },

  // ==========================================
  // LESSON 20: Runtime polymorphism & virtual destructors
  // ==========================================
  'runtime-mini': {
    id: 'runtime-mini',
    title: 'Fix Virtual Dispatch in Base Pointer Call',
    syllabusModule: 'Polymorphism',
    concepts: ['runtime-polymorphism', 'virtual-functions', 'base-pointers', 'inheritance'],
    difficulty: 'easy',
    level: 2,
    problemStatement: 'In the starter program, a pointer of type Animal* points to a Dog or Cat object. However, when calling ptr->speak(), it always prints "Animal sound" instead of the derived sound, because the base class function is missing the virtual keyword! Repair the hierarchy: (1) Add virtual to speak() in Animal. (2) In Dog, speak() outputs "Woof". (3) In Cat, speak() outputs "Meow". In main(), read a string ("dog" or "cat"), allocate the object via Animal* ptr, call speak(), and delete the object.',
    constraints: ['Must declare virtual void speak() in Animal.'],
    inputFormat: 'A string ("dog" or "cat").',
    outputFormat: 'Single line: "Woof" or "Meow" (or "Unknown").',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Animal {\npublic:\n  // BUG: Missing virtual keyword causes static binding\n  void speak() { cout << "Animal sound" << endl; }\n};\n\nclass Dog : public Animal {\npublic:\n  void speak() { cout << "Woof" << endl; }\n};\n\nclass Cat : public Animal {\npublic:\n  void speak() { cout << "Meow" << endl; }\n};\n\nint main() {\n  string type;\n  if (cin >> type) {\n    Animal* ptr = nullptr;\n    if (type == "dog") ptr = new Dog();\n    else if (type == "cat") ptr = new Cat();\n    else { cout << "Unknown" << endl; return 0; }\n\n    ptr->speak();\n    delete ptr;\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: dog -> Woof',
        input: 'dog',
        expectedOutput: 'Woof',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: cat -> Meow',
        input: 'cat',
        expectedOutput: 'Meow',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: repeated dog input',
        input: 'dog',
        expectedOutput: 'Woof',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: unhandled creature type',
        input: 'bird',
        expectedOutput: 'Unknown',
        isHidden: true
      }
    ],
    expectedBehavior: 'Enables runtime polymorphism by declaring base method virtual, dispatching to derived speak().',
    hints: [
      'Why does Animal* call Animal::speak() even when pointing to a Dog object?',
      'Without virtual, C++ uses compile-time static binding based on the pointer type (Animal*).',
      'Add virtual before void speak() in Animal, and add a virtual destructor virtual ~Animal() {} for safe deletion.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Animal {\npublic:\n  virtual void speak() { cout << "Animal sound" << endl; }\n  virtual ~Animal() {}\n};\n\nclass Dog : public Animal {\npublic:\n  void speak() override { cout << "Woof" << endl; }\n};\n\nclass Cat : public Animal {\npublic:\n  void speak() override { cout << "Meow" << endl; }\n};\n\nint main() {\n  string type;\n  if (cin >> type) {\n    Animal* ptr = nullptr;\n    if (type == "dog") ptr = new Dog();\n    else if (type == "cat") ptr = new Cat();\n    else { cout << "Unknown" << endl; return 0; }\n\n    ptr->speak();\n    delete ptr;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['inheritance', 'virtual-functions'],
    isIndependent: false,
    isMultiConcept: false
  },

  'runtime-medium': {
    id: 'runtime-medium',
    title: 'Virtual Destructor in Dynamic Polymorphic Hierarchy',
    syllabusModule: 'Polymorphism',
    concepts: ['virtual-destructors', 'runtime-polymorphism', 'destructors', 'base-pointers', 'inheritance', 'cleanup'],
    difficulty: 'medium',
    level: 4,
    problemStatement: 'When deleting a derived object via a base pointer (BaseDevice* dev = new SmartDevice(id); delete dev;), if the base destructor is not virtual, undefined behavior occurs and the derived destructor is skipped, leaking derived resources! Implement: (1) Base class BaseDevice with virtual ~BaseDevice() printing "BaseDevice shutdown". (2) Derived class SmartDevice publicly inheriting from BaseDevice, allocating dynamic memory in constructor, and in ~SmartDevice() releasing it and printing "SmartDevice buffer freed". In main(), read integer id, allocate SmartDevice via BaseDevice*, and delete dev. Verify BOTH destructors execute in proper order.',
    constraints: ['Base destructor must be declared virtual ~BaseDevice().'],
    inputFormat: 'A single integer id.',
    outputFormat: 'Line 1: SmartDevice <id> initialized\nLine 2: SmartDevice buffer freed\nLine 3: BaseDevice shutdown',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Implement BaseDevice with virtual destructor and SmartDevice with heap buffer\n\nint main() {\n  int id;\n  if (cin >> id) {\n    // Allocate SmartDevice via BaseDevice pointer and delete it\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: id 101',
        input: '101',
        expectedOutput: 'SmartDevice 101 initialized\nSmartDevice buffer freed\nBaseDevice shutdown',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: id 42',
        input: '42',
        expectedOutput: 'SmartDevice 42 initialized\nSmartDevice buffer freed\nBaseDevice shutdown',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: single digit id 7',
        input: '7',
        expectedOutput: 'SmartDevice 7 initialized\nSmartDevice buffer freed\nBaseDevice shutdown',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: large id 999',
        input: '999',
        expectedOutput: 'SmartDevice 999 initialized\nSmartDevice buffer freed\nBaseDevice shutdown',
        isHidden: true
      }
    ],
    conceptChecks: [
      {
        id: 'has-virtual-destructor',
        description: 'Base destructor must be virtual',
        pattern: 'virtual\\s+~BaseDevice',
        message: 'BaseDevice destructor must be declared virtual.'
      }
    ],
    expectedBehavior: 'Executes derived and base destructors polymorphically via base pointer deletion.',
    hints: [
      'Declare virtual ~BaseDevice() in BaseDevice so delete calls the derived destructor first.',
      'In SmartDevice constructor, allocate buffer with new int(id_) and print the initialized message.',
      'In ~SmartDevice(), delete buffer and print "SmartDevice buffer freed" before base destructor executes.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass BaseDevice {\npublic:\n  virtual ~BaseDevice() {\n    cout << "BaseDevice shutdown" << endl;\n  }\n};\n\nclass SmartDevice : public BaseDevice {\n  int* buffer;\n  int id;\npublic:\n  SmartDevice(int id_) : id(id_), buffer(new int(id_)) {\n    cout << "SmartDevice " << id << " initialized" << endl;\n  }\n  ~SmartDevice() override {\n    delete buffer;\n    cout << "SmartDevice buffer freed" << endl;\n  }\n};\n\nint main() {\n  int id;\n  if (cin >> id) {\n    BaseDevice* dev = new SmartDevice(id);\n    delete dev;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['virtual-destructors', 'runtime-polymorphism', 'inheritance'],
    isIndependent: false,
    isMultiConcept: true
  },

  'runtime-hard': {
    id: 'runtime-hard',
    title: 'Polymorphic Shape Renderer & Virtual Cleanup',
    syllabusModule: 'Polymorphism',
    concepts: ['runtime-polymorphism', 'virtual-destructors', 'pure-virtual-functions', 'base-pointers', 'inheritance'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Design an independent polymorphic shape hierarchy: (1) Abstract base class Shape with pure virtual double area() const = 0; and virtual destructor virtual ~Shape(). (2) Derived class Rectangle with width and height, implementing area() as w * h. (3) Derived class Circle with radius, implementing area() as 3.14 * r * r. In main(), read integer N. For each shape, read "R <w> <h>" or "C <r>", instantiate dynamically, and store in a heap array of Shape* pointers. Print each area formatted as "Area: <int(area)>", and finally delete every shape polymorphically to ensure zero memory leaks.',
    constraints: ['Must use dynamic dispatch and polymorphic base pointer deletion.'],
    inputFormat: 'N followed by N shape entries: R w h OR C r',
    outputFormat: 'N lines formatted as Area: <val>',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write complete polymorphic Shape hierarchy with virtual destructor\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible sample: 1 Rectangle and 1 Circle',
        input: '2\nR 4 5\nC 10',
        expectedOutput: 'Area: 20\nArea: 314',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible sample: 3 shapes mixed order',
        input: '3\nC 1\nR 10 2\nC 5',
        expectedOutput: 'Area: 3\nArea: 20\nArea: 78',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Single large rectangle',
        input: '1\nR 7 8',
        expectedOutput: 'Area: 56',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Zero dimension shapes',
        input: '2\nC 0\nR 0 10',
        expectedOutput: 'Area: 0\nArea: 0',
        isHidden: true
      }
    ],
    expectedBehavior: 'Instantiates derived shapes via base pointers, evaluates dynamic areas, and polymorphically cleans up.',
    hints: [
      'Declare class Shape with virtual double area() const = 0; and virtual ~Shape() {}.',
      'Inherit Rectangle and Circle publicly from Shape, overriding area() with their respective formulas.',
      'Store Shape* pointers in an array (Shape** shapes = new Shape*[n];), call shapes[i]->area(), and delete shapes[i] in a loop.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Shape {\npublic:\n  virtual double area() const = 0;\n  virtual ~Shape() {}\n};\n\nclass Rectangle : public Shape {\n  double w, h;\npublic:\n  Rectangle(double w_, double h_) : w(w_), h(h_) {}\n  double area() const override { return w * h; }\n};\n\nclass Circle : public Shape {\n  double r;\npublic:\n  Circle(double r_) : r(r_) {}\n  double area() const override { return 3.14 * r * r; }\n};\n\nint main() {\n  int n;\n  if (cin >> n && n > 0) {\n    Shape** shapes = new Shape*[n];\n    for (int i = 0; i < n; i++) {\n      char type;\n      cin >> type;\n      if (type == 'R' || type == 'r') {\n        double w, h;\n        cin >> w >> h;\n        shapes[i] = new Rectangle(w, h);\n      } else {\n        double r;\n        cin >> r;\n        shapes[i] = new Circle(r);\n      }\n    }\n    for (int i = 0; i < n; i++) {\n      cout << "Area: " << (long long)shapes[i]->area() << endl;\n    }\n    for (int i = 0; i < n; i++) {\n      delete shapes[i];\n    }\n    delete[] shapes;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['runtime-polymorphism', 'inheritance', 'virtual-destructors'],
    isIndependent: true,
    isMultiConcept: true
  },

  // ==========================================
  // MODULE 3: CLASSES & OBJECTS
  // ==========================================

  // Lesson 5: classes (MEDIUM)
  'classes-medium': {
    id: 'classes-medium',
    title: 'Rectangle Geometry & Dimension Validation',
    concepts: ['classes', 'methods', 'member-variables', 'access-control'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Design a class Rectangle with private integer member variables width and height. Implement a method setDimensions(int w, int h) that validates the inputs: if either width or height is less than or equal to 0, default that dimension to 1. Implement public methods int area() const, int perimeter() const, and void display() const that outputs "Width: <w>, Height: <h>, Area: <a>, Perimeter: <p>".',
    constraints: [
      'Member variables width and height must remain private.',
      'Dimensions <= 0 must default to 1.',
      'Output must match format exactly on a single line.'
    ],
    inputFormat: 'Two space-separated integers w and h.',
    outputFormat: 'Single line: Width: <w>, Height: <h>, Area: <a>, Perimeter: <p>',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Rectangle {\nprivate:\n  // TODO: Declare private width and height\npublic:\n  // TODO: Implement setDimensions, area, perimeter, and display\n};\n\nint main() {\n  int w, h;\n  if (cin >> w >> h) {\n    Rectangle rect;\n    rect.setDimensions(w, h);\n    rect.display();\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Standard positive dimensions',
        input: '5 4',
        expectedOutput: 'Width: 5, Height: 4, Area: 20, Perimeter: 18',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Negative width corrected to 1',
        input: '-3 6',
        expectedOutput: 'Width: 1, Height: 6, Area: 6, Perimeter: 14',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: large dimensions',
        input: '10 20',
        expectedOutput: 'Width: 10, Height: 20, Area: 200, Perimeter: 60',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: zero dimensions both corrected to 1',
        input: '0 0',
        expectedOutput: 'Width: 1, Height: 1, Area: 1, Perimeter: 4',
        isHidden: true
      }
    ],
    expectedBehavior: 'Enforces invariant that width and height are >= 1 and displays computed area and perimeter.',
    hints: [
      'Which access specifier keeps data members protected from arbitrary external assignment?',
      'In setDimensions, check each parameter individually: if w <= 0 set width = 1, otherwise set width = w.',
      'Compute area as width * height and perimeter as 2 * (width + height).'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Rectangle {\nprivate:\n  int width;\n  int height;\npublic:\n  void setDimensions(int w, int h) {\n    width = (w > 0) ? w : 1;\n    height = (h > 0) ? h : 1;\n  }\n  int area() const {\n    return width * height;\n  }\n  int perimeter() const {\n    return 2 * (width + height);\n  }\n  void display() const {\n    cout << "Width: " << width << ", Height: " << height\n         << ", Area: " << area() << ", Perimeter: " << perimeter();\n  }\n};\n\nint main() {\n  int w, h;\n  if (cin >> w >> h) {\n    Rectangle rect;\n    rect.setDimensions(w, h);\n    rect.display();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'access-control']
  },

  // Lesson 5: classes (HARD) - Independent
  'classes-hard': {
    id: 'classes-hard',
    title: 'Inventory Item Stock & Valuation Engine',
    concepts: ['classes', 'objects', 'access-control', 'methods'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Build an inventory tracker that receives an item code (string), unit price (integer), and initial stock quantity (integer). Then process a sequence of commands until standard input ends:\\n- "R <qty>": restock by adding qty to stock\\n- "S <qty>": sell qty if stock >= qty; if stock < qty, print "Error: Insufficient stock" and do not modify stock\\n- "V": display current item valuation\\nWhen "V" is received, output: "Code: <code>, Stock: <stock>, Value: <stock * price>".',
    constraints: [
      'Must maintain item code, price, and current stock safely encapsulated.',
      'Selling more than available stock must output the error message without reducing stock.',
      'Valuation equals stock multiplied by unit price.'
    ],
    inputFormat: '<code:string> <price:int> <initial_stock:int> followed by commands "R <qty>", "S <qty>", or "V".',
    outputFormat: 'Error messages on sell failures and "Code: <code>, Stock: <stock>, Value: <val>" on "V".',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Restock, sell, and valuation',
        input: 'SKU101 15 20\nR 10\nS 5\nV',
        expectedOutput: 'Code: SKU101, Stock: 25, Value: 375',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Insufficient stock error handling',
        input: 'ITEM7 50 10\nS 15\nV',
        expectedOutput: 'Error: Insufficient stock\nCode: ITEM7, Stock: 10, Value: 500',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: exact depletion to zero stock',
        input: 'PROD1 100 0\nR 50\nS 50\nV',
        expectedOutput: 'Code: PROD1, Stock: 0, Value: 0',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: multiple transactions with rejected overdraft',
        input: 'A1 25 100\nS 30\nS 80\nR 20\nS 40\nV',
        expectedOutput: 'Error: Insufficient stock\nCode: A1, Stock: 50, Value: 1250',
        isHidden: true
      }
    ],
    expectedBehavior: 'Encapsulates stock transactions, rejects overdrafts, and reports accurate inventory valuation.',
    hints: [
      'Model the item with a class storing code, price, and current stock in private members.',
      'Write member methods restock(int qty), sell(int qty), and displayValuation().',
      'In a loop while (cin >> command), branch on the command character and invoke the matching method.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass InventoryItem {\nprivate:\n  string code;\n  int unitPrice;\n  int stock;\npublic:\n  InventoryItem(string c, int p, int s) : code(c), unitPrice(p), stock(s) {}\n  void restock(int qty) {\n    stock += qty;\n  }\n  void sell(int qty) {\n    if (qty > stock) {\n      cout << "Error: Insufficient stock" << endl;\n    } else {\n      stock -= qty;\n    }\n  }\n  void displayValuation() const {\n    cout << "Code: " << code << ", Stock: " << stock << ", Value: " << (stock * unitPrice) << endl;\n  }\n};\n\nint main() {\n  string code;\n  int price, stock;\n  if (cin >> code >> price >> stock) {\n    InventoryItem item(code, price, stock);\n    char cmd;\n    while (cin >> cmd) {\n      if (cmd == 'R') {\n        int qty;\n        cin >> qty;\n        item.restock(qty);\n      } else if (cmd == 'S') {\n        int qty;\n        cin >> qty;\n        item.sell(qty);\n      } else if (cmd == 'V') {\n        item.displayValuation();\n      }\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'objects', 'access-control'],
    isIndependent: true
  },

  // Lesson 7: member-functions (MINI) - Debugging
  'member-functions-mini': {
    id: 'member-functions-mini',
    title: 'Fix Outside Member Function Scope Resolution',
    concepts: ['member-functions', 'classes', 'scope-resolution'],
    difficulty: 'easy',
    level: 1,
    problemStatement: 'The starter code declares a member function calculateTotal(int tax) inside class Bill, but defines it outside without the Bill:: scope resolution qualifier, causing a compiler error. Fix the outside definition so it properly belongs to class Bill.',
    constraints: [
      'Must define calculateTotal outside class Bill using the :: scope operator.',
      'Must not move the entire definition back inside the class declaration.'
    ],
    inputFormat: 'Two integers: subtotal and tax.',
    outputFormat: 'Total: <subtotal + tax>',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Bill {\nprivate:\n  int subtotal;\npublic:\n  Bill(int s) : subtotal(s) {}\n  int calculateTotal(int tax);\n};\n\n// BUG: Missing class scope resolution qualifier\nint calculateTotal(int tax) {\n  return subtotal + tax;\n}\n\nint main() {\n  int sub, tax;\n  if (cin >> sub >> tax) {\n    Bill b(sub);\n    cout << "Total: " << b.calculateTotal(tax);\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Standard bill subtotal and tax',
        input: '100 15',
        expectedOutput: 'Total: 115',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Higher bill amounts',
        input: '250 25',
        expectedOutput: 'Total: 275',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: zero subtotal with minimal tax',
        input: '0 5',
        expectedOutput: 'Total: 5',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: boundary sum',
        input: '999 1',
        expectedOutput: 'Total: 1000',
        isHidden: true
      }
    ],
    expectedBehavior: 'Compiles cleanly with outside member function definition using ClassName:: syntax.',
    hints: [
      'Why does the compiler say subtotal was not declared in this scope in calculateTotal?',
      'When defining a member function outside its class, precede the function name with the class name and ::.',
      'Change int calculateTotal(int tax) to int Bill::calculateTotal(int tax).'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Bill {\nprivate:\n  int subtotal;\npublic:\n  Bill(int s) : subtotal(s) {}\n  int calculateTotal(int tax);\n};\n\nint Bill::calculateTotal(int tax) {\n  return subtotal + tax;\n}\n\nint main() {\n  int sub, tax;\n  if (cin >> sub >> tax) {\n    Bill b(sub);\n    cout << "Total: " << b.calculateTotal(tax);\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'member-functions', 'scope-resolution']
  },

  // Lesson 7: member-functions (MEDIUM)
  'member-functions-medium': {
    id: 'member-functions-medium',
    title: 'Separate Interface from Implementation in Bank Account',
    concepts: ['member-functions', 'classes', 'methods', 'scope-resolution'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Implement a BankAccount class where member functions are declared inside the class declaration and defined outside using the BankAccount:: scope resolution operator. Required member functions: constructor BankAccount(string accNum, int initialBal), void deposit(int amount), bool withdraw(int amount), and void display() const. withdraw() returns true and deducts amount if balance >= amount, otherwise returns false without modifying balance. display() outputs "Account: <accNum>, Balance: <balance>".',
    constraints: [
      'All member functions must be defined outside the class body using BankAccount::.',
      'Withdrawal must not allow overdraft.'
    ],
    inputFormat: '<accNum:string> <initialBal:int> <depositAmount:int> <withdrawAmount:int>',
    outputFormat: 'Withdrawal status followed by Account: <accNum>, Balance: <balance>',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass BankAccount {\nprivate:\n  string accNumber;\n  int balance;\npublic:\n  BankAccount(string accNum, int initialBal);\n  void deposit(int amount);\n  bool withdraw(int amount);\n  void display() const;\n};\n\n// TODO: Define all 4 member functions outside the class using BankAccount::\n\nint main() {\n  string acc;\n  int initB, dep, with;\n  if (cin >> acc >> initB >> dep >> with) {\n    BankAccount ba(acc, initB);\n    ba.deposit(dep);\n    bool ok = ba.withdraw(with);\n    cout << "Withdrawal: " << (ok ? "Success" : "Failed") << endl;\n    ba.display();\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Successful deposit and withdrawal',
        input: 'ACC101 500 200 150',
        expectedOutput: 'Withdrawal: Success\nAccount: ACC101, Balance: 550',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Failed withdrawal exceeding balance',
        input: 'ACC102 300 50 400',
        expectedOutput: 'Withdrawal: Failed\nAccount: ACC102, Balance: 350',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: exact balance withdrawal',
        input: 'SAV99 1000 0 1000',
        expectedOutput: 'Withdrawal: Success\nAccount: SAV99, Balance: 0',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: failed withdrawal after deposit',
        input: 'CHK01 100 50 200',
        expectedOutput: 'Withdrawal: Failed\nAccount: CHK01, Balance: 150',
        isHidden: true
      }
    ],
    expectedBehavior: 'Declares class interface cleanly and provides external implementations with BankAccount::.',
    hints: [
      'Write the constructor outside as BankAccount::BankAccount(string accNum, int initialBal) : accNumber(accNum), balance(initialBal) {}.',
      'For withdraw, check if balance >= amount before deducting and returning true.',
      'Remember to include the const qualifier on BankAccount::display() const.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass BankAccount {\nprivate:\n  string accNumber;\n  int balance;\npublic:\n  BankAccount(string accNum, int initialBal);\n  void deposit(int amount);\n  bool withdraw(int amount);\n  void display() const;\n};\n\nBankAccount::BankAccount(string accNum, int initialBal) : accNumber(accNum), balance(initialBal) {}\n\nvoid BankAccount::deposit(int amount) {\n  balance += amount;\n}\n\nbool BankAccount::withdraw(int amount) {\n  if (balance >= amount) {\n    balance -= amount;\n    return true;\n  }\n  return false;\n}\n\nvoid BankAccount::display() const {\n  cout << "Account: " << accNumber << ", Balance: " << balance;\n}\n\nint main() {\n  string acc;\n  int initB, dep, with;\n  if (cin >> acc >> initB >> dep >> with) {\n    BankAccount ba(acc, initB);\n    ba.deposit(dep);\n    bool ok = ba.withdraw(with);\n    cout << "Withdrawal: " << (ok ? "Success" : "Failed") << endl;\n    ba.display();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'member-functions', 'scope-resolution']
  },

  // Lesson 7: member-functions (HARD) - Independent
  'member-functions-hard': {
    id: 'member-functions-hard',
    title: 'Retail Order Invoice Billing System',
    concepts: ['member-functions', 'classes', 'scope-resolution', 'access-control'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Build an order billing system that processes a multi-item purchase for a customer and computes an itemized financial summary.\nThe system reads the customer name (string), item count N, followed by N lines of <unit_price:int> <quantity:int>.\nSubtotal is the sum of (price * qty) across all items.\nIf the subtotal reaches 500 or more, apply a 10% volume discount (subtotal / 10); otherwise discount is 0.\nSales tax is 5% of the discounted subtotal ((subtotal - discount) / 20).\nFinal balance is (subtotal - discount + tax).\nEncapsulate customer details and billing computations within an order model, keeping data protected and operations modular.\nOutput formatted invoice:\nCustomer: <name>\nSubtotal: <subtotal>\nDiscount: <discount>\nTax: <tax>\nFinal: <final>',
    constraints: [
      'Calculations must use integer arithmetic as specified.',
      'Customer details and financial state must remain encapsulated within the billing model.'
    ],
    inputFormat: '<customer:string> <N:int> followed by N lines of <price:int> <qty:int>',
    outputFormat: '5 lines of invoice summary matching specified format.',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Order qualifying for 10% discount',
        input: 'Alice\n2\n200 2\n150 1',
        expectedOutput: 'Customer: Alice\nSubtotal: 550\nDiscount: 55\nTax: 24\nFinal: 519',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Order below discount threshold',
        input: 'Bob\n1\n100 2',
        expectedOutput: 'Customer: Bob\nSubtotal: 200\nDiscount: 0\nTax: 10\nFinal: 210',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: multiple item lines exceeding threshold',
        input: 'Charlie\n3\n100 3\n100 2\n50 2',
        expectedOutput: 'Customer: Charlie\nSubtotal: 600\nDiscount: 60\nTax: 27\nFinal: 567',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: exact boundary at 500 threshold',
        input: 'Dana\n1\n500 1',
        expectedOutput: 'Customer: Dana\nSubtotal: 500\nDiscount: 50\nTax: 22\nFinal: 472',
        isHidden: true
      }
    ],
    expectedBehavior: 'Separates class declaration from definition while correctly computing multi-step invoice values.',
    hints: [
      'Think about how to represent an invoice as an object that tracks line items and computes financial totals.',
      'Consider organizing your code cleanly by separating the class declaration interface from detailed calculation logic.',
      'Remember that integer division truncates: calculate discount first before determining the taxable amount.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Invoice {\nprivate:\n  string customer;\n  int subtotal;\npublic:\n  Invoice(string cust);\n  void addItem(int price, int qty);\n  int getDiscount() const;\n  int getTax() const;\n  int getFinal() const;\n  void printInvoice() const;\n};\n\nInvoice::Invoice(string cust) : customer(cust), subtotal(0) {}\n\nvoid Invoice::addItem(int price, int qty) {\n  subtotal += price * qty;\n}\n\nint Invoice::getDiscount() const {\n  return (subtotal >= 500) ? (subtotal / 10) : 0;\n}\n\nint Invoice::getTax() const {\n  int discounted = subtotal - getDiscount();\n  return discounted / 20;\n}\n\nint Invoice::getFinal() const {\n  return subtotal - getDiscount() + getTax();\n}\n\nvoid Invoice::printInvoice() const {\n  cout << "Customer: " << customer << endl;\n  cout << "Subtotal: " << subtotal << endl;\n  cout << "Discount: " << getDiscount() << endl;\n  cout << "Tax: " << getTax() << endl;\n  cout << "Final: " << getFinal();\n}\n\nint main() {\n  string name;\n  int n;\n  if (cin >> name >> n) {\n    Invoice inv(name);\n    for (int i = 0; i < n; i++) {\n      int p, q;\n      cin >> p >> q;\n      inv.addItem(p, q);\n    }\n    inv.printInvoice();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['member-functions', 'classes', 'scope-resolution'],
    isIndependent: true
  },

  // Lesson 8: object-flow (MINI)
  'object-flow-mini': {
    id: 'object-flow-mini',
    title: 'Pass Object by Const Reference to Student Inspector',
    concepts: ['passing-objects', 'references', 'classes', 'methods'],
    difficulty: 'easy',
    level: 2,
    problemStatement: 'Complete the non-member function void printStudentSummary(const Student& s) that inspects a Student object passed by const reference without copying it. The Student class provides getName() and getScore(). The function outputs "Student: <name>, Score: <score>, Passed: <Yes/No>" where Passed is Yes if score >= 50, otherwise No.',
    constraints: [
      'Function parameter must be const Student& to avoid unnecessary object copying.',
      'Passing score cutoff is 50.'
    ],
    inputFormat: '<name:string> <score:int>',
    outputFormat: 'Student: <name>, Score: <score>, Passed: <Yes/No>',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\nprivate:\n  string name;\n  int score;\npublic:\n  Student(string n, int s) : name(n), score(s) {}\n  string getName() const { return name; }\n  int getScore() const { return score; }\n};\n\n// TODO: Implement printStudentSummary taking const Student& s\nvoid printStudentSummary(const Student& s) {\n  // Print summary\n}\n\nint main() {\n  string name;\n  int score;\n  if (cin >> name >> score) {\n    Student st(name, score);\n    printStudentSummary(st);\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Passing student',
        input: 'Emma 85',
        expectedOutput: 'Student: Emma, Score: 85, Passed: Yes',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Failing student',
        input: 'Liam 42',
        expectedOutput: 'Student: Liam, Score: 42, Passed: No',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: exactly 50 score threshold',
        input: 'Noah 50',
        expectedOutput: 'Student: Noah, Score: 50, Passed: Yes',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: 49 just below threshold',
        input: 'Mia 49',
        expectedOutput: 'Student: Mia, Score: 49, Passed: No',
        isHidden: true
      }
    ],
    expectedBehavior: 'Inspects object via const reference parameter without copying.',
    hints: [
      'Pass by const reference allows access to s.getName() and s.getScore() without making a copy.',
      'Check if s.getScore() >= 50 to choose between "Yes" and "No".',
      'Format output with cout << "Student: " << s.getName() << ", Score: " << s.getScore() << ", Passed: " << ...'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\nprivate:\n  string name;\n  int score;\npublic:\n  Student(string n, int s) : name(n), score(s) {}\n  string getName() const { return name; }\n  int getScore() const { return score; }\n};\n\nvoid printStudentSummary(const Student& s) {\n  cout << "Student: " << s.getName() << ", Score: " << s.getScore()\n       << ", Passed: " << (s.getScore() >= 50 ? "Yes" : "No");\n}\n\nint main() {\n  string name;\n  int score;\n  if (cin >> name >> score) {\n    Student st(name, score);\n    printStudentSummary(st);\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'passing-objects', 'references']
  },

  // Lesson 8: object-flow (MEDIUM)
  'object-flow-medium': {
    id: 'object-flow-medium',
    title: 'Batch Student Grade Processor & Top Performer Search',
    concepts: ['arrays-of-objects', 'passing-objects', 'returning-objects', 'classes'],
    difficulty: 'medium',
    level: 4,
    problemStatement: 'Read an integer N (1 <= N <= 10) followed by N student records: <name:string> <score:int>. Store them in an array of Student objects. Implement a function Student findTopStudent(const Student arr[], int n) that returns the Student object with the highest score (if tied, the first occurrence). In main, print "Top Student: <name> with Score: <score>".',
    constraints: [
      'Array size is at most 10.',
      'Function must take an array of objects and return the top Student object by value.'
    ],
    inputFormat: '<N:int> followed by N lines of <name:string> <score:int>',
    outputFormat: 'Top Student: <name> with Score: <score>',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\nprivate:\n  string name;\n  int score;\npublic:\n  Student() : name(""), score(0) {}\n  Student(string n, int s) : name(n), score(s) {}\n  string getName() const { return name; }\n  int getScore() const { return score; }\n};\n\n// TODO: Implement findTopStudent taking Student array and returning Student\n\nint main() {\n  int n;\n  if (cin >> n && n > 0 && n <= 10) {\n    Student students[10];\n    // TODO: Read students into array, call findTopStudent, and print result\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Find topper among 3 students',
        input: '3\nAlice 78\nBob 92\nCharlie 85',
        expectedOutput: 'Top Student: Bob with Score: 92',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Tie-breaker returns first occurrence',
        input: '2\nJohn 88\nJane 88',
        expectedOutput: 'Top Student: John with Score: 88',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: 4 students with high score at index 2',
        input: '4\nA 50\nB 60\nC 99\nD 70',
        expectedOutput: 'Top Student: C with Score: 99',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: single student',
        input: '1\nSolo 100',
        expectedOutput: 'Top Student: Solo with Score: 100',
        isHidden: true
      }
    ],
    expectedBehavior: 'Iterates array of objects, passes array to function, and returns winning object by value.',
    hints: [
      'In findTopStudent, initialize bestIndex = 0 and compare arr[i].getScore() > arr[bestIndex].getScore().',
      'Return arr[bestIndex] to return the object by value.',
      'In main, store the returned object in Student topper = findTopStudent(students, n); and display its name and score.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\nprivate:\n  string name;\n  int score;\npublic:\n  Student() : name(""), score(0) {}\n  Student(string n, int s) : name(n), score(s) {}\n  string getName() const { return name; }\n  int getScore() const { return score; }\n};\n\nStudent findTopStudent(const Student arr[], int n) {\n  int best = 0;\n  for (int i = 1; i < n; i++) {\n    if (arr[i].getScore() > arr[best].getScore()) {\n      best = i;\n    }\n  }\n  return arr[best];\n}\n\nint main() {\n  int n;\n  if (cin >> n && n > 0 && n <= 10) {\n    Student students[10];\n    for (int i = 0; i < n; i++) {\n      string name;\n      int score;\n      cin >> name >> score;\n      students[i] = Student(name, score);\n    }\n    Student topper = findTopStudent(students, n);\n    cout << "Top Student: " << topper.getName() << " with Score: " << topper.getScore();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['arrays-of-objects', 'passing-objects', 'returning-objects', 'classes']
  },

  // Lesson 8: object-flow (HARD) - Independent
  'object-flow-hard': {
    id: 'object-flow-hard',
    title: 'Warehouse Batch Inventory Analyzer',
    concepts: ['arrays-of-objects', 'passing-objects', 'returning-objects', 'classes', 'objects'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Manage a warehouse inventory with multi-object flow. Read N (1 <= N <= 10) items, each with <id:string> <category:string> <price:int> <stock:int>, followed by a query category Q. Write a function that accepts the array of items and Q, filters items matching category Q, computes total category inventory value (sum of price * stock), and identifies the item with the highest stock in that category. Return a composite summary structure containing these results. Output:\n"Category: <Q>, Total Value: <total_val>, Most Stocked: <id> (<max_stock> units)"\nIf no items match category Q, output:\n"Category: <Q> not found".',
    constraints: [
      'Input array size is at most 10.',
      'Must structure the result using an aggregated summary model returned from the analysis routine.'
    ],
    inputFormat: '<N:int> followed by N item lines, then query category string Q.',
    outputFormat: 'Category: <Q>, Total Value: <val>, Most Stocked: <id> (<stock> units) OR Category: <Q> not found',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Electronic category analysis with 2 matches',
        input: '3\nSKU1 Elec 100 5\nSKU2 Tool 25 10\nSKU3 Elec 50 20\nElec',
        expectedOutput: 'Category: Elec, Total Value: 1500, Most Stocked: SKU3 (20 units)',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Category with no matches',
        input: '2\nA1 Food 10 30\nA2 Food 15 20\nToys',
        expectedOutput: 'Category: Toys not found',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: multiple matches with tie in highest stock',
        input: '4\nX1 Books 20 50\nX2 Books 30 10\nX3 Music 15 100\nX4 Books 10 40\nBooks',
        expectedOutput: 'Category: Books, Total Value: 1700, Most Stocked: X1 (50 units)',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: single item category match',
        input: '1\nZ9 Auto 500 2\nAuto',
        expectedOutput: 'Category: Auto, Total Value: 1000, Most Stocked: Z9 (2 units)',
        isHidden: true
      }
    ],
    expectedBehavior: 'Filters array of objects by category, aggregates value, and returns a summary object.',
    hints: [
      'Create an Item class with id, category, price, and stock.',
      'Create a CategorySummary class holding match count, total value, top item ID, and max stock.',
      'In analyzeCategory, iterate through items: when item.getCategory() == Q, add to total value and track the item with the highest stock.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Item {\nprivate:\n  string id;\n  string category;\n  int price;\n  int stock;\npublic:\n  Item() : id(""), category(""), price(0), stock(0) {}\n  Item(string id_, string cat_, int p_, int s_) : id(id_), category(cat_), price(p_), stock(s_) {}\n  string getId() const { return id; }\n  string getCategory() const { return category; }\n  int getPrice() const { return price; }\n  int getStock() const { return stock; }\n};\n\nclass CategorySummary {\npublic:\n  string category;\n  int count;\n  int totalValue;\n  string topId;\n  int topStock;\n  CategorySummary() : category(""), count(0), totalValue(0), topId(""), topStock(-1) {}\n};\n\nCategorySummary analyzeCategory(const Item items[], int n, const string& targetCat) {\n  CategorySummary summary;\n  summary.category = targetCat;\n  for (int i = 0; i < n; i++) {\n    if (items[i].getCategory() == targetCat) {\n      summary.count++;\n      summary.totalValue += items[i].getPrice() * items[i].getStock();\n      if (items[i].getStock() > summary.topStock) {\n        summary.topStock = items[i].getStock();\n        summary.topId = items[i].getId();\n      }\n    }\n  }\n  return summary;\n}\n\nint main() {\n  int n;\n  if (cin >> n && n > 0 && n <= 10) {\n    Item items[10];\n    for (int i = 0; i < n; i++) {\n      string id, cat;\n      int p, s;\n      cin >> id >> cat >> p >> s;\n      items[i] = Item(id, cat, p, s);\n    }\n    string queryCat;\n    cin >> queryCat;\n    CategorySummary res = analyzeCategory(items, n, queryCat);\n    if (res.count == 0) {\n      cout << "Category: " << queryCat << " not found";\n    } else {\n      cout << "Category: " << queryCat << ", Total Value: " << res.totalValue\n           << ", Most Stocked: " << res.topId << " (" << res.topStock << " units)";\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['arrays-of-objects', 'passing-objects', 'returning-objects', 'classes'],
    isIndependent: true
  },

  // ==========================================
  // MODULE 4: STATIC & FRIENDS
  // ==========================================

  // Lesson 9: static (MINI) - Debugging
  'static-mini': {
    id: 'static-mini',
    title: 'Fix Undefined Static Variable & Scope Access',
    concepts: ['static', 'static-members', 'classes', 'scope-resolution'],
    difficulty: 'easy',
    level: 1,
    problemStatement: 'The starter code declares a static member variable "static int count;" in class Counter, but omits the required definition outside the class, leading to an undefined reference error. Furthermore, a static member function attempts to access non-static instance data. Fix both bugs so that Counter tracks the total number of objects created.',
    constraints: [
      'Must define and initialize Counter::count = 0 outside the class.',
      'Static member function getCount() must only access static members.'
    ],
    inputFormat: 'An integer N: number of Counter objects to instantiate.',
    outputFormat: 'Count: <N>',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Counter {\nprivate:\n  static int count;\n  int id;\npublic:\n  Counter() {\n    count++;\n    id = count;\n  }\n  // BUG 1: Static function trying to access non-static member id\n  static int getCount() {\n    return count;\n  }\n};\n\n// BUG 2: Missing static member definition outside class!\n\nint main() {\n  int n;\n  if (cin >> n) {\n    for (int i = 0; i < n; i++) {\n      Counter c;\n    }\n    cout << "Count: " << Counter::getCount();\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Create 3 objects',
        input: '3',
        expectedOutput: 'Count: 3',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Create 5 objects',
        input: '5',
        expectedOutput: 'Count: 5',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: zero objects',
        input: '0',
        expectedOutput: 'Count: 0',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: larger count',
        input: '12',
        expectedOutput: 'Count: 12',
        isHidden: true
      }
    ],
    expectedBehavior: 'Defines static member outside class and accesses it via static member function.',
    hints: [
      'Static data members must be defined exactly once outside the class body in file scope.',
      'Add the line int Counter::count = 0; right after the class declaration.',
      'Ensure getCount() returns count directly without referencing any instance variables.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Counter {\nprivate:\n  static int count;\n  int id;\npublic:\n  Counter() {\n    count++;\n    id = count;\n  }\n  static int getCount() {\n    return count;\n  }\n};\n\nint Counter::count = 0;\n\nint main() {\n  int n;\n  if (cin >> n) {\n    for (int i = 0; i < n; i++) {\n      Counter c;\n    }\n    cout << "Count: " << Counter::getCount();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['static', 'static-members', 'classes', 'scope-resolution']
  },

  // Lesson 9: static (MEDIUM)
  'static-medium': {
    id: 'static-medium',
    title: 'Auto-Incrementing Employee Badge Generator',
    concepts: ['static', 'static-members', 'static-methods', 'classes'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Design an Employee class where each new employee is automatically assigned a consecutive ID starting from 1001. Maintain a private static counter nextId initialized to 1001. Each Employee has an id (int) and name (string). Provide a method void display() const that outputs "ID: <id>, Name: <name>", and a static method static int getEmployeeCount() that returns the total number of employees created so far. Given N followed by N names, instantiate each employee, print their badge, and finally print "Total Employees: <count>".',
    constraints: [
      'nextId must be private and static.',
      'ID counter must begin at 1001 and increment with each created employee.'
    ],
    inputFormat: '<N:int> followed by N lines of <name:string>',
    outputFormat: 'N lines of ID: <id>, Name: <name> followed by Total Employees: <count>',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Employee {\nprivate:\n  // TODO: Declare private static nextId and instance members id, name\npublic:\n  // TODO: Implement constructor, display(), and static getEmployeeCount()\n};\n\n// TODO: Define static member\n\nint main() {\n  int n;\n  if (cin >> n) {\n    for (int i = 0; i < n; i++) {\n      string name;\n      cin >> name;\n      Employee emp(name);\n      emp.display();\n    }\n    cout << "Total Employees: " << Employee::getEmployeeCount();\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Two employees with IDs 1001 and 1002',
        input: '2\nAlice\nBob',
        expectedOutput: 'ID: 1001, Name: Alice\nID: 1002, Name: Bob\nTotal Employees: 2',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Single employee with ID 1001',
        input: '1\nCarol',
        expectedOutput: 'ID: 1001, Name: Carol\nTotal Employees: 1',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: 4 employees incrementing up to 1004',
        input: '4\nDan\nEve\nFrank\nGrace',
        expectedOutput: 'ID: 1001, Name: Dan\nID: 1002, Name: Eve\nID: 1003, Name: Frank\nID: 1004, Name: Grace\nTotal Employees: 4',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: zero employees',
        input: '0',
        expectedOutput: 'Total Employees: 0',
        isHidden: true
      }
    ],
    expectedBehavior: 'Uses private static variable to assign consecutive IDs and returns total count via static method.',
    hints: [
      'Declare static int nextId; inside class Employee and define it outside as int Employee::nextId = 1001;.',
      'In Employee constructor, set id = nextId++ and store the name.',
      'Compute employee count as nextId - 1001 in getEmployeeCount().'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Employee {\nprivate:\n  static int nextId;\n  int id;\n  string name;\npublic:\n  Employee(string n) : name(n) {\n    id = nextId++;\n  }\n  void display() const {\n    cout << "ID: " << id << ", Name: " << name << endl;\n  }\n  static int getEmployeeCount() {\n    return nextId - 1001;\n  }\n};\n\nint Employee::nextId = 1001;\n\nint main() {\n  int n;\n  if (cin >> n) {\n    for (int i = 0; i < n; i++) {\n      string name;\n      cin >> name;\n      Employee emp(name);\n      emp.display();\n    }\n    cout << "Total Employees: " << Employee::getEmployeeCount();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['static', 'static-members', 'static-methods', 'classes']
  },

  // Lesson 9: static (HARD) - Independent
  'static-hard': {
    id: 'static-hard',
    title: 'Banking Transaction Ledger Auditor',
    concepts: ['static', 'static-members', 'static-methods', 'classes', 'objects'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Design a financial transaction auditing ledger. Process a sequence of individual transaction records, each having a type ("D" for Deposit or "W" for Withdrawal) and an amount (positive integer). As each transaction is recorded, it receives an automatic consecutive receipt identifier starting from 1. The accounting engine must maintain cumulative transaction totals and net cash flow across all recorded entries without using external global variables. Given N followed by N transaction entries <type:char> <amount:int>, print each transaction receipt: "Txn #<serial>: <Deposit/Withdrawal> <amount>". At the end of the batch, print: "Summary: <count> transactions, Net Flow: <deposits - withdrawals>".',
    constraints: [
      'Receipt identifiers must increment sequentially starting from 1 for each recorded transaction.',
      'Cumulative metrics must be maintained by the ledger data abstraction without global variables.'
    ],
    inputFormat: '<N:int> followed by N lines of <type:char> <amount:int>',
    outputFormat: 'N transaction receipts followed by summary line.',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Deposits and withdrawal with positive net flow',
        input: '3\nD 500\nW 200\nD 150',
        expectedOutput: 'Txn #1: Deposit 500\nTxn #2: Withdrawal 200\nTxn #3: Deposit 150\nSummary: 3 transactions, Net Flow: 450',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'All withdrawals with negative net flow',
        input: '2\nW 100\nW 50',
        expectedOutput: 'Txn #1: Withdrawal 100\nTxn #2: Withdrawal 50\nSummary: 2 transactions, Net Flow: -150',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: balanced transactions resulting in zero net flow',
        input: '4\nD 1000\nD 500\nW 800\nW 700',
        expectedOutput: 'Txn #1: Deposit 1000\nTxn #2: Deposit 500\nTxn #3: Withdrawal 800\nTxn #4: Withdrawal 700\nSummary: 4 transactions, Net Flow: 0',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: single deposit transaction',
        input: '1\nD 250',
        expectedOutput: 'Txn #1: Deposit 250\nSummary: 1 transactions, Net Flow: 250',
        isHidden: true
      }
    ],
    expectedBehavior: 'Maintains serial numbering and cumulative volume using static class members.',
    hints: [
      'Declare static int serialCounter, totalDeposits, totalWithdrawals inside class Transaction.',
      'Define each static member at file scope outside the class.',
      'In the constructor, assign serial = ++serialCounter and add to either totalDeposits or totalWithdrawals based on type.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Transaction {\nprivate:\n  static int serialCounter;\n  static int totalDeposits;\n  static int totalWithdrawals;\n  int serial;\n  char type;\n  int amount;\npublic:\n  Transaction(char t, int a) : type(t), amount(a) {\n    serial = ++serialCounter;\n    if (type == 'D' || type == 'd') {\n      totalDeposits += amount;\n    } else {\n      totalWithdrawals += amount;\n    }\n  }\n  void printReceipt() const {\n    cout << "Txn #" << serial << ": " << ((type == 'D' || type == 'd') ? "Deposit " : "Withdrawal ") << amount << endl;\n  }\n  static int getCount() { return serialCounter; }\n  static int getNetFlow() { return totalDeposits - totalWithdrawals; }\n};\n\nint Transaction::serialCounter = 0;\nint Transaction::totalDeposits = 0;\nint Transaction::totalWithdrawals = 0;\n\nint main() {\n  int n;\n  if (cin >> n) {\n    for (int i = 0; i < n; i++) {\n      char t;\n      int a;\n      cin >> t >> a;\n      Transaction txn(t, a);\n      txn.printReceipt();\n    }\n    cout << "Summary: " << Transaction::getCount() << " transactions, Net Flow: " << Transaction::getNetFlow();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['static', 'static-members', 'static-methods', 'classes'],
    isIndependent: true
  },

  // Lesson 10: friends (MINI)
  'friends-mini': {
    id: 'friends-mini',
    title: 'Compare Private State of Two Boxes via Friend Function',
    concepts: ['friends', 'friend-functions', 'classes'],
    difficulty: 'easy',
    level: 2,
    problemStatement: 'Implement a non-member friend function bool isLarger(const Box& a, const Box& b) that directly inspects the private dimensions length, width, and height of two Box objects. The function returns true if the volume of box a (length * width * height) is strictly greater than the volume of box b, otherwise false. In main, read dimensions for two boxes and output "Box 1 is larger: <Yes/No>".',
    constraints: [
      'Box dimensions must remain private with no public getters.',
      'isLarger must be declared as friend inside Box.'
    ],
    inputFormat: 'Two lines of three integers: <l1> <w1> <h1}\\n<l2> <w2> <h2}>',
    outputFormat: 'Box 1 is larger: <Yes/No>',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Box {\nprivate:\n  int length, width, height;\npublic:\n  Box(int l, int w, int h) : length(l), width(w), height(h) {}\n  // TODO: Declare friend function bool isLarger(const Box& a, const Box& b);\n};\n\n// TODO: Implement isLarger\n\nint main() {\n  int l1, w1, h1, l2, w2, h2;\n  if (cin >> l1 >> w1 >> h1 >> l2 >> w2 >> h2) {\n    Box b1(l1, w1, h1);\n    Box b2(l2, w2, h2);\n    cout << "Box 1 is larger: " << (isLarger(b1, b2) ? "Yes" : "No");\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Box 1 volume 24 > Box 2 volume 20',
        input: '2 3 4\n2 2 5',
        expectedOutput: 'Box 1 is larger: Yes',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Box 1 volume 27 < Box 2 volume 36',
        input: '3 3 3\n4 3 3',
        expectedOutput: 'Box 1 is larger: No',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: equal volumes',
        input: '5 5 5\n5 5 5',
        expectedOutput: 'Box 1 is larger: No',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Box 1 volume 10 > Box 2 volume 8',
        input: '10 1 1\n2 2 2',
        expectedOutput: 'Box 1 is larger: Yes',
        isHidden: true
      }
    ],
    expectedBehavior: 'Non-member friend function accesses private members of both arguments directly.',
    hints: [
      'Declare friend bool isLarger(const Box& a, const Box& b); inside class Box.',
      'Define the function outside without Box:: because it is a non-member friend.',
      'In isLarger, compute volA = a.length * a.width * a.height and compare with volB.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Box {\nprivate:\n  int length, width, height;\npublic:\n  Box(int l, int w, int h) : length(l), width(w), height(h) {}\n  friend bool isLarger(const Box& a, const Box& b);\n};\n\nbool isLarger(const Box& a, const Box& b) {\n  int volA = a.length * a.width * a.height;\n  int volB = b.length * b.width * b.height;\n  return volA > volB;\n}\n\nint main() {\n  int l1, w1, h1, l2, w2, h2;\n  if (cin >> l1 >> w1 >> h1 >> l2 >> w2 >> h2) {\n    Box b1(l1, w1, h1);\n    Box b2(l2, w2, h2);\n    cout << "Box 1 is larger: " << (isLarger(b1, b2) ? "Yes" : "No");\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['friends', 'friend-functions', 'classes']
  },

  // Lesson 10: friends (MEDIUM)
  'friends-medium': {
    id: 'friends-medium',
    title: 'Encapsulated Bank Account with Friend Auditor Class',
    concepts: ['friends', 'friend-classes', 'classes', 'access-control'],
    difficulty: 'medium',
    level: 4,
    problemStatement: 'Design two classes to model audited accounts. Class Account keeps accId (string) and balance (int) private with NO public getters. Declare class Auditor as a friend class inside Account. Class Auditor has a method void audit(const Account& acc, int minBalance) const that directly inspects private acc.balance: if acc.balance < minBalance, it prints "Account <accId>: FLAGGED (Balance <balance> < <minBalance>)", otherwise it prints "Account <accId>: OK".',
    constraints: [
      'Account balance and ID must be private without public getters.',
      'Auditor must be declared as a friend class inside Account.'
    ],
    inputFormat: '<accId:string> <balance:int> <minBalance:int>',
    outputFormat: 'Account <accId>: FLAGGED (Balance <balance> < <minBalance>) OR Account <accId>: OK',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Auditor; // Forward declaration\n\nclass Account {\nprivate:\n  string accId;\n  int balance;\n  // TODO: Declare friend class Auditor\npublic:\n  Account(string id, int bal) : accId(id), balance(bal) {}\n};\n\nclass Auditor {\npublic:\n  // TODO: Implement audit inspecting private Account members\n};\n\nint main() {\n  string id;\n  int bal, minB;\n  if (cin >> id >> bal >> minB) {\n    Account acc(id, bal);\n    Auditor auditor;\n    auditor.audit(acc, minB);\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Balance below minimum triggers flag',
        input: 'ACC1 450 500',
        expectedOutput: 'Account ACC1: FLAGGED (Balance 450 < 500)',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Balance above minimum is approved',
        input: 'ACC2 1200 500',
        expectedOutput: 'Account ACC2: OK',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: balance exactly equal to minimum is OK',
        input: 'SAV9 500 500',
        expectedOutput: 'Account SAV9: OK',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: zero balance flagged',
        input: 'CHK4 0 100',
        expectedOutput: 'Account CHK4: FLAGGED (Balance 0 < 100)',
        isHidden: true
      }
    ],
    expectedBehavior: 'Friend class Auditor accesses private data of Account without public getter leaks.',
    hints: [
      'Inside class Account, write friend class Auditor; to grant full private access.',
      'In Auditor::audit, access acc.balance and acc.accId directly.',
      'Compare if (acc.balance < minBalance) to format the flagged message.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Auditor;\n\nclass Account {\nprivate:\n  string accId;\n  int balance;\n  friend class Auditor;\npublic:\n  Account(string id, int bal) : accId(id), balance(bal) {}\n};\n\nclass Auditor {\npublic:\n  void audit(const Account& acc, int minBalance) const {\n    if (acc.balance < minBalance) {\n      cout << "Account " << acc.accId << ": FLAGGED (Balance " << acc.balance << " < " << minBalance << ")";\n    } else {\n      cout << "Account " << acc.accId << ": OK";\n    }\n  }\n};\n\nint main() {\n  string id;\n  int bal, minB;\n  if (cin >> id >> bal >> minB) {\n    Account acc(id, bal);\n    Auditor auditor;\n    auditor.audit(acc, minB);\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['friends', 'friend-classes', 'classes', 'access-control']
  },

  // Lesson 10: friends (HARD) - Independent
  'friends-hard': {
    id: 'friends-hard',
    title: 'Encapsulated Proximity & Distance Auditor',
    concepts: ['friends', 'friend-functions', 'classes', 'access-control'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Design a spatial analysis system that evaluates proximity metrics between 2D geographic waypoints.\nWaypoint coordinates (x, y) must remain strictly encapsulated to protect internal spatial integrity from arbitrary external modification.\nAn external auditing operation must compare two waypoints and compute two spatial metrics simultaneously:\n1. Grid (Manhattan) distance: |x1 - x2| + |y1 - y2|\n2. Chessboard (Chebyshev) distance: max(|x1 - x2|, |y1 - y2|)\nBecause the waypoints remain encapsulated without exposing public coordinate setters or getters, the auditing operation requires controlled, privileged access to compare the internal coordinates of both points directly.\nGiven the coordinates of two waypoints, compute both metrics and output:\nManhattan: <manhattan>, Chebyshev: <chebyshev>',
    constraints: [
      'Waypoint coordinate fields must remain private and cannot expose public coordinate getters.',
      'The distance evaluation operation must compute both metrics via controlled access privileges and reference parameters.'
    ],
    inputFormat: 'Two lines of two integers: <x1> <y1>\n<x2> <y2>',
    outputFormat: 'Manhattan: <manhattan>, Chebyshev: <chebyshev>',
    starterCode: `#include <iostream>\n#include <cmath>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'First quadrant distance calculation',
        input: '1 2\n4 6',
        expectedOutput: 'Manhattan: 7, Chebyshev: 4',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Origin to quadrant 2 point',
        input: '0 0\n-3 4',
        expectedOutput: 'Manhattan: 7, Chebyshev: 4',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: identical points with zero distance',
        input: '5 5\n5 5',
        expectedOutput: 'Manhattan: 0, Chebyshev: 0',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: opposite quadrants',
        input: '-10 20\n10 -20',
        expectedOutput: 'Manhattan: 60, Chebyshev: 40',
        isHidden: true
      }
    ],
    expectedBehavior: 'Friend function computes geometric distances directly from encapsulated point data.',
    hints: [
      'How can an external utility function access private members of a class without exposing public getter methods to the rest of the program?',
      'Recall how C++ permits non-member functions to be granted access to private class data.',
      'Compute dx = abs(x1 - x2) and dy = abs(y1 - y2). Manhattan is dx + dy, and Chebyshev is max(dx, dy).'
    ],
    solution: `#include <iostream>\n#include <cmath>\nusing namespace std;\n\nclass Point {\nprivate:\n  int x, y;\npublic:\n  Point(int x_, int y_) : x(x_), y(y_) {}\n  friend void computeMetrics(const Point& p1, const Point& p2, int& manhattan, int& chebyshev);\n};\n\nvoid computeMetrics(const Point& p1, const Point& p2, int& manhattan, int& chebyshev) {\n  int dx = abs(p1.x - p2.x);\n  int dy = abs(p1.y - p2.y);\n  manhattan = dx + dy;\n  chebyshev = (dx > dy) ? dx : dy;\n}\n\nint main() {\n  int x1, y1, x2, y2;\n  if (cin >> x1 >> y1 >> x2 >> y2) {\n    Point p1(x1, y1);\n    Point p2(x2, y2);\n    int mDist, cDist;\n    computeMetrics(p1, p2, mDist, cDist);\n    cout << "Manhattan: " << mDist << ", Chebyshev: " << cDist;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['friends', 'friend-functions', 'classes'],
    isIndependent: true
  },

  // ==========================================
  // MODULE 5: CONSTRUCTORS & LIFECYCLE
  // ==========================================

  // Lesson 11: constructors (HARD) - Independent
  'constructors-hard': {
    id: 'constructors-hard',
    title: 'Isolated Sequence Snapshot Manager',
    concepts: ['constructors', 'copy-constructor', 'destructors', 'dynamic-memory', 'classes'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Implement an isolated dataset manager that stores a sequence of N integers and supports creating independent snapshots.\nEach dataset instance manages its own dynamically sized sequence.\nWhen a snapshot of an existing dataset is created, it must receive a completely independent replica of the data: modifying the snapshot must never affect the original dataset, and each object must cleanly release its resources when its lifetime ends without memory corruption or duplicate frees.\nThe program reads N followed by N integers to populate an initial dataset. It then creates a snapshot of this dataset, increments the element at index 0 in the snapshot by 100, and displays both the original dataset and the snapshot to verify isolation:\nOriginal: <original elements space-separated>\nModified Copy: <snapshot elements space-separated>',
    constraints: [
      'Modifying the snapshot copy must not alter the original dataset.',
      'All allocated storage must be safely released when objects go out of scope without double deletion.'
    ],
    inputFormat: '<N:int> followed by N integers',
    outputFormat: 'Two lines: Original: ... and Modified Copy: ...',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Deep copy verified with 3 elements',
        input: '3\n10 20 30',
        expectedOutput: 'Original: 10 20 30\nModified Copy: 110 20 30',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Deep copy verified with 2 elements',
        input: '2\n5 15',
        expectedOutput: 'Original: 5 15\nModified Copy: 105 15',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: single element buffer',
        input: '1\n42',
        expectedOutput: 'Original: 42\nModified Copy: 142',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: 4 elements buffer',
        input: '4\n1 2 3 4',
        expectedOutput: 'Original: 1 2 3 4\nModified Copy: 101 2 3 4',
        isHidden: true
      }
    ],
    expectedBehavior: 'Performs deep copy allocation so modification of copy leaves original intact.',
    hints: [
      'Consider what happens when one object holding dynamic storage is copied to another. How do you guarantee the two objects do not share the same memory address?',
      'Think about the lifecycle of your dataset: what special member functions manage resource acquisition, duplication, and release?',
      'Ensure the copied object allocates its own fresh memory and copies each element individually.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Buffer {\nprivate:\n  int* data;\n  int size;\npublic:\n  Buffer(int s) : size(s) {\n    data = new int[size];\n  }\n  Buffer(const Buffer& other) : size(other.size) {\n    data = new int[size];\n    for (int i = 0; i < size; i++) {\n      data[i] = other.data[i];\n    }\n  }\n  ~Buffer() {\n    delete[] data;\n  }\n  void set(int idx, int val) {\n    if (idx >= 0 && idx < size) data[idx] = val;\n  }\n  int get(int idx) const {\n    return (idx >= 0 && idx < size) ? data[idx] : 0;\n  }\n  void print() const {\n    for (int i = 0; i < size; i++) {\n      cout << data[i] << (i + 1 < size ? " " : "");\n    }\n  }\n};\n\nint main() {\n  int n;\n  if (cin >> n && n > 0) {\n    Buffer b1(n);\n    for (int i = 0; i < n; i++) {\n      int v;\n      cin >> v;\n      b1.set(i, v);\n    }\n    Buffer b2 = b1;\n    b2.set(0, b2.get(0) + 100);\n    cout << "Original: ";\n    b1.print();\n    cout << endl << "Modified Copy: ";\n    b2.print();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['constructors', 'copy-constructor', 'destructors', 'dynamic-memory'],
    isIndependent: true
  },

  // ==========================================
  // MODULE 7: INHERITANCE
  // ==========================================

  // Lesson 13: inheritance (MEDIUM)
  'inheritance-medium': {
    id: 'inheritance-medium',
    title: 'Multiple Inheritance: Teaching Assistant',
    concepts: ['inheritance', 'multiple-inheritance', 'classes'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Demonstrate multiple inheritance by combining two independent base classes. Class Teacher has member string subject and method void teach() const that outputs "Teaching: <subject>". Class Researcher has member string field and method void research() const that outputs "Researching: <field>". Derived class TeachingAssistant inherits publicly from both Teacher and Researcher, adds member string name, and provides void displayProfile() const which prints "TA: <name>", then on separate lines calls teach() and research().',
    constraints: [
      'TeachingAssistant must inherit publicly from both Teacher and Researcher.',
      'Must reuse base class methods teach() and research() without duplicating logic.'
    ],
    inputFormat: 'Three lines: <name:string>\\n<subject:string>\\n<field:string>',
    outputFormat: 'TA: <name>\\nTeaching: <subject>\\nResearching: <field>',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Teacher {\nprotected:\n  string subject;\npublic:\n  Teacher(string s) : subject(s) {}\n  void teach() const { cout << "Teaching: " << subject << endl; }\n};\n\nclass Researcher {\nprotected:\n  string field;\npublic:\n  Researcher(string f) : field(f) {}\n  void research() const { cout << "Researching: " << field << endl; }\n};\n\n// TODO: Implement TeachingAssistant inheriting from both Teacher and Researcher\n\nint main() {\n  string name, subj, field;\n  if (cin >> name >> subj >> field) {\n    TeachingAssistant ta(name, subj, field);\n    ta.displayProfile();\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Math and Calculus TA',
        input: 'Alex\nMath\nCalculus',
        expectedOutput: 'TA: Alex\nTeaching: Math\nResearching: Calculus',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Physics and Optics TA',
        input: 'Beth\nPhysics\nOptics',
        expectedOutput: 'TA: Beth\nTeaching: Physics\nResearching: Optics',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: CS and Algorithms TA',
        input: 'Chris\nCS\nAlgorithms',
        expectedOutput: 'TA: Chris\nTeaching: CS\nResearching: Algorithms',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Chemistry and Polymers TA',
        input: 'Dana\nChemistry\nPolymers',
        expectedOutput: 'TA: Dana\nTeaching: Chemistry\nResearching: Polymers',
        isHidden: true
      }
    ],
    expectedBehavior: 'Combines behaviors of two base classes through multiple inheritance.',
    hints: [
      'Declare class TeachingAssistant : public Teacher, public Researcher.',
      'In TeachingAssistant constructor, initialize both base classes: Teacher(subj), Researcher(field), name(n).',
      'Inside displayProfile(), print the TA name, then invoke teach(); and research();.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Teacher {\nprotected:\n  string subject;\npublic:\n  Teacher(string s) : subject(s) {}\n  void teach() const { cout << "Teaching: " << subject << endl; }\n};\n\nclass Researcher {\nprotected:\n  string field;\npublic:\n  Researcher(string f) : field(f) {}\n  void research() const { cout << "Researching: " << field << endl; }\n};\n\nclass TeachingAssistant : public Teacher, public Researcher {\nprivate:\n  string name;\npublic:\n  TeachingAssistant(string n, string s, string f) : Teacher(s), Researcher(f), name(n) {}\n  void displayProfile() const {\n    cout << "TA: " << name << endl;\n    teach();\n    research();\n  }\n};\n\nint main() {\n  string name, subj, field;\n  if (cin >> name >> subj >> field) {\n    TeachingAssistant ta(name, subj, field);\n    ta.displayProfile();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['inheritance', 'classes']
  },

  // Lesson 13: inheritance (HARD) - Independent
  'inheritance-hard': {
    id: 'inheritance-hard',
    title: 'Workforce Payroll & Compensation Processor',
    concepts: ['inheritance', 'classes', 'methods', 'access-control'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Implement a payroll processing system that manages compensation for different employee categories in an enterprise.\nEvery personnel record shares common identifying attributes: an employee ID and a name.\nHowever, compensation models differ based on employment agreement:\n- Salaried personnel receive a fixed monthly salary.\n- Commission personnel receive a base salary plus an incentive based on sales volume: base + (sales volume * commission rate) / 100.\nStructure your design so shared personnel information is centralized in a common representation rather than duplicated across categories, while allowing specialized compensation rules for each role.\nInput starts with a role tag:\n- \'S\' followed by <id:int> <name:string> <salary:int>\n- \'C\' followed by <id:int> <name:string> <base:int> <sales:int> <rate:int>\nCompute total compensation and display:\nStaff #<id>: <name>, Total Pay: <total_pay>',
    constraints: [
      'Common personnel attributes (id, name) must be centralized in a shared representation without duplicate definitions.',
      'Calculations must use integer arithmetic.'
    ],
    inputFormat: '<type:char> followed by respective parameters for Salaried or Commission staff.',
    outputFormat: 'Staff #<id>: <name>, Total Pay: <total_pay>',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Salaried employee compensation',
        input: 'S 101 John 5000',
        expectedOutput: 'Staff #101: John, Total Pay: 5000',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Commission employee compensation calculation',
        input: 'C 102 Sarah 3000 20000 10',
        expectedOutput: 'Staff #102: Sarah, Total Pay: 5000',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Commission with 5% rate',
        input: 'C 103 Mike 2500 10000 5',
        expectedOutput: 'Staff #103: Mike, Total Pay: 3000',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Higher salaried staff',
        input: 'S 104 Emily 7200',
        expectedOutput: 'Staff #104: Emily, Total Pay: 7200',
        isHidden: true
      }
    ],
    expectedBehavior: 'Derived classes extend base state and calculate compensation independently.',
    hints: [
      'Think about how to model "is-a" relationships. Both salaried and commission workers share the essential characteristics of staff.',
      'Consider deriving specific role types from a shared base type to reuse common identity fields.',
      'Read the first character to determine which record type to instantiate and process.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Staff {\nprotected:\n  int id;\n  string name;\npublic:\n  Staff(int id_, string name_) : id(id_), name(name_) {}\n  int getId() const { return id; }\n  string getName() const { return name; }\n};\n\nclass SalariedStaff : public Staff {\nprivate:\n  int salary;\npublic:\n  SalariedStaff(int id_, string name_, int sal) : Staff(id_, name_), salary(sal) {}\n  int getTotalPay() const { return salary; }\n};\n\nclass CommissionStaff : public Staff {\nprivate:\n  int baseSalary;\n  int salesVolume;\n  int commissionRate;\npublic:\n  CommissionStaff(int id_, string name_, int base, int sales, int rate)\n    : Staff(id_, name_), baseSalary(base), salesVolume(sales), commissionRate(rate) {}\n  int getTotalPay() const {\n    return baseSalary + (salesVolume * commissionRate) / 100;\n  }\n};\n\nint main() {\n  char type;\n  if (cin >> type) {\n    if (type == 'S' || type == 's') {\n      int id, sal;\n      string name;\n      cin >> id >> name >> sal;\n      SalariedStaff s(id, name, sal);\n      cout << "Staff #" << s.getId() << ": " << s.getName() << ", Total Pay: " << s.getTotalPay();\n    } else {\n      int id, base, sales, rate;\n      string name;\n      cin >> id >> name >> base >> sales >> rate;\n      CommissionStaff c(id, name, base, sales, rate);\n      cout << "Staff #" << c.getId() << ": " << c.getName() << ", Total Pay: " << c.getTotalPay();\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['inheritance', 'classes', 'methods'],
    isIndependent: true
  },

  // Lesson 14: abstract (MINI) - Debugging
  'abstract-mini': {
    id: 'abstract-mini',
    title: 'Resolve Diamond Inheritance Ambiguity via Virtual Inheritance',
    concepts: ['inheritance', 'virtual-base-classes', 'classes'],
    difficulty: 'easy',
    level: 1,
    problemStatement: 'The starter code creates a diamond inheritance structure where WingedAnimal and Mammal both inherit from Animal, and Bat inherits from both. In main(), accessing bat.age causes an ambiguity compiler error because Bat contains two separate copies of Animal. Fix the hierarchy by making Animal a virtual base class in both WingedAnimal and Mammal.',
    constraints: [
      'WingedAnimal and Mammal must inherit virtually from Animal.',
      'Must compile cleanly and allow unambiguous access to bat.age.'
    ],
    inputFormat: 'An integer age: age of the bat.',
    outputFormat: 'Bat age: <age>',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n  int age;\n};\n\n// BUG: Non-virtual inheritance creates duplicate Animal subobjects in Bat\nclass WingedAnimal : public Animal {};\n\nclass Mammal : public Animal {};\n\nclass Bat : public WingedAnimal, public Mammal {};\n\nint main() {\n  int a;\n  if (cin >> a) {\n    Bat b;\n    b.age = a; // Compiler error: request for member age is ambiguous\n    cout << "Bat age: " << b.age;\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Bat age 3',
        input: '3',
        expectedOutput: 'Bat age: 3',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Bat age 8',
        input: '8',
        expectedOutput: 'Bat age: 8',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: minimal age 1',
        input: '1',
        expectedOutput: 'Bat age: 1',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: older age 15',
        input: '15',
        expectedOutput: 'Bat age: 15',
        isHidden: true
      }
    ],
    expectedBehavior: 'Uses virtual inheritance to ensure a single shared base instance in diamond hierarchy.',
    hints: [
      'Why does the compiler report that member age is ambiguous in Bat?',
      'In diamond inheritance, use the virtual keyword on the base class inheritance specifier.',
      'Change to class WingedAnimal : virtual public Animal {}; and class Mammal : virtual public Animal {};.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n  int age;\n};\n\nclass WingedAnimal : virtual public Animal {};\n\nclass Mammal : virtual public Animal {};\n\nclass Bat : public WingedAnimal, public Mammal {};\n\nint main() {\n  int a;\n  if (cin >> a) {\n    Bat b;\n    b.age = a;\n    cout << "Bat age: " << b.age;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['inheritance', 'virtual-base-classes', 'classes']
  },

  // Lesson 14: abstract (MEDIUM)
  'abstract-medium': {
    id: 'abstract-medium',
    title: 'Multi-Function Device Diamond Hierarchy',
    concepts: ['inheritance', 'virtual-base-classes', 'classes', 'methods'],
    difficulty: 'hard',
    level: 4,
    problemStatement: 'Implement a complete diamond hierarchy with virtual inheritance and constructor parameter passing:\\n1. Virtual base PoweredDevice has constructor PoweredDevice(int powerWatts), member powerWatts, and void printPower() const printing "Power: <powerWatts>W".\\n2. Printer virtually inherits PoweredDevice, adding int ppm (pages per min).\\n3. Scanner virtually inherits PoweredDevice, adding int dpi (dots per inch).\\n4. AllInOneCopier inherits from both Printer and Scanner. Because PoweredDevice is virtual, AllInOneCopier must directly invoke PoweredDevice(powerWatts) in its member initializer list.\\nProvide method void printSpecs() const in AllInOneCopier that calls printPower() and then prints "Speed: <ppm> ppm, Resolution: <dpi> dpi".',
    constraints: [
      'PoweredDevice must be a virtual base class of Printer and Scanner.',
      'AllInOneCopier must initialize PoweredDevice directly in its initializer list.'
    ],
    inputFormat: '<powerWatts:int> <ppm:int> <dpi:int>',
    outputFormat: 'Power: <powerWatts>W\\nSpeed: <ppm> ppm, Resolution: <dpi> dpi',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// TODO: Implement PoweredDevice, Printer, Scanner, and AllInOneCopier\n\nint main() {\n  int p, s, r;\n  if (cin >> p >> s >> r) {\n    AllInOneCopier machine(p, s, r);\n    machine.printSpecs();\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Standard office multi-function specs',
        input: '150 25 1200',
        expectedOutput: 'Power: 150W\nSpeed: 25 ppm, Resolution: 1200 dpi',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Compact home printer specs',
        input: '80 15 600',
        expectedOutput: 'Power: 80W\nSpeed: 15 ppm, Resolution: 600 dpi',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: commercial grade copier',
        input: '200 40 2400',
        expectedOutput: 'Power: 200W\nSpeed: 40 ppm, Resolution: 2400 dpi',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: low power portable unit',
        input: '50 10 300',
        expectedOutput: 'Power: 50W\nSpeed: 10 ppm, Resolution: 300 dpi',
        isHidden: true
      }
    ],
    expectedBehavior: 'Constructs virtual diamond hierarchy initializing virtual base directly from most-derived class.',
    hints: [
      'Declare class Printer : virtual public PoweredDevice and class Scanner : virtual public PoweredDevice.',
      'In AllInOneCopier constructor, write: PoweredDevice(p), Printer(p, s), Scanner(p, r).',
      'printSpecs() invokes printPower() followed by printing Speed and Resolution.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass PoweredDevice {\nprotected:\n  int powerWatts;\npublic:\n  PoweredDevice(int p) : powerWatts(p) {}\n  void printPower() const {\n    cout << "Power: " << powerWatts << "W" << endl;\n  }\n};\n\nclass Printer : virtual public PoweredDevice {\nprotected:\n  int ppm;\npublic:\n  Printer(int p, int s) : PoweredDevice(p), ppm(s) {}\n};\n\nclass Scanner : virtual public PoweredDevice {\nprotected:\n  int dpi;\npublic:\n  Scanner(int p, int d) : PoweredDevice(p), dpi(d) {}\n};\n\nclass AllInOneCopier : public Printer, public Scanner {\npublic:\n  AllInOneCopier(int p, int s, int d) : PoweredDevice(p), Printer(p, s), Scanner(p, d) {}\n  void printSpecs() const {\n    printPower();\n    cout << "Speed: " << ppm << " ppm, Resolution: " << dpi << " dpi";\n  }\n};\n\nint main() {\n  int p, s, r;\n  if (cin >> p >> s >> r) {\n    AllInOneCopier machine(p, s, r);\n    machine.printSpecs();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['inheritance', 'virtual-base-classes', 'classes', 'derived-constructors']
  },

  // Lesson 14: abstract (HARD) - Independent
  'abstract-hard': {
    id: 'abstract-hard',
    title: 'Smart Campus Automated Kiosk Unification System',
    concepts: ['inheritance', 'virtual-base-classes', 'classes', 'methods', 'access-control'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Design a unified smart kiosk system for an automated campus portal.\nThe kiosk integrates capabilities from two distinct subsystems: a card payment processor (which applies a transaction surcharge fee of F%) and a biometric security checkpoint (which verifies security clearance level L).\nBoth subsystems depend on a shared core terminal identity consisting of a terminal ID (string) and operational status ("Online" or "Offline").\nWhen these two capabilities are integrated into a single unified kiosk, the core terminal identity must remain singular and unambiguous—preventing duplicate or conflicting identity states.\nTotal charge is computed as amount + (amount * feeRate) / 100.\nGiven the terminal configuration and a transaction amount, initialize the unified kiosk and print:\nKiosk <terminalId> [<status>]: Clearance <L>, Total Charge: <total>',
    constraints: [
      'The core terminal identity must be shared unambiguously across integrated modules without duplicate state.',
      'Must use integer arithmetic for transaction fee calculations.'
    ],
    inputFormat: '<terminalId:string> <status:string> <clearance:int> <feeRate:int> <amount:int>',
    outputFormat: 'Kiosk <terminalId> [<status>]: Clearance <L>, Total Charge: <total>',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Online terminal with 5% fee on 100',
        input: 'K01 Online 2 5 100',
        expectedOutput: 'Kiosk K01 [Online]: Clearance 2, Total Charge: 105',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Offline terminal with 10% fee on 50',
        input: 'K02 Offline 3 10 50',
        expectedOutput: 'Kiosk K02 [Offline]: Clearance 3, Total Charge: 55',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Zero fee rate',
        input: 'LIB9 Online 1 0 200',
        expectedOutput: 'Kiosk LIB9 [Online]: Clearance 1, Total Charge: 200',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: 8% fee on 500',
        input: 'ADM4 Online 5 8 500',
        expectedOutput: 'Kiosk ADM4 [Online]: Clearance 5, Total Charge: 540',
        isHidden: true
      }
    ],
    expectedBehavior: 'Integrates diamond hierarchy with virtual inheritance and single base initialization.',
    hints: [
      'When two intermediate components both specialize a common core type, what issue arises if an integrated type combines both components?',
      'Consider how C++ resolves multiple inheritance ambiguity when both paths share a common root ancestor.',
      'Ensure the common ancestor is shared via virtual inheritance so the unified kiosk initializes the core identity exactly once.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass TerminalCore {\nprotected:\n  string terminalId;\n  string status;\npublic:\n  TerminalCore(string id, string st) : terminalId(id), status(st) {}\n  string getId() const { return terminalId; }\n  string getStatus() const { return status; }\n};\n\nclass CardPaymentModule : virtual public TerminalCore {\nprotected:\n  int feeRate;\npublic:\n  CardPaymentModule(string id, string st, int f) : TerminalCore(id, st), feeRate(f) {}\n};\n\nclass BiometricModule : virtual public TerminalCore {\nprotected:\n  int clearanceLevel;\npublic:\n  BiometricModule(string id, string st, int cl) : TerminalCore(id, st), clearanceLevel(cl) {}\n};\n\nclass SmartKiosk : public CardPaymentModule, public BiometricModule {\npublic:\n  SmartKiosk(string id, string st, int cl, int f)\n    : TerminalCore(id, st), CardPaymentModule(id, st, f), BiometricModule(id, st, cl) {}\n  int computeTotalCharge(int amount) const {\n    return amount + (amount * feeRate) / 100;\n  }\n  void display(int amount) const {\n    cout << "Kiosk " << terminalId << " [" << status << "]: Clearance " << clearanceLevel\n         << ", Total Charge: " << computeTotalCharge(amount);\n  }\n};\n\nint main() {\n  string id, status;\n  int cl, fee, amt;\n  if (cin >> id >> status >> cl >> fee >> amt) {\n    SmartKiosk kiosk(id, status, cl, fee);\n    kiosk.display(amt);\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['inheritance', 'virtual-base-classes', 'classes'],
    isIndependent: true
  },

  // Lesson 15: derived-constructors (MINI) - Debugging
  'derived-constructors-mini': {
    id: 'derived-constructors-mini',
    title: 'Fix Missing Base Constructor Chaining',
    concepts: ['derived-constructors', 'inheritance', 'constructors'],
    difficulty: 'easy',
    level: 1,
    problemStatement: 'Base class Person has only a parameterized constructor Person(string name) and no default constructor. Derived class Student attempts to initialize its own id member without calling Person(name) in its member initializer list, causing a compiler error: "no matching function for call to Person::Person()". Fix the Student constructor by properly chaining to Person(name).',
    constraints: [
      'Do not add a default constructor to Person.',
      'Must chain Person(name) in Student\'s constructor initializer list.'
    ],
    inputFormat: '<name:string> <id:int>',
    outputFormat: 'Student: <name>, ID: <id>',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Person {\nprotected:\n  string name;\npublic:\n  Person(string n) : name(n) {}\n};\n\nclass Student : public Person {\nprivate:\n  int id;\npublic:\n  // BUG: Fails to invoke base class constructor in initializer list\n  Student(string n, int i) : id(i) {}\n  void display() const {\n    cout << "Student: " << name << ", ID: " << id;\n  }\n};\n\nint main() {\n  string name;\n  int id;\n  if (cin >> name >> id) {\n    Student s(name, id);\n    s.display();\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Student David ID 1042',
        input: 'David 1042',
        expectedOutput: 'Student: David, ID: 1042',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Student Eva ID 2085',
        input: 'Eva 2085',
        expectedOutput: 'Student: Eva, ID: 2085',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Max ID 9999',
        input: 'Max 9999',
        expectedOutput: 'Student: Max, ID: 9999',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Zoe ID 1001',
        input: 'Zoe 1001',
        expectedOutput: 'Student: Zoe, ID: 1001',
        isHidden: true
      }
    ],
    expectedBehavior: 'Explicitly invokes base constructor in derived constructor initializer list.',
    hints: [
      'When a base class has no default constructor, the derived class constructor must explicitly call the base constructor.',
      'In Student constructor, add Person(n) before or after id(i) in the initializer list.',
      'Change Student(string n, int i) : id(i) {} to Student(string n, int i) : Person(n), id(i) {}.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Person {\nprotected:\n  string name;\npublic:\n  Person(string n) : name(n) {}\n};\n\nclass Student : public Person {\nprivate:\n  int id;\npublic:\n  Student(string n, int i) : Person(n), id(i) {}\n  void display() const {\n    cout << "Student: " << name << ", ID: " << id;\n  }\n};\n\nint main() {\n  string name;\n  int id;\n  if (cin >> name >> id) {\n    Student s(name, id);\n    s.display();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['derived-constructors', 'inheritance', 'constructors']
  },

  // Lesson 15: derived-constructors (MEDIUM)
  'derived-constructors-medium': {
    id: 'derived-constructors-medium',
    title: 'Three-Tier Vehicle Hierarchy Constructor Chaining',
    concepts: ['derived-constructors', 'inheritance', 'constructors', 'classes'],
    difficulty: 'medium',
    level: 4,
    problemStatement: 'Implement a 3-tier constructor chaining hierarchy:\\n1. Base class Vehicle has string brand and constructor Vehicle(string b).\\n2. Intermediate class Car inherits Vehicle, adding int cylinders, with constructor Car(string b, int c) chaining to Vehicle(b).\\n3. Most derived class ElectricCar inherits Car, adding int batteryKWh, with constructor ElectricCar(string b, int c, int k) chaining to Car(b, c).\\nProvide method void display() const in ElectricCar that outputs "Vehicle: <brand>, Cylinders: <cylinders>, Battery: <batteryKWh> kWh".',
    constraints: [
      'Each derived class must chain to its immediate base constructor using member initializer lists.',
      'Output must follow specified format exactly.'
    ],
    inputFormat: '<brand:string> <cylinders:int> <batteryKWh:int>',
    outputFormat: 'Vehicle: <brand>, Cylinders: <cylinders>, Battery: <batteryKWh> kWh',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\n// TODO: Implement Vehicle, Car, and ElectricCar with 3-tier constructor chaining\n\nint main() {\n  string brand;\n  int cyl, kwh;\n  if (cin >> brand >> cyl >> kwh) {\n    ElectricCar ec(brand, cyl, kwh);\n    ec.display();\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Pure electric vehicle (0 cylinders, 75 kWh)',
        input: 'Volt 0 75',
        expectedOutput: 'Vehicle: Volt, Cylinders: 0, Battery: 75 kWh',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Plug-in hybrid vehicle (4 cylinders, 18 kWh)',
        input: 'HybridSedan 4 18',
        expectedOutput: 'Vehicle: HybridSedan, Cylinders: 4, Battery: 18 kWh',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: High capacity roadster',
        input: 'Roadster 0 100',
        expectedOutput: 'Vehicle: Roadster, Cylinders: 0, Battery: 100 kWh',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Range extended city car',
        input: 'CityCar 2 24',
        expectedOutput: 'Vehicle: CityCar, Cylinders: 2, Battery: 24 kWh',
        isHidden: true
      }
    ],
    expectedBehavior: 'Chains constructors through 3 levels of class hierarchy using initializer lists.',
    hints: [
      'Car constructor: Car(string b, int c) : Vehicle(b), cylinders(c) {}.',
      'ElectricCar constructor: ElectricCar(string b, int c, int k) : Car(b, c), batteryKWh(k) {}.',
      'Make members protected or provide getters for display().'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Vehicle {\nprotected:\n  string brand;\npublic:\n  Vehicle(string b) : brand(b) {}\n};\n\nclass Car : public Vehicle {\nprotected:\n  int cylinders;\npublic:\n  Car(string b, int c) : Vehicle(b), cylinders(c) {}\n};\n\nclass ElectricCar : public Car {\nprivate:\n  int batteryKWh;\npublic:\n  ElectricCar(string b, int c, int k) : Car(b, c), batteryKWh(k) {}\n  void display() const {\n    cout << "Vehicle: " << brand << ", Cylinders: " << cylinders << ", Battery: " << batteryKWh << " kWh";\n  }\n};\n\nint main() {\n  string brand;\n  int cyl, kwh;\n  if (cin >> brand >> cyl >> kwh) {\n    ElectricCar ec(brand, cyl, kwh);\n    ec.display();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['derived-constructors', 'inheritance', 'constructors', 'classes']
  },

  // Lesson 15: derived-constructors (HARD) - Independent
  'derived-constructors-hard': {
    id: 'derived-constructors-hard',
    title: 'Collegiate Scholarship Athlete Eligibility Engine',
    concepts: ['derived-constructors', 'inheritance', 'constructors', 'classes', 'access-control'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Implement an eligibility evaluation engine for a university collegiate athletic scholarship program.\nThe system tracks candidate profiles across three organizational tiers of information:\n1. Foundational identity: general personal record consisting of name (string) and age (int).\n2. Academic enrollment: university student details including student ID (int) and cumulative GPA (int, scaled by 100, e.g. 380 represents a 3.80 GPA).\n3. Athletic participation: specialized sport name (string) and weekly training hours (int).\nEach layer builds upon and extends the preceding layer. When an athlete profile is instantiated, all foundational identity and academic attributes must be properly propagated to their respective foundational layers during object initialization.\nAn athlete qualifies for the scholarship if and only if their scaled GPA is at least 350 and their weekly training hours reach at least 15.\nGiven an athlete profile details, evaluate eligibility and display:\nAthlete: <name>, Sport: <sport>, Qualified: <Yes/No>',
    constraints: [
      'Object initialization must properly pass foundational attributes through each layer of the hierarchy.',
      'Qualification requires centiGpa >= 350 AND weeklyTrainingHours >= 15.'
    ],
    inputFormat: '<name:string> <age:int> <id:int> <centiGpa:int> <sport:string> <hours:int>',
    outputFormat: 'Athlete: <name>, Sport: <sport>, Qualified: <Yes/No>',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Qualifying athlete (3.80 GPA and 18 hrs training)',
        input: 'Marcus 20 501 380 Track 18',
        expectedOutput: 'Athlete: Marcus, Sport: Track, Qualified: Yes',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Disqualified on GPA (3.20 GPA < 3.50)',
        input: 'Chloe 19 502 320 Soccer 20',
        expectedOutput: 'Athlete: Chloe, Sport: Soccer, Qualified: No',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Disqualified on hours (12 hrs < 15)',
        input: 'James 21 503 360 Basketball 12',
        expectedOutput: 'Athlete: James, Sport: Basketball, Qualified: No',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Exact boundary conditions (3.50 GPA and 15 hrs)',
        input: 'Taylor 22 504 350 Swimming 15',
        expectedOutput: 'Athlete: Taylor, Sport: Swimming, Qualified: Yes',
        isHidden: true
      }
    ],
    expectedBehavior: 'Chains parameterized constructors across 3 levels to enforce composite qualification criteria.',
    hints: [
      'Think about how to model layered domain entities where a specialized role extends more general concepts.',
      'How do derived classes pass initialization arguments up to their parent and grandparent constructors?',
      'Use member initializer lists to invoke the immediate base class constructor at each tier of the hierarchy.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Person {\nprotected:\n  string name;\n  int age;\npublic:\n  Person(string n, int a) : name(n), age(a) {}\n  string getName() const { return name; }\n};\n\nclass Student : public Person {\nprotected:\n  int studentId;\n  int centiGpa;\npublic:\n  Student(string n, int a, int id, int gpa) : Person(n, a), studentId(id), centiGpa(gpa) {}\n  int getCentiGpa() const { return centiGpa; }\n};\n\nclass ScholarshipAthlete : public Student {\nprivate:\n  string sport;\n  int weeklyTrainingHours;\npublic:\n  ScholarshipAthlete(string n, int a, int id, int gpa, string sp, int hrs)\n    : Student(n, a, id, gpa), sport(sp), weeklyTrainingHours(hrs) {}\n  bool isQualified() const {\n    return (centiGpa >= 350 && weeklyTrainingHours >= 15);\n  }\n  void display() const {\n    cout << "Athlete: " << name << ", Sport: " << sport << ", Qualified: " << (isQualified() ? "Yes" : "No");\n  }\n};\n\nint main() {\n  string name, sport;\n  int age, id, gpa, hrs;\n  if (cin >> name >> age >> id >> gpa >> sport >> hrs) {\n    ScholarshipAthlete athlete(name, age, id, gpa, sport, hrs);\n    athlete.display();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['derived-constructors', 'inheritance', 'constructors', 'classes'],
    isIndependent: true
  },

  // ==========================================
  // MODULE 8: COMPILE-TIME POLYMORPHISM & OPERATOR OVERLOADING
  // ==========================================

  // Lesson 16: overloading (MINI) - Debugging
  'overloading-mini': {
    id: 'overloading-mini',
    title: 'Fix Ambiguous Function Overload & Type Promotion',
    concepts: ['function-overloading', 'functions', 'types'],
    difficulty: 'easy',
    level: 1,
    problemStatement: 'The starter program provides overloaded compute() functions for integers, doubles, and characters. However, ambiguous default arguments and missing explicit promotion signatures cause compiler errors: "call of overloaded compute is ambiguous". Fix the function declarations and calls so that integer squaring, double doubling, and char duplication execute cleanly without ambiguity.',
    constraints: [
      'Must resolve ambiguities using distinct, unambiguous overload signatures.',
      'Must not remove the concept of function overloading.'
    ],
    inputFormat: '<type:char> followed by parameter: "I <int>", "D <double>", or "C <char>".',
    outputFormat: 'Int: <x*x>, Double: <x*2>, or Char: <c><c>',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// BUG: Ambiguous default argument and conflicting overloads\nint compute(int x, int factor = 1) {\n  return x * x;\n}\n\ndouble compute(double x) {\n  return x * 2.0;\n}\n\nvoid compute(char c) {\n  cout << "Char: " << c << c << endl;\n}\n\n// BUG: Ambiguous overload causing conflict with compute(int)\nint compute(int x) {\n  return x * x;\n}\n\nint main() {\n  char type;\n  if (cin >> type) {\n    if (type == 'I') {\n      int x;\n      cin >> x;\n      cout << "Int: " << compute(x) << endl;\n    } else if (type == 'D') {\n      double x;\n      cin >> x;\n      cout << "Double: " << compute(x) << endl;\n    } else if (type == 'C') {\n      char c;\n      cin >> c;\n      compute(c);\n    }\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Integer squaring overload',
        input: 'I 6',
        expectedOutput: 'Int: 36',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Double doubling overload',
        input: 'D 4.5',
        expectedOutput: 'Double: 9',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Character repetition overload',
        input: 'C Z',
        expectedOutput: 'Char: ZZ',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Negative integer squaring',
        input: 'I -5',
        expectedOutput: 'Int: 25',
        isHidden: true
      }
    ],
    expectedBehavior: 'Dispatches to the correct function overload based on argument type without ambiguity.',
    hints: [
      'Look at why having both int compute(int x, int factor = 1) and int compute(int x) causes a compiler conflict when called with one argument.',
      'Remove the duplicate or default parameter so each overload has a distinct, unambiguous signature.',
      'Ensure the three signatures are: int compute(int), double compute(double), and void compute(char).'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nint compute(int x) {\n  return x * x;\n}\n\ndouble compute(double x) {\n  return x * 2.0;\n}\n\nvoid compute(char c) {\n  cout << "Char: " << c << c;\n}\n\nint main() {\n  char type;\n  if (cin >> type) {\n    if (type == 'I') {\n      int x;\n      cin >> x;\n      cout << "Int: " << compute(x);\n    } else if (type == 'D') {\n      double x;\n      cin >> x;\n      cout << "Double: " << compute(x);\n    } else if (type == 'C') {\n      char c;\n      cin >> c;\n      compute(c);\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['functions', 'types']
  },

  // Lesson 16: overloading (MEDIUM)
  'overloading-medium': {
    id: 'overloading-medium',
    title: 'Complex Number Addition via Member operator+',
    concepts: ['operator-overloading', 'binary-operators', 'classes'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Implement a Complex number class representing a + bi with integer real and imag components. Overload member operator+(const Complex& other) const to return a new Complex object representing the sum: (real + other.real) and (imag + other.imag). Provide a method void display() const that outputs formatted text: "<real> + <imag>i" if imag >= 0, or "<real> - <abs(imag)>i" if imag < 0.',
    constraints: [
      'Must overload operator+ as a member function returning a new Complex instance.',
      'Formatting must handle positive and negative imaginary parts cleanly.'
    ],
    inputFormat: '<r1:int> <i1:int> <r2:int> <i2:int>',
    outputFormat: '<real> + <imag>i OR <real> - <abs(imag)>i',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Complex {\nprivate:\n  int real, imag;\npublic:\n  Complex(int r = 0, int i = 0) : real(r), imag(i) {}\n  // TODO: Overload operator+(const Complex& other) const\n  // TODO: Implement display() const\n};\n\nint main() {\n  int r1, i1, r2, i2;\n  if (cin >> r1 >> i1 >> r2 >> i2) {\n    Complex c1(r1, i1), c2(r2, i2);\n    Complex c3 = c1 + c2;\n    c3.display();\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Positive imaginary sum',
        input: '3 4 1 2',
        expectedOutput: '4 + 6i',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Negative imaginary sum',
        input: '5 2 2 -7',
        expectedOutput: '7 - 5i',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Zero imaginary sum',
        input: '10 0 -4 0',
        expectedOutput: '6 + 0i',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Both real and imaginary negative',
        input: '-2 -3 -5 -4',
        expectedOutput: '-7 - 7i',
        isHidden: true
      }
    ],
    expectedBehavior: 'Overloads operator+ to perform component-wise complex addition.',
    hints: [
      'Write the signature: Complex operator+(const Complex& other) const.',
      'Return a newly constructed Complex(real + other.real, imag + other.imag).',
      'In display(), check if imag >= 0 to format either " + " << imag << "i" or " - " << -imag << "i".'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Complex {\nprivate:\n  int real, imag;\npublic:\n  Complex(int r = 0, int i = 0) : real(r), imag(i) {}\n  Complex operator+(const Complex& other) const {\n    return Complex(real + other.real, imag + other.imag);\n  }\n  void display() const {\n    if (imag >= 0) {\n      cout << real << " + " << imag << "i";\n    } else {\n      cout << real << " - " << -imag << "i";\n    }\n  }\n};\n\nint main() {\n  int r1, i1, r2, i2;\n  if (cin >> r1 >> i1 >> r2 >> i2) {\n    Complex c1(r1, i1), c2(r2, i2);\n    Complex c3 = c1 + c2;\n    c3.display();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'operator-overloading', 'binary-operators']
  },

  // Lesson 16: overloading (HARD) - Independent
  'overloading-hard': {
    id: 'overloading-hard',
    title: 'Rational Fraction Arithmetic & Simplification Engine',
    concepts: ['operator-overloading', 'binary-operators', 'classes', 'methods'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Design a rational fraction arithmetic calculator that performs exact mathematical calculations without floating-point inaccuracies. Given two fractions n1/d1 and n2/d2 (with positive non-zero denominators) and an operation character (+, -, or *), compute the exact result and reduce it to lowest terms by dividing numerator and denominator by their greatest common divisor (GCD). If the result is negative, place the negative sign on the numerator. Output: "<num>/<den>".',
    constraints: [
      'Resulting fraction must be in lowest terms (GCD(abs(num), den) == 1).',
      'Denominators in output must be strictly positive.'
    ],
    inputFormat: '<n1:int> <d1:int> <op:char> <n2:int> <d2:int>',
    outputFormat: '<num>/<den>',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Fraction addition: 1/2 + 1/3 = 5/6',
        input: '1 2 + 1 3',
        expectedOutput: '5/6',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Fraction multiplication with reduction: 3/4 * 2/5 = 3/10',
        input: '3 4 * 2 5',
        expectedOutput: '3/10',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Negative result: 1/3 - 5/6 = -1/2',
        input: '1 3 - 5 6',
        expectedOutput: '-1/2',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Reduction to whole integer: 4/6 + 2/6 = 1/1',
        input: '4 6 + 2 6',
        expectedOutput: '1/1',
        isHidden: true
      }
    ],
    expectedBehavior: 'Applies overloaded operators to compute and simplify exact rational fractions.',
    hints: [
      'Formulas: (a/b) + (c/d) = (a*d + b*c)/(b*d), (a/b) - (c/d) = (a*d - b*c)/(b*d), (a/b) * (c/d) = (a*c)/(b*d).',
      'Implement a helper gcd(int a, int b) using Euclid\'s algorithm to reduce numerator and denominator.',
      'Overload operator+, operator-, and operator* to return newly simplified Fraction objects.'
    ],
    solution: `#include <iostream>\n#include <cstdlib>\nusing namespace std;\n\nint gcd(int a, int b) {\n  a = abs(a);\n  b = abs(b);\n  while (b != 0) {\n    int temp = b;\n    b = a % b;\n    a = temp;\n  }\n  return (a == 0) ? 1 : a;\n}\n\nclass Fraction {\nprivate:\n  int num, den;\n  void reduce() {\n    if (den < 0) {\n      num = -num;\n      den = -den;\n    }\n    int g = gcd(num, den);\n    num /= g;\n    den /= g;\n  }\npublic:\n  Fraction(int n = 0, int d = 1) : num(n), den(d) {\n    reduce();\n  }\n  Fraction operator+(const Fraction& o) const {\n    return Fraction(num * o.den + den * o.num, den * o.den);\n  }\n  Fraction operator-(const Fraction& o) const {\n    return Fraction(num * o.den - den * o.num, den * o.den);\n  }\n  Fraction operator*(const Fraction& o) const {\n    return Fraction(num * o.num, den * o.den);\n  }\n  void display() const {\n    cout << num << "/" << den;\n  }\n};\n\nint main() {\n  int n1, d1, n2, d2;\n  char op;\n  if (cin >> n1 >> d1 >> op >> n2 >> d2) {\n    Fraction f1(n1, d1), f2(n2, d2);\n    Fraction res;\n    if (op == '+') res = f1 + f2;\n    else if (op == '-') res = f1 - f2;\n    else if (op == '*') res = f1 * f2;\n    res.display();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'operator-overloading', 'binary-operators'],
    isIndependent: true
  },

  // Lesson 17: operators (MINI) - Debugging
  'operators-mini': {
    id: 'operators-mini',
    title: 'Fix Unary Operator- and Prefix Increment Semantics',
    concepts: ['unary-operators', 'operator-overloading', 'classes'],
    difficulty: 'easy',
    level: 1,
    problemStatement: 'The starter code defines a 2D coordinate class Vector2D and overloads unary negation operator-() and prefix increment operator++(). However, unary minus modifies the object in-place instead of returning a new negated vector, and prefix increment returns void instead of Vector2D&, preventing chained increments like ++(++v). Fix both operator overloads to follow standard C++ semantics.',
    constraints: [
      'Unary operator- must not mutate the calling object and must return a new Vector2D by value.',
      'Prefix operator++ must mutate *this and return *this by reference (Vector2D&).'
    ],
    inputFormat: '<x:int> <y:int>',
    outputFormat: 'Negated: (<x>, <y>)\\nIncremented: (<x>, <y>)',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Vector2D {\npublic:\n  int x, y;\n  Vector2D(int x_ = 0, int y_ = 0) : x(x_), y(y_) {}\n\n  // BUG: Unary minus mutates *this instead of returning a new object!\n  Vector2D operator-() {\n    x = -x;\n    y = -y;\n    return *this;\n  }\n\n  // BUG: Prefix increment returns void instead of Vector2D&!\n  void operator++() {\n    x++;\n    y++;\n  }\n};\n\nint main() {\n  int x, y;\n  if (cin >> x >> y) {\n    Vector2D v(x, y);\n    Vector2D neg = -v;\n    cout << "Negated: (" << neg.x << ", " << neg.y << ")" << endl;\n    ++(++v); // Chained prefix increment\n    cout << "Incremented: (" << v.x << ", " << v.y << ")";\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Standard positive coordinate vector',
        input: '3 4',
        expectedOutput: 'Negated: (-3, -4)\nIncremented: (5, 6)',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Mixed signs',
        input: '-2 7',
        expectedOutput: 'Negated: (2, -7)\nIncremented: (0, 9)',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Origin vector',
        input: '0 0',
        expectedOutput: 'Negated: (0, 0)\nIncremented: (2, 2)',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Negative coordinates',
        input: '-10 -15',
        expectedOutput: 'Negated: (10, 15)\nIncremented: (-8, -13)',
        isHidden: true
      }
    ],
    expectedBehavior: 'Correctly implements non-mutating unary negation and chainable prefix increment.',
    hints: [
      'Unary operator- should be const and return Vector2D(-x, -y) without changing x or y.',
      'Prefix operator++ should increment x and y, and return *this with return type Vector2D&.',
      'Check that ++(++v) successfully increments the original vector twice.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Vector2D {\npublic:\n  int x, y;\n  Vector2D(int x_ = 0, int y_ = 0) : x(x_), y(y_) {}\n\n  Vector2D operator-() const {\n    return Vector2D(-x, -y);\n  }\n\n  Vector2D& operator++() {\n    x++;\n    y++;\n    return *this;\n  }\n};\n\nint main() {\n  int x, y;\n  if (cin >> x >> y) {\n    Vector2D v(x, y);\n    Vector2D neg = -v;\n    cout << "Negated: (" << neg.x << ", " << neg.y << ")" << endl;\n    ++(++v);\n    cout << "Incremented: (" << v.x << ", " << v.y << ")";\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['unary-operators', 'operator-overloading', 'classes']
  },

  // Lesson 17: operators (MEDIUM)
  'operators-medium': {
    id: 'operators-medium',
    title: 'Commutative Scalar Multiplication via Friend operator*',
    concepts: ['friend-operators', 'operator-overloading', 'binary-operators', 'classes'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Implement a 2D coordinate class Vector2D supporting commutative scalar multiplication. A member operator*(int k) const allows scaling when the vector is on the left: v * k. To allow scaling when the scalar is on the left (k * v), implement a non-member friend operator*(int k, const Vector2D& v). Read vector coordinates x, y and integer scalar k, compute both products, and output: "Left: (<kx>, <ky>), Right: (<kx>, <ky>)".',
    constraints: [
      'Must support both v * k and k * v yielding identical values.',
      'Friend operator* must be non-member function.'
    ],
    inputFormat: '<x:int> <y:int> <k:int>',
    outputFormat: 'Left: (<kx>, <ky>), Right: (<kx>, <ky>)',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass Vector2D {\nprivate:\n  int x, y;\npublic:\n  Vector2D(int x_ = 0, int y_ = 0) : x(x_), y(y_) {}\n  // TODO: Implement member operator*(int k) const\n  // TODO: Declare friend operator*(int k, const Vector2D& v)\n  void print() const { cout << "(" << x << ", " << y << ")"; }\n};\n\n// TODO: Implement friend operator*(int k, const Vector2D& v)\n\nint main() {\n  int x, y, k;\n  if (cin >> x >> y >> k) {\n    Vector2D v(x, y);\n    Vector2D left = k * v;\n    Vector2D right = v * k;\n    cout << "Left: "; left.print();\n    cout << ", Right: "; right.print();\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Positive scalar scaling',
        input: '2 5 3',
        expectedOutput: 'Left: (6, 15), Right: (6, 15)',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Negative vector coordinates',
        input: '-4 1 2',
        expectedOutput: 'Left: (-8, 2), Right: (-8, 2)',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Zero scalar multiplication',
        input: '7 -3 0',
        expectedOutput: 'Left: (0, 0), Right: (0, 0)',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Negative scalar',
        input: '-5 -8 -2',
        expectedOutput: 'Left: (10, 16), Right: (10, 16)',
        isHidden: true
      }
    ],
    expectedBehavior: 'Provides commutative scalar multiplication via member and friend operator overloads.',
    hints: [
      'Member operator: Vector2D operator*(int k) const { return Vector2D(x * k, y * k); }.',
      'Declare friend: friend Vector2D operator*(int k, const Vector2D& v); inside Vector2D.',
      'Define the friend function by delegating to v * k.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Vector2D {\nprivate:\n  int x, y;\npublic:\n  Vector2D(int x_ = 0, int y_ = 0) : x(x_), y(y_) {}\n  Vector2D operator*(int k) const {\n    return Vector2D(x * k, y * k);\n  }\n  friend Vector2D operator*(int k, const Vector2D& v) {\n    return v * k;\n  }\n  void print() const {\n    cout << "(" << x << ", " << y << ")";\n  }\n};\n\nint main() {\n  int x, y, k;\n  if (cin >> x >> y >> k) {\n    Vector2D v(x, y);\n    Vector2D left = k * v;\n    Vector2D right = v * k;\n    cout << "Left: "; left.print();\n    cout << ", Right: "; right.print();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['operator-overloading', 'friend-operators', 'classes']
  },

  // Lesson 17: operators (HARD) - Independent
  'operators-hard': {
    id: 'operators-hard',
    title: 'Geometric Bounding Region Combiner & Comparison Tool',
    concepts: ['operator-overloading', 'binary-operators', 'classes', 'access-control'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Implement a computational geometry tool for analyzing 2D rectangular bounding regions.\nEach region is defined by its bottom-left coordinate (x1, y1) and top-right coordinate (x2, y2), where x1 <= x2 and y1 <= y2.\nThe geometric model should support natural algebraic and relational syntax:\n1. Combining two regions with standard addition notation (+) must yield the minimal enclosing boundary: (min(x1, x1\'), min(y1, y1\')) to (max(x2, x2\'), max(y2, y2\')).\n2. Comparing two regions for exact equivalence with equality syntax (==) must evaluate whether all boundary limits coincide.\nThe area of any bounding region is (x2 - x1) * (y2 - y1).\nGiven two bounding regions, compute their combination, determine the area of the combined region, and report whether the two input regions are identical.\nOutput:\nUnion: [(<x1>, <y1>) to (<x2>, <y2>)], Area: <area>, Equal: <Yes/No>',
    constraints: [
      'Boundary coordinates must remain private and encapsulated.',
      'Combining regions must support natural addition syntax (+), and equality comparison must support standard equality syntax (==).'
    ],
    inputFormat: '<x1> <y1> <x2> <y2> \n <x1_> <y1_> <x2_> <y2_>',
    outputFormat: 'Union: [(<x1>, <y1>) to (<x2>, <y2>)], Area: <area>, Equal: <Yes/No>',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Overlapping distinct boxes union',
        input: '0 0 4 4\n2 2 6 6',
        expectedOutput: 'Union: [(0, 0) to (6, 6)], Area: 36, Equal: No',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Identical boxes equality',
        input: '1 1 5 5\n1 1 5 5',
        expectedOutput: 'Union: [(1, 1) to (5, 5)], Area: 16, Equal: Yes',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Negative coordinate bounds',
        input: '-2 -2 2 2\n0 0 5 3',
        expectedOutput: 'Union: [(-2, -2) to (5, 3)], Area: 35, Equal: No',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Identical non-origin boxes',
        input: '10 20 15 25\n10 20 15 25',
        expectedOutput: 'Union: [(10, 20) to (15, 25)], Area: 25, Equal: Yes',
        isHidden: true
      }
    ],
    expectedBehavior: 'Computes bounding union via operator+ and tests boundary equivalence via operator==.',
    hints: [
      'How can you enable custom types to interact using standard arithmetic and comparison symbols like + and ==?',
      'Consider overloading operator+ to return a new bounding region and operator== to return a boolean.',
      'The enclosing region spans from min(x1, other.x1) to max(x2, other.x2) across both dimensions.'
    ],
    solution: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nclass BoundingBox {\nprivate:\n  int x1, y1, x2, y2;\npublic:\n  BoundingBox(int a = 0, int b = 0, int c = 0, int d = 0) : x1(a), y1(b), x2(c), y2(d) {}\n  BoundingBox operator+(const BoundingBox& o) const {\n    return BoundingBox(min(x1, o.x1), min(y1, o.y1), max(x2, o.x2), max(y2, o.y2));\n  }\n  bool operator==(const BoundingBox& o) const {\n    return (x1 == o.x1 && y1 == o.y1 && x2 == o.x2 && y2 == o.y2);\n  }\n  int area() const {\n    return (x2 - x1) * (y2 - y1);\n  }\n  void display() const {\n    cout << "[(" << x1 << ", " << y1 << ") to (" << x2 << ", " << y2 << ")]";\n  }\n};\n\nint main() {\n  int a, b, c, d, e, f, g, h;\n  if (cin >> a >> b >> c >> d >> e >> f >> g >> h) {\n    BoundingBox b1(a, b, c, d), b2(e, f, g, h);\n    BoundingBox u = b1 + b2;\n    cout << "Union: "; u.display();\n    cout << ", Area: " << u.area() << ", Equal: " << ((b1 == b2) ? "Yes" : "No");\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['operator-overloading', 'binary-operators', 'classes'],
    isIndependent: true
  },

  // Lesson 19: string-operators (MINI)
  'string-operators-mini': {
    id: 'string-operators-mini',
    title: 'Concatenate Fixed Buffers with operator+',
    concepts: ['string-operators', 'operator-overloading', 'classes'],
    difficulty: 'easy',
    level: 2,
    problemStatement: 'Complete a lightweight string wrapper class CustomString that stores text in a fixed character buffer (up to 64 chars) without using <string>. Overload member operator+(const CustomString& other) const to concatenate both strings into a new CustomString. Output: "Result: <text> (Length: <len>)".',
    constraints: [
      'Must implement operator+ returning a new CustomString.',
      'Buffer size is at most 64 characters.'
    ],
    inputFormat: 'Two single-word strings on standard input: <word1> <word2>',
    outputFormat: 'Result: <concatenated> (Length: <len>)',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass CustomString {\nprivate:\n  char buf[64];\n  int len;\npublic:\n  CustomString() : len(0) { buf[0] = '\\0'; }\n  CustomString(const char* s);\n  // TODO: Overload operator+(const CustomString& other) const\n  void display() const;\n};\n\n// TODO: Implement constructor, operator+, and display\n\nint main() {\n  char w1[32], w2[32];\n  if (cin >> w1 >> w2) {\n    CustomString s1(w1), s2(w2);\n    CustomString s3 = s1 + s2;\n    s3.display();\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Concatenate Hello and World',
        input: 'Hello World',
        expectedOutput: 'Result: HelloWorld (Length: 10)',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Concatenate Code and Bloom',
        input: 'Code Bloom',
        expectedOutput: 'Result: CodeBloom (Length: 9)',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Short symbols',
        input: 'C ++',
        expectedOutput: 'Result: C++ (Length: 3)',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Longer words',
        input: 'Super Fast',
        expectedOutput: 'Result: SuperFast (Length: 9)',
        isHidden: true
      }
    ],
    expectedBehavior: 'Overloads operator+ to join custom character buffers into a new instance.',
    hints: [
      'In CustomString(const char* s), copy characters into buf and count len until null terminator.',
      'In operator+(const CustomString& other) const, create a result object, copy this->buf, then append other.buf.',
      'Always append a null terminator \'\\0\' at the end of the combined buffer.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass CustomString {\nprivate:\n  char buf[64];\n  int len;\npublic:\n  CustomString() : len(0) { buf[0] = '\\0'; }\n  CustomString(const char* s) : len(0) {\n    while (s[len] != '\\0' && len < 63) {\n      buf[len] = s[len];\n      len++;\n    }\n    buf[len] = '\\0';\n  }\n  CustomString operator+(const CustomString& other) const {\n    CustomString res;\n    for (int i = 0; i < len; i++) {\n      res.buf[res.len++] = buf[i];\n    }\n    for (int i = 0; i < other.len; i++) {\n      res.buf[res.len++] = other.buf[i];\n    }\n    res.buf[res.len] = '\\0';\n    return res;\n  }\n  void display() const {\n    cout << "Result: " << buf << " (Length: " << len << ")";\n  }\n};\n\nint main() {\n  char w1[32], w2[32];\n  if (cin >> w1 >> w2) {\n    CustomString s1(w1), s2(w2);\n    CustomString s3 = s1 + s2;\n    s3.display();\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['string-operators', 'operator-overloading', 'classes']
  },

  // Lesson 19: string-operators (MEDIUM)
  'string-operators-medium': {
    id: 'string-operators-medium',
    title: 'Lexicographical Comparison Operators for Custom Strings',
    concepts: ['string-operators', 'operator-overloading', 'binary-operators', 'classes'],
    difficulty: 'medium',
    level: 3,
    problemStatement: 'Implement relational comparison operators operator== and operator< for CustomString. Two custom strings are equal if they have identical characters in identical order and equal length. s1 < s2 returns true if s1 is strictly lexicographically smaller than s2 (standard character ASCII order). Given two words, compare them and output: "Equal: <Yes/No>, S1 < S2: <Yes/No>".',
    constraints: [
      'Must overload both operator== and operator<.',
      'Comparison must follow standard lexicographical ordering.'
    ],
    inputFormat: '<str1:string> <str2:string>',
    outputFormat: 'Equal: <Yes/No>, S1 < S2: <Yes/No>',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass CustomString {\nprivate:\n  char buf[64];\n  int len;\npublic:\n  CustomString(const char* s = "") : len(0) {\n    while (s[len] != '\\0' && len < 63) {\n      buf[len] = s[len];\n      len++;\n    }\n    buf[len] = '\\0';\n  }\n  // TODO: Overload operator==(const CustomString& other) const\n  // TODO: Overload operator<(const CustomString& other) const\n};\n\nint main() {\n  char w1[32], w2[32];\n  if (cin >> w1 >> w2) {\n    CustomString s1(w1), s2(w2);\n    cout << "Equal: " << ((s1 == s2) ? "Yes" : "No")\n         << ", S1 < S2: " << ((s1 < s2) ? "Yes" : "No");\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Lexicographical ordering: apple < banana',
        input: 'apple banana',
        expectedOutput: 'Equal: No, S1 < S2: Yes',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Identical strings equality',
        input: 'grape grape',
        expectedOutput: 'Equal: Yes, S1 < S2: No',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Reversed ordering',
        input: 'orange apple',
        expectedOutput: 'Equal: No, S1 < S2: No',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Prefix string is smaller than longer string',
        input: 'cat caterpillar',
        expectedOutput: 'Equal: No, S1 < S2: Yes',
        isHidden: true
      }
    ],
    expectedBehavior: 'Overloads comparison operators to evaluate string equality and lexicographical precedence.',
    hints: [
      'In operator==, check len == other.len first, then compare characters in a loop.',
      'In operator<, compare characters while i < len && i < other.len. If characters differ, return buf[i] < other.buf[i].',
      'If common prefixes are equal, the shorter string is smaller: return len < other.len.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass CustomString {\nprivate:\n  char buf[64];\n  int len;\npublic:\n  CustomString(const char* s = "") : len(0) {\n    while (s[len] != '\\0' && len < 63) {\n      buf[len] = s[len];\n      len++;\n    }\n    buf[len] = '\\0';\n  }\n  bool operator==(const CustomString& other) const {\n    if (len != other.len) return false;\n    for (int i = 0; i < len; i++) {\n      if (buf[i] != other.buf[i]) return false;\n    }\n    return true;\n  }\n  bool operator<(const CustomString& other) const {\n    int minL = (len < other.len) ? len : other.len;\n    for (int i = 0; i < minL; i++) {\n      if (buf[i] != other.buf[i]) {\n        return buf[i] < other.buf[i];\n      }\n    }\n    return len < other.len;\n  }\n};\n\nint main() {\n  char w1[32], w2[32];\n  if (cin >> w1 >> w2) {\n    CustomString s1(w1), s2(w2);\n    cout << "Equal: " << ((s1 == s2) ? "Yes" : "No")\n         << ", S1 < S2: " << ((s1 < s2) ? "Yes" : "No");\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['string-operators', 'operator-overloading', 'binary-operators', 'classes']
  },

  // Lesson 19: string-operators (HARD) - Independent
  'string-operators-hard': {
    id: 'string-operators-hard',
    title: 'Managed Text Sequence Buffer with Bounds-Safe Indexing',
    concepts: ['string-operators', 'operator-overloading', 'dynamic-memory', 'classes', 'destructors'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'Implement a self-managing text sequence buffer that stores and manipulates character sequences of arbitrary length without relying on standard library string wrappers.\nEach buffer instance owns its internal storage. The buffer must manage its own resource lifecycle correctly: creating copies of the buffer must produce independent copies without shared pointers, and memory must be released cleanly when an instance is destroyed.\nThe buffer type must integrate naturally with standard operator syntax:\n1. Combining two text buffers with standard addition notation (+) produces a new buffer containing the concatenated sequence.\n2. Accessing characters via index notation ([...]) provides zero-based element access. If an invalid or out-of-bounds index is accessed (< 0 or >= length), the buffer must return \'?\' safely without crashing or reading unallocated memory.\nGiven two words W1 and W2 and an integer query index K, combine the two words (W3 = W1 + W2) and display:\nCombined: <W3>, Length: <len>, Char at <K>: <char>',
    constraints: [
      'Each buffer must manage its own dynamic memory, ensuring independent copies and clean deallocation.',
      'Indexing out of bounds must return \'?\' safely without undefined memory access.'
    ],
    inputFormat: '<W1:string> <W2:string> <K:int>',
    outputFormat: 'Combined: <W3>, Length: <len>, Char at <K>: <char>',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Valid in-bounds index lookup on concatenated string',
        input: 'Open AI 3',
        expectedOutput: 'Combined: OpenAI, Length: 6, Char at 3: n',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Out of bounds high index returns ?',
        input: 'Alpha Beta 10',
        expectedOutput: 'Combined: AlphaBeta, Length: 9, Char at 10: ?',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: First character at index 0',
        input: 'Deep Mind 0',
        expectedOutput: 'Combined: DeepMind, Length: 8, Char at 0: D',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Negative index returns ?',
        input: 'Safe String -1',
        expectedOutput: 'Combined: SafeString, Length: 10, Char at -1: ?',
        isHidden: true
      }
    ],
    expectedBehavior: 'Safely manages dynamic character buffer with overloaded concatenation and subscript operators.',
    hints: [
      'Think about how custom types manage dynamic char arrays. Which special member functions ensure memory isn\'t leaked or double-freed?',
      'Overload operator+ to return a new combined instance and operator[] to inspect characters with bounds checking.',
      'In your subscript operator, verify 0 <= idx && idx < length before indexing the underlying array; return \'?\' otherwise.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass DynamicString {\nprivate:\n  char* data;\n  int len;\npublic:\n  DynamicString() : data(nullptr), len(0) {\n    data = new char[1];\n    data[0] = '\\0';\n  }\n  DynamicString(const char* s) : len(0) {\n    while (s[len] != '\\0') len++;\n    data = new char[len + 1];\n    for (int i = 0; i < len; i++) data[i] = s[i];\n    data[len] = '\\0';\n  }\n  DynamicString(const DynamicString& o) : len(o.len) {\n    data = new char[len + 1];\n    for (int i = 0; i < len; i++) data[i] = o.data[i];\n    data[len] = '\\0';\n  }\n  ~DynamicString() {\n    delete[] data;\n  }\n  int length() const { return len; }\n  char operator[](int idx) const {\n    if (idx < 0 || idx >= len) return '?';\n    return data[idx];\n  }\n  DynamicString operator+(const DynamicString& o) const {\n    DynamicString res;\n    delete[] res.data;\n    res.len = len + o.len;\n    res.data = new char[res.len + 1];\n    for (int i = 0; i < len; i++) res.data[i] = data[i];\n    for (int i = 0; i < o.len; i++) res.data[len + i] = o.data[i];\n    res.data[res.len] = '\\0';\n    return res;\n  }\n  void print() const { cout << data; }\n};\n\nint main() {\n  char w1[64], w2[64];\n  int k;\n  if (cin >> w1 >> w2 >> k) {\n    DynamicString s1(w1), s2(w2);\n    DynamicString s3 = s1 + s2;\n    cout << "Combined: "; s3.print();\n    cout << ", Length: " << s3.length() << ", Char at " << k << ": " << s3[k];\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['string-operators', 'operator-overloading', 'dynamic-memory', 'classes'],
    isIndependent: true
  },

  // ==========================================
  // MODULE 9: RUNTIME POLYMORPHISM & CROSS-MODULE
  // ==========================================

  // Combined: combined-polymorphism-pipeline (Level 4)
  'combined-polymorphism-pipeline': {
    id: 'combined-polymorphism-pipeline',
    title: 'Polymorphic Payment Processing Pipeline',
    concepts: ['runtime-polymorphism', 'abstract-classes', 'pure-virtual-functions', 'base-pointers', 'dynamic-dispatch'],
    difficulty: 'hard',
    level: 4,
    problemStatement: 'Design a polymorphic payment processing pipeline. Create an abstract base class PaymentMethod with a pure virtual method virtual void processPayment(int amount) const = 0 and a virtual destructor virtual ~PaymentMethod() {}. Implement derived classes:\\n1. CreditCard: takes card number (string), computes total with a 2% processing fee (amount + (amount * 2) / 100), and outputs "Paid <total> via Card <cardNum>".\\n2. CryptoWallet: takes wallet address (string), computes total with a flat network fee of 5 (amount + 5), and outputs "Paid <total> via Wallet <walletId>".\\nIn main, read N (1 <= N <= 10) payment transactions (either "C <cardNum> <amount>" or "W <walletId> <amount>"), store them in an array of PaymentMethod* base pointers, execute payments polymorphically, and delete all objects.',
    constraints: [
      'PaymentMethod must be abstract with a pure virtual function.',
      'Must invoke processPayment through PaymentMethod* base pointers.',
      'All allocated objects must be released with delete.'
    ],
    inputFormat: '<N:int> followed by N lines of transaction details.',
    outputFormat: 'N lines of payment confirmations matching specified format.',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\n// TODO: Implement abstract PaymentMethod with virtual destructor\n// TODO: Implement CreditCard and CryptoWallet derived classes\n\nint main() {\n  int n;\n  if (cin >> n && n > 0 && n <= 10) {\n    PaymentMethod* payments[10];\n    // TODO: Read transactions, store in payments array, execute, and cleanup\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Both credit card and crypto wallet transactions',
        input: '2\nC 4111 100\nW 0xABC 50',
        expectedOutput: 'Paid 102 via Card 4111\nPaid 55 via Wallet 0xABC',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Single credit card transaction with 2% fee',
        input: '1\nC 5555 500',
        expectedOutput: 'Paid 510 via Card 5555',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Multiple mixed transactions',
        input: '3\nW 0x1 20\nW 0x2 100\nC 9999 50',
        expectedOutput: 'Paid 25 via Wallet 0x1\nPaid 105 via Wallet 0x2\nPaid 51 via Card 9999',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Zero base amount with flat crypto fee',
        input: '1\nW 0xDEAD 0',
        expectedOutput: 'Paid 5 via Wallet 0xDEAD',
        isHidden: true
      }
    ],
    expectedBehavior: 'Dispatches polymorphic payment calls through base pointers and performs clean dynamic destruction.',
    hints: [
      'Declare class PaymentMethod with virtual void processPayment(int amount) const = 0; and virtual ~PaymentMethod() {}.',
      'Derive CreditCard and CryptoWallet publicly from PaymentMethod, overriding processPayment.',
      'In a loop, call payments[i]->processPayment(amount) and then delete payments[i].'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass PaymentMethod {\npublic:\n  virtual void processPayment(int amount) const = 0;\n  virtual ~PaymentMethod() {}\n};\n\nclass CreditCard : public PaymentMethod {\nprivate:\n  string cardNumber;\npublic:\n  CreditCard(string num) : cardNumber(num) {}\n  void processPayment(int amount) const override {\n    int total = amount + (amount * 2) / 100;\n    cout << "Paid " << total << " via Card " << cardNumber << endl;\n  }\n};\n\nclass CryptoWallet : public PaymentMethod {\nprivate:\n  string walletId;\npublic:\n  CryptoWallet(string w) : walletId(w) {}\n  void processPayment(int amount) const override {\n    int total = amount + 5;\n    cout << "Paid " << total << " via Wallet " << walletId << endl;\n  }\n};\n\nint main() {\n  int n;\n  if (cin >> n && n > 0 && n <= 10) {\n    PaymentMethod* payments[10];\n    int amounts[10];\n    for (int i = 0; i < n; i++) {\n      char type;\n      cin >> type;\n      if (type == 'C') {\n        string num;\n        int amt;\n        cin >> num >> amt;\n        payments[i] = new CreditCard(num);\n        amounts[i] = amt;\n      } else {\n        string w;\n        int amt;\n        cin >> w >> amt;\n        payments[i] = new CryptoWallet(w);\n        amounts[i] = amt;\n      }\n    }\n    for (int i = 0; i < n; i++) {\n      payments[i]->processPayment(amounts[i]);\n      delete payments[i];\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['runtime-polymorphism', 'abstract-classes', 'pure-virtual-functions', 'base-pointers'],
    isMultiConcept: true
  },

  // Combined: combined-operator-hierarchy (Level 5) - Independent
  'combined-operator-hierarchy': {
    id: 'combined-operator-hierarchy',
    title: 'Composite Arithmetic Formula Tree Evaluator',
    concepts: ['runtime-polymorphism', 'operator-overloading', 'abstract-classes', 'base-pointers', 'dynamic-dispatch'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'An arithmetic calculation engine processes structured mathematical formulas constructed from numerical terms and binary operations. Given an operation mode (1 or 2) and three integer operands A, B, and C:\n- Mode 1 evaluates the grouped calculation: (A + B) * C\n- Mode 2 evaluates the grouped calculation: A + (B * C)\nDesign an extensible formula evaluation structure where numerical values and compound operations are evaluated uniformly through a common evaluation contract. The formula nodes must be dynamically assembled according to the specified mode, recursively evaluated to determine the final result, and have all allocated node resources cleanly reclaimed. Print the result in the exact format: "Result: <value>".',
    constraints: [
      'Mode is either 1 or 2.',
      'Operands A, B, C are valid integers.',
      'Formula structure must support hierarchical composition with uniform evaluation behavior.',
      'All dynamically allocated nodes must be freed cleanly without memory leaks.'
    ],
    inputFormat: '<mode:int> <A:int> <B:int> <C:int>',
    outputFormat: 'Result: <value>',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Mode 1: (2 + 3) * 4 = 20',
        input: '1 2 3 4',
        expectedOutput: 'Result: 20',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Mode 2: 2 + (3 * 4) = 14',
        input: '2 2 3 4',
        expectedOutput: 'Result: 14',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Mode 1 with multiplication by zero',
        input: '1 10 5 0',
        expectedOutput: 'Result: 0',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Mode 2 with negative values',
        input: '2 -4 3 -2',
        expectedOutput: 'Result: -10',
        isHidden: true
      }
    ],
    expectedBehavior: 'Evaluates hierarchical formula tree with uniform dynamic evaluation and clean memory reclamation.',
    hints: [
      'Model formula components with a common evaluation interface implemented by atomic values and composite operations.',
      'Binary operation nodes can store sub-expression elements and compute their results recursively.',
      'Ensure composite container nodes delete their sub-expressions upon destruction to prevent leaks.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Expression {\npublic:\n  virtual int evaluate() const = 0;\n  virtual ~Expression() {}\n};\n\nclass Number : public Expression {\nprivate:\n  int val;\npublic:\n  Number(int v) : val(v) {}\n  int evaluate() const override { return val; }\n};\n\nclass AddExpression : public Expression {\nprivate:\n  Expression* left;\n  Expression* right;\npublic:\n  AddExpression(Expression* l, Expression* r) : left(l), right(r) {}\n  ~AddExpression() { delete left; delete right; }\n  int evaluate() const override {\n    return left->evaluate() + right->evaluate();\n  }\n};\n\nclass MultiplyExpression : public Expression {\nprivate:\n  Expression* left;\n  Expression* right;\npublic:\n  MultiplyExpression(Expression* l, Expression* r) : left(l), right(r) {}\n  ~MultiplyExpression() { delete left; delete right; }\n  int evaluate() const override {\n    return left->evaluate() * right->evaluate();\n  }\n};\n\nint main() {\n  int mode, a, b, c;\n  if (cin >> mode >> a >> b >> c) {\n    Expression* root = nullptr;\n    if (mode == 1) {\n      // (A + B) * C\n      root = new MultiplyExpression(new AddExpression(new Number(a), new Number(b)), new Number(c));\n    } else {\n      // A + (B * C)\n      root = new AddExpression(new Number(a), new MultiplyExpression(new Number(b), new Number(c)));\n    }\n    cout << "Result: " << root->evaluate();\n    delete root;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['runtime-polymorphism', 'abstract-classes', 'pure-virtual-functions', 'base-pointers'],
    isIndependent: true,
    isMultiConcept: true
  },

  // ==========================================
  // PHASE E5: INDEPENDENT CAPSTONES & PROBLEMS
  // ==========================================

  // 1. Capstone: Library Lending & Overdue Fines
  'capstone-library-lending': {
    id: 'capstone-library-lending',
    title: 'Media Library Lending & Overdue Fines Engine',
    concepts: ['classes', 'static', 'inheritance', 'virtual-functions', 'base-pointers', 'access-control'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'An automated lending archive manages physical books and digital media items. Each registered item has a title and is assigned a unique sequential serial number starting at 1001. When an item is borrowed and subsequently returned after the allowable loan period, an overdue fee must be evaluated based on the item category:\n- Standard Book (code B): 14-day loan period. Overdue fee is $1 per day for each day beyond 14 days.\n- Media Item (code M): 7-day loan period. Overdue fee is $3 per day for each day beyond 7 days.\nIf an item is returned within or on its allowable loan period, the overdue fee is $0.\n\nGiven an initial count N of items to register, followed by the item category (B or M) and title for each, and then a count of return transactions specifying an item index (0-based) and days borrowed, compute and display:\n1. The catalog record for each item in the format: "[<serial>] <title> (Type: Book/Media)"\n2. For each return query, the fee assessment: "Return <title>: Fee $<fee>"\n3. Total overdue fees collected across all queries: "Total Fees: $<total>"',
    constraints: [
      '1 <= N <= 20 items.',
      'Days borrowed >= 0.',
      'Must assign automated consecutive serials starting at 1001.',
      'Must process diverse media categories uniformly through a common interface.'
    ],
    inputFormat: 'N followed by N items (<type:char> <title:string>). Then Q followed by Q queries (<index:int> <days:int>).',
    outputFormat: 'Item listings, followed by each return result, followed by total fees.',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: Book over 4 days, Media over 3 days -> 4 + 9 = 13',
        input: '2 B Algorithms M Documentary 2 0 18 1 10',
        expectedOutput: '[1001] Algorithms (Type: Book)\n[1002] Documentary (Type: Media)\nReturn Algorithms: Fee $4\nReturn Documentary: Fee $9\nTotal Fees: $13',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible: Book returned on day 10 (on-time) -> $0 fee',
        input: '1 B History 1 0 10',
        expectedOutput: '[1001] History (Type: Book)\nReturn History: Fee $0\nTotal Fees: $0',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: exact boundary return days (14 for book, 7 for media) -> $0',
        input: '2 B C++Primer M SciFi 2 0 14 1 7',
        expectedOutput: '[1001] C++Primer (Type: Book)\n[1002] SciFi (Type: Media)\nReturn C++Primer: Fee $0\nReturn SciFi: Fee $0\nTotal Fees: $0',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: 3 items, multiple returns with mixed fees',
        input: '3 B Physics M AudioBook B Chemistry 3 0 20 1 12 2 15',
        expectedOutput: '[1001] Physics (Type: Book)\n[1002] AudioBook (Type: Media)\n[1003] Chemistry (Type: Book)\nReturn Physics: Fee $6\nReturn AudioBook: Fee $15\nReturn Chemistry: Fee $1\nTotal Fees: $22',
        isHidden: true
      }
    ],
    expectedBehavior: 'Assigns sequential serials from 1001, displays catalog, and computes fees via polymorphic method dispatch.',
    hints: [
      'Think about what data is shared by all items (title, serial) and what behavior varies (type string, fee formula).',
      'Use a private static integer counter initialized to 1001 to assign sequential serial numbers in the base constructor.',
      'Declare a virtual destructor and virtual calculateFee(int days) in the base class, and override it in Book and MediaItem.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass MediaItem {\nprotected:\n  string title;\n  int serial;\n  static int nextSerial;\npublic:\n  MediaItem(string t) : title(t), serial(nextSerial++) {}\n  virtual ~MediaItem() {}\n  string getTitle() const { return title; }\n  int getSerial() const { return serial; }\n  virtual string getType() const = 0;\n  virtual int calculateFee(int days) const = 0;\n  virtual void displayCatalog() const {\n    cout << "[" << serial << "] " << title << " (Type: " << getType() << ")" << endl;\n  }\n};\nint MediaItem::nextSerial = 1001;\n\nclass Book : public MediaItem {\npublic:\n  Book(string t) : MediaItem(t) {}\n  string getType() const override { return "Book"; }\n  int calculateFee(int days) const override {\n    if (days <= 14) return 0;\n    return (days - 14) * 1;\n  }\n};\n\nclass DigitalMedia : public MediaItem {\npublic:\n  DigitalMedia(string t) : MediaItem(t) {}\n  string getType() const override { return "Media"; }\n  int calculateFee(int days) const override {\n    if (days <= 7) return 0;\n    return (days - 7) * 3;\n  }\n};\n\nint main() {\n  int n;\n  if (cin >> n) {\n    MediaItem* items[20];\n    for (int i = 0; i < n; ++i) {\n      char type;\n      string title;\n      cin >> type >> title;\n      if (type == 'B') {\n        items[i] = new Book(title);\n      } else {\n        items[i] = new DigitalMedia(title);\n      }\n      items[i]->displayCatalog();\n    }\n    int q;\n    if (cin >> q) {\n      int totalFees = 0;\n      for (int i = 0; i < q; ++i) {\n        int idx, days;\n        cin >> idx >> days;\n        if (idx >= 0 && idx < n) {\n          int fee = items[idx]->calculateFee(days);\n          totalFees += fee;\n          cout << "Return " << items[idx]->getTitle() << ": Fee $" << fee << endl;\n        }\n      }\n      cout << "Total Fees: $" << totalFees << endl;\n    }\n    for (int i = 0; i < n; ++i) {\n      delete items[i];\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'static', 'inheritance', 'virtual-functions', 'base-pointers'],
    isIndependent: true,
    isMultiConcept: true
  },

  // 2. Capstone: Blueprint CAD Geometry & Mass Evaluator
  'capstone-geometry-pipeline': {
    id: 'capstone-geometry-pipeline',
    title: 'Blueprint CAD Geometry & Mass Evaluator',
    concepts: ['abstract-classes', 'pure-virtual-functions', 'base-pointers', 'virtual-destructors', 'runtime-polymorphism'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'A computer-aided drafting (CAD) pipeline inspects 2D cross-sectional profiles on a mechanical blueprint. The system reads N shape profiles and calculates total surface area and total perimeter across all components, as well as identifying the profile with the maximum individual area.\n\nProfiles supported:\n- Rectangle (code R): width w, height h. Area = w * h. Perimeter = 2 * (w + h).\n- Square (code S): side s. Area = s * s. Perimeter = 4 * s.\n- Right Triangle (code T): base b, height h, hypotenuse hyp. Area = (b * h) / 2. Perimeter = b + h + hyp.\n\nAll dimensions are integers, and all computations use integer arithmetic (integer truncation for triangle area).\nInput format: N followed by N shape records:\n"R <w> <h>", "S <s>", or "T <b> <h> <hyp>".\nOutput:\n"Total Area: <sum_area>"\n"Total Perimeter: <sum_perim>"\n"Max Area: <max_area>"',
    constraints: [
      '1 <= N <= 30 shapes.',
      'Dimensions are positive integers.'
    ],
    inputFormat: 'N followed by N shape records.',
    outputFormat: 'Total Area, Total Perimeter, and Max Area lines.',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: Rectangle 10x5 and Square 4 -> Area 66, Perim 46, Max 50',
        input: '2 R 10 5 S 4',
        expectedOutput: 'Total Area: 66\nTotal Perimeter: 46\nMax Area: 50',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible: 3 shapes: Rect 4x6, Square 5, Triangle 6x8x10',
        input: '3 R 4 6 S 5 T 6 8 10',
        expectedOutput: 'Total Area: 73\nTotal Perimeter: 64\nMax Area: 25',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: single triangle 3 4 5',
        input: '1 T 3 4 5',
        expectedOutput: 'Total Area: 6\nTotal Perimeter: 12\nMax Area: 6',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: mixed shapes with larger triangle 10x20x22',
        input: '3 S 10 R 2 5 T 10 20 22',
        expectedOutput: 'Total Area: 210\nTotal Perimeter: 106\nMax Area: 100',
        isHidden: true
      }
    ],
    expectedBehavior: 'Processes heterogeneous shape objects via pure virtual area() and perimeter() through base pointers.',
    hints: [
      'Design an abstract base class Shape with pure virtual area() and perimeter() methods.',
      'Derive Rectangle, Square, and RightTriangle from Shape, implementing the geometric formulas.',
      'Iterate through an array of Shape* base pointers to accumulate area and perimeter and find maxArea. Don\'t forget virtual ~Shape().'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Shape {\npublic:\n  virtual ~Shape() {}\n  virtual int area() const = 0;\n  virtual int perimeter() const = 0;\n};\n\nclass Rectangle : public Shape {\n  int w, h;\npublic:\n  Rectangle(int width, int height) : w(width), h(height) {}\n  int area() const override { return w * h; }\n  int perimeter() const override { return 2 * (w + h); }\n};\n\nclass Square : public Shape {\n  int s;\npublic:\n  Square(int side) : s(side) {}\n  int area() const override { return s * s; }\n  int perimeter() const override { return 4 * s; }\n};\n\nclass RightTriangle : public Shape {\n  int b, h, hyp;\npublic:\n  RightTriangle(int base, int height, int hypotenuse) : b(base), h(height), hyp(hypotenuse) {}\n  int area() const override { return (b * h) / 2; }\n  int perimeter() const override { return b + h + hyp; }\n};\n\nint main() {\n  int n;\n  if (cin >> n) {\n    Shape* shapes[30];\n    int totalArea = 0;\n    int totalPerim = 0;\n    int maxArea = 0;\n    for (int i = 0; i < n; ++i) {\n      char type;\n      cin >> type;\n      if (type == 'R') {\n        int w, h;\n        cin >> w >> h;\n        shapes[i] = new Rectangle(w, h);\n      } else if (type == 'S') {\n        int s;\n        cin >> s;\n        shapes[i] = new Square(s);\n      } else if (type == 'T') {\n        int b, h, hyp;\n        cin >> b >> h >> hyp;\n        shapes[i] = new RightTriangle(b, h, hyp);\n      }\n      int a = shapes[i]->area();\n      int p = shapes[i]->perimeter();\n      totalArea += a;\n      totalPerim += p;\n      if (a > maxArea) maxArea = a;\n    }\n    cout << "Total Area: " << totalArea << endl;\n    cout << "Total Perimeter: " << totalPerim << endl;\n    cout << "Max Area: " << maxArea << endl;\n    for (int i = 0; i < n; ++i) {\n      delete shapes[i];\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['abstract-classes', 'pure-virtual-functions', 'base-pointers', 'runtime-polymorphism'],
    isIndependent: true,
    isMultiConcept: true
  },

  // 3. Capstone: Building Telemetry & Security Alert Hub
  'capstone-device-network': {
    id: 'capstone-device-network',
    title: 'Building Telemetry & Security Alert Hub',
    concepts: ['classes', 'operator-overloading', 'friend-functions', 'access-control'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'A building automation controller manages two telemetry zones (Zone 1 and Zone 2). Each zone measures reading counts and active alert levels:\n- Reading count: number of sensor telemetry packets recorded.\n- Alert score: cumulative threat score (0 to 100).\n\nThe controller must support:\n1. Combining zones using the natural addition operator (+), which produces a new unified Zone containing the sum of reading counts and the sum of alert scores.\n2. A trusted system auditor non-member function that evaluates security status without exposing private sensor thresholds to the public interface. If alert score >= 50, status is "CRITICAL"; if alert score >= 20, status is "WARNING"; otherwise status is "SECURE".\n\nInput format:\n"<readings1> <alerts1> <readings2> <alerts2>"\nOutput:\n"Zone 1: <readings1> readings, Alert: <status1>"\n"Zone 2: <readings2> readings, Alert: <status2>"\n"Combined: <total_readings> readings, Alert: <combined_status>"',
    constraints: [
      'Readings >= 0, alert scores >= 0.',
      'Status thresholds: >=50 CRITICAL, >=20 WARNING, else SECURE.'
    ],
    inputFormat: 'readings1 alerts1 readings2 alerts2',
    outputFormat: 'Zone 1 line, Zone 2 line, Combined line.',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: Zone 1 (100, 15), Zone 2 (200, 10) -> Combined (300, 25)',
        input: '100 15 200 10',
        expectedOutput: 'Zone 1: 100 readings, Alert: SECURE\nZone 2: 200 readings, Alert: SECURE\nCombined: 300 readings, Alert: WARNING',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible: Zone 1 (50, 30), Zone 2 (75, 25) -> Combined (125, 55)',
        input: '50 30 75 25',
        expectedOutput: 'Zone 1: 50 readings, Alert: WARNING\nZone 2: 75 readings, Alert: WARNING\nCombined: 125 readings, Alert: CRITICAL',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: single critical zone (20, 60)',
        input: '20 60 10 5',
        expectedOutput: 'Zone 1: 20 readings, Alert: CRITICAL\nZone 2: 10 readings, Alert: SECURE\nCombined: 30 readings, Alert: CRITICAL',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: zero readings and alerts',
        input: '0 0 0 0',
        expectedOutput: 'Zone 1: 0 readings, Alert: SECURE\nZone 2: 0 readings, Alert: SECURE\nCombined: 0 readings, Alert: SECURE',
        isHidden: true
      }
    ],
    expectedBehavior: 'Encapsulates telemetry in Zone class, combines via operator+, and audits status with friend function.',
    hints: [
      'Define class Zone with private readings and alertScore data members.',
      'Overload operator+(const Zone& other) const to return a new Zone with summed readings and alert scores.',
      'Declare friend string auditStatus(const Zone& z) inside Zone to access private alertScore and return the matching status string.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Zone {\nprivate:\n  int readings;\n  int alertScore;\npublic:\n  Zone(int r = 0, int a = 0) : readings(r), alertScore(a) {}\n  Zone operator+(const Zone& other) const {\n    return Zone(readings + other.readings, alertScore + other.alertScore);\n  }\n  int getReadings() const { return readings; }\n  friend string auditStatus(const Zone& z);\n};\n\nstring auditStatus(const Zone& z) {\n  if (z.alertScore >= 50) return "CRITICAL";\n  if (z.alertScore >= 20) return "WARNING";\n  return "SECURE";\n}\n\nint main() {\n  int r1, a1, r2, a2;\n  if (cin >> r1 >> a1 >> r2 >> a2) {\n    Zone z1(r1, a1);\n    Zone z2(r2, a2);\n    Zone combined = z1 + z2;\n    cout << "Zone 1: " << z1.getReadings() << " readings, Alert: " << auditStatus(z1) << endl;\n    cout << "Zone 2: " << z2.getReadings() << " readings, Alert: " << auditStatus(z2) << endl;\n    cout << "Combined: " << combined.getReadings() << " readings, Alert: " << auditStatus(combined) << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'operator-overloading', 'friend-functions', 'access-control'],
    isIndependent: true,
    isMultiConcept: true
  },

  // 4. Capstone: Event Seating & Reservation Matrix
  'capstone-booking-scheduler': {
    id: 'capstone-booking-scheduler',
    title: 'Event Seating & Reservation Matrix',
    concepts: ['classes', 'operator-overloading', 'constructors', 'destructors', 'methods'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'An event ticketing engine models group reservations for an auditorium with fixed maximum capacity C.\nEach Reservation tracks:\n- Event label (name string)\n- Number of booked seats (int)\n- Price per seat in dollars (int)\n\nThe engine must support:\n1. Calculating total cost via a member method: seats * pricePerSeat.\n2. Combining two reservation groups for the same event using operator+. If the sum of booked seats exceeds auditorium capacity C, the combined reservation clamps to capacity C. The blended price per seat becomes the average: (price1 + price2) / 2.\n3. Proper object lifecycle without memory corruption.\n\nInput format:\n"<capacity:int> <event:string> <seats1:int> <price1:int> <seats2:int> <price2:int>"\nOutput format:\n"Group 1 Cost: $<cost1>"\n"Group 2 Cost: $<cost2>"\n"Merged Reservation: <event>, <merged_seats> seats @ $<merged_price>/seat, Total: $<merged_total>"',
    constraints: [
      'Capacity C > 0, seats >= 0, price >= 0.',
      'Merged seats clamped at capacity C if (s1 + s2) > C.'
    ],
    inputFormat: 'capacity event seats1 price1 seats2 price2',
    outputFormat: 'Group 1 Cost, Group 2 Cost, Merged Reservation summary.',
    starterCode: `#include <iostream>\n#include <string>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: Gala 40 seats @ 50, 30 seats @ 70, cap 100',
        input: '100 Gala 40 50 30 70',
        expectedOutput: 'Group 1 Cost: $2000\nGroup 2 Cost: $2100\nMerged Reservation: Gala, 70 seats @ $60/seat, Total: $4200',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible: Clamped capacity 50 + 50 = 100 clamped to 80',
        input: '80 Concert 50 40 50 60',
        expectedOutput: 'Group 1 Cost: $2000\nGroup 2 Cost: $3000\nMerged Reservation: Concert, 80 seats @ $50/seat, Total: $4000',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: exact capacity match 25 + 25 = 50 with cap 50',
        input: '50 Theater 25 30 25 30',
        expectedOutput: 'Group 1 Cost: $750\nGroup 2 Cost: $750\nMerged Reservation: Theater, 50 seats @ $30/seat, Total: $1500',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: zero seats in group 1 (0 @ 80 + 40 @ 100)',
        input: '120 Symphony 0 80 40 100',
        expectedOutput: 'Group 1 Cost: $0\nGroup 2 Cost: $4000\nMerged Reservation: Symphony, 40 seats @ $90/seat, Total: $3600',
        isHidden: true
      }
    ],
    expectedBehavior: 'Models reservations with operator+ clamping and total cost valuation.',
    hints: [
      'Define a class Reservation with eventName, seats, pricePerSeat, and maxCapacity.',
      'In operator+, sum seats and clamp to maxCapacity: min(seats + other.seats, maxCapacity).',
      'Compute blended price as (pricePerSeat + other.pricePerSeat) / 2 and construct the return Reservation.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Reservation {\nprivate:\n  string eventName;\n  int seats;\n  int pricePerSeat;\n  int maxCapacity;\npublic:\n  Reservation(string name, int s, int p, int cap = 1000)\n    : eventName(name), seats(s), pricePerSeat(p), maxCapacity(cap) {}\n\n  int getTotalCost() const {\n    return seats * pricePerSeat;\n  }\n\n  int getSeats() const { return seats; }\n  int getPrice() const { return pricePerSeat; }\n  string getEvent() const { return eventName; }\n\n  Reservation operator+(const Reservation& other) const {\n    int combinedSeats = seats + other.seats;\n    if (combinedSeats > maxCapacity) {\n      combinedSeats = maxCapacity;\n    }\n    int blendedPrice = (pricePerSeat + other.pricePerSeat) / 2;\n    return Reservation(eventName, combinedSeats, blendedPrice, maxCapacity);\n  }\n};\n\nint main() {\n  int cap;\n  string event;\n  int s1, p1, s2, p2;\n  if (cin >> cap >> event >> s1 >> p1 >> s2 >> p2) {\n    Reservation g1(event, s1, p1, cap);\n    Reservation g2(event, s2, p2, cap);\n    Reservation merged = g1 + g2;\n\n    cout << "Group 1 Cost: $" << g1.getTotalCost() << endl;\n    cout << "Group 2 Cost: $" << g2.getTotalCost() << endl;\n    cout << "Merged Reservation: " << merged.getEvent() << ", " << merged.getSeats()\n         << " seats @ $" << merged.getPrice() << "/seat, Total: $" << merged.getTotalCost() << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes', 'operator-overloading', 'constructors', 'methods'],
    isIndependent: true,
    isMultiConcept: true
  },

  // 5. Independent Foundational: Environmental Telemetry Cleaner
  'independent-sensor-pipeline': {
    id: 'independent-sensor-pipeline',
    title: 'Environmental Telemetry Cleaner & Partitioning Engine',
    concepts: ['functions', 'references', 'cin', 'arrays', 'arithmetic'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'An environmental station records N integer temperature sensor samples (-50 to 50 degrees Celsius). However, sensor transmission faults occasionally inject corrupted sentinel readings (-999).\n\nYour program must process the raw stream, partition readings into valid and corrupted sets, and compute metrics without hardcoding helper logic:\n- Valid readings are within [-50, 50].\n- Any reading equal to -999 or outside [-50, 50] is classified as corrupted.\n- Implement a partitioning function that receives an input array and updates count, minimum, maximum, and average of valid readings through reference parameters.\n\nInput format:\n"N followed by N space-separated integer readings."\nOutput:\n"Valid: <valid_count>, Corrupt: <corrupt_count>"\n"Min: <min>, Max: <max>, Avg: <int_avg>"\n(If valid count is 0, print "No valid readings" on the second line).',
    constraints: [
      '1 <= N <= 50.',
      'Valid range is [-50, 50]. Corrupt sentinels are -999 or any values outside [-50, 50].'
    ],
    inputFormat: 'N followed by N space-separated integers.',
    outputFormat: 'Valid and Corrupt counts on line 1, Min Max Avg on line 2 (or No valid readings).',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: 5 readings with one -999 sentinel',
        input: '5 20 25 -999 30 15',
        expectedOutput: 'Valid: 4, Corrupt: 1\nMin: 15, Max: 30, Avg: 22',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible: All corrupted sentinels',
        input: '4 -999 -999 -999 -999',
        expectedOutput: 'Valid: 0, Corrupt: 4\nNo valid readings',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: all valid negative temperatures',
        input: '4 -10 -20 -5 -15',
        expectedOutput: 'Valid: 4, Corrupt: 0\nMin: -20, Max: -5, Avg: -12',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: exact range bounds -50 and 50 with out of range 100 -100',
        input: '6 50 -50 100 -100 -999 0',
        expectedOutput: 'Valid: 3, Corrupt: 3\nMin: -50, Max: 50, Avg: 0',
        isHidden: true
      }
    ],
    expectedBehavior: 'Partitions sensor readings via reference parameters and calculates min, max, and integer average.',
    hints: [
      'Write a function that accepts the array and size, plus int& validCount, int& corruptCount, int& minVal, int& maxVal, int& avgVal.',
      'Loop through the array. Check if val != -999 && val >= -50 && val <= 50. If valid, increment validCount, accumulate sum, update min and max.',
      'Compute average only if validCount > 0 to avoid division by zero.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nvoid partitionTelemetry(const int readings[], int n, int& validCount, int& corruptCount, int& minVal, int& maxVal, int& avgVal) {\n  validCount = 0;\n  corruptCount = 0;\n  long long sum = 0;\n  minVal = 1000;\n  maxVal = -1000;\n\n  for (int i = 0; i < n; ++i) {\n    int v = readings[i];\n    if (v != -999 && v >= -50 && v <= 50) {\n      validCount++;\n      sum += v;\n      if (v < minVal) minVal = v;\n      if (v > maxVal) maxVal = v;\n    } else {\n      corruptCount++;\n    }\n  }\n  if (validCount > 0) {\n    avgVal = sum / validCount;\n  }\n}\n\nint main() {\n  int n;\n  if (cin >> n) {\n    int readings[50];\n    for (int i = 0; i < n; ++i) {\n      cin >> readings[i];\n    }\n    int validCount = 0, corruptCount = 0, minVal = 0, maxVal = 0, avgVal = 0;\n    partitionTelemetry(readings, n, validCount, corruptCount, minVal, maxVal, avgVal);\n\n    cout << "Valid: " << validCount << ", Corrupt: " << corruptCount << endl;\n    if (validCount > 0) {\n      cout << "Min: " << minVal << ", Max: " << maxVal << ", Avg: " << avgVal << endl;\n    } else {\n      cout << "No valid readings" << endl;\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['functions', 'references', 'arrays', 'cin'],
    isIndependent: true,
    isMultiConcept: true
  },

  // 6. Debugging Transfer: Fix Object Slicing
  'debug-polymorphic-slicing': {
    id: 'debug-polymorphic-slicing',
    title: 'Fix Object Slicing & Missing Virtual Dispatch',
    concepts: ['runtime-polymorphism', 'base-pointers', 'virtual-destructors', 'virtual-functions'],
    difficulty: 'easy',
    level: 1,
    problemStatement: 'The starter program manages user accounts in a rewards system. It defines a base class Account and a derived class PremiumAccount that gives a 10% bonus on earned points.\nHowever, the program stores accounts by value in an array "Account list[2]" and passes accounts by value "void printPoints(Account acc)". This causes Object Slicing: derived PremiumAccount objects are sliced down to base Account instances, silently destroying the bonus calculation and printing incorrect point values! Furthermore, the base class is missing a virtual destructor.\n\nFix the program by:\n1. Making calculatePoints() virtual in Account and overriding it in PremiumAccount.\n2. Declaring a virtual destructor "virtual ~Account() {}".\n3. Storing and passing accounts via base pointers/references so that runtime polymorphic dispatch works correctly.',
    constraints: [
      'Must resolve object slicing and preserve derived bonus calculations.',
      'Must include a virtual destructor in the base class.'
    ],
    inputFormat: 'p1 p2 (integers representing base points for Account and PremiumAccount).',
    outputFormat: 'Points for both accounts printed on separate lines.',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// BUG: Missing virtual keyword and missing virtual destructor\nclass Account {\nprotected:\n  int basePoints;\npublic:\n  Account(int bp) : basePoints(bp) {}\n  // BUG: Not virtual!\n  int calculatePoints() const {\n    return basePoints;\n  }\n};\n\nclass PremiumAccount : public Account {\npublic:\n  PremiumAccount(int bp) : Account(bp) {}\n  // BUG: Will not be called when sliced!\n  int calculatePoints() const {\n    return basePoints + (basePoints / 10);\n  }\n};\n\n// BUG: Passes by value, causing object slicing!\nvoid printPoints(Account acc) {\n  cout << "Points: " << acc.calculatePoints() << endl;\n}\n\nint main() {\n  int p1, p2;\n  if (cin >> p1 >> p2) {\n    // BUG: Array of values slices PremiumAccount!\n    Account list[2] = { Account(p1), PremiumAccount(p2) };\n    printPoints(list[0]);\n    printPoints(list[1]);\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: Account 100 -> 100, Premium 200 -> 220',
        input: '100 200',
        expectedOutput: 'Points: 100\nPoints: 220',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible: Account 50 -> 50, Premium 500 -> 550',
        input: '50 500',
        expectedOutput: 'Points: 50\nPoints: 550',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Account 0 -> 0, Premium 1000 -> 1100',
        input: '0 1000',
        expectedOutput: 'Points: 0\nPoints: 1100',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Account 350, Premium 40 -> 44',
        input: '350 40',
        expectedOutput: 'Points: 350\nPoints: 44',
        isHidden: true
      }
    ],
    expectedBehavior: 'Fixes object slicing by using base pointers and virtual method dispatch with virtual destructor.',
    hints: [
      'Look at Account::calculatePoints(). Why does a derived call through an Account type invoke the base version unless marked virtual?',
      'Look at Account list[2] and printPoints(Account acc). Storing objects by value copies only the base slice of any derived class.',
      'Change list to Account* list[2] allocating new Account and new PremiumAccount, pass const Account* or const Account& to printPoints, and add virtual ~Account() {}.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Account {\nprotected:\n  int basePoints;\npublic:\n  Account(int bp) : basePoints(bp) {}\n  virtual ~Account() {}\n  virtual int calculatePoints() const {\n    return basePoints;\n  }\n};\n\nclass PremiumAccount : public Account {\npublic:\n  PremiumAccount(int bp) : Account(bp) {}\n  int calculatePoints() const override {\n    return basePoints + (basePoints / 10);\n  }\n};\n\nvoid printPoints(const Account* acc) {\n  cout << "Points: " << acc->calculatePoints() << endl;\n}\n\nint main() {\n  int p1, p2;\n  if (cin >> p1 >> p2) {\n    Account* list[2];\n    list[0] = new Account(p1);\n    list[1] = new PremiumAccount(p2);\n    printPoints(list[0]);\n    printPoints(list[1]);\n    delete list[0];\n    delete list[1];\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['runtime-polymorphism', 'base-pointers', 'virtual-destructors']
  },

  // 7. Debugging Transfer: Fix Shallow Copy Double-Free
  'debug-resource-leak': {
    id: 'debug-resource-leak',
    title: 'Fix Shallow Copy Double-Free & Dangling Pointer',
    concepts: ['constructors', 'copy-constructor', 'destructors', 'dynamic-memory', 'object-lifecycle'],
    difficulty: 'easy',
    level: 1,
    problemStatement: 'The starter program defines a DataBuffer class that manages an array of integers on the heap. However, the class does not define a custom copy constructor (violating the Rule of Three).\nWhen a DataBuffer is passed by value to the inspectBuffer(DataBuffer b) helper function, C++ performs a default shallow copy: copying the raw heap pointer data. When inspectBuffer returns, parameter b is destroyed and its destructor calls "delete[] data". The caller\'s original DataBuffer object now holds a dangling pointer. When the original object goes out of scope at the end of main(), "delete[] data" is executed a second time on the same address, triggering an immediate double-free crash!\n\nFix the program by:\n1. Implementing a deep copy constructor DataBuffer(const DataBuffer& other) that allocates a separate heap array and copies elements.\n2. Ensuring the destructor safely frees allocated memory.',
    constraints: [
      'Must implement deep copy constructor to prevent shared pointer aliasing.',
      'Must maintain clean destructor cleanup without memory leaks or double frees.'
    ],
    inputFormat: 'n val (buffer size n and initial element val).',
    outputFormat: 'inspectBuffer output line followed by Original preserved output line.',
    starterCode: `#include <iostream>\nusing namespace std;\n\nclass DataBuffer {\nprivate:\n  int* data;\n  int size;\npublic:\n  DataBuffer(int s) : size(s) {\n    data = new int[size];\n    for (int i = 0; i < size; ++i) data[i] = 0;\n  }\n  ~DataBuffer() {\n    delete[] data;\n  }\n  // BUG: Missing copy constructor!\n  // Default shallow copy copies pointer 'data', leading to double-free on destruction!\n\n  void set(int idx, int val) {\n    if (idx >= 0 && idx < size) data[idx] = val;\n  }\n  int get(int idx) const {\n    return (idx >= 0 && idx < size) ? data[idx] : 0;\n  }\n  int getSize() const { return size; }\n};\n\n// Passed by value: creates a copy!\nvoid inspectBuffer(DataBuffer b) {\n  cout << "Buffer size: " << b.getSize() << ", first element: " << b.get(0) << endl;\n  // b's destructor runs here, deleting data pointer!\n}\n\nint main() {\n  int n, val;\n  if (cin >> n >> val) {\n    DataBuffer buf(n);\n    buf.set(0, val);\n    inspectBuffer(buf); // Shallow copy deleted memory here!\n    cout << "Original preserved: " << buf.get(0) << endl; // Uses dangling pointer!\n    // Double free crash happens here on exit!\n  }\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Sample visible: Buffer size 5, first element 42',
        input: '5 42',
        expectedOutput: 'Buffer size: 5, first element: 42\nOriginal preserved: 42',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Sample visible: Buffer size 3, first element 99',
        input: '3 99',
        expectedOutput: 'Buffer size: 3, first element: 99\nOriginal preserved: 99',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden test: Buffer size 10, first element 7',
        input: '10 7',
        expectedOutput: 'Buffer size: 10, first element: 7\nOriginal preserved: 7',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden test: Buffer size 1, first element 0',
        input: '1 0',
        expectedOutput: 'Buffer size: 1, first element: 0\nOriginal preserved: 0',
        isHidden: true
      }
    ],
    expectedBehavior: 'Implements deep copy constructor to allocate distinct heap buffer, eliminating double-free.',
    hints: [
      'Why does passing an object by value call the copy constructor?',
      'If a class manages raw heap pointers, the compiler-generated copy constructor copies only the pointer address (shallow copy).',
      'Implement DataBuffer(const DataBuffer& other) : size(other.size) { data = new int[size]; for (int i = 0; i < size; ++i) data[i] = other.data[i]; }.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass DataBuffer {\nprivate:\n  int* data;\n  int size;\npublic:\n  DataBuffer(int s) : size(s) {\n    data = new int[size];\n    for (int i = 0; i < size; ++i) data[i] = 0;\n  }\n  DataBuffer(const DataBuffer& other) : size(other.size) {\n    data = new int[size];\n    for (int i = 0; i < size; ++i) {\n      data[i] = other.data[i];\n    }\n  }\n  ~DataBuffer() {\n    delete[] data;\n  }\n\n  void set(int idx, int val) {\n    if (idx >= 0 && idx < size) data[idx] = val;\n  }\n  int get(int idx) const {\n    return (idx >= 0 && idx < size) ? data[idx] : 0;\n  }\n  int getSize() const { return size; }\n};\n\nvoid inspectBuffer(DataBuffer b) {\n  cout << "Buffer size: " << b.getSize() << ", first element: " << b.get(0) << endl;\n}\n\nint main() {\n  int n, val;\n  if (cin >> n >> val) {\n    DataBuffer buf(n);\n    buf.set(0, val);\n    inspectBuffer(buf);\n    cout << "Original preserved: " << buf.get(0) << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['constructors', 'copy-constructor', 'destructors', 'dynamic-memory']
  }
};

/**
 * Resolves an exercise by its ID.
 */
export function getExerciseById(exerciseId) {
  if (exerciseCatalog[exerciseId]) {
    return exerciseCatalog[exerciseId];
  }
  return null;
}

/**
 * Creates a default structured exercise for lessons with legacy string prompts.
 */
export function createDefaultExercise(lesson, level = 'mini') {
  const prompt = level === 'mini' ? lesson.mini : level === 'medium' ? lesson.medium : lesson.hard;
  const id = `${lesson.id}-${level}`;

  if (exerciseCatalog[id]) {
    return exerciseCatalog[id];
  }

  return {
    id,
    title: `${lesson.title} (${level.toUpperCase()})`,
    concepts: [lesson.module.toLowerCase().replace(/\s+/g, '-')],
    difficulty: level === 'mini' ? 'easy' : level === 'medium' ? 'medium' : 'hard',
    level: level === 'mini' ? 2 : level === 'medium' ? 3 : 4,
    problemStatement: prompt,
    constraints: ['Must compile cleanly under C++17 with no warnings or errors.'],
    inputFormat: 'Standard input as required by the problem.',
    outputFormat: 'Standard output matching required behavior.',
    starterCode: lesson.example || starterTemplate,
    testCases: [
      {
        id: 'test-1',
        description: 'Execution sanity test',
        input: '',
        expectedOutput: '',
        isHidden: false
      }
    ],
    expectedBehavior: 'Executes cleanly with exit code 0.',
    hints: [
      'What is the goal of this exercise?',
      'Break the task into two steps: input and processing.',
      'Check the lesson explanation and example for syntax guidance.'
    ],
    solution: lesson.example || starterTemplate
  };
}

const starterTemplate = `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, C++!";\n  return 0;\n}`;
