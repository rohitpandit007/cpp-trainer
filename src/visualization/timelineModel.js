/**
 * Timeline Model Generator for CodeBloom C++ Trainer (Phase D3).
 * Synthesizes structured educational step-by-step simulations from concept analysis.
 * Generates visual states for memory boxes, call stack frames, pointer arrows,
 * object blueprints, inheritance hierarchies, and virtual function dispatch.
 */

import { CONCEPT_FAMILIES } from './conceptAnalyzer.js';

export class TimelineModel {
  /**
   * Builds an educational simulation timeline for the analyzed C++ program.
   * @param {Object} analysisResult Analysis result from conceptAnalyzer
   * @returns {Object} Structured visualization timeline
   */
  static generateTimeline(analysisResult) {
    if (!analysisResult || !analysisResult.supported) {
      return this.generateFallbackTimeline(analysisResult?.reason);
    }

    const concept = analysisResult.primaryConcept;
    const meta = analysisResult.metadata || {};

    let timeline;
    switch (concept) {
      case CONCEPT_FAMILIES.VARIABLES:
        timeline = this.buildVariablesTimeline(meta);
        break;
      case CONCEPT_FAMILIES.SCOPE:
        timeline = this.buildScopeTimeline(meta);
        break;
      case CONCEPT_FAMILIES.FUNCTIONS:
        timeline = this.buildFunctionsTimeline(meta);
        break;
      case CONCEPT_FAMILIES.POINTERS:
        timeline = this.buildPointersTimeline(meta);
        break;
      case CONCEPT_FAMILIES.REFERENCES:
        timeline = this.buildReferencesTimeline(meta);
        break;
      case CONCEPT_FAMILIES.DYNAMIC_MEMORY:
        timeline = this.buildDynamicMemoryTimeline(meta);
        break;
      case CONCEPT_FAMILIES.CLASSES_OBJECTS:
        timeline = this.buildClassesObjectsTimeline(meta);
        break;
      case CONCEPT_FAMILIES.CONSTRUCTORS:
        timeline = this.buildConstructorsTimeline(meta);
        break;
      case CONCEPT_FAMILIES.DESTRUCTORS:
        timeline = this.buildDestructorsTimeline(meta);
        break;
      case CONCEPT_FAMILIES.INHERITANCE:
        timeline = this.buildInheritanceTimeline(meta);
        break;
      case CONCEPT_FAMILIES.POLYMORPHISM:
      case CONCEPT_FAMILIES.ABSTRACT_CLASSES:
        timeline = this.buildPolymorphismTimeline(meta, concept === CONCEPT_FAMILIES.ABSTRACT_CLASSES);
        break;
      default:
        timeline = this.buildVariablesTimeline(meta);
        break;
    }

    if (timeline && Array.isArray(timeline.steps) && timeline.steps.length > 100) {
      timeline.steps = timeline.steps.slice(0, 100);
    }
    return timeline;
  }

