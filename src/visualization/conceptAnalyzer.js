/**
 * C++ Concept Analyzer for CodeBloom Trainer (Phase D3).
 * Performs static pattern recognition and structural analysis on C++ source code.
 * Classifies educational concepts, extracts declarations, scopes, functions,
 * pointers, OOP classes, constructors, and virtual function dispatches.
 */

export const CONCEPT_FAMILIES = {
  VARIABLES: 'VARIABLES',
  SCOPE: 'SCOPE',
  FUNCTIONS: 'FUNCTIONS',
  POINTERS: 'POINTERS',
  REFERENCES: 'REFERENCES',
  DYNAMIC_MEMORY: 'DYNAMIC_MEMORY',
  CLASSES_OBJECTS: 'CLASSES_OBJECTS',
  CONSTRUCTORS: 'CONSTRUCTORS',
  DESTRUCTORS: 'DESTRUCTORS',
  INHERITANCE: 'INHERITANCE',
  POLYMORPHISM: 'POLYMORPHISM',
  ABSTRACT_CLASSES: 'ABSTRACT_CLASSES'
};

/**
 * Curated educational demo programs for each concept family.
 * Used when source code is empty or learner requests a concept walkthrough.
 */
export const CONCEPT_DEMOS = {
  [CONCEPT_FAMILIES.VARIABLES]: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int age = 20;\n  double gpa = 3.85;\n  age = 21;\n  cout << "Age: " << age << endl;\n  return 0;\n}`,
  [CONCEPT_FAMILIES.SCOPE]: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int x = 10;\n  {\n    int x = 20; // Shadows outer x\n    cout << "Inner x: " << x << endl;\n  }\n  cout << "Outer x: " << x << endl;\n  return 0;\n}`,
  [CONCEPT_FAMILIES.FUNCTIONS]: `#include <iostream>\nusing namespace std;\n\nint add(int a, int b) {\n  return a + b;\n}\n\nint main() {\n  int result = add(2, 3);\n  cout << "Result: " << result << endl;\n  return 0;\n}`,
  [CONCEPT_FAMILIES.POINTERS]: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int x = 10;\n  int* p = &x;\n  *p = 25;\n  cout << "x is now: " << x << endl;\n  return 0;\n}`,
  [CONCEPT_FAMILIES.REFERENCES]: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int x = 10;\n  int& r = x;\n  r = 30;\n  cout << "x through reference: " << x << endl;\n  return 0;\n}`,
  [CONCEPT_FAMILIES.DYNAMIC_MEMORY]: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int* p = new int(10);\n  cout << "Heap value: " << *p << endl;\n  delete p;\n  p = nullptr;\n  return 0;\n}`,
  [CONCEPT_FAMILIES.CLASSES_OBJECTS]: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\npublic:\n  string name;\n  int rollNo;\n  void display() {\n    cout << name << " - " << rollNo << endl;\n  }\n};\n\nint main() {\n  Student s;\n  s.name = "Pikachu";\n  s.rollNo = 25;\n  s.display();\n  return 0;\n}`,
  [CONCEPT_FAMILIES.CONSTRUCTORS]: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\npublic:\n  string name;\n  int age;\n  Student(string n, int a) : name(n), age(a) {}\n};\n\nint main() {\n  Student s("Rohit", 20);\n  cout << s.name << " is " << s.age << endl;\n  return 0;\n}`,
  [CONCEPT_FAMILIES.DESTRUCTORS]: `#include <iostream>\nusing namespace std;\n\nclass Resource {\npublic:\n  Resource() { cout << "Resource acquired" << endl; }\n  ~Resource() { cout << "Resource freed" << endl; }\n};\n\nint main() {\n  {\n    Resource r;\n  } // Destructor called here at scope exit\n  return 0;\n}`,
  [CONCEPT_FAMILIES.INHERITANCE]: `#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n  void eat() { cout << "Eating" << endl; }\n};\n\nclass Dog : public Animal {\npublic:\n  void bark() { cout << "Woof!" << endl; }\n};\n\nint main() {\n  Dog d;\n  d.eat();\n  d.bark();\n  return 0;\n}`,
  [CONCEPT_FAMILIES.POLYMORPHISM]: `#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n  virtual void speak() {\n    cout << "Animal sound" << endl;\n  }\n};\n\nclass Dog : public Animal {\npublic:\n  void speak() override {\n    cout << "Dog barks" << endl;\n  }\n};\n\nint main() {\n  Animal* a = new Dog();\n  a->speak(); // Virtual dispatch resolves to Dog::speak()\n  delete a;\n  return 0;\n}`,
  [CONCEPT_FAMILIES.ABSTRACT_CLASSES]: `#include <iostream>\nusing namespace std;\n\nclass Shape {\npublic:\n  virtual void draw() = 0; // Pure virtual function\n};\n\nclass Circle : public Shape {\npublic:\n  void draw() override {\n    cout << "Drawing Circle" << endl;\n  }\n};\n\nint main() {\n  Shape* s = new Circle();\n  s->draw();\n  delete s;\n  return 0;\n}`
};

