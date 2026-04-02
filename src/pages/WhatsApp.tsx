import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

const WhatsApp = () => {
  const [timer, setTimer] = useState(45);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-1">Link WhatsApp</h1>
      <p className="text-muted-foreground text-sm mb-10 ">
        Scan the QR code below with your WhatsApp mobile app to link your
        account.
      </p>

      <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
        <div className="w-[340px] h-64 rounded-lg bg-white shadow-lg flex items-center justify-center overflow-hidden">
          <img src="/QR code.jpg" className="w-[340px] h-64  text-black " />
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-black">
            Scan with your device
          </p>
        </div>

        <Button
          variant="outline"
          className="gap-2 bg-sky-600 text-white border-none hover:bg-sky-700 hover:text-white"
          onClick={() => setTimer(45)}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Code
        </Button>
      </div>
    </div>
  );
};

export default WhatsApp;
