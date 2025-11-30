import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // 1. Імпортуємо Link
import { type User } from "@shared/types";
import { UserCard } from "@widgets/index";
import { rqClient } from "@shared/api/instance";
import { ROUTES } from "@shared/model/routes"; // Бажано використовувати константи шляхів

function Home() {
  const employees = rqClient.useQuery("get", "/employees");
  // const newEmployee = rqClient.useMutation("post", "/employees", {
  //     onSuccess() {
  //       navigate(ROUTES.HOME);
  //     },
  //     onError(error) {
  //       if (typeof error.detail === "string") {
  //         // звичайний рядок
  //         setError("password", { type: "server", message: error.detail });
  //       } else if (Array.isArray(error.detail)) {
  //         // масив помилок від backend
  //         const firstErrorMsg = error.detail[0]?.msg || "Сталася помилка";
  //         setError("password", { type: "server", message: firstErrorMsg });
  //       } else {
  //         setError("password", { type: "server", message: "Сталася помилка" });
  //       }
  //     },
  //   });

  return (
    <div className="container-base">
      {/* 2. Обгортаємо заголовок і кнопку в flex-контейнер для вирівнювання */}
      <div className="flex justify-between items-center mb-6">
        {/* 3. Кнопка додавання */}
        <Link
          to={ROUTES.REGISTER || "/register"} // Вкажіть тут шлях до сторінки створення
          className="ml-auto mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Додати працівника
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {employees.data?.map((employee) => (
          <UserCard key={employee.id} user={employee} />
        ))}
      </div>
    </div>
  );
}

export const Component = Home;
