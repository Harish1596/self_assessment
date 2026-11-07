import type { Card, Concept, FieldId, Source } from './types';

export const fields: { id: FieldId; name: string; description: string; color: string }[] = [
  {
    id: 'representation',
    name: 'Data representation',
    description: 'How computers represent information',
    color: 'green',
  },
  {
    id: 'structures',
    name: 'Data structures',
    description: 'Organising data for useful operations',
    color: 'blue',
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    description: 'Reasoning about steps and efficiency',
    color: 'amber',
  },
  {
    id: 'systems',
    name: 'Operating systems',
    description: 'Processes, memory, and concurrency',
    color: 'rose',
  },
  {
    id: 'networking',
    name: 'Networking',
    description: 'How connected systems communicate',
    color: 'violet',
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'Storing, relating, and querying data',
    color: 'teal',
  },
];
const source = (title: string, url: string): Source => ({ title, url });
const cs0 = source(
  'Harvard CS50 · Representing information',
  'https://cs50.harvard.edu/x/notes/0/',
);
const cs3 = source('Harvard CS50 · Algorithms', 'https://cs50.harvard.edu/x/notes/3/');
const ods = source(
  'Pat Morin · Open Data Structures',
  'https://opendatastructures.org/ods-python/',
);
const os = source(
  'Arpaci-Dusseau & Arpaci-Dusseau · Operating Systems: Three Easy Pieces',
  'https://pages.cs.wisc.edu/~remzi/OSTEP/',
);
const http = source(
  'MDN · Overview of HTTP',
  'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview',
);

