import { Search, Eye, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  listPdfDocuments,
  processPdfDocument,
  type PdfDocument,
  uploadRebrandPdf,
} from "@/lib/api";

interface Brochure {
  name: string;
  id: string;
  date: string;
  size: string;
  status:
    | "New"
    | "Processed"
    | "Pending"
    | "Processing"
    | "Uploading"
    | "Failed";
  backendId?: number;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-600";
    case "Processed":
      return "bg-green-100 text-green-600";
    case "Pending":
      return "bg-yellow-100 text-yellow-600";
    case "Processing":
      return "bg-amber-100 text-amber-700";
    case "Uploading":
      return "bg-orange-100 text-orange-600";
    case "Failed":
      return "bg-red-100 text-red-600";
    default:
      return "";
  }
}

function formatFileSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function createBrochureId() {
  return `INV-${Math.floor(Math.random() * 1000 + 9000)}`;
}

function mapBackendStatusToUi(status: string): Brochure["status"] {
  switch (status.toLowerCase()) {
    case "completed":
      return "Processed";
    case "processing":
      return "Processing";
    case "uploaded":
      return "New";
    case "failed":
      return "Failed";
    default:
      return "Pending";
  }
}

function formatDocumentDate(value?: string) {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function mapDocumentToBrochure(document: PdfDocument): Brochure {
  return {
    name: document.name,
    id: `DOC-${document.id}`,
    backendId: document.id,
    date: formatDocumentDate(document.created_at),
    size:
      document.size_readable ??
      (typeof document.size_raw === "number"
        ? formatFileSize(document.size_raw)
        : "--"),
    status: mapBackendStatusToUi(document.status),
  };
}

function getDownloadName(fileName: string, serverFileName?: string | null) {
  if (serverFileName) return serverFileName;
  return fileName.replace(/\.pdf$/i, "") + "-rebranded.pdf";
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function BrochureManager() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const pollTimeoutRef = useRef<number | null>(null);
  const documentStatusesRef = useRef<Record<number, string>>({});

  const [brochures, setBrochures] = useState<Brochure[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>(
    {},
  );
  const [uploadDone, setUploadDone] = useState<Record<number, boolean>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<number, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Record<number, boolean>>(
    {},
  );
  const [startingProcessIds, setStartingProcessIds] = useState<
    Record<number, boolean>
  >({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState<number>(-1);
  const [genProgress, setGenProgress] = useState(0);
  const [genStatus, setGenStatus] = useState("");
  const [genDone, setGenDone] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    void loadBrochures();
  }, []);

  useEffect(() => {
    const hasProcessingDocuments = Object.keys(processingIds).length > 0;

    if (!hasProcessingDocuments) {
      if (pollTimeoutRef.current) {
        window.clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
      return;
    }

    pollTimeoutRef.current = window.setTimeout(() => {
      void loadBrochures(false);
    }, 5000);

    return () => {
      if (pollTimeoutRef.current) {
        window.clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
    };
  }, [processingIds]);

  async function loadBrochures(showErrorToast = true) {
    try {
      const documents = await listPdfDocuments();
      const previousStatuses = documentStatusesRef.current;

      documents.forEach((document) => {
        const previousStatus = previousStatuses[document.id]?.toLowerCase();
        const nextStatus = document.status.toLowerCase();

        if (previousStatus === "processing" && nextStatus === "completed") {
          toast({
            title: "Processing completed",
            description: `${document.name} is ready for preview.`,
          });
        }
      });

      documentStatusesRef.current = documents.reduce<Record<number, string>>(
        (acc, document) => {
          acc[document.id] = document.status;
          return acc;
        },
        {},
      );

      setBrochures(documents.map(mapDocumentToBrochure));
      setProcessingIds(
        documents.reduce<Record<number, boolean>>((acc, document) => {
          if (document.status.toLowerCase() === "processing") {
            acc[document.id] = true;
          }
          return acc;
        }, {}),
      );
    } catch (error) {
      if (showErrorToast) {
        toast({
          title: "Table load failed",
          description:
            error instanceof Error
              ? error.message
              : "Unable to load uploaded brochures.",
          variant: "destructive",
        });
      }
    } finally {
      setIsTableLoading(false);
    }
  }

  function handleFiles(files: File[]) {
    const pdfs = files.filter((file) => file.type === "application/pdf");
    if (!pdfs.length) return;

    setPendingFiles(pdfs);
    setUploadProgress({});
    setUploadDone({});
    setUploadErrors({});

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  }

  async function startUpload() {
    if (!pendingFiles.length || isUploading) return;

    setIsUploading(true);
    let successCount = 0;
    let failedCount = 0;

    for (let idx = 0; idx < pendingFiles.length; idx += 1) {
      if (uploadDone[idx]) continue;

      const file = pendingFiles[idx];

      setUploadProgress((prev) => ({ ...prev, [idx]: 0 }));
      setUploadErrors((prev) => {
        const next = { ...prev };
        delete next[idx];
        return next;
      });

      try {
        const response = await uploadRebrandPdf(file, (progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [idx]: progress,
          }));
        });

        if (response.blob && response.blob.size > 0) {
          downloadBlob(
            response.blob,
            getDownloadName(file.name, response.fileName),
          );
        }

        setUploadProgress((prev) => ({ ...prev, [idx]: 100 }));
        setUploadDone((prev) => ({ ...prev, [idx]: true }));

        successCount += 1;
      } catch (error) {
        failedCount += 1;
        const message =
          error instanceof Error ? error.message : "PDF upload failed";

        setUploadErrors((prev) => ({
          ...prev,
          [idx]: message,
        }));

        toast({
          title: "Upload failed",
          description: `${file.name}: ${message}`,
          variant: "destructive",
        });
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      await loadBrochures();
      toast({
        title: "Upload completed",
        description: `${successCount} PDF file${successCount > 1 ? "s" : ""} uploaded successfully.`,
      });
    }

    if (failedCount === 0) {
      setTimeout(() => {
        setPendingFiles([]);
        setUploadProgress({});
        setUploadDone({});
        setUploadErrors({});
      }, 1000);
    }
  }

  async function openModal(i: number) {
    const brochure = filtered[i];
    if (!brochure?.backendId) return;

    try {
      setStartingProcessIds((prev) => ({
        ...prev,
        [brochure.backendId!]: true,
      }));
      setBrochures((prev) =>
        prev.map((item) =>
          item.backendId === brochure.backendId
            ? { ...item, status: "Processing" }
            : item,
        ),
      );

      await processPdfDocument(brochure.backendId);
      toast({
        title: "Processing started",
        description: `${brochure.name} is now being processed.`,
      });
      await loadBrochures();
    } catch (error) {
      setBrochures((prev) =>
        prev.map((item) =>
          item.backendId === brochure.backendId
            ? { ...item, status: brochure.status }
            : item,
        ),
      );
      toast({
        title: "Process failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to start processing.",
        variant: "destructive",
      });
    } finally {
      setStartingProcessIds((prev) => {
        const next = { ...prev };
        delete next[brochure.backendId!];
        return next;
      });
    }
  }

  function closeModal() {
    setModalOpen(false);
    setModalIdx(-1);
  }

  function generatePDF() {
    setGenerating(true);
    const steps = [
      "Analyzing document...",
      "Extracting data...",
      "Building report...",
      "Finalizing PDF...",
    ];
    let pct = 0;

    const interval = setInterval(() => {
      pct += Math.random() * 12 + 5;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        setGenStatus("Done!");
        setGenDone(true);
        setBrochures((prev) =>
          prev.map((brochure, i) =>
            i === modalIdx ? { ...brochure, status: "Processed" } : brochure,
          ),
        );
      } else {
        const stepIdx = Math.min(Math.floor(pct / 26), steps.length - 1);
        setGenStatus(steps[stepIdx]);
      }
      setGenProgress(Math.min(pct, 100));
    }, 90);
  }

  const filtered = brochures.filter(
    (brochure) =>
      brochure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brochure.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const busyProcessIds = { ...processingIds, ...startingProcessIds };

  function openPreview(index: number) {
    const brochure = filtered[index];
    if (!brochure) return;

    navigate(`/dashboard/upload/preview/${brochure.backendId ?? brochure.id}`, {
      state: { brochure },
    });
  }

  const modalBrochure = modalIdx >= 0 ? brochures[modalIdx] : null;

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-black">
          Brochure Upload & Management
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Easily manage and process your investment proposal brochures for
          client review.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-2 sm:p-3 lg:p-6">
        <div
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-5 text-center transition sm:p-6 lg:p-12
            ${isDragging ? "border-sky-400 bg-sky-50" : "border-gray-300 bg-[#F8FAFC]"}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="bg-[#0EA5E9] w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-full mb-4">
            <svg
              className="w-7 h-7 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
            </svg>
          </div>

          <h3 className="font-semibold text-base lg:text-lg mb-2 text-black">
            Upload Proposals
          </h3>
          <p className="text-gray-500 text-sm mb-4 max-w-xs lg:max-w-md">
            Drag and drop your PDF brochures here or click to browse through
            your local files.
          </p>

          <button
            onClick={() => fileRef.current?.click()}
            className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-md text-sm transition"
          >
            Select Files
          </button>

          {/* <p className="text-xs text-gray-400 mt-3">
            Supported format: PDF (Max 25MB per file)
          </p> */}

          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept="application/pdf"
            multiple
            onChange={handleInputChange}
          />

          {pendingFiles.length > 0 && (
            <div className="mt-4 w-full space-y-2">
              {pendingFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left sm:flex-row sm:items-center"
                >
                  <svg
                    className="w-5 h-5 text-red-400 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">
                      {file.name}
                    </p>

                    {uploadErrors[i] ? (
                      <p className="text-xs text-red-600 mt-0.5">
                        {uploadErrors[i]}
                      </p>
                    ) : uploadProgress[i] !== undefined && !uploadDone[i] ? (
                      <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-1.5 bg-sky-500 rounded-full transition-all"
                          style={{ width: `${uploadProgress[i]}%` }}
                        />
                      </div>
                    ) : uploadDone[i] ? (
                      <p className="text-xs text-green-600 mt-0.5">
                        Uploaded successfully
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatFileSize(file.size)} - Ready to upload
                      </p>
                    )}
                  </div>

                  <span
                    className={`self-start rounded-full px-2 py-0.5 text-xs sm:self-center ${
                      uploadErrors[i]
                        ? "bg-red-100 text-red-600"
                        : uploadDone[i]
                          ? "bg-sky-100 text-sky-600"
                          : uploadProgress[i] !== undefined
                            ? "bg-orange-100 text-orange-600"
                            : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {uploadErrors[i]
                      ? "Failed"
                      : uploadDone[i]
                        ? "Done"
                        : uploadProgress[i] !== undefined
                          ? "Uploading"
                          : "Queued"}
                  </span>
                </div>
              ))}

              {!isUploading && (
                <div className="mt-2 flex justify-stretch sm:justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startUpload();
                    }}
                    className="w-full rounded-md bg-sky-500 px-5 py-2 text-sm text-white transition hover:bg-sky-600 sm:w-auto"
                  >
                    {Object.keys(uploadErrors).length
                      ? "Retry Failed Uploads"
                      : "Upload Proposals"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-black">Uploaded Brochures</h3>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search brochures..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isTableLoading ? (
          <div className="p-6 text-sm text-gray-500">Loading brochures...</div>
        ) : (
          <div className="divide-y divide-[#E2E8F0] md:hidden">
            {filtered.map((file, index) => (
              <div key={file.id} className="space-y-4 p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 shrink-0" viewBox="0 0 28 28" fill="none">
                    <rect width="28" height="28" rx="6" fill="#FEF2F2" />
                    <path
                      d="M8 7h8l4 4v10a1 1 0 01-1 1H8a1 1 0 01-1-1V8a1 1 0 011-1z"
                      fill="#FCA5A5"
                    />
                    <path d="M16 7v4h4" fill="#F87171" />
                    <line
                      x1="10"
                      y1="13"
                      x2="18"
                      y2="13"
                      stroke="#DC2626"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="10"
                      y1="16"
                      x2="16"
                      y2="16"
                      stroke="#DC2626"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="min-w-0 flex-1">
                    <p className="break-words font-medium text-black">
                      {file.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">ID: {file.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Upload Date
                    </p>
                    <p className="mt-1 text-black">{file.date}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Size
                    </p>
                    <p className="mt-1 text-black">{file.size}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1 text-xs whitespace-nowrap ${getStatusStyle(file.status)}`}
                  >
                    {!!file.backendId && busyProcessIds[file.backendId] && (
                      <Loader2 size={12} className="animate-spin" />
                    )}
                    {file.status}
                  </span>

                  {file.status === "Processed" ? (
                    <button
                      onClick={() => openPreview(index)}
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                  ) : (
                    <button
                      onClick={() => openModal(index)}
                      disabled={
                        !!file.backendId && busyProcessIds[file.backendId]
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
                    >
                      {!!file.backendId && busyProcessIds[file.backendId] ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Process"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isTableLoading && (
          <div className="hidden w-full overflow-x-auto md:block">
            <table className="w-full min-w-full text-sm">
              <thead className="bg-[#F8FAFC] text-gray-500 border-b border-[#E2E8F0]">
                <tr className="text-left">
                  <th className="p-4 whitespace-nowrap">DOCUMENT NAME</th>
                  <th className="p-4 whitespace-nowrap">UPLOAD DATE</th>
                  <th className="p-4 whitespace-nowrap">SIZE</th>
                  <th className="p-4 whitespace-nowrap">STATUS</th>
                  <th className="p-4 text-right pr-6 whitespace-nowrap">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((file, index) => (
                  <tr
                    key={index}
                    className="border-t border-[#E2E8F0] hover:bg-gray-50 transition"
                  >
                    <td className="max-w-[320px] p-4 lg:max-w-none">
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-6 shrink-0"
                          viewBox="0 0 28 28"
                          fill="none"
                        >
                          <rect width="28" height="28" rx="6" fill="#FEF2F2" />
                          <path
                            d="M8 7h8l4 4v10a1 1 0 01-1 1H8a1 1 0 01-1-1V8a1 1 0 011-1z"
                            fill="#FCA5A5"
                          />
                          <path d="M16 7v4h4" fill="#F87171" />
                          <line
                            x1="10"
                            y1="13"
                            x2="18"
                            y2="13"
                            stroke="#DC2626"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                          <line
                            x1="10"
                            y1="16"
                            x2="16"
                            y2="16"
                            stroke="#DC2626"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-black">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-400">ID: {file.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-black whitespace-nowrap">
                      {file.date}
                    </td>
                    <td className="p-4 text-black whitespace-nowrap">
                      {file.size}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-full whitespace-nowrap ${getStatusStyle(file.status)}`}
                      >
                        {!!file.backendId && busyProcessIds[file.backendId] && (
                          <Loader2 size={12} className="animate-spin" />
                        )}
                        {file.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6 whitespace-nowrap">
                      {file.status === "Processed" ? (
                        <button
                          onClick={() => openPreview(index)}
                          className="text-gray-500 hover:text-gray-700 transition"
                        >
                          <Eye size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => openModal(index)}
                          disabled={
                            !!file.backendId && busyProcessIds[file.backendId]
                          }
                          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs px-4 py-1.5 rounded-md transition disabled:cursor-not-allowed disabled:bg-green-300"
                        >
                          {!!file.backendId &&
                          busyProcessIds[file.backendId] ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Process"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-b-xl border-t border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {filtered.length} of {brochures.length} uploaded files
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <button className="flex-1 rounded-md border border-[#E2E8F0] px-3 py-1 text-gray-400 transition hover:bg-gray-100 sm:flex-none">
              Previous
            </button>
            <button className="flex-1 rounded-md border border-[#E2E8F0] px-3 py-1 text-gray-400 transition hover:bg-gray-100 sm:flex-none">
              Next
            </button>
          </div>
        </div>
      </div>

      {modalOpen && modalBrochure && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-sm overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:p-6">
            <h2 className="text-base font-semibold text-black mb-3">
              Generate PDF Report
            </h2>

            <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4">
              <p className="text-sm font-medium text-black">
                {modalBrochure.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                ID: {modalBrochure.id} - {modalBrochure.size}
              </p>
            </div>

            {!generating && !genDone && (
              <p className="text-sm text-gray-500 mb-4">
                This will process the brochure and generate a structured
                investment proposal PDF.
              </p>
            )}

            {generating && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">{genStatus}</p>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 bg-green-500 rounded-full transition-all"
                    style={{ width: `${genProgress}%` }}
                  />
                </div>
              </div>
            )}

            {genDone && (
              <p className="text-sm text-green-600 font-medium mb-4">
                PDF generated successfully!
              </p>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {!generating && !genDone && (
                <>
                  <button
                    onClick={closeModal}
                    className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-500 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generatePDF}
                    className="rounded-md bg-green-500 px-4 py-2 text-sm text-white transition hover:bg-green-600"
                  >
                    Generate PDF
                  </button>
                </>
              )}
              {genDone && (
                <button
                  onClick={closeModal}
                  className="rounded-md bg-green-500 px-4 py-2 text-sm text-white transition hover:bg-green-600"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
