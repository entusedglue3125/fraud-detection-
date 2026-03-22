import { create } from 'zustand';

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
}

export const useStore = create<StoreState>((set) => ({
  users: [],
  graphData: { nodes: [], links: [] },
  transactions: [],
  fraudAlerts: [],
  setUsers: (users) => set({ users }),
  setGraphData: (graphData) => set({ graphData }),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (tx) => set((state) => {
    // avoid duplicates if we receive it multiple times
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
  })
}));
