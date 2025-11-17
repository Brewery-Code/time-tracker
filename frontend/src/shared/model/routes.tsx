import "react-router-dom";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  USER: "/user/:userId",
} as const;

export type PathParams = {
  [ROUTES.USER]: {
    userId: string;
  };
};

declare module "react-router-dom" {
  interface Register {
    params: PathParams;
  }
}
