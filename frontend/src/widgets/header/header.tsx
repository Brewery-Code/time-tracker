import { ROUTES } from "@shared/model/routes";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 sticky top-0 z-10">
      <div className="container-base mx-auto flex justify-between items-center">
        <Link
          className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
          to={ROUTES.HOME}
        >
          TimeTracker
        </Link>
        <nav>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mx-2"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mx-2"
          >
            Reports
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mx-2"
          >
            Settings
          </a>
        </nav>
      </div>
    </header>
  );
}
