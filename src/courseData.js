const starter = `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, C++!";\n  return 0;\n}`;

export const modules = [
  { name: 'Start Writing C++', color: 'mint', range: '1–5' },
  { name: 'Classes & Objects', color: 'blue', range: '6–10' },
  { name: 'Advanced Class Features', color: 'purple', range: '11–12' },
  { name: 'Inheritance & Polymorphism', color: 'orange', range: '13–16' },
  { name: 'Operators & Object Lifetime', color: 'pink', range: '17–20' }
];

const rows = [
 ['cpp-basics','Your first C++ program','Make a program print a message.','cout sends text to the screen. cin reads input from the keyboard.','Change the greeting to your name.','Print your city on the next line.','Write a program that asks for a name and greets it.'],
 ['keywords','Variables, types & keywords','Store a number and show it.','A variable is a named box for a value. Pick int for whole numbers, float for decimals, and char for one letter.','Create int age = 18; and print it.','Read two numbers and print their sum.','Read marks for three subjects and print the total.'],
 ['conditionals','Decisions with if and else','Make a program make decisions.','A condition evaluates to true or false. if executes a block when true; else runs when false.','Check if a number is positive or negative.','Classify a test score into letter grades.','Validate user login credentials and security flags.'],
 ['loops','Repeating actions with loops','Repeat a task until finished.','A while loop runs as long as its condition holds true. A for loop counts iterations with a start, step, and stop.','Print numbers from 1 to 5 with a while loop.','Calculate the sum of numbers from 1 to N with for.','Find the smallest and largest values in an input sequence.'],
 ['functions','Functions that do one job','Write a function that returns a sum.','A function packages a task. Parameters bring values in; return sends a value back.','Write int square(int n).','Pass a number by reference and double it.','Create functions for menu-based calculator operations.'],
 ['classes','Structures, classes & objects','Model a student.','A class is a blueprint. An object is one real thing made from that blueprint.','Create a Student with name and rollNo.','Add a display member function.','Write a class to store and display student information.'],
 ['constructors','Constructors','Initialize objects automatically.','A constructor runs when an object is created. It gives every object a good starting state.','Add a default constructor.','Add a parameterized constructor.','Manage isolated dynamic data buffers with independent copies.'],
 ['access','Access, data & member functions','Keep class data safe.','private data is used inside the class. public member functions are the safe door to it.','Make private age and a public show().','Add setAge with validation.','Build a BankAccount class with deposit rules.'],
 ['member-functions','Inside and outside class functions','Move a function definition outside.','You may write a member function in the class, or define it later using ClassName::.','Define show() outside a Book class.','Make a Rectangle class with area().','Build an order billing system with separate member definitions.'],
 ['object-flow','Arrays and passing objects','Work with many objects.','Objects can go in arrays, be passed to functions, and be returned like other values.','Create an array of 2 Student objects.','Pass a Student to printStudent.','Find the topper from an array of student objects.'],
 ['static','Static members','Share one value between objects.','A static data member belongs to the class, not one object. A static function can use static data directly.','Count created objects.','Add a static getCount().','Create an Employee ID generator.'],
 ['friends','Friend functions & classes','Give a trusted function access.','A friend is not a member, but the class explicitly allows it to see private data.','Use a friend to print a Box width.','Compare two private values with a friend.','Evaluate waypoint proximity metrics with privileged access.'],
 ['inheritance','Inheritance','Reuse a base class.','A derived class starts with the features of a base class, then adds its own.','Make Employee and Manager.','Show public and protected inheritance.','Implement inheritance for different types of employees.'],
 ['runtime','Runtime polymorphism','Call the right behavior at runtime.','A base pointer can point to a derived object. virtual functions choose the derived behavior at runtime.','Make virtual display() in Animal.','Use an Animal pointer for Dog and Cat.','Evaluate composite arithmetic expression trees dynamically.'],
 ['abstract','Virtual bases & abstract classes','Define a shared contract.','An abstract class has a pure virtual function. Virtual base classes avoid duplicate base copies in diamond inheritance.','Make abstract Shape with area().','Create Circle and Rectangle.','Unify automated terminal subsystems without duplicate identity.'],
 ['derived-constructors','Derived constructors','Build base first, then derived.','A derived constructor calls its base constructor before setting its own members.','Call a Person constructor from Student.','Initialize several base values.','Evaluate student athlete qualification across layered profile tiers.'],
 ['overloading','Function & operator overloading','Use one name naturally.','Overloading lets one name work with different parameter types or object operations.','Overload add for ints and floats.','Add Complex objects with operator+.','Overload math operations for a Fraction class.'],
 ['operators','Unary, binary & friend operators','Make objects behave like values.','Unary operators use one value; binary operators use two. Friend operators are useful when the left value is not your class.','Overload unary - for Temperature.','Overload + for Complex.','Combine and compare 2D bounding regions using natural notation.'],
 ['memory','Dynamic memory: new and delete','Create one number on the heap.','new creates storage while the program runs. delete gives it back when you are done.','Create an int pointer with new and store 7.','Make a dynamic array of 3 scores.','Build a dynamic list of N numbers and find the maximum.'],
 ['destructors','Destructors','Clean up safely.','A destructor runs when an object is destroyed. It is where dynamically allocated memory must be released.','Add ~Box() that prints a message.','Delete a dynamic char array.','Make a safe dynamic String class.']
];

