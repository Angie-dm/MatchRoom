import { request } from "./apiClient";
import { readCatalogCache, writeCatalogCache } from "./catalogCache";

export const profileService = {
  me: () => request("/profiles/me"),
  completeness: () => request("/profiles/me/completeness"),
  patchMe: (profile) => request("/profiles/me", { method: "PATCH", body: JSON.stringify(profile) }),
  putHousingPreferences: (preferences) => request("/profiles/me/housing-preferences", { method: "PUT", body: JSON.stringify(preferences) }),
  putLifestyle: (lifestyle) => request("/profiles/me/lifestyle", { method: "PUT", body: JSON.stringify(lifestyle) }),
  putRoommatePreferences: (preferences) => request("/profiles/me/roommate-preferences", { method: "PUT", body: JSON.stringify(preferences) }),
  replacePreferredZones: (zoneIds) => request("/profiles/me/preferred-zones", { method: "PUT", body: JSON.stringify({ zoneIds }) }),
  cities: (options) => catalogPages("/catalog/cities", { ...options, cacheKey: "cities" }),
  zones: (cityId, options) => catalogPages(`/catalog/zones?cityId=${encodeURIComponent(cityId)}`, { ...options, cacheKey: `zones:${cityId}` }),
};

async function catalogPages(path, { signal, cacheKey, onSource } = {}) {
  const pageSize = 100;
  const items = [];
  let page = 1;
  let total = Infinity;

  try {
    while (items.length < total) {
      const separator = path.includes("?") ? "&" : "?";
      const response = await request(`${path}${separator}page=${page}&pageSize=${pageSize}`, { signal });
      if (!Array.isArray(response?.data) || !response?.meta) {
        throw new Error("El catálogo respondió con un formato no válido.");
      }
      items.push(...response.data);
      total = response.meta.total;
      if (!response.data.length) break;
      page += 1;
    }
    if (cacheKey) void writeCatalogCache(cacheKey, items);
    onSource?.("network");
    return items;
  } catch (error) {
    if (error.name === "AbortError") throw error;
    const cached = cacheKey ? await readCatalogCache(cacheKey) : null;
    if (cached) { onSource?.("offline"); return cached; }
    throw error;
  }
}
