import { create } from 'zustand';
import { engine } from '../lib/transactionEngine';
import type { Transaction } from '../lib/transactionEngine';
import { SEED_USERS, SEED_GRAPH_DATA, SEED_TRANSACTIONS } from '../lib/seedData';

// Initialize engine with seed data
engine.loadUsers(SEED_USERS);
engine.loadGraphEdges(SEED_GRAPH_DATA.links);

interface StoreState {
  users: any[];
  graphData: { nodes: any[], links: any[] };
  transactions: any[];
  fraudAlerts: any[];
  setUsers: (users: any[]) => void;
  setGraphData: (data: { nodes: any[], links: any[] }) => void;
  setTransactions: (txs: any[]) => void;
  addTransaction: (tx: any) => void;
  addFraudAlert: (tx: any) => void;
  // Client-side transaction processing
  processTransaction: (senderId: string, receiverId: string, amount: number) => Transaction;
}

export const useStore = create<StoreState>((set) => ({
  users: engine.getUsers(),
  graphData: engine.getGraphData(),
  transactions: [...SEED_TRANSACTIONS],
  fraudAlerts: [],
  setUsers: (users) => set({ users }),
  setGraphData: (graphData) => set({ graphData }),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (tx) => set((state) => {
    if (state.transactions.find(t => t.id === tx.id)) {
        return state;
    }
    return { transactions: [tx, ...state.transactions] };
  }),
  addFraudAlert: (tx) => set((state) => {
    if (state.fraudAlerts.find(t => t.id === tx.id)) {
        return state;
    }
    return { fraudAlerts: [tx, ...state.fraudAlerts] };
  }),
  processTransaction: (senderId: string, receiverId: string, amount: number) => {
    const tx = engine.createAndProcessTransaction(senderId, receiverId, amount);
    
    set((state) => {
      const updates: any = {
        transactions: [tx, ...state.transactions],
        users: engine.getUsers(),
        graphData: engine.getGraphData(),
      };
      
      if (tx.status === 'BLOCKED_FRAUD') {
        updates.fraudAlerts = [tx, ...state.fraudAlerts];
      }
      
      return updates;
    });
    
    return tx;
  },
}));
