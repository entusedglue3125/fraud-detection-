class PriorityQueue {
  constructor(comparator = (a, b) => a.priority > b.priority) {
    this.heap = [];
    this.comparator = comparator;
  }

  get size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size === 0;
  }

  peek() {
    return this.size > 0 ? this.heap[0] : null;
  }

  push(value) {
    this.heap.push(value);
    this.bubbleUp(this.size - 1);
  }

  pop() {
    if (this.isEmpty()) return null;
    
    const max = this.heap[0];
    const end = this.heap.pop();
    
    if (this.size > 0) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    
    return max;
  }

  bubbleUp(index) {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      
      if (this.comparator(parent, element)) break;
      
      this.heap[index] = parent;
      index = parentIndex;
    }
    this.heap[index] = element;
  }

  sinkDown(index) {
    const length = this.size;
    const element = this.heap[index];
    
    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (this.comparator(leftChild, element)) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && this.comparator(rightChild, element)) ||
          (swap !== null && this.comparator(rightChild, leftChild))
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      
      this.heap[index] = this.heap[swap];
      index = swap;
    }
    this.heap[index] = element;
  }
}

module.exports = PriorityQueue;