/**
 * Analyzes C++ source code to extract educational concept structure.
 * @param {string} sourceCode
 * @returns {Object} Analysis result
 */
export function analyzeCppSource(sourceCode = '') {
  try {
    const code = (typeof sourceCode === 'string' ? sourceCode : String(sourceCode || '')).trim();
    if (!code) {
      return {
        supported: false,
        reason: 'No C++ code provided to analyze.',
        suggestedConcept: CONCEPT_FAMILIES.VARIABLES,
        detectedConcepts: []
      };
    }

    // Pre-filter: Check for unsupported complex metaprogramming or obscure constructs
    if (/#\s*define\s+\w+\(/.test(code) && code.length > 500) {
      return {
        supported: false,
        reason: 'Complex preprocessor macros are currently beyond the educational visualizer scope.',
        suggestedConcept: CONCEPT_FAMILIES.VARIABLES,
        detectedConcepts: []
      };
    }

    const lines = code.split('\n');
  const detectedConcepts = [];

  // 1. Detect Polymorphism & Virtual Dispatch
  const hasVirtual = /\bvirtual\s+/.test(code);
  const hasOverride = /\boverride\b/.test(code);
  const hasPureVirtual = /\bvirtual\s+[^;=]+=\s*0\s*;/.test(code);
  const hasBasePointer = /(\w+)\s*\*\s*(\w+)\s*=\s*new\s+(\w+)/.test(code) || /(\w+)\s*\*\s*(\w+)\s*=\s*&(\w+)/.test(code);

  if (hasPureVirtual) {
    detectedConcepts.push(CONCEPT_FAMILIES.ABSTRACT_CLASSES);
    detectedConcepts.push(CONCEPT_FAMILIES.POLYMORPHISM);
  } else if (hasVirtual && (hasOverride || hasBasePointer)) {
    detectedConcepts.push(CONCEPT_FAMILIES.POLYMORPHISM);
  }

  // 2. Detect Inheritance
  const inheritanceMatch = code.match(/class\s+(\w+)\s*:\s*(?:public|protected|private)?\s*(\w+)/);
  if (inheritanceMatch) {
    detectedConcepts.push(CONCEPT_FAMILIES.INHERITANCE);
  }

  // 3. Detect Classes & Objects
  const classMatches = Array.from(code.matchAll(/class\s+(\w+)\s*\{([^}]*)\}/gs));
  const structMatches = Array.from(code.matchAll(/struct\s+(\w+)\s*\{([^}]*)\}/gs));
  const hasClass = classMatches.length > 0 || structMatches.length > 0;
  if (hasClass) {
    detectedConcepts.push(CONCEPT_FAMILIES.CLASSES_OBJECTS);
  }

  // 4. Detect Constructors & Destructors
  const hasDestructor = /~\w+\s*\(\s*\)/.test(code);
  if (hasDestructor) {
    detectedConcepts.push(CONCEPT_FAMILIES.DESTRUCTORS);
  }

  // Check for constructor definitions inside class
  let hasConstructor = false;
  for (const m of classMatches) {
    const className = m[1];
    const classBody = m[2];
    const ctorRegex = new RegExp(`\\b${className}\\s*\\([^)]*\\)`);
    if (ctorRegex.test(classBody)) {
      hasConstructor = true;
      break;
    }
  }
  if (hasConstructor) {
    detectedConcepts.push(CONCEPT_FAMILIES.CONSTRUCTORS);
  }

  // 5. Detect Dynamic Memory (new / delete)
  const hasNew = /\bnew\s+/.test(code);
  const hasDelete = /\bdelete\s+/.test(code);
  if (hasNew || hasDelete) {
    detectedConcepts.push(CONCEPT_FAMILIES.DYNAMIC_MEMORY);
  }

  // 6. Detect Pointers & References
  const hasPointer = /\b(int|double|float|char|string|\w+)\s*\*\s*(\w+)/.test(code);
  const hasReference = /\b(int|double|float|char|string|\w+)\s*&\s*(\w+)\s*=/.test(code);
  if (hasPointer) detectedConcepts.push(CONCEPT_FAMILIES.POINTERS);
  if (hasReference) detectedConcepts.push(CONCEPT_FAMILIES.REFERENCES);

  // 7. Detect Functions (non-main)
  const functionMatches = Array.from(code.matchAll(/\b(void|int|double|float|char|string|bool)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{/g))
    .filter(m => m[2] !== 'main');
  if (functionMatches.length > 0) {
    detectedConcepts.push(CONCEPT_FAMILIES.FUNCTIONS);
  }

  // 8. Detect Scope & Shadowing
  const hasNestedScope = /\{\s*[^}]*\{\s*[^}]*\b(int|double|float|char|string)\s+(\w+)\s*=/.test(code);
  if (hasNestedScope) {
    detectedConcepts.push(CONCEPT_FAMILIES.SCOPE);
  }

  // 9. Detect Variables & Assignments (default foundational concept)
  const varMatches = Array.from(code.matchAll(/\b(int|double|float|char|string|bool)\s+(\w+)\s*(?:=\s*([^;]+))?;/g));
  if (varMatches.length > 0) {
    detectedConcepts.push(CONCEPT_FAMILIES.VARIABLES);
  }

  if (detectedConcepts.length === 0 && !/\b(int|void)\s+main\b/.test(code)) {
    return {
      supported: false,
      reason: 'No recognizable C++ constructs found. Please write C++ code or load a curated lesson demo.',
      suggestedConcept: CONCEPT_FAMILIES.VARIABLES,
      detectedConcepts: []
    };
  }

  // Primary Concept Selection (ordered by highest educational conceptual significance)
  const priorityOrder = [
    CONCEPT_FAMILIES.ABSTRACT_CLASSES,
    CONCEPT_FAMILIES.POLYMORPHISM,
    CONCEPT_FAMILIES.INHERITANCE,
    CONCEPT_FAMILIES.DESTRUCTORS,
    CONCEPT_FAMILIES.CONSTRUCTORS,
    CONCEPT_FAMILIES.CLASSES_OBJECTS,
    CONCEPT_FAMILIES.DYNAMIC_MEMORY,
    CONCEPT_FAMILIES.REFERENCES,
    CONCEPT_FAMILIES.POINTERS,
    CONCEPT_FAMILIES.FUNCTIONS,
    CONCEPT_FAMILIES.SCOPE,
    CONCEPT_FAMILIES.VARIABLES
  ];

  const primaryConcept = priorityOrder.find(c => detectedConcepts.includes(c)) || CONCEPT_FAMILIES.VARIABLES;

  return {
    supported: true,
    primaryConcept,
    detectedConcepts,
    metadata: {
      lineCount: lines.length,
      variables: extractVariables(code, lines),
      functions: extractFunctions(functionMatches, lines),
      classes: extractClasses(classMatches, code, lines),
      inheritance: inheritanceMatch ? { derived: inheritanceMatch[1], base: inheritanceMatch[2] } : null,
      pointers: extractPointers(code, lines),
      references: extractReferences(code, lines),
      polymorphism: hasVirtual ? extractPolymorphism(code, lines) : null
    }
  };
  } catch (err) {
    return {
      supported: false,
      reason: 'Analysis fallback: ' + (err?.message || 'Syntax parsing limit'),
      suggestedConcept: CONCEPT_FAMILIES.VARIABLES,
      detectedConcepts: []
    };
  }
}

