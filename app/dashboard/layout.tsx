import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <Sidebar />

      <Topbar />

      <main className="ml-64 h-screen overflow-y-auto pt-16">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}