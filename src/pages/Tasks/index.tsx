import { Plus } from "lucide-react";
import { useState } from "react";
import Calendar from "./Calendar";
import CreateTaskDialog from "./NewTaskDialog";

export default function Tasks() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tasks = [
    {
      title: "Property Appraisal - Sunset Valley",
      subtitle: "Commercial Real Estate",
      lead: "John Doe",
      initials: "JD",
      priority: "High",
      priorityClass: "bg-red-100 text-red-600",
      date: "Oct 24, 2023",
      status: "In Progress",
      statusClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Follow-up Call: Portfolio Review",
      subtitle: "Asset Management",
      lead: "Jane Smith",
      initials: "JS",
      priority: "Medium",
      priorityClass: "bg-yellow-100 text-yellow-700",
      date: "Oct 25, 2023",
      status: "To Do",
      statusClass: "bg-gray-100 text-gray-600",
    },
    {
      title: "Contract Review - Legacy Corp",
      subtitle: "Legal Compliance",
      lead: "Legacy Corp",
      initials: "LC",
      priority: "Low",
      priorityClass: "bg-gray-200 text-gray-600",
      date: "Oct 26, 2023",
      status: "Completed",
      statusClass: "bg-green-100 text-green-600",
    },
    {
      title: "Investor Onboarding Meeting",
      subtitle: "Client Relations",
      lead: "Michael Page",
      initials: "MP",
      priority: "High",
      priorityClass: "bg-red-100 text-red-600",
      date: "Oct 28, 2023",
      status: "To Do",
      statusClass: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <div className="p-6 min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0E2A47]">
            Task Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage and track your investment workflows efficiently.
          </p>
        </div>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center justify-center gap-2 bg-sky-500 text-white px-4 sm:px-5 py-2 rounded-lg shadow w-full sm:w-auto"
        >
          <Plus size={16} />
          Create New Task
        </button>
      </div>

      <div className="flex gap-6 mt-6 border-b border-gray-200 text-sm">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`pb-2 font-medium ${
            activeTab === "tasks"
              ? "text-sky-600 border-b-2 border-sky-500"
              : "text-gray-500"
          }`}
        >
          Tasks List
        </button>

        <button
          onClick={() => setActiveTab("calendar")}
          className={`pb-2 font-medium ${
            activeTab === "calendar"
              ? "text-sky-600 border-b-2 border-sky-500"
              : "text-gray-500"
          }`}
        >
          Calendar
        </button>
      </div>

      {activeTab === "tasks" && (
        <div className="bg-white mt-6 rounded-xl border border-gray-200 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="text-left p-4">Task Name</th>
                    <th className="text-left p-4">Related Lead</th>
                    <th className="text-left p-4">Priority</th>
                    <th className="text-left p-4">Due Date</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((t, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="p-4">
                        <p className="font-medium text-black">{t.title}</p>
                        <p className="text-xs text-gray-400">{t.subtitle}</p>
                      </td>

                      <td className="p-4 flex items-center gap-2 text-black">
                        <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-xs font-semibold text-sky-600">
                          {t.initials}
                        </div>
                        {t.lead}
                      </td>

                      <td className="p-4">
                        <span
                          className={`${t.priorityClass} px-2 py-1 rounded-full text-xs`}
                        >
                          {t.priority}
                        </span>
                      </td>

                      <td className="p-4 text-gray-600">{t.date}</td>

                      <td className="p-4">
                        <span
                          className={`${t.statusClass} px-3 py-1 rounded-full text-xs`}
                        >
                          {t.status}
                        </span>
                      </td>

                      <td className="p-4 text-sky-500 cursor-pointer">Edit</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center p-4 text-sm text-gray-500">
              <p>Showing 1 to {tasks.length} of 24 tasks</p>

              <div className="flex gap-2">
                <button className="w-8 h-8 rounded bg-sky-500 text-white">
                  1
                </button>
                <button className="w-8 h-8 rounded hover:bg-gray-100">2</button>
                <button className="w-8 h-8 rounded hover:bg-gray-100">3</button>
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="block sm:hidden p-4">
            <div className="flex flex-col gap-3">
              {tasks.map((t, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm text-black">
                        {t.title}
                      </p>
                      <p className="text-xs text-gray-400">{t.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-xs font-semibold text-sky-600">
                        {t.initials}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-600 gap-2">
                    <span
                      className={`${t.priorityClass} px-2 py-1 rounded-full`}
                    >
                      {t.priority}
                    </span>
                    <span>{t.date}</span>
                    <span className={`${t.statusClass} px-2 py-1 rounded-full`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Showing 1 to {tasks.length} of 24 tasks
            </div>
          </div>
        </div>
      )}

      {activeTab === "calendar" && <Calendar />}
      <CreateTaskDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
    </div>
  );
}
