import { ROUTES } from "../shared/model/routes";
import { createBrowserRouter } from "react-router-dom";
import { App } from "./app";
import { Providers } from "./provider";

export const router = createBrowserRouter([
  {
    element: (
      <Providers>
        <App />
      </Providers>
    ),
    children: [
      {
        path: ROUTES.HOME,
        lazy: () => import("@pages/home/home"),
      },
      {
        path: ROUTES.LOGIN,
        lazy: () => import("@pages/login/login"),
      },
      {
        path: ROUTES.REGISTER,
        lazy: () => import("@pages/register/register"),
      },
      {
        path: ROUTES.USER,
        lazy: () => import("@pages/user/user"),
      },
      {
        path: ROUTES.TRACKER,
        lazy: () => import("@pages/tracker/tracker"),
      },
    ],
  },
]);
