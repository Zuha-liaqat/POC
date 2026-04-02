import { Copy, Download, Mail, Printer, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  downloadPdfDocument,
  listPdfDocuments,
  type PdfDocument,
} from "@/lib/api";

type ProposalPreviewState = {
  brochure?: {
    id: string;
    name: string;
    date: string;
    size: string;
    status: string;
    backendId?: number;
  };
};

const heroImage =
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80";

function formatTitle(name?: string) {
  if (!name) return "Luxury Estate Portfolio - 2024";
  return name
    .replace(/_/g, " ")
    .replace(/\.pdf$/i, "")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function triggerBlobDownload(url: string, fileName: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function ProposalPreview() {
  const { toast } = useToast();
  const { brochureId } = useParams();
  const location = useLocation();
  const state = (location.state ?? {}) as ProposalPreviewState;
  const [backendDocument, setBackendDocument] = useState<PdfDocument | null>(
    null,
  );
  const [isDownloading, setIsDownloading] = useState(false);

  const brochure = state.brochure ?? {
    id: brochureId ?? "INV-8842",
    name: "Luxury_Estate_Portfolio_2024.pdf",
    date: "Jun 2024",
    size: "8.4 MB",
    status: "Processed",
  };

  useEffect(() => {
    if (!brochureId) return;

    let cancelled = false;

    async function loadDocumentInfo() {
      try {
        const documents = await listPdfDocuments();
        if (cancelled) return;

        const match = documents.find(
          (document) => String(document.id) === String(brochure.backendId ?? brochureId),
        );

        if (match) {
          setBackendDocument(match);
        }
      } catch {
        // Leave static preview as-is if lookup fails.
      }
    }

    void loadDocumentInfo();

    return () => {
      cancelled = true;
    };
  }, [brochure.backendId, brochureId]);

  const proposalTitle = formatTitle(brochure.name);
  const downloadDocId = brochure.backendId ?? brochureId;
  const downloadLabel = isDownloading ? "Downloading..." : "Download PDF";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Preview link copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Clipboard access is not available in this browser.",
        variant: "destructive",
      });
    }
  };

  async function handleDownload() {
    if (!downloadDocId) return;

    setIsDownloading(true);

    try {
      const response = await downloadPdfDocument(downloadDocId);
      const nextPdfUrl = URL.createObjectURL(response.blob);
      triggerBlobDownload(
        nextPdfUrl,
        response.fileName ?? brochure.name ?? `document-${downloadDocId}.pdf`,
      );
      window.setTimeout(() => URL.revokeObjectURL(nextPdfUrl), 1000);
    } catch (error) {
      toast({
        title: "Download failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to download this PDF.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  }

  function handleEmailShare() {
    const subject = encodeURIComponent(
      `Proposal: ${backendDocument?.name ?? brochure.name}`.trim(),
    );
    const body = encodeURIComponent(
      `Please review this proposal.\n\nDocument ID: ${downloadDocId ?? "N/A"}\nPreview link: ${window.location.href}`,
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] px-3 py-3 sm:px-4">
      <div className="mx-auto max-w-[1500px] rounded-[2px] border border-[#e6e7eb] bg-[#f8f8f9] shadow-[0_8px_40px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5 text-[12px] leading-none text-[#94a3b8]">
              <span>Proposals</span>
              <span className="text-[#cbd5e1]">&gt;</span>
              <span className="font-semibold text-[#334155]">
                Real Estate Client Proposal
              </span>
            </div>
            <h1 className="text-[17px] font-bold tracking-[-0.02em] text-[#0f172a] sm:text-[18px]">
              {proposalTitle}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-[12px] border border-[#e2e8f0] bg-white p-1.5 shadow-[0_4px_18px_rgba(15,23,42,0.05)]">
            <button
              onClick={() => void handleDownload()}
              disabled={!downloadDocId || isDownloading}
              className="inline-flex h-8 items-center gap-2 rounded-[8px] px-3 text-[11px] font-medium text-[#334155] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:text-[#94a3b8]"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.8} />
              {downloadLabel}
            </button>
            <button
              onClick={handleEmailShare}
              className="inline-flex h-8 items-center gap-2 rounded-[8px] px-3 text-[11px] font-medium text-[#334155] transition hover:bg-[#f8fafc]"
            >
              <Mail className="h-3.5 w-3.5" strokeWidth={1.8} />
              Share via Email
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex h-8 items-center gap-2 rounded-[8px] px-3 text-[11px] font-medium text-[#334155] transition hover:bg-[#f8fafc]"
            >
              <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />
              Copy Link
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex h-8 items-center gap-2 rounded-[8px] px-3 text-[11px] font-medium text-[#334155] transition hover:bg-[#f8fafc]"
            >
              <Printer className="h-3.5 w-3.5" strokeWidth={1.8} />
              Print
            </button>
            <button
              onClick={handleEmailShare}
              className="inline-flex h-8 items-center gap-2 rounded-[8px] bg-[#22c55e] px-3.5 text-[11px] font-semibold text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.12)] transition hover:bg-[#16a34a]"
            >
              <Send className="h-3.5 w-3.5" strokeWidth={1.8} />
              Send to Client
            </button>
          </div>
        </div>

        <div className="mx-5 mb-5 overflow-hidden border border-[#e5e7eb] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
          <div className="relative h-[304px] overflow-hidden sm:h-[370px] lg:h-[410px]">
            <img
              src={heroImage}
              alt="Luxury real estate preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_10%,rgba(15,23,42,0.12)_45%,rgba(15,23,42,0.68)_100%)]" />

            <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end px-7 pb-8 pt-24 sm:px-9 sm:pb-9">
              <div className="mb-4 inline-flex w-fit rounded-[3px] bg-[#22c55e] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                Exclusive Investment Proposal
              </div>
              <h2 className="max-w-3xl text-[36px] font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-[48px] lg:text-[52px]">
                Prime Real Estate Portfolio
              </h2>
              <p className="mt-2 text-[16px] font-medium text-white/75">
                Prepared for Mr. &amp; Mrs. Henderson — June 2024
              </p>
            </div>
          </div>

          <div className="grid gap-8 px-10 py-12 lg:grid-cols-[minmax(0,1fr)_176px] lg:gap-10 lg:px-12">
            <div className="max-w-[620px]">
              <p className="text-[14px] font-bold uppercase tracking-[0.13em] text-[#22c55e]">
                Executive Summary
              </p>
              <div className="mt-5 space-y-5 text-[15px] leading-[2.1] text-[#475569]">
                <p>
                  Legacy Investment is pleased to present this diversified real
                  estate acquisition strategy. Our focus remains on high-yield
                  residential development in emerging premium markets,
                  specifically targeting the southeast corridor with a projected
                  12.4% IRR.
                </p>
                <p>
                  This proposal outlines three core assets currently in
                  pre-market phases, offering a unique first-mover advantage
                  for your portfolio expansion.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div className="rounded-[12px] bg-[#f8fafc] px-6 py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#94a3b8]">
                  Total Valuation
                </p>
                <p className="mt-1.5 text-[18px] font-bold tracking-[-0.03em] text-[#0f172a]">
                  $8,450,000
                </p>
              </div>
              <div className="rounded-[12px] bg-[#f8fafc] px-6 py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#94a3b8]">
                  Expected Yield
                </p>
                <p className="mt-1.5 text-[18px] font-bold tracking-[-0.03em] text-[#22c55e]">
                  6.8% Annually
                </p>
              </div>
            </div>
          </div>

          <div className="mx-10 border-t border-[#eef2f7]" />

          <div className="px-10 pb-8 pt-10 lg:px-12">
            <h3 className="text-[16px] font-bold tracking-[-0.03em] text-[#0f172a]">
              Projected Asset Allocation
            </h3>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div>
                <div className="mb-2 h-[6px] rounded-full bg-[#edf2f7]">
                  <div className="h-[6px] w-[45%] rounded-full bg-[#22c55e]" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#0f172a]">
                  <span>Residential</span>
                  <span>45%</span>
                </div>
              </div>

              <div>
                <div className="mb-2 h-[6px] rounded-full bg-[#edf2f7]">
                  <div className="h-[6px] w-[35%] rounded-full bg-[#94a3b8]" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#0f172a]">
                  <span>Commercial</span>
                  <span>35%</span>
                </div>
              </div>

              <div>
                <div className="mb-2 h-[6px] rounded-full bg-[#edf2f7]">
                  <div className="h-[6px] w-[20%] rounded-full bg-[#cbd5e1]" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#0f172a]">
                  <span>Development</span>
                  <span>20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