  // -------------------------------------------------------------
  // 1. Variables & Assignment Timeline
  // -------------------------------------------------------------
  static buildVariablesTimeline(meta) {
    const vars = meta.variables || [];
    const v1 = vars[0] || { name: 'age', type: 'int', initialValue: '20', lineNumber: 4, assignments: [{ value: '21', lineNumber: 6 }] };
    const initialVal = v1.initialValue || '20';
    const updatedVal = v1.assignments?.[0]?.value || (parseInt(initialVal, 10) ? String(parseInt(initialVal, 10) + 1) : '21');

    return {
      concept: CONCEPT_FAMILIES.VARIABLES,
      title: 'Variable Allocation & Value Mutation',
      educationalObjective: 'Understand that a variable is a named storage slot in memory with a data type and mutable value.',
      dataProvenance: 'CONCEPTUAL_SIMULATION',
      steps: [
        {
          stepIndex: 1,
          label: `Declare and Initialize ${v1.name}`,
          codeSnippet: `${v1.type} ${v1.name} = ${initialVal};`,
          lineNumber: v1.lineNumber || 4,
          explanation: `Allocates a storage slot named '${v1.name}' typed '${v1.type}' on the stack and initializes it with ${initialVal}.`,
          memoryState: {
            variables: [{ name: v1.name, type: v1.type, value: initialVal, changed: false, scope: 'main()' }],
            stackFrames: [{ name: 'main()', isActive: true, locals: [{ name: v1.name, value: initialVal }] }]
          },
          highlightTarget: v1.name
        },
        {
          stepIndex: 2,
          label: `Assign New Value to ${v1.name}`,
          codeSnippet: `${v1.name} = ${updatedVal};`,
          lineNumber: v1.assignments?.[0]?.lineNumber || 6,
          explanation: `Mutates '${v1.name}' in place. The previous value (${initialVal}) is overwritten with ${updatedVal}.`,
          memoryState: {
            variables: [{ name: v1.name, type: v1.type, value: updatedVal, previousValue: initialVal, changed: true, scope: 'main()' }],
            stackFrames: [{ name: 'main()', isActive: true, locals: [{ name: v1.name, value: updatedVal }] }]
          },
          highlightTarget: v1.name
        },
        {
          stepIndex: 3,
          label: `Output Value of ${v1.name}`,
          codeSnippet: `cout << "${v1.name}: " << ${v1.name} << endl;`,
          lineNumber: 7,
          explanation: `Reads the current value of '${v1.name}' (${updatedVal}) and transmits it to standard output.`,
          memoryState: {
            variables: [{ name: v1.name, type: v1.type, value: updatedVal, changed: false, scope: 'main()' }],
            stackFrames: [{ name: 'main()', isActive: true, locals: [{ name: v1.name, value: updatedVal }] }]
          },
          outputLog: [`${v1.name}: ${updatedVal}`]
        }
      ]
    };
  }

  // -------------------------------------------------------------
  // 2. Scope & Variable Shadowing Timeline
  // -------------------------------------------------------------
  static buildScopeTimeline() {
    return {
      concept: CONCEPT_FAMILIES.SCOPE,
      title: 'Block Scope & Variable Shadowing',
      educationalObjective: 'Variables declared inside inner curly braces {} exist only within that block, shadowing outer variables of the same name.',
      dataProvenance: 'CONCEPTUAL_SIMULATION',
      steps: [
        {
          stepIndex: 1,
          label: 'Declare Outer Variable',
          codeSnippet: 'int x = 10;',
          lineNumber: 4,
          explanation: "Outer variable 'x' is allocated in the outer main() scope with value 10.",
          memoryState: {
            variables: [{ name: 'x (outer)', type: 'int', value: '10', scope: 'Outer Scope', isActiveScope: true }]
          },
          highlightTarget: 'x (outer)'
        },
        {
          stepIndex: 2,
          label: 'Enter Inner Scope & Shadow x',
          codeSnippet: '{\n  int x = 20;\n}',
          lineNumber: 6,
          explanation: "Entering inner block {}. A new 'x' is allocated, temporarily shadowing the outer 'x'.",
          memoryState: {
            variables: [
              { name: 'x (outer)', type: 'int', value: '10', scope: 'Outer Scope', isShadowed: true },
              { name: 'x (inner)', type: 'int', value: '20', scope: 'Inner Scope', isActiveScope: true, changed: true }
            ]
          },
          highlightTarget: 'x (inner)',
          outputLog: ['Inner x: 20']
        },
        {
          stepIndex: 3,
          label: 'Exit Inner Scope (Teardown)',
          codeSnippet: '} // inner scope ends\ncout << "Outer x: " << x;',
          lineNumber: 9,
          explanation: "Inner scope ends! Inner 'x' is destroyed. Outer 'x' is unshadowed and retains its original value 10.",
          memoryState: {
            variables: [{ name: 'x (outer)', type: 'int', value: '10', scope: 'Outer Scope', isActiveScope: true }]
          },
          highlightTarget: 'x (outer)',
          outputLog: ['Inner x: 20', 'Outer x: 10']
        }
      ]
    };
  }

