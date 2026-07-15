/**
 * GET /api/auth/token?callbackUrl=/items/add
 *
 * Reads the current better-auth session.
 * If valid → mints a JWT, sets it in an HttpOnly cookie, redirects to callbackUrl.
 * If no session → redirects to /login.
 */
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { mintToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    // Read the better-auth session (it reads its own cookies from the request headers)
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        // No better-auth session → send to login
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", callbackUrl);
        return NextResponse.redirect(loginUrl);
    }

    // Mint a JWT from the session data
    const user = session.user as { id: string; email: string; role?: string };
    const token = await mintToken(user.id, user.email, user.role || "user");

    const isProd = process.env.NODE_ENV === "production";
    const response = NextResponse.redirect(new URL(callbackUrl, request.url));
    response.cookies.set("gizmo_token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });

    return response;
}
