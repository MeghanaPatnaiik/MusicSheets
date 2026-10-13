import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api-config";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;

    if (token) {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Cookie: `access_token=${token}`,
        },
      }).catch((err) => {
        console.warn("Backend logout notification failed:", err);
      });
    }

    const nextResponse = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear access_token cookie on the frontend domain
    nextResponse.cookies.set({
      name: "access_token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });

    return nextResponse;
  } catch (error) {
    console.error("Logout BFF error:", error);
    const nextResponse = NextResponse.json(
      { success: true, message: "Logged out" },
      { status: 200 }
    );
    nextResponse.cookies.set({
      name: "access_token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
    return nextResponse;
  }
}
