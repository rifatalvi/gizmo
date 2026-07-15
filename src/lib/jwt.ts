/**
 * Server-side JWT utilities using jose.
 * Only import from Server Components, Server Actions, or Route Handlers.
 */
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export function getSecretKey() {
    return new TextEncoder().encode(JWT_SECRET);
}

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

/** Sign a new JWT valid for 7 days */
export async function mintToken(userId: string, email: string, role = "user"): Promise<string> {
    return new SignJWT({ userId, email, role })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(getSecretKey());
}

/** Verify and decode a JWT. Throws if invalid or expired. */
export async function verifyToken(token: string): Promise<JwtPayload> {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as JwtPayload;
}
