const Graph = require('../algorithms/Graph');
const HashTable = require('../algorithms/HashTable');
const PriorityQueue = require('../algorithms/PriorityQueue');
const dijkstra = require('../algorithms/Dijkstra');

class TransactionService {
  constructor() {
    this.graph = new Graph();
    this.users = new HashTable();
    this.transactions = new HashTable();
    this.pq = new PriorityQueue();
    this.processedTransactions = [];

    // Seed some users
    this.addUser('usr_1', { name: 'Alice', balance: 10000 });
    this.addUser('usr_2', { name: 'Bob', balance: 5000 });
    this.addUser('usr_3', { name: 'Charlie', balance: 8000 });
    this.addUser('usr_4', { name: 'Diana', balance: 15000 });
  }

  addUser(id, data) {
    this.users.set(id, { id, ...data });
    this.graph.addNode(id);
  }

  getUsers() {
    return this.users.values();
  }

  getGraphData() {
    return this.graph.getGraphData();
  }

  getShortestPath(startUserId, endUserId) {
    return dijkstra(this.graph, startUserId, endUserId);
  }

  getProcessedTransactions() {
    return this.processedTransactions;
  }

  createTransaction(senderId, receiverId, amount) {
    const id = `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const timestamp = Date.now();
    
    // 1. Calculate Fraud Risk
    let fraudRisk = 0;
    let fraudReasons = [];

    if (amount > 10000) {
      fraudRisk += 50;
      fraudReasons.push('High value transaction');
    }

    // Add to graph temporarily to check cycle (we will not revert it if fraudulent, since we block the transaction money flow, but graph edge is a failed attempt)
    // Actually we will just add the edge. Even failed ones might form the attack pattern.
    this.graph.addEdge(senderId, receiverId, 1, { amount, id });
    const cyclePath = this.graph.hasCycleDFS(senderId);
    
    if (cyclePath && cyclePath.length > 0) {
      fraudRisk += 80;
      fraudReasons.push('Circular money flow detected');
    }

    const senderTxs = this.processedTransactions.filter(t => t.senderId === senderId && t.receiverId === receiverId);
    if (senderTxs.length > 0) {
      const lastTx = senderTxs[senderTxs.length - 1];
      if (timestamp - lastTx.timestamp < 60000) {
        fraudRisk += 30;
        fraudReasons.push('Rapid repeated transactions');
      }
    }

    // We can prioritize by max priority first. Higher amount = higher priority, 
    // but blocked by extreme fraud risk, we deprioritize to check carefully.
    const priority = amount - (fraudRisk * 10) + (10000000000000 - timestamp) / 1000000;

    const transaction = {
      id,
      senderId,
      receiverId,
      amount,
      timestamp,
      fraudRisk,
      fraudReasons,
      status: 'PENDING',
      priority
    };

    this.transactions.set(id, transaction);
    this.pq.push(transaction);

    return transaction;
  }

  processNextHighPriorityTransaction() {
    if (this.pq.isEmpty()) return null;

    const tx = this.pq.pop();
    
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
    this.transactions.set(tx.id, tx);
    
    return tx;
  }
}

module.exports = new TransactionService();
