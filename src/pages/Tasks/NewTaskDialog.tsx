"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateTaskDialog({ open, setOpen }) {
  const [taskName, setTaskName] = useState("");
  const [lead, setLead] = useState("");
  const [priority, setPriority] = useState("High");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [toast, setToast] = useState(false);

  const leads = ["John Doe", "Jane Smith", "Michael Lee"];

  const handleSave = () => {
    setOpen(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
    setTaskName("");
    setLead("");
    setPriority("High");
    setDueDate("");
    setStatus("Pending");
    console.log("Task created:", { taskName, lead, priority, dueDate, status });
  };

  const statusColors = {
    Pending: "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]",
    "In Progress": "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]",
    Completed: "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]",
  };

  const isFormValid = taskName && lead && dueDate;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Create New Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Task Name
              </label>
              <Input
                type="text"
                placeholder="e.g. Quarterly Portfolio Audit"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-black"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Related Lead
              </label>
              <Select value={lead} onValueChange={setLead}>
                <SelectTrigger className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-black">
                  <SelectValue placeholder="Select a lead" />
                </SelectTrigger>
                <SelectContent
                  className="bg-white border border-[#E2E8F0] text-black"
                  style={{ width: "var(--radix-select-trigger-width)" }}
                >
                  {leads.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Priority
                </label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="bg-[#F8FAFC] border border-[#E2E8F0] text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white border border-[#E2E8F0] text-black"
                    style={{ width: "var(--radix-select-trigger-width)" }}
                  >
                    {["High", "Medium", "Low"].map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] text-black"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <div className="flex gap-2">
                {["Pending", "In Progress", "Completed"].map((s) => (
                  <Button
                    key={s}
                    className={`flex-1 py-2 ${status === s ? statusColors[s] : "bg-white border border-gray-300 text-black hover:bg-[#22C55E]"}`}
                    onClick={() => setStatus(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 flex gap-4 w-full">
            <Button
              className="flex-1 bg-white hover:bg-white border border-[#E2E8F0] rounded-lg"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid}
              className={`flex-1 rounded-lg text-white ${isFormValid ? "bg-[#0EA5E9] hover:bg-sky-600" : "bg-gray-300 cursor-not-allowed"}`}
            >
              Save Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Task created successfully!
        </div>
      )}
    </>
  );
}