// Original teaching notes synthesised from the linked references; not copied source text.
// Stable IDs connect library entries, questions and browser-local review history.
export const concepts: Concept[] = [
  {
    id: 'binary',
    field: 'representation',
    title: 'Binary & hexadecimal',
    summary: 'Understand place values, number bases, and how bits represent numbers.',
    explanation: [
      'A number is a value; its written representation depends on a base. Binary uses two digits, 0 and 1. Moving left through its positions gives weights of 1, 2, 4, 8, and so on. Add the weights whose bits are 1 to recover the value.',
      'Hexadecimal uses sixteen digits: 0–9 and A–F. One hexadecimal digit represents exactly four bits, so it is a compact way to inspect bytes, addresses, and colour values. Changing the base changes the notation, not the underlying value.',
    ],
    example:
      'Binary 0010 1101 = 32 + 8 + 4 + 1 = decimal 45.\nGroup into four bits: 0010 = 2, 1101 = D.\nSo 0b00101101 = 45 = 0x2D.',
    takeaway: 'A hexadecimal digit is four bits; two hexadecimal digits can represent a byte.',
    sources: [cs0],
    questions: [
      ['How do you convert binary 1010 to decimal?', 'Add the active place values: 8 + 2 = 10.'],
      [
        'Why is hexadecimal useful for representing binary data?',
        'Each hexadecimal digit maps to four bits, making long binary values easier to read without losing information.',
      ],
    ],
  },
  {
    id: 'bits-bytes',
    field: 'representation',
    title: 'Bits, bytes & storage units',
    summary: 'Distinguish information units and calculate how many values fit.',
    explanation: [
      'A bit has two possible states. A byte is eight bits and can encode 256 distinct patterns. With n bits there are 2ⁿ possible patterns; what those patterns mean depends on the encoding.',
      'Unit prefixes matter. A kilobyte (kB) is 1,000 bytes; a kibibyte (KiB) is 1,024 bytes. Network rates are commonly given in bits per second, while file sizes are usually in bytes. Distinguish b from B when estimating transfers.',
    ],
    example:
      '8 bits → 2⁸ = 256 patterns (unsigned integers 0–255).\n1 MiB = 1,048,576 bytes.\nAn ideal 80 Mbit/s connection transfers 10 MB/s before overhead.',
    takeaway:
      'A count of patterns is not the same as the largest representable value: unsigned n-bit values end at 2ⁿ − 1.',
    sources: [cs0],
    questions: [
      [
        'How many distinct values can eight bits represent?',
        '256 distinct patterns. If interpreted as unsigned integers, their values range from 0 through 255.',
      ],
      [
        'What is the difference between a megabyte and a megabit?',
        'A byte contains eight bits, so one MB is eight Mbit. Use matching decimal or binary prefixes when converting.',
      ],
    ],
  },
  {
    id: 'integers',
    field: 'representation',
    title: 'Signed integers & overflow',
    summary: 'Learn integer ranges and what happens when a value no longer fits.',
    explanation: [
      'An unsigned n-bit integer represents values from 0 to 2ⁿ − 1. A signed two’s-complement n-bit integer represents −2ⁿ⁻¹ through 2ⁿ⁻¹ − 1. The same bits can therefore have different values under different interpretations.',
      'Overflow occurs when a mathematical result is outside the available range. The resulting behaviour is language- and operation-dependent: it may wrap, throw, or be undefined. Never assume the behaviour of one language applies to another.',
    ],
    example:
      '8-bit unsigned: 0 to 255.\n8-bit two’s complement: −128 to 127.\n11111111 means 255 unsigned, but −1 in two’s complement.\nPython integers grow; JavaScript Number uses floating point.',
    takeaway: 'The bit width and interpretation together determine the range.',
    sources: [source('Harvard CS50 · C and integer limits', 'https://cs50.harvard.edu/x/notes/1/')],
    questions: [
      [
        'What is the range of an 8-bit signed two’s-complement integer?',
        '−128 through 127, using the formula −2⁷ through 2⁷ − 1.',
      ],
      [
        'Does integer overflow behave identically in every language?',
        'No. Behaviour depends on the language, numeric type, and operation. Check the relevant specification rather than assuming wraparound.',
      ],
    ],
  },
  {
    id: 'encoding',
    field: 'representation',
    title: 'Text encoding & Unicode',
    summary: 'Separate characters, code points, and the bytes used to store text.',
    explanation: [
      'Unicode assigns code points to characters and other text elements. An encoding specifies how to turn those code points into bytes. UTF-8 uses one to four bytes per Unicode scalar value and preserves ASCII byte values for the ASCII range.',
      'A user-perceived character can contain multiple code points, such as a letter followed by a combining accent. Byte length, code-point count, and visible-character count can all differ. Use Unicode-aware operations when validating or truncating user text.',
    ],
    example:
      '"A": U+0041 → UTF-8 byte 41 (hex).\n"é": U+00E9 → UTF-8 bytes C3 A9.\nAn accented letter may also be represented with a combining mark.',
    takeaway: 'One visible character does not necessarily occupy one byte or one code point.',
    sources: [source('MDN · UTF-8', 'https://developer.mozilla.org/en-US/docs/Glossary/UTF-8')],
    questions: [
      [
        'How are Unicode and UTF-8 different?',
        'Unicode defines code points; UTF-8 is a variable-length encoding that stores Unicode scalar values as one to four bytes.',
      ],
      [
        'Why can a string’s byte length differ from its visible length?',
        'Some code points require multiple bytes, and one visible character may combine multiple code points.',
      ],
    ],
  },
  {
    id: 'arrays-lists',
    field: 'structures',
    title: 'Arrays & linked lists',
    summary: 'Compare indexed access, memory layout, and insertion costs.',
    explanation: [
      'An array stores elements in indexed positions, typically in a contiguous region. This enables constant-time indexed access. In a dynamic array, appending is amortised constant time, but an occasional resize copies existing elements.',
      'A linked list stores nodes connected by references. Finding a position requires traversal; insertion or deletion can be constant time when the necessary node references are already available. Linked lists also spend memory on references and usually have worse cache locality.',
    ],
    example:
      'Array: [A][B][C] → access item 2 directly.\nList: A → B → C → follow links to reach C.\nInsert at array front: shift existing elements.\nInsert at list head: update a few references.',
    takeaway: '“List insertion is O(1)” assumes you already have the required position references.',
    sources: [ods],
    questions: [
      [
        'Why can an array access an element by index in constant time?',
        'Its layout allows an element’s location to be calculated from the start address, index, and element size, without walking earlier elements.',
      ],
      [
        'Is inserting into a linked list always constant time?',
        'The pointer update can be O(1), but finding the insertion position may first require O(n) traversal.',
      ],
    ],
  },
  {
    id: 'stacks-queues',
    field: 'structures',
    title: 'Stacks & queues',
    summary: 'Use LIFO and FIFO ordering to model common computing tasks.',
    explanation: [
      'A stack removes the most recently added item first: last in, first out (LIFO). Push adds an item; pop removes it. A stack is useful for nested function calls, backtracking, and undo histories.',
      'A queue removes the oldest added item first: first in, first out (FIFO). Enqueue adds; dequeue removes. Suitable implementations avoid shifting every element on removal, for example by using a circular buffer or a linked structure with head and tail references.',
    ],
    example:
      'Add A, then B, then C.\nStack removal: C, B, A.\nQueue removal: A, B, C.\nAn array-backed queue can track its head instead of shifting on every removal.',
    takeaway:
      'A stack or queue describes an access policy, not one mandatory storage implementation.',
    sources: [ods],
    questions: [
      [
        'How does removal order differ between a stack and a queue?',
        'A stack is LIFO: newest first. A queue is FIFO: oldest first.',
      ],
      [
        'Which structure fits a normal first-come, first-served task list?',
        'A queue, because tasks are removed in the order they were added.',
      ],
    ],
  },
  {
    id: 'hash-tables',
    field: 'structures',
    title: 'Hash tables & collisions',
    summary: 'Map keys to values and understand the limits of constant-time lookup.',
    explanation: [
      'A hash table applies a hash function to a key to select a storage location. Distinct keys may map to the same location; this is a collision. Common handling strategies include separate chaining and open addressing.',
      'Lookup, insertion, and removal are expected O(1) with appropriate hashing and load control, not guaranteed O(1) for every input. A crowded table or many collisions can degrade performance. Resizing redistributes entries and has a cost.',
    ],
    example:
      'hash("cat") → bucket 3\nhash("dog") → bucket 3\nA collision strategy stores both keys and compares them on lookup.\nMatching hashes alone do not prove equal keys.',
    takeaway: 'Expected constant time depends on hashing assumptions and table occupancy.',
    sources: [ods],
    questions: [
      [
        'What is a hash collision?',
        'Two distinct keys map to the same hash value or table location. The table needs a strategy to distinguish and store them.',
      ],
      [
        'Are hash-table lookups guaranteed to be O(1)?',
        'No. They are typically expected O(1) under suitable assumptions. Collisions and implementation details can produce worse cases.',
      ],
    ],
  },
  {
    id: 'trees-graphs',
    field: 'structures',
    title: 'Trees & graphs',
    summary: 'Model relationships and distinguish hierarchies from general connections.',
    explanation: [
      'A graph contains vertices and edges. Edges may be directed or undirected and may carry weights. Graphs describe dependencies, routes, and social connections. Adjacency lists store neighbours; adjacency matrices record possible connections in a table.',
      'An undirected tree is a connected graph with no cycles. A rooted tree adds a parent/child hierarchy. A binary search tree adds an ordering rule, but only suitable balancing guarantees logarithmic height. A plain search tree can degenerate into a chain.',
    ],
    example:
      'Tree: a folder hierarchy with one parent per non-root node.\nGraph: web pages with links, including cycles.\nA balanced search tree of 1,024 items has logarithmic height; an unbalanced one can approach a chain.',
    takeaway: 'Binary, binary-search, and balanced describe different properties of a tree.',
    sources: [ods],
    questions: [
      [
        'What makes an undirected graph a tree?',
        'It is connected and contains no cycles. A tree with n vertices has n − 1 edges.',
      ],
      [
        'Why does a binary search tree need balancing?',
        'Without balancing its height may grow linearly, making search O(n). Balanced variants maintain logarithmic height.',
      ],
    ],
  },
  {
    id: 'complexity',
    field: 'algorithms',
    title: 'Time & space complexity',
    summary: 'Describe how work and memory grow as inputs get larger.',
    explanation: [
      'Complexity describes growth with input size rather than a particular machine’s stopwatch time. Big O expresses an asymptotic upper bound. State which input n measures and whether you mean worst-case, average-case, or amortised cost.',
      'Time and extra memory can grow differently. Scanning n items once is O(n) time. Keeping a running sum uses O(1) auxiliary space; copying the input uses O(n) extra space. Constants and cache behaviour still matter for practical performance.',
    ],
    example:
      'One loop over n items: O(n).\nTwo independent loops over n: O(n), not O(n²).\nNested full loops: O(n²).\nHalving the search range repeatedly: O(log n).',
    takeaway:
      'Big O is a growth bound; it does not automatically mean worst-case or exact runtime.',
    sources: [cs3],
    questions: [
      [
        'What does O(n) time tell you?',
        'The work is asymptotically bounded by a constant multiple of input size n, after some threshold. It does not give an exact runtime.',
      ],
      [
        'Do two consecutive loops over n elements imply O(n²)?',
        'No. Their costs add: O(n) + O(n) = O(n). Nested full loops usually multiply to O(n²).',
      ],
    ],
  },
  {
    id: 'search',
    field: 'algorithms',
    title: 'Linear & binary search',
    summary: 'Choose a search method based on ordering and access patterns.',
    explanation: [
      'Linear search inspects candidates one at a time and works on unsorted collections. Its worst-case cost is O(n). Binary search compares against the middle of an ordered search range and discards half of that range each step.',
      'Binary search needs a suitable ordering and access model. On a sorted array, it takes O(log n) comparisons and time. Sorting a collection first has its own cost, so a single search does not always justify preprocessing. Be precise about inclusive and exclusive range boundaries.',
    ],
    example:
      'Sorted values: [2, 5, 8, 12, 19, 23, 31].\nSearch 23: compare 12 → right half.\nCompare 23 → found.\nDo not apply this discard rule to an unsorted array.',
    takeaway:
      'Binary search gains efficiency by exploiting order, not simply by starting in the middle.',
    sources: [cs3],
    questions: [
      [
        'What precondition does binary search require on an array?',
        'The elements must be ordered consistently with the comparison used by the search.',
      ],
      [
        'What are the worst-case time costs of linear and binary search on arrays?',
        'Linear search is O(n). Binary search on a sorted array is O(log n).',
      ],
    ],
  },
  {
    id: 'sorting',
    field: 'algorithms',
    title: 'Sorting fundamentals',
    summary: 'Compare sorting strategies, stability, and extra-memory trade-offs.',
    explanation: [
      'Sorting arranges items according to an ordering. Elementary comparison sorts such as selection sort take O(n²) time in the worst case. Merge sort divides the input, sorts each part, and merges the results in O(n log n) time.',
      'Stability means equal-key items retain their original relative order. It matters when sorting records that already have meaningful ordering. Array merge sort normally uses O(n) auxiliary storage; other algorithms trade space, stability, and worst-case behaviour differently.',
    ],
    example:
      'Input: (Ada, 8), (Ben, 5), (Cam, 8).\nStable ascending score sort:\n(Ben, 5), (Ada, 8), (Cam, 8).\nAda remains before Cam because their scores are equal.',
    takeaway:
      '“Fast sort” is incomplete: consider input size, stability, memory, and worst-case requirements.',
    sources: [cs3],
    questions: [
      [
        'What is a stable sorting algorithm?',
        'It preserves the relative order of items with equal sort keys.',
      ],
      [
        'What is the usual time and extra-space cost of array merge sort?',
        'O(n log n) time and O(n) auxiliary storage for the merge buffer, with recursion overhead as well.',
      ],
    ],
  },
  {
    id: 'recursion',
    field: 'algorithms',
    title: 'Recursion & the call stack',
    summary: 'Break a problem into smaller instances and stop at a base case.',
    explanation: [
      'A recursive function solves a problem using calls to itself on smaller or simpler inputs. A base case returns without another recursive call. The recursive step must make progress toward a base case to terminate.',
      'Each active call normally needs a stack frame. A solution can therefore use significant memory even without allocating a visible collection. Some recursive formulations repeat subproblems; memoisation caches results to avoid repeated work. Recursion and iteration are alternatives, not universal indicators of efficiency.',
    ],
    example:
      'factorial(n):\n  if n <= 1: return 1\n  return n * factorial(n - 1)\n\nfactorial(4) = 4 × 3 × 2 × 1 = 24\nThis version has O(n) time and O(n) call depth.',
    takeaway: 'A base case is necessary, and recursive calls must actually approach it.',
    sources: [cs3],
    questions: [
      [
        'What two ingredients make a recursive definition terminate?',
        'A reachable base case and recursive steps that progress toward it.',
      ],
      [
        'Why can a recursive function use O(n) memory without building a list?',
        'Up to n calls can remain active, each retaining a stack frame and local state.',
      ],
    ],
  },
  {
    id: 'processes',
    field: 'systems',
    title: 'Processes & threads',
    summary: 'Understand running programs, execution units, and shared resources.',
    explanation: [
      'A process is a running program together with resources such as an address space and open handles. The operating system schedules execution and isolates processes from one another. A program stored on disk is not itself an executing process.',
      'A thread is an execution stream within a process. Threads in one process generally share its address space and resources, while each has its own execution state and stack. Sharing data makes communication convenient but introduces coordination problems.',
    ],
    example:
      'A desktop app is started twice → two process instances.\nOne process might run a UI thread and worker threads.\nWorkers can share process memory, but their instruction positions and stacks differ.',
    takeaway: 'Threads share much of a process’s environment; they do not share one call stack.',
    sources: [
      source(
        'OSTEP · The abstraction: the process',
        'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf',
      ),
      os,
    ],
    questions: [
      [
        'How does a process differ from a program?',
        'A program is stored instructions and data. A process is an executing instance with runtime state and operating-system resources.',
      ],
      [
        'What do threads in the same process typically share?',
        'The address space and resources such as open files. Each thread retains its own stack, registers, and execution position.',
      ],
    ],
  },
  {
    id: 'memory',
    field: 'systems',
    title: 'Memory & virtual addresses',
    summary: 'Separate a process’s view of memory from physical RAM.',
    explanation: [
      'Virtual memory gives a process an address-space abstraction. Hardware and the operating system translate virtual addresses into physical locations and enforce access permissions. Two processes can use the same virtual address while referring to different physical memory.',
      'Paging divides memory into fixed-size units. A page fault transfers control to the operating system when a translation or access needs handling; it does not always mean a disk read. Invalid accesses may fail instead. Virtual memory is an isolation and management mechanism, not unlimited free RAM.',
    ],
    example:
      'Process A: virtual address X → physical frame 12.\nProcess B: virtual address X → physical frame 37.\nThe equal virtual addresses do not imply shared data.\nExplicit shared mappings are possible.',
    takeaway: 'A virtual address is meaningful in the context of its address space.',
    sources: [os],
    questions: [
      [
        'Why can two processes use the same virtual address safely?',
        'Their address spaces can map that address to different physical memory, with isolation enforced by the OS and hardware.',
      ],
      [
        'Does every page fault require reading from disk?',
        'No. Some faults allocate a new page or handle permissions/copy-on-write; invalid accesses may fail. Disk access is only one possibility.',
      ],
    ],
  },
  {
    id: 'concurrency',
    field: 'systems',
    title: 'Concurrency & synchronisation',
    summary: 'Recognise interleaving, races, and protected critical sections.',
    explanation: [
      'Concurrency means multiple tasks make progress over overlapping periods; parallelism means execution occurs simultaneously. Even one CPU core can interleave tasks. A race condition occurs when correctness depends on an uncontrolled ordering of operations.',
      'A mutex can protect a critical section so only one cooperating execution stream enters at a time. Locking must consistently cover shared-state access. Deadlock can occur when tasks wait in a cycle for resources held by one another; consistent lock ordering can help avoid such cycles.',
    ],
    example:
      'Counter starts at 0.\nWorker A reads 0; worker B reads 0.\nA writes 1; B writes 1 → an increment is lost.\nProtect the read-modify-write operation, not only the final assignment.',
    takeaway:
      'An operation that looks like one source-code statement may involve several machine-level steps.',
    sources: [os],
    questions: [
      [
        'Can concurrent tasks run on a single CPU core?',
        'Yes. The scheduler can interleave them. Parallel execution requires simultaneous execution resources.',
      ],
      [
        'How can two counter increments produce only one increase?',
        'Both workers can read the same old value and overwrite each other’s updates. Synchronisation or an appropriate atomic operation is needed.',
      ],
    ],
  },
  {
    id: 'files',
    field: 'systems',
    title: 'Files, persistence & I/O',
    summary: 'Understand the difference between a successful write and durable storage.',
    explanation: [
      'A file exposes named persistent data through an operating-system interface. Reads and writes pass through layers that may cache or buffer data. File descriptors or handles identify open resources within a process.',
      'A successful write does not necessarily mean data has reached durable storage. Applications that need crash durability must use the correct flush/synchronisation operations and account for filesystem behaviour. Resources should be closed reliably; storage errors and partial operations need handling.',
    ],
    example:
      'Write application data → OS page cache → storage device.\nA crash before persistence can lose buffered changes.\nFor durable updates, use a documented protocol such as writing a temporary file, syncing, renaming, and syncing the directory where required.',
    takeaway: 'Visibility to a reader and durability across a crash are separate guarantees.',
    sources: [os],
    questions: [
      [
        'Does a successful file write always mean the data survives a power loss?',
        'No. Data may still be buffered. Durability requires the appropriate OS and filesystem guarantees and synchronisation steps.',
      ],
      [
        'Why should a program close files reliably?',
        'Open handles consume finite resources; closing releases them and can surface or complete buffered I/O operations, though closing alone is not a universal durability guarantee.',
      ],
    ],
  },
  {
    id: 'dns',
    field: 'networking',
    title: 'DNS & name resolution',
    summary: 'Follow how a hostname is resolved before a connection is made.',
    explanation: [
      'DNS is a distributed naming system. It stores records such as A/AAAA addresses, aliases, and mail-routing information. A resolver finds records for a name, often reusing cached answers instead of repeating the entire lookup process.',
      'Caches retain records according to time-to-live rules. Consequently, changing a DNS record does not force every client to observe the change immediately. DNS resolution is also distinct from the subsequent transport connection, TLS negotiation, and HTTP request.',
    ],
    example:
      'Request https://example.com/docs\n1. Resolve example.com (or use a cached answer).\n2. Connect to the chosen address.\n3. Establish the required secure transport.\n4. Send the HTTP request for /docs.',
    takeaway: 'DNS resolves names and records; it does not fetch the page content.',
    sources: [source('MDN · DNS', 'https://developer.mozilla.org/en-US/docs/Glossary/DNS')],
    questions: [
      [
        'What does DNS do when you visit a website?',
        'It resolves the hostname to relevant records, typically including an IP address used to reach the service.',
      ],
      [
        'Why might a DNS change not be visible to every client immediately?',
        'Resolvers and clients can cache previous answers until their applicable cache lifetimes expire.',
      ],
    ],
  },
  {
    id: 'tcp-udp',
    field: 'networking',
    title: 'TCP & UDP',
    summary: 'Compare reliable byte streams with independent datagrams.',
    explanation: [
      'TCP provides an ordered byte stream with loss detection, retransmission, and flow/congestion control. The application reads bytes, not the original write boundaries, so protocols need their own message framing.',
      'UDP sends datagrams and preserves their boundaries, but does not itself guarantee delivery, ordering, or duplicate suppression. Applications can build additional guarantees on top; QUIC is an example of a transport built over UDP. Neither choice guarantees that a remote business action completed.',
    ],
    example:
      'TCP writes "HEL" and "LO" may be read as "HELLO" or smaller pieces.\nA TCP application needs delimiters, lengths, or another framing scheme.\nUDP delivers whole received datagrams, but one datagram may never arrive.',
    takeaway: 'Reliable transport is not the same as exactly-once application processing.',
    sources: [
      source('IETF · TCP specification (RFC 9293)', 'https://www.rfc-editor.org/rfc/rfc9293.html'),
      source('IETF · UDP specification (RFC 768)', 'https://www.rfc-editor.org/rfc/rfc768.html'),
    ],
    questions: [
      [
        'What does TCP provide that UDP does not provide by itself?',
        'A reliable, ordered byte stream with retransmission and flow/congestion control. UDP provides datagrams without those delivery guarantees.',
      ],
      [
        'Does TCP preserve the boundaries between application writes?',
        'No. It is a byte stream. Applications need a framing protocol to identify messages.',
      ],
    ],
  },
  {
    id: 'http',
    field: 'networking',
    title: 'HTTP requests & responses',
    summary: 'Understand methods, status codes, headers, and stateless exchanges.',
    explanation: [
      'HTTP defines request/response semantics. A request specifies a method, target, headers, and sometimes a body. A response includes a status and headers and may contain a body. Status families distinguish success, redirection, client errors, and server errors.',
      'Stateless means the protocol does not require one request’s semantics to depend on remembered session state from a previous request. Applications can still maintain sessions using cookies, tokens, and server-side storage. HTTP semantics apply across different transport versions.',
    ],
    example:
      'GET /concepts HTTP/1.1\nHost: recall.example\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n{"concepts": []}',
    takeaway: 'HTTP being stateless does not mean a web application cannot have login sessions.',
    sources: [http],
    questions: [
      [
        'What does an HTTP response status code communicate?',
        'The outcome category and specific result of handling a request, such as 200 success, 404 not found, or 500 server error.',
      ],
      [
        'How can login sessions exist if HTTP is stateless?',
        'The application carries an identifier, often in a cookie or token, and uses it to retrieve or verify session state.',
      ],
    ],
  },
  {
    id: 'tls',
    field: 'networking',
    title: 'HTTPS & TLS',
    summary: 'Understand what an encrypted connection protects—and what it does not.',
    explanation: [
      'HTTPS uses TLS to protect HTTP communication. With proper certificate and hostname verification, TLS authenticates the server and provides confidentiality and integrity for data exchanged over the connection.',
      'TLS protects transport between its endpoints. It does not prove the website is honest, prevent application authorisation bugs, or protect data after a receiving endpoint decrypts it. A TLS-terminating proxy becomes a trust boundary that needs consideration.',
    ],
    example:
      'Browser → TLS → reverse proxy → application\nThe browser’s secure connection may end at the proxy.\nProtect the proxy-to-application hop according to its network and threat model.\nStill validate the user’s access to every resource.',
    takeaway: 'Encryption in transit complements application security; it does not replace it.',
    sources: [
      source(
        'MDN · Transport Layer Security',
        'https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security',
      ),
    ],
    questions: [
      [
        'What core protections does properly verified TLS provide?',
        'Transport confidentiality, integrity, and server authentication. Client certificate authentication is also possible but not typical for ordinary browsing.',
      ],
      [
        'Does HTTPS guarantee that an application has correct access control?',
        'No. An encrypted connection can still carry unauthorised requests. The application must independently enforce permissions.',
      ],
    ],
  },
  {
    id: 'relational',
    field: 'databases',
    title: 'Tables, keys & relationships',
    summary: 'Model records and enforce identity and relationships in a relational database.',
    explanation: [
      'A relational database organises data into tables with rows and named columns. A primary key uniquely identifies each row and cannot be null. A foreign key constrains a reference to a valid key in the referenced table, or permits null when the schema allows it.',
      'Constraints express rules at the database boundary, where they protect data even when several applications write concurrently. A relationship is represented by values and constraints; related records are not automatically embedded objects.',
    ],
    example:
      'customers(id PRIMARY KEY, name)\norders(id PRIMARY KEY, customer_id REFERENCES customers(id))\n\norders.customer_id connects an order to its customer.\nA NOT NULL constraint can require every order to have a customer.',
    takeaway: 'A foreign key enforces referential integrity; it is not simply a naming convention.',
    sources: [
      source(
        'PostgreSQL · Constraints',
        'https://www.postgresql.org/docs/current/ddl-constraints.html',
      ),
    ],
    questions: [
      [
        'How does a primary key differ from a foreign key?',
        'A primary key uniquely and non-nullably identifies a row. A foreign key constrains values to reference an eligible key in a related table.',
      ],
      [
        'Why enforce relationships in the database rather than only application code?',
        'Database constraints protect integrity across all writers, including concurrent operations and scripts outside the main application.',
      ],
    ],
  },
  {
    id: 'indexes',
    field: 'databases',
    title: 'Indexes & query performance',
    summary: 'Speed up selective reads while accounting for storage and write costs.',
    explanation: [
      'An index is an additional lookup structure maintained alongside table data. It can help a database find a small set of matching rows without scanning every row. Different index types support different predicates and orderings.',
      'Indexes use storage and must be maintained on writes. The query planner may prefer a scan when many rows match, the table is small, or the index does not suit the query. Use an execution plan and representative data to investigate actual behaviour.',
    ],
    example:
      "CREATE INDEX users_email_idx ON users(email);\nSELECT id FROM users WHERE email = 'ada@example.com';\n\nThe index can help this equality lookup.\nIt does not guarantee every query on users becomes faster.",
    takeaway: 'An index is a trade-off, not a free performance switch.',
    sources: [
      source(
        'PostgreSQL · Introduction to indexes',
        'https://www.postgresql.org/docs/current/indexes-intro.html',
      ),
    ],
    questions: [
      [
        'Why can an index speed up a selective query?',
        'It provides a lookup path to matching rows, often avoiding a full table scan.',
      ],
      [
        'Why not index every column?',
        'Indexes consume storage, slow or complicate writes, and may not help the workload. Choose them based on actual queries and execution plans.',
      ],
    ],
  },
  {
    id: 'transactions',
    field: 'databases',
    title: 'Transactions & ACID',
    summary: 'Group changes and reason about atomicity, consistency, isolation, and durability.',
    explanation: [
      'A transaction groups operations into a unit that can be committed or rolled back. Atomicity prevents partial committed results. Consistency concerns preserving declared invariants. Isolation controls interaction between concurrent transactions. Durability concerns surviving failures after commit under the configured guarantees.',
      'Isolation has levels: do not assume every transaction behaves as if no concurrency exists. Application logic, database constraints, and appropriate isolation or locking must work together to enforce business rules.',
    ],
    example:
      'BEGIN;\nUPDATE accounts SET balance = balance - 25 WHERE id = 1;\nUPDATE accounts SET balance = balance + 25 WHERE id = 2;\nCOMMIT;\n\nBoth changes belong to one transaction; a rollback cancels them together.',
    takeaway:
      'Using a transaction does not automatically make arbitrary concurrent business logic correct.',
    sources: [
      source(
        'PostgreSQL · Transactions',
        'https://www.postgresql.org/docs/current/tutorial-transactions.html',
      ),
    ],
    questions: [
      [
        'What does atomicity mean in a database transaction?',
        'Its changes commit as a unit, or do not commit. Other users should not see a partially committed transaction.',
      ],
      [
        'What are the four ACID properties?',
        'Atomicity, consistency, isolation, and durability. Isolation strength and durability behaviour depend on the system and configuration.',
      ],
    ],
  },
  {
    id: 'joins',
    field: 'databases',
    title: 'Joins & NULL',
    summary: 'Combine related rows and account for missing or unknown values.',
    explanation: [
      'An inner join returns matching row combinations. A left join also retains each left-side row without a match, filling right-side columns with null. Multiple matching rows can expand the result; a join does not automatically return one row per entity.',
      'SQL NULL represents missing or unknown information. Ordinary comparisons with NULL produce unknown, not true or false. Use IS NULL to test it. A WHERE filter on a right-side column can remove the unmatched rows you intended to preserve with a left join.',
    ],
    example:
      'SELECT c.name, o.id\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id;\n\nCustomers without orders remain, with o.id as NULL.\nTest missing orders using WHERE o.id IS NULL.',
    takeaway: 'Think about both matching multiplicity and nulls when predicting join results.',
    sources: [
      source(
        'PostgreSQL · Joins between tables',
        'https://www.postgresql.org/docs/current/tutorial-join.html',
      ),
    ],
    questions: [
      [
        'How does a left join differ from an inner join?',
        'A left join keeps unmatched rows from the left table and fills right-side columns with NULL. An inner join returns only matches.',
      ],
      [
        'Why should you write IS NULL instead of = NULL?',
        'SQL treats ordinary equality with NULL as unknown, so it does not identify null values as true. IS NULL explicitly tests for them.',
      ],
    ],
  },
];

export const cards: Card[] = concepts.flatMap((concept) =>
  concept.questions.map(([question, answer], i) => ({
    id: `${concept.id}-${i + 1}`,
    conceptId: concept.id,
    field: concept.field,
    question,
    answer,
  })),
);
export const fieldById = Object.fromEntries(fields.map((f) => [f.id, f])) as Record<
  FieldId,
  (typeof fields)[number]
>;