  // -------------------------------------------------------------
  // 3. Functions & Call Stack Timeline
  // -------------------------------------------------------------
  static buildFunctionsTimeline(meta) {
    const fn = meta.functions?.[0] || { name: 'add', returnType: 'int', params: [{ type: 'int', name: 'a' }, { type: 'int', name: 'b' }] };
    const p1 = fn.params[0]?.name || 'a';
    const p2 = fn.params[1]?.name || 'b';

    return {
      concept: CONCEPT_FAMILIES.FUNCTIONS,
      title: 'Function Invocations & Call Stack',
      educationalObjective: 'Every function call creates a new stack frame for parameters and local variables. When it returns, the frame is popped.',
      dataProvenance: 'CONCEPTUAL_SIMULATION',
      steps: [
        {
          stepIndex: 1,
          label: 'main() Starts Execution',
          codeSnippet: 'int main() { ... }',
          lineNumber: 7,
          explanation: "The operating system creates the base stack frame for main(). 'result' is allocated without value yet.",
          memoryState: {
            stackFrames: [{ name: 'main()', isActive: true, locals: [{ name: 'result', value: '?' }] }]
          }
        },
        {
          stepIndex: 2,
          label: `Call ${fn.name}(2, 3) -> Push Frame`,
          codeSnippet: `int result = ${fn.name}(2, 3);`,
          lineNumber: 8,
          explanation: `Invokes '${fn.name}'. A new stack frame is pushed on top of the call stack. Parameters ${p1}=2 and ${p2}=3 are initialized.`,
          memoryState: {
            stackFrames: [
              { name: 'main()', isActive: false, locals: [{ name: 'result', value: '?' }] },
              { name: `${fn.name}(${p1}: 2, ${p2}: 3)`, isActive: true, locals: [{ name: p1, value: '2' }, { name: p2, value: '3' }] }
            ]
          },
          highlightTarget: fn.name
        },
        {
          stepIndex: 3,
          label: `Execute ${fn.name} Body & Return`,
          codeSnippet: `return ${p1} + ${p2};`,
          lineNumber: 4,
          explanation: `Calculates 2 + 3 = 5. The return value 5 is prepared to be handed back to the caller.`,
          memoryState: {
            stackFrames: [
              { name: 'main()', isActive: false, locals: [{ name: 'result', value: '?' }] },
              { name: `${fn.name}()`, isActive: true, returnValue: '5', locals: [{ name: p1, value: '2' }, { name: p2, value: '3' }] }
            ]
          }
        },
        {
          stepIndex: 4,
          label: 'Pop Stack Frame & Assign Result',
          codeSnippet: 'int result = 5;',
          lineNumber: 8,
          explanation: `${fn.name}'s stack frame is popped off the stack and destroyed. 'result' in main() receives the return value 5.`,
          memoryState: {
            stackFrames: [{ name: 'main()', isActive: true, locals: [{ name: 'result', value: '5', changed: true }] }]
          },
          outputLog: ['Result: 5']
        }
      ]
    };
  }

