/**
 * POST /api/auth/logout
 *
 * Clears the gizmo_token JWT cookie.
 * Call this alongside better-auth signOut for full logout.
 */
import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ success: true });
    response.cookies.set("gizmo_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });
    return response;
}
