import { ROUTES } from "../shared/model/routes";
import { createBrowserRouter, redirect } from "react-router-dom";
import { App } from "./app";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: ROUTES.HOME,
        loader: () => import("@"),
      },
      {
        path: ROUTES.LOGIN,
        loader: () => redirect(ROUTES.LOGIN),
      },
      {
        path: ROUTES.REGISTER,
        loader: () => redirect(ROUTES.REGISTER),
      },
    ],
  },
]);
