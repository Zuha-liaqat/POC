/**
 * Backend API base URL for Twilio voice and other services.
 * Set VITE_API_BASE_URL in .env (e.g. http://localhost:8000) or it defaults to localhost.
 */
export const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL) ||
  "http://localhost:8000";

const DEFAULT_API_HEADERS: Record<string, string> = API_BASE_URL.includes(
  "ngrok",
)
  ? { "ngrok-skip-browser-warning": "true" }
  : {};

export function apiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export interface PdfDocument {
  id: number;
  name: string;
  status: string;
  size_raw?: number;
  size_readable?: string;
  created_at?: string;
}

export interface PdfProcessResponse {
  id: number;
  message?: string;
  status?: string;
}

export interface PdfDownloadResponse {
  blob: Blob;
  contentType: string | null;
  fileName: string | null;
}

export interface RebrandPdfUploadResponse {
  blob?: Blob;
  contentType?: string | null;
  data?: unknown;
  fileName?: string | null;
}

function parseJsonSafely(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function getFileNameFromDisposition(disposition: string | null) {
  if (!disposition) return null;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const asciiMatch = disposition.match(/filename="?([^"]+)"?/i);
  return asciiMatch?.[1] ?? null;
}

function getErrorMessage(payload: unknown, status: number) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const data = payload as Record<string, unknown>;
    const message = data.message ?? data.error ?? data.detail;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return `Upload failed with status ${status}`;
}

async function getResponseErrorMessage(response: Response) {
  const text = await response.text();
  return getErrorMessage(text ? parseJsonSafely(text) : null, response.status);
}

function createHeaders(headers?: HeadersInit) {
  const nextHeaders = new Headers(headers);

  Object.entries(DEFAULT_API_HEADERS).forEach(([key, value]) => {
    nextHeaders.set(key, value);
  });

  return nextHeaders;
}

async function fetchJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: createHeaders(init?.headers),
  });

  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response));
  }

  return (await response.json()) as T;
}

export function uploadRebrandPdf(
  file: File,
  onProgress?: (progress: number) => void,
) {
  return new Promise<RebrandPdfUploadResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl("/api/pdf/upload"));
    xhr.responseType = "blob";

    xhr.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onerror = () => {
      reject(new Error("Network error while uploading PDF"));
    };

    xhr.onabort = () => {
      reject(new Error("PDF upload was cancelled"));
    };

    xhr.onload = async () => {
      const contentType = xhr.getResponseHeader("Content-Type");
      const disposition = xhr.getResponseHeader("Content-Disposition");
      const responseBlob = xhr.response;
      const isJsonLike =
        typeof contentType === "string" &&
        (contentType.includes("application/json") ||
          contentType.includes("text/plain"));

      if (xhr.status >= 200 && xhr.status < 300) {
        if (isJsonLike) {
          const text = await responseBlob.text();
          resolve({
            contentType,
            data: text ? parseJsonSafely(text) : null,
            fileName: getFileNameFromDisposition(disposition),
          });
          return;
        }

        resolve({
          blob: responseBlob,
          contentType,
          fileName: getFileNameFromDisposition(disposition),
        });
        return;
      }

      const errorPayload = responseBlob
        ? parseJsonSafely(await responseBlob.text())
        : null;
      reject(new Error(getErrorMessage(errorPayload, xhr.status)));
    };

    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  });
}

export function listPdfDocuments() {
  return fetchJson<PdfDocument[]>("/api/pdf/documents");
}

export function processPdfDocument(docId: number | string) {
  return fetchJson<PdfProcessResponse>(`/api/pdf/process/${docId}`, {
    method: "POST",
  });
}

export async function downloadPdfDocument(docId: number | string) {
  const response = await fetch(apiUrl(`/api/pdf/download/${docId}`), {
    headers: createHeaders(),
  });

  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response));
  }

  return {
    blob: await response.blob(),
    contentType: response.headers.get("Content-Type"),
    fileName: getFileNameFromDisposition(
      response.headers.get("Content-Disposition"),
    ),
  } satisfies PdfDownloadResponse;
}
