"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

/**
 * Renders the home page for authenticated users, displaying a welcome message and a sign-out button.
 *
 * Shows the current user's name if available. Upon clicking "Sign Out," the user is signed out and redirected to the sign-in page.
 */
export default function HomeView() {
  // Handle session
  const { data: session } = authClient.useSession();

  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page {session?.user?.name}</h1>
      <Button
        onClick={async () => {
          await authClient.signOut();
          router.push("/sign-in");
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}