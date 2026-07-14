import { RequireRole } from '@/lib/cors/session';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    await RequireRole("admin");
    return <>{children}</>;
};

export default AdminLayout;