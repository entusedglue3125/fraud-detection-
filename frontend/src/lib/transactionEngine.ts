// Client-side transaction engine — mirrors backend logic for standalone Netlify deployment

type GraphEdge = { node: string; weight: number; amount?: number; id?: string };

class ClientGraph {
  adjacencyList: Map<string, GraphEdge[]>;

  constructor() {
    this.adjacencyList = new Map();
  }

  addNode(node: string) {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, []);
    }
  }

  addEdge(source: string, target: string, weight = 1, metadata: Record<string, any> = {}) {
    if (!this.adjacencyList.has(source)) this.addNode(source);
    if (!this.adjacencyList.has(target)) this.addNode(target);
    this.adjacencyList.get(source)!.push({ node: target, weight, ...metadata });
  }

  hasCycleDFS(startNode: string): string[] | null {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cyclePath: string[] = [];

    const dfs = (node: string): string[] | null => {
      visited.add(node);
      recursionStack.add(node);
      cyclePath.push(node);

      const neighbors = this.adjacencyList.get(node) || [];
      for (const edge of neighbors) {
        const neighbor = edge.node;
        if (!visited.has(neighbor)) {
          const result = dfs(neighbor);
          if (result) return result;
        } else if (recursionStack.has(neighbor)) {
          cyclePath.push(neighbor);
          const cycleStartIndex = cyclePath.indexOf(neighbor);
          return cyclePath.slice(cycleStartIndex);
        }
      }

      recursionStack.delete(node);
      cyclePath.pop();
      return null;
    };

    return dfs(startNode);
  }

  getGraphData() {
    const nodes = Array.from(this.adjacencyList.keys()).map(id => ({ id }));
    const links: any[] = [];
    for (const [source, edges] of this.adjacencyList.entries()) {
      for (const edge of edges) {
        links.push({ source, target: edge.node, weight: edge.weight, amount: edge.amount });
      }
    }
    return { nodes, links };
  }

  // Dijkstra's shortest path
  dijkstra(start: string, end: string): { path: string[]; distance: number } {
    const distances: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const visited = new Set<string>();

    for (const node of this.adjacencyList.keys()) {
      distances[node] = Infinity;
      prev[node] = null;
    }
    distances[start] = 0;

    // Simple priority queue via sorted array
    const pq: { node: string; dist: number }[] = [{ node: start, dist: 0 }];

    while (pq.length > 0) {
      pq.sort((a, b) => a.dist - b.dist);
      const { node: current } = pq.shift()!;

      if (visited.has(current)) continue;
      visited.add(current);

      if (current === end) break;

      for (const edge of this.adjacencyList.get(current) || []) {
        const newDist = distances[current] + edge.weight;
        if (newDist < distances[edge.node]) {
          distances[edge.node] = newDist;
          prev[edge.node] = current;
          pq.push({ node: edge.node, dist: newDist });
        }
      }
    }

    // Reconstruct path
    const path: string[] = [];
    let curr: string | null = end;
    while (curr) {
      path.unshift(curr);
      curr = prev[curr];
    }

    if (path[0] !== start) return { path: [], distance: Infinity };
    return { path, distance: distances[end] };
  }
}

export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  timestamp: number;
  fraudRisk: number;
  fraudReasons: string[];
  status: string;
  priority: number;
}

export class TransactionEngine {
  graph: ClientGraph;
  users: Map<string, any>;
  processedTransactions: Transaction[];

  constructor() {
    this.graph = new ClientGraph();
    this.users = new Map();
    this.processedTransactions = [];
  }

  loadUsers(users: any[]) {
    for (const u of users) {
      this.users.set(u.id, { ...u });
      this.graph.addNode(u.id);
    }
  }

  loadGraphEdges(links: any[]) {
    for (const l of links) {
      this.graph.addEdge(l.source, l.target, l.weight, { amount: l.amount });
    }
  }

  getUsers() {
    return Array.from(this.users.values());
  }

  getGraphData() {
    return this.graph.getGraphData();
  }

  getShortestPath(start: string, end: string) {
    return this.graph.dijkstra(start, end);
  }

  createAndProcessTransaction(senderId: string, receiverId: string, amount: number): Transaction {
    const id = `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const timestamp = Date.now();

    // Fraud detection
    let fraudRisk = 0;
    const fraudReasons: string[] = [];

    if (amount > 10000) {
      fraudRisk += 50;
      fraudReasons.push('High value transaction');
    }

    // Add edge to graph
    this.graph.addEdge(senderId, receiverId, 1, { amount, id });

    // Cycle detection
    const cyclePath = this.graph.hasCycleDFS(senderId);
    if (cyclePath && cyclePath.length > 0) {
      fraudRisk += 80;
      fraudReasons.push('Circular money flow detected');
    }

    // Rapid repeat detection
    const senderTxs = this.processedTransactions.filter(
      t => t.senderId === senderId && t.receiverId === receiverId
    );
    if (senderTxs.length > 0) {
      const lastTx = senderTxs[senderTxs.length - 1];
      if (timestamp - lastTx.timestamp < 60000) {
        fraudRisk += 30;
        fraudReasons.push('Rapid repeated transactions');
      }
    }

    const priority = amount - fraudRisk * 10 + (10000000000000 - timestamp) / 1000000;

    const tx: Transaction = {
      id,
      senderId,
      receiverId,
      amount,
      timestamp,
      fraudRisk,
      fraudReasons,
      status: 'PENDING',
      priority,
    };

    // Process immediately
    if (tx.fraudRisk < 80) {
      const sender = this.users.get(tx.senderId);
      const receiver = this.users.get(tx.receiverId);
      if (sender && receiver && sender.balance >= tx.amount) {
        sender.balance -= tx.amount;
        receiver.balance += Number(tx.amount);
        tx.status = 'COMPLETED';
      } else {
        tx.status = 'FAILED_NSF';
      }
    } else {
      tx.status = 'BLOCKED_FRAUD';
    }

    this.processedTransactions.push(tx);
    return tx;
  }
}

// Singleton engine instance
export const engine = new TransactionEngine();