// -------------------------------------------------------------
// Metadata Extraction Helpers
// -------------------------------------------------------------

function extractVariables(code, lines) {
  const vars = [];
  const regex = /\b(int|double|float|char|string|bool)\s+(\w+)\s*(?:=\s*([^;]+))?;/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    const type = match[1];
    const name = match[2];
    const initialValue = (match[3] || '').trim();
    const lineIndex = findLineNumber(lines, match[0]);

    // Find subsequent assignments to this variable (e.g. x = 21;)
    const assignRegex = new RegExp(`\\b${name}\\s*=\\s*([^;]+);`, 'g');
    const assignments = [];
    let assignMatch;
    while ((assignMatch = assignRegex.exec(code)) !== null) {
      const assignLine = findLineNumber(lines, assignMatch[0]);
      if (assignLine > lineIndex) {
        assignments.push({
          value: assignMatch[1].trim(),
          lineNumber: assignLine,
          rawCode: assignMatch[0]
        });
      }
    }

    vars.push({
      type,
      name,
      initialValue: initialValue || (type === 'int' ? '0' : type === 'string' ? '""' : '0.0'),
      lineNumber: lineIndex,
      rawCode: match[0],
      assignments
    });
  }
  return vars;
}

function extractFunctions(matches, lines) {
  return matches.map(m => {
    const returnType = m[1];
    const name = m[2];
    const rawParams = m[3].trim();
    const params = rawParams ? rawParams.split(',').map(p => {
      const parts = p.trim().split(/\s+/);
      return { type: parts[0] || 'int', name: parts[1] || 'param' };
    }) : [];

    return {
      name,
      returnType,
      params,
      lineNumber: findLineNumber(lines, `${name}(`)
    };
  });
}

