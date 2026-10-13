import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api-config";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { detail: "Not authenticated" },
        { status: 401 }
      );
    }

    const backendRes = await fetch(`${BACKEND_URL}/auth/me`, {
      method: "GET",
      headers: {
        Cookie: `access_token=${token}`,
      },
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      // Token expired or invalid on backend; clear the cookie on frontend
      const nextRes = NextResponse.json(data, { status: backendRes.status });
      nextRes.cookies.set({
        name: "access_token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
      });
      return nextRes;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Session check BFF error:", error);
    return NextResponse.json(
      { detail: "Unable to verify session." },
      { status: 500 }
    );
  }
}
