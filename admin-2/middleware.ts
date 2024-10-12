import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/"],
  async afterAuth(auth, req) {
    if (auth.userId && auth.isPublicRoute) {
      let path = "/dashboard";

      const user = await clerkClient.users.getUser(auth.userId);
      const role = user.publicMetadata.role as string;

      if (role === "CONTABLE") {
        path = "/movimientos";
      }

      const orgSelection = new URL(path, req.url);
      return NextResponse.redirect(orgSelection);
    }

    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    if (auth.userId) {
      const user = await clerkClient.users.getUser(auth.userId);
      const role = user.publicMetadata.role as string;

      if (role === "CONTABLE" && !req.nextUrl.pathname.startsWith("/movimientos")) {
        return NextResponse.redirect(new URL("/movimientos", req.url));
      }
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};