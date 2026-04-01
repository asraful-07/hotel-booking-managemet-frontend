import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);
  return [
    {
      title: "Dashboard",
      items: [
        {
          title: "Home",
          href: "/",
          icon: "Home",
        },
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
        },
        {
          title: "profile",
          href: "/my-profile",
          icon: "User",
        },
      ],
    },
    {
      title: "Settings",
      // icon: "Settings",
      items: [
        {
          title: "Change Password",
          href: "/change-password",
          icon: "Lock",
        },
      ],
    },
  ];
};

const getAdminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "User Management",
        href: "/admin/dashboard/users-management",
        icon: "Users",
      },
      {
        title: "Create Manager",
        href: "/admin/dashboard/create-manager",
        icon: "UserPlus",
      },
    ],
  },
  {
    title: "Room Type Management",
    items: [
      {
        title: "Room Type Management",
        href: "/admin/dashboard/room-type",
        icon: "Tag",
      },
    ],
  },
  {
    title: "Room Management",
    items: [
      {
        title: "Rooms Management",
        href: "/admin/dashboard/rooms-management",
        icon: "Building",
      },
    ],
  },
  {
    title: "Booking Management",
    items: [
      {
        title: "Booking Management",
        href: "/admin/dashboard/bookings-management",
        icon: "ClipboardList",
      },
      {
        title: "Check-in Management",
        href: "/admin/dashboard/checkin-management",
        icon: "Login",
      },
    ],
  },
  {
    title: "Payment Management",
    items: [
      {
        title: "Payment History",
        href: "/admin/dashboard/payment-history",
        icon: "CreditCard",
      },
    ],
  },
];

const getManagerNavItems: NavSection[] = [
  {
    title: "Room Management",
    items: [
      {
        title: "Add Room",
        href: "/manager/dashboard/add-room",
        icon: "Plus",
      },
      {
        title: "Rooms Management",
        href: "/manager/dashboard/rooms-managements",
        icon: "Building",
      },
    ],
  },
  {
    title: "Booking Management",
    items: [
      {
        title: "Booking Management",
        href: "/manager/dashboard/bookings-management",
        icon: "ClipboardList",
      },
      {
        title: "Check-in Management",
        href: "/manager/dashboard/checkin",
        icon: "Login",
      },
    ],
  },
];

const getCustomerNavItems: NavSection[] = [
  {
    title: "My Bookings",
    items: [
      {
        title: "Manage Booking",
        href: "/dashboard/manage-booking",
        icon: "LayoutDashboard",
      },
      {
        title: "My Bookings",
        href: "/dashboard/my-bookings",
        icon: "ClipboardList",
      },
    ],
  },
  {
    title: "Reviews",
    items: [
      {
        title: "My Reviews",
        href: "/dashboard/my-reviews",
        icon: "Star",
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonItems = getCommonNavItems(role);
  switch (role) {
    case "ADMIN":
      return [...commonItems, ...getAdminNavItems];
    case "MANAGER":
      return [...commonItems, ...getManagerNavItems];
    case "CUSTOMER":
      return [...commonItems, ...getCustomerNavItems];
  }
};
