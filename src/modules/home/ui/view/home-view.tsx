"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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