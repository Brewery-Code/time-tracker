import { Outlet } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Header } from "@widgets/header/header";
import { Footer } from "@widgets/footer/footer";

export function App() {
  return (
    <div className="relative flex flex-col min-h-svh">
      <Header />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