  // -------------------------------------------------------------
  // 4. Pointers Timeline
  // -------------------------------------------------------------
  static buildPointersTimeline(meta) {
    const ptr = meta.pointers?.[0] || { name: 'p', type: 'int', targetVar: 'x' };
    const target = ptr.targetVar || 'x';

    return {
      concept: CONCEPT_FAMILIES.POINTERS,
      title: 'Pointers & Address Dereferencing',
      educationalObjective: 'A pointer does not store the direct value; it stores the memory address of another variable and can dereference it via *.',
      dataProvenance: 'CONCEPTUAL_SIMULATION',
      steps: [
        {
          stepIndex: 1,
          label: `Declare Variable ${target}`,
          codeSnippet: `int ${target} = 10;`,
          lineNumber: 4,
          explanation: `Allocates an integer '${target}' with value 10 in memory.`,
          memoryState: {
            variables: [{ name: target, type: 'int', value: '10', address: '0x1000' }]
          }
        },
        {
          stepIndex: 2,
          label: `Declare Pointer ${ptr.name} Pointing to ${target}`,
          codeSnippet: `int* ${ptr.name} = &${target};`,
          lineNumber: 5,
          explanation: `&${target} takes the address of '${target}'. Pointer '${ptr.name}' now stores this address and points to '${target}'.`,
          memoryState: {
            variables: [
              { name: target, type: 'int', value: '10', address: '0x1000' },
              { name: ptr.name, type: 'int*', value: `&${target}`, pointsTo: target, address: '0x1008' }
            ],
            relationships: [{ from: ptr.name, to: target, type: 'points_to', label: 'points to (&x)' }]
          },
          highlightTarget: ptr.name
        },
        {
          stepIndex: 3,
          label: `Dereference Mutation (*${ptr.name} = 25)`,
          codeSnippet: `*${ptr.name} = 25;`,
          lineNumber: 6,
          explanation: `*${ptr.name} follows the pointer to '${target}' and writes 25 directly into '${target}'s memory location!`,
          memoryState: {
            variables: [
              { name: target, type: 'int', value: '25', previousValue: '10', changed: true, address: '0x1000' },
              { name: ptr.name, type: 'int*', value: `&${target}`, pointsTo: target, address: '0x1008' }
            ],
            relationships: [{ from: ptr.name, to: target, type: 'points_to', label: 'mutates target' }]
          },
          outputLog: [`${target} is now: 25`]
        }
      ]
    };
  }

  // -------------------------------------------------------------
  // 5. References Timeline
  // -------------------------------------------------------------
  static buildReferencesTimeline(meta) {
    const ref = meta.references?.[0] || { name: 'r', type: 'int', targetVar: 'x' };
    const target = ref.targetVar || 'x';

    return {
      concept: CONCEPT_FAMILIES.REFERENCES,
      title: 'References as Variable Aliases',
      educationalObjective: 'A reference is an alias (second name) for an existing variable. It does not occupy separate distinct memory.',
      dataProvenance: 'CONCEPTUAL_SIMULATION',
      steps: [
        {
          stepIndex: 1,
          label: `Original Variable ${target}`,
          codeSnippet: `int ${target} = 10;`,
          lineNumber: 4,
          explanation: `Allocates integer '${target}' with value 10 in memory.`,
          memoryState: {
            variables: [{ name: target, type: 'int', value: '10', address: '0x1000' }]
          }
        },
        {
          stepIndex: 2,
          label: `Bind Reference ${ref.name} to ${target}`,
          codeSnippet: `int& ${ref.name} = ${target};`,
          lineNumber: 5,
          explanation: `'${ref.name}' becomes an alias for '${target}'. Both names now refer to the exact same storage slot in memory.`,
          memoryState: {
            variables: [{ name: `${target} (alias: ${ref.name})`, type: 'int', value: '10', address: '0x1000', isAlias: true }],
            relationships: [{ from: ref.name, to: target, type: 'references', label: 'alias to same slot' }]
          },
          highlightTarget: ref.name
        },
        {
          stepIndex: 3,
          label: `Modify Through Reference (${ref.name} = 30)`,
          codeSnippet: `${ref.name} = 30;`,
          lineNumber: 6,
          explanation: `Changing '${ref.name}' immediately changes '${target}', because they are two names for the same memory slot!`,
          memoryState: {
            variables: [{ name: `${target} (alias: ${ref.name})`, type: 'int', value: '30', previousValue: '10', changed: true, address: '0x1000' }],
            relationships: [{ from: ref.name, to: target, type: 'references', label: 'shared slot updated' }]
          },
          outputLog: [`${target} through reference: 30`]
        }
      ]
    };
  }

