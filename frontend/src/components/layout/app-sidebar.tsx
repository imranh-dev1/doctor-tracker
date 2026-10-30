"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Users,
  UserRound,
  Loader2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "../shared/logo";
import { useGetMe, useLogout } from "@/hooks";
import AuthLoading from "../auth/auth-loading";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Doctors", href: "/doctors", icon: Stethoscope },
  { title: "Patients", href: "/patients", icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: logout, isPending } = useLogout();
  const { data, isLoading } = useGetMe();

  const user = data?.data;

  if (isLoading) {
    <AuthLoading />;
  }

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.clear();

        toast.success("Logged out successfully", {
          description: "You have been logged out of your account.",
        });

        router.replace("/login");
      },
      onError: () => {
        toast.error("Logout failed", {
          description: "Please try again.",
        });
      },
    });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Link href="/">
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem className="flex" key={item.href}>
                    <SidebarMenuButton isActive={active} tooltip={item.title}>
                      <Link
                        className="flex items-center gap-3 w-full h-full"
                        href={item.href}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-lg p-2 group-data-[collapsible=icon]:hidden">
          <Avatar className="size-8">
            <AvatarFallback>
              <UserRound className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user?.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            size="icon"
            aria-label="Log out"
            disabled={isPending}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
