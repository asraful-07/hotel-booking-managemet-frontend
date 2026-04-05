"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaBed,
  FaInfoCircle,
  FaEnvelope,
  FaBlog,
  FaUsers,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { httpClient } from "@/lib/axios/httpClient";
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
import { toast } from "sonner";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";

type NavbarProps = {
  isLoggedIn: boolean;
  userInfo?: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
  };
};

export default function Navbar({ isLoggedIn, userInfo }: NavbarProps) {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { wishlistItems } = useWishlist();

  const roomSubItems = [
    {
      href: "/room",
      label: "All Rooms",
      description: "Browse all our luxurious rooms",
    },
    {
      href: "/rooms/suite",
      label: "Suites",
      description: "Experience ultimate luxury",
    },
    {
      href: "/rooms/deluxe",
      label: "Deluxe Rooms",
      description: "Comfort and elegance",
    },
    {
      href: "/rooms/standard",
      label: "Standard Rooms",
      description: "Affordable comfort",
    },
  ];

  const pagesSubItems = [
    { href: "/about", label: "About Us", description: "Learn about our story" },
    {
      href: "/gallery",
      label: "Gallery",
      description: "View our beautiful property",
    },
    {
      href: "/services",
      label: "Services",
      description: "Explore our services",
    },
    {
      href: "/spa",
      label: "Spa & Wellness",
      description: "Relax and rejuvenate",
    },
    {
      href: "/testimonials",
      label: "Testimonials",
      description: "What guests say",
    },
    { href: "/faq", label: "FAQ", description: "Frequently asked questions" },
    {
      href: "/pricing",
      label: "Pricing Plan",
      description: "Best rates guaranteed",
    },
    {
      href: "/menu",
      label: "Our Menu",
      description: "Delicious dining options",
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await httpClient.post("/auth/logout", {});

      // Clear local storage
      localStorage.removeItem("user");
      sessionStorage.clear();

      // Show success message
      toast.success("Logged out successfully!");

      // Redirect to home page
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
      // Still redirect to home on error
      router.push("/");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-[#e8d9cc] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={120}
                height={120}
                className="object-contain group-hover:scale-105 transition"
              />
            </Link>

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:block">
              <NavigationMenu>
                <NavigationMenuList>
                  {/* Home */}
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/"
                        className="group inline-flex h-10 font-semibold w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      >
                        {/* <FaHome className="mr-2 h-4 w-4 text-[#caa05c]" /> */}
                        Home
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* Rooms Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-semibold">
                      {/* <FaBed className="mr-2 h-4 w-4 text-[#caa05c]" /> */}
                      Rooms
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {roomSubItems.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none text-[#2c1810]">
                                  {item.label}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-[#ab8965]">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Pages Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-semibold">
                      {/* <FaInfoCircle className="mr-2 h-4 w-4 text-[#caa05c]" /> */}
                      Pages
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[700px]">
                        {pagesSubItems.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none text-[#2c1810]">
                                  {item.label}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-[#ab8965]">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Blog */}
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/blog"
                        className="group inline-flex font-semibold h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      >
                        {/* <FaBlog className="mr-2 h-4 w-4 text-[#caa05c]" /> */}
                        Blog
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* Contact */}
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/contact"
                        className="group inline-flex font-semibold h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      >
                        {/* <FaEnvelope className="mr-2 h-4 w-4 text-[#caa05c]" /> */}
                        Contact
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right side - Cart and User */}
            <div className="flex items-center gap-3">
              <Link href="/wishlist" className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-[#f5f0ea]"
                >
                  <Heart className="text-xl text-[#8b6946] hover:text-[#caa05c] transition-colors" />
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-[#caa05c] text-white text-xs">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:bg-[#f5f0ea]"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={
                          userInfo?.image ||
                          "https://i.ibb.co.com/7tHkKsnF/download.png"
                        }
                        alt={userInfo?.name || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white">
                        {userInfo?.name ? getInitials(userInfo.name) : "GU"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {!isLoggedIn ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/login" className="cursor-pointer">
                          <FaSignInAlt className="mr-2 h-4 w-4 text-[#caa05c]" />
                          <span>Login</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/register" className="cursor-pointer">
                          <FaUserPlus className="mr-2 h-4 w-4 text-[#caa05c]" />
                          <span>Register</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-semibold text-[#2c1810]">
                          {userInfo?.name}
                        </p>
                        <p className="text-xs text-[#ab8965]">
                          {userInfo?.email}
                        </p>
                        {userInfo?.role && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {userInfo.role}
                          </Badge>
                        )}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          <FaUser className="mr-2 h-4 w-4 text-[#caa05c]" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/my-bookings"
                          className="cursor-pointer"
                        >
                          <FaBed className="mr-2 h-4 w-4 text-[#caa05c]" />
                          <span>My Bookings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/my-reviews"
                          className="cursor-pointer"
                        >
                          <FaUsers className="mr-2 h-4 w-4 text-[#caa05c]" />
                          <span>My Reviews</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setShowLogoutDialog(true)}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <FaSignOutAlt className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden rounded-full hover:bg-[#f5f0ea]"
              >
                {showMobileMenu ? <FaTimes /> : <FaBars />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-[#e8d9cc] py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="space-y-1">
                {/* Home */}
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#f5f0ea] rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FaHome className="text-[#caa05c]" />
                  <span className="text-[#2c1810]">Home</span>
                </Link>

                {/* Rooms Section */}
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-[#ab8965] uppercase tracking-wider mb-2">
                    Rooms
                  </p>
                  <div className="space-y-1 pl-4">
                    {roomSubItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block py-2 text-sm text-[#8b6946] hover:text-[#caa05c] transition-colors"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Pages Section */}
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-[#ab8965] uppercase tracking-wider mb-2">
                    Pages
                  </p>
                  <div className="grid grid-cols-2 gap-2 pl-4">
                    {pagesSubItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="py-2 text-sm text-[#8b6946] hover:text-[#caa05c] transition-colors"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Blog */}
                <Link
                  href="/blog"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#f5f0ea] rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FaBlog className="text-[#caa05c]" />
                  <span className="text-[#2c1810]">Blog</span>
                </Link>

                {/* Contact */}
                <Link
                  href="/contact"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#f5f0ea] rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FaEnvelope className="text-[#caa05c]" />
                  <span className="text-[#2c1810]">Contact</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

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
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isLoggingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
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
}
