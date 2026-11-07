import type { Concept } from '../types';

const ods = 'https://opendatastructures.org/ods-python/';
const ostep = 'https://pages.cs.wisc.edu/~remzi/OSTEP/';
const pg = 'https://www.postgresql.org/docs/current/';
const cs50 = 'https://cs50.harvard.edu/x/notes/';

// Original introductory notes. Sources checked on 7 November 2026.
export const coreFoundations: Concept[] = [
  {
    id: 'core-abstract-data-types',
    field: 'structures',
    title: 'Abstract data types',
    summary: 'Describe the operations a collection promises before choosing its storage.',
    explanation: [
      'An abstract data type describes allowed operations and their meaning. For example, a stack promises that pop removes the latest pushed item. It does not prescribe an array, linked nodes, or a particular programming language.',
      'An implementation supplies the representation and algorithms behind that promise. Two implementations can behave alike while using different amounts of time or memory. Choose the required behaviour first, then compare implementations.',
    ],
    example:
      'A stack can use an array or linked nodes.\nBoth expose push and pop and follow LIFO order.',
    takeaway: 'An interface says what operations mean; an implementation says how they work.',
    sources: [{ title: 'Open Data Structures · Interfaces', url: `${ods}1_2_Interfaces.html` }],
    questions: [
      ['What does an abstract data type specify?', 'The supported operations and their meaning.'],
      [
        'Can one abstract data type have several implementations?',
        'Yes. Different representations can satisfy the same operation contract.',
      ],
      [
        'Is an array required to implement a stack?',
        'No. Linked nodes and other representations can also implement a stack.',
      ],
      [
        'Can two implementations of the same interface have different performance?',
        'Yes. The same behaviour can have different time and memory costs.',
      ],
    ],
  },
  {
    id: 'core-sets-maps',
    field: 'structures',
    title: 'Sets & key-value maps',
    summary: 'Choose between tracking membership and associating values with keys.',
    explanation: [
      'A set stores distinct elements and answers membership questions. Adding an element already present does not create a second copy. A map, also called a dictionary, associates each key with a value.',
      'Map keys are unique within the map; different keys may have equal values. Updating an existing key replaces its associated value. These are collection behaviours: hash tables and ordered trees are possible implementations.',
    ],
    example:
      'Set of visited names: {Ada, Ben}. Adding Ada again keeps two names.\nMap of scores: Ada → 8, Ben → 8. Updating Ada → 9 leaves Ben unchanged.',
    takeaway: 'Use a set for membership and a map for key-to-value lookup.',
    sources: [
      {
        title: 'Python tutorial · Sets and dictionaries',
        url: 'https://docs.python.org/3/tutorial/datastructures.html',
      },
    ],
    questions: [
      [
        'What happens when an existing element is added to a set?',
        'It remains one member; no duplicate is added.',
      ],
      ['What does a map associate with each key?', 'A value.'],
      [
        'Can two different map keys have the same value?',
        'Yes. Keys must be unique, but values may repeat.',
      ],
      [
        'What happens when a map entry is assigned a new value using the same key?',
        'The value associated with that key is replaced.',
      ],
    ],
  },
  {
    id: 'core-priority-heaps',
    field: 'structures',
    title: 'Priority queues & heaps',
    summary: 'Retrieve an item by priority instead of arrival order.',
    explanation: [
      'A priority queue retrieves an item according to its priority. A min-priority queue returns a smallest-priority item first, even if it arrived later. Equal priorities need an explicit tie rule if arrival order matters.',
      'A binary min-heap is a tree filled level by level from left to right, in which each parent is no larger than its children. Its root contains a minimum, but the entire structure is not sorted. Restoring heap order after insertion or removing the minimum takes O(log n) time. With a growing backing array, an occasional resize can take O(n); the insertion bound is O(log n) amortised over a sequence of operations.',
    ],
    example:
      'Insert priorities 7, 2, 5.\nA min-priority queue removes 2 first.\nAn ordinary FIFO queue would remove 7 first.',
    takeaway:
      'A heap maintains enough order to find an extreme quickly, without sorting everything.',
    sources: [
      { title: 'Open Data Structures · BinaryHeap', url: `${ods}10_1_BinaryHeap_Implicit_Bi.html` },
    ],
    questions: [
      [
        'Which item does a min-priority queue remove next?',
        'An item with the smallest priority value.',
      ],
      ['Where is a minimum stored in a nonempty binary min-heap?', 'At the root.'],
      [
        'Is a binary heap a completely sorted sequence?',
        'No. Its parent-child ordering does not order every pair of elements.',
      ],
      [
        'Ignoring backing-array resizing, what is the insertion time of a binary heap with n items?',
        'O(log n).',
      ],
      [
        'Does a priority queue necessarily preserve arrival order among equal priorities?',
        'No. That requires a defined tie-breaking rule.',
      ],
    ],
  },
  {
    id: 'core-graph-traversal',
    field: 'algorithms',
    title: 'Breadth-first & depth-first traversal',
    summary: 'Explore reachable graph vertices systematically.',
    explanation: [
      'Traversal visits graph vertices by following edges. Breadth-first search (BFS) explores in layers from a starting vertex, using a queue. Depth-first search (DFS) follows a branch before backtracking, using recursion or an explicit stack.',
      'A visited record prevents cycles from causing repeated exploration. From one starting vertex, these searches discover only reachable vertices. BFS finds paths with the fewest edges in an unweighted graph; it does not generally minimise arbitrary edge weights.',
    ],
    example:
      'Edges: A—B, A—C, B—D. Start at A.\nBFS can visit A, B, C, D.\nDFS can visit A, B, D, C.',
    takeaway:
      'BFS explores layers; DFS explores branches. Track visited vertices in cyclic graphs.',
    sources: [
      { title: 'Open Data Structures · Graph traversal', url: `${ods}12_3_Graph_Traversal.html` },
    ],
    questions: [
      ['Which structure normally holds the frontier in BFS?', 'A FIFO queue.'],
      ['Which traversal follows a branch before backtracking?', 'Depth-first search.'],
      [
        'Why does a graph traversal track visited vertices?',
        'To avoid repeatedly exploring vertices, including around cycles.',
      ],
      [
        'What kind of shortest path does BFS find in an unweighted graph?',
        'A path with the fewest edges from the starting vertex.',
      ],
      [
        'Does a traversal from one vertex always visit every graph vertex?',
        'No. It visits only vertices reachable from that start.',
      ],
    ],
  },
  {
    id: 'core-algorithm-specification',
    field: 'algorithms',
    title: 'Algorithms, inputs & outputs',
    summary: 'Separate a problem from the steps chosen to solve it.',
    explanation: [
      'An algorithm is a precise procedure for solving a problem. For an ordinary terminating computation, it takes permitted inputs through a finite number of steps to a result. A program implements a procedure in an executable form; pseudocode describes its steps without requiring a specific language.',
      'State what inputs are allowed and what result is required before comparing speed. A fast method that returns the wrong result is not a correct solution. Several algorithms can solve the same problem.',
    ],
    example:
      'Problem: find the largest number in a nonempty list.\nProcedure: keep the first number as the current largest; inspect each remaining number and update it when larger.',
    takeaway: 'Define the required result before deciding how to compute it.',
    sources: [{ title: 'Harvard CS50 · Algorithms and pseudocode', url: `${cs50}0/` }],
    questions: [
      ['What is an algorithm?', 'A precise procedure for solving a problem.'],
      ['What is an input to an algorithm?', 'Information supplied for the algorithm to process.'],
      ['What is an algorithm’s output?', 'The result it produces.'],
      [
        'What is pseudocode?',
        'A readable description of algorithm steps that is not tied to one executable language.',
      ],
      [
        'Can different algorithms solve the same problem?',
        'Yes. They may differ in steps, speed, and memory use.',
      ],
    ],
  },
  {
    id: 'core-correctness-invariants',
    field: 'algorithms',
    title: 'Preconditions, invariants & correctness',
    summary: 'Explain why a procedure gives the required answer and finishes.',
    explanation: [
      'A precondition states what must be true before an operation begins. A postcondition states what it promises afterward. A loop invariant is a fact maintained at the same point of every iteration, such as the start of the loop.',
      'To reason about a loop, establish the invariant before the first iteration, show each step preserves it, and use it with the exit condition to obtain the result. Termination needs a separate progress argument; a preserved fact alone does not prove the loop stops.',
    ],
    example:
      'While summing a list, before iteration i:\nsum equals the total of the first i elements.\nStart with i = 0 and sum = 0; add item i and increase i.\nWhen i equals the length, sum covers the whole list.',
    takeaway: 'Correctness needs a result argument and a termination argument.',
    sources: [
      {
        title: 'Cornell CS2112 · Loop invariants',
        url: 'https://www.cs.cornell.edu/courses/cs2112/2020fa/lectures/loopinv/',
      },
    ],
    questions: [
      [
        'Which precondition prevents division by zero in divide(a, b)?',
        'The divisor b must not be zero.',
      ],
      [
        'A function promises a nonnegative count. Does returning -1 satisfy that postcondition?',
        'No. A negative result violates the promised postcondition.',
      ],
      [
        'What is a loop invariant?',
        'A fact maintained at a chosen point in every iteration of a loop.',
      ],
      [
        'Does maintaining an invariant alone prove a loop terminates?',
        'No. A separate argument must show progress toward stopping.',
      ],
    ],
  },
  {
    id: 'core-divide-conquer',
    field: 'algorithms',
    title: 'Divide, solve & combine',
    summary: 'Build a solution from smaller instances of the same problem.',
    explanation: [
      'Divide and conquer splits a problem into smaller subproblems, solves them, and combines their answers. Small enough inputs are handled directly. Merge sort follows this pattern by sorting two halves and merging them.',
      'The combine step is part of the algorithm: splitting alone does not finish the job. The cost depends on both the subproblems and the work around them. Recursion is a common way to express the pattern.',
    ],
    example:
      'Sort [4, 1, 3, 2].\nSplit into [4, 1] and [3, 2].\nSort to [1, 4] and [2, 3].\nMerge to [1, 2, 3, 4].',
    takeaway: 'Smaller solutions must be combined into the answer to the original problem.',
    sources: [{ title: 'Harvard CS50 · Merge sort', url: `${cs50}3/` }],
    questions: [
      [
        'What are the three main stages of divide and conquer?',
        'Divide the problem, solve the smaller problems, and combine their answers.',
      ],
      ['Which step combines merge sort’s sorted halves?', 'The merge step.'],
      [
        'Why must repeated subdivision reach a directly solvable case?',
        'So subdivision stops and answers can be returned.',
      ],
      [
        'Does dividing a problem automatically determine its runtime?',
        'No. The number and size of subproblems and the surrounding work all contribute.',
      ],
    ],
  },
  {
    id: 'core-operating-system',
    field: 'systems',
    title: 'What an operating system does',
    summary: 'Meet the software that manages shared computer resources.',
    explanation: [
      'An operating system (OS) manages resources such as processors, memory, storage, and devices. It provides services that programs use instead of controlling every piece of hardware themselves.',
      'The OS allocates resources among running programs and helps isolate them. File interfaces and process management give applications useful abstractions over hardware. A graphical desktop is one way to interact with a system, rather than the definition of an OS.',
    ],
    example:
      'A music player reads a file while an editor saves a document.\nThe OS coordinates CPU time, memory, and storage access for both.',
    takeaway: 'The OS manages resources and provides services to programs.',
    sources: [{ title: 'OSTEP · Introduction to operating systems', url: `${ostep}intro.pdf` }],
    questions: [
      ['What does OS stand for?', 'Operating system.'],
      [
        'Name a computer resource managed by an OS.',
        'CPU time, memory, storage, or an input/output device.',
      ],
      [
        'Why do applications use operating-system services?',
        'To access managed resources through common interfaces.',
      ],
      [
        'Does an OS require a graphical desktop?',
        'No. An OS can be used through text interfaces or without an interactive desktop.',
      ],
      [
        'What is an operating system?',
        'System software that manages computer resources and provides services to programs.',
      ],
    ],
  },
  {
    id: 'core-kernel-system-calls',
    field: 'systems',
    title: 'Kernel, user mode & system calls',
    summary: 'Understand how ordinary programs request privileged services.',
    explanation: [
      'The kernel is the privileged core of an operating system. Hardware privilege modes limit what ordinary application code can do. In user mode, a program cannot directly execute every privileged operation or freely access protected kernel memory.',
      'A system call is a controlled request for a kernel service, such as opening a file. The processor switches to an approved kernel entry point, where the request is checked and handled. An ordinary function call does not necessarily enter the kernel.',
    ],
    example:
      'Application requests a file read → system-call interface → kernel checks and performs the operation → application receives a result.',
    takeaway: 'System calls cross a privilege boundary through controlled entry points.',
    sources: [{ title: 'OSTEP · Limited direct execution', url: `${ostep}cpu-mechanisms.pdf` }],
    questions: [
      ['What is the kernel?', 'The privileged core of an operating system.'],
      [
        'Why does hardware distinguish user mode from kernel mode?',
        'To restrict privileged operations and protect system resources.',
      ],
      ['What is a system call?', 'A controlled request from a program for a kernel service.'],
      [
        'Does every function call make a system call?',
        'No. Many function calls run entirely in user space.',
      ],
    ],
  },
  {
    id: 'core-cpu-scheduling',
    field: 'systems',
    title: 'CPU scheduling',
    summary: 'Choose which ready task gets processor time next.',
    explanation: [
      'A scheduler chooses among tasks ready to run. A task waiting for input or another event is blocked, so it is not currently ready to use the CPU. Switching the running task requires saving and restoring execution state.',
      'Round-robin scheduling gives ready tasks turns with a limited time slice. Scheduling policies balance goals such as quick responses, completing many tasks, and sharing time fairly; improving one goal can worsen another.',
    ],
    example:
      'Ready tasks A and B share one CPU.\nA runs for a time slice, then B gets a turn.\nIf A waits for input, B can run while A is blocked.',
    takeaway: 'Scheduling allocates CPU time among tasks that can currently make progress.',
    sources: [{ title: 'OSTEP · Scheduling introduction', url: `${ostep}cpu-sched.pdf` }],
    questions: [
      ['What does a CPU scheduler choose?', 'Which ready task should run next.'],
      [
        'Is a task blocked waiting for input ready to run?',
        'No. It must first become ready when the needed event occurs.',
      ],
      [
        'What is a time slice?',
        'A limited interval of CPU time assigned to a task before it may be preempted.',
      ],
      [
        'What is a context switch?',
        'Saving one task’s execution state and restoring another’s so execution can switch.',
      ],
    ],
  },
  {
    id: 'core-stack-heap-memory',
    field: 'systems',
    title: 'Call-stack & heap memory',
    summary: 'Distinguish active function-call state from dynamic allocation.',
    explanation: [
      'In a conventional process layout, the call stack tracks active function calls. A frame can hold local state and the information needed to return to the caller. Frames are normally removed as calls return.',
      'The memory heap supports dynamic allocations whose lifetimes need not match one function call. Depending on the language, programs release allocations explicitly or a garbage collector reclaims unreachable objects. This memory region is unrelated to the heap data structure used for priority queues.',
    ],
    example:
      'A function creates a dynamically allocated object and returns a reference.\nIts call frame ends, but the object can remain usable by the caller.',
    takeaway: 'Allocation lifetime and call lifetime are different ideas.',
    sources: [
      { title: 'OSTEP · Address spaces', url: `${ostep}vm-intro.pdf` },
      {
        title: 'MDN · Memory management',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management',
      },
    ],
    questions: [
      ['What does the call stack track?', 'The state of active function calls.'],
      [
        'What normally happens to a call’s stack frame when it returns?',
        'The frame is removed from the active call stack.',
      ],
      [
        'Must a dynamically allocated object disappear when its creating function returns?',
        'No. It can outlive that call.',
      ],
      [
        'Is the memory heap the same thing as a priority-queue heap?',
        'No. They are different concepts sharing a name.',
      ],
    ],
  },
  {
    id: 'core-blocking-io',
    field: 'systems',
    title: 'Blocking & nonblocking I/O',
    summary: 'Understand whether an input/output request waits for readiness.',
    explanation: [
      'A blocking read may suspend its calling thread while it waits for data. Other ready threads can still run. Blocking describes the caller’s wait, not the whole computer stopping.',
      'For a nonblocking socket, a read with no available data returns a would-block indication instead of waiting for data. The program must arrange to try again when ready. Successful reads may return fewer bytes than requested, so callers must inspect the reported result.',
    ],
    example:
      'A chat socket has no message yet.\nBlocking read: the caller waits.\nNonblocking read: the caller receives a would-block result and can handle another task.',
    takeaway:
      'Nonblocking means no wait for readiness; it does not mean the requested data is already available.',
    sources: [
      {
        title: 'Linux man-pages · read(2)',
        url: 'https://man7.org/linux/man-pages/man2/read.2.html',
      },
    ],
    questions: [
      [
        'What may a blocking read do when no data is ready?',
        'Wait by suspending the calling thread.',
      ],
      [
        'Does one thread blocking on I/O stop all other threads?',
        'No. Other ready threads can be scheduled.',
      ],
      [
        'What can a nonblocking socket read report when no data is available?',
        'A would-block indication, such as EAGAIN or EWOULDBLOCK.',
      ],
      [
        'Does a successful read always return all requested bytes?',
        'No. It may return fewer bytes, so check the returned count.',
      ],
    ],
  },
  {
    id: 'core-networks-lan-wan',
    field: 'networking',
    title: 'Networks, LANs & WANs',
    summary: 'Connect devices locally and connect local networks over distance.',
    explanation: [
      'A computer network connects devices so they can exchange data and share resources. A local area network (LAN) covers a limited area such as a home or building. It can use wired links, wireless links, or both.',
      'A wide area network (WAN) spans a larger geographic area and can connect LANs. The Internet interconnects networks around the world. Being connected to Wi-Fi establishes a local wireless connection; it does not by itself guarantee access to the Internet.',
    ],
    example:
      'A laptop and printer communicate through home Wi-Fi.\nThat local network can still work when the home Internet connection is unavailable.',
    takeaway: 'A local network and Internet connectivity are separate things.',
    sources: [
      {
        title: 'Cisco · What is a LAN?',
        url: 'https://www.cisco.com/site/us/en/learn/topics/networking/what-is-a-lan-local-area-network.html',
      },
    ],
    questions: [
      ['What is a computer network?', 'Connected devices that can exchange data.'],
      ['What does LAN stand for?', 'Local area network.'],
      [
        'What distinguishes a WAN from a LAN?',
        'A WAN spans a larger geographic area and may connect local networks.',
      ],
      [
        'Does a Wi-Fi connection guarantee Internet access?',
        'No. The local network may have no working Internet connection.',
      ],
    ],
  },
  {
    id: 'core-ip-routing-packets',
    field: 'networking',
    title: 'IP addresses, packets & routing',
    summary: 'Send addressed units of data across connected networks.',
    explanation: [
      'IP carries data in packets with addressing information. An IP address identifies a network interface within an addressing context; it is not a permanent identity for a person. IPv4 uses 32-bit addresses, while IPv6 uses 128-bit addresses.',
      'Routers forward packets toward their destinations using routing information and a next hop. IP itself does not guarantee delivery or arrival order. Higher-level protocols add any reliability their applications require.',
    ],
    example:
      'A laptop sends a packet for a remote address to its gateway router.\nRouters forward it hop by hop toward the destination network.',
    takeaway:
      'IP supplies addressing and packet delivery across networks, without a delivery guarantee.',
    sources: [
      {
        title: 'IETF · Internet Protocol (RFC 791)',
        url: 'https://www.rfc-editor.org/rfc/rfc791.html',
      },
      { title: 'IETF · IPv6 (RFC 8200)', url: 'https://www.rfc-editor.org/rfc/rfc8200.html' },
    ],
    questions: [
      ['What is an IP packet?', 'An addressed unit of data carried by the Internet Protocol.'],
      [
        'What does a router do with a packet?',
        'Forwards it toward its destination using routing information.',
      ],
      ['How wide is an IPv4 address?', '32 bits.'],
      ['How wide is an IPv6 address?', '128 bits.'],
      ['Does IP guarantee packet delivery?', 'No. Packets may be lost.'],
    ],
  },
  {
    id: 'core-network-ports',
    field: 'networking',
    title: 'Transport ports & endpoints',
    summary: 'Distinguish services sharing a network address.',
    explanation: [
      'TCP and UDP use port numbers to distinguish communication endpoints on a host. A destination address helps reach a host interface; a destination port helps deliver transport data to the appropriate endpoint. A port number is a logical identifier, not a physical socket on the machine.',
      'A TCP connection is distinguished by its pair of endpoints: local address and port, plus remote address and port. This allows a server listening on one port to handle many clients. TCP and UDP have separate port spaces.',
    ],
    example:
      'Two clients connect to the same server address and TCP port.\nTheir different client addresses or source ports distinguish the connections.',
    takeaway: 'An address and a port serve different parts of endpoint identification.',
    sources: [
      {
        title: 'IETF · TCP functional specification',
        url: 'https://www.rfc-editor.org/rfc/rfc9293.html',
      },
    ],
    questions: [
      [
        'What does a transport port number help identify?',
        'A communication endpoint for TCP or UDP on a host.',
      ],
      ['Is a TCP port a physical connector?', 'No. It is a logical transport identifier.'],
      [
        'What four values identify a TCP connection’s endpoints?',
        'Local IP address, local port, remote IP address, and remote port.',
      ],
      [
        'Can many TCP clients connect to the same server port?',
        'Yes. Their endpoint pairs distinguish their connections.',
      ],
    ],
  },
  {
    id: 'core-client-server',
    field: 'networking',
    title: 'Clients, servers & protocols',
    summary: 'Name the roles and shared rules in a network exchange.',
    explanation: [
      'A client requests a service and a server provides that service. These are software roles: a browser can be a client and a web server can answer its requests. The same computer can run both roles.',
      'A protocol defines communication rules, such as message structure and meaning. The Web is one service built on Internet infrastructure; email and other applications also use the Internet. A server can itself act as a client when it requests another service.',
    ],
    example:
      'Browser requests a page from a web server.\nThat server requests stored records from a database server.\nThe web server acts as a server in one exchange and a client in the other.',
    takeaway: 'Client and server describe roles in an exchange, not fixed kinds of hardware.',
    sources: [
      {
        title: 'MDN · How the Internet works',
        url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work',
      },
    ],
    questions: [
      ['What does a client do?', 'Requests a service from a server.'],
      ['What does a server do?', 'Provides a service to clients.'],
      [
        'Can one computer run both client and server software?',
        'Yes. The roles are not exclusive hardware categories.',
      ],
      [
        'What is a communication protocol?',
        'A set of rules for exchanging and interpreting messages.',
      ],
      [
        'Are the Web and the Internet identical?',
        'No. The Web is one service using Internet infrastructure.',
      ],
    ],
  },
  {
    id: 'core-database-purpose',
    field: 'databases',
    title: 'Databases & database management systems',
    summary: 'Separate stored information from the software that manages it.',
    explanation: [
      'A database is an organised collection of data. A database management system (DBMS) is the software used to define, store, retrieve, and manage that data. PostgreSQL is one relational DBMS; not every database uses the relational model.',
      'A schema describes structure, such as table and column definitions. SQL is a language used to interact with many relational systems. Database software may run locally or on another machine; a database does not inherently require a cloud service.',
    ],
    example:
      'A library database stores books and loans.\nIts schema defines the tables and columns.\nThe DBMS executes requests to retrieve or update records.',
    takeaway: 'The database is the managed data; the DBMS is the managing software.',
    sources: [
      { title: 'PostgreSQL · Relational database concepts', url: `${pg}tutorial-concepts.html` },
      { title: 'PostgreSQL · Architectural fundamentals', url: `${pg}tutorial-arch.html` },
    ],
    questions: [
      ['What is a database?', 'An organised collection of data.'],
      ['What does DBMS stand for?', 'Database management system.'],
      [
        'What does a database schema describe?',
        'The structure of the data, such as tables and columns.',
      ],
      ['Must every database be hosted in the cloud?', 'No. Database software can run locally.'],
      ['Do all databases organise data as relational tables?', 'No. Other data models exist.'],
    ],
  },
  {
    id: 'core-crud',
    field: 'databases',
    title: 'Creating, reading, updating & deleting data',
    summary: 'Learn the four basic record operations and their SQL commands.',
    explanation: [
      'CRUD abbreviates create, read, update, and delete. For rows in SQL, INSERT creates records, SELECT reads them, UPDATE changes them, and DELETE removes them. Creating a table is a separate operation from inserting a record.',
      'A WHERE condition limits which rows an UPDATE or DELETE affects. Without a WHERE condition, these statements can affect every row in the target table. Inspect the intended selection before making a broad change.',
    ],
    example:
      "INSERT INTO books (title) VALUES ('Networks');\nSELECT title FROM books;\nUPDATE books SET title = 'Computer networks' WHERE id = 7;\nDELETE FROM books WHERE id = 7;",
    takeaway: 'Identify the target rows before updating or deleting data.',
    sources: [
      { title: 'PostgreSQL · Populating a table', url: `${pg}tutorial-populate.html` },
      { title: 'PostgreSQL · Updates', url: `${pg}tutorial-update.html` },
      { title: 'PostgreSQL · Deletions', url: `${pg}tutorial-delete.html` },
    ],
    questions: [
      ['What does CRUD stand for?', 'Create, read, update, and delete.'],
      ['Which SQL command adds a row to a table?', 'INSERT.'],
      ['Which SQL command changes existing row values?', 'UPDATE.'],
      ['Which SQL command removes rows?', 'DELETE.'],
      ['What can DELETE without a WHERE condition do?', 'Delete every row from the target table.'],
    ],
  },
  {
    id: 'core-select-filter-sort',
    field: 'databases',
    title: 'Selecting, filtering & ordering rows',
    summary: 'Ask for particular columns, matching rows, and an explicit display order.',
    explanation: [
      'A SELECT query retrieves data. The selected column list chooses which values appear; FROM names the source, and WHERE filters rows by a condition. Selecting columns and filtering rows are different operations.',
      'ORDER BY specifies result ordering. Without it, SQL does not promise a particular row order. DISTINCT removes duplicate result rows, which may arise even when each underlying table row has its own identity.',
    ],
    example:
      'SELECT name, score\nFROM students\nWHERE score >= 60\nORDER BY score DESC;\n\nReturn passing students, showing higher scores first.',
    takeaway: 'Use WHERE for matching rows and ORDER BY for required result order.',
    sources: [{ title: 'PostgreSQL · Querying a table', url: `${pg}tutorial-select.html` }],
    questions: [
      ['Which SQL clause filters individual rows?', 'WHERE.'],
      ['Which SQL clause explicitly sorts query results?', 'ORDER BY.'],
      ['What does DESC mean in ORDER BY?', 'Descending order.'],
      ['Is row order guaranteed without ORDER BY?', 'No.'],
      ['What does SELECT DISTINCT remove?', 'Duplicate rows from the query result.'],
    ],
  },
  {
    id: 'core-aggregation-grouping',
    field: 'databases',
    title: 'Aggregates & grouping',
    summary: 'Summarise many rows as counts, totals, or per-group results.',
    explanation: [
      'An aggregate computes a summary from multiple input rows. COUNT(*) counts rows, SUM totals values, and AVG calculates an average. GROUP BY divides rows into groups so aggregates can produce one summary per group.',
      'WHERE filters individual rows before grouping; HAVING filters groups based on the grouped result. COUNT(column) counts non-null values in that column, which can differ from COUNT(*).',
    ],
    example:
      'SELECT department, COUNT(*)\nFROM employees\nGROUP BY department\nHAVING COUNT(*) >= 3;\n\nShow departments with at least three employee rows.',
    takeaway: 'Filtering rows and filtering aggregate groups happen at different stages.',
    sources: [
      { title: 'PostgreSQL · Aggregate tutorial', url: `${pg}tutorial-agg.html` },
      { title: 'PostgreSQL · Aggregate function reference', url: `${pg}functions-aggregate.html` },
    ],
    questions: [
      ['What does COUNT(*) count?', 'Input rows.'],
      [
        'What does GROUP BY do?',
        'Collects rows into groups for grouped results such as aggregates.',
      ],
      ['Which SQL clause filters groups after aggregation?', 'HAVING.'],
      ['What does SUM compute?', 'The total of its non-null input values.'],
      ['How does COUNT(column) treat NULL values?', 'It excludes them from the count.'],
    ],
  },
  {
    id: 'core-normalisation',
    field: 'databases',
    title: 'Normalisation & repeated facts',
    summary: 'Store related facts so one change does not require many inconsistent edits.',
    explanation: [
      'Database normalisation organises relational tables using rules about data dependencies. A practical aim is to avoid storing the same fact in many places where copies can disagree. Related tables connect through keys.',
      'If every order stores its customer’s current address, an address change requires many edits. Keeping that current address with the customer can avoid inconsistent copies. Decide what a fact means first: a historical shipping address on an order is a different fact and may need to remain unchanged.',
    ],
    example:
      'customers: customer_id, current_address\norders: order_id, customer_id\n\nUpdating the customer’s current address changes one customer row.',
    takeaway:
      'Separate independently maintained facts; distinguish repetition from intentional historical records.',
    sources: [
      {
        title: 'Microsoft Learn · Database normalisation basics',
        url: 'https://learn.microsoft.com/en-us/previous-versions/troubleshoot/microsoft-365/microsoft-365-apps/access/database-normalization-description',
      },
    ],
    questions: [
      [
        'What problem can duplicated current facts cause?',
        'Copies can disagree after only some are updated.',
      ],
      [
        'What is an update anomaly?',
        'A change must be repeated across copies of a fact, risking inconsistency.',
      ],
      [
        'How can related normalised tables be connected?',
        'Through keys, commonly primary-key and foreign-key relationships.',
      ],
      [
        'Must an order’s historical shipping address change when a customer moves?',
        'No. It records a past fact rather than the customer’s current address.',
      ],
    ],
  },
];