  // -------------------------------------------------------------
  // 6. Dynamic Memory (new & delete) Timeline
  // -------------------------------------------------------------
  static buildDynamicMemoryTimeline() {
    return {
      concept: CONCEPT_FAMILIES.DYNAMIC_MEMORY,
      title: 'Dynamic Heap Allocation (new & delete)',
      educationalObjective: "'new' allocates memory on the Heap during runtime; 'delete' deallocates it to prevent memory leaks.",
      dataProvenance: 'CONCEPTUAL_SIMULATION',
      steps: [
        {
          stepIndex: 1,
          label: 'Allocate on Heap (new int)',
          codeSnippet: 'int* p = new int(10);',
          lineNumber: 4,
          explanation: "The 'new' operator allocates an integer on the Heap with value 10. Pointer 'p' on the Stack points to this Heap block.",
          memoryState: {
            stackFrames: [{ name: 'Stack', locals: [{ name: 'p (pointer)', value: 'Heap#1' }] }],
            heapObjects: [{ id: 'Heap#1', type: 'int', value: '10', isFreed: false }],
            relationships: [{ from: 'p', to: 'Heap#1', type: 'points_to', label: 'points to heap' }]
          },
          highlightTarget: 'Heap#1'
        },
        {
          stepIndex: 2,
          label: 'Deallocate Heap Memory (delete p)',
          codeSnippet: 'delete p;',
          lineNumber: 6,
          explanation: "'delete' returns the Heap memory block back to the system. 'p' becomes a dangling pointer until reassigned.",
          memoryState: {
            stackFrames: [{ name: 'Stack', locals: [{ name: 'p (dangling!)', value: 'Heap#1' }] }],
            heapObjects: [{ id: 'Heap#1', type: 'int', value: 'Freed', isFreed: true }],
            relationships: [{ from: 'p', to: 'Heap#1', type: 'points_to', label: 'dangling' }]
          },
          highlightTarget: 'Heap#1'
        },
        {
          stepIndex: 3,
          label: 'Clear Pointer (p = nullptr)',
          codeSnippet: 'p = nullptr;',
          lineNumber: 7,
          explanation: "Setting 'p' to nullptr safely ensures the pointer no longer references deallocated heap memory.",
          memoryState: {
            stackFrames: [{ name: 'Stack', locals: [{ name: 'p', value: 'nullptr' }] }],
            heapObjects: []
          },
          highlightTarget: 'p'
        }
      ]
    };
  }

  // -------------------------------------------------------------
  // 7. Classes & Objects Timeline
  // -------------------------------------------------------------
  static buildClassesObjectsTimeline(meta) {
    const cls = meta.classes?.[0] || { name: 'Student', members: [{ type: 'string', name: 'name' }, { type: 'int', name: 'rollNo' }] };

    return {
      concept: CONCEPT_FAMILIES.CLASSES_OBJECTS,
      title: 'Class Blueprint vs Object Instance',
      educationalObjective: 'A class is an abstract type definition (blueprint). An object is a concrete instance allocated in memory.',
      dataProvenance: 'CONCEPTUAL_SIMULATION',
      steps: [
        {
          stepIndex: 1,
          label: `Class Blueprint: ${cls.name}`,
          codeSnippet: `class ${cls.name} { ... };`,
          lineNumber: 4,
          explanation: `The compiler registers the blueprint '${cls.name}' defining structure and member layouts. No object memory is allocated yet.`,
          memoryState: {
            classes: [{ name: cls.name, members: cls.members, methods: ['display()'] }]
          },
          highlightTarget: cls.name
        },
        {
          stepIndex: 2,
          label: `Instantiate Object 's'`,
          codeSnippet: `${cls.name} s;`,
          lineNumber: 13,
          explanation: `Allocates concrete object 's' in stack memory conforming to the '${cls.name}' blueprint layout.`,
          memoryState: {
            classes: [{ name: cls.name, members: cls.members }],
            objects: [{ name: 's', className: cls.name, members: { name: '""', rollNo: '0' } }]
          },
          highlightTarget: 's'
        },
        {
          stepIndex: 3,
          label: "Populate Member Values",
          codeSnippet: 's.name = "Pikachu";\ns.rollNo = 25;',
          lineNumber: 14,
          explanation: "Directly assigns member fields inside object 's'.",
          memoryState: {
            objects: [{ name: 's', className: cls.name, members: { name: '"Pikachu"', rollNo: '25' }, changed: true }]
          },
          highlightTarget: 's'
        },
        {
          stepIndex: 4,
          label: "Invoke Member Function s.display()",
          codeSnippet: 's.display();',
          lineNumber: 16,
          explanation: "Invokes display() in the context of object 's' (with implicit 'this' pointer pointing to 's').",
          memoryState: {
            objects: [{ name: 's', className: cls.name, members: { name: '"Pikachu"', rollNo: '25' } }]
          },
          outputLog: ['Pikachu - 25']
        }
      ]
    };
  }