export const LESSON_WORKED_EXAMPLES = {
  'cpp-basics': `#include <iostream>
using namespace std;

// A C++ program begins execution at the main() function.
// cout sends text to the screen.
// endl finishes the line and moves to the next line.
int main() {
  cout << "Welcome to C++!" << endl;
  cout << "Ready to learn step by step." << endl;
  return 0;
}`,

  'keywords': `#include <iostream>
using namespace std;

// Variables store data in named memory boxes.
// Each box has a type: int for whole numbers, double for decimals, char for letters.
int main() {
  int age = 20;
  double score = 95.5;
  char grade = 'A';

  cout << "Age: " << age << endl;
  cout << "Score: " << score << endl;
  cout << "Grade: " << grade << endl;
  return 0;
}`,

  'conditionals': `#include <iostream>
using namespace std;

// Conditionals (if, else if, else) let programs make decisions based on Boolean logic.
// A condition evaluates to true or false.
int main() {
  int score = 85;

  if (score >= 90) {
    cout << "Grade: A - Excellent!" << endl;
  } else if (score >= 80) {
    cout << "Grade: B - Great job!" << endl;
  } else if (score >= 70) {
    cout << "Grade: C - Good effort!" << endl;
  } else {
    cout << "Grade: Keep practicing!" << endl;
  }

  bool isPassing = (score >= 70);
  cout << "Passing status: " << (isPassing ? "PASS" : "FAIL") << endl;
  return 0;
}`,

  'loops': `#include <iostream>
using namespace std;

// Loops repeat a block of code as long as a condition is true.
// 'while' is ideal when looping until a condition changes.
// 'for' is ideal for counting through a fixed range of iterations.
int main() {
  // 1. while loop: count down
  cout << "Countdown:" << endl;
  int count = 3;
  while (count > 0) {
    cout << count << "..." << endl;
    count--;
  }
  cout << "Liftoff!" << endl;

  // 2. for loop: calculate sum of numbers 1 to 5
  int sum = 0;
  for (int i = 1; i <= 5; i++) {
    sum += i;
  }
  cout << "Sum 1 to 5: " << sum << endl;
  return 0;
}`,

  'functions': `#include <iostream>
using namespace std;

// A function packages reusable code.
// Parameters receive inputs; return gives back the result.
int add(int a, int b) {
  return a + b;
}

int square(int n) {
  return n * n;
}

int main() {
  int sum = add(5, 7);
  int sq = square(4);

  cout << "5 + 7 = " << sum << endl;
  cout << "4 squared = " << sq << endl;
  return 0;
}`,

  'memory': `#include <iostream>
using namespace std;

// 'new' allocates memory on the heap at runtime.
// 'delete' releases that heap memory back to the system.
int main() {
  // Allocate a single integer on the heap
  int* ptr = new int(42);
  cout << "Heap value: " << *ptr << endl;

  // Free allocated memory and clear the pointer
  delete ptr;
  ptr = nullptr;
  cout << "Memory freed successfully." << endl;
  return 0;
}`,

  'classes': `#include <iostream>
#include <string>
using namespace std;

// A class is a blueprint for creating objects.
// It groups data members and member functions together.
class Student {
public:
  string name;
  int rollNo;

  void introduce() {
    cout << "Student: " << name << " (Roll #" << rollNo << ")" << endl;
  }
};

int main() {
  Student s1;
  s1.name = "Aria";
  s1.rollNo = 101;
  s1.introduce();
  return 0;
}`,

  'access': `#include <iostream>
#include <string>
using namespace std;

// Access specifiers protect data integrity.
// 'private' hides data; 'public' methods provide safe access.
class BankAccount {
private:
  int balance;

public:
  void setBalance(int amount) {
    if (amount >= 0) {
      balance = amount;
    }
  }

  int getBalance() {
    return balance;
  }
};

int main() {
  BankAccount account;
  account.setBalance(250);
  cout << "Account Balance: $" << account.getBalance() << endl;
  return 0;
}`,

  'member-functions': `#include <iostream>
using namespace std;

// Member functions can be declared inside the class
// and defined outside using the scope resolution operator (::).
class Rectangle {
private:
  int width;
  int height;

public:
  Rectangle(int w, int h);
  int area();
};

Rectangle::Rectangle(int w, int h) : width(w), height(h) {}

int Rectangle::area() {
  return width * height;
}

int main() {
  Rectangle rect(5, 8);
  cout << "Rectangle area: " << rect.area() << endl;
  return 0;
}`,

  'object-flow': `#include <iostream>
#include <string>
using namespace std;

// Objects can be passed to functions and stored in arrays.
class Item {
public:
  string name;
  int price;
};

void printItem(const Item& item) {
  cout << item.name << ": $" << item.price << endl;
}

int main() {
  Item catalog[2] = {
    {"Notebook", 5},
    {"Pen", 2}
  };

  for (int i = 0; i < 2; i++) {
    printItem(catalog[i]);
  }
  return 0;
}`,

  'static': `#include <iostream>
using namespace std;

// A static data member is shared by all instances of the class.
// A static member function can be called without an object.
class Counter {
private:
  static int count;

public:
  Counter() {
    count++;
  }

  static int getCount() {
    return count;
  }
};

int Counter::count = 0;

int main() {
  Counter c1;
  Counter c2;
  Counter c3;
  cout << "Total objects created: " << Counter::getCount() << endl;
  return 0;
}`,

  'friends': `#include <iostream>
using namespace std;

// A friend function is granted access to private members of a class.
class Box {
private:
  int width;

public:
  Box(int w) : width(w) {}

  friend void printWidth(const Box& b);
};

void printWidth(const Box& b) {
  cout << "Box width: " << b.width << endl;
}

int main() {
  Box b(15);
  printWidth(b);
  return 0;
}`,

  'constructors': `#include <iostream>
#include <string>
using namespace std;

// Constructors initialize objects upon creation.
// You can have default and parameterized constructors.
class Book {
public:
  string title;
  int pages;

  Book() : title("Untitled"), pages(0) {}
  Book(string t, int p) : title(t), pages(p) {}

  void display() {
    cout << "'" << title << "' has " << pages << " pages." << endl;
  }
};

int main() {
  Book b1;
  Book b2("Clean Code", 464);
  b1.display();
  b2.display();
  return 0;
}`,

  'destructors': `#include <iostream>
using namespace std;

// A destructor (~ClassName) automatically executes when an object goes out of scope.
// It cleans up resources, such as dynamically allocated heap memory.
class Buffer {
private:
  int* data;

public:
  Buffer(int val) {
    data = new int(val);
    cout << "Resource acquired: " << *data << endl;
  }

  ~Buffer() {
    delete data;
    cout << "Resource released safely." << endl;
  }
};

int main() {
  {
    Buffer b(99);
  }
  cout << "Scope exited." << endl;
  return 0;
}`,

  'inheritance': `#include <iostream>
#include <string>
using namespace std;

// Inheritance lets a derived class inherit fields & methods from a base class.
class Animal {
public:
  void eat() {
    cout << "Animal is eating." << endl;
  }
};

class Dog : public Animal {
public:
  void bark() {
    cout << "Dog barks: Woof!" << endl;
  }
};

int main() {
  Dog d;
  d.eat();
  d.bark();
  return 0;
}`,

  'abstract': `#include <iostream>
using namespace std;

// An abstract class contains at least one pure virtual function (= 0).
// It defines an interface that derived classes must implement.
class Shape {
public:
  virtual void draw() = 0;
  virtual ~Shape() {}
};

class Circle : public Shape {
public:
  void draw() override {
    cout << "Drawing a Circle." << endl;
  }
};

int main() {
  Circle c;
  c.draw();
  return 0;
}`,

  'derived-constructors': `#include <iostream>
#include <string>
using namespace std;

// Derived class constructors call the base class constructor first.
class Person {
protected:
  string name;

public:
  Person(string n) : name(n) {
    cout << "Person initialized: " << name << endl;
  }
};

class Student : public Person {
private:
  int rollNo;

public:
  Student(string n, int r) : Person(n), rollNo(r) {
    cout << "Student roll number: " << rollNo << endl;
  }
};

int main() {
  Student s("Maya", 42);
  return 0;
}`,

  'overloading': `#include <iostream>
using namespace std;

// Function overloading allows multiple functions with the same name
// but different parameter types or counts.
int add(int a, int b) {
  return a + b;
}

double add(double a, double b) {
  return a + b;
}

int main() {
  cout << "Integer add: " << add(3, 4) << endl;
  cout << "Double add: " << add(2.5, 3.5) << endl;
  return 0;
}`,

  'operators': `#include <iostream>
using namespace std;

// Operator overloading lets user-defined types use standard operators like +.
class Point {
public:
  int x, y;

  Point(int x = 0, int y = 0) : x(x), y(y) {}

  Point operator+(const Point& other) const {
    return Point(x + other.x, y + other.y);
  }
};

int main() {
  Point p1(2, 3);
  Point p2(4, 5);
  Point p3 = p1 + p2;

  cout << "Result Point: (" << p3.x << ", " << p3.y << ")" << endl;
  return 0;
}`,

  'runtime': `#include <iostream>
using namespace std;

// Runtime polymorphism uses base class pointers/references with 'virtual'
// to call the derived implementation at runtime.
class Base {
public:
  virtual void speak() {
    cout << "Base speaking." << endl;
  }
  virtual ~Base() {}
};

class Derived : public Base {
public:
  void speak() override {
    cout << "Derived speaking!" << endl;
  }
};

int main() {
  Base* ptr = new Derived();
  ptr->speak();

  delete ptr;
  return 0;
}`
};

