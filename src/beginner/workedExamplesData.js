/**
 * Comprehensive Concept-Specific Worked Examples Catalog for CodeBloom.
 * Maps every lesson in the 20-lesson syllabus to rich pedagogical worked example metadata:
 * - concept: Core programming mechanism
 * - problemStatement: Clear problem description
 * - input: Sample input (stdin) or 'None'
 * - expectedOutput: Exact stdout from execution
 * - reasoningSteps: Structured "Problem -> Reasoning -> Code" thought process
 * - lineExplanations: Key statements breakdown (replaces generic greeting boilerplate)
 * - fadingGuidance: Explicit bridge to the subsequent Faded Practice stage
 */

export const LESSON_WORKED_EXAMPLES = {
  'cpp-basics': {
    lessonId: 'cpp-basics',
    concept: 'Console Output & Program Entry Point',
    problemStatement: 'Write a C++ program that prints a welcome message and an encouraging study prompt across two separate lines.',
    input: 'None (Direct Console Output)',
    expectedOutput: 'Welcome to C++!\nReady to learn step by step.',
    reasoningSteps: [
      '1. Identify Goal: Display two distinct lines of text to the console screen.',
      '2. Plan Structure: Include <iostream> for stream tools and use int main() as the required C++ entry point.',
      '3. Write Output: Use std::cout with the insertion operator << and endl to create new lines.',
      '4. Return Status: Return 0 from main() to inform the OS that execution finished without errors.'
    ],
    lineExplanations: [
      { line: '#include <iostream>', explanation: 'Includes the standard input/output stream library needed for cout and cin.' },
      { line: 'using namespace std;', explanation: 'Brings standard names into global scope so we can write cout instead of std::cout.' },
      { line: 'int main() {', explanation: 'The mandatory starting point where the computer begins executing C++ instructions.' },
      { line: 'cout << "Welcome to C++!" << endl;', explanation: 'Sends the text string to the terminal screen, then moves the cursor to a new line.' },
      { line: 'return 0;', explanation: 'Exits main() with status code 0, signaling successful completion.' }
    ],
    fadingGuidance: 'In Faded Practice, you will modify the greeting string and complete the cout statement.'
  },

  'keywords': {
    lessonId: 'keywords',
    concept: 'Variables, Fundamental Data Types & Labels',
    problemStatement: 'Store an age (integer), exam score (decimal), and letter grade (character) in appropriate variables and display each with descriptive labels.',
    input: 'None',
    expectedOutput: 'Age: 20\nScore: 95.5\nGrade: A',
    reasoningSteps: [
      '1. Identify Types: Whole numbers need int, decimal fractions need double, and single letters need char.',
      '2. Initialize: Declare each variable with its type, name, and value (e.g. int age = 20;).',
      '3. Format Output: Chain << operators to combine text labels with variable values.',
      '4. Verify Precision: Check that characters use single quotes (\'A\') and strings use double quotes ("Age: ").'
    ],
    lineExplanations: [
      { line: 'int age = 20;', explanation: 'Reserves an integer memory box named age and stores 20 inside.' },
      { line: 'double score = 95.5;', explanation: 'Reserves a floating-point memory box for numbers with decimal fractions.' },
      { line: 'char grade = \'A\';', explanation: 'Stores a single character in memory enclosed in single quotation marks.' },
      { line: 'cout << "Age: " << age << endl;', explanation: 'Combines the label "Age: " and variable age into a single console line.' }
    ],
    fadingGuidance: 'In Faded Practice, you will declare the required variable and output its value.'
  },

  'conditionals': {
    lessonId: 'conditionals',
    concept: 'Decision Making with if, else if, else & Booleans',
    problemStatement: 'Evaluate an exam score against multiple letter grade thresholds (>=90, >=80, >=70) and compute whether the student earned passing status.',
    input: 'None (score = 85)',
    expectedOutput: 'Grade: B - Great job!\nPassing status: PASS',
    reasoningSteps: [
      '1. Identify Conditions: We have multiple exclusive thresholds that must be checked in descending order.',
      '2. Cascade Checks: Use if for the top tier (>= 90), then else if for next tiers (>= 80, >= 70), ending with else.',
      '3. Boolean Flag: Evaluate (score >= 70) and assign the boolean result (true/false) to bool isPassing.',
      '4. Conditional Expression: Use a ternary expression or branch to print "PASS" or "FAIL".'
    ],
    lineExplanations: [
      { line: 'if (score >= 90) {', explanation: 'Evaluates the highest threshold first; if true, executes its block and skips later checks.' },
      { line: 'else if (score >= 80) {', explanation: 'Evaluated only if earlier conditions were false; runs when score is between 80 and 89.' },
      { line: 'else {', explanation: 'The default catch-all branch that executes if none of the above conditions were met.' },
      { line: 'bool isPassing = (score >= 70);', explanation: 'Stores true or false directly from the comparison operator >=.' }
    ],
    fadingGuidance: 'In Faded Practice, you will write the if-else condition checking a threshold.'
  },

  'loops': {
    lessonId: 'loops',
    concept: 'Repetition via while and for Loops',
    problemStatement: 'Print a countdown from 3 down to 1 followed by "Liftoff!" using a while loop, then compute the arithmetic sum from 1 to 5 using a for loop.',
    input: 'None',
    expectedOutput: 'Countdown:\n3...\n2...\n1...\nLiftoff!\nSum 1 to 5: 15',
    reasoningSteps: [
      '1. Choose Loop Construct: while is great when looping until a condition changes; for is ideal for counting across a fixed range.',
      '2. Countdown Logic: Start at 3, check count > 0, print current number, and decrement count-- on each iteration.',
      '3. Accumulator Pattern: Initialize int sum = 0 before the loop, iterate i from 1 to 5, and accumulate sum += i.',
      '4. Avoid Infinite Loops: Always ensure the loop variable is modified toward the termination condition.'
    ],
    lineExplanations: [
      { line: 'while (count > 0) {', explanation: 'Tests condition before each iteration; repeats as long as count is greater than 0.' },
      { line: 'count--;', explanation: 'Decrements count by 1 each step, ensuring the loop eventually terminates.' },
      { line: 'for (int i = 1; i <= 5; i++)', explanation: 'Compact header combining initialization (i=1), condition (i<=5), and step (i++).' },
      { line: 'sum += i;', explanation: 'Adds the current value of i to the running total sum.' }
    ],
    fadingGuidance: 'In Faded Practice, you will complete the loop header and accumulator statement.'
  },

  'functions': {
    lessonId: 'functions',
    concept: 'Modular Functions, Parameters & Return Values',
    problemStatement: 'Create modular functions to add two integers and to square an integer, call both from main, and display their return values.',
    input: 'None',
    expectedOutput: '5 + 7 = 12\n4 squared = 16',
    reasoningSteps: [
      '1. Decompose Tasks: Separate addition and squaring into dedicated single-responsibility functions.',
      '2. Define Signatures: int add(int a, int b) and int square(int n) both declare input types and return type.',
      '3. Return Computations: Use return to send the calculated arithmetic result back to the caller.',
      '4. Invoke in main: Call the functions with concrete arguments and store or print their return values.'
    ],
    lineExplanations: [
      { line: 'int add(int a, int b) {', explanation: 'Declares a function named add taking two int parameters and returning an int.' },
      { line: 'return a + b;', explanation: 'Computes a + b and immediately returns the result to the calling site.' },
      { line: 'int sum = add(5, 7);', explanation: 'Calls add with arguments 5 and 7, storing the returned 12 in sum.' }
    ],
    fadingGuidance: 'In Faded Practice, you will write the return expression inside a function body.'
  },

  'classes': {
    lessonId: 'classes',
    concept: 'Classes, Objects, Attributes & Member Methods',
    problemStatement: 'Define a Student class with name and roll number attributes and an introduce() method, then create an instance and call its method.',
    input: 'None',
    expectedOutput: 'Student: Aria (Roll #101)',
    reasoningSteps: [
      '1. Create Blueprint: A class bundles related data members (name, rollNo) and member functions (introduce).',
      '2. Access Control: Use public: so the main program can set fields and invoke methods.',
      '3. Instantiate: Create an object Student s1; which allocates memory for one student.',
      '4. Member Access: Use the dot operator (s1.name, s1.introduce()) to interact with the object.'
    ],
    lineExplanations: [
      { line: 'class Student {', explanation: 'Defines a custom blueprint data type named Student.' },
      { line: 'public:', explanation: 'Specifies that all following members can be accessed directly from outside the class.' },
      { line: 'void introduce() {', explanation: 'A member function that has direct access to the object\'s own name and rollNo.' },
      { line: 'Student s1;', explanation: 'Creates an individual object instance s1 based on the Student blueprint.' },
      { line: 's1.introduce();', explanation: 'Invokes the introduce member function on the s1 object.' }
    ],
    fadingGuidance: 'In Faded Practice, you will add member attributes and invoke an object method.'
  },

  'constructors': {
    lessonId: 'constructors',
    concept: 'Default and Parameterized Constructors with Initializer Lists',
    problemStatement: 'Create a Book class with both default and parameterized constructors to guarantee that every book object is initialized in a valid state.',
    input: 'None',
    expectedOutput: '\'Untitled\' has 0 pages.\n\'Clean Code\' has 464 pages.',
    reasoningSteps: [
      '1. Understand Lifecycle: Constructors run automatically at the moment an object is instantiated.',
      '2. Default Constructor: Book() : title("Untitled"), pages(0) {} handles unconfigured objects.',
      '3. Parameterized Constructor: Book(string t, int p) allows callers to specify custom starting values.',
      '4. Member Initializer List: Using the : syntax directly initializes members before the constructor body executes.'
    ],
    lineExplanations: [
      { line: 'Book() : title("Untitled"), pages(0) {}', explanation: 'Default constructor initializing members to safe placeholder values.' },
      { line: 'Book(string t, int p) : title(t), pages(p) {}', explanation: 'Parameterized constructor initializing members with caller arguments.' },
      { line: 'Book b1;', explanation: 'Instantiates b1 using the default constructor.' },
      { line: 'Book b2("Clean Code", 464);', explanation: 'Instantiates b2 with title and page count using the parameterized constructor.' }
    ],
    fadingGuidance: 'In Faded Practice, you will write a parameterized constructor initializing member fields.'
  },

  'access': {
    lessonId: 'access',
    concept: 'Encapsulation, Private State & Public Validation Methods',
    problemStatement: 'Protect a bank account\'s balance from direct outside modification by making it private and providing safe getter and setter methods.',
    input: 'None',
    expectedOutput: 'Account Balance: $250',
    reasoningSteps: [
      '1. Encapsulation: Hide internal state behind private: to prevent accidental corruption or invalid data.',
      '2. Setter Validation: setBalance(int amount) inspects if (amount >= 0) before modifying balance.',
      '3. Getter Accessor: getBalance() returns the balance safely without granting write access.',
      '4. Interface Integrity: External code interacts solely through the well-defined public interface.'
    ],
    lineExplanations: [
      { line: 'private: int balance;', explanation: 'Hides balance so only member functions of BankAccount can access it.' },
      { line: 'void setBalance(int amount) {', explanation: 'Public setter method with data validation to prevent negative balances.' },
      { line: 'int getBalance() {', explanation: 'Public getter method providing read-only access to balance.' },
      { line: 'account.setBalance(250);', explanation: 'Safely sets the balance via the public method.' }
    ],
    fadingGuidance: 'In Faded Practice, you will declare private members and implement public getter/setter methods.'
  },

  'member-functions': {
    lessonId: 'member-functions',
    concept: 'Scope Resolution Operator (::) for Outside Class Definitions',
    problemStatement: 'Declare a Rectangle class inside its definition, then define its constructor and area() method outside using the scope resolution operator.',
    input: 'None',
    expectedOutput: 'Rectangle area: 40',
    reasoningSteps: [
      '1. Clean Headers: Keeping definitions outside the class makes class declarations concise and easy to read.',
      '2. Scope Resolution: Use ClassName::FunctionName to inform the compiler which class a function belongs to.',
      '3. Parameter Binding: The outside definition accesses member variables (width, height) seamlessly.',
      '4. Test Execution: Instantiate Rectangle rect(5, 8) and verify that rect.area() returns 40.'
    ],
    lineExplanations: [
      { line: 'int area();', explanation: 'Declares the function prototype inside the class definition.' },
      { line: 'Rectangle::Rectangle(int w, int h) : width(w), height(h) {}', explanation: 'Defines the constructor outside using the scope resolution operator Rectangle::.' },
      { line: 'int Rectangle::area() {', explanation: 'Defines the area member function outside the class body.' }
    ],
    fadingGuidance: 'In Faded Practice, you will use :: to define a member function outside its class.'
  },

  'object-flow': {
    lessonId: 'object-flow',
    concept: 'Arrays of Objects & Passing Objects by Const Reference',
    problemStatement: 'Store store items in an array of objects, and pass each item to an inspector function by const reference to eliminate copy overhead.',
    input: 'None',
    expectedOutput: 'Notebook: $5\nPen: $2',
    reasoningSteps: [
      '1. Performance Optimization: Passing objects by value makes full copies; passing by reference (&) avoids copying.',
      '2. Const Correctness: Adding const guarantees that the inspection function cannot accidentally mutate the object.',
      '3. Array Storage: Item catalog[2] holds two Item structures consecutively in memory.',
      '4. Traversal: Use a for loop to iterate over array indices and pass each element to printItem.'
    ],
    lineExplanations: [
      { line: 'void printItem(const Item& item)', explanation: 'Passes item by const reference: avoids copying memory and guarantees read-only safety.' },
      { line: 'Item catalog[2] = { {"Notebook", 5}, {"Pen", 2} };', explanation: 'Initializes an array containing two Item objects.' },
      { line: 'printItem(catalog[i]);', explanation: 'Passes the i-th catalog item to printItem by reference.' }
    ],
    fadingGuidance: 'In Faded Practice, you will write a function signature accepting an object by const reference.'
  },

  'static': {
    lessonId: 'static',
    concept: 'Static Data Members and Static Class Methods',
    problemStatement: 'Keep track of the total number of Counter instances created throughout the program using a shared static variable and static accessor method.',
    input: 'None',
    expectedOutput: 'Total objects created: 3',
    reasoningSteps: [
      '1. Shared Class State: Regular members exist once per object instance; static members exist once for the entire class.',
      '2. Separate Definition: Static variables must be defined and allocated outside the class in global scope.',
      '3. Lifecycle Tracking: The Counter() constructor increments count++ whenever an object is instantiated.',
      '4. Class-Level Call: Static methods can be invoked on the class directly (Counter::getCount()) without an object.'
    ],
    lineExplanations: [
      { line: 'static int count;', explanation: 'Declares a single shared counter variable for all instances of Counter.' },
      { line: 'int Counter::count = 0;', explanation: 'Allocates and initializes the static variable in global scope.' },
      { line: 'static int getCount() { return count; }', explanation: 'Static member function that can be called without an instantiated object.' },
      { line: 'cout << Counter::getCount()', explanation: 'Calls the static function using the class name and scope resolution operator.' }
    ],
    fadingGuidance: 'In Faded Practice, you will declare and initialize a static data member.'
  },

  'friends': {
    lessonId: 'friends',
    concept: 'Friend Functions & Controlled Private Access',
    problemStatement: 'Grant an external standalone function printWidth permission to read the private width member of a Box object using the friend keyword.',
    input: 'None',
    expectedOutput: 'Box width: 15',
    reasoningSteps: [
      '1. Encapsulation Exception: Friend declarations allow specific trusted functions to access private data without making it public.',
      '2. Friendship Syntax: Place friend void printWidth(const Box& b); inside the Box class declaration.',
      '3. Standalone Function: printWidth is not a member function; it does not take a this pointer or use Box::.',
      '4. Direct Access: Inside printWidth, accessing b.width is permitted because friendship was explicitly granted.'
    ],
    lineExplanations: [
      { line: 'friend void printWidth(const Box& b);', explanation: 'Grants non-member printWidth access to private members of Box.' },
      { line: 'void printWidth(const Box& b) {', explanation: 'Defines the standalone function without any class scope prefix.' },
      { line: 'cout << "Box width: " << b.width', explanation: 'Directly reads the private width member thanks to friend status.' }
    ],
    fadingGuidance: 'In Faded Practice, you will declare a friend function to inspect private fields.'
  },

  'inheritance': {
    lessonId: 'inheritance',
    concept: 'Class Inheritance & Behavior Extension',
    problemStatement: 'Create a base Animal class with an eat() method, and derive a Dog class that inherits eat() and adds its own bark() method.',
    input: 'None',
    expectedOutput: 'Animal is eating.\nDog barks: Woof!',
    reasoningSteps: [
      '1. Model "Is-A": Inheritance models an "is-a" relationship where a derived class is a specialized version of a base class.',
      '2. Public Inheritance: class Dog : public Animal inherits all public members of Animal as public in Dog.',
      '3. Reusability: Dog inherits eat() automatically without rewriting or duplicating any code.',
      '4. Specialization: Dog adds bark(), which is specific to dogs and not present in generic animals.'
    ],
    lineExplanations: [
      { line: 'class Animal {', explanation: 'Defines the base class representing general animal characteristics.' },
      { line: 'class Dog : public Animal {', explanation: 'Derived class Dog inherits publicly from Animal.' },
      { line: 'd.eat();', explanation: 'Calls the inherited eat() method originally defined in Animal.' },
      { line: 'd.bark();', explanation: 'Calls the specialized bark() method defined in Dog.' }
    ],
    fadingGuidance: 'In Faded Practice, you will write a derived class inheriting from a base class.'
  },

  'runtime': {
    lessonId: 'runtime',
    concept: 'Runtime Polymorphism, Virtual Functions & Base Pointers',
    problemStatement: 'Point a Base pointer to a heap-allocated Derived object and call speak() to verify that virtual dispatch invokes the derived implementation at runtime.',
    input: 'None',
    expectedOutput: 'Derived speaking!',
    reasoningSteps: [
      '1. Dynamic Dispatch: Without virtual, calling speak() through Base* would invoke Base::speak() at compile time.',
      '2. Virtual Function: Declaring virtual void speak() instructs the compiler to use a virtual table (vtable) for runtime lookup.',
      '3. Override Annotation: Use override in the derived class to catch signature mismatches at compile time.',
      '4. Virtual Destructor: Always define virtual ~Base() {} in polymorphic base classes to avoid undefined behavior on deletion.'
    ],
    lineExplanations: [
      { line: 'virtual void speak() {', explanation: 'Enables dynamic dispatch so derived versions are called through base pointers.' },
      { line: 'virtual ~Base() {}', explanation: 'Virtual destructor ensures derived destructors run when deleting via a Base*.' },
      { line: 'void speak() override {', explanation: 'Explicitly overrides the base virtual method; compiler validates the signature.' },
      { line: 'Base* ptr = new Derived();', explanation: 'Base class pointer holding the address of a newly created Derived heap object.' },
      { line: 'ptr->speak();', explanation: 'Resolves to Derived::speak() at runtime via vtable dispatch.' }
    ],
    fadingGuidance: 'In Faded Practice, you will add the virtual keyword and override a method.'
  },

  'abstract': {
    lessonId: 'abstract',
    concept: 'Pure Virtual Functions (= 0) and Abstract Base Interfaces',
    problemStatement: 'Define an abstract Shape class containing a pure virtual draw() function, and implement it in a concrete Circle derived class.',
    input: 'None',
    expectedOutput: 'Drawing a Circle.',
    reasoningSteps: [
      '1. Interface Design: An abstract class serves as an interface contract that derived classes must fulfill.',
      '2. Pure Virtual Syntax: Adding = 0 to a virtual function declaration marks it pure virtual and makes the class abstract.',
      '3. Prevent Direct Instantiation: The compiler forbids instantiating an abstract class directly (e.g. Shape s; is illegal).',
      '4. Concrete Implementation: Derived Circle implements draw() override, making Circle concrete and instantiable.'
    ],
    lineExplanations: [
      { line: 'virtual void draw() = 0;', explanation: 'Pure virtual function; makes Shape an abstract class that cannot be instantiated directly.' },
      { line: 'class Circle : public Shape {', explanation: 'Circle inherits from abstract base Shape and must implement draw() to be concrete.' },
      { line: 'void draw() override {', explanation: 'Provides the concrete implementation of draw for circles.' },
      { line: 'Circle c;', explanation: 'Instantiates concrete Circle object successfully.' }
    ],
    fadingGuidance: 'In Faded Practice, you will implement a pure virtual function in a derived class.'
  },

  'derived-constructors': {
    lessonId: 'derived-constructors',
    concept: 'Derived Class Constructor Chaining & Member Initializers',
    problemStatement: 'Initialize a Person base class with a name, and pass constructor arguments from derived Student to base Person using constructor chaining.',
    input: 'None',
    expectedOutput: 'Person initialized: Maya\nStudent roll number: 42',
    reasoningSteps: [
      '1. Construction Order: When a derived object is created, the base class constructor always runs first.',
      '2. Explicit Invocation: If the base constructor requires arguments, the derived constructor must chain it explicitly.',
      '3. Syntax: Student(...) : Person(n), rollNo(r) passes n to Person(n) before initializing rollNo.',
      '4. Protected Access: Protected members in Person can be accessed directly by derived classes like Student.'
    ],
    lineExplanations: [
      { line: 'Person(string n) : name(n)', explanation: 'Base class constructor requiring a name string argument.' },
      { line: 'Student(string n, int r) : Person(n), rollNo(r)', explanation: 'Chains argument n to base constructor Person(n), then initializes rollNo.' },
      { line: 'Student s("Maya", 42);', explanation: 'Constructs Student, running Person constructor first, then Student constructor.' }
    ],
    fadingGuidance: 'In Faded Practice, you will write a derived constructor that chains arguments to its base class.'
  },

  'overloading': {
    lessonId: 'overloading',
    concept: 'Function Overloading & Static Type Matching',
    problemStatement: 'Implement overloaded versions of an add function for integers and doubles, and demonstrate that the compiler calls the correct version.',
    input: 'None',
    expectedOutput: 'Integer add: 7\nDouble add: 6',
    reasoningSteps: [
      '1. Uniform Naming: Overloading lets you use the same intuitive function name for similar operations on different types.',
      '2. Signature Differentiation: The compiler differentiates overloads based on parameter types and counts.',
      '3. Compile-Time Resolution: add(3, 4) matches (int, int); add(2.5, 3.5) matches (double, double).',
      '4. Avoid Ambiguity: Ensure each parameter list is distinct so the compiler does not encounter ambiguous call errors.'
    ],
    lineExplanations: [
      { line: 'int add(int a, int b)', explanation: 'Overload 1: accepts two integers and returns their integer sum.' },
      { line: 'double add(double a, double b)', explanation: 'Overload 2: accepts two doubles and returns their floating-point sum.' },
      { line: 'add(3, 4)', explanation: 'Compiler statically resolves this call to the integer overload.' },
      { line: 'add(2.5, 3.5)', explanation: 'Compiler statically resolves this call to the double overload.' }
    ],
    fadingGuidance: 'In Faded Practice, you will write an overloaded function with different parameter types.'
  },

  'operators': {
    lessonId: 'operators',
    concept: 'Operator Overloading for User-Defined Types (operator+)',
    problemStatement: 'Overload the binary + operator for a 2D Point class so points can be added together using standard arithmetic notation (p1 + p2).',
    input: 'None',
    expectedOutput: 'Result Point: (6, 8)',
    reasoningSteps: [
      '1. Natural Syntax: Operator overloading allows custom objects to work with standard C++ operators like +, -, ==.',
      '2. Signature: Point operator+(const Point& other) const returns a new Point without mutating either operand.',
      '3. Component Arithmetic: Add corresponding coordinates: x + other.x and y + other.y.',
      '4. Translation: The expression p1 + p2 is converted by the compiler into p1.operator+(p2).'
    ],
    lineExplanations: [
      { line: 'Point operator+(const Point& other) const {', explanation: 'Declares member operator+; const ensures neither operand is modified.' },
      { line: 'return Point(x + other.x, y + other.y);', explanation: 'Constructs and returns a new Point with the summed coordinates.' },
      { line: 'Point p3 = p1 + p2;', explanation: 'Uses intuitive addition syntax enabled by the overloaded operator+.' }
    ],
    fadingGuidance: 'In Faded Practice, you will implement an overloaded operator function for a class.'
  },

  'memory': {
    lessonId: 'memory',
    concept: 'Dynamic Heap Memory Allocation & Deallocation (new / delete)',
    problemStatement: 'Allocate an integer on the heap using new, dereference it to print its value, and safely deallocate it using delete to avoid memory leaks.',
    input: 'None',
    expectedOutput: 'Heap value: 42\nMemory freed successfully.',
    reasoningSteps: [
      '1. Dynamic Lifetime: Heap memory persists until explicitly deleted, allowing dynamic sizing and controlled lifecycles.',
      '2. Allocation: int* ptr = new int(42); requests 4 bytes from the heap and stores the address in ptr.',
      '3. Dereferencing: Use *ptr to access or modify the integer stored at the heap memory address.',
      '4. Deallocation: Always call delete ptr; and set ptr = nullptr; to release heap memory and clear dangling pointers.'
    ],
    lineExplanations: [
      { line: 'int* ptr = new int(42);', explanation: 'Allocates memory on the heap for an integer initialized to 42 and assigns its address to ptr.' },
      { line: 'cout << *ptr', explanation: 'Dereferences ptr using * to read the value stored in heap memory.' },
      { line: 'delete ptr;', explanation: 'Releases the allocated heap memory back to the operating system.' },
      { line: 'ptr = nullptr;', explanation: 'Resets the pointer to nullptr to prevent dangerous dangling pointer access.' }
    ],
    fadingGuidance: 'In Faded Practice, you will allocate heap memory with new and free it with delete.'
  },

  'destructors': {
    lessonId: 'destructors',
    concept: 'Destructors (~ClassName) and RAII Automatic Cleanup',
    problemStatement: 'Implement a Buffer class that allocates heap memory in its constructor and safely frees that memory in its destructor when going out of scope.',
    input: 'None',
    expectedOutput: 'Resource acquired: 99\nResource released safely.\nScope exited.',
    reasoningSteps: [
      '1. RAII Pattern: Resource Acquisition Is Initialization binds resource management to object lifetime.',
      '2. Destructor Definition: ~Buffer() has no return type and takes no arguments; it executes automatically when the object is destroyed.',
      '3. Automatic Invocation: When the inner scope { Buffer b(99); } ends, b\'s destructor runs automatically without manual intervention.',
      '4. Leak Prevention: Guarantees that dynamically allocated memory is cleaned up even if code exits early.'
    ],
    lineExplanations: [
      { line: 'Buffer(int val) { data = new int(val); }', explanation: 'Constructor acquires dynamic heap memory when the object is created.' },
      { line: '~Buffer() { delete data; }', explanation: 'Destructor automatically frees the heap memory when the object goes out of scope.' },
      { line: '{ Buffer b(99); }', explanation: 'Enclosing braces create a local scope; b is destroyed at the closing brace.' }
    ],
    fadingGuidance: 'In Faded Practice, you will write a destructor to release allocated resources.'
  }
};
