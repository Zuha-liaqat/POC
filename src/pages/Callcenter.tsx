import { useState, useEffect, useRef, useCallback } from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Pause,
  ArrowRightLeft,
  Mail,
  MapPin,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Plus,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const API_BASE_URL = "https://legacy-investment-234ef603a883.herokuapp.com";

interface CallLog {
  id: number;
  date: string;
  time: string;
  leadName: string;
  initials: string;
  initialsColor: string;
  duration: string;
  outcome: string;
  outcomeColor: string;
  leadStatus: string;
  leadStatusColor: string;
  email: string;
  phone: string;
  location: string;
  label: string;
  targetArea: string;
  budget: string;
  propertyType: string;
  currentStatus: string;
  lastActivity: { action: string; date: string }[];
}

const callLogs: CallLog[] = [
  {
    id: 1,
    date: "Oct 24, 2023",
    time: "10:45 AM",
    leadName: "HIREN NAKER",
    initials: "HN",
    initialsColor: "bg-indigo-500",
    duration: "08m 24s",
    outcome: "Successful Call",
    outcomeColor: "text-sky-500",
    leadStatus: "Hot Lead",
    leadStatusColor: "text-red-500",
    email: "hiren@email.com",
    phone: "+1 234 567 890",
    location: "San Francisco, CA",
    label: "Potential High-End Buyer",
    targetArea: "Pacific Heights / Presidio",
    budget: "$3.5M - $5.0M",
    propertyType: "Single Family Home",
    currentStatus: "Discovery Call",
    lastActivity: [
      {
        action: 'Email sent: "Viewing Schedule"',
        date: "Yesterday at 2:15 PM",
      },
      { action: "Viewed Property: 245 Pine St.", date: "Dec 12 at 10:04 AM" },
    ],
  },
  {
    id: 2,
    date: "Oct 24, 2023",
    time: "09:15 AM",
    leadName: "MONICA RACAL",
    initials: "MR",
    initialsColor: "bg-pink-500",
    duration: "02m 10s",
    outcome: "Follow-up Needed",
    outcomeColor: "text-purple-400",
    leadStatus: "Cold Lead",
    leadStatusColor: "text-blue-400",
    email: "monica@email.com",
    phone: "+1 987 654 321",
    location: "Los Angeles, CA",
    label: "First-time Buyer",
    targetArea: "Beverly Hills",
    budget: "$1.5M - $2.5M",
    propertyType: "Condo",
    currentStatus: "Initial Contact",
    lastActivity: [{ action: "Called: No answer", date: "Oct 23 at 4:30 PM" }],
  },
  {
    id: 3,
    date: "Oct 23, 2023",
    time: "04:30 PM",
    leadName: "DAVID SCHMIDT",
    initials: "DC",
    initialsColor: "bg-teal-500",
    duration: "15m 45s",
    outcome: "Meeting Booked",
    outcomeColor: "text-sky-400",
    leadStatus: "Converted",
    leadStatusColor: "text-sky-600",
    email: "david@email.com",
    phone: "+1 555 123 456",
    location: "New York, NY",
    label: "Investor",
    targetArea: "Manhattan / Upper East Side",
    budget: "$5M - $10M",
    propertyType: "Penthouse",
    currentStatus: "Negotiation",
    lastActivity: [
      { action: "Meeting scheduled for Oct 30", date: "Oct 23 at 5:00 PM" },
    ],
  },
  {
    id: 4,
    date: "Oct 23, 2023",
    time: "02:12 PM",
    leadName: "Robert Peterson",
    initials: "RP",
    initialsColor: "bg-amber-600",
    duration: "09m 45s",
    outcome: "No Answer",
    outcomeColor: "text-red-500",
    leadStatus: "Unchanged",
    leadStatusColor: "text-muted-foreground",
    email: "r.peterson@email.com",
    phone: "+1 444 789 012",
    location: "Chicago, IL",
    label: "Returning Client",
    targetArea: "Lincoln Park",
    budget: "$800K - $1.2M",
    propertyType: "Townhouse",
    currentStatus: "Re-engagement",
    lastActivity: [{ action: "Voicemail left", date: "Oct 23 at 2:15 PM" }],
  },
];

