// Safe server-side polyfill for localStorage and sessionStorage in Next.js SSR/Export
if (typeof window === 'undefined') {
  const createMockStorage = () => {
    const memory = new Map();
    return {
      getItem: (key) => memory.get(String(key)) ?? null,
      setItem: (key, val) => memory.set(String(key), String(val)),
      removeItem: (key) => memory.delete(String(key)),
      clear: () => memory.clear(),
      key: (i) => Array.from(memory.keys())[i] ?? null,
      get length() { return memory.size; }
    };
  };

  if (!globalThis.localStorage) {
    globalThis.localStorage = createMockStorage();
  }
  if (!globalThis.sessionStorage) {
    globalThis.sessionStorage = createMockStorage();
  }
}
