import { rqClient } from "@shared/api/instance";
import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// --- TYPES ---
interface WorkPlace {
  id: number;
  title: string;
  address: string;
}
interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  profile_photo: string;
  email: string;
  phone_number: string;
  created_at: string;
  workplace: WorkPlace;
  personal_token: string;
}
interface WorkSummary {
  date: string;
  work_time: string;
}
interface EmployeeWorkDetailResponse {
  employee: Employee;
  period: string;
  work_summary: WorkSummary[];
  total_hours: number;
}
interface ChartData {
  name: string;
  hours: number;
  fullDate: string;
}

// --- HELPERS ---

// Надійний парсинг часу
const parseWorkTime = (workTime: string | number): number => {
  if (typeof workTime === "number") return workTime;
  if (!workTime) return 0;

  // Варіант 1: Якщо приходить просто час "08:30:00"
  if (workTime.includes(":") && !workTime.includes("T")) {
    const [h, m] = workTime.split(":").map(Number);
    return parseFloat((h + m / 60).toFixed(2));
  }

  // Варіант 2: Якщо приходить ISO Date
  const date = new Date(workTime);
  if (!isNaN(date.getTime())) {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return parseFloat((hours + minutes / 60).toFixed(2));
  }

  return 0;
};

// YYYY-MM-DD (Локальний час)
const formatDateISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Понеділок поточного тижня
const getMonday = (d: Date): Date => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Перше число місяця
const getFirstDayOfMonth = (d: Date): Date => {
  const date = new Date(d);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
};

