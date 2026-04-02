import { Suspense } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "./Chatbot";
import { dashboardRoutes } from "@/routes";

const Dashboard = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const isProposalPreview = pathname.startsWith("/dashboard/upload/preview/");
  const activeRoute = dashboardRoutes.find((route) =>
    matchPath({ path: `/dashboard/${route.path}`, end: true }, pathname),
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col bg-gray-50">
          <DashboardHeader />
          <main className="min-w-0 flex-1">
            {activeRoute && (
              <Suspense fallback={<div className="text-foreground">Loading...</div>}>
                <activeRoute.component />
              </Suspense>
            )}
          </main>
        </div>
        {!isProposalPreview && <ChatBot />}
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
