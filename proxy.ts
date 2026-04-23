import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

const USER_PREFIX = "/dashboard";
const ADMIN_PREFIX = "/admin";
const AUTH_PAGES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  const hasAuthCookies = request.cookies.getAll().some((cookie) => cookie.name.startsWith("sb-"));

  if ((pathname.startsWith(USER_PREFIX) || pathname.startsWith(ADMIN_PREFIX)) && !hasAuthCookies) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasAuthCookies && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
