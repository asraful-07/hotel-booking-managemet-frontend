export type UserRole = "ADMIN" | "MANAGER" | "CUSTOMER";

export const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export const isAuthRoute = (pathname: string) => {
  return authRoutes.includes(pathname);
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile", "/change-password"],
  pattern: [],
};

export const adminProtectedRoutes: RouteConfig = {
  exact: [],
  pattern: [/^\/admin/],
};

export const managerProtectedRoutes: RouteConfig = {
  exact: [],
  pattern: [/^\/manager/],
};

export const customerProtectedRoutes: RouteConfig = {
  exact: ["/payment/success"],
  pattern: [/^\/dashboard/],
};

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
  if (routes.exact.includes(pathname)) {
    return true;
  }

  return routes.pattern.some((pattern) => pattern.test(pathname));
};

export const getRouteOwner = (pathname: string): UserRole | "COMMON" | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }

  if (isRouteMatches(pathname, managerProtectedRoutes)) {
    return "MANAGER";
  }

  if (isRouteMatches(pathname, customerProtectedRoutes)) {
    return "CUSTOMER";
  }

  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }

  return null;
};

export const getDefaultDashboardRoute = (role: UserRole) => {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";

    case "MANAGER":
      return "/manager/dashboard";

    case "CUSTOMER":
      return "/dashboard";

    default:
      return "/";
  }
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
) => {
  const routeOwner = getRouteOwner(redirectPath);

  if (routeOwner === null) return true;

  if (routeOwner === "COMMON") return true;

  if (routeOwner === role) return true;

  return false;
};
