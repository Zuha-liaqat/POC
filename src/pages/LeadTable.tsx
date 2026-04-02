import { useState, useRef, useEffect } from "react";
import {
  Building2,
  Briefcase,
  Shield,
  HeartPulse,
  Home,
  Globe,
  Plus,
  SlidersHorizontal,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  ChevronDown,
  UserPlus,
} from "lucide-react";
import CreateLeadForm from "./CreateLeadForm";

type Lead = {
  name: string;
  company: string;
  status: string;
  value: string;
  source: string;
  icon: string;
};

const initialLeads: Lead[] = [
  {
    name: "John Doe",
    company: "Global Tech Solutions Inc.",
    status: "New",
    value: "$50,000",
    source: "Website",
    icon: "building",
  },
  {
    name: "Jane Smith",
    company: "Financorp Partners",
    status: "Contacted",
    value: "$120,000",
    source: "Referral",
    icon: "briefcase",
  },
  {
    name: "Robert Brown",
    company: "EcoSolutions Energy",
    status: "Qualified",
    value: "$85,000",
    source: "LinkedIn",
    icon: "shield",
  },
  {
    name: "Emily White",
    company: "HealthPlus Systems",
    status: "New",
    value: "$30,000",
    source: "Zoho CRM",
    icon: "medical",
  },
  {
    name: "Michael Green",
    company: "Urban Build Co.",
    status: "Contacted",
    value: "$200,000",
    source: "Cold Call",
    icon: "home",
  },
  {
    name: "Sarah Jenkins",
    company: "TechStream Media",
    status: "In Negotiation",
    value: "$42,500",
    source: "Social Media",
    icon: "globe",
  },
];

const syncedLead: Lead = {
  name: "Hiren Naker",
  company: "Legacy Investment",
  status: "New",
  value: "$95,000",
  source: "Zoho CRM",
  icon: "briefcase",
};

const tabs = ["All Leads", "New", "Contacted", "Qualified", "In Negotiation"];

const badgeStyles: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-amber-100 text-amber-700",
  Qualified: "bg-sky-100 text-sky-700",
  "In Negotiation": "bg-purple-100 text-purple-700",
};

const iconOptions = [
  "building",
  "briefcase",
  "shield",
  "medical",
  "home",
  "globe",
];

function LeadIcon({ type }: { type: string }) {
  const cls = "w-5 h-5 text-[#475569]";
  const icons: Record<string, React.ReactNode> = {
    building: <Building2 className={cls} />,
    briefcase: <Briefcase className={cls} />,
    shield: <Shield className={cls} />,
    medical: <HeartPulse className={cls} />,
    home: <Home className={cls} />,
    globe: <Globe className={cls} />,
  };
  return <>{icons[type] ?? <Globe className={cls} />}</>;
}

