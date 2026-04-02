import React from "react";
import { LogOut, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { dashboardRoutes } from "@/routes";
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import logo from "/logo98.png";

export function AppSidebar() {
  const { state, openMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const { logout } = useAuth();
  const navigate = useNavigate();

  const sidebarItems = dashboardRoutes.filter((r) => r.showInSidebar !== false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const MenuContent = ({ onNavClick }: { onNavClick?: () => void }) => (
    <>
      <div className="p-3 flex items-center gap-3 pt-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
          <img src={logo} className="w-12 h-12" />
        </div>

        {(!collapsed || onNavClick) && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 leading-tight">
              Legacy Investment
            </h2>
            <p className="text-[10px] text-gray-500">Core Engine</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/dashboard/${item.path}`}
              end
              onClick={onNavClick}
              className={({ isActive }) =>
                `relative flex items-center px-3 py-3 rounded-xl transition-colors mb-1 overflow-hidden
                ${
                  isActive
                    ? "bg-[#0EA5E926] text-[#0EA5E9] font-semibold"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute right-0 top-0 h-full w-[5px] bg-[#0EA5E9] rounded-r-xl" />
                  )}
                  <item.icon className="h-4 w-4 shrink-0" />
                  {(!collapsed || onNavClick) && (
                    <span className="ml-3 text-sm">{item.title}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-2 px-2 py-3 rounded-md text-black hover:bg-[#0EA5E926] hover:text-[#0EA5E9] transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || onNavClick) && (
            <span className="text-sm">Logout</span>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        className="md:hidden fixed top-[11px] left-4 z-50 w-9 h-9 flex items-center justify-center bg-white rounded-lg text-gray-700 hover:bg-gray-50 transition"
        onClick={toggleSidebar}
      >
        <Menu className="w-5 h-5" />
      </button>

      <Sidebar collapsible="icon" className="border-none bg-white">
        <SidebarContent className="bg-white border-r border-gray-200 flex flex-col h-full">
          <MenuContent onNavClick={() => setOpenMobile(false)} />
        </SidebarContent>
      </Sidebar>
    </>
  );
}
