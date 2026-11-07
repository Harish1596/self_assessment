import type { Concept } from '../types';

const organisation = {
  title: 'OpenStax · Computer Systems Organization',
  url: 'https://openstax.org/books/introduction-computer-science/pages/5-1-computer-systems-organization',
};
const memory = {
  title: 'OpenStax · Memory Hierarchy',
  url: 'https://openstax.org/books/introduction-computer-science/pages/5-5-memory-hierarchy',
};
const truthTables = {
  title: 'OpenStax · Constructing Truth Tables',
  url: 'https://openstax.org/books/contemporary-mathematics/pages/2-3-constructing-truth-tables',
};
const counting = {
  title: 'University of Waterloo CEMC · Counting and Probability',
  url: 'https://cemc.uwaterloo.ca/sites/default/files/documents/2024/CountingProbability.html',
};

// Original introductory notes; references support the ideas, not copied wording.
export const computerFoundations: Concept[] = [
  {
    id: 'computer-model',
    field: 'computing',
    title: 'What a computer does',
    summary: 'Connect input, stored data, instructions and output.',
    explanation: [
      'A computer is a machine that processes data by following instructions. Data is information represented in a form the machine can work with, such as numbers, text or a digital picture. A program supplies instructions that tell the machine what operations to perform.',
      'Input brings data into a computation, processing changes or examines it, and output makes a result available. Memory holds information while work takes place; storage can keep it for later. The same general machine can do different jobs when given different programs. Computers also appear inside phones, cars and appliances.',
    ],
    example:
      'A calculator receives 7, + and 5 as input. Its program tells it to add the numbers. It keeps intermediate values in memory and shows 12 as output.',
    takeaway: 'A computer follows programs to transform represented data into results.',
    sources: [organisation],
    questions: [
      ['What is a computer program?', 'A set of instructions that a computer can follow.'],
      ['What is input in a computation?', 'Data supplied to the computation.'],
      ['What is output in a computation?', 'A result made available by the computation.'],
      [
        'What lets one general-purpose computer perform different jobs?',
        'Running different programs.',
      ],
      [
        'Is a digital photograph data?',
        'Yes. It is information represented in a form a computer can process.',
      ],
      [
        'What is a computer?',
        'A machine that processes represented data by following instructions.',
      ],
      [
        'What is data in computing?',
        'Information represented in a form a computer can store or process.',
      ],
    ],
  },
  {
    id: 'computer-hardware-software',
    field: 'computing',
    title: 'Hardware & software',
    summary: 'Distinguish physical equipment from the programs it runs.',
    explanation: [
      'Hardware is the physical equipment in a computing system: chips, memory, a screen or a keyboard. Software is the programs that direct that equipment. A document is data used by software; the editor that opens it is a program.',
      'Application software helps people perform tasks, such as writing notes or playing music. System software, including an operating system, manages hardware and provides services that applications use. Software still depends on hardware to execute its instructions; installing an application does not add physical memory or a new processor.',
    ],
    example:
      'When you type a note, the keyboard and display are hardware. The note editor is application software. The operating system handles services such as receiving keystrokes and saving the file.',
    takeaway: 'Hardware is equipment; software supplies instructions for using it.',
    sources: [organisation],
    questions: [
      ['Is a keyboard hardware or software?', 'Hardware: it is a physical device.'],
      ['Is a web browser hardware or software?', 'Software: it is an application program.'],
      ['What is application software for?', 'Performing tasks for users.'],
      ['What is the operating system an example of?', 'System software.'],
      [
        'Does installing software physically increase RAM capacity?',
        'No. RAM capacity depends on installed memory hardware.',
      ],
      ['What is hardware?', 'The physical equipment in a computing system.'],
      ['What is software?', 'Programs that direct a computer’s hardware.'],
    ],
  },
  {
    id: 'computer-cpu-instructions',
    field: 'computing',
    title: 'CPU & the instruction cycle',
    summary: 'Follow how a processor fetches, decodes and executes instructions.',
    explanation: [
      'The central processing unit, or CPU, executes machine instructions. An instruction specifies a small operation, such as adding values, loading data or jumping to another instruction. The arithmetic logic unit (ALU) performs arithmetic and logical operations. Registers hold small amounts of data inside the processor.',
      'A useful basic model is fetch, decode, execute: obtain an instruction from memory, determine the requested operation, then carry it out. The program counter tracks the instruction location used to continue execution. A jump changes that flow. Modern processors overlap work, but this model still explains what instructions accomplish.',
    ],
    example:
      'A tiny program loads 4 and 6 into registers, adds them, then stores 10 in memory. Each load, addition and store is an instruction rather than the entire program being one operation.',
    takeaway: 'Programs become sequences of small instructions executed by the CPU.',
    sources: [organisation],
    questions: [
      ['What does CPU stand for?', 'Central processing unit.'],
      ['What are the three stages of the basic instruction cycle?', 'Fetch, decode and execute.'],
      ['What does decoding an instruction determine?', 'Which operation the instruction requests.'],
      ['What is a CPU register?', 'A small storage location inside the processor.'],
      ['What does the arithmetic logic unit do?', 'Arithmetic and logical operations.'],
      [
        'What does a jump instruction change?',
        'Where execution continues in the instruction sequence.',
      ],
      ['What does the CPU do?', 'Executes machine instructions.'],
    ],
  },
  {
    id: 'computer-ram-storage',
    field: 'computing',
    title: 'RAM & persistent storage',
    summary: 'Separate working memory from information kept after power is lost.',
    explanation: [
      'Random access memory (RAM) is working memory used to hold instructions and data during execution. Ordinary main RAM is volatile: it needs power to retain its contents. Persistent storage, such as an SSD, retains saved information when the computer is switched off.',
      'Opening a saved document brings data into working memory so a program can use it. Editing changes the working copy; saving writes changes to persistent storage. Applications may save automatically, but merely displaying an edit does not guarantee it has been saved. More storage capacity and more RAM solve different capacity needs.',
    ],
    example:
      'A laptop has 16 GB of RAM and a 512 GB SSD. A large photo collection can fit on the SSD even though the whole collection cannot fit in RAM at once.',
    takeaway: 'RAM supports current work; persistent storage retains saved work.',
    sources: [
      memory,
      {
        title: 'The Open University · Introducing ICT systems: Memory',
        url: 'https://www.open.edu/openlearn/mod/oucontent/view.php?id=2851&section=11.3',
      },
    ],
    questions: [
      ['What does volatile memory lose when power is removed?', 'Its stored contents.'],
      ['Is ordinary main RAM volatile?', 'Yes.'],
      ['Does an SSD normally retain saved data without power?', 'Yes. It is persistent storage.'],
      ['What does saving an edited document do?', 'Writes its changes to persistent storage.'],
      ['Does more SSD capacity mean more RAM capacity?', 'No. They are separate resources.'],
      ['What does RAM stand for?', 'Random access memory.'],
      ['What is main RAM used for?', 'Holding instructions and data while programs run.'],
    ],
  },
  {
    id: 'computer-memory-hierarchy',
    field: 'computing',
    title: 'Registers, caches & memory',
    summary: 'Understand why computers use several layers of storage.',
    explanation: [
      'A memory hierarchy combines small, fast storage with larger, slower storage. CPU registers hold values used directly by instructions. CPU caches keep copies of selected instructions and data near the processor. Main RAM usually holds much more, while an SSD or disk offers still greater persistent capacity.',
      'A cache hit means requested information is available in the cache; a miss means it must be obtained from another level. Reusing recently accessed information is temporal locality. Accessing nearby locations is spatial locality. Both patterns help explain why keeping useful copies close to the processor can reduce waiting.',
    ],
    example:
      'A program reads adjacent values in an array. A cache may fetch a block containing several values, allowing later reads of nearby values to use the cached copy.',
    takeaway: 'The hierarchy trades capacity against access time and cost.',
    sources: [memory],
    questions: [
      [
        'What is the purpose of a CPU cache?',
        'To keep useful copies of instructions or data close to the processor.',
      ],
      ['What is a cache hit?', 'The requested information is found in the cache.'],
      ['What is a cache miss?', 'The requested information is absent from the cache.'],
      ['What is temporal locality?', 'A tendency to reuse recently accessed information.'],
      ['What is spatial locality?', 'A tendency to access locations near ones recently accessed.'],
    ],
  },
  {
    id: 'computer-input-output',
    field: 'computing',
    title: 'Input, output & interconnects',
    summary: 'See how devices exchange information with a computer.',
    explanation: [
      'Input/output, shortened to I/O, is communication between a computer and devices or the outside world. A keyboard supplies input; a display presents output. Some devices do both: a touchscreen displays information and receives touches. The direction is described from the computer’s point of view.',
      'Components need connections to exchange information. A bus or other interconnect carries transfers between parts such as the processor, memory and device controllers. Controllers coordinate device operations. The transfer rate of a connection can limit how quickly data moves, even when the processor could work faster.',
    ],
    example:
      'Recording speech uses a microphone as input and writes the recording to storage. Playing it later reads the stored data and sends output to a speaker.',
    takeaway: 'I/O moves information across device boundaries; interconnects carry the transfers.',
    sources: [
      {
        title: 'The Open University · A bus for I/O',
        url: 'https://www.open.edu/openlearn/mod/oucontent/view.php?id=112559&section=_unit3.6',
      },
      organisation,
    ],
    questions: [
      ['What does I/O stand for?', 'Input/output.'],
      ['Is a microphone used for input or output when recording sound?', 'Input.'],
      ['Is a speaker used for input or output when playing sound?', 'Output.'],
      ['Can one device provide both input and output?', 'Yes. A touchscreen is one example.'],
      [
        'What does a bus or interconnect carry between components?',
        'Information transfers, including data.',
      ],
    ],
  },
  {
    id: 'computer-files-paths',
    field: 'computing',
    title: 'Files, directories & paths',
    summary: 'Locate saved information using a file-system hierarchy.',
    explanation: [
      'A file is a named unit of stored information. A directory, also called a folder, organizes entries for files and other directories. A file system manages this organization. A path describes how to locate an entry through that hierarchy.',
      'An absolute path starts from a file-system root. A relative path starts from a chosen location, commonly the current working directory. On Unix-like systems, / separates path components, . means the current directory and .. means the parent directory. A file name can appear in different directories, so its name alone may not identify its location.',
    ],
    example:
      'With /home/lee as the working directory, notes/topic.txt refers to /home/lee/notes/topic.txt. From /home/lee/notes, ../photo.png refers to /home/lee/photo.png.',
    takeaway: 'Interpreting a relative path requires knowing its starting directory.',
    sources: [
      {
        title: 'Software Carpentry · Navigating Files and Directories',
        url: 'https://swcarpentry.github.io/shell-novice/02-filedir.html',
      },
    ],
    questions: [
      ['What is another name for a directory?', 'A folder.'],
      ['Where does an absolute path start?', 'At a file-system root.'],
      [
        'What starting point does a relative path require?',
        'A base directory, often the current working directory.',
      ],
      ['What does .. mean in a Unix-like path?', 'The parent directory.'],
      [
        'Can two files in different directories have the same name?',
        'Yes. Their paths distinguish their locations.',
      ],
      ['What is a file?', 'A named unit of stored information.'],
      ['What does a directory organise?', 'Entries for files and other directories.'],
    ],
  },
  {
    id: 'computer-source-execution',
    field: 'computing',
    title: 'Source code, compilers & interpreters',
    summary: 'Distinguish a written program from the instructions a CPU executes.',
    explanation: [
      'Source code expresses a program in a programming language people can read and edit. Machine code encodes instructions for a particular processor architecture. A compiler translates a program into another representation, often machine code or an intermediate form. Compiling successfully does not prove the program gives the intended answers.',
      'An interpreter carries out a program through another running program. Compilation and interpretation can work together: a system may compile source to intermediate bytecode, then interpret that bytecode. Bytecode is not automatically the native machine code of the CPU. The CPU ultimately executes machine instructions, including those of the interpreter.',
    ],
    example:
      'A C toolchain can turn hello.c into a native executable. A Python implementation can first compile hello.py into bytecode and then execute it with an interpreter.',
    takeaway:
      'Translation and execution are different steps, and systems can combine their approaches.',
    sources: [
      {
        title: 'Harvard CS50 · Compiling',
        url: 'https://cs50.harvard.edu/x/notes/2/',
      },
      {
        title: 'Python documentation · Glossary: bytecode and interpreted',
        url: 'https://docs.python.org/3/glossary.html',
      },
    ],
    questions: [
      [
        'What is source code?',
        'A program expressed in a programming language for people to read and edit.',
      ],
      ['What is machine code?', 'Encoded instructions for a particular processor architecture.'],
      ['What does a compiler do?', 'Translates a program into another representation.'],
      [
        'Can compilation and interpretation be used in the same system?',
        'Yes, such as compiling to bytecode and then interpreting it.',
      ],
      [
        'Does successful compilation prove that a program is correct?',
        'No. It can still produce wrong results.',
      ],
    ],
  },
  {
    id: 'logic-boolean',
    field: 'logic',
    title: 'Boolean values & operations',
    summary: 'Reason with true, false, AND, OR and NOT.',
    explanation: [
      'A Boolean value is either true or false. A proposition is a statement that has one of these truth values, such as “5 is greater than 2.” Boolean operations combine or change truth values. AND is true only when both inputs are true; inclusive OR is true when at least one input is true.',
      'NOT reverses a truth value. Parentheses make grouping explicit when an expression contains several operations. These rules describe truth values; programming languages may add details such as converting other values to Booleans or skipping evaluation of an unnecessary operand.',
    ],
    example:
      'Let P be “a file exists” and Q be “it is readable.” P AND Q requires both facts. P OR Q permits either or both. NOT P means the file does not exist.',
    takeaway: 'Inclusive OR permits both inputs to be true; AND requires both.',
    sources: [truthTables],
    questions: [
      ['What are the two Boolean truth values?', 'True and false.'],
      ['When is P AND Q true?', 'When both P and Q are true.'],
      ['When is inclusive P OR Q false?', 'Only when both P and Q are false.'],
      ['What is NOT true?', 'False.'],
      ['What is true AND false?', 'False.'],
    ],
  },
  {
    id: 'logic-gates-tables',
    field: 'logic',
    title: 'Logic gates & truth tables',
    summary: 'Connect Boolean rules to digital circuits and exhaustive input cases.',
    explanation: [
      'A logic gate is a circuit that implements a Boolean operation. Digital circuits represent two logical states using electrical signal ranges, conventionally labelled 0 and 1. A truth table lists the output for every combination of input states, making the gate’s behaviour explicit.',
      'For two inputs there are four combinations: 00, 01, 10 and 11. XOR outputs 1 when the two inputs differ. NAND reverses the output of AND. Gates can be connected so that one output becomes another input, allowing simple operations to form larger circuits.',
    ],
    example:
      'For inputs 00, 01, 10, 11:\nAND gives 0, 0, 0, 1.\nXOR gives 0, 1, 1, 0.\nNAND gives 1, 1, 1, 0.',
    takeaway: 'A truth table specifies all input/output cases, rather than a few examples.',
    sources: [
      {
        title: 'New Jersey Institute of Technology · Logic Gates and Logic Families',
        url: 'https://ecelabs.njit.edu/ece394/lab1.php',
      },
    ],
    questions: [
      ['What does a logic gate implement?', 'A Boolean operation in a circuit.'],
      [
        'What does a truth table list?',
        'The output for every possible combination of input states.',
      ],
      ['How many input combinations do two Boolean inputs have?', 'Four.'],
      ['When does a two-input XOR output 1?', 'When its inputs differ.'],
      ['What is NAND for inputs 1 and 1?', '0: AND gives 1, then NAND reverses it.'],
    ],
  },
  {
    id: 'logic-sets',
    field: 'logic',
    title: 'Sets & membership',
    summary: 'Describe collections by their distinct members.',
    explanation: [
      'A set is a collection of distinct elements. Membership asks whether an element belongs to it. In mathematical sets, order does not matter and repeating an element does not add a new member. The cardinality of a finite set is its number of elements; the empty set has none.',
      'The union of two sets contains elements in either set. Their intersection contains elements in both. The difference A minus B contains elements in A that are absent from B. A is a subset of B if every member of A also belongs to B. These operations help express selections without relying on item order.',
    ],
    example:
      'For A = {red, blue} and B = {blue, green}, the union is {red, blue, green}, the intersection is {blue}, and A minus B is {red}.',
    takeaway:
      'Set operations describe membership; duplicates and order do not change a mathematical set.',
    sources: [
      {
        title: 'Carnegie Mellon University · Set Operations',
        url: 'https://www.cs.cmu.edu/~sutner/pdf/10-sets.pdf',
      },
    ],
    questions: [
      [
        'Does listing an element twice change a mathematical set?',
        'No. Sets contain distinct elements.',
      ],
      ['What is the cardinality of the empty set?', 'Zero.'],
      ['What does the intersection of two sets contain?', 'Elements belonging to both sets.'],
      [
        'What does the union of two sets contain?',
        'Elements belonging to either set, including elements in both.',
      ],
      ['When is A a subset of B?', 'When every element of A also belongs to B.'],
    ],
  },
  {
    id: 'logic-functions',
    field: 'logic',
    title: 'Mathematical functions',
    summary: 'Map each allowed input to exactly one output.',
    explanation: [
      'A mathematical function assigns exactly one output to every input in its domain. The domain is the allowed input set; the codomain is the declared output set. The range is the set of outputs actually produced. Different inputs may map to the same output without breaking the definition.',
      'Function composition feeds one function’s output into another. For g(f(x)), apply f first and then g, checking that its result is an allowed input to g. A mathematical function fixes the output for a given input; a programming function may also depend on changing state or perform actions, so the terms need care.',
    ],
    example:
      'Let f(x) = x × x on the integers. f(3) = 9 and f(−3) = 9. Both inputs can share an output. If g(y) = y + 1, then g(f(3)) = 10.',
    takeaway: 'Exactly one output per allowed input does not mean exactly one input per output.',
    sources: [
      {
        title: 'Carnegie Mellon University · Functions',
        url: 'https://www.cs.cmu.edu/~sutner/pdf/20-functions.pdf',
      },
    ],
    questions: [
      ['What is the domain of a mathematical function?', 'Its set of allowed inputs.'],
      [
        'How many outputs does a mathematical function assign to one allowed input?',
        'Exactly one.',
      ],
      ['Can two inputs of a mathematical function have the same output?', 'Yes.'],
      ['What is the range of a function?', 'The set of outputs it actually produces.'],
      ['In g(f(x)), which function is applied first?', 'f.'],
    ],
  },
  {
    id: 'logic-counting',
    field: 'logic',
    title: 'Counting choices',
    summary: 'Use addition and multiplication to count possible outcomes.',
    explanation: [
      'Counting possible outcomes helps describe cases a program must handle. Add counts when choosing between disjoint alternatives: if two groups do not overlap, their combined size is the sum. If they overlap, simply adding counts some items twice; subtract the overlap once.',
      'Multiply counts for successive choices when every earlier choice allows the same number of later choices. Three choices followed by two choices give six ordered outcomes. Decide whether repetition is allowed and whether order matters before counting: an ordered pair and an unordered selection are different objects.',
    ],
    example:
      'A badge has one of 3 shapes and one of 2 colours, giving 3 × 2 = 6 designs. For a two-digit code using 0–9 with repetition allowed, there are 10 × 10 = 100 codes, including 00.',
    takeaway: 'Count the actual choices, including restrictions on order and repetition.',
    sources: [counting],
    questions: [
      ['How do you count the union of two disjoint finite groups?', 'Add their sizes.'],
      ['How many designs use one of 3 shapes and one of 2 colours?', '6.'],
      ['How many two-digit codes use 0–9 when repetition and a leading zero are allowed?', '100.'],
      [
        'Why can adding the sizes of overlapping groups overcount?',
        'Items in the overlap are counted twice.',
      ],
      [
        'Does order matter when counting ordered pairs?',
        'Yes. (a, b) and (b, a) differ when a and b differ.',
      ],
    ],
  },
  {
    id: 'logic-probability',
    field: 'logic',
    title: 'Probability & events',
    summary: 'Measure the chance of an event under a stated model.',
    explanation: [
      'A sample space is the set of possible outcomes. An event is a selection of those outcomes. Probabilities range from 0 to 1; the whole sample space has probability 1. In a finite model with equally likely outcomes, an event’s probability is its outcome count divided by the total count.',
      'The complement of an event contains outcomes outside it, with probability 1 minus the event’s probability. Independent events do not change each other’s probabilities; their joint probability is the product. Random choices are not automatically equally likely or independent, so these assumptions must be checked before using the shortcuts.',
    ],
    example:
      'For a fair six-sided die, the event “roll an even number” is {2, 4, 6}, with probability 3/6 = 1/2. Two independent fair coin tosses both landing heads have probability 1/2 × 1/2 = 1/4.',
    takeaway:
      'Probability calculations rely on an explicit model of possible outcomes and their chances.',
    sources: [counting],
    questions: [
      ['What is a sample space?', 'The set of possible outcomes.'],
      ['What is an event in a probability model?', 'A subset of the sample space.'],
      [
        'When can event probability be calculated by counting favourable outcomes over all outcomes?',
        'When the finite outcomes are equally likely.',
      ],
      ['If an event has probability 0.3, what is its complement’s probability?', '0.7.'],
      ['What is the probability that two independent fair coin tosses both give heads?', '1/4.'],
    ],
  },
  {
    id: 'logic-modulo',
    field: 'logic',
    title: 'Remainders & modular arithmetic',
    summary: 'Use remainders to reason about cycles and divisibility.',
    explanation: [
      'For a nonnegative integer a and positive integer m, a mod m is the remainder after dividing a into groups of size m. It lies between 0 and m − 1. A zero remainder means m divides a exactly. The quotient counts complete groups; the remainder counts what is left.',
      'Two integers are congruent modulo m when they differ by a multiple of m. This expresses wraparound: positions separated by a whole cycle land at the same place. Programming languages can differ in how their remainder operators handle negative operands; understand that language’s rule before extending examples to negatives.',
    ],
    example:
      '17 = 3 × 5 + 2, so 17 mod 5 = 2. In a ring with positions 0 through 4, advancing one step from position 4 gives (4 + 1) mod 5 = 0.',
    takeaway: 'Modulo maps a nonnegative count to its position within a repeating cycle.',
    sources: [
      {
        title: 'Carnegie Mellon University · Modular Arithmetic',
        url: 'https://www.cs.cmu.edu/~sutner/pdf/60-modari.pdf',
      },
    ],
    questions: [
      ['What is 17 mod 5?', '2.'],
      [
        'What is the possible remainder range for nonnegative a mod positive m?',
        '0 through m − 1.',
      ],
      ['What does a remainder of zero mean?', 'The divisor divides the number exactly.'],
      ['What is (4 + 1) mod 5?', '0.'],
      ['When are two integers congruent modulo m?', 'When their difference is a multiple of m.'],
    ],
  },
  {
    id: 'repr-floating-point',
    field: 'representation',
    title: 'Floating-point approximation',
    summary: 'Understand why fractional calculations can need rounding and tolerance.',
    explanation: [
      'Floating-point formats represent numbers using a sign, a significand (the significant digits) and an exponent (a scale factor), similar to scientific notation. A fixed number of bits gives a finite set of representable values. Many common decimal fractions, including 0.1, cannot be represented exactly in ordinary binary floating point and must be approximated.',
      'Arithmetic can introduce further rounding, so two calculations that are equal in exact mathematics may produce slightly different stored results. Formatting fewer decimal places changes the displayed text, not the underlying value. When approximate numeric comparison is appropriate, choose a tolerance suited to the quantities and calculation.',
    ],
    example:
      'In common binary floating-point arithmetic, 0.1 + 0.2 can produce 0.30000000000000004. Showing it as 0.30 is display rounding; it does not make the stored number exactly decimal 0.3.',
    takeaway: 'A short decimal display can conceal an approximate stored value.',
    sources: [
      {
        title: 'Python tutorial · Floating-Point Arithmetic: Issues and Limitations',
        url: 'https://docs.python.org/3/tutorial/floatingpoint.html',
      },
      {
        title: 'Oracle Numerical Computation Guide · IEEE Arithmetic',
        url: 'https://docs.oracle.com/cd/E19957-01/806-3568/ncg_math.html',
      },
    ],
    questions: [
      [
        'Can ordinary binary floating point represent decimal 0.1 exactly?',
        'No. It stores an approximation.',
      ],
      [
        'Why can two mathematically equivalent floating-point calculations differ slightly?',
        'Their operations can round differently.',
      ],
      [
        'Does rounding a displayed number change its underlying stored value?',
        'No. Display formatting only changes the text shown.',
      ],
      [
        'What does a tolerance express in approximate numeric comparison?',
        'How much difference is acceptable for the calculation.',
      ],
      [
        'Can a fixed-width floating-point format represent every real number?',
        'No. It has only finitely many representable values.',
      ],
    ],
  },
  {
    id: 'repr-endianness',
    field: 'representation',
    title: 'Byte order & endianness',
    summary: 'Interpret multi-byte numbers using an agreed order.',
    explanation: [
      'A number that occupies several bytes needs a rule for ordering those bytes in memory or a file. In big-endian order, the most significant byte comes first, at the lowest address. In little-endian order, the least significant byte comes first. Significance means how much a byte contributes to the numeric value.',
      'Byte order changes the layout of a multi-byte value, not its mathematical value when decoded correctly. It does not reverse the bits within each byte. Reading a file or message using the wrong order can turn the same bytes into a different number, which is why data formats specify their byte order.',
    ],
    example:
      'For the two-byte value 0x1234, increasing addresses hold 12 then 34 in big-endian order, or 34 then 12 in little-endian order. Each pair here is one hexadecimal byte.',
    takeaway: 'Agree on byte order when exchanging multi-byte numeric values.',
    sources: [
      {
        title: 'MDN · Endianness',
        url: 'https://developer.mozilla.org/en-US/docs/Glossary/Endianness',
      },
    ],
    questions: [
      ['Which byte comes first in big-endian order?', 'The most significant byte.'],
      ['Which byte comes first in little-endian order?', 'The least significant byte.'],
      [
        'What byte sequence stores two-byte 0x1234 in little-endian order?',
        '34 then 12, in hexadecimal.',
      ],
      ['Does changing byte order reverse the bits within each byte?', 'No.'],
      [
        'Why must a binary file format specify byte order for multi-byte numbers?',
        'So readers interpret the same bytes as the intended numeric values.',
      ],
    ],
  },
  {
    id: 'repr-bitwise',
    field: 'representation',
    title: 'Bitwise operations & masks',
    summary: 'Operate on individual bit positions in an integer.',
    explanation: [
      'Bitwise operations apply Boolean rules separately to corresponding bits. AND keeps a 1 only where both inputs have 1. OR keeps a 1 where either has 1. XOR keeps a 1 where the inputs differ. A mask is a bit pattern used to select particular positions.',
      'AND with a mask can test or extract selected bits; OR with a mask can set them. Shifts move bits between positions. For nonnegative integers without overflow, shifting left by one multiplies by two and shifting right by one discards the low bit, giving the integer quotient by two. Fixed-width and signed types require attention to overflow and shift rules.',
    ],
    example:
      'Using four displayed bits, 1010 AND 1100 = 1000; 1010 OR 0101 = 1111; 1010 XOR 1100 = 0110. To check the lowest bit of a nonnegative integer n, examine n AND 1.',
    takeaway:
      'A bit mask selects positions; the chosen operation determines how those positions change.',
    sources: [
      {
        title: 'Python documentation · Bitwise Operations on Integer Types',
        url: 'https://docs.python.org/3/library/stdtypes.html#bitwise-operations-on-integer-types',
      },
    ],
    questions: [
      ['What is binary 1010 AND 1100?', '1000.'],
      ['What is binary 1010 XOR 1100?', '0110.'],
      ['Which operation can set bits selected by a mask?', 'Bitwise OR.'],
      ['What does n AND 1 extract from a nonnegative integer?', 'Its lowest bit.'],
      [
        'For a nonnegative integer without overflow, what does a left shift by one do?',
        'Multiplies its value by two.',
      ],
    ],
  },
];
