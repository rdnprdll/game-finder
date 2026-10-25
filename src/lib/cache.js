const store = new Map();

export function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function cacheSet(key, value, ttlMs) {
  if (store.size >= 200) store.delete(store.keys().next().value); // drop the oldest
  store.set(key, { value, expires: Date.now() + ttlMs });
}