import Sidebar from "./Sidebar";
import { RequireRole } from "@/lib/cors/session";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await RequireRole(["admin", "user", "trainer"]); // Assuming the dashboard might have multiple roles later

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#0a0a0f] overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0a0a0f]">
                {children}
            </main>
        </div>
    );
}
