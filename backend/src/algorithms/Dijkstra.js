const PriorityQueue = require('./PriorityQueue');

function dijkstra(graph, startNode, endNode) {
  const distances = new Map();
  const previous = new Map();
  const pq = new PriorityQueue((a, b) => a.priority < b.priority); 
  
  for (const node of graph.adjacencyList.keys()) {
    distances.set(node, Infinity);
    previous.set(node, null);
  }
  
  distances.set(startNode, 0);
  pq.push({ node: startNode, priority: 0 });
  
  while (!pq.isEmpty()) {
    const current = pq.pop();
    const currentNode = current.node;
    
    if (currentNode === endNode) {
      break; 
    }
    
    if (current.priority > distances.get(currentNode)) continue;
    
    const neighbors = graph.adjacencyList.get(currentNode) || [];
    for (const neighborEdge of neighbors) {
      const { node: neighbor, weight } = neighborEdge;
      
      const candidateDistance = distances.get(currentNode) + weight;
      
      if (candidateDistance < distances.get(neighbor)) {
        distances.set(neighbor, candidateDistance);
        previous.set(neighbor, currentNode);
        pq.push({ node: neighbor, priority: candidateDistance });
      }
    }
  }
  
  const path = [];
  let current = endNode;
  
  if (previous.get(current) || current === startNode) {
    while (current) {
      path.unshift(current);
      current = previous.get(current);
    }
  }
  
  return {
    path: path.length > 1 ? path : [],
    distance: distances.get(endNode)
  };
}

module.exports = dijkstra;
