import LeadStatusChip from "@/components/leads/LeadStatus";

export default function LeadRow({ lead }: any) {
  return (
    <tr className="border-t border-gray-200">

      <td className="py-6 text-black">{lead.name}</td>

      <td className="py-3 text-black">{lead.property}</td>

      <td>
        <LeadStatusChip status={lead.status} />
      </td>

      <td>
        <button className="bg-[#0E2A47] text-white px-3 py-1 rounded">
          Call
        </button>
      </td>

    </tr>
  );
}