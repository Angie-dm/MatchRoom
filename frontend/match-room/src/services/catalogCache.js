const DATABASE = "matchroom-catalog";
const VERSION = 1;
const STORE = "catalog";
const MAX_ZONE_CITIES = 12;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function openDatabase() {
  if (!("indexedDB" in globalThis)) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const request = globalThis.indexedDB.open(DATABASE, VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("No pudimos abrir el almacenamiento local."));
  });
}

async function transaction(mode, callback) {
  const database = await openDatabase();
  if (!database) return null;
  try {
    const tx = database.transaction(STORE, mode);
    const result = await callback(tx.objectStore(STORE));
    await new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error); });
    return result;
  } finally { database.close(); }
}

function requestValue(request) {
  return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
}

export async function readCatalogCache(key) {
  try {
    const record = await transaction("readonly", (store) => requestValue(store.get(key)));
    if (!record || Date.now() - record.cachedAt > MAX_AGE_MS) return null;
    return record.items;
  } catch { return null; }
}

export async function writeCatalogCache(key, items) {
  if (!Array.isArray(items)) return;
  try {
    await transaction("readwrite", async (store) => {
      if (key.startsWith("zones:")) {
        const entries = await requestValue(store.getAll());
        const zoneEntries = entries.filter((entry) => entry.key.startsWith("zones:")).sort((a, b) => a.cachedAt - b.cachedAt);
        for (const entry of zoneEntries.slice(0, Math.max(0, zoneEntries.length - MAX_ZONE_CITIES + 1))) store.delete(entry.key);
      }
      store.put({ key, items, cachedAt: Date.now() });
    });
  } catch { /* El catálogo sigue funcionando en red si IndexedDB no está disponible. */ }
}
