/**
 * CodeBloom C++ Independent Coding Proficiency Benchmark Battery (Phase E7).
 *
 * Designed to provide empirical, repeatable evidence of concept transfer.
 * Each problem is an UNSEEN challenge paired with a corresponding training
 * analog from the curriculum, allowing measurement of the training-to-transfer gap.
 *
 * All problems strictly follow Phase E6 concept-hiding standards:
 * - Zero mechanism keywords in learner-facing prompts
 * - Minimal unguided starter code
 * - Rigorous hidden test coverage to prevent hardcoding
 */

export const BENCHMARK_DIMENSIONS = {
  ENCAPSULATION_INVARIANTS: 'encapsulation-invariants',
  OBJECT_FLOW_AGGREGATION: 'object-flow-aggregation',
  STATIC_LEDGER_ACCOUNTING: 'static-ledger-accounting',
  DYNAMIC_MEMORY_SNAPSHOT: 'dynamic-memory-snapshot',
  INHERITANCE_DISPATCH: 'inheritance-dispatch',
  OPERATOR_SEMANTICS: 'operator-semantics',
  COMPOSITE_POLYMORPHISM: 'composite-polymorphism',
  MULTI_CONCEPT_ECOSYSTEM: 'multi-concept-ecosystem'
};

export const benchmarkBattery = [
  // 1. Encapsulation & Invariants Transfer Pair (Analog: classes-hard / access-hard)
  {
    id: 'bench-sensor-telemetry',
    title: 'Environmental Sensor Calibration & Alert Dispatcher',
    trainingAnalogId: 'classes-hard',
    trainingAnalogTitle: 'Inventory Item Stock & Valuation Engine',
    benchmarkDimension: BENCHMARK_DIMENSIONS.ENCAPSULATION_INVARIANTS,
    concepts: ['classes', 'objects', 'access-control', 'methods'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'An industrial environmental monitoring station manages precision atmospheric sensors. Each sensor is initialized with an alphanumeric sensor identifier, a calibrated baseline temperature reading (integer), and a maximum allowable variance threshold (positive integer).\n\nThe station processes a stream of operational reading commands until input ends:\n- "M <val>": Process a new measurement reading (integer). If the absolute difference between the measurement and the calibrated baseline strictly exceeds the variance threshold, immediately output:\n  "ALERT: Sensor <id> variance exceeded (<val> vs baseline <baseline>)"\n- "S": Output the sensor status summary:\n  "Sensor <id>: <count> readings, Baseline: <baseline>, Current: <last_val>"\n  If no measurements have been processed yet when "S" is received, the current reading is reported as equal to the baseline.\n\nGiven initial sensor parameters followed by commands, output all alerts and status summaries.',
    constraints: [
      'Sensor ID is an alphanumeric string without whitespace.',
      'Variance threshold is strictly positive.',
      'Must maintain sensor baseline and current state encapsulated without global variables.'
    ],
    inputFormat: '<id:string> <baseline:int> <threshold:int> followed by sequence of "M <val>" or "S"',
    outputFormat: 'Alert messages and status lines on separate lines.',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible: Excursion on second measurement and final status',
        input: 'SN-101 25 5\nM 27\nM 32\nS',
        expectedOutput: 'ALERT: Sensor SN-101 variance exceeded (32 vs baseline 25)\nSensor SN-101: 2 readings, Baseline: 25, Current: 32',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible: Negative baseline with negative variance excursion',
        input: 'TMP-9 0 10\nM -5\nM 10\nM -12\nS',
        expectedOutput: 'ALERT: Sensor TMP-9 variance exceeded (-12 vs baseline 0)\nSensor TMP-9: 3 readings, Baseline: 0, Current: -12',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden: Query status before any measurements processed',
        input: 'S-0 100 20\nS',
        expectedOutput: 'Sensor S-0: 0 readings, Baseline: 100, Current: 100',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden: Exact boundary tolerance and negative reading recovery',
        input: 'S-COLD -10 5\nM -15\nM -16\nM -5\nS',
        expectedOutput: 'ALERT: Sensor S-COLD variance exceeded (-16 vs baseline -10)\nSensor S-COLD: 3 readings, Baseline: -10, Current: -5',
        isHidden: true
      }
    ],
    expectedBehavior: 'Encapsulates sensor state and emits alerts when readings exceed variance threshold.',
    expectedDesignDecisions: [
      'Encapsulate sensor identity, baseline, and variance threshold inside a dedicated class',
      'Validate variance excursion during measurement intake without leaking raw state mutations',
      'Maintain running sample counts and last reading state cleanly'
    ],
    transferTarget: 'Evaluates whether a learner can transfer stock validation invariants (Inventory Item Stock) to atmospheric variance excursion monitoring.',
    hiddenTestStrength: 'STRONG',
    isBenchmark: true,
    isIndependent: true,
    hints: [
      'Consider what state attributes belong together to represent a sensor entity.',
      'Process measurement values sequentially and evaluate deviation against the baseline immediately.',
      'Encapsulate baseline, threshold, and sample counts inside private member variables to preserve integrity.'
    ],
    solution: `#include <iostream>\n#include <string>\n#include <cstdlib>\nusing namespace std;\n\nclass Sensor {\nprivate:\n  string id;\n  int baseline;\n  int threshold;\n  int count;\n  int lastVal;\npublic:\n  Sensor(string id_, int base_, int thresh_)\n    : id(id_), baseline(base_), threshold(thresh_), count(0), lastVal(base_) {}\n\n  void recordMeasurement(int val) {\n    count++;\n    lastVal = val;\n    if (abs(val - baseline) > threshold) {\n      cout << "ALERT: Sensor " << id << " variance exceeded (" << val << " vs baseline " << baseline << ")\\n";\n    }\n  }\n\n  void displayStatus() const {\n    cout << "Sensor " << id << ": " << count << " readings, Baseline: " << baseline << ", Current: " << lastVal << "\\n";\n  }\n};\n\nint main() {\n  string id;\n  int baseline, threshold;\n  if (cin >> id >> baseline >> threshold) {\n    Sensor s(id, baseline, threshold);\n    char cmd;\n    while (cin >> cmd) {\n      if (cmd == 'M' || cmd == 'm') {\n        int val;\n        cin >> val;\n        s.recordMeasurement(val);\n      } else if (cmd == 'S' || cmd == 's') {\n        s.displayStatus();\n      }\n    }\n  }\n  return 0;\n}`
  },

  // 2. Object Flow & Aggregation Transfer Pair (Analog: object-flow-hard)
  {
    id: 'bench-flight-manifest',
    title: 'Commercial Flight Manifest & Baggage Auditor',
    trainingAnalogId: 'object-flow-hard',
    trainingAnalogTitle: 'Warehouse Batch Inventory Analyzer',
    benchmarkDimension: BENCHMARK_DIMENSIONS.OBJECT_FLOW_AGGREGATION,
    concepts: ['arrays-of-objects', 'passing-objects', 'returning-objects', 'classes', 'objects'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'An airline check-in terminal audits passenger luggage for a commercial flight. Given an integer N (1 <= N <= 10) followed by N passenger records, each comprising <name:string> <class:char> <baggageWeight:int>, where class is either "E" (Economy) or "B" (Business), and baggageWeight is non-negative.\n\nDesign a routine that accepts the passenger collection, filters all passengers traveling in Business class ("B"), calculates the cumulative baggage weight across all business travelers, and identifies the business traveler with the heaviest individual baggage. The routine must return a structured aggregate summary containing these results.\n\nIf at least one business passenger is present, output:\n"Business: <count> passengers, Total Bag Weight: <total_weight>kg, Heaviest: <name> (<max_weight>kg)"\nIf there are no business passengers on the manifest, output:\n"No business passengers found".',
    constraints: [
      '1 <= N <= 10.',
      'Names are alphanumeric strings without spaces.',
      'Must return an aggregated summary record from the analysis routine.'
    ],
    inputFormat: '<N:int> followed by N lines of <name:string> <class:char> <weight:int>',
    outputFormat: 'Summary string or "No business passengers found".',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible: Mixed passengers with 2 Business class travelers',
        input: '3\nAlice E 20\nBob B 30\nCharlie B 25',
        expectedOutput: 'Business: 2 passengers, Total Bag Weight: 55kg, Heaviest: Bob (30kg)',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible: All Economy passengers with zero business travelers',
        input: '2\nDan E 15\nEve E 22',
        expectedOutput: 'No business passengers found',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden: Single business passenger',
        input: '1\nFrank B 42',
        expectedOutput: 'Business: 1 passengers, Total Bag Weight: 42kg, Heaviest: Frank (42kg)',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden: Tied heaviest bag retains first encountered',
        input: '3\nGrace B 30\nHeidi E 10\nIvan B 30',
        expectedOutput: 'Business: 2 passengers, Total Bag Weight: 60kg, Heaviest: Grace (30kg)',
        isHidden: true
      }
    ],
    expectedBehavior: 'Filters array of passenger objects, computes aggregate totals, and returns summary object.',
    expectedDesignDecisions: [
      'Model passenger entity with encapsulated attributes',
      'Model structured aggregate summary class/type',
      'Pass array of objects to auditing function and return aggregated result object'
    ],
    transferTarget: 'Evaluates transfer from inventory warehouse batch aggregation to airline passenger manifest filtering and summary reporting.',
    hiddenTestStrength: 'STRONG',
    isBenchmark: true,
    isIndependent: true,
    hints: [
      'Model each passenger\'s details inside an encapsulated record structure.',
      'A dedicated summary model can bundle the filtered passenger count, cumulative baggage weight, and top passenger identity.',
      'Iterate through the passenger collection, accumulating baggage weight only for records matching the target travel category.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Passenger {\nprivate:\n  string name;\n  char travelClass;\n  int baggageWeight;\npublic:\n  Passenger() : name(""), travelClass('E'), baggageWeight(0) {}\n  Passenger(string n, char c, int w) : name(n), travelClass(c), baggageWeight(w) {}\n\n  string getName() const { return name; }\n  char getTravelClass() const { return travelClass; }\n  int getBaggageWeight() const { return baggageWeight; }\n};\n\nclass BaggageSummary {\nprivate:\n  int count;\n  int totalWeight;\n  string heaviestName;\n  int maxWeight;\npublic:\n  BaggageSummary(int c, int tw, string hn, int mw)\n    : count(c), totalWeight(tw), heaviestName(hn), maxWeight(mw) {}\n\n  int getCount() const { return count; }\n  int getTotalWeight() const { return totalWeight; }\n  string getHeaviestName() const { return heaviestName; }\n  int getMaxWeight() const { return maxWeight; }\n};\n\nBaggageSummary auditBusinessLuggage(const Passenger manifest[], int n) {\n  int count = 0;\n  int totalWeight = 0;\n  string heaviest = "";\n  int maxW = -1;\n\n  for (int i = 0; i < n; i++) {\n    if (manifest[i].getTravelClass() == 'B') {\n      count++;\n      totalWeight += manifest[i].getBaggageWeight();\n      if (manifest[i].getBaggageWeight() > maxW) {\n        maxW = manifest[i].getBaggageWeight();\n        heaviest = manifest[i].getName();\n      }\n    }\n  }\n  return BaggageSummary(count, totalWeight, heaviest, maxW);\n}\n\nint main() {\n  int n;\n  if (cin >> n && n > 0 && n <= 10) {\n    Passenger manifest[10];\n    for (int i = 0; i < n; i++) {\n      string name;\n      char cls;\n      int weight;\n      cin >> name >> cls >> weight;\n      manifest[i] = Passenger(name, cls, weight);\n    }\n    BaggageSummary summary = auditBusinessLuggage(manifest, n);\n    if (summary.getCount() == 0) {\n      cout << "No business passengers found";\n    } else {\n      cout << "Business: " << summary.getCount() << " passengers, Total Bag Weight: "\n           << summary.getTotalWeight() << "kg, Heaviest: "\n           << summary.getHeaviestName() << " (" << summary.getMaxWeight() << "kg)";\n    }\n  }\n  return 0;\n}`
  },

  // 3. Static Ledger Accounting Transfer Pair (Analog: static-hard)
  {
    id: 'bench-transaction-ledger',
    title: 'Automated Toll Plaza Vehicle Audit Ledger',
    trainingAnalogId: 'static-hard',
    trainingAnalogTitle: 'Banking Transaction Ledger Auditor',
    benchmarkDimension: BENCHMARK_DIMENSIONS.STATIC_LEDGER_ACCOUNTING,
    concepts: ['static', 'static-members', 'static-methods', 'classes', 'objects'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'A municipal toll authority operates an automated toll plaza auditing system. As each vehicle passes through the plaza, the system processes a vehicle transaction record comprising vehicle license plate (string) and toll classification ("S" for Standard passenger car: $5, "C" for Commercial truck: $15, "B" for Bus: $10).\n\nEach processed vehicle receives an automatic consecutive receipt identifier starting at 7001. The accounting engine must maintain cumulative transaction counts and total toll revenue collected across all processed vehicles without using external global variables.\n\nGiven N (N >= 1) followed by N vehicle records <plate:string> <type:char>, print each toll receipt in the format:\n"Receipt #<id>: Plate <plate>, Toll $<amount>"\nAt the end of the batch, print the cumulative audit line:\n"Toll Summary: <count> vehicles, Total Revenue: $<total>".',
    constraints: [
      'Receipt identifiers increment sequentially starting from 7001.',
      'Cumulative totals must be maintained via class-level shared state without global variables.'
    ],
    inputFormat: '<N:int> followed by N lines of <plate:string> <type:char>',
    outputFormat: 'N receipt lines followed by Toll Summary line.',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible: Mixed vehicle types: Car, Commercial Truck, Bus',
        input: '3\nABC-123 S\nXYZ-999 C\nBUS-42 B',
        expectedOutput: 'Receipt #7001: Plate ABC-123, Toll $5\nReceipt #7002: Plate XYZ-999, Toll $15\nReceipt #7003: Plate BUS-42, Toll $10\nToll Summary: 3 vehicles, Total Revenue: $30',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible: Single passenger car transaction',
        input: '1\nSOLO-1 S',
        expectedOutput: 'Receipt #7001: Plate SOLO-1, Toll $5\nToll Summary: 1 vehicles, Total Revenue: $5',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden: Consecutive commercial trucks',
        input: '2\nTRK-1 C\nTRK-2 C',
        expectedOutput: 'Receipt #7001: Plate TRK-1, Toll $15\nReceipt #7002: Plate TRK-2, Toll $15\nToll Summary: 2 vehicles, Total Revenue: $30',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden: 4 vehicles with commercial truck at end',
        input: '4\nA S\nB S\nC S\nD C',
        expectedOutput: 'Receipt #7001: Plate A, Toll $5\nReceipt #7002: Plate B, Toll $5\nReceipt #7003: Plate C, Toll $5\nReceipt #7004: Plate D, Toll $15\nToll Summary: 4 vehicles, Total Revenue: $30',
        isHidden: true
      }
    ],
    expectedBehavior: 'Auto-increments ticket receipt IDs and aggregates cumulative revenue via class static state.',
    expectedDesignDecisions: [
      'Use static member variables for auto-incrementing receipt IDs starting at 7001',
      'Use static member variables for vehicle count and total toll revenue accumulation',
      'Use static member methods for accessing class-level audit summaries'
    ],
    transferTarget: 'Evaluates transfer from bank transaction tracking to highway toll plaza vehicle and revenue auditing.',
    hiddenTestStrength: 'STRONG',
    isBenchmark: true,
    isIndependent: true,
    hints: [
      'Determine vehicle fee categories based on classification codes ("S", "C", "B").',
      'Generate sequential receipt identifiers starting at 7001 across created transaction instances.',
      'Maintain cumulative vehicle counts and total revenue at the class level rather than relying on external variables.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass TollTicket {\nprivate:\n  static int nextTicketId;\n  static int totalVehicles;\n  static int totalRevenue;\n\n  int ticketId;\n  string plate;\n  char vehicleType;\n  int tollFee;\npublic:\n  TollTicket(string p, char t) : plate(p), vehicleType(t) {\n    ticketId = nextTicketId++;\n    totalVehicles++;\n    if (t == 'C') {\n      tollFee = 15;\n    } else if (t == 'B') {\n      tollFee = 10;\n    } else {\n      tollFee = 5;\n    }\n    totalRevenue += tollFee;\n  }\n\n  void printReceipt() const {\n    cout << "Receipt #" << ticketId << ": Plate " << plate << ", Toll $" << tollFee << "\\n";\n  }\n\n  static int getTotalVehicles() { return totalVehicles; }\n  static int getTotalRevenue() { return totalRevenue; }\n};\n\nint TollTicket::nextTicketId = 7001;\nint TollTicket::totalVehicles = 0;\nint TollTicket::totalRevenue = 0;\n\nint main() {\n  int n;\n  if (cin >> n && n > 0) {\n    for (int i = 0; i < n; i++) {\n      string plate;\n      char type;\n      cin >> plate >> type;\n      TollTicket t(plate, type);\n      t.printReceipt();\n    }\n    cout << "Toll Summary: " << TollTicket::getTotalVehicles()\n         << " vehicles, Total Revenue: $" << TollTicket::getTotalRevenue();\n  }\n  return 0;\n}`
  },

  // 4. Dynamic Memory & Snapshot Transfer Pair (Analog: constructors-hard)
  {
    id: 'bench-snapshot-buffer',
    title: 'Telemetry Signal Frame Snapshot Archiver',
    trainingAnalogId: 'constructors-hard',
    trainingAnalogTitle: 'Isolated Sequence Snapshot Manager',
    benchmarkDimension: BENCHMARK_DIMENSIONS.DYNAMIC_MEMORY_SNAPSHOT,
    concepts: ['constructors', 'copy-constructor', 'destructors', 'dynamic-memory', 'classes'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'A telemetry recording subsystem samples numerical sensor signals into a dynamically sized frame buffer. Given buffer capacity N (1 <= N <= 10) and N integer signal samples, initialize the active signal buffer.\n\nTo preserve state history during flight maneuvers, the system archives an exact snapshot copy of the active buffer. Subsequently, an amplify command multiplies every sample in the active buffer by a scaling factor K (integer).\n\nThe archive snapshot must demonstrate complete state isolation: modifying the active buffer must not alter the historical snapshot.\n\nFinally, display:\n1. The active buffer contents: "Active: [s1, s2, ..., sN]"\n2. The snapshot buffer contents: "Snapshot: [s1, s2, ..., sN]"\nAll dynamically allocated resources must be deallocated cleanly upon destruction.',
    constraints: [
      '1 <= N <= 10.',
      'Modifying active buffer after snapshot must never alter snapshot data.',
      'Zero memory leaks upon exit.'
    ],
    inputFormat: '<N:int> followed by N integer samples, followed by multiplier <K:int>',
    outputFormat: '"Active: [...]" followed by "Snapshot: [...]"',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible: 3-element buffer with positive multiplier',
        input: '3 10 20 30 2',
        expectedOutput: 'Active: [20, 40, 60]\nSnapshot: [10, 20, 30]',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible: 2-element buffer with negative multiplier',
        input: '2 -5 8 -1',
        expectedOutput: 'Active: [5, -8]\nSnapshot: [-5, 8]',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden: Single element buffer with zero factor',
        input: '1 100 0',
        expectedOutput: 'Active: [0]\nSnapshot: [100]',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden: 4-element buffer with mixed positive/negative samples and negative factor',
        input: '4 0 5 -3 10 -2',
        expectedOutput: 'Active: [0, -10, 6, -20]\nSnapshot: [0, 5, -3, 10]',
        isHidden: true
      }
    ],
    expectedBehavior: 'Deep-copies dynamic array and verifies mutation isolation between active and snapshot buffers.',
    expectedDesignDecisions: [
      'Manage dynamically allocated heap array inside dedicated container class',
      'Implement deep-copy copy constructor to duplicate heap buffer for snapshot',
      'Implement destructor to release dynamic memory cleanly'
    ],
    transferTarget: 'Evaluates transfer from sequence snapshot management to flight telemetry frame buffer snapshotting and amplification.',
    hiddenTestStrength: 'STRONG',
    isBenchmark: true,
    isIndependent: true,
    hints: [
      'Allocate a dynamic integer buffer for the active signal sequence.',
      'When archiving a snapshot, ensure the new instance allocates its own independent buffer and copies elements one by one.',
      'Provide a destructor to deallocate the dynamic array when the buffer scope terminates.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass FrameBuffer {\nprivate:\n  int* data;\n  int size;\npublic:\n  FrameBuffer(int s) : size(s) {\n    data = new int[size];\n  }\n\n  FrameBuffer(const FrameBuffer& other) : size(other.size) {\n    data = new int[size];\n    for (int i = 0; i < size; i++) {\n      data[i] = other.data[i];\n    }\n  }\n\n  ~FrameBuffer() {\n    delete[] data;\n  }\n\n  void set(int idx, int val) {\n    if (idx >= 0 && idx < size) data[idx] = val;\n  }\n\n  void multiply(int factor) {\n    for (int i = 0; i < size; i++) {\n      data[i] *= factor;\n    }\n  }\n\n  void display(const string& label) const {\n    cout << label << ": [";\n    for (int i = 0; i < size; i++) {\n      cout << data[i];\n      if (i + 1 < size) cout << ", ";\n    }\n    cout << "]\\n";\n  }\n};\n\nint main() {\n  int n;\n  if (cin >> n && n > 0) {\n    FrameBuffer active(n);\n    for (int i = 0; i < n; i++) {\n      int val;\n      cin >> val;\n      active.set(i, val);\n    }\n    int k;\n    cin >> k;\n\n    FrameBuffer snapshot = active;\n    active.multiply(k);\n\n    active.display("Active");\n    snapshot.display("Snapshot");\n  }\n  return 0;\n}`
  },

  // 5. Inheritance & Cost Dispatch Transfer Pair (Analog: inheritance-hard)
  {
    id: 'bench-fleet-management',
    title: 'Logistics Freight Dispatch Operating Cost Engine',
    trainingAnalogId: 'inheritance-hard',
    trainingAnalogTitle: 'Workforce Payroll & Compensation Processor',
    benchmarkDimension: BENCHMARK_DIMENSIONS.INHERITANCE_DISPATCH,
    concepts: ['inheritance', 'single-inheritance', 'classes', 'methods'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'A national logistics freight carrier evaluates daily operating expenses across varied transport vehicles. All vehicles share core identity records: vehicle identification string and daily travel distance in miles (integer).\n\nThe base operating cost for any vehicle is calculated as: distance * $2.\nVehicle categories extend this calculation based on specialized cargo parameters:\n- Urban Delivery Van (code "V"): records number of customer package drop stops S. Operating cost = base cost + S * $8.\n- Heavy Cargo Hauler (code "H"): records cargo payload weight in tons T. Operating cost = base cost + T * $25.\n\nGiven N (1 <= N <= 10) vehicle entries, compute and display each vehicle\'s evaluation:\n"Vehicle <id> (<Type>): Cost $<cost>" (where Type is "Van" or "Hauler").\nAt the conclusion of processing, display the fleet total expenditure:\n"Fleet Total Expense: $<total>".',
    constraints: [
      '1 <= N <= 10.',
      'Distance, stops, and tonnage are non-negative integers.',
      'Base vehicle logic must be shared via inheritance.'
    ],
    inputFormat: '<N:int> followed by N lines of <type:char> <id:string> <distance:int> <param:int>',
    outputFormat: 'N vehicle lines followed by Fleet Total Expense line.',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible: 1 Van and 1 Heavy Hauler',
        input: '2\nV VAN-1 50 10\nH TRK-8 100 4',
        expectedOutput: 'Vehicle VAN-1 (Van): Cost $180\nVehicle TRK-8 (Hauler): Cost $300\nFleet Total Expense: $480',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible: Zero distance Van',
        input: '1\nV VAN-9 0 0',
        expectedOutput: 'Vehicle VAN-9 (Van): Cost $0\nFleet Total Expense: $0',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden: All Haulers with heavy payloads',
        input: '2\nH H1 10 10\nH H2 20 5',
        expectedOutput: 'Vehicle H1 (Hauler): Cost $270\nVehicle H2 (Hauler): Cost $165\nFleet Total Expense: $435',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden: Zero distance with cargo stops and tonnage',
        input: '2\nV V0 0 5\nH H0 0 2',
        expectedOutput: 'Vehicle V0 (Van): Cost $40\nVehicle H0 (Hauler): Cost $50\nFleet Total Expense: $90',
        isHidden: true
      }
    ],
    expectedBehavior: 'Computes role-specific operating costs using inheritance and method overriding.',
    expectedDesignDecisions: [
      'Model common vehicle properties and base distance cost in base class',
      'Derive DeliveryVan and HeavyHauler from base vehicle',
      'Override cost calculation in derived classes while reusing base cost calculation'
    ],
    transferTarget: 'Evaluates transfer from employee/manager compensation modeling to freight vehicle operating cost calculation.',
    hiddenTestStrength: 'STRONG',
    isBenchmark: true,
    isIndependent: true,
    hints: [
      'Identify common attributes (identifier, mileage) and base operating cost logic shared across all vehicles.',
      'Create specialized vehicle types that extend the common vehicle structure with cargo stops or tonnage.',
      'Override operating cost calculation in specialized types while incorporating the base distance calculation.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Vehicle {\nprotected:\n  string id;\n  int distance;\npublic:\n  Vehicle(string id_, int dist_) : id(id_), distance(dist_) {}\n  virtual ~Vehicle() {}\n\n  virtual string getType() const = 0;\n  virtual int calculateCost() const {\n    return distance * 2;\n  }\n\n  string getId() const { return id; }\n};\n\nclass DeliveryVan : public Vehicle {\nprivate:\n  int stops;\npublic:\n  DeliveryVan(string id_, int dist_, int s) : Vehicle(id_, dist_), stops(s) {}\n\n  string getType() const override { return "Van"; }\n  int calculateCost() const override {\n    return Vehicle::calculateCost() + stops * 8;\n  }\n};\n\nclass HeavyHauler : public Vehicle {\nprivate:\n  int tonnage;\npublic:\n  HeavyHauler(string id_, int dist_, int t) : Vehicle(id_, dist_), tonnage(t) {}\n\n  string getType() const override { return "Hauler"; }\n  int calculateCost() const override {\n    return Vehicle::calculateCost() + tonnage * 25;\n  }\n};\n\nint main() {\n  int n;\n  if (cin >> n && n > 0 && n <= 10) {\n    Vehicle* fleet[10];\n    int total = 0;\n    for (int i = 0; i < n; i++) {\n      char type;\n      string id;\n      int dist, param;\n      cin >> type >> id >> dist >> param;\n      if (type == 'V' || type == 'v') {\n        fleet[i] = new DeliveryVan(id, dist, param);\n      } else {\n        fleet[i] = new HeavyHauler(id, dist, param);\n      }\n      int cost = fleet[i]->calculateCost();\n      total += cost;\n      cout << "Vehicle " << fleet[i]->getId() << " (" << fleet[i]->getType() << "): Cost $" << cost << "\\n";\n    }\n    cout << "Fleet Total Expense: $" << total;\n    for (int i = 0; i < n; i++) {\n      delete fleet[i];\n    }\n  }\n  return 0;\n}`
  },

  // 6. Operator Overloading Transfer Pair (Analog: operators-hard / string-operators-hard)
  {
    id: 'bench-matrix-combiner',
    title: 'Cartesian Signal Grid Overlay & Equivalence Checker',
    trainingAnalogId: 'operators-hard',
    trainingAnalogTitle: 'Geometric Bounding Region Combiner & Comparison Tool',
    benchmarkDimension: BENCHMARK_DIMENSIONS.OPERATOR_SEMANTICS,
    concepts: ['operator-overloading', 'binary-operators', 'classes', 'methods'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'A geographic sensor matrix manages 4-element linear signal grids representing local intensity readings across 4 cardinal sectors [sector0, sector1, sector2, sector3].\n\nDesign a signal grid value type supporting natural domain arithmetic and inspection operations:\n1. Adding two grids using standard addition operator (+) produces a combined grid where each sector intensity is the sum of the corresponding sector values.\n2. Testing two grids for equality using standard equivalence operator (==) evaluates to true if and only if all 4 sectors have identical intensity values.\n3. Reading a sector intensity by index using standard subscript indexing operator ([]) retrieves the value at that sector (0 <= index < 4).\n\nGiven 4 integers for Grid A and 4 integers for Grid B, compute their combined overlay grid C = A + B. Then, given 4 integers for a Target Grid T, check if C equals T.\n\nOutput:\n"Combined: [<c0>, <c1>, <c2>, <c3>]"\n"Match Target: <Yes/No>"\n"Peak Sector: <index> with value <val>" (where Peak Sector is the sector index 0..3 with the highest intensity in C; if tied, report the earliest index).',
    constraints: [
      'Sector values are standard integers.',
      'Subscript index is within [0, 3].',
      'Grid operations must be modeled with overloaded operators +, ==, and [].'
    ],
    inputFormat: '4 integers for A, 4 integers for B, 4 integers for T',
    outputFormat: 'Combined line, Match Target line, Peak Sector line.',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible: Matching target grid with peak at index 3',
        input: '1 2 3 4 5 5 5 5 6 7 8 9',
        expectedOutput: 'Combined: [6, 7, 8, 9]\nMatch Target: Yes\nPeak Sector: 3 with value 9',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible: Non-matching target grid with peak at index 0',
        input: '10 0 -5 2 -2 5 5 -2 8 5 0 1',
        expectedOutput: 'Combined: [8, 5, 0, 0]\nMatch Target: No\nPeak Sector: 0 with value 8',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden: Zero combined grid matching zero target',
        input: '-1 -2 -3 -4 1 2 3 4 0 0 0 0',
        expectedOutput: 'Combined: [0, 0, 0, 0]\nMatch Target: Yes\nPeak Sector: 0 with value 0',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden: Tied peak sector values at index 1 and 2 (reports earliest index 1)',
        input: '2 10 10 3 1 0 0 1 3 10 10 4',
        expectedOutput: 'Combined: [3, 10, 10, 4]\nMatch Target: Yes\nPeak Sector: 1 with value 10',
        isHidden: true
      }
    ],
    expectedBehavior: 'Overloads +, ==, and [] to perform natural grid arithmetic and inspection.',
    expectedDesignDecisions: [
      'Encapsulate 4 sector values inside a value-type grid class',
      'Overload operator+ to return a new combined grid with summed sectors',
      'Overload operator== to verify sector equivalence across all 4 elements',
      'Overload operator[] for direct element indexing'
    ],
    transferTarget: 'Evaluates transfer from bounding box operators to 4-sector geographic sensor grid overlay mathematics.',
    hiddenTestStrength: 'STRONG',
    isBenchmark: true,
    isIndependent: true,
    hints: [
      'Represent the 4 sector intensity readings within an encapsulated value type.',
      'Overload the addition operator to return a fresh grid with corresponding sector sums.',
      'Overload the equality operator to compare all four sector values, and the subscript operator to allow indexing.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass SignalGrid {\nprivate:\n  int sectors[4];\npublic:\n  SignalGrid() {\n    for (int i = 0; i < 4; i++) sectors[i] = 0;\n  }\n\n  SignalGrid(int s0, int s1, int s2, int s3) {\n    sectors[0] = s0;\n    sectors[1] = s1;\n    sectors[2] = s2;\n    sectors[3] = s3;\n  }\n\n  SignalGrid operator+(const SignalGrid& other) const {\n    return SignalGrid(\n      sectors[0] + other.sectors[0],\n      sectors[1] + other.sectors[1],\n      sectors[2] + other.sectors[2],\n      sectors[3] + other.sectors[3]\n    );\n  }\n\n  bool operator==(const SignalGrid& other) const {\n    for (int i = 0; i < 4; i++) {\n      if (sectors[i] != other.sectors[i]) return false;\n    }\n    return true;\n  }\n\n  int operator[](int idx) const {\n    if (idx >= 0 && idx < 4) return sectors[idx];\n    return 0;\n  }\n};\n\nint main() {\n  int a[4], b[4], t[4];\n  for (int i = 0; i < 4; i++) cin >> a[i];\n  for (int i = 0; i < 4; i++) cin >> b[i];\n  for (int i = 0; i < 4; i++) cin >> t[i];\n\n  SignalGrid gridA(a[0], a[1], a[2], a[3]);\n  SignalGrid gridB(b[0], b[1], b[2], b[3]);\n  SignalGrid target(t[0], t[1], t[2], t[3]);\n\n  SignalGrid combined = gridA + gridB;\n\n  cout << "Combined: [" << combined[0] << ", " << combined[1] << ", "\n       << combined[2] << ", " << combined[3] << "]\\n";\n\n  if (combined == target) {\n    cout << "Match Target: Yes\\n";\n  } else {\n    cout << "Match Target: No\\n";\n  }\n\n  int bestIdx = 0;\n  int maxVal = combined[0];\n  for (int i = 1; i < 4; i++) {\n    if (combined[i] > maxVal) {\n      maxVal = combined[i];\n      bestIdx = i;\n    }\n  }\n  cout << "Peak Sector: " << bestIdx << " with value " << maxVal;\n  return 0;\n}`
  },

  // 7. Composite Polymorphism Transfer Pair (Analog: combined-operator-hierarchy)
  {
    id: 'bench-expression-ast',
    title: 'Dynamic Signal Transformation Pipeline',
    trainingAnalogId: 'combined-operator-hierarchy',
    trainingAnalogTitle: 'Composite Arithmetic Formula Tree Evaluator',
    benchmarkDimension: BENCHMARK_DIMENSIONS.COMPOSITE_POLYMORPHISM,
    concepts: ['runtime-polymorphism', 'abstract-classes', 'base-pointers', 'dynamic-dispatch', 'virtual-destructors'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'A digital signal processing workstation dynamically configures audio transformation pipelines. Processing pipelines are assembled from individual transformation stages operating on an input signal value (integer).\n\nAll processing stages share a common evaluation contract. Concrete stages include:\n- Gain Stage: multiplies the incoming signal by an integer factor.\n- Bias Stage: adds an integer offset to the incoming signal.\n- Dual Stage: executes two child transformation stages in sequence, feeding the output of the first stage into the second stage.\n\nGiven an operation mode (1 or 2), an input signal X, and two stage parameters P1 and P2:\n- Mode 1 constructs a pipeline that first biases by P1, then amplifies by P2: (X + P1) * P2.\n- Mode 2 constructs a pipeline that first amplifies by P1, then biases by P2: (X * P1) + P2.\n\nThe pipeline must be dynamically constructed, evaluated through a common base pointer interface, output the transformed signal formatted as "Transformed Signal: <result>", and have all allocated pipeline nodes cleanly reclaimed.',
    constraints: [
      'Mode is either 1 or 2.',
      'Stages must share an abstract interface evaluated polymorphically via base pointers.',
      'Zero memory leaks upon termination.'
    ],
    inputFormat: '<mode:int> <X:int> <P1:int> <P2:int>',
    outputFormat: 'Transformed Signal: <result>',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible: Mode 1: (10 + 5) * 2 = 30',
        input: '1 10 5 2',
        expectedOutput: 'Transformed Signal: 30',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible: Mode 2: (10 * 5) + 2 = 52',
        input: '2 10 5 2',
        expectedOutput: 'Transformed Signal: 52',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden: Multiplication by zero in Mode 1',
        input: '1 50 -10 0',
        expectedOutput: 'Transformed Signal: 0',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden: Negative input and bias in Mode 2: (-4 * 3) + -5 = -17',
        input: '2 -4 3 -5',
        expectedOutput: 'Transformed Signal: -17',
        isHidden: true
      }
    ],
    expectedBehavior: 'Constructs polymorphic transformation pipeline and evaluates signal via recursive dynamic dispatch.',
    expectedDesignDecisions: [
      'Define an abstract Stage base class with pure virtual transform() and virtual destructor',
      'Implement concrete leaf stages (ScaleStage, BiasStage)',
      'Implement composite DualStage holding base pointers to child stages',
      'Clean up dynamic child nodes recursively in destructors'
    ],
    transferTarget: 'Evaluates transfer from arithmetic expression evaluation trees to signal processing audio filter pipelines.',
    hiddenTestStrength: 'STRONG',
    isBenchmark: true,
    isIndependent: true,
    hints: [
      'Define a uniform transformation contract that concrete transformation stages implement.',
      'A composite stage can hold references or pointers to two child stages and chain their outputs.',
      'Ensure composite container stages delete their allocated child stages in their destructors to prevent resource leaks.'
    ],
    solution: `#include <iostream>\nusing namespace std;\n\nclass Stage {\npublic:\n  virtual int transform(int input) const = 0;\n  virtual ~Stage() {}\n};\n\nclass ScaleStage : public Stage {\nprivate:\n  int factor;\npublic:\n  ScaleStage(int f) : factor(f) {}\n  int transform(int input) const override {\n    return input * factor;\n  }\n};\n\nclass BiasStage : public Stage {\nprivate:\n  int bias;\npublic:\n  BiasStage(int b) : bias(b) {}\n  int transform(int input) const override {\n    return input + bias;\n  }\n};\n\nclass DualStage : public Stage {\nprivate:\n  Stage* first;\n  Stage* second;\npublic:\n  DualStage(Stage* s1, Stage* s2) : first(s1), second(s2) {}\n  ~DualStage() {\n    delete first;\n    delete second;\n  }\n  int transform(int input) const override {\n    return second->transform(first->transform(input));\n  }\n};\n\nint main() {\n  int mode, x, p1, p2;\n  if (cin >> mode >> x >> p1 >> p2) {\n    Stage* pipeline = nullptr;\n    if (mode == 1) {\n      pipeline = new DualStage(new BiasStage(p1), new ScaleStage(p2));\n    } else {\n      pipeline = new DualStage(new ScaleStage(p1), new BiasStage(p2));\n    }\n    cout << "Transformed Signal: " << pipeline->transform(x);\n    delete pipeline;\n  }\n  return 0;\n}`
  },

  // 8. Multi-Concept Ecosystem Capstone Transfer Pair (Analog: capstone-library-lending)
  {
    id: 'bench-device-ecosystem',
    title: 'Municipal Water Purification Station Dispatcher',
    trainingAnalogId: 'capstone-library-lending',
    trainingAnalogTitle: 'Media Library Lending & Overdue Fines Engine',
    benchmarkDimension: BENCHMARK_DIMENSIONS.MULTI_CONCEPT_ECOSYSTEM,
    concepts: ['classes', 'static', 'inheritance', 'virtual-functions', 'base-pointers', 'access-control'],
    difficulty: 'hard',
    level: 5,
    problemStatement: 'A municipal water purification station audits throughput across heterogeneous water filtration units.\nEach installed filtration unit has an alphanumeric model identifier and an automated sequential station registration serial number starting at 4001.\n\nUnits belong to specialized filtration categories:\n- Sand Filter (code "S"): Daily throughput in thousands of gallons = base hours * 12.\n- Membrane Ultrafilter (code "M"): Daily throughput in thousands of gallons = base hours * 18 + pressure rating * 3.\n\nGiven N (1 <= N <= 10) filtration units to register with their specifications, followed by a daily run schedule query for each unit specifying run hours:\n1. Print each registered unit\'s directory record:\n   "[<serial>] Model: <model> (Type: <Sand/Membrane>)"\n2. Compute each unit\'s daily output:\n   "Unit <serial> (<model>): Throughput <val> kGal"\n3. Print station total volume:\n   "Total Daily Station Output: <total> kGal"\n\nThe station controller must manage and evaluate all units through a unified interface and deallocate all dynamic unit controllers cleanly upon completion.',
    constraints: [
      '1 <= N <= 10.',
      'Registration serials increment sequentially starting at 4001.',
      'Must process heterogeneous units uniformly through a common base interface.',
      'Zero memory leaks upon exit.'
    ],
    inputFormat: '<N:int> followed by N unit definitions: for Sand: "S <model>", for Membrane: "M <model> <pressure>". Then N integers representing run hours for each unit.',
    outputFormat: 'N directory lines, N throughput lines, station total output line.',
    starterCode: `#include <iostream>\nusing namespace std;\n\n// Write your complete solution here\n\nint main() {\n  return 0;\n}`,
    testCases: [
      {
        id: 'test-1',
        description: 'Visible: 1 Sand filter and 1 Membrane filter',
        input: '2 S SF-10 M UF-20 5 10 8',
        expectedOutput: '[4001] Model: SF-10 (Type: Sand)\n[4002] Model: UF-20 (Type: Membrane)\nUnit 4001 (SF-10): Throughput 120 kGal\nUnit 4002 (UF-20): Throughput 159 kGal\nTotal Daily Station Output: 279 kGal',
        isHidden: false
      },
      {
        id: 'test-2',
        description: 'Visible: Single Sand unit with zero run hours',
        input: '1 S Mini 0',
        expectedOutput: '[4001] Model: Mini (Type: Sand)\nUnit 4001 (Mini): Throughput 0 kGal\nTotal Daily Station Output: 0 kGal',
        isHidden: false
      },
      {
        id: 'test-3',
        description: 'Hidden: Two Membrane units with varied pressure ratings',
        input: '2 M Alpha 10 M Beta 2 5 10',
        expectedOutput: '[4001] Model: Alpha (Type: Membrane)\n[4002] Model: Beta (Type: Membrane)\nUnit 4001 (Alpha): Throughput 120 kGal\nUnit 4002 (Beta): Throughput 186 kGal\nTotal Daily Station Output: 306 kGal',
        isHidden: true
      },
      {
        id: 'test-4',
        description: 'Hidden: 3 mixed filtration units',
        input: '3 S S1 S S2 M M1 4 5 10 2',
        expectedOutput: '[4001] Model: S1 (Type: Sand)\n[4002] Model: S2 (Type: Sand)\n[4003] Model: M1 (Type: Membrane)\nUnit 4001 (S1): Throughput 60 kGal\nUnit 4002 (S2): Throughput 120 kGal\nUnit 4003 (M1): Throughput 48 kGal\nTotal Daily Station Output: 228 kGal',
        isHidden: true
      }
    ],
    expectedBehavior: 'Manages heterogeneous filtration units polymorphically with auto-generated serials and total throughput evaluation.',
    expectedDesignDecisions: [
      'Define base FilterUnit class with common attributes and pure virtual throughput and type methods',
      'Generate sequential registration serials automatically across instances',
      'Derive SandFilter and MembraneFilter implementing category-specific throughput logic',
      'Operate uniformly over base pointers and cleanly free dynamic instances'
    ],
    transferTarget: 'Evaluates transfer from media library lending fine calculations to public water purification filtration station dispatching.',
    hiddenTestStrength: 'STRONG',
    isBenchmark: true,
    isIndependent: true,
    hints: [
      'Establish a common base abstraction defining throughput calculation and identification methods.',
      'Derive concrete filtration types that implement their category-specific throughput formulas.',
      'Store instances via base pointers to iterate uniformly, compute total output, and deallocate all units.'
    ],
    solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass FilterUnit {\nprotected:\n  int serial;\n  string model;\npublic:\n  FilterUnit(int s, string m) : serial(s), model(m) {}\n  virtual ~FilterUnit() {}\n\n  int getSerial() const { return serial; }\n  string getModel() const { return model; }\n\n  virtual string getTypeName() const = 0;\n  virtual int calculateThroughput(int hours) const = 0;\n\n  void printDirectory() const {\n    cout << "[" << serial << "] Model: " << model << " (Type: " << getTypeName() << ")\\n";\n  }\n};\n\nclass SandFilter : public FilterUnit {\npublic:\n  SandFilter(int s, string m) : FilterUnit(s, m) {}\n  string getTypeName() const override { return "Sand"; }\n  int calculateThroughput(int hours) const override {\n    return hours * 12;\n  }\n};\n\nclass MembraneFilter : public FilterUnit {\nprivate:\n  int pressure;\npublic:\n  MembraneFilter(int s, string m, int p) : FilterUnit(s, m), pressure(p) {}\n  string getTypeName() const override { return "Membrane"; }\n  int calculateThroughput(int hours) const override {\n    return hours * 18 + pressure * 3;\n  }\n};\n\nint main() {\n  int n;\n  if (cin >> n && n > 0 && n <= 10) {\n    FilterUnit* units[10];\n    int nextSerial = 4001;\n\n    for (int i = 0; i < n; i++) {\n      char type;\n      string model;\n      cin >> type >> model;\n      if (type == 'S' || type == 's') {\n        units[i] = new SandFilter(nextSerial++, model);\n      } else {\n        int pressure;\n        cin >> pressure;\n        units[i] = new MembraneFilter(nextSerial++, model, pressure);\n      }\n      units[i]->printDirectory();\n    }\n\n    int totalOutput = 0;\n    for (int i = 0; i < n; i++) {\n      int hours;\n      cin >> hours;\n      int throughput = units[i]->calculateThroughput(hours);\n      totalOutput += throughput;\n      cout << "Unit " << units[i]->getSerial() << " (" << units[i]->getModel()\n           << "): Throughput " << throughput << " kGal\\n";\n    }\n\n    cout << "Total Daily Station Output: " << totalOutput << " kGal";\n\n    for (int i = 0; i < n; i++) {\n      delete units[i];\n    }\n  }\n  return 0;\n}`
  }
];

export const benchmarkBatteryMap = Object.fromEntries(
  benchmarkBattery.map(ex => [ex.id, ex])
);