// Append after the two original questions, preserving all existing card IDs.
export const additionalQuestions: Record<string, [string, string][]> = {
  binary: [
    ['Which digits are used in binary notation?', '0 and 1.'],
    ['What is the value of binary 100?', 'Decimal 4.'],
    ['What decimal value does hexadecimal A represent?', '10.'],
  ],
  'bits-bytes': [
    ['What is a bit?', 'A binary digit with one of two states, conventionally 0 or 1.'],
    ['What is a byte?', 'A group of eight bits.'],
    ['How many bits make one byte?', 'Eight bits.'],
    ['How many possible states does one bit have?', 'Two.'],
    ['How many bits are in three bytes?', '24 bits.'],
  ],
  integers: [
    ['Can an unsigned integer represent a negative number?', 'No.'],
    ['What is the largest unsigned 8-bit integer?', '255.'],
    [
      'What is integer overflow?',
      'A mathematical integer result lies outside the available type’s range.',
    ],
  ],
  encoding: [
    [
      'What is a Unicode code point?',
      'A numerical value used by Unicode to identify a text element.',
    ],
    ['How many bytes does UTF-8 use for an ASCII character?', 'One byte.'],
    [
      'Does changing a text encoding necessarily change the intended text?',
      'No. Different encodings can represent the same text using different bytes.',
    ],
  ],
  'arrays-lists': [
    ['What identifies a position within an array?', 'An index.'],
    ['What connects one linked-list node to another?', 'A reference or pointer.'],
    [
      'Why can inserting at the start of an array require moving items?',
      'Existing items must shift to leave room at the first position.',
    ],
  ],
  'stacks-queues': [
    ['What is the operation that adds an item to a stack called?', 'Push.'],
    ['What does pop do to a nonempty stack?', 'Removes and returns its top item.'],
    ['What is adding an item to a FIFO queue called?', 'Enqueue.'],
  ],
  'hash-tables': [
    [
      'What does a hash function help choose in a hash table?',
      'A storage location or bucket for a key.',
    ],
    ['Do equal hash values prove two keys are equal?', 'No. Distinct keys can collide.'],
    [
      'What does resizing a hash table usually require?',
      'Redistributing its entries into the new table layout.',
    ],
  ],
  'trees-graphs': [
    ['What are the two basic parts of a graph?', 'Vertices and edges.'],
    ['What does a directed edge represent?', 'A connection with a specified direction.'],
    [
      'What is the root of a rooted tree?',
      'The designated starting vertex at the top of its parent-child hierarchy.',
    ],
  ],
  complexity: [
    [
      'What does input size n usually measure for a list algorithm?',
      'The number of input elements.',
    ],
    ['What does auxiliary space measure?', 'Additional memory used beyond the input storage.'],
    [
      'Does O(1) mean an operation takes exactly one machine instruction?',
      'No. It means its bounded cost does not grow with input size.',
    ],
  ],
  search: [
    ['Can linear search work on an unsorted list?', 'Yes. It checks candidates individually.'],
    [
      'Which part of an ordered array does binary search compare against first?',
      'The middle of its current search range.',
    ],
    [
      'Can binary search correctly report that a target is absent?',
      'Yes. It stops when no candidate positions remain.',
    ],
  ],
  sorting: [
    ['What does sorting do to a collection?', 'Arranges items according to a chosen ordering.'],
    [
      'Does sorting normally remove duplicate values?',
      'No. Ordering and removing duplicates are separate operations.',
    ],
    ['What is a sort key?', 'The value used to compare and order records.'],
  ],
  recursion: [
    ['What makes a function recursive?', 'It calls itself directly or indirectly.'],
    ['What is 3 factorial, written 3!?', '3 × 2 × 1 = 6.'],
    ['What can a caller do after its recursive call returns?', 'Resume execution after that call.'],
  ],
  processes: [
    [
      'Can one stored program be started as multiple processes?',
      'Yes. Each running instance can have its own process state.',
    ],
    ['What is a thread?', 'An execution stream within a process.'],
    ['Does each thread normally have its own call stack?', 'Yes.'],
  ],
  memory: [
    ['What is a virtual address space?', 'The memory-address view made available to a process.'],
    ['What is a memory page?', 'A fixed-size unit used in paging-based virtual memory.'],
    [
      'Does virtual memory create unlimited physical RAM?',
      'No. Physical memory and backing storage remain finite.',
    ],
  ],
  concurrency: [
    ['What does parallel execution mean?', 'Tasks execute simultaneously.'],
    ['What is a critical section?', 'Code accessing shared state that needs coordinated access.'],
    [
      'What does a mutex allow cooperating threads to do?',
      'Give one thread at a time exclusive access to a protected section.',
    ],
  ],
  files: [
    [
      'What does an open file handle identify for a process?',
      'An opened resource used for operations such as reads and writes.',
    ],
    ['What does reading a file do?', 'Retrieves data from the file.'],
    [
      'What does buffering a write mean?',
      'Holding written data temporarily before passing it to a later layer.',
    ],
  ],
  dns: [
    ['What does DNS stand for?', 'Domain Name System.'],
    [
      'Is DNS itself a protocol for downloading web-page content?',
      'No. It resolves names and associated records.',
    ],
    ['What is a cached DNS answer?', 'A previously retrieved answer temporarily stored for reuse.'],
  ],
  'tcp-udp': [
    ['What is a UDP datagram?', 'An individual message carried by UDP.'],
    ['What transport unit does a TCP application receive?', 'An ordered stream of bytes.'],
    ['Does UDP itself guarantee delivery order?', 'No.'],
  ],
  http: [
    ['Which HTTP method normally requests a representation of a resource?', 'GET.'],
    ['What is an HTTP header?', 'A named field carrying information about a request or response.'],
    ['Who sends an HTTP response in a normal client-server exchange?', 'The server.'],
  ],
  tls: [
    ['What does TLS stand for?', 'Transport Layer Security.'],
    [
      'What does verifying a server certificate and hostname help establish?',
      'That the connection is to the intended authenticated server.',
    ],
    [
      'Can a receiving TLS endpoint read the application data after decryption?',
      'Yes. TLS protects transport, not secrecy from the intended endpoint.',
    ],
  ],
  relational: [
    ['What does a table row represent?', 'One record with values for the table’s columns.'],
    [
      'Can two rows share the same primary-key value in one table?',
      'No. Primary-key values must uniquely identify rows.',
    ],
    ['Can a primary-key value be NULL?', 'No.'],
  ],
  indexes: [
    [
      'Is an index the same thing as the entire table?',
      'No. It is an additional structure used to locate table data.',
    ],
    ['Does maintaining an index use storage?', 'Yes.'],
    [
      'Can inserting a row require updating indexes?',
      'Yes. Relevant index entries must be maintained.',
    ],
  ],
  transactions: [
    ['Which SQL command commits a transaction?', 'COMMIT.'],
    ['Which SQL command cancels an uncommitted transaction’s changes?', 'ROLLBACK.'],
    [
      'Why group two account-transfer updates in one transaction?',
      'So the debit and credit commit together or are rolled back together.',
    ],
  ],
  joins: [
    ['What does a join combine?', 'Rows from table sources according to a matching condition.'],
    [
      'Can one row match several rows in a join?',
      'Yes. Multiple matching combinations can appear in the result.',
    ],
    ['What fills right-side columns when a left join finds no match?', 'NULL values.'],
  ],
};