// ─── Sync Popup ───────────────────────────────────────────────────────────────
function SyncPopup({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"syncing" | "done">("syncing");
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "Connecting to Zoho CRM", sub: "Authenticating credentials…" },
    { label: "Fetching leads", sub: "Pulling latest records…" },
    { label: "Updating pipeline", sub: "Saving to your dashboard…" },
  ];

  useEffect(() => {
    const s1 = setTimeout(() => setActiveStep(1), 700);
    const s2 = setTimeout(() => setActiveStep(2), 1600);
    const s3 = setTimeout(() => {
      setActiveStep(3);
      setTimeout(() => setPhase("done"), 400);
    }, 2400);
    return () => {
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(s3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <style>{`
        @keyframes stepIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
        @keyframes popIn{0%{transform:scale(0.8);opacity:0}70%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
        @keyframes cardSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spinRing{to{transform:rotate(360deg)}}
        @keyframes orbitPulse{0%,100%{opacity:.12}50%{opacity:.28}}
        .step-in{animation:stepIn 0.35s ease forwards}
        .pop-in{animation:popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards}
        .card-slide{animation:cardSlide 0.4s ease 0.15s both}
        .orbit-pulse{animation:orbitPulse 2.2s ease-in-out infinite}
      `}</style>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {phase === "syncing" ? (
          <>
            {/* Blue header */}
            <div className="relative bg-[#0EA5E9] px-6 pt-8 pb-14 flex flex-col items-center overflow-hidden">
              <div className="orbit-pulse absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 border-white/25" />
              <div
                className="orbit-pulse absolute -bottom-16 -left-14 w-56 h-56 rounded-full border border-white/15"
                style={{ animationDelay: "0.8s" }}
              />
              {/* Spinning ring + Zoho logo */}
              <div className="relative w-20 h-20 mb-4 z-10">
                <svg
                  className="absolute inset-0 w-full h-full"
                  style={{ animation: "spinRing 1.8s linear infinite" }}
                  viewBox="0 0 80 80"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="2.5"
                    strokeDasharray="10 7"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-2 rounded-2xl bg-white/25 flex items-center justify-center">
                  <img
                    src="/zohocrm.webp"
                    alt="Zoho"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight z-10">
                Syncing with Zoho
              </h2>
              <p className="text-xs text-sky-200 mt-1 text-center z-10">
                Fetching your latest leads…
              </p>
            </div>

            {/* Wave divider */}
            <div className="-mt-5 overflow-hidden h-6">
              <svg
                viewBox="0 0 400 24"
                className="w-full"
                preserveAspectRatio="none"
                style={{ display: "block" }}
              >
                <path
                  d="M0 24 Q100 4 200 14 Q300 24 400 8 L400 24 Z"
                  fill="white"
                />
              </svg>
            </div>

            {/* Steps */}
            <div className="px-6 -mt-1 flex flex-col">
              {steps.map((step, i) => {
                const done = i < activeStep;
                const active = i === activeStep;
                return (
                  <div
                    key={i}
                    className="step-in flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
                    style={{ animationDelay: `${i * 0.12}s`, opacity: 0 }}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${done ? "bg-[#0EA5E9]" : active ? "bg-sky-100 ring-2 ring-sky-300 ring-offset-1" : "bg-gray-100"}`}
                    >
                      {done ? (
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : active ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9] animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-xs font-semibold transition-colors ${done ? "text-[#0EA5E9]" : active ? "text-[#0F172A]" : "text-gray-400"}`}
                      >
                        {step.label}
                      </p>
                      {active && (
                        <p className="text-[10px] text-[#64748B] mt-0.5">
                          {step.sub}
                        </p>
                      )}
                      {done && (
                        <p className="text-[10px] text-sky-500 mt-0.5">Done</p>
                      )}
                    </div>
                    {done && (
                      <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full flex-shrink-0">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="px-6 py-5">
              <div className="flex justify-between text-[10px] mb-2">
                <span className="font-semibold text-[#22C55E]">Syncing…</span>
                <span className="text-gray-400">
                  {Math.round((activeStep / steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-[#22C55E] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${(activeStep / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Success header */}
            <div className="relative bg-[#16A34A] px-6 pt-8 pb-14 flex flex-col items-center overflow-hidden">
              <div className="orbit-pulse absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 border-white/25" />
              <div className="orbit-pulse absolute -bottom-16 -left-14 w-56 h-56 rounded-full border border-white/15" />
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4 pop-in z-10">
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white z-10">
                Sync Complete!
              </h2>
              <p className="text-xs text-green-200 mt-1 z-10">
                Your pipeline is up to date.
              </p>
            </div>

            <div className="-mt-5 overflow-hidden h-6">
              <svg
                viewBox="0 0 400 24"
                className="w-full"
                preserveAspectRatio="none"
                style={{ display: "block" }}
              >
                <path
                  d="M0 24 Q100 4 200 14 Q300 24 400 8 L400 24 Z"
                  fill="white"
                />
              </svg>
            </div>

            <div className="px-6 pb-6 -mt-1 flex flex-col gap-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "New Leads",
                    value: "1",
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Updated",
                    value: "6",
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                  {
                    label: "Total",
                    value: "7",
                    color: "text-[#0EA5E9]",
                    bg: "bg-sky-50",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`${stat.bg} rounded-2xl p-3 text-center`}
                  >
                    <p className={`text-xl font-extrabold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* New lead preview */}
              <div className="card-slide flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-sky-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#0F172A]">
                      Hiren Naker
                    </p>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      NEW
                    </span>
                  </div>
                  <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                    Legacy Investment Capital · $95,000
                  </p>
                </div>
                <div className="text-[10px] text-[#0EA5E9] font-bold bg-sky-50 px-2 py-1 rounded-lg flex-shrink-0">
                  Added ↑
                </div>
              </div>

              <button
                onClick={onDone}
                className="w-full bg-[#22C55E] hover:bg-green-600 text-white text-sm font-semibold py-3 rounded-2xl transition-colors"
              >
                View Pipeline →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── 3-Dot Dropdown ───────────────────────────────────────────────────────────
function ThreeDotMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-36 overflow-hidden py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onEdit();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Lead
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Edit Lead Modal ──────────────────────────────────────────────────────────
function EditLeadModal({
  lead,
  onClose,
  onSave,
}: {
  lead: Lead;
  onClose: () => void;
  onSave: (l: Lead) => void;
}) {
  const sources = [
    "Website",
    "Referral",
    "LinkedIn",
    "Cold Call",
    "Social Media",
    "Zoho CRM",
  ];
  const statuses = ["New", "Contacted", "Qualified", "In Negotiation"];

  const nameParts = lead.name.split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] ?? "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") ?? "");
  const [company, setCompany] = useState(lead.company);
  const [value, setValue] = useState(lead.value);
  const [status, setStatus] = useState(lead.status);
  const [source, setSource] = useState(lead.source);
  const [icon, setIcon] = useState(lead.icon);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const handleSave = () => {
    onSave({
      name: `${firstName} ${lastName}`.trim() || "Unnamed Lead",
      company,
      status,
      value,
      source,
      icon,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1.5">
            <UserPlus className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Edit Lead</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Update lead information.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#0F172A] mb-1 block">
                First Name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#6B7280] focus:outline-none focus:border-green-400 bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-[#0F172A] mb-1 block">
                Last Name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#6B7280] focus:outline-none focus:border-green-400 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#0F172A] mb-1 block">Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#0F172A] mb-1 block">
                Estimated Value
              </label>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="text-xs text-[#0F172A] mb-1 block">
                Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStatusOpen(!statusOpen)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm text-left flex items-center justify-between focus:outline-none bg-white ${statusOpen ? "border-green-400" : "border-gray-200"}`}
                >
                  <span className="text-gray-800">{status}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${statusOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {statusOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {statuses.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setStatus(s);
                          setStatusOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm ${status === s ? "bg-green-500 text-white" : "text-gray-700 hover:bg-green-50 hover:text-green-700"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#0F172A] mb-1 block">
              Lead Source
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSourceOpen(!sourceOpen)}
                className={`w-full border rounded-lg px-3 py-2 text-sm text-left flex items-center justify-between focus:outline-none bg-white ${sourceOpen ? "border-green-400" : "border-gray-200"}`}
              >
                <span className={source ? "text-gray-800" : "text-gray-400"}>
                  {source || "Select a source"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${sourceOpen ? "rotate-180" : ""}`}
                />
              </button>
              {sourceOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {sources.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSource(s);
                        setSourceOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm ${source === s ? "bg-green-500 text-white" : "text-gray-700 hover:bg-green-50 hover:text-green-700"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-[#0F172A] mb-1 block">Icon</label>
            <div className="flex gap-2">
              {iconOptions.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${icon === ic ? "border-green-400 bg-green-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                >
                  <LeadIcon type={ic} />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-[#22C55E] hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors mt-1"
          >
            Save Changes →
          </button>
          <button
            onClick={onClose}
            className="w-full text-sm text-gray-800 py-1.5 transition-colors"
          >
            Cancel
          </button>
          <p className="text-center text-[10px] text-gray-300 tracking-widest uppercase mt-1">
            Legacy Investment
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ZohoCRMLeads() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeTab, setActiveTab] = useState("All Leads");
  const [showModal, setShowModal] = useState(false);
  const [showSync, setShowSync] = useState(false);
  const [editingLead, setEditingLead] = useState<{
    index: number;
    data: Lead;
  } | null>(null);

  const filtered =
    activeTab === "All Leads"
      ? leads
      : leads.filter((l) => l.status === activeTab);

  const handleSyncDone = () => {
    setShowSync(false);
    setLeads((prev) => [syncedLead, ...prev]);
  };

  const handleEditSave = (updated: Lead) => {
    if (editingLead === null) return;
    setLeads((prev) =>
      prev.map((l, i) => (i === editingLead.index ? updated : l)),
    );
    setEditingLead(null);
  };

  const handleDelete = (globalIndex: number) => {
    setLeads((prev) => prev.filter((_, i) => i !== globalIndex));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Sync Popup */}
      {showSync && <SyncPopup onDone={handleSyncDone} />}

      {/* Edit Modal */}
      {editingLead !== null && (
        <EditLeadModal
          lead={editingLead.data}
          onClose={() => setEditingLead(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Create Lead Form — original component untouched */}
      <CreateLeadForm open={showModal} onClose={() => setShowModal(false)} />

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">
            Zoho CRM Leads
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Efficiently manage and track your investment prospects pipeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSync(true)}
            className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-sky-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <img src="/zohocrm.webp" alt="Zoho CRM" className="w-4 h-4" />
            <span>Sync with Zoho</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-sky-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
          <button className="w-9 h-9 sm:flex items-center justify-center border border-gray-200 rounded-lg bg-white hover:bg-gray-100 transition-colors flex-shrink-0 hidden">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              activeTab === tab
                ? "bg-[#0EA5E9] hover:bg-sky-600 text-white border-[#0EA5E9]"
                : "bg-white text-[#475569] border-gray-200 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          No leads found for this status.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((lead, filteredIdx) => {
            const globalIdx = leads.indexOf(lead);
            return (
              <div
                key={filteredIdx}
                className="bg-white justify-between border border-gray-200 rounded-xl p-3 flex flex-col gap-5"
              >
                {/* Top: icon | status badge + 3 dots */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                    <LeadIcon type={lead.icon} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${badgeStyles[lead.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {lead.status}
                    </span>
                    <ThreeDotMenu
                      onEdit={() =>
                        setEditingLead({ index: globalIdx, data: lead })
                      }
                      onDelete={() => handleDelete(globalIdx)}
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <p className="text-sm font-bold text-gray-800">{lead.name}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {lead.company}
                  </p>
                </div>

                <hr className="border-gray-100" />

                {/* Meta */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-[#94A3B8] uppercase tracking-wide">
                      Estimated Value
                    </p>
                    <p className="text-xs font-bold text-gray-800">
                      {lead.value}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-[#94A3B8] uppercase tracking-wide">
                      Source
                    </p>
                    <p className="text-xs font-semibold text-gray-800">
                      {lead.source}
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button className="w-full border border-gray-200 rounded-lg text-[#0EA5E9] text-sm font-medium py-1.5 hover:bg-gray-50 transition-colors mt-1">
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
