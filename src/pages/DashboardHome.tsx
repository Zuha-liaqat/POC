import { useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Phone,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckSquare,
  MoreVertical,
} from "lucide-react";

const portfolioData = [
  { month: "JAN", value: 15, prev: 5 },
  { month: "FEB", value: 40, prev: 15 },
  { month: "MAR", value: 30, prev: 5 },
  { month: "APR", value: 120, prev: 50 },
  { month: "MAY", value: 60, prev: 2 },
  { month: "JUN", value: 85, prev: 30 },
];

const leadSourceData = [
  { name: "Social Media", value: 45, color: "#0EA5E9" },
  { name: "Referral", value: 28, color: "#0EA5E9" },
  { name: "Organic Search", value: 18, color: "#14B8A6" },
  { name: "Email Marketing", value: 9, color: "#94A3B8" },
];

const recentActivity = [
  {
    icon: "lead",
    title: "New lead from Zoho CRM",
    desc: "Sarah Jenkins - Wealth Planning Inquiry",
    time: "3 min ago",
  },
  {
    icon: "call",
    title: "Call completed",
    desc: "Michael Ross - Portfolio Review · 15:20 min",
    time: "1 hour ago",
  },
  {
    icon: "task",
    title: "Task marked as completed",
    desc: "Submit compliance report for Q2",
    time: "3 hours ago",
  },
];

const stats = [
  {
    label: "Calls Today",
    value: "42",
    change: "+15%",
    positive: true,
    icon: <Phone className="w-4 h-4 text-[#0EA5E9]" />,
    iconBg: "bg-sky-100",
    changeColor: "text-sky-500",
  },
  {
    label: "Lead Conversion",
    value: "12.5%",
    change: "+2.4%",
    positive: true,
    icon: <TrendingUp className="w-4 h-4 text-[#0EA5E9]" />,
    iconBg: "bg-blue-100",
    changeColor: "text-sky-500",
  },
  {
    label: "Total Revenue",
    value: "$128,450",
    change: "+8%",
    positive: true,
    icon: <DollarSign className="w-4 h-4 text-[#14B8A6]" />,
    iconBg: "bg-teal-100",
    changeColor: "text-sky-500",
  },
  {
    label: "Active Tasks",
    value: "15",
    change: "-3%",
    positive: false,
    icon: <CheckSquare className="w-4 h-4 text-[#D97706]" />,
    iconBg: "bg-amber-100",
    changeColor: "text-[#EF4444]",
  },
];

function ActivityIcon({ type }: { type: string }) {
  if (type === "lead")
    return (
      <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
        <TrendingUp className="w-4 h-4 text-sky-600" />
      </div>
    );
  if (type === "call")
    return (
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <Phone className="w-4 h-4 text-blue-600" />
      </div>
    );
  return (
    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
      <CheckSquare className="w-4 h-4 text-orange-600" />
    </div>
  );
}

export default function DashboardHome() {
  const [activeRange, setActiveRange] = useState<"1W" | "1M" | "ALL">("1M");
  return (
    <div className="p-4 sm:p-6 bg-[#F5F5F5] min-h-screen flex flex-col gap-4 sm:gap-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col justify-between w-full"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.iconBg}`}
              >
                {s.icon}
              </div>

              <span
                className={`text-[10px] sm:text-xs font-semibold flex items-center gap-0.5 ${s.changeColor}`}
              >
                {s.positive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {s.change}
              </span>
            </div>

            <p className="text-[10px] sm:text-[11px] text-[#94A3B8] uppercase tracking-wide mt-2">
              {s.label}
            </p>

            <p className="text-lg sm:text-xl font-bold text-[#0F172A]">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Portfolio Growth */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 lg:col-span-3">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-sm font-bold text-[#0F172A]">
                Portfolio Growth
              </p>
              <p className="text-[10px] text-[#94A3B8]">
                Total assets value fluctuation (Last 6 Months)
              </p>
            </div>
            <div className="flex gap-1">
              {(["1W", "1M", "ALL"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  className={`text-[10px] px-2 py-1 rounded-md border transition-colors ${
                    activeRange === r
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-gray-50 text-[#94A3B8] border-gray-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={portfolioData}
              margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="month"
                interval={0}
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                padding={{ left: 18, right: 18 }}
              />

              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E2E8F0",
                  borderRadius: "6px",
                  fontSize: "11px",
                  color: "#0F172A",
                  padding: "6px 8px",
                }}
                labelStyle={{
                  color: "#64748B",
                  fontSize: "10px",
                }}
                itemStyle={{
                  color: "#0F172A",
                  fontWeight: 600,
                }}
                formatter={(value, name) => {
                  if (name === "prev") return [null, null];
                  return [value, name];
                }}
              />
              <Area
                type="natural"
                dataKey="value"
                stroke="#0EA5E9"
                strokeWidth={4}
                fill="url(#gradGreen)"
                dot={false}
              />
              <Area
                type="natural"
                dataKey="prev"
                stroke="#60A5FA"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#gradBlue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Source */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-[#0F172A]">Lead Source</p>
              <p className="text-xs text-[#94A3B8]">Distribution by channel</p>
            </div>

            <MoreVertical className="w-4 h-4 text-[#94A3B8]" />
          </div>

          <div className="space-y-3">
            {leadSourceData.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#0F172A]  font-semibold ">
                    {item.name}
                  </span>
                  <span className="text-[#0F172A]  font-semibold">
                    {item.value}%
                  </span>
                </div>

                {/* Bar */}
                <div className="w-full h-[8px] bg-gray-100 rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div>
              <p className="text-xs text-[#94A3B8]">Total</p>
              <p className="text-sm font-bold text-[#0F172A]">1,240</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-[#94A3B8]">Growth</p>
              <p className="text-sm font-bold text-[#0EA5E9]">+12.4%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-[#0F172A]">
            Recent Activity
          </p>
          <button className="text-xs text-[#0EA5E9] hover:underline">
            View All
          </button>
        </div>

        <div className="flex flex-col divide-y divide-gray-100">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <ActivityIcon type={a.icon} />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F172A] truncate">
                  {a.title}
                </p>
                <p className="text-xs text-[#64748B] truncate">{a.desc}</p>
              </div>

              {/* Time Right Side */}
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8] ml-auto whitespace-nowrap">
                {a.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
