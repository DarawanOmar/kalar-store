"use server";

import { SignJWT, jwtVerify } from "jose";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.NEXT_PUBLIC_SECRET || "secret";
const key = new TextEncoder().encode(secretKey);
const expiteTime = 1 * 24 * 60 * 60 * 1000; // 1 days
// const expiteTime = 5 * 60 * 1000; // 5 minutes

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Date.now() + expiteTime)
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(token: string, redirectValues?: string) {
  const expires = new Date(Date.now() + expiteTime);
  const session = await encrypt({ token, expires });

  // Save the session in a cookie
  (await cookies()).set("session", session, { expires, httpOnly: true });
  redirect(`/${redirectValues}`);
}

export async function logout() {
  // Destroy the session
  (await cookies()).set("session", "", { expires: new Date(-1) });
  redirect("/sign-in");
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);

  parsed.expires = new Date(Date.now() + expiteTime);

  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });

  return res;
}

export async function getCookieData(key: string) {
  const value = (await cookies()).get(key)?.value;
  return value;
}

export async function setCookieData(
  key: string,
  value: string,
  expireTime: number
) {
  (await cookies()).set(key, value, {
    expires: new Date(Date.now() + expireTime),
    httpOnly: true,
    path: "/",
  });
}
