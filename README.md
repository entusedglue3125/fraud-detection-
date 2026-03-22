# Multi-Structure Financial Transaction System

A scalable, interactive web application simulating financial transactions, detecting fraud in real-time, and computing optimal settlement paths using custom Graph, Priority Queue, and Hash Table data structures.

## Technical Implementation
- **Frontend**: React (TypeScript), Tailwind CSS, shadcn-inspired components, `react-force-graph-2d`.
- **Backend**: Node.js, Express, `socket.io`.
- **Algorithms**: `Graph.js` (Adjacency List + DFS cycle detection), `PriorityQueue.js` (Max-heap), `HashTable.js`, `Dijkstra.js`.
- **Architecture**: In-memory optimized data structures ensuring sub-millisecond graph transversal for fraud heuristics.

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)

### 1. Start the Backend API & WebSocket Server
```bash
cd backend
npm install
node server.js
```
The server will start on `http://localhost:3001`

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`

## Testing Guidelines

1. **Dashboard Overview**: Check `http://localhost:5173/` for live metrics.
2. **Transaction Simulation**: Navigate to the "Transactions" page. Use the "Random Tx" button to easily populate fields and submit. 
3. **Fraud Detection**: The system evaluates Risk Scores based on heuristics (High value, Cyclic money flows like A->B->A, and high-frequency transfers). Click "Attack Tx" to trigger a known fraud pattern.
4. **Shortest Settlement Path (Dijkstra)**: Navigate to the "Graph View" tab. Select a root node and destination node to computationally find the optimal path across the liquidity network.
5. **Real-Time Monitoring**: Go to "Fraud Monitor" to view flagged transactions intercepted actively by the `PriorityQueue` processor.
