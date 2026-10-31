"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, HeartPulse, Home, SearchX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/shared/logo";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="relative z-10 mx-auto w-full max-w-lg">
        {/* Brand */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-3"
          aria-label="Doctor Tracker home"
        >
          <Logo />
        </Link>

        {/* Error Card */}
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-black/5">
          <CardHeader className="items-center pb-2 pt-9 text-center">
            <CardTitle className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Page not found
            </CardTitle>

            <CardDescription className="mt-3 text-sm leading-7 text-center w-full">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It
              may have been moved, deleted, or the URL might be incorrect.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-7 pt-5 sm:px-8">
            {/* Error code */}
            <div className=" border bg-muted/40 px-4 py-3 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Error code
              </p>

              <p className="mt-1 text-4xl font-black tracking-tighter text-primary">
                404
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1 gap-2 ">
                <Link className="flex items-center gap-2" href="/">
                  <Home className="size-4" />
                  Back to Home
                  <ArrowRight className="ml-auto size-4" />
                </Link>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="size-4" />
                Go Back
              </Button>
            </div>
          </CardContent>

          <Separator />

          <CardFooter className="justify-center px-6 py-5">
            <p className="text-center text-xs leading-6 text-muted-foreground">
              Need help? Return to Doctor Tracker and continue managing your
              care network.
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
