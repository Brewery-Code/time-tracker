import { Outlet } from "react-router-dom";

export function App() {
  return (
    <>
      <div className="">Header</div>
      <Outlet />
      <div className="">Footer</div>
    </>
  );
}