  // -------------------------------------------------------------
  // 8. Constructors Timeline
  // -------------------------------------------------------------
  static buildConstructorsTimeline() {
    return {
      concept: CONCEPT_FAMILIES.CONSTRUCTORS,
      title: 'Object Construction & Initialization Order',
      educationalObjective: 'A constructor automatically runs upon object instantiation to initialize member variables before the object is used.',
      dataProvenance: 'CONCEPTUAL_SIMULATION',
      steps: [
        {
          stepIndex: 1,
          label: 'Request Object Instantiation',
          codeSnippet: 'Student s("Rohit", 20);',
          lineNumber: 12,
          explanation: "The program requests a new Student instance. Memory is reserved for 's' on the stack.",
          memoryState: {
            objects: [{ name: 's', className: 'Student', status: 'Uninitialized', members: { name: '?', age: '?' } }]
          }
        },
        {
          stepIndex: 2,
          label: 'Constructor Invocation',
          codeSnippet: 'Student(string n, int a) : name(n), age(a) {}',
          lineNumber: 7,
          explanation: "Student parameterized constructor is invoked. Arguments received: n='Rohit', a=20.",
          memoryState: {
            stackFrames: [{ name: 'Student::Student(n="Rohit", a=20)', isActive: true }],
            objects: [{ name: 's', className: 'Student', status: 'Initializing...', members: { name: '?', age: '?' } }]
          }
        },
        {
          stepIndex: 3,
          label: 'Member Initialization List',
          codeSnippet: ': name(n), age(a)',
          lineNumber: 7,
          explanation: "Initializer list assigns member variables directly in memory: name='Rohit', age=20.",
          memoryState: {
            objects: [{ name: 's', className: 'Student', status: 'Ready', members: { name: '"Rohit"', age: '20' }, changed: true }]
          },
          highlightTarget: 's'
        },
        {
          stepIndex: 4,
          label: 'Object Fully Constructed',
          codeSnippet: 'cout << s.name << " is " << s.age;',
          lineNumber: 13,
          explanation: "Object 's' is now in a valid, ready state and available for program operations.",
          memoryState: {
            objects: [{ name: 's', className: 'Student', status: 'Active', members: { name: '"Rohit"', age: '20' } }]
          },
          outputLog: ['Rohit is 20']
        }
      ]
    };
  }

  // -------------------------------------------------------------
  // 9. Destructors Timeline
  // -------------------------------------------------------------
  static buildDestructorsTimeline() {
    return {
      concept: CONCEPT_FAMILIES.DESTRUCTORS,
      title: 'Object Destruction & Resource Cleanup',
      educationalObjective: 'A destructor (~ClassName) is automatically called when an object goes out of scope to release resources.',
      dataProvenance: 'CONCEPTUAL_SIMULATION',
      steps: [
        {
          stepIndex: 1,
          label: 'Object Active in Scope',
          codeSnippet: 'Resource r;',
          lineNumber: 11,
          explanation: "Object 'r' is constructed and holds its allocated resource inside the local block.",
          memoryState: {
            objects: [{ name: 'r', className: 'Resource', status: 'Active' }]
          },
          outputLog: ['Resource acquired']
        },
        {
          stepIndex: 2,
          label: 'Scope Exits -> ~Resource() Invoked',
          codeSnippet: '} // Block ends',
          lineNumber: 12,
          explanation: "Execution reaches the end of the enclosing block. The C++ runtime automatically invokes ~Resource().",
          memoryState: {
            stackFrames: [{ name: 'Resource::~Resource()', isActive: true }],
            objects: [{ name: 'r', className: 'Resource', status: 'Destroying...' }]
          },
          outputLog: ['Resource acquired', 'Resource freed']
        },
        {
          stepIndex: 3,
          label: 'Object Memory Reclaimed',
          codeSnippet: 'return 0;',
          lineNumber: 13,
          explanation: "Object 'r' memory on the stack is cleanly reclaimed.",
          memoryState: {
            objects: []
          }
        }
      ]
    };
  }

