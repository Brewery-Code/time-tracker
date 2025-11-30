import type { ApiSchemas } from "@shared/api/schema";
import { ROUTES } from "@shared/model/routes";
import { href, Link } from "react-router-dom";

interface UserCardProps {
  user: ApiSchemas["EmployeeWithStatsReturnSchema"];
}

interface TimeDisplayProps {
  label: string;
  time: string | null;
}

function TimeDisplay({ label, time }: TimeDisplayProps) {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-semibold text-lg text-indigo-600 dark:text-indigo-400">
        {time}
      </p>
    </div>
  );
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Link
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden"
      to={href(ROUTES.USER, { userId: String(user.id) })}
    >
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-5">
          <img
            className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-300 dark:ring-indigo-500"
            src={user.profile_photo || ""}
            alt={`${user.last_name} ${user.first_name}`}
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {`${user.last_name} ${user.first_name}`}
            </h3>
            <p className="text-indigo-500 dark:text-indigo-400 text-sm">
              Developer
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-around items-center">
            <TimeDisplay label="Сьогодні" time={user.work_stats.today} />
            <div className="border-l h-10 border-gray-200 dark:border-gray-600"></div>
            <TimeDisplay label="Тиждень" time={user.work_stats.week} />
            <div className="border-l h-10 border-gray-200 dark:border-gray-600"></div>
            <TimeDisplay label="Місяць" time={user.work_stats.month} />
          </div>
        </div>
      </div>
    </Link>
  );
}
