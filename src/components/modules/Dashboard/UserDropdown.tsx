/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/types/user.types";
import { Key, LogOut, User, Shield, Loader2 } from "lucide-react";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { httpClient } from "@/lib/axios/httpClient";

interface UserDropdownProps {
  userInfo: UserInfo;
  onLogout?: () => void;
}

const ROLE_CONFIG: Record<
  string,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  ADMIN: {
    color: "text-purple-700",
    bg: "bg-purple-50",
    icon: <Shield className="h-3 w-3" />,
  },
  MANAGER: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    icon: <Shield className="h-3 w-3" />,
  },
  CUSTOMER: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    icon: <User className="h-3 w-3" />,
  },
  default: {
    color: "text-primary",
    bg: "bg-primary/10",
    icon: <Shield className="h-3 w-3" />,
  },
};

const getRoleStyle = (role: string) => {
  return ROLE_CONFIG[role.toUpperCase()] || ROLE_CONFIG.default;
};

const UserDropdown = ({ userInfo, onLogout }: UserDropdownProps) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Handle null userInfo gracefully
  if (!userInfo) {
    return null;
  }

  const initials = userInfo.name
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const roleStyle = getRoleStyle(userInfo.role);
  const roleLabel = userInfo.role.toLowerCase().replace("_", " ");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await httpClient.post("/auth/logout", {});

      // Clear any local storage or session storage if needed
      localStorage.removeItem("user");
      sessionStorage.clear();

      // Call onLogout callback if provided
      if (onLogout) {
        onLogout();
      }

      // Redirect to login page
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, try to redirect to login
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative h-9 w-9 rounded-xl border-border/60 bg-background hover:bg-accent transition-all duration-200 font-semibold text-sm p-0 overflow-hidden"
          >
            {userInfo.image ? (
              <img
                src={userInfo.image}
                alt={userInfo.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-semibold text-sm">{initials}</span>
            )}
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-64 p-0 rounded-2xl border border-border/60 shadow-xl shadow-black/10 overflow-hidden"
        >
          {/* User Info Header */}
          <div className="px-4 py-4 bg-muted/30 border-b border-border/60">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="h-10 w-10 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                {userInfo.image ? (
                  <img
                    src={userInfo.image}
                    alt={userInfo.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-primary">
                    {initials}
                  </span>
                )}
              </div>

              {/* Name + Email */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {userInfo.name}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {userInfo.email}
                </p>
              </div>
            </div>

            {/* Role Badge */}
            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg capitalize ${roleStyle.bg} ${roleStyle.color}`}
              >
                {roleStyle.icon}
                {roleLabel}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-0.5">
            <Link
              href="/my-profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/70 transition-all duration-150 group"
            >
              <div className="h-7 w-7 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 transition-colors">
                <User className="h-3.5 w-3.5 text-sky-500" />
              </div>
              My Profile
            </Link>

            <Link
              href="/change-password"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/70 transition-all duration-150 group"
            >
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <Key className="h-3.5 w-3.5 text-amber-500" />
              </div>
              Change Password
            </Link>
          </div>

          <DropdownMenuSeparator className="mx-2" />

          {/* Logout */}
          <div className="p-2">
            <button
              onClick={() => setShowLogoutDialog(true)}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-500/8 transition-all duration-150 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="h-7 w-7 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0 group-hover:bg-rose-500/20 transition-colors">
                {isLoggingOut ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
              </div>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout from your account? You will need
              to login again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Yes, Logout"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserDropdown;