function extractClasses(classMatches, code, lines) {
  return classMatches.map(m => {
    const name = m[1];
    const body = m[2];
    const members = [];
    const memberRegex = /\b(int|double|float|char|string|bool)\s+(\w+)\s*;/g;
    let memMatch;
    while ((memMatch = memberRegex.exec(body)) !== null) {
      members.push({ type: memMatch[1], name: memMatch[2] });
    }

    // Check for constructor
    const ctorRegex = new RegExp(`\\b${name}\\s*\\(([^)]*)\\)`);
    const ctorMatch = body.match(ctorRegex);

    return {
      name,
      members,
      hasConstructor: Boolean(ctorMatch),
      constructorParams: ctorMatch ? ctorMatch[1].trim() : '',
      lineNumber: findLineNumber(lines, `class ${name}`)
    };
  });
}

function extractPointers(code, lines) {
  const ptrs = [];
  const regex = /\b(int|double|float|char|string|\w+)\s*\*\s*(\w+)\s*=\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    const targetExpr = match[3].trim();
    const isNew = targetExpr.startsWith('new');
    const targetVar = targetExpr.replace(/^&/, '').trim();
    ptrs.push({
      type: match[1],
      name: match[2],
      targetExpr,
      isNew,
      targetVar,
      lineNumber: findLineNumber(lines, match[0])
    });
  }
  return ptrs;
}

function extractReferences(code, lines) {
  const refs = [];
  const regex = /\b(int|double|float|char|string|\w+)\s*&\s*(\w+)\s*=\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    refs.push({
      type: match[1],
      name: match[2],
      targetVar: match[3].trim(),
      lineNumber: findLineNumber(lines, match[0])
    });
  }
  return refs;
}

function extractPolymorphism(code, lines) {
  const basePointerMatch = code.match(/(\w+)\s*\*\s*(\w+)\s*=\s*new\s+(\w+)\s*\(/);
  const dispatchMatch = code.match(/(\w+)\s*->\s*(\w+)\s*\(\s*\)/);

  return {
    baseClass: basePointerMatch ? basePointerMatch[1] : 'Base',
    pointerName: basePointerMatch ? basePointerMatch[2] : 'ptr',
    derivedClass: basePointerMatch ? basePointerMatch[3] : 'Derived',
    dispatchedMethod: dispatchMatch ? dispatchMatch[2] : 'speak',
    callLineNumber: dispatchMatch ? findLineNumber(lines, dispatchMatch[0]) : 1
  };
}

function findLineNumber(lines, snippet) {
  if (!lines || !snippet) return 1;
  const clean = snippet.trim();
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(clean)) return i + 1;
  }
  return 1;
}
