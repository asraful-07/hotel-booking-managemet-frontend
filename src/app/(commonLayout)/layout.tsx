/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { httpClient } from "@/lib/axios/httpClient";
import Footer from "@/components/layout/Footer";
import { WishlistProvider } from "@/context/WishlistContext";
import { FaBed } from "react-icons/fa";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Fetch user info on mount and when path changes
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await httpClient.get("/auth/me");
        if (res?.data) {
          setIsLoggedIn(true);
          setUserInfo(res.data);
        } else {
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setIsLoggedIn(false);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#e8d9cc] border-t-[#caa05c] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FaBed className="w-6 h-6 text-[#caa05c]" />
            </div>
          </div>
          <p className="text-sm text-[#ab8965] font-medium tracking-wide">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <WishlistProvider>
      <Navbar isLoggedIn={isLoggedIn} userInfo={userInfo} />
      <div className="min-h-[calc(100vh-240px)]">{children}</div>
      <Footer />
    </WishlistProvider>
  );
}
