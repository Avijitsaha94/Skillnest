import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/", "/explore(.*)", "/courses/(.*)", "/about",
  "/blog(.*)", "/contact", "/faq",
  "/sign-in(.*)", "/sign-up(.*)", "/sso-callback(.*)",
  "/api/webhook(.*)", "/api/courses(.*)", "/api/blogs(.*)",
  "/api/reviews/course(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname === "/home") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};