function toE164(raw: string): string {
  const digits = raw.trim().replace(/\D/g, "");
  if (!digits.length) return "";
  if (raw.trim().startsWith("+")) return `+${digits}`;
  return digits.length >= 10 ? `+1${digits}` : `+${digits}`;
}

async function makeCall(
  to: string,
): Promise<{ ok: boolean; callSid?: string; message?: string }> {
  const res = await fetch(`${API_BASE_URL}/api/calls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ to }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const d = data.detail;
    const message =
      typeof d === "string"
        ? d
        : Array.isArray(d)
          ? d
              .map((x: { msg?: string }) => x?.msg)
              .filter(Boolean)
              .join(" ")
          : data.message || res.statusText;
    return { ok: false, message: message || "Failed to place call" };
  }
  const callSid: string | undefined =
    data.callSid ?? data.call_sid ?? data.sid ?? data.data?.callSid;
  return { ok: true, callSid };
}

async function endCall(
  callSid: string,
): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(`${API_BASE_URL}/api/calls/${callSid}/end`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const d = data.detail;
    const message =
      typeof d === "string"
        ? d
        : Array.isArray(d)
          ? d
              .map((x: { msg?: string }) => x?.msg)
              .filter(Boolean)
              .join(" ")
          : data.message || res.statusText;
    return { ok: false, message: message || "Failed to end call" };
  }
  return { ok: true };
}

type TwilioCallStatus =
  | "queued"
  | "initiated"
  | "ringing"
  | "in-progress"
  | "completed"
  | "busy"
  | "no-answer"
  | "canceled"
  | "failed";

export default function CallCenterPage() {
  const [view, setView] = useState<"history" | "active">("history");
  const [selectedLead, setSelectedLead] = useState<CallLog | null>(null);
  const [mobilePanel, setMobilePanel] = useState<"lead" | "dialer">("lead");

  const [dialedNumber, setDialedNumber] = useState("");
  const [callLoading, setCallLoading] = useState(false);
  const [endCallLoading, setEndCallLoading] = useState(false);
  const [isCallPlaced, setIsCallPlaced] = useState(false);
  const [callSid, setCallSid] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<TwilioCallStatus | null>(null);

  const callStartTimeRef = useRef<number | null>(null);
  const [callTimer, setCallTimer] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [callNotes, setCallNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const dialerRef = useRef<HTMLDivElement>(null);

  // Timer — only ticks when call is in-progress
  useEffect(() => {
    if (callStatus !== "in-progress") return;
    setCallTimer(0);
    const interval = setInterval(() => setCallTimer((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  // WebSocket — connect after callSid is set
  useEffect(() => {
    if (!callSid) return;

    const wsUrl = `wss://legacy-investment-234ef603a883.herokuapp.com/api/ws/calls/${callSid}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[WS] Connected for callSid:", callSid);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "twilio.call_status") {
          const status: TwilioCallStatus = msg.callStatus;
          console.log("[WS] Call status:", status);
          setCallStatus(status);

          if (status === "in-progress") {
            callStartTimeRef.current = Date.now();
          }

          if (
            status === "completed" ||
            status === "busy" ||
            status === "no-answer" ||
            status === "canceled" ||
            status === "failed"
          ) {
            const label =
              status === "completed"
                ? "Call ended"
                : status === "busy"
                  ? "Line busy"
                  : status === "no-answer"
                    ? "No answer"
                    : status === "canceled"
                      ? "Call canceled"
                      : "Call failed";
            toast.info(label);
            setIsCallPlaced(false);
            setCallSid(null);
            setCallStatus(null);
            setDialedNumber("");
            ws.close();
          }
        }
      } catch (err) {
        console.error("[WS] Parse error:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("[WS] Error:", err);
    };

    ws.onclose = () => {
      console.log("[WS] Disconnected");
    };

    return () => {
      ws.close();
    };
  }, [callSid]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;
      if (view !== "active" || isCallPlaced) return;

      const key = e.key;
      if (/^[0-9]$/.test(key) || key === "*" || key === "#" || key === "+") {
        setDialedNumber((prev) => prev + key);
        return;
      }
      if (key === "Backspace") {
        setDialedNumber((prev) => prev.slice(0, -1));
        return;
      }
      if (key === "Enter") {
        const el = document.activeElement as HTMLElement;
        if (el?.tagName !== "BUTTON") {
          const e164 = toE164(dialedNumber);
          if (e164) document.getElementById("start-call-btn")?.click();
        }
      }
    },
    [view, isCallPlaced, dialedNumber],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleRowClick = (log: CallLog) => {
    setSelectedLead(log);
    setDialedNumber("");
    setCallNotes("");
    setIsMuted(false);
    setIsOnHold(false);
    setIsCallPlaced(false);
    setCallSid(null);
    setCallStatus(null);
    setCallTimer(0);
    callStartTimeRef.current = null;
    setMobilePanel("lead");
    setView("active");
  };

  const handleNumpadPress = (num: string | number) => {
    if (!isCallPlaced) setDialedNumber((prev) => prev + String(num));
  };

  const handleStartCall = async () => {
    const e164 = toE164(dialedNumber);
    if (!e164) {
      toast.error("Valid phone number daalen");
      return;
    }
    setCallLoading(true);
    const { ok, callSid: sid, message } = await makeCall(e164);
    setCallLoading(false);
    if (ok) {
      setIsCallPlaced(true);
      setCallStatus("initiated");
      setCallTimer(0);
      if (sid) {
        setCallSid(sid);
        toast.success(`Call placed to ${e164}`);
      } else {
        toast.warning(
          `Call placed to ${e164} — WebSocket unavailable (no callSid returned)`,
        );
      }
    } else {
      toast.error(message || "Failed to place call");
    }
  };

  const handleEndCall = async () => {
    setEndCallLoading(true);
    if (callSid) {
      const { ok, message } = await endCall(callSid);
      if (!ok) toast.error(message || "Failed to end call");
    }
    wsRef.current?.close();
    wsRef.current = null;
    setIsCallPlaced(false);
    setCallSid(null);
    setCallStatus(null);
    setEndCallLoading(false);
    callStartTimeRef.current = null;
    setDialedNumber("");
  };

  const callStatusLabel = (): { text: string; pulse: boolean } => {
    switch (callStatus) {
      case "initiated":
      case "queued":
        return { text: "Initiating...", pulse: true };
      case "ringing":
        return { text: "Ringing...", pulse: true };
      case "in-progress":
        return { text: `Connected • ${formatTime(callTimer)}`, pulse: false };
      default:
        return { text: "Connecting...", pulse: true };
    }
  };

  const filtered = callLogs.filter((l) =>
    l.leadName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (view === "active" && selectedLead) {
    const statusInfo = callStatusLabel();

    return (
      <div className="space-y-4 p-4 lg:p-8">
        <button
          onClick={() => setView("history")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to History
        </button>

        <div className="lg:hidden flex rounded-lg border border-gray-200 overflow-hidden text-sm font-medium mb-4">
          <button
            onClick={() => setMobilePanel("lead")}
            className={`flex-1 py-2 transition ${mobilePanel === "lead" ? "bg-[#0EA5E9] text-white" : "bg-white text-gray-600"}`}
          >
            Lead Info
          </button>
          <button
            onClick={() => setMobilePanel("dialer")}
            className={`flex-1 py-2 transition ${mobilePanel === "dialer" ? "bg-[#0EA5E9] text-white" : "bg-white text-gray-600"}`}
          >
            {isCallPlaced
              ? callStatus === "in-progress"
                ? `Dialer • ${formatTime(callTimer)}`
                : `Dialer • ${statusInfo.text}`
              : "Dialer"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div
            ref={dialerRef}
            tabIndex={0}
            className={`bg-white rounded-xl flex flex-col items-center text-gray-800 shadow order-2 lg:order-1 outline-none ${mobilePanel === "dialer" ? "block" : "hidden lg:flex"}`}
          >
            <div className="w-full bg-[#F8FAFC80] rounded-xl p-5 flex flex-col items-center mb-6">
              <div className="relative w-20 h-20 mb-3">
                <div className="absolute inset-0 rounded-full bg-sky-200 flex items-center justify-center" />
                <div className="w-16 h-16 rounded-full bg-[#0EA5E9] flex items-center justify-center m-auto relative top-2">
                  <Phone className="w-7 h-7 text-white" />
                </div>
              </div>

              <h3 className="font-bold text-lg">
                {isCallPlaced ? "Active Call" : "Place Call"}
              </h3>

              {isCallPlaced && dialedNumber && (
                <p className="text-sm text-gray-500 font-mono mt-0.5">
                  {dialedNumber}
                </p>
              )}

              {isCallPlaced ? (
                <div className="flex flex-col items-center my-2">
                  {callStatus === "in-progress" ? (
                    <p className="text-3xl font-mono font-bold">
                      {formatTime(callTimer)}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-600">
                      <span
                        className={`w-2.5 h-2.5 rounded-full bg-yellow-400 ${statusInfo.pulse ? "animate-pulse" : ""}`}
                      />
                      {statusInfo.text}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full flex justify-center">
                  <input
                    type="text"
                    value={dialedNumber}
                    onChange={(e) => {
                      if (!isCallPlaced)
                        setDialedNumber(
                          e.target.value.replace(/[^\d+*#]/g, ""),
                        );
                    }}
                    placeholder=""
                    readOnly={isCallPlaced}
                    className="text-xl font-mono font-semibold my-2 text-gray-700 tracking-widest min-h-[2rem] text-center bg-transparent border-none outline-none w-full placeholder:text-gray-300 placeholder:text-sm"
                  />
                </div>
              )}

              <p className="text-xs text-sky-600 mb-3 mt-2">
                {isCallPlaced ? "Connected via Twilio" : "Twilio via backend"}
              </p>
            </div>

            <div className="w-full p-6">
              <div className="flex justify-center gap-8 mb-8 py-4">
                <button
                  onClick={() =>
                    callStatus === "in-progress" && setIsMuted(!isMuted)
                  }
                  className={`flex flex-col items-center gap-1 text-xs ${callStatus === "in-progress" ? "text-black" : "text-gray-300 cursor-not-allowed"}`}
                >
                  <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
                    {isMuted ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </div>
                  Mute
                </button>
                <button
                  onClick={() =>
                    callStatus === "in-progress" && setIsOnHold(!isOnHold)
                  }
                  className={`flex flex-col items-center gap-1 text-xs ${callStatus === "in-progress" ? "text-black" : "text-gray-300 cursor-not-allowed"}`}
                >
                  <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
                    <Pause className="w-4 h-4" />
                  </div>
                  Hold
                </button>
                <button
                  className={`flex flex-col items-center gap-1 text-xs ${callStatus === "in-progress" ? "text-black" : "text-gray-300 cursor-not-allowed"}`}
                >
                  <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  Transfer
                </button>
              </div>

              <div className="grid grid-cols-3 gap-y-6 w-56 mx-auto text-lg text-gray-600 mb-4">
                {[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "*",
                  "0",
                  "#",
                ].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleNumpadPress(n)}
                    className={`text-xl font-medium transition ${isCallPlaced ? "text-gray-300 cursor-default" : "hover:text-black hover:scale-110"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              {!isCallPlaced ? (
                <button
                  id="start-call-btn"
                  onClick={handleStartCall}
                  disabled={callLoading || !dialedNumber.trim()}
                  className="mt-auto w-full bg-[#0EA5E9] hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold shadow transition"
                >
                  {callLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Phone className="w-4 h-4" />
                  )}
                  {callLoading ? "Connecting..." : "Start Call"}
                </button>
              ) : (
                <button
                  onClick={handleEndCall}
                  disabled={endCallLoading}
                  className="mt-auto w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold shadow transition"
                >
                  {endCallLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <PhoneOff className="w-4 h-4" />
                  )}
                  {endCallLoading ? "Ending..." : "End Call"}
                </button>
              )}
            </div>
          </div>

          {/* ── Lead Info ── */}
          <div
            className={`lg:col-span-2 space-y-4 order-1 lg:order-2 ${mobilePanel === "lead" ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white rounded-xl p-4 lg:p-5 flex flex-wrap items-center gap-4 shadow">
              <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                <img
                  src="/LeadProfile.png"
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-800">
                    {selectedLead.leadName}
                  </h2>
                  <span className="px-2 py-1 bg-sky-50 text-[#0EA5E9] text-xs font-semibold rounded-full">
                    HOT LEAD
                  </span>
                </div>
                <p className="text-sm text-gray-500">{selectedLead.label}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {selectedLead.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedLead.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-xl p-5 shadow">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#94A3B8] mb-4">
                    Inquiry Details
                  </h3>
                  <div className="space-y-2 text-sm text-gray-800">
                    {[
                      ["Target Area", selectedLead.targetArea],
                      ["Budget Range", selectedLead.budget],
                      ["Property Type", selectedLead.propertyType],
                      ["Current Lead Status", selectedLead.currentStatus],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex justify-between border-b border-gray-100 p-3"
                      >
                        <span className="text-[#64748B]">{label}</span>
                        <span className="font-semibold text-right ml-2">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#94A3B8] mb-4">
                    Last Activity
                  </h3>
                  <div className="space-y-3">
                    {selectedLead.lastActivity.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm text-gray-800"
                      >
                        <span className="flex items-center justify-center w-9 h-9 bg-[#F1F5F9] rounded-full shrink-0">
                          {i === 0 ? (
                            <Mail className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </span>
                        <div>
                          <p>{a.action}</p>
                          <p className="text-xs text-gray-400">{a.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#94A3B8]">
                      Call Notes
                    </h3>
                    <span className="flex items-center gap-1 text-xs text-sky-600">
                      <span className="w-1.5 h-1.5 bg-sky-600 rounded-full inline-block" />
                      Syncing to Zoho...
                    </span>
                  </div>
                  <textarea
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Type your notes here during the call..."
                    className="w-full h-44 bg-white italic rounded-lg p-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none transition flex-1"
                  />
                </div>
                <div className="bg-gray-50 border-t border-gray-100 px-5 py-4 flex flex-wrap gap-2">
                  {["#QuickTag", "+ Follow-up", "+ Book Viewing"].map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1 text-xs border bg-white border-gray-300 rounded-sm text-black hover:bg-gray-100 transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {!isCallPlaced && (
              <button
                onClick={() => setMobilePanel("dialer")}
                className="lg:hidden w-full bg-[#0EA5E9] text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold shadow"
              >
                <Phone className="w-4 h-4" /> Open Dialer
              </button>
            )}

            {isCallPlaced && (
              <div
                className={`lg:hidden flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold ${
                  callStatus === "in-progress"
                    ? "bg-sky-50 text-sky-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    callStatus === "in-progress"
                      ? "bg-sky-500"
                      : "bg-yellow-400 animate-pulse"
                  }`}
                />
                {callStatus === "in-progress"
                  ? `Call Active — ${formatTime(callTimer)}`
                  : statusInfo.text}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4 bg-white p-4 lg:p-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-navy">
            Call History & Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your lead engagement activity
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex font-semibold items-center gap-1.5 px-3 hover:bg-white bg-white text-black py-2 text-sm border border-gray-200 rounded-md hover:bg-accent transition">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={() => handleRowClick(callLogs[0])}
            className="flex items-center bg-[#0EA5E9] hover:bg-sky-600 gap-1.5 px-3 py-2 text-sm text-white font-semibold rounded-md transition"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Outbound Call</span>
            <span className="sm:hidden">New Call</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:px-8 pt-2 pb-24">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] lg:w-[180px] bg-white text-gray-800 border border-gray-300">
              <SelectValue placeholder="All Lead Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Lead Statuses</SelectItem>
              <SelectItem value="hot">Hot Lead</SelectItem>
              <SelectItem value="cold">Cold Lead</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[130px] lg:w-[160px] bg-white text-gray-800 border border-gray-300">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <div className="md:ml-auto relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search call logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm border border-gray-300 rounded-md pl-8 pr-3 py-2 bg-white text-gray-800 placeholder-gray-400 w-40 lg:w-52 focus:outline-none focus:ring-1 focus:ring-gray-50"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider bg-gray-100">
                  <th className="text-left px-4 py-4 lg:py-6 font-semibold">
                    Date & Time
                  </th>
                  <th className="text-left p-3 font-semibold">Lead Name</th>
                  <th className="text-left p-3 font-semibold hidden sm:table-cell">
                    Duration
                  </th>
                  <th className="text-left p-3 font-semibold">Call Outcome</th>
                  <th className="text-left p-3 font-semibold hidden md:table-cell">
                    Lead Status
                  </th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => handleRowClick(log)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="p-4">
                      <p className="font-semibold text-gray-800 whitespace-nowrap">
                        {log.date}
                      </p>
                      <p className="text-xs text-gray-500">{log.time}</p>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569] text-xs font-bold shrink-0">
                          {log.initials}
                        </div>
                        <span className="font-semibold text-gray-800 whitespace-nowrap">
                          {log.leadName}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-gray-600 hidden sm:table-cell">
                      {log.duration}
                    </td>

                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${
                          log.outcome === "Successful Call"
                            ? "bg-[#0EA5E9]/10 text-[#0EA5E9]"
                            : log.outcome === "Follow-up Needed"
                              ? "bg-[#FFFBEB] text-[#D97706]"
                              : log.outcome === "Meeting Booked"
                                ? "bg-[#0EA5E9]/10 text-[#0EA5E9]"
                                : "bg-red-100 text-red-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            log.outcome === "Successful Call"
                              ? "bg-[#0EA5E9] "
                              : log.outcome === "Follow-up Needed"
                                ? "bg-orange-500"
                                : log.outcome === "Meeting Booked"
                                  ? "bg-[#0EA5E9] "
                                  : "bg-red-500"
                          }`}
                        />
                        <span className="hidden sm:inline">
                          {log.outcome.toUpperCase()}
                        </span>
                        <span className="sm:hidden">
                          {log.outcome.split(" ")[0].toUpperCase()}
                        </span>
                      </span>
                    </td>

                    <td className="p-3 font-semibold hidden md:table-cell">
                      <span
                        className={`${
                          log.leadStatus === "Hot Lead"
                            ? "text-[#0EA5E9]"
                            : log.leadStatus === "Cold Lead"
                              ? "text-[#475569]"
                              : log.leadStatus === "Converted"
                                ? "text-[#0EA5E9]"
                                : "text-gray-400"
                        }`}
                      >
                        {log.leadStatus}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <button
                        className="text-gray-400 hover:text-gray-600 transition inline-flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(log);
                        }}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-3 py-4 flex flex-wrap items-center justify-between text-xs lg:text-sm bg-[#F8FAFC] text-gray-500 border-t border-gray-200 gap-2">
            <span>
              Showing 1 to {filtered.length} of {callLogs.length} calls
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" /> Previous
              </button>
              <button className="px-3 py-1 bg-white text-black border border-gray-300 rounded hover:bg-gray-100 transition flex items-center gap-1">
                Next <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
