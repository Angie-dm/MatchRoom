import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { profileService } from "../services/profileService";

export default function LocationSelector({ cities, cityId, zoneIds = [], onCityChange, onZoneIdsChange, disabled = false }) {
  const [stateName, setStateName] = useState("");
  const [zones, setZones] = useState([]);
  const [query, setQuery] = useState("");
  const [loadingZones, setLoadingZones] = useState(false);
  const [zonesError, setZonesError] = useState("");
  const [zonesSource, setZonesSource] = useState("network");

  const selectedCity = useMemo(() => cities.find((city) => city.id === cityId), [cities, cityId]);
  const activeState = stateName || selectedCity?.stateName || "";
  const states = useMemo(() => [...new Set(cities.map((city) => city.stateName).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es-MX")), [cities]);
  const filteredCities = useMemo(() => cities.filter((city) => city.stateName === activeState), [cities, activeState]);
  const visibleZones = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("es-MX");
    return term ? zones.filter((zone) => zone.name.toLocaleLowerCase("es-MX").includes(term)) : zones;
  }, [query, zones]);
  const selectedZones = useMemo(() => zones.filter((zone) => zoneIds.includes(zone.id)), [zones, zoneIds]);

  useEffect(() => {
    if (!cityId) return undefined;
    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (controller.signal.aborted) return null;
      setLoadingZones(true); setZonesError(""); setZones([]); setQuery("");
      return profileService.zones(cityId, { signal: controller.signal, onSource: setZonesSource })
        .then((items) => { if (!controller.signal.aborted) setZones(items); })
        .catch((error) => { if (!controller.signal.aborted && error.name !== "AbortError") setZonesError("No pudimos cargar las zonas. Intenta de nuevo."); })
        .finally(() => { if (!controller.signal.aborted) setLoadingZones(false); });
    });
    return () => controller.abort();
  }, [cityId]);

  const changeState = (event) => {
    setStateName(event.target.value);
    setZones([]); setQuery(""); setZonesError("");
    onCityChange("");
  };
  const toggleZone = (id) => onZoneIdsChange(zoneIds.includes(id) ? zoneIds.filter((zoneId) => zoneId !== id) : [...zoneIds, id]);

  return <div className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-2 text-sm font-semibold">Estado
        <select value={activeState} onChange={changeState} disabled={disabled || !cities.length} className="h-11 rounded-xl border border-line bg-white px-3 font-normal disabled:cursor-not-allowed disabled:bg-brand-50">
          <option value="">Selecciona un estado</option>
          {states.map((state) => <option key={state} value={state}>{state}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm font-semibold">Ciudad
        <select value={cityId || ""} onChange={(event) => onCityChange(event.target.value)} disabled={disabled || !activeState} className="h-11 rounded-xl border border-line bg-white px-3 font-normal disabled:cursor-not-allowed disabled:bg-brand-50">
          <option value="">Selecciona una ciudad</option>
          {filteredCities.map((city) => <option key={city.id} value={city.id}>{city.name} — {city.stateName}</option>)}
        </select>
      </label>
    </div>

    <div>
      <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold">Zonas preferidas</p><span className="text-xs font-medium text-muted">{zoneIds.length} seleccionada{zoneIds.length === 1 ? "" : "s"}</span></div>
      {!cityId && <p className="mt-2 text-xs text-muted">Selecciona una ciudad para consultar sus zonas.</p>}
      {cityId && <>
        <label className="mt-3 flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-3 text-muted focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100"><Search size={16} aria-hidden="true" /><span className="sr-only">Buscar zonas</span><input value={query} onChange={(event) => setQuery(event.target.value)} disabled={disabled || loadingZones} placeholder="Buscar zona" className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none" /></label>
        <div className="mt-3 max-h-52 overflow-y-auto rounded-xl border border-line bg-white p-2" aria-busy={loadingZones}>
          {loadingZones && <p className="p-3 text-sm text-muted">Cargando zonas…</p>}
          {zonesError && <p role="alert" className="p-3 text-sm text-red-600">{zonesError}</p>}
          {!loadingZones && !zonesError && !visibleZones.length && <p className="p-3 text-sm text-muted">{zones.length ? "No hay zonas que coincidan con la búsqueda." : "No hay zonas disponibles para esta ciudad."}</p>}
          {!loadingZones && !zonesError && visibleZones.map((zone) => <label key={zone.id} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-brand-50"><input type="checkbox" checked={zoneIds.includes(zone.id)} onChange={() => toggleZone(zone.id)} disabled={disabled} className="size-4 accent-brand-500" /><span>{zone.name}</span></label>)}
        </div>
        {zonesSource === "offline" && <p role="status" className="mt-2 text-xs text-amber-700">Mostrando zonas guardadas en este dispositivo.</p>}
        {!!selectedZones.length && <div className="mt-3 flex flex-wrap gap-2" aria-label="Zonas seleccionadas">{selectedZones.map((zone) => <button key={zone.id} type="button" onClick={() => toggleZone(zone.id)} disabled={disabled} className="inline-flex items-center gap-1 rounded-full border border-brand-500/30 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{zone.name}<X size={13} aria-hidden="true" /></button>)}</div>}
      </>}
    </div>
  </div>;
}
