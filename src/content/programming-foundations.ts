import type { Concept } from '../types';

export const programmingFoundations: Concept[] = [
  {
    id: 'prog-variables-literals',
    field: 'programming',
    title: 'Variables and literals',
    summary: 'Names let a program reuse values; literals write values directly.',
    explanation: [
      'A variable is a name associated with a value during execution. Assignment establishes or updates that association. A literal is a value written directly in source code, such as a number or quoted text.',
      'Assignment is an action, not a mathematical claim that remains true forever. In languages that allow reassignment, a later assignment can make the same name refer to a different value.',
    ],
    example:
      'Python: score = 4 assigns the number literal 4 to score. After score = score + 1, score is 5.',
    takeaway: 'Read assignment as “evaluate the right side, then assign the result.”',
    sources: [
      {
        title: 'Python tutorial: an informal introduction',
        url: 'https://docs.python.org/3/tutorial/introduction.html',
      },
    ],
    questions: [
      ['What is a variable?', 'A name associated with a value during execution.'],
      ['What is a literal?', 'A value written directly in source code, such as 4 or "hello".'],
      ['What does assignment do?', 'Associates a variable with the result of an expression.'],
      ['After x = 3 followed by x = x + 2, what is x?', '5, in this assignment-style pseudocode.'],
      [
        'Does assigning b = a mean later reassignment of a must change b?',
        'No. Assignment does not establish a permanent link between the variable names.',
      ],
    ],
  },
  {
    id: 'prog-types',
    field: 'programming',
    title: 'Values and types',
    summary: 'Types describe which values and operations make sense.',
    explanation: [
      'A type classifies values and defines supported operations. Common types include integers for whole numbers, floating-point numbers for approximate numeric computation, strings for text, and Booleans for true or false.',
      'The text "12" and the number 12 are different values. Converting between types is an explicit or language-defined operation; a conversion can fail when the input has no valid interpretation.',
    ],
    example:
      'Python: int("12") produces 12, while int("twelve") raises an error. A string containing digits is still text until converted.',
    takeaway: 'Ask both what a value contains and what type it has.',
    sources: [
      {
        title: 'Python reference: objects, values and types',
        url: 'https://docs.python.org/3/reference/datamodel.html',
      },
      {
        title: 'Python tutorial: an informal introduction',
        url: 'https://docs.python.org/3/tutorial/introduction.html',
      },
    ],
    questions: [
      ['What does a type describe?', 'A category of values and the operations they support.'],
      ['Which type represents true or false?', 'A Boolean type.'],
      ['How does "12" differ from 12?', 'The first is text; the second is a number.'],
      ['What is type conversion?', 'Producing a value of one type from a value of another type.'],
      [
        'Must conversion from text to a number succeed?',
        'No; the text may not represent a valid number.',
      ],
    ],
  },
  {
    id: 'prog-expressions',
    field: 'programming',
    title: 'Expressions and operators',
    summary: 'Expressions compute values using operands and operations.',
    explanation: [
      'An expression is code evaluated to produce a value. An operator describes an operation, such as addition or comparison; its inputs are called operands. A statement performs an action, and can contain expressions.',
      'Operator precedence determines grouping when parentheses are absent. Parentheses make the intended grouping explicit. In many languages, = assigns a value while == compares values for equality.',
    ],
    example:
      'Python: 2 + 3 * 4 is 14, while (2 + 3) * 4 is 20. The expression 14 == 20 evaluates to False.',
    takeaway: 'Trace expressions by evaluating their grouped operations.',
    sources: [
      {
        title: 'Python tutorial: an informal introduction',
        url: 'https://docs.python.org/3/tutorial/introduction.html',
      },
    ],
    questions: [
      ['What is an expression?', 'Code evaluated to produce a value.'],
      ['What are the operands in 3 + 4?', '3 and 4.'],
      [
        'What does operator precedence determine?',
        'How operations group when parentheses do not specify the grouping.',
      ],
      ['What is 2 + 3 * 4 with multiplication before addition?', '14.'],
      ['In Python, how do = and == differ?', '= assigns; == compares for equality.'],
    ],
  },
  {
    id: 'prog-conditionals',
    field: 'programming',
    title: 'Conditional control flow',
    summary: 'A condition lets a program choose what to do.',
    explanation: [
      'A conditional executes different code according to a condition. An if branch runs when its condition is true; an optional else branch handles the alternative. A chain of else-if branches checks alternatives in order.',
      'Conditions often compare values. Boundary values matter: greater than and greater than or equal to make different decisions when the values are exactly equal.',
    ],
    example:
      'Pseudocode: if age >= 18 then show "adult" else show "minor". At age 18, the first branch runs.',
    takeaway: 'A conditional selects a path based on the current condition.',
    sources: [
      {
        title: 'Python tutorial: control flow and functions',
        url: 'https://docs.python.org/3/tutorial/controlflow.html',
      },
    ],
    questions: [
      ['What does a conditional do?', 'Selects which code to execute based on a condition.'],
      [
        'When does an else branch run?',
        'When the preceding if/else-if conditions in the chain are false.',
      ],
      ['For age >= 18, does age 18 satisfy the condition?', 'Yes.'],
      ['How does age > 18 treat age 18?', 'The condition is false.'],
      [
        'In one if/else-if/else chain, do all matching branches run?',
        'No; the first matching branch is selected.',
      ],
    ],
  },
  {
    id: 'prog-loops',
    field: 'programming',
    title: 'Loops and repetition',
    summary: 'Loops repeat work over items or while a condition holds.',
    explanation: [
      'A loop repeats a body of code. A for loop commonly visits items in a collection; a while loop repeats while its condition is true. The exact syntax and behavior depend on the language.',
      'A while loop needs a way to stop when termination is intended. A break exits the loop; a continue skips the rest of the current iteration. Counting mistakes often come from including or excluding an endpoint incorrectly.',
    ],
    example:
      'Python: for n in [1, 2, 3]: print(n) prints three numbers. A while loop whose condition starts false runs its body zero times.',
    takeaway: 'Track the starting state, each iteration, and the stopping rule.',
    sources: [
      {
        title: 'Python tutorial: control flow and functions',
        url: 'https://docs.python.org/3/tutorial/controlflow.html',
      },
      {
        title: 'Python tutorial: an informal introduction',
        url: 'https://docs.python.org/3/tutorial/introduction.html',
      },
    ],
    questions: [
      ['What is one loop iteration?', 'One execution of the loop body.'],
      ['What does a while loop check before running its body?', 'Whether its condition is true.'],
      ['Can a while loop execute zero times?', 'Yes, if its condition is false initially.'],
      ['What does break do inside a loop?', 'Exits the nearest enclosing loop.'],
      [
        'What does continue do inside a loop?',
        'Skips the remaining body for the current iteration and proceeds with the loop.',
      ],
    ],
  },
  {
    id: 'prog-functions',
    field: 'programming',
    title: 'Functions, parameters and returns',
    summary: 'Functions package reusable work behind a named call.',
    explanation: [
      'A function defines a piece of work that can be called. Parameters are names in its definition; arguments are the actual inputs supplied by a call. A return value passes a result back to the caller.',
      'Returning a value differs from displaying it. A caller can use a returned value in another calculation. A function can also cause side effects, such as printing text or changing shared data.',
    ],
    example:
      'Pseudocode: function double(n) { return n * 2 }. In double(5), n is the parameter, 5 is the argument, and 10 is the returned result.',
    takeaway: 'Separate a function’s inputs, returned result, and side effects.',
    sources: [
      {
        title: 'Python tutorial: control flow and functions',
        url: 'https://docs.python.org/3/tutorial/controlflow.html',
      },
    ],
    questions: [
      ['What is a function parameter?', 'An input name declared in a function definition.'],
      ['What is a function argument?', 'An actual input supplied in a function call.'],
      [
        'What does return do?',
        'Ends the current function call and supplies a result to its caller.',
      ],
      [
        'Is displaying a result the same as returning it?',
        'No. Displaying produces output; returning supplies a value to the caller.',
      ],
      [
        'What is a side effect?',
        'An observable effect beyond returning a value, such as changing shared data or printing.',
      ],
    ],
  },
  {
    id: 'prog-scope-lifetime',
    field: 'programming',
    title: 'Scope and lifetime',
    summary: 'Visibility of a name and existence of a value are different.',
    explanation: [
      'Scope is the region of code where a name can be used according to the language’s lookup rules. A local variable is associated with a limited context, such as a function call. A global variable is associated with a broader context, such as a module.',
      'Lifetime concerns how long a variable or object exists during execution. An object can outlive the function that created it if the caller keeps a reference. Matching names in different scopes need not refer to the same value.',
    ],
    example:
      'Python: a function creates a list and returns it. Its local name is no longer available to the caller, but the returned list remains available through the caller’s own name.',
    takeaway:
      'Scope asks “where can this name be used?”; lifetime asks “how long does this exist?”',
    sources: [
      {
        title: 'Python reference: execution model',
        url: 'https://docs.python.org/3/reference/executionmodel.html',
      },
      {
        title: 'Python reference: objects, values and types',
        url: 'https://docs.python.org/3/reference/datamodel.html',
      },
    ],
    questions: [
      [
        'What is scope?',
        'The region of code where a name can be used under the language’s lookup rules.',
      ],
      ['What does lifetime describe?', 'How long a variable or object exists during execution.'],
      [
        'Must two local variables with the same name in different functions be the same variable?',
        'No. They belong to separate local contexts.',
      ],
      [
        'Can a returned object outlive the function call that created it?',
        'Yes, if a reference to it is retained.',
      ],
      [
        'What is a global variable in a module-based context?',
        'A variable defined in the module’s broader scope rather than only inside a function.',
      ],
    ],
  },
  {
    id: 'prog-mutability',
    field: 'programming',
    title: 'Mutation and reassignment',
    summary: 'Changing an object differs from changing what a name refers to.',
    explanation: [
      'A mutable object can change after creation; an immutable object cannot be changed in place. Reassignment associates a variable with a different value. These operations are distinct even when both appear to update a program’s data.',
      'In Python, lists are mutable and strings are immutable. An operation that appears to edit a string instead produces another string. Other languages have their own mutability rules.',
    ],
    example:
      'Python: items = [1]; items.append(2) changes the existing list. text = "a"; text = text + "b" reassigns text to the result "ab".',
    takeaway: 'Distinguish changes to an object from changes to a variable’s association.',
    sources: [
      {
        title: 'Python reference: objects, values and types',
        url: 'https://docs.python.org/3/reference/datamodel.html',
      },
    ],
    questions: [
      ['What does mutable mean?', 'An object can be changed in place after creation.'],
      ['What does immutable mean?', 'An object cannot be changed in place after creation.'],
      ['What is reassignment?', 'Associating a variable with a different value.'],
      ['In Python, does list.append mutate the list?', 'Yes. It changes the existing list.'],
      [
        'Does reassigning a variable prove its old object was mutated?',
        'No. Reassignment and mutation are different operations.',
      ],
    ],
  },
  {
    id: 'prog-references',
    field: 'programming',
    title: 'References, aliases and copies',
    summary: 'Two names can refer to one object without making a copy.',
    explanation: [
      'A reference provides a way to access an object. Aliasing occurs when different names or locations refer to the same object. If that object is mutable, changes through one alias can be visible through another.',
      'Copying creates a separate object, but a shallow copy of a container can still share objects nested inside it. Assignment and copying rules vary by language, so establish which operation actually occurs.',
    ],
    example:
      'Python: a = [1]; b = a; b.append(2) leaves both names referring to [1, 2]. Using b = a.copy() instead creates a separate outer list.',
    takeaway:
      'Shared references share changes; a new variable name is not necessarily a new object.',
    sources: [
      {
        title: 'Python reference: objects, values and types',
        url: 'https://docs.python.org/3/reference/datamodel.html',
      },
      {
        title: 'Python tutorial: classes',
        url: 'https://docs.python.org/3/tutorial/classes.html',
      },
    ],
    questions: [
      ['What is aliasing?', 'Multiple names or locations referring to the same object.'],
      [
        'In Python, does b = a automatically copy a list?',
        'No. Both names refer to the same list.',
      ],
      [
        'If two aliases refer to a mutable list, can mutation through one be seen through the other?',
        'Yes. They access the same object.',
      ],
      [
        'What is a shallow copy of a container?',
        'A new outer container that retains references to the original contained objects.',
      ],
      [
        'Does equality of contents necessarily mean two references identify the same object?',
        'No. Separate objects can contain equal values.',
      ],
    ],
  },
  {
    id: 'prog-objects-classes',
    field: 'programming',
    title: 'Objects and classes',
    summary: 'Objects group state with behavior; classes describe kinds of objects.',
    explanation: [
      'An object groups data, called state, with operations, called methods. A class defines a kind of object and how its instances behave. Each instance can hold its own state.',
      'Object-oriented programming organizes work around such objects. Encapsulation keeps related state and behavior together and can restrict direct access to internal details. Classes are one tool for organization, not a requirement for every program.',
    ],
    example:
      'A Counter class might define a count value and an increment method. Two Counter instances can start at zero; incrementing one need not change the other.',
    takeaway: 'A class describes a kind; an instance is one particular object of that kind.',
    sources: [
      {
        title: 'Python tutorial: classes',
        url: 'https://docs.python.org/3/tutorial/classes.html',
      },
    ],
    questions: [
      ['What is an object’s state?', 'The data associated with that object.'],
      ['What is a method?', 'An operation associated with an object or class.'],
      ['What is a class instance?', 'A particular object created from a class.'],
      ['Must two instances have identical current state?', 'No. Each can hold its own state.'],
      [
        'What is encapsulation?',
        'Keeping related state and behavior together while controlling access to internal details.',
      ],
    ],
  },
  {
    id: 'prog-abstraction-interfaces',
    field: 'programming',
    title: 'Abstraction and interfaces',
    summary: 'Use a capability without knowing every implementation detail.',
    explanation: [
      'Abstraction presents the details needed for a task while leaving other details behind an interface. An interface describes how code can interact with a component, such as which operations it offers and what they mean.',
      'An implementation supplies the actual behavior. Different implementations can support the same interface, allowing a caller to use the shared operations. Some languages have a formal interface construct; the broader idea applies without one.',
    ],
    example:
      'A storage interface offers save(name, data) and load(name). One implementation uses files and another uses memory; callers can use the same operations if the promised behavior is preserved.',
    takeaway:
      'An interface states how to use a capability; an implementation determines how it works.',
    sources: [
      {
        title: 'Oracle Java tutorials: what is an interface?',
        url: 'https://docs.oracle.com/javase/tutorial/java/concepts/interface.html',
      },
    ],
    questions: [
      [
        'What is abstraction?',
        'Presenting relevant capabilities while hiding details unnecessary for the task.',
      ],
      [
        'What does an interface describe?',
        'How a caller can interact with a component and the behavior it promises.',
      ],
      ['What is an implementation?', 'The code that supplies the promised behavior.'],
      [
        'Can different implementations support one interface?',
        'Yes, if they satisfy its promised operations and behavior.',
      ],
      [
        'Does abstraction require a language keyword named interface?',
        'No. Functions and other boundaries can provide abstraction too.',
      ],
    ],
  },
  {
    id: 'prog-errors-exceptions',
    field: 'programming',
    title: 'Errors and exceptions',
    summary: 'Invalid code, failed operations and wrong results differ.',
    explanation: [
      'A syntax error means code does not follow the language’s grammar. A runtime error occurs during execution. An exception is a mechanism for signaling a problem and transferring control to a suitable handler.',
      'A logic error can produce an incorrect answer without any exception. Handle expected failures deliberately and preserve useful error information; merely suppressing an exception does not repair its cause.',
    ],
    example:
      'Python: dividing by zero raises ZeroDivisionError. A try/except handler can respond. Adding two prices when the task required subtracting them can produce a wrong answer without raising anything.',
    takeaway: 'A program can run successfully and still compute the wrong thing.',
    sources: [
      {
        title: 'Python tutorial: errors and exceptions',
        url: 'https://docs.python.org/3/tutorial/errors.html',
      },
    ],
    questions: [
      ['What is a syntax error?', 'Code that violates the language’s grammar.'],
      ['When does a runtime error occur?', 'During program execution.'],
      [
        'What is an exception handler for?',
        'Responding to a signaled exception in a controlled way.',
      ],
      [
        'Can a logic error occur without an exception?',
        'Yes. The program may run and return an incorrect result.',
      ],
      [
        'Does catching an exception automatically fix the underlying problem?',
        'No. The handler must choose an appropriate response.',
      ],
    ],
  },
  {
    id: 'eng-requirements',
    field: 'engineering',
    title: 'Requirements and acceptance criteria',
    summary: 'Describe the needed behavior before judging a solution.',
    explanation: [
      'A requirement states a need or constraint that software must satisfy. Functional requirements describe behavior; quality requirements describe properties such as performance or accessibility. Clear requirements help people agree on the problem.',
      'Acceptance criteria make a requirement concrete enough to assess. They specify observable outcomes and relevant conditions. An implementation choice, such as a particular library, is not automatically a user requirement.',
    ],
    example:
      'Requirement: users can export their notes. Acceptance criterion: exporting two saved notes produces a file containing both notes and their titles.',
    takeaway: 'A useful requirement explains an observable need or constraint.',
    sources: [
      {
        title: 'SWEBOK: software requirements',
        url: 'https://swebokwiki.org/Chapter_1:_Software_Requirements',
      },
    ],
    questions: [
      ['What is a software requirement?', 'A need or constraint that the software must satisfy.'],
      ['What does a functional requirement describe?', 'Behavior the software must provide.'],
      [
        'What can a quality requirement describe?',
        'A property such as performance, reliability or accessibility.',
      ],
      [
        'What are acceptance criteria?',
        'Concrete conditions used to assess whether a requirement is satisfied.',
      ],
      [
        'Why is “the app should be fast” hard to verify?',
        'It lacks a measurable response time and the conditions under which to measure it.',
      ],
    ],
  },
  {
    id: 'eng-testing-levels',
    field: 'engineering',
    title: 'Testing at different levels',
    summary: 'Check small units, connections and whole systems.',
    explanation: [
      'A test exercises software and compares observed behavior with an expectation. A unit test focuses on a small component. An integration test checks components working together. A system test examines the integrated system.',
      'Acceptance tests assess whether agreed needs are met. These categories describe different scopes and purposes; no one level replaces all the others. Passing selected tests provides evidence, but does not prove the absence of every defect.',
    ],
    example:
      'For a notes app: test title validation alone, then saving through the storage component, then the full create-and-reopen flow. Each check can expose a different kind of failure.',
    takeaway: 'Choose test scope according to the behavior and connections being checked.',
    sources: [
      {
        title: 'SWEBOK: software testing',
        url: 'https://swebokwiki.org/Chapter_4:_Software_Testing',
      },
    ],
    questions: [
      ['What does a unit test focus on?', 'A small component, often tested in isolation.'],
      ['What does an integration test check?', 'Whether components work together correctly.'],
      ['What does a system test examine?', 'The behavior of the integrated system.'],
      [
        'What is the purpose of acceptance testing?',
        'Assessing whether the software meets agreed user or stakeholder needs.',
      ],
      [
        'Do passing tests prove a program has no defects?',
        'No. Tests check selected cases and conditions.',
      ],
    ],
  },
  {
    id: 'eng-assertions-boundaries',
    field: 'engineering',
    title: 'Assertions and test cases',
    summary: 'State expectations explicitly and test the edges.',
    explanation: [
      'An assertion checks that a condition holds at a particular point. In a test, it can compare an actual result with the expected result. A test case needs a setup, an action or input, and an observable expectation.',
      'Choose cases that could expose mistakes: ordinary inputs, boundaries, empty inputs and invalid inputs where relevant. Assertions intended for development are not a substitute for validating untrusted input; some runtimes can disable them.',
      'A basic function contract states a precondition, which the caller must satisfy, and a postcondition, which the function promises on successful completion when its preconditions hold.',
    ],
    example:
      'For a function accepting ages 0 through 120, test 0 and 120 as valid, and -1 and 121 as invalid. An assertion can check that the result matches each expectation.',
    takeaway: 'A test needs an expectation that can distinguish correct behavior from failure.',
    sources: [
      {
        title: 'Software Carpentry: defensive programming',
        url: 'https://swcarpentry.github.io/python-novice-inflammation/10-defensive.html',
      },
      {
        title: 'SWEBOK: software testing',
        url: 'https://swebokwiki.org/Chapter_4:_Software_Testing',
      },
    ],
    questions: [
      ['What does an assertion check?', 'That a stated condition is true at a particular point.'],
      [
        'What is a test’s expected result?',
        'The outcome that should occur for its specified setup and input.',
      ],
      [
        'Why test a boundary value?',
        'Mistakes often occur where a rule changes from accepting to rejecting a value.',
      ],
      ['For an inclusive range 0 to 120, is 120 valid?', 'Yes. Inclusive endpoints are accepted.'],
      [
        'Why should development assertions not replace input validation?',
        'They may be disabled and are intended to check programming assumptions rather than enforce all input rules.',
      ],
      [
        'What is a function precondition?',
        'A condition the caller must satisfy before the function runs.',
      ],
      [
        'What is a function postcondition?',
        'A condition the function promises on successful completion when its preconditions hold.',
      ],
    ],
  },
  {
    id: 'eng-debugging',
    field: 'engineering',
    title: 'Systematic debugging',
    summary: 'Use evidence to find why actual behavior differs from expected behavior.',
    explanation: [
      'Debugging investigates the cause of an observed failure and corrects it. Start with the expected outcome and a reproducible case. Reduce the case when possible so fewer details can explain the failure.',
      'Inspect intermediate values using logs or a debugger. A breakpoint pauses execution at a chosen point so you can inspect program state. Form a hypothesis, change one relevant thing, and check the result. A regression test preserves the failing case so a later change is less likely to reintroduce the defect.',
    ],
    example:
      'A total is one item too small. Reproduce it with a two-item list, inspect the loop bounds, fix the skipped final item, and keep a test that expects both items in the total.',
    takeaway: 'Reproduce, investigate, change with a reason, then verify.',
    sources: [
      {
        title: 'Software Carpentry: debugging',
        url: 'https://swcarpentry.github.io/python-novice-inflammation/11-debugging.html',
      },
      {
        title: 'Python documentation: the debugger',
        url: 'https://docs.python.org/3/library/pdb.html',
      },
    ],
    questions: [
      ['What is debugging?', 'Investigating and correcting the cause of a software failure.'],
      [
        'Why reproduce a failure reliably?',
        'It allows hypotheses and fixes to be checked against the same behavior.',
      ],
      [
        'Why reduce a failing example?',
        'A smaller case removes distractions and makes possible causes easier to isolate.',
      ],
      [
        'What does a debugger breakpoint do?',
        'Pauses execution at a chosen point so program state can be inspected.',
      ],
      [
        'What is a regression test?',
        'A test that guards previously working or repaired behavior against breaking again.',
      ],
    ],
  },
  {
    id: 'eng-version-control',
    field: 'engineering',
    title: 'Version control and Git',
    summary: 'Record changes so work can be compared and recovered.',
    explanation: [
      'Version control records changes to files over time. A repository holds project history. In Git, a commit records a snapshot with metadata and a message; editing a file alone does not create a commit.',
      'The staging area selects content for the next commit. A branch lets work develop along a line of history. Merging combines histories and may require resolving conflicting edits. Git works locally; a hosting service is a separate collaboration tool.',
    ],
    example:
      'Edit a note, inspect its diff, stage the intended edit, then commit it with a descriptive message. The commit records that selected state even if you keep editing afterward.',
    takeaway: 'A commit is a deliberate saved point in version history.',
    sources: [
      {
        title: 'Pro Git: what is Git?',
        url: 'https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F',
      },
      {
        title: 'Pro Git: branches in a nutshell',
        url: 'https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell',
      },
    ],
    questions: [
      ['What is version control for?', 'Recording and managing changes to files over time.'],
      ['What does a Git commit record?', 'A project snapshot with metadata and a message.'],
      ['What is the staging area for?', 'Selecting the content to include in the next commit.'],
      ['What does a branch provide?', 'A line of development within repository history.'],
      [
        'Does committing locally automatically upload changes to a hosting service?',
        'No. Sharing with a remote repository is a separate operation.',
      ],
    ],
  },
  {
    id: 'eng-builds-dependencies',
    field: 'engineering',
    title: 'Builds and dependencies',
    summary: 'Turn source files and required components into usable software.',
    explanation: [
      'A build runs steps that prepare software for use, such as compiling source code, linking libraries or packaging assets. Its outputs are often called artifacts. A successful build establishes that those steps completed, not that every behavior is correct.',
      'A dependency is another component a project relies on. A package manager helps obtain and manage packaged dependencies. Versions matter because changes in a dependency can affect compatibility; dependency information should make the required environment clear.',
    ],
    example:
      'A small application uses a date library. Its build compiles its source and includes required assets. Installing a different date-library version can change whether the source builds or how dates are handled.',
    takeaway: 'Builds prepare outputs; dependencies supply components those outputs rely on.',
    sources: [
      {
        title: 'CMake tutorial: getting started',
        url: 'https://cmake.org/cmake/help/latest/guide/tutorial/Getting%20Started%20with%20CMake.html',
      },
      {
        title: 'Python Packaging User Guide: installing packages',
        url: 'https://packaging.python.org/en/latest/tutorials/installing-packages/',
      },
    ],
    questions: [
      [
        'What is a software build?',
        'A process that prepares usable software outputs from source and other inputs.',
      ],
      [
        'What is a build artifact?',
        'An output produced by a build, such as an executable or packaged files.',
      ],
      ['What is a dependency?', 'A component that another component or project relies on.'],
      [
        'What does a package manager help manage?',
        'Obtaining, installing and tracking packaged software dependencies.',
      ],
      [
        'Does a successful build prove all application behavior is correct?',
        'No. Behavioral verification requires appropriate testing too.',
      ],
    ],
  },
  {
    id: 'sec-cia',
    field: 'security',
    title: 'Confidentiality, integrity and availability',
    summary: 'Security protects access, correctness and usability of information.',
    explanation: [
      'Confidentiality means restricting disclosure to authorized parties. Integrity means protecting information against improper modification or destruction. Availability means authorized users can access information and services when needed.',
      'These goals address different failures. A system can preserve secrecy while losing availability, or stay online while serving tampered information. Security considers the information, intended users and possible threats together.',
    ],
    example:
      'For a class gradebook, confidentiality keeps grades private, integrity prevents unauthorized grade changes, and availability lets permitted teachers access it when required.',
    takeaway: 'Ask who can read, who can change, and whether legitimate use remains possible.',
    sources: [
      {
        title: 'NIST glossary: information security',
        url: 'https://csrc.nist.gov/glossary/term/information_security',
      },
    ],
    questions: [
      ['What does confidentiality protect?', 'Information against unauthorized disclosure.'],
      ['What does integrity protect?', 'Information against improper modification or destruction.'],
      ['What does availability protect?', 'Timely, reliable access for authorized users.'],
      ['Which goal is harmed by an unauthorized grade change?', 'Integrity.'],
      ['Which goal is harmed when authorized users cannot reach a service?', 'Availability.'],
    ],
  },
  {
    id: 'sec-authentication-authorization',
    field: 'security',
    title: 'Authentication and authorization',
    summary: 'Establish identity, then decide which actions are allowed.',
    explanation: [
      'Authentication checks a claimed identity, such as verifying login credentials. Authorization decides whether an identity is permitted to perform a particular action on a particular resource.',
      'Being signed in does not imply permission to read every record. Permission checks must run where protected access is enforced, rather than relying only on which buttons the interface shows. Multifactor authentication combines independent factor categories, such as something you know (a password) and something you have (a security key), for stronger evidence of identity.',
    ],
    example:
      'A student signs in successfully but cannot edit another student’s grade. The login is authentication; the rule denying that edit is authorization.',
    takeaway: 'Knowing who someone is does not decide everything they may do.',
    sources: [
      {
        title: 'OWASP: authentication',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
      },
      {
        title: 'OWASP: authorization',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html',
      },
    ],
    questions: [
      ['What is authentication?', 'Checking a claimed identity.'],
      [
        'What is authorization?',
        'Deciding whether an identity may perform an action on a resource.',
      ],
      [
        'Does successful login imply access to every user’s records?',
        'No. Authorization must still restrict access.',
      ],
      [
        'Is hiding an edit button sufficient protection for a protected action?',
        'No. The component enforcing access must check permission.',
      ],
      [
        'What is multifactor authentication?',
        'Authentication using evidence from more than one independent factor category, such as a password and a security key.',
      ],
    ],
  },
  {
    id: 'sec-password-hashing',
    field: 'security',
    title: 'Passwords, hashing and encryption',
    summary: 'Password verification needs a one-way check, not recoverable plaintext.',
    explanation: [
      'Encryption transforms data so it can be recovered using the appropriate key. A cryptographic hash produces a digest and is designed to resist recovering the input. Password storage uses a purpose-built, deliberately expensive password-hashing algorithm.',
      'A salt is a unique random value used with a password before hashing. It prevents identical passwords from automatically having identical stored results and undermines precomputed lookup tables. Hashing does not make weak passwords impossible to guess.',
    ],
    example:
      'At signup, store a salt and a password hash rather than the password. At login, run the password-hashing algorithm with the supplied password and stored parameters, then verify the result.',
    takeaway:
      'Encrypt data that must be recovered; use suitable password hashing for password verification.',
    sources: [
      {
        title: 'OWASP: password storage',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html',
      },
    ],
    questions: [
      [
        'What distinguishes encryption from hashing?',
        'Encryption is reversible with a key; cryptographic hashing is designed to be one-way.',
      ],
      [
        'Should an application store account passwords as plaintext?',
        'No. Store suitable salted password hashes.',
      ],
      ['What is a password salt?', 'A unique random value used when hashing a password.'],
      [
        'Why use a deliberately expensive password-hashing algorithm?',
        'To increase the cost of guessing many candidate passwords.',
      ],
      [
        'Does hashing prevent an attacker from guessing a weak password?',
        'No. Candidates can still be tried and checked.',
      ],
    ],
  },
  {
    id: 'sec-input-validation',
    field: 'security',
    title: 'Input validation and trust boundaries',
    summary: 'Check outside data before relying on it.',
    explanation: [
      'Input validation checks whether data has an acceptable form and meaning for its intended use. Syntax checks examine structure; semantic checks examine meaning, such as whether an end date follows a start date.',
      'A trust boundary separates parts of a system with different trust assumptions. Data crossing it needs appropriate checks even if an interface already checked it. Prefer explicit allowed forms and limits. Validation is one defense and does not replace permission checks or safe query construction.',
    ],
    example:
      'A booking form accepts an integer guest count from 1 to 8. The receiving component rejects text, zero and oversized values even if the browser also checks the field.',
    takeaway: 'Validate data at the boundary where the application starts to rely on it.',
    sources: [
      {
        title: 'OWASP: input validation',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html',
      },
    ],
    questions: [
      [
        'What is input validation?',
        'Checking that data has an acceptable structure and meaning for its use.',
      ],
      [
        'What is a semantic validation check?',
        'A check of meaning, such as ensuring an end date is after a start date.',
      ],
      [
        'What is a trust boundary?',
        'A boundary between components or contexts with different trust assumptions.',
      ],
      [
        'Why repeat important validation beyond a browser form?',
        'A caller can bypass or alter browser-side checks.',
      ],
      [
        'Does valid input automatically mean its sender has permission to act?',
        'No. Authorization is a separate check.',
      ],
    ],
  },
  {
    id: 'sec-injection',
    field: 'security',
    title: 'Injection and separating data from commands',
    summary: 'Untrusted text must not become executable instructions.',
    explanation: [
      'Injection happens when untrusted input changes the meaning of a command or query. Concatenating input into SQL query text can allow data to be interpreted as SQL instructions.',
      'Parameterized queries keep the query structure separate from its data values. Use the supported parameter mechanism instead of constructing SQL by joining strings. Input validation remains useful, but does not by itself provide this separation.',
    ],
    example:
      'A search query uses SELECT * FROM books WHERE title = ? and supplies the title as a separate parameter. The parameter is a value, even if it contains quote characters.',
    takeaway: 'Use an interface that keeps untrusted values separate from executable structure.',
    sources: [
      {
        title: 'OWASP: SQL injection prevention',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html',
      },
      {
        title: 'OWASP: input validation',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html',
      },
    ],
    questions: [
      [
        'What is injection?',
        'Untrusted input changing the meaning of an executed command or query.',
      ],
      [
        'Why can joining user input into SQL text be dangerous?',
        'The input can be interpreted as query instructions rather than only data.',
      ],
      [
        'What does a parameterized query separate?',
        'The fixed query structure from supplied data values.',
      ],
      [
        'Should a quote in a book title be treated as a SQL instruction?',
        'No. It belongs to the title data.',
      ],
      [
        'Is input validation alone the main defense against SQL injection?',
        'No. Use parameterized queries to separate values from SQL structure.',
      ],
    ],
  },
  {
    id: 'sec-least-privilege-secrets',
    field: 'security',
    title: 'Least privilege and secrets',
    summary: 'Give each component only the access it needs and protect credentials.',
    explanation: [
      'Least privilege means granting only permissions needed for a task. Denying access unless it is explicitly allowed reduces accidental exposure and limits the damage from a compromised account or component.',
      'A secret is sensitive data that grants access, such as an API key or private key. Keep secrets out of public source, logs and distributed client code. If a secret is exposed, revoke or rotate it; deleting one visible copy does not undo the exposure.',
    ],
    example:
      'A report reader receives read access to reports, not permission to delete all files. A private service key is kept in protected configuration rather than bundled into downloadable browser JavaScript.',
    takeaway: 'Limit access and treat exposed credentials as compromised.',
    sources: [
      {
        title: 'OWASP: authorization',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html',
      },
      {
        title: 'OWASP: secrets management',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html',
      },
    ],
    questions: [
      ['What is least privilege?', 'Granting only the permissions needed for the intended task.'],
      ['What does deny by default mean?', 'Reject access unless an explicit rule allows it.'],
      [
        'What is an example of a software secret?',
        'An API key, password or private cryptographic key that grants access.',
      ],
      [
        'Can a private key remain secret if shipped inside downloadable browser code?',
        'No. Users can inspect code and data delivered to their browser.',
      ],
      [
        'What should happen to an exposed credential?',
        'Revoke or rotate it and update legitimate users of the credential.',
      ],
    ],
  },
];
