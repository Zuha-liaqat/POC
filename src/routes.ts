import { Upload, Phone, LayoutDashboard, CircleCheckBig, Users, FileText, MessageCircle } from "lucide-react";

import DashboardHome from "@/pages/DashboardHome";
import LeadTable from "@/pages/LeadTable";
import Callcenter from "@/pages/Callcenter";
import Tasks from "@/pages/Tasks";
import FileUploader from "@/pages/FileUploader";
import ProposalPreview from "@/pages/ProposalPreview";
import WhatsApp from "@/pages/WhatsApp";

export interface RouteConfig {
  path: string;
  title: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType;
  showInSidebar?: boolean;
}

export const dashboardRoutes: RouteConfig[] = [
  {
    path: "home",
    title: "Dashboard",
    icon: LayoutDashboard,
    component: DashboardHome,
    showInSidebar: true,
  },
  {
    path: "leads",
    title: "Zoho Integration",
    icon: Users,
    component: LeadTable,
    showInSidebar: true,
  },
  {
    path: "calls",
    title: "Calls",
    icon: Phone,
    component: Callcenter,
    showInSidebar: true,
  },
  {
    path: "tasks",
    title: "Tasks",
    icon: CircleCheckBig,
    component: Tasks,
    showInSidebar: true,
  },
  {
    path: "upload",
    title: "Proposal",
    icon: FileText,
    component: FileUploader,
    showInSidebar: true,
  },
  {
    path: "whatsapp",
    title: "WhatsApp Integration",
    icon: MessageCircle,
    component: WhatsApp,
    showInSidebar: true,
  },
  {
    path: "upload/preview/:brochureId",
    title: "Proposal Preview",
    icon: Upload,
    component: ProposalPreview,
    showInSidebar: false,
  },
];