  // -------------------------------------------------------------
  // 10. Inheritance Timeline
  // -------------------------------------------------------------
  static buildInheritanceTimeline(meta) {
    const derived = meta.inheritance?.derived || 'Dog';
    const base = meta.inheritance?.base || 'Animal';

    return {
      concept: CONCEPT_FAMILIES.INHERITANCE,
      title: 'Class Inheritance & Subobject Layout',
      educationalObjective: 'A derived class inherits members from its base class. A derived object contains an embedded base subobject in memory.',
      dataProvenance: 'CONCEPTUAL_SIMULATION',
      steps: [
        {
          stepIndex: 1,
          label: `Base Class: ${base}`,
          codeSnippet: `class ${base} { public: void eat(); };`,
          lineNumber: 4,
          explanation: `Base class '${base}' defines common members and behavior.`,
          memoryState: {
            classes: [{ name: base, members: [], methods: ['eat()'] }]
          }
        },
        {
          stepIndex: 2,
          label: `Derived Class: ${derived} : public ${base}`,
          codeSnippet: `class ${derived} : public ${base} { public: void bark(); };`,
          lineNumber: 8,
          explanation: `'${derived}' inherits all public/protected features of '${base}' and adds specialized derived members.`,
          memoryState: {
            classes: [
              { name: base, methods: ['eat()'] },
              { name: derived, baseClass: base, methods: ['bark()', 'eat() [inherited]'] }
            ],
            relationships: [{ from: derived, to: base, type: 'inherits', label: 'inherits from' }]
          },
          highlightTarget: derived
        },
        {
          stepIndex: 3,
          label: `Instantiate Derived Object 'd'`,
          codeSnippet: `${derived} d;`,
          lineNumber: 13,
          explanation: `Allocates object 'd'. In memory, 'd' contains an embedded '${base}' subobject followed by '${derived}' members.`,
          memoryState: {
            objects: [{
              name: 'd',
              className: derived,
              subobjects: [{ name: `[${base} subobject]`, methods: ['eat()'] }],
              methods: ['bark()']
            }],
            relationships: [{ from: derived, to: base, type: 'inherits' }]
          },
          highlightTarget: 'd'
        },
        {
          stepIndex: 4,
          label: 'Call Inherited and Derived Methods',
          codeSnippet: 'd.eat();\nd.bark();',
          lineNumber: 14,
          explanation: "d.eat() resolves to the base subobject function; d.bark() resolves to the derived class function.",
          memoryState: {
            objects: [{ name: 'd', className: derived, status: 'Active' }]
          },
          outputLog: ['Eating', 'Woof!']
        }
      ]
    };
  }

