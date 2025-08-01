import { authClient } from "@/lib/auth-client";

// UI Component
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

// Icons import
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";

// Hooks
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {
  const router = useRouter();
    const { data , isPending } = authClient.useSession();
    const isMobile = useIsMobile();


    // Handle sign out
     const handleSignOut = async () => {
        await authClient.signOut({
          fetchOptions:{
            onSuccess: () => {
              router.push("/sign-in");
            }
          }
        });
    };


    if (isPending || !data) {
        return null
    }

   if( isMobile ) {
    return(
      <Drawer>
        <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
          {
            data.user?.image ? (
              <Avatar>
                <AvatarImage src={data.user.image} alt="User Avatar" />
              </Avatar>
            ) : (
              <GeneratedAvatar seed={data.user?.name} className="rounded-full w-10 h-10" variant="initials" />
            )}
          <div className="flex flex-col ml-2 gap-0.5 text-left overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-primary-foreground">
              {data.user?.name || "User"}
            </p>
            <p className="text-xs text-sidebar-secondary-foreground">
              {data.user?.email || "user@example.com"}
            </p>
          </div>
          <ChevronDownIcon className="size-4 shrink-0" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
             {data.user?.name || "User"}
            </DrawerTitle>
            <DrawerDescription>
              {data.user?.email || "user@example.com"}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/billing")}
            >
              <CreditCardIcon className="size-4" />
              Billing
            </Button>
            <Button
              variant="outline"
              className="w-full  mt-2"
              onClick={handleSignOut}
            >
              <LogOutIcon className="size-4" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
   }



  return (
       <DropdownMenu>
        <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
           {
            data.user?.image ? (
              <Avatar >
                <AvatarImage  src={data.user.image} alt="User Avatar"/>
              </Avatar>
            ) : (
              <GeneratedAvatar seed={data.user?.name}  className="rounded-full w-10 h-10" variant="initials" />
            )}
            <div className="flex flex-col ml-2  gap-0.5 text-left overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-primary-foreground">
                {data.user?.name || "User"}
              </p>
              <p className="text-xs text-sidebar-secondary-foreground">
                {data.user?.email || "user@example.com"}
              </p> 
            </div>
            <ChevronDownIcon  className="size-4  shrink-0" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" side="right" className="w-72">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-2" >
              <span className="font-medium truncate">
                {data.user?.name || "User"}
              </span>
              <span className="text-sm text-muted-foreground truncate">
                {data.user?.email || "user@example.com"}
              </span> 
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            Billing
            <CreditCardIcon className="ml-auto size-4" />
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
            Logout
            <LogOutIcon className="ml-auto size-4" />
            </DropdownMenuItem>
 
        </DropdownMenuContent>
       </DropdownMenu>
  );
};
