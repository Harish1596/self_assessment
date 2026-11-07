import type { FieldId } from '../types';

export const allFields: { id: FieldId; name: string; description: string; color: string }[] = [
  {
    id: 'computing',
    name: 'Computer basics',
    description: 'What computers are and how their parts work',
    color: 'green',
  },
  {
    id: 'representation',
    name: 'Data representation',
    description: 'How computers represent information',
    color: 'green',
  },
  {
    id: 'logic',
    name: 'Logic & mathematics',
    description: 'Reasoning, sets, functions and counting',
    color: 'violet',
  },
  {
    id: 'programming',
    name: 'Programming basics',
    description: 'Expressing instructions and organising programs',
    color: 'blue',
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
  {
    id: 'engineering',
    name: 'Software engineering',
    description: 'Building, testing and maintaining working software',
    color: 'amber',
  },
  {
    id: 'security',
    name: 'Security basics',
    description: 'Protecting data and controlling access',
    color: 'rose',
  },
];
