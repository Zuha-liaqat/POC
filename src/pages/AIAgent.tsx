const agents = [
  {
    name: "Real Estate Assistant",
    voice: "Female",
    language: "English",
    status: "Active",
  },
  {
    name: "Lead Qualification Bot",
    voice: "Male",
    language: "English",
    status: "Active",
  },
  {
    name: "Follow-up Agent",
    voice: "Female",
    language: "English",
    status: "Inactive",
  },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Agents</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl shadow p-5 flex flex-col"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {agent.name}
            </h3>

            <p className="text-sm text-gray-600">Voice: {agent.voice}</p>
            <p className="text-sm text-gray-600">Language: {agent.language}</p>

            <div className="mt-3">
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  agent.status === "Active"
                    ? "bg-sky-500 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                {agent.status}
              </span>
            </div>

            <button className="mt-4 w-full bg-gold text-white hover:bg-yellow-300 py-2 rounded-md transition">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
