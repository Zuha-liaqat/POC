import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  time: string;
}

const botResponses: Record<string, string> = {
  hello: "Hey there! 👋 How can I help you today?",
  hi: "Hi! 👋 What can I do for you?",
  help: "I can help you with:\n• Lead management\n• Call scheduling\n• Property matching\n• Zoho sync status",
  leads:
    "You can manage leads from the Zoho Integration tab. Need help with a specific lead?",
  call: "Head to the Call tab to view call history or click a lead row to start an active call session.",
  zoho: "Zoho integration is active and syncing. Check the Zoho Integration tab for details.",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, val] of Object.entries(botResponses)) {
    if (lower.includes(key)) return val;
  }
  return "I'm not sure about that. Try asking about leads, calls, or Zoho integration!";
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hello 👋 How can I help you?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMsg: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      time: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: getBotResponse(input),
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-80 sm:w-96 h-[28rem] bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col mb-3 overflow-hidden">
          <div className="flex items-center justify-between bg-[#0EA5E9] text-white  px-4 py-3 border-b border-gray-200">
            <span className="text-sm font-semibold">AI Assistant</span>
            <button onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-gray-200 text-gray-800 font-medium"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.text}
                  <p
                    className={`text-[10px] ${m.sender === "user" ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              placeholder="Type message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none bg-gray-50 text-gray-800 focus:ring-1 focus:ring-gray-300"
            />
            <button
              onClick={send}
              className="bg-[#0EA5E9] text-white  py-2 px-3 rounded-lg  transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="bg-[#0EA5E9] text-white p-4 rounded-full shadow-lg transition"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
