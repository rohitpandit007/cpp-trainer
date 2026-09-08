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
      }
    ],
    expectedBehavior: 'Prints "Hello, Alex!"',
    hints: [
      'What part of the program sends text to the screen?',
      'Look at the text inside the double quotes after cout <<.',
      'Replace "Hello, C++!" with "Hello, Alex!" inside the cout statement.'
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
      }
    ],
    expectedBehavior: 'Prints two lines with Name and City.',
    hints: [
      'How does C++ separate text onto multiple lines?',
      'You can use either endl or the \\n escape character to begin a new line.',
      'Write: cout << "Name: Taylor" << endl << "City: Seattle" << endl;'
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
      'Inside square, write: return n * n; and in main call cout << square(n);'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nint square(int n) {\n  return n * n;\n}\n\nint main() {\n  int n;\n  if (cin >> n) {\n    cout << square(n) << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['functions']
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
      'Use class Student { public: string name; int rollNo; }; (don’t forget the semicolon after the class brace).',
      'Create an instance Student s; and read with cin >> s.name >> s.rollNo;'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\npublic:\n  string name;\n  int rollNo;\n};\n\nint main() {\n  Student s;\n  if (cin >> s.name >> s.rollNo) {\n    cout << "Student: " << s.name << ", Roll: " << s.rollNo << endl;\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['classes']
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
      'Overload: Complex operator+(const Complex& other) const { return Complex(real + other.real, imag + other.imag); }'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Complex {\npublic:\n  int real, imag;\n  Complex(int r = 0, int i = 0) : real(r), imag(i) {}\n  Complex operator+(const Complex& o) const {\n    return Complex(real + o.real, imag + o.imag);\n  }\n};\n\nint main() {\n  int r1, i1, r2, i2;\n  if (cin >> r1 >> i1 >> r2 >> i2) {\n    Complex c1(r1, i1), c2(r2, i2);\n    Complex c3 = c1 + c2;\n    if (c3.imag >= 0) {\n      cout << c3.real << "+" << c3.imag << "i" << endl;\n    } else {\n      cout << c3.real << c3.imag << "i" << endl;\n    }\n  }\n  return 0;\n}`,
    prerequisiteConcepts: ['operator-overloading', 'classes']
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
