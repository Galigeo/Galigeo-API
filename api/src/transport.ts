/**
 * Standalone functions to import and export Galigeo maps (documents).
 *
 * A map export is a zip archive containing two folders:
 * - `contexts/` : the map configuration (views, layout, styles, ...)
 * - `dataset/`  : the map data
 *
 * The very same zip can be re-imported to recreate the map(s) on the same
 * or another Galigeo instance. These functions talk directly to the Galigeo
 * "transport" REST endpoints and only require a valid API key: the map does
 * not need to be loaded in a viewer.
 *
 * For exporting the map that is currently displayed by the API, prefer
 * {@link Map.exportMap} which relies on the viewer service instead.
 */

/**
 * Remove a trailing slash from the Galigeo base url.
 * @ignore
 */
function normalizeUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Trigger a browser download for the given blob.
 *
 * @param blob the content to download
 * @param fileName the name of the downloaded file
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const link = document.createElement("a");
  const objectUrl = window.URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(objectUrl);
}

/**
 * Options for {@link exportMap}.
 */
export interface ExportMapOptions {
  /** URL of the Galigeo instance (ex: https://showroom.galigeo.com/Galigeo) */
  url: string;
  /** A valid API key with transport/admin rights */
  apiKey: string;
  /** The IDs of the maps to export */
  mapIds: string[];
  /**
   * When true (default), the resulting zip is downloaded by the browser.
   * Set to false to only get the Blob back (ex: to upload it elsewhere).
   */
  download?: boolean;
  /** Optional name for the downloaded file (default: "<mapIds>.zip") */
  fileName?: string;
}

/**
 * Export one or several saved maps as a single zip archive.
 *
 * The map(s) are identified by their ID. The export is performed server-side
 * by the Galigeo "transport" service, authenticated with the provided API key.
 *
 * @param options see {@link ExportMapOptions}
 * @returns a Promise resolving to the zip Blob
 */
export async function exportMap(options: ExportMapOptions): Promise<Blob> {
  if (!options.mapIds || options.mapIds.length === 0) {
    throw new Error("exportMap requires at least one map id");
  }
  const base = normalizeUrl(options.url);
  const res = await fetch(
    `${base}/feature/admin/transport/export?apiKey=${encodeURIComponent(
      options.apiKey
    )}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      mode: "cors",
      credentials: "include",
      body: `selectedDocs=${encodeURIComponent(options.mapIds.join(","))}`,
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to export map (status ${res.status})`);
  }
  const blob = await res.blob();
  if (options.download !== false) {
    const fileName = options.fileName || options.mapIds.join("_") + ".zip";
    downloadBlob(blob, fileName);
  }
  return blob;
}

/**
 * Options for {@link importMap}.
 */
export interface ImportMapOptions {
  /** URL of the Galigeo instance (ex: https://showroom.galigeo.com/Galigeo) */
  url: string;
  /** A valid API key with transport/admin rights */
  apiKey: string;
  /**
   * The map zip archive to import. Typically a File coming from an
   * `<input type="file">`, but any Blob holding a valid map zip works.
   */
  file: File | Blob;
}

/**
 * Import a map zip archive (previously created with {@link exportMap} or
 * downloaded from the Galigeo viewer) into a Galigeo instance.
 *
 * The archive must contain the `contexts` and `dataset` folders. On success,
 * the imported maps are created on the server and their references
 * (datasources, catalog join mappers) are automatically fixed.
 *
 * @param options see {@link ImportMapOptions}
 * @returns a Promise resolving to the list of imported maps. Each entry holds
 *          at least `docId`, `docName`, and optionally the `fixes` applied.
 */
export async function importMap(options: ImportMapOptions): Promise<any[]> {
  const base = normalizeUrl(options.url);
  const formData = new FormData();
  const fileName = (options.file as File).name || "map.zip";
  formData.append("files", options.file, fileName);
  const res = await fetch(
    `${base}/feature/admin/transport/import?apiKey=${encodeURIComponent(
      options.apiKey
    )}`,
    {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: formData,
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to import map (status ${res.status})`);
  }
  return res.json();
}
