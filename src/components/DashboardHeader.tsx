import { useState, useRef, useEffect } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Share2,
  Globe,
} from "lucide-react";

export default function DashboardHeader() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const socials = [
    {
      icon: Facebook,
      label: "Facebook",
      href: "https://www.facebook.com/legacyinvestmentconsultancy/",
      color: "hover:text-blue-600",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://www.instagram.com/legacy.investmentconsultancy/",
      color: "hover:text-pink-500",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/90843249/",
      color: "hover:text-blue-700",
    },
    {
      icon: Youtube,
      label: "YouTube",
      href: "https://www.youtube.com/@legacyinvestmentconsultancy",
      color: "hover:text-red-500",
    },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 md:pl-0 pl-10">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 gap-3">
    
        <nav className="flex items-center gap-3 md:gap-10 text-sm font-semibold text-gray-700 whitespace-nowrap">
          <a
            href="https://ae.insightss.co/dubais-booming-luxury-real-estate-market/?gad_source=1"
            target="_blank"
            className="border-b-2 border-transparent hover:border-sky-600 hover:text-sky-600 transition"
          >
            News Feeds
          </a>
          <a
            href="https://gulfbusiness.com/difc-launches-proptech-2033-roadmap/"
            target="_blank"
            className="border-b-2 border-transparent hover:border-sky-600 hover:text-sky-600 transition"
          >
            Blogs
          </a>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Website */}
          <a
            href="https://www.legacyinvestmentconsultancy.com/"
            target="_blank"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500"
          >
            <Globe className="w-4 h-4" />
          </a>

          {/* Desktop: always visible icons */}
          <div className="hidden md:flex items-center gap-2">
            {socials.map(({ icon: Icon, label, href, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                className={`w-8 h-8 flex items-center justify-center rounded-full text-gray-500 ${color} hover:bg-gray-100 transition`}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Mobile: dropdown */}
          <div className="flex md:hidden relative" ref={popoverRef}>
            <button
              onClick={() => setPopoverOpen((prev) => !prev)}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition ${popoverOpen ? "bg-sky-50 text-sky-600" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <Share2 className="w-4 h-4" />
            </button>

            {popoverOpen && (
              <div className="absolute right-0 top-11 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-52 z-50">
                <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45" />
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Follow us
                </p>
                <div className="flex flex-col gap-1">
                  {socials.map(({ icon: Icon, label, href, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      onClick={() => setPopoverOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 ${color} hover:bg-gray-50 transition group`}
                    >
                      <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 group-hover:scale-110 transition">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-gray-200" />

          {/* Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-gray-800 leading-tight">
                Hiren Naker
              </p>
              <p className="text-xs text-gray-400">Senior Investor</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 overflow-hidden border-2 border-sky-300 shrink-0">
             
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
