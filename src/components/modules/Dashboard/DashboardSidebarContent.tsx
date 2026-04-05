"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

interface DashboardSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardSidebarContent = ({
  dashboardHome,
  navItems,
  userInfo,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "hidden md:flex h-screen flex-col border-r bg-card transition-all duration-300 shrink-0",
        collapsed ? "w-[60px]" : "w-[240px]",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-3 shrink-0">
        {!collapsed && (
          <Link href={dashboardHome}>
            {/* Logo */}
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="object-contain group-hover:scale-105 transition"
            />
          </Link>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((prev) => !prev)}
          className={cn(
            "h-8 w-8 rounded-full border shrink-0 transition-all hover:bg-accent",
            collapsed && "mx-auto",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Scrollable Navigation */}
      <ScrollArea className="flex-1 min-h-0 px-2 py-4">
        <nav className="space-y-6 pr-2">
          {navItems?.map((section, sectionId) => (
            <div key={sectionId}>
              {!collapsed && section.title && (
                <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      key={id}
                      href={item.href}
                      title={collapsed ? item.title : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        collapsed && "justify-center px-2",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  );
                })}
              </div>

              {sectionId < navItems.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info */}
      <div className="border-t px-3 py-4 shrink-0">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center",
          )}
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary">
              {userInfo?.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{userInfo?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {userInfo?.role.toLowerCase().replace("_", " ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebarContent;
