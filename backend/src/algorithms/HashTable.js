class HashTable {
  constructor(size = 1000) {
    this.buckets = new Array(size);
    this.numBuckets = size;
  }

  hash(key) {
    let hash = 0;
    const strKey = String(key);
    for (let i = 0; i < strKey.length; i++) {
      hash = (hash + strKey.charCodeAt(i) * 23) % this.numBuckets;
    }
    return hash;
  }

  set(key, value) {
    const index = this.hash(key);
    if (!this.buckets[index]) {
      this.buckets[index] = [];
    }
    
    const bucket = this.buckets[index];
    const existingIndex = bucket.findIndex(item => item[0] === key);
    
    if (existingIndex !== -1) {
      bucket[existingIndex][1] = value;
    } else {
      bucket.push([key, value]);
    }
  }

  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    if (bucket) {
      const found = bucket.find(item => item[0] === key);
      return found ? found[1] : undefined;
    }
    return undefined;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    if (bucket) {
      const existingIndex = bucket.findIndex(item => item[0] === key);
      if (existingIndex !== -1) {
        bucket.splice(existingIndex, 1);
        return true;
      }
    }
    return false;
  }

  keys() {
    const allKeys = [];
    for (const bucket of this.buckets) {
      if (bucket) {
        for (const [key] of bucket) {
          allKeys.push(key);
        }
      }
    }
    return allKeys;
  }

  values() {
    const allValues = [];
    for (const bucket of this.buckets) {
      if (bucket) {
        for (const [, value] of bucket) {
          allValues.push(value);
        }
      }
    }
    return allValues;
  }
}

module.exports = HashTable;
