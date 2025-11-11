import { ROUTES } from "../shared/model/routes";
import { createBrowserRouter, redirect } from "react-router-dom";
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
      // {
      //   path: ROUTES.HOME,
      //   loader: () => import("@pages/"),
      // },
      {
        path: ROUTES.LOGIN,
        lazy: () => import("@pages/login/login"),
      },
      {
        path: ROUTES.REGISTER,
        lazy: () => import("@pages/register/register"),
      },
    ],
  },
]);