// --- COMPONENTS ---

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-lg">
        <p className="font-bold text-slate-800 dark:text-slate-100">
          {payload[0].payload.fullDate}
        </p>
        <p className="text-indigo-600 dark:text-indigo-400">{`Години: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const WorkHoursChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  const interval = data.length > 15 ? Math.floor(data.length / 10) : 0;

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        Немає даних
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 30, right: 0, left: 0, bottom: 5 }}
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          strokeOpacity={0.2}
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#64748b" }}
          className="text-xs"
          interval={interval}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b" }}
          className="text-xs"
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(129, 140, 248, 0.1)" }}
        />
        {/* minPointSize дозволяє бачити навіть дуже малі значення */}
        <Bar
          dataKey="hours"
          fill="#818cf8"
          radius={[4, 4, 0, 0]}
          minPointSize={2}
        >
          <LabelList
            dataKey="hours"
            position="top"
            offset={8}
            className="fill-slate-700 dark:fill-slate-200 text-xs"
            formatter={(v: number) => (v > 0 ? v.toFixed(1) : "")}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const WorkerInfo: React.FC<{ employee: Employee; totalHours: number }> = ({
  employee,
  totalHours,
}) => (
  <>
    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
      <div className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg bg-gray-200 flex items-center justify-center overflow-hidden">
        {employee.profile_photo ? (
          <img
            src={employee.profile_photo}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-gray-500">
            {employee.first_name[0]}
          </span>
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {employee.first_name} {employee.last_name}
        </h1>
        <p className="text-indigo-500 dark:text-indigo-400 font-medium mt-1">
          {employee.position}
        </p>
        <p className="text-sm text-gray-500">{employee.email}</p>
      </div>
    </div>
    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
      <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Всього годин за період
      </p>
      <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-1">
        {totalHours.toFixed(2)} год
      </p>
    </div>
  </>
);

// --- MAIN COMPONENT ---

type TimePeriod = "week" | "month";

function User() {
  const { userId } = useParams<{ userId: string }>();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("week");
  const [currentDate, setCurrentDate] = useState(() => getMonday(new Date()));

  // API QUERY
  const {
    data: apiData,
    isLoading,
    isError,
  } = rqClient.useQuery(
    "get",
    "/employees/{employee_id}",
    {
      params: {
        path: { employee_id: Number(userId) },
        query: {
          // Відправляємо YYYY-MM-DD і для тижня, і для місяця (щоб пройти валідацію на бекенді)
          week: timePeriod === "week" ? formatDateISO(currentDate) : undefined,
          month:
            timePeriod === "month" ? formatDateISO(currentDate) : undefined,
        },
      },
    },
    { enabled: !isNaN(Number(userId)) },
  );

  // HANDLERS (Всі всередині компонента!)
  const handlePrev = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (timePeriod === "week") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(1);
        newDate.setMonth(newDate.getMonth() - 1);
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (timePeriod === "week") {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(1);
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleModeChange = (mode: TimePeriod) => {
    setTimePeriod(mode);
    const now = new Date();
    setCurrentDate(mode === "week" ? getMonday(now) : getFirstDayOfMonth(now));
  };

  // CHART DATA MEMO
  const chartData: ChartData[] = useMemo(() => {
    if (!apiData?.work_summary) return [];

    // Debug в консоль
    console.log("API RAW:", apiData.work_summary);

    const summaryMap = new Map();
    apiData.work_summary.forEach((item) => {
      // Нормалізуємо дату з API, щоб вона точно збігалася з ключами
      const normalizedDate = formatDateISO(new Date(item.date));
      const hours = parseWorkTime(item.work_time);
      summaryMap.set(normalizedDate, hours);
    });

    const data: ChartData[] = [];

    if (timePeriod === "week") {
      const startDate = new Date(currentDate);
      const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
      for (let i = 0; i < 7; i++) {
        const current = new Date(startDate);
        current.setDate(startDate.getDate() + i);
        const dateStr = formatDateISO(current);

        data.push({
          name: dayNames[i],
          fullDate: dateStr,
          hours: summaryMap.get(dateStr) || 0,
        });
      }
    } else {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let i = 1; i <= daysInMonth; i++) {
        const m = String(month + 1).padStart(2, "0");
        const d = String(i).padStart(2, "0");
        const dateStr = `${year}-${m}-${d}`;

        data.push({
          name: i.toString(),
          fullDate: dateStr,
          hours: summaryMap.get(dateStr) || 0,
        });
      }
    }

    console.log("Chart Processed:", data);
    return data;
  }, [apiData, timePeriod, currentDate]);

  // PERIOD DISPLAY MEMO
  const periodDisplay = useMemo(() => {
    const locale = "uk-UA";
    if (timePeriod === "month") {
      return currentDate
        .toLocaleDateString(locale, { month: "long", year: "numeric" })
        .toUpperCase();
    }
    const start = new Date(currentDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const startF = start.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
    });
    const endF = end.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
    });
    return `${startF} - ${endF}`;
  }, [currentDate, timePeriod]);

  // RENDER
  if (isLoading) return <div className="p-10 text-center">Завантаження...</div>;
  if (isError || !apiData)
    return (
      <div className="p-10 text-center text-red-500">
        Помилка завантаження даних
      </div>
    );

  return (
    <div className="container-base min-h-screen flex items-center justify-center p-4 font-sans">
      <main className="w-full">
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            <WorkerInfo
              employee={apiData.employee}
              totalHours={apiData.total_hours}
            />

            <div className="mt-8">
              <div className="flex justify-between items-center mb-6 px-4 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-600 transition-all text-slate-500 dark:text-slate-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <p className="text-lg font-bold text-slate-700 dark:text-slate-100 text-center select-none capitalize w-48">
                  {periodDisplay}
                </p>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-600 transition-all text-slate-500 dark:text-slate-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center items-center bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-lg space-x-2">
                <button
                  onClick={() => handleModeChange("week")}
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${timePeriod === "week" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-300"}`}
                >
                  Тиждень
                </button>
                <button
                  onClick={() => handleModeChange("month")}
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${timePeriod === "month" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-300"}`}
                >
                  Місяць
                </button>
              </div>
            </div>

            <div className="mt-8 h-80 w-full">
              <WorkHoursChart data={chartData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const Component = User;
