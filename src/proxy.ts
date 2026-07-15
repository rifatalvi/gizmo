/**
 * Next.js Proxy (previously called middleware) — runs on the Edge before every request.
 *
 * Protects /items/* routes:
 *  1. Reads the `gizmo_token` HttpOnly cookie.
 *  2. Verifies it with jose (JWT).
 *  3. If valid → allow the request.
 *  4. If missing or invalid → redirect to /api/auth/token?callbackUrl=<current>
 *     which will either mint a fresh token (if better-auth session exists)
 *     or send the user to /login.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

function getSecretKey() {
    return new TextEncoder().encode(JWT_SECRET);
}

// Next.js 16+ requires the exported function to be named "proxy"
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /items/* paths
    if (!pathname.startsWith("/items")) {
        return NextResponse.next();
    }

    const token = request.cookies.get("gizmo_token")?.value;

    if (token) {
        try {
            await jwtVerify(token, getSecretKey());
            return NextResponse.next(); // ✅ Valid token
        } catch {
            // Token expired or tampered — fall through to re-mint
        }
    }

    // Redirect to the token-minting endpoint with the current path as callback
    const tokenUrl = new URL("/api/auth/token", request.url);
    tokenUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(tokenUrl);
}

export const config = {
    // Match /items and all sub-paths
    matcher: ["/items/:path*"],
};
