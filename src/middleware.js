import { NextResponse } from "next/server";

const protectedRoutes = [
  "/spendings",
  "/dashboard",
  "/about",
  "/faqs",
  "/financialreckon",
];

// check if element is in array
const isProtected = (element) => protectedRoutes.includes(element);

const nextUrl = process.env.NEXT_BASE_PATH;

export function middleware(req, res) {
  const { pathname } = req.nextUrl;

  const verify = req.cookies.get("moneygaze-user");

  if (!verify && isProtected(pathname)) {
    return NextResponse.redirect(`${nextUrl}/login`);
  }

  if (
    verify &&
    (pathname === "/login" || pathname === "/signup" || pathname === "/")
  ) {
    return NextResponse.redirect(`${nextUrl}/dashboard`);
  }

  return NextResponse.next();
}
