export const ROUTES = {
  home: "/",
  profile: "/profile",
  camera: "/camera",
  quest: "/quest",
  share: "/share",
  search: "/search",
  notifications: "/notifications",
  settings: "/settings",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type AppRoute = (typeof ROUTES)[RouteKey];