import { exerciseCatalog, createDefaultExercise } from './exerciseData.js';

const moduleForLesson = index => index < 5 ? modules[0] : index < 10 ? modules[1] : index < 12 ? modules[2] : index < 16 ? modules[3] : modules[4];

export const lessons = rows.map((row, index) => {
  const lessonObj = {
    id: row[0],
    title: row[1],
    mission: row[2],
    explanation: row[3],
    mini: row[4],
    medium: row[5],
    hard: row[6],
    module: moduleForLesson(index).name,
    example: LESSON_WORKED_EXAMPLES[row[0]] || (index === 0 ? starter : starter.replace('Hello, C++!', `Lesson ${index + 1}: ${row[1]}`))
  };
  lessonObj.exercises = {
    mini: exerciseCatalog[`${lessonObj.id}-mini`] || createDefaultExercise(lessonObj, 'mini'),
    medium: exerciseCatalog[`${lessonObj.id}-medium`] || createDefaultExercise(lessonObj, 'medium'),
    hard: exerciseCatalog[`${lessonObj.id}-hard`] || createDefaultExercise(lessonObj, 'hard')
  };
  return lessonObj;
});

export const masteryExercises = [
  exerciseCatalog['mastery-student-manager'],
  exerciseCatalog['mastery-bank-hierarchy'],
  exerciseCatalog['mastery-complex-calculator'],
  exerciseCatalog['capstone-library-lending'],
  exerciseCatalog['capstone-geometry-pipeline'],
  exerciseCatalog['capstone-device-network'],
  exerciseCatalog['capstone-booking-scheduler'],
  exerciseCatalog['combined-operator-hierarchy'],
  exerciseCatalog['combined-polymorphism-pipeline'],
  exerciseCatalog['independent-sensor-pipeline']
].filter(Boolean);

export const mastery = [
  'Build an inventory management system with automatic valuation and transaction handling.',
  'Design an isolated text buffer that maintains independent dynamic copies and safe indexing.',
  'Create a workforce payroll processor that handles diverse compensation models through a unified interface.',
  'Implement a 2D bounding box model supporting natural geometric addition and equivalence testing.',
  'Build an expression evaluation engine that evaluates nested arithmetic formulas through a common evaluation contract.'
];
