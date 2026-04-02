import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UserCircle } from "lucide-react";

interface CreateLeadFormProps {
  open: boolean;
  onClose: () => void;
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="border-b border-gray-200 pb-1 mb-4 mt-6 first:mt-0">
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
    </div>
  );
}

function FieldRow({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-[160px_1fr] items-center gap-2 mb-2.5 ${className}`}
    >
      <label className="text-xs text-gray-600 text-right pr-2 whitespace-nowrap">
        {label}
      </label>
      <div>{children}</div>
    </div>
  );
}

const inputCls =
  "h-8 text-xs border-gray-300 rounded bg-white focus:border-sky-500 focus:ring-0 text-black";
const selectTriggerCls =
  "h-8 text-xs border-gray-300 rounded bg-white text-black";

export default function CreateLeadForm({ open, onClose }: CreateLeadFormProps) {
  const [form, setForm] = useState<Record<string, string>>({});

  const set = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    console.log("Lead data:", form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 bg-white rounded-2xl">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-gray-900">
              Create Lead
            </DialogTitle>
            {/* <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                Cancel
              </Button>
                <Button
                size="sm"
                onClick={handleSave}
                className="text-xs bg-[#0EA5E9] hover:bg-sky-600 text-white"
              >
                Save Lead
              </Button>
            </div> */}
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Lead Image</p>
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
              <img
                src="/hiren.png"
                className="w-14 h-14 rounded-full object-cover"
              />
            </div>
          </div>

          {/* ========== LEAD INFORMATION ========== */}
          <SectionTitle title="Lead Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {/* Left Column */}
            <div>
              <FieldRow label="Lead Owner">
                <Select onValueChange={(v) => set("leadOwner", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="Hiren Naker" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Monica Racaj">Monica Racaj</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Lead Source">
                <Select onValueChange={(v) => set("leadSource", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {[
                      "None",
                      "Website",
                      "Referral",
                      "LinkedIn",
                      "Cold Call",
                      "Social Media",
                      "Zoho CRM",
                    ].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="BDM">
                <Select onValueChange={(v) => set("bdm", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="-None-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="none">-None-</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Referrer URL">
                <Input
                  className={inputCls}
                  onChange={(e) => set("referrerUrl", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="First Name">
                <div className="flex gap-1">
                  <Select onValueChange={(v) => set("salutation", v)}>
                    <SelectTrigger className={`${selectTriggerCls} w-20`}>
                      <SelectValue placeholder="-None-" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Mrs.">Mrs.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    className={inputCls}
                    onChange={(e) => set("firstName", e.target.value)}
                  />
                </div>
              </FieldRow>
              <FieldRow label="Campaign Type">
                <Select onValueChange={(v) => set("campaignType", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Meeting Type">
                <Select onValueChange={(v) => set("meetingType", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Zoom">Zoom</SelectItem>
                    <SelectItem value="In Person">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Sales/Internal">
                <Input
                  className={inputCls}
                  onChange={(e) => set("salesInternal", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Mobile">
                <Input
                  className={inputCls}
                  type="tel"
                  onChange={(e) => set("mobile", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Phone">
                <Input
                  className={inputCls}
                  type="tel"
                  onChange={(e) => set("phone", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Home Phone">
                <Input
                  className={inputCls}
                  type="tel"
                  onChange={(e) => set("homePhone", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Whatsapp Number">
                <Input
                  className={inputCls}
                  type="tel"
                  onChange={(e) => set("whatsapp", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Nationality">
                <Input
                  className={inputCls}
                  onChange={(e) => set("nationality", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Language">
                <Input
                  className={inputCls}
                  onChange={(e) => set("language", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Invested in Dubai before?">
                <Input
                  className={inputCls}
                  onChange={(e) => set("investedDubai", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Account Owner">
                <Input
                  className={inputCls}
                  onChange={(e) => set("accountOwner", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Company">
                <Input
                  className={inputCls}
                  onChange={(e) => set("company", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Gupshup WhatsApp Opt In">
                <Checkbox
                  onCheckedChange={(v) => set("gupshupOptIn", String(v))}
                />
              </FieldRow>
              <FieldRow label="Exchange Rate">
                <Input
                  className={inputCls}
                  defaultValue="1"
                  onChange={(e) => set("exchangeRate", e.target.value)}
                />
              </FieldRow>
            </div>

            {/* Right Column */}
            <div>
              <FieldRow label="Lead Status">
                <Select onValueChange={(v) => set("leadStatus", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {[
                      "None",
                      "New",
                      "Contacted",
                      "Qualified",
                      "In Negotiation",
                    ].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Call Time Started">
                <Input
                  className={inputCls}
                  onChange={(e) => set("callTimeStarted", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="AI Call Outcome">
                <Input
                  className={inputCls}
                  onChange={(e) => set("aiCallOutcome", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Lead Source 2">
                <Input
                  className={inputCls}
                  onChange={(e) => set("leadSource2", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Meeting Date/Time">
                <div className="flex gap-1">
                  <Input
                    className={inputCls}
                    type="date"
                    onChange={(e) => set("meetingDate", e.target.value)}
                  />
                  <Input
                    className={`${inputCls} w-28`}
                    type="time"
                    onChange={(e) => set("meetingTime", e.target.value)}
                  />
                </div>
              </FieldRow>
              <FieldRow label="Last Name">
                <Input
                  className={inputCls}
                  onChange={(e) => set("lastName", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Referred/Introducer's Name">
                <Input
                  className={inputCls}
                  onChange={(e) => set("referredName", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Email">
                <Input
                  className={inputCls}
                  type="email"
                  onChange={(e) => set("email", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Email Opt Out">
                <Checkbox
                  onCheckedChange={(v) => set("emailOptOut", String(v))}
                />
              </FieldRow>
              <FieldRow label="Email Status">
                <Input
                  className={inputCls}
                  onChange={(e) => set("emailStatus", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Call Outcome">
                <Select onValueChange={(v) => set("callOutcome", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {[
                      "None",
                      "Connected",
                      "Not Answered",
                      "Busy",
                      "Follow-up",
                    ].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="How soon invest?">
                <Textarea
                  className="text-xs bg-white !border-gray-300 min-h-[40px] text-black"
                  onChange={(e) => set("howSoonInvest", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Secondary Lead">
                <Input
                  className={inputCls}
                  onChange={(e) => set("secondaryLead", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Primary/Feed/Cold/Hot">
                <Input
                  className={inputCls}
                  onChange={(e) => set("primaryStatus", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Facebook URL">
                <Input
                  className={inputCls}
                  onChange={(e) => set("facebookUrl", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="LinkedIn URL">
                <Input
                  className={inputCls}
                  onChange={(e) => set("linkedinUrl", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Company LinkedIn URL">
                <Input
                  className={inputCls}
                  onChange={(e) => set("companyLinkedinUrl", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Twitter URL">
                <Input
                  className={inputCls}
                  onChange={(e) => set("twitterUrl", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Closed Deals">
                <Input
                  className={inputCls}
                  onChange={(e) => set("closedDeals", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Website URL">
                <Input
                  className={inputCls}
                  onChange={(e) => set("websiteUrl", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Data Origin">
                <Input
                  className={inputCls}
                  onChange={(e) => set("dataOrigin", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Purpose of Investment">
                <Input
                  className={inputCls}
                  onChange={(e) => set("purposeOfInvestment", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Type of Property">
                <Input
                  className={inputCls}
                  onChange={(e) => set("typeOfProperty", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Estimated Budget">
                <Input
                  className={inputCls}
                  onChange={(e) => set("estimatedBudget", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Currency">
                <Select onValueChange={(v) => set("currency", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="GBP" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {["GBP", "USD", "AED", "EUR", "INR"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>
            </div>
          </div>

          {/* ========== GUPSHUP CAMPAIGN ========== */}
          <SectionTitle title="Gupshup Campaign" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <FieldRow label="Gupshup Published Date">
                <Input
                  className={inputCls}
                  type="date"
                  onChange={(e) => set("gupshupPublishedDate", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Gupshup Campaign">
                <Select onValueChange={(v) => set("gupshupCampaign", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Gupshup Whatsapp Content">
                <Input
                  className={inputCls}
                  onChange={(e) =>
                    set("gupshupWhatsappContent", e.target.value)
                  }
                />
              </FieldRow>
              <FieldRow label="Chat ID">
                <Input
                  className={inputCls}
                  onChange={(e) => set("chatId", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Whatsapp Opt-in Status">
                <Select onValueChange={(v) => set("whatsappOptInStatus", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
            </div>
            <div>
              <FieldRow label="Gupshup Follow up Summary">
                <Input
                  className={inputCls}
                  onChange={(e) =>
                    set("gupshupFollowUpSummary", e.target.value)
                  }
                />
              </FieldRow>
              <FieldRow label="Chat Status">
                <Select onValueChange={(v) => set("chatStatus", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="-None-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="-None-">-None-</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Gupshup Message Status">
                <Select onValueChange={(v) => set("gupshupMessageStatus", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="-None-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="-None-">-None-</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Gupshup Lead Status">
                <Select onValueChange={(v) => set("gupshupLeadStatus", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="-None-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="-None-">-None-</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
            </div>
          </div>

          {/* ========== MAGNATE ========== */}
          <SectionTitle title="Magnate" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <FieldRow label="Create Date">
                <Input
                  className={inputCls}
                  type="date"
                  onChange={(e) => set("createDate", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Last Activity Date">
                <Input
                  className={inputCls}
                  type="date"
                  onChange={(e) => set("lastActivityDate", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Requested Development">
                <Input
                  className={inputCls}
                  onChange={(e) => set("requestedDevelopment", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Purchase time frame (META)">
                <Input
                  className={inputCls}
                  onChange={(e) => set("purchaseTimeFrame", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Looking to buy (Time Frame)">
                <Input
                  className={inputCls}
                  onChange={(e) => set("lookingToBuy", e.target.value)}
                />
              </FieldRow>
            </div>
            <div>
              <FieldRow label="City of Interest">
                <Input
                  className={inputCls}
                  onChange={(e) => set("cityOfInterest", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="(Investment/Home)">
                <Input
                  className={inputCls}
                  onChange={(e) => set("investmentHome", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="I am looking to invest (price)">
                <Input
                  className={inputCls}
                  onChange={(e) => set("lookingToInvestPrice", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Record In Contact">
                <Input
                  className={inputCls}
                  onChange={(e) => set("recordInContact", e.target.value)}
                />
              </FieldRow>
            </div>
          </div>

          {/* ========== WEBINAR DETAILS ========== */}
          <SectionTitle title="Webinar Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <FieldRow label="Registered for webinars">
                <Textarea
                  className="text-xs bg-white text-black border-gray-300 min-h-[40px]"
                  onChange={(e) => set("registeredWebinars", e.target.value)}
                />
              </FieldRow>

              <FieldRow label="Attended">
                <Textarea
                  className="text-xs bg-white text-black border-gray-300 min-h-[40px]"
                  onChange={(e) => set("attended", e.target.value)}
                />
              </FieldRow>
            </div>
          </div>

          {/* ========== QUALIFICATION ========== */}
          <SectionTitle title="Qualification" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <FieldRow label="Location Interest">
                <Select onValueChange={(v) => set("locationInterest", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="-None-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="-None-">-None-</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Message of client">
                <Input
                  className={inputCls}
                  onChange={(e) => set("messageOfClient", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Investment Type">
                <Select onValueChange={(v) => set("investmentType", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="-None-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="-None-">-None-</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Gender">
                <Input
                  className={inputCls}
                  onChange={(e) => set("gender", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Development of Interest">
                <Select onValueChange={(v) => set("developmentOfInterest", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Interested in Dubai Real Estate?">
                <Select onValueChange={(v) => set("interestedDubai", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Happy with other developments?">
                <Select onValueChange={(v) => set("happyOtherDev", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
            </div>
            <div>
              <FieldRow label="Investment Timescale">
                <Select onValueChange={(v) => set("investmentTimescale", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="-None-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="-None-">-None-</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Deposits Available">
                <Input
                  className={inputCls}
                  onChange={(e) => set("depositsAvailable", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Mortgage">
                <Select onValueChange={(v) => set("mortgage", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="-None-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="-None-">-None-</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="First Time Buyer">
                <Select onValueChange={(v) => set("firstTimeBuyer", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="-None-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="-None-">-None-</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Bedroom Type">
                <Input
                  className={inputCls}
                  onChange={(e) => set("bedroomType", e.target.value)}
                />
              </FieldRow>
            </div>
          </div>

          {/* ========== PREVIOUS PROPERTY DETAILS ========== */}
          <SectionTitle title="Previous Property Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <FieldRow label="UK Development Name">
                <Select onValueChange={(v) => set("ukDevName", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Dubai Development Name">
                <Select onValueChange={(v) => set("dubaiDevName", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Unit Details">
                <Input
                  className={inputCls}
                  onChange={(e) => set("unitDetails", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Property Price">
                <Input
                  className={inputCls}
                  onChange={(e) => set("propertyPrice", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Place of Purchase">
                <Select onValueChange={(v) => set("placeOfPurchase", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="-None-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="-None-">-None-</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Citizenship or Residency">
                <Input
                  className={inputCls}
                  onChange={(e) => set("citizenship", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Applicants and Ages">
                <Textarea
                  className="text-xs bg-white text-black border-gray-300 min-h-[40px]"
                  onChange={(e) => set("applicantsAges", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Still working and Position">
                <Input
                  className={inputCls}
                  onChange={(e) => set("stillWorking", e.target.value)}
                />
              </FieldRow>
            </div>
            <div>
              <FieldRow label="Budget Amount">
                <Input
                  className={inputCls}
                  onChange={(e) => set("budgetAmount", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="# family /have many">
                <Input
                  className={inputCls}
                  onChange={(e) => set("familyHaveMany", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Source of Funds">
                <Select onValueChange={(v) => set("sourceOfFunds", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="-None-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="-None-">-None-</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
            </div>
          </div>

          {/* ========== PERSONAL DETAILS ========== */}
          <SectionTitle title="Personal Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <FieldRow label="Date Of Birth">
                <Input
                  className={inputCls}
                  type="date"
                  onChange={(e) => set("dob", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Spouse Name">
                <Input
                  className={inputCls}
                  onChange={(e) => set("spouseName", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Spouse Company/Position">
                <Input
                  className={inputCls}
                  onChange={(e) => set("spouseCompany", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Joint Investment">
                <Select onValueChange={(v) => set("jointInvestment", v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="-None-" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="-None-">-None-</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
            </div>
            <div>
              <FieldRow label="Address">
                <Input
                  className={inputCls}
                  onChange={(e) => set("address", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Spouse Date of Birth">
                <Input
                  className={inputCls}
                  type="date"
                  onChange={(e) => set("spouseDob", e.target.value)}
                />
              </FieldRow>
            </div>
          </div>

          {/* ========== CAMPAIGN INFORMATION ========== */}
          <SectionTitle title="Campaign Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <FieldRow label="Campaign Name">
                <Input
                  className={inputCls}
                  onChange={(e) => set("campaignName", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Campaign Sources">
                <Input
                  className={inputCls}
                  onChange={(e) => set("campaignSources", e.target.value)}
                />
              </FieldRow>
            </div>
            <div>
              <FieldRow label="Campaign Medium">
                <Input
                  className={inputCls}
                  onChange={(e) => set("campaignMedium", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Campaign Content">
                <Input
                  className={inputCls}
                  onChange={(e) => set("campaignContent", e.target.value)}
                />
              </FieldRow>
            </div>
          </div>

          {/* ========== ADDRESS INFORMATION ========== */}
          <SectionTitle title="Address Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <FieldRow label="Street">
                <Input
                  className={inputCls}
                  onChange={(e) => set("street", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="State">
                <Input
                  className={inputCls}
                  onChange={(e) => set("state", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Country">
                <Input
                  className={inputCls}
                  onChange={(e) => set("country", e.target.value)}
                />
              </FieldRow>
            </div>
            <div>
              <FieldRow label="City">
                <Input
                  className={inputCls}
                  onChange={(e) => set("city", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Zip Code">
                <Input
                  className={inputCls}
                  onChange={(e) => set("zipCode", e.target.value)}
                />
              </FieldRow>
            </div>
          </div>

          {/* Bottom Save */}
          <div className="flex justify-end gap-2 mt-8 pb-4 border-t border-gray-200 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs hover:bg-white"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="text-xs bg-[#0EA5E9] hover:bg-sky-600 text-white"
            >
              Save Lead
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
