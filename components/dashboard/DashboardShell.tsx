"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);

    const [mobileSidebarOpen, setMobileSidebarOpen] =
        useState(false);

    return (
        <div className="h-screen overflow-hidden bg-background">
            <Topbar
                sidebarCollapsed={sidebarCollapsed}
                onToggleSidebar={() =>
                    setSidebarCollapsed((value) => !value)
                }
                onOpenMobileSidebar={() =>
                    setMobileSidebarOpen(true)
                }
            />

            <Sidebar
                collapsed={sidebarCollapsed}
                mobileOpen={mobileSidebarOpen}
                onCloseMobile={() =>
                    setMobileSidebarOpen(false)
                }
            />

            <main
                className={`mt-16 h-[calc(100vh-4rem)] overflow-y-auto transition-[margin] duration-200 ${sidebarCollapsed
                        ? "ml-16"
                        : "ml-64"
                    } max-md:ml-0`}
            >
                <div className="min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}