  // -------------------------------------------------------------
  // 11. Polymorphism & Virtual Dispatch Timeline
  // -------------------------------------------------------------
  static buildPolymorphismTimeline(meta, isAbstract = false) {
    const base = meta.polymorphism?.baseClass || 'Animal';
    const derived = meta.polymorphism?.derivedClass || 'Dog';
    const method = meta.polymorphism?.dispatchedMethod || 'speak';

    return {
      concept: isAbstract ? CONCEPT_FAMILIES.ABSTRACT_CLASSES : CONCEPT_FAMILIES.POLYMORPHISM,
      title: isAbstract ? 'Abstract Class & Pure Virtual Interface' : 'Runtime Polymorphism & Virtual Function Dispatch',
      educationalObjective: 'Virtual functions enable dynamic dispatch: a base class pointer calls the derived implementation based on runtime object type.',
      dataProvenance: 'CONCEPTUAL_SIMULATION',
      steps: [
        {
          stepIndex: 1,
          label: isAbstract ? `Abstract Base: ${base} (= 0)` : `Base Class with Virtual: ${base}`,
          codeSnippet: `class ${base} { public: virtual void ${method}() ${isAbstract ? '= 0;' : '{ ... }'} };`,
          lineNumber: 4,
          explanation: isAbstract
            ? `'${base}' declares a pure virtual function (= 0), making '${base}' an Abstract Class that CANNOT be instantiated directly.`
            : `'${base}' declares 'virtual void ${method}()', signalling to the compiler to generate a vtable for dynamic resolution.`,
          memoryState: {
            classes: [{ name: base, isAbstract, methods: [`virtual ${method}() ${isAbstract ? '[pure virtual]' : ''}`] }]
          },
          highlightTarget: base
        },
        {
          stepIndex: 2,
          label: `Derived Override: ${derived}::${method}`,
          codeSnippet: `class ${derived} : public ${base} {\n  void ${method}() override { cout << "${derived}"; }\n};`,
          lineNumber: 9,
          explanation: `'${derived}' overrides '${method}()'. The derived vtable entry for '${method}' now points to '${derived}::${method}'.`,
          memoryState: {
            classes: [
              { name: base, isAbstract, methods: [`virtual ${method}()`] },
              { name: derived, baseClass: base, methods: [`${method}() [override]`] }
            ],
            relationships: [{ from: derived, to: base, type: 'inherits' }]
          }
        },
        {
          stepIndex: 3,
          label: `Base Pointer to Derived Object (${base}* a = new ${derived}())`,
          codeSnippet: `${base}* a = new ${derived}();`,
          lineNumber: 15,
          explanation: `Pointer 'a' is statically typed '${base}*', but points dynamically to a '${derived}' instance on the Heap!`,
          memoryState: {
            stackFrames: [{ name: 'Stack', locals: [{ name: 'a (Animal*)', value: 'Heap::Dog' }] }],
            heapObjects: [{ id: 'Heap::Dog', type: derived, vptr: `${derived}::vtable` }],
            relationships: [{ from: 'a', to: 'Heap::Dog', type: 'points_to', label: 'points to derived instance' }]
          },
          highlightTarget: 'a'
        },
        {
          stepIndex: 4,
          label: `Virtual Dispatch: a->${method}()`,
          codeSnippet: `a->${method}();`,
          lineNumber: 16,
          explanation: `Runtime Dynamic Dispatch! Even though 'a' is an ${base}*, the vptr table resolves to ${derived}::${method}()!`,
          memoryState: {
            stackFrames: [{ name: `${derived}::${method}() [dispatched dynamically]`, isActive: true }],
            heapObjects: [{ id: 'Heap::Dog', type: derived }],
            relationships: [{ from: 'a', to: `${derived}::${method}()`, type: 'dispatches', label: 'virtual dispatch -> Dog' }]
          },
          outputLog: [`${derived} barks`],
          highlightTarget: `${derived}::${method}()`
        }
      ]
    };
  }

  // -------------------------------------------------------------
  // Fallback for Unsupported Constructs
  // -------------------------------------------------------------
  static generateFallbackTimeline(reason) {
    return {
      concept: 'UNSUPPORTED',
      isFallback: true,
      title: 'Visualization Notice',
      educationalObjective: 'Educational simulation is available for core C++ concepts (variables, functions, pointers, OOP, constructors, inheritance, polymorphism).',
      dataProvenance: 'STATIC_ANALYSIS',
      steps: [
        {
          stepIndex: 1,
          label: 'Concept Demo Available',
          codeSnippet: '// Try a curated lesson demo',
          explanation: reason || 'Visualization is currently tailored for standard educational C++ constructs. Click "Load Demo" below to see this lesson in action!',
          memoryState: { variables: [] }
        }
      ]
    };
  }
}
