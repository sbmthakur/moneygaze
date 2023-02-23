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

export function middleware(req, res) {
  const { pathname } = req.nextUrl;

  const verify = req.cookies.get("moneygaze-user");

  if (!verify && isProtected(pathname)) {
    return NextResponse.redirect("http://localhost:3000/login");
  }

  if (
    verify &&
    (pathname === "/login" || pathname === "/signup" || pathname === "/")
  ) {
    return NextResponse.redirect("http://localhost:3000/dashboard");
  }

  return NextResponse.next();
}
