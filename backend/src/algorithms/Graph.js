class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addNode(node) {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, []);
    }
  }

  addEdge(node1, node2, weight = 1, metadata = {}) {
    if (!this.adjacencyList.has(node1)) {
      this.addNode(node1);
    }
    if (!this.adjacencyList.has(node2)) {
      this.addNode(node2);
    }
    this.adjacencyList.get(node1).push({ node: node2, weight, ...metadata });
  }

  // Detects if adding an edge from startNode would create a cycle or if a cycle exists
  hasCycleDFS(startNode) {
    const visited = new Set();
    const recursionStack = new Set();
    const cyclePath = [];

    const dfs = (node) => {
      visited.add(node);
      recursionStack.add(node);
      cyclePath.push(node);

      const neighbors = this.adjacencyList.get(node) || [];
      for (const edge of neighbors) {
        const neighbor = edge.node;
        
        if (!visited.has(neighbor)) {
          const result = dfs(neighbor);
          if (result) return result; // Return cycle path
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
    const links = [];
    
    for (const [source, edges] of this.adjacencyList.entries()) {
      for (const edge of edges) {
        links.push({
          source,
          target: edge.node,
          weight: edge.weight,
          amount: edge.amount,
        });
      }
    }
    
    return { nodes, links };
  }
}

module.exports = Graph;
