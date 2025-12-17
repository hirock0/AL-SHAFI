import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_super_secret_key"
);
export async function proxy(req) {
  const { pathname } = req.nextUrl;
  // block direct access start
  const protectedPrefixes = ["/pages/api"];
  const isProtectedApi = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (isProtectedApi) {
    const accept = req.headers.get("accept") || "";
    const secFetchMode = req.headers.get("sec-fetch-mode") || "";
    const secFetchDest = req.headers.get("sec-fetch-dest") || "";
    const looksLikeNavigation =
      secFetchMode === "navigate" ||
      secFetchDest === "document" ||
      accept.includes("text/html");
    if (looksLikeNavigation) {
      return NextResponse.json({ message: "Direct access not allowed" });
    }
  }
  // block direct access end

  // -----------------------------------------------------------------------------------

  const publicPages = ["/login", "/register"];
  const adminpath = pathname.startsWith("/admin-dashboard");
  const token = req.cookies.get("auth_token")?.value || null;
  if (token) {
    const {payload} = await jwtVerify(token, JWT_SECRET);
    if (payload?.role === "admin" && adminpath) {
      return NextResponse.next();
    }
    if (payload?.role !== "admin" && adminpath) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (publicPages.includes(pathname)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (!token && adminpath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token && publicPages.includes(pathname)) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/about/:path*",
    "/pages/api/:path*",
    "/login",
    "/register",
    "/admin-dashboard/:path*",
  ],
};
