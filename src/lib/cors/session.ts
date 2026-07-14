import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session?.user || null;
};

export const RequireRole = async (role: string | string[]) => {
    const user = await getUserSession();
    
    if (!user) {
        redirect("/login"); // User project uses /login not /auth/signin based on my previous knowledge
    }
    
    // Accept a single role string or an array of roles
    const allowedRoles = Array.isArray(role) ? role : [role];
    
    if (!allowedRoles.includes(user?.role as string)) {
        redirect("/"); // Unauthorized page if it exists, otherwise home
    }
};
