export default function LeadStatusChip({ status }: any) {
  const colors: any = {
    "New Lead": "bg-sky-100 text-sky-700",
    Negotiation: "bg-yellow-100 text-yellow-700",
    Contacted: "bg-blue-100 text-blue-700",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
}
