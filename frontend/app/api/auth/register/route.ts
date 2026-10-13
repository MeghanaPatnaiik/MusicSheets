import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL, extractAccessToken } from "@/lib/api-config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { detail: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    const nextResponse = NextResponse.json(data, { status: backendRes.status });

    // If backend attached a cookie on registration, relay it as well
    const cookieData = extractAccessToken(backendRes.headers);
    if (cookieData) {
      nextResponse.cookies.set({
        name: "access_token",
        value: cookieData.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: cookieData.maxAge ?? 60 * 60,
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Register BFF proxy error:", error);
    return NextResponse.json(
      { detail: "Internal registration error. Please try again." },
      { status: 500 }
    );
  }
}
