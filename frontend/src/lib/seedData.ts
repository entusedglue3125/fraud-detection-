// Seed data for the frontend when no backend is available

export const SEED_USERS = [
  { id: 'usr_1', name: 'Alice', balance: 10000 },
  { id: 'usr_2', name: 'Bob', balance: 5000 },
  { id: 'usr_3', name: 'Charlie', balance: 8000 },
  { id: 'usr_4', name: 'Diana', balance: 15000 },
  { id: 'usr_5', name: 'Eve', balance: 12000 },
  { id: 'usr_6', name: 'Frank', balance: 7500 },
];

export const SEED_GRAPH_DATA = {
  nodes: SEED_USERS.map(u => ({ id: u.id })),
  links: [
    { source: 'usr_1', target: 'usr_2', weight: 1, amount: 500 },
    { source: 'usr_2', target: 'usr_3', weight: 1, amount: 1200 },
    { source: 'usr_3', target: 'usr_4', weight: 1, amount: 800 },
    { source: 'usr_1', target: 'usr_4', weight: 1, amount: 2500 },
    { source: 'usr_4', target: 'usr_5', weight: 1, amount: 3000 },
    { source: 'usr_5', target: 'usr_6', weight: 1, amount: 1500 },
    { source: 'usr_6', target: 'usr_2', weight: 1, amount: 900 },
    { source: 'usr_3', target: 'usr_5', weight: 1, amount: 600 },
  ],
};

export const SEED_TRANSACTIONS = [
  {
    id: 'tx_1711234567890_001',
    senderId: 'usr_1',
    receiverId: 'usr_2',
    amount: 500,
    timestamp: Date.now() - 3600000,
    fraudRisk: 0,
    fraudReasons: [],
    status: 'COMPLETED',
  },
  {
    id: 'tx_1711234567890_002',
    senderId: 'usr_2',
    receiverId: 'usr_3',
    amount: 1200,
    timestamp: Date.now() - 3000000,
    fraudRisk: 0,
    fraudReasons: [],
    status: 'COMPLETED',
  },
  {
    id: 'tx_1711234567890_003',
    senderId: 'usr_3',
    receiverId: 'usr_4',
    amount: 800,
    timestamp: Date.now() - 2400000,
    fraudRisk: 0,
    fraudReasons: [],
    status: 'COMPLETED',
  },
  {
    id: 'tx_1711234567890_004',
    senderId: 'usr_1',
    receiverId: 'usr_4',
    amount: 2500,
    timestamp: Date.now() - 1800000,
    fraudRisk: 0,
    fraudReasons: [],
    status: 'COMPLETED',
  },
  {
    id: 'tx_1711234567890_005',
    senderId: 'usr_4',
    receiverId: 'usr_5',
    amount: 3000,
    timestamp: Date.now() - 1200000,
    fraudRisk: 0,
    fraudReasons: [],
    status: 'COMPLETED',
  },
];
