import React, { useState } from "react";
import { Container } from "./Container";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { buttonVariants } from "@/components/ui/button";
import { ThemeChanger } from "./ThemeChanger";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

export function Navbar() {
  const { data: session, status } = useSession({ required: false });
  const router = useRouter();
  const showNav = !router.pathname.startsWith("/auth");

  return (
    <div
      className={cn(
        showNav ? "block" : "hidden",
        `bg-white dark:bg-slate-900 border-b sticky top-0 left-0 w-full z-[100]`
      )}
    >
      <Container>
        <div className="h-16 flex items-center justify-between">
          <Link
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-2xl -ml-2"
            )}
            href="/"
          >
            Quote-Forge
          </Link>

          <div className="flex items-center gap-2">
            <ThemeChanger />

            {!session && (
              <>
                <Button onClick={() => signIn()}>Sign in</Button>
              </>
            )}

            {session && (
              <>
                <Link
                  className={buttonVariants({ variant: "link" })}
                  href="/profile"
                >
                  Profile
                </Link>

                <Button onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign out
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
