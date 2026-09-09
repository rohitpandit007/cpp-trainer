const starter = `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, C++!";\n  return 0;\n}`;

export const modules = [
  { name: 'Start Writing C++', color: 'mint', range: '1–4' },
  { name: 'Classes & Objects', color: 'blue', range: '5–10' },
  { name: 'Object Lifetime', color: 'purple', range: '11–12' },
  { name: 'Inheritance', color: 'orange', range: '13–15' },
  { name: 'Polymorphism', color: 'pink', range: '16–20' }
];

const rows = [
 ['cpp-basics','Your first C++ program','Make a program print a message.','cout sends text to the screen. cin reads input from the keyboard.','Change the greeting to your name.','Print your city on the next line.','Write a program that asks for a name and greets it.'],
 ['keywords','Variables, types & keywords','Store a number and show it.','A variable is a named box for a value. Pick int for whole numbers, float for decimals, and char for one letter.','Create int age = 18; and print it.','Read two numbers and print their sum.','Read marks for three subjects and print the total.'],
 ['memory','Dynamic memory: new and delete','Create one number on the heap.','new creates storage while the program runs. delete gives it back when you are done.','Create an int pointer with new and store 7.','Make a dynamic array of 3 scores.','Build a dynamic list of N numbers and find the maximum.'],
 ['functions','Functions that do one job','Write a function that returns a sum.','A function packages a task. Parameters bring values in; return sends a value back.','Write int square(int n).','Pass a number by reference and double it.','Create functions for menu-based calculator operations.'],
 ['classes','Structures, classes & objects','Model a student.','A class is a blueprint. An object is one real thing made from that blueprint.','Create a Student with name and rollNo.','Add a display member function.','Write a class to store and display student information.'],
 ['access','Access, data & member functions','Keep class data safe.','private data is used inside the class. public member functions are the safe door to it.','Make private age and a public show().','Add setAge with validation.','Build a BankAccount class with deposit rules.'],
 ['member-functions','Inside and outside class functions','Move a function definition outside.','You may write a member function in the class, or define it later using ClassName::.','Define show() outside a Book class.','Make a Rectangle class with area().','Build an order billing system with separate member definitions.'],
 ['object-flow','Arrays and passing objects','Work with many objects.','Objects can go in arrays, be passed to functions, and be returned like other values.','Create an array of 2 Student objects.','Pass a Student to printStudent.','Find the topper from an array of student objects.'],
 ['static','Static members','Share one value between objects.','A static data member belongs to the class, not one object. A static function can use static data directly.','Count created objects.','Add a static getCount().','Create an Employee ID generator.'],
 ['friends','Friend functions & classes','Give a trusted function access.','A friend is not a member, but the class explicitly allows it to see private data.','Use a friend to print a Box width.','Compare two private values with a friend.','Evaluate waypoint proximity metrics with privileged access.'],
 ['constructors','Constructors','Initialize objects automatically.','A constructor runs when an object is created. It gives every object a good starting state.','Add a default constructor.','Add a parameterized constructor.','Manage isolated dynamic data buffers with independent copies.'],
 ['destructors','Destructors','Clean up safely.','A destructor runs when an object is destroyed. It is where dynamically allocated memory must be released.','Add ~Box() that prints a message.','Delete a dynamic char array.','Make a safe dynamic String class.'],
 ['inheritance','Inheritance','Reuse a base class.','A derived class starts with the features of a base class, then adds its own.','Make Employee and Manager.','Show public and protected inheritance.','Implement inheritance for different types of employees.'],
 ['abstract','Virtual bases & abstract classes','Define a shared contract.','An abstract class has a pure virtual function. Virtual base classes avoid duplicate base copies in diamond inheritance.','Make abstract Shape with area().','Create Circle and Rectangle.','Unify automated terminal subsystems without duplicate identity.'],
 ['derived-constructors','Derived constructors','Build base first, then derived.','A derived constructor calls its base constructor before setting its own members.','Call a Person constructor from Student.','Initialize several base values.','Evaluate student athlete qualification across layered profile tiers.'],
 ['overloading','Function & operator overloading','Use one name naturally.','Overloading lets one name work with different parameter types or object operations.','Overload add for ints and floats.','Add Complex objects with operator+.','Overload math operations for a Fraction class.'],
 ['operators','Unary, binary & friend operators','Make objects behave like values.','Unary operators use one value; binary operators use two. Friend operators are useful when the left value is not your class.','Overload unary - for Temperature.','Overload + for Complex.','Combine and compare 2D bounding regions using natural notation.'],
 ['streams','Overload << and >>','Read and print objects naturally.','Overload << to display an object and >> to fill it with input. These are usually friend functions.','Print a Point with cout.','Read a Point with cin.','Create a Student class with stream input/output.'],
 ['string-operators','String manipulation operators','Join custom strings.','Operator overloading can make a custom string class join, compare, and display text.','Overload + for two small strings.','Overload == to compare them.','Build a self-managing text buffer with bounds-safe indexing.'],
 ['runtime','Runtime polymorphism','Call the right behavior at runtime.','A base pointer can point to a derived object. virtual functions choose the derived behavior at runtime.','Make virtual display() in Animal.','Use an Animal pointer for Dog and Cat.','Evaluate composite arithmetic expression trees dynamically.']
];

import { exerciseCatalog, createDefaultExercise } from './exerciseData.js';

const moduleForLesson = index => index < 4 ? modules[0] : index < 10 ? modules[1] : index < 12 ? modules[2] : index < 15 ? modules[3] : modules[4];

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
    example: index === 0 ? starter : starter.replace('Hello, C++!', `Lesson ${index + 1}: ${row[1]}`)
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
