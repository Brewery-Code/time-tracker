import React, { useState, useMemo } from "react";
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
interface TimeData {
  hours: number;
  minutes: number;
}

interface WorkLog {
  date: string; // YYYY-MM-DD
  time: TimeData;
}

interface Worker {
  id: string;
  firstName: string;
  lastName: "Kovalenko";
  avatarUrl: string;
  workLogs: WorkLog[];
}

interface ChartData {
  name: string;
  hours: number;
}

// --- COMPONENTS ---

// From components/WorkHoursChart.tsx
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-lg">
        <p className="font-bold text-slate-800 dark:text-slate-100">{`${label}`}</p>
        <p className="text-indigo-600 dark:text-indigo-400">{`Години : ${payload[0].value.toFixed(
          2,
        )}`}</p>
      </div>
    );
  }

  return null;
};

interface WorkHoursChartProps {
  data: ChartData[];
}

const WorkHoursChart: React.FC<WorkHoursChartProps> = ({ data }) => {
  const interval = data.length > 12 ? Math.floor(data.length / 10) : 0;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 30,
          right: 0,
          left: 0,
          bottom: 5,
        }}
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
          className="text-xs dark:fill-slate-400"
          interval={interval}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b" }}
          className="text-xs dark:fill-slate-400"
          label={{
            value: "Години",
            angle: -90,
            position: "insideLeft",
            fill: "#64748b",
            className: "dark:fill-slate-400",
          }}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(129, 140, 248, 0.1)" }}
        />
        <Bar dataKey="hours" fill="#818cf8" radius={[4, 4, 0, 0]}>
          <LabelList
            dataKey="hours"
            position="top"
            offset={8}
            className="fill-slate-700 dark:fill-slate-200 text-xs"
            formatter={(value: number) => (value > 0 ? value.toFixed(2) : "")}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// From components/WorkerInfo.tsx
interface WorkerInfoProps {
  worker: Omit<Worker, "workLogs">;
  stats: {
    timeToday: TimeData;
    timeWeek: TimeData;
    timeMonth: TimeData;
  };
}

const StatCard: React.FC<{ title: string; time: TimeData }> = ({
  title,
  time,
}) => {
  const timeString = `${time.hours}г ${time.minutes}хв`;
  return (
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {title}
      </p>
      <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-1">
        {timeString}
      </p>
    </div>
  );
};

const WorkerInfo: React.FC<WorkerInfoProps> = ({ worker, stats }) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={worker.avatarUrl}
          alt={`${worker.firstName} ${worker.lastName}`}
          className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {worker.firstName} {worker.lastName}
          </h1>
          <p className="text-indigo-500 dark:text-indigo-400 font-medium mt-1">
            Статистика Робочого Часу
          </p>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <StatCard title="Сьогодні" time={stats.timeToday} />
        <StatCard title="Цей тиждень" time={stats.timeWeek} />
        <StatCard title="Цей місяць" time={stats.timeMonth} />
      </div>
    </>
  );
};

// --- MAIN APP LOGIC ---

const initialWorkerData: Worker = {
  id: "1",
  firstName: "Olena",
  lastName: "Kovalenko",
  avatarUrl: "https://picsum.photos/seed/user1/200",
  workLogs: [
    { date: "2025-10-19", time: { hours: 0, minutes: 0 } },
    { date: "2025-10-20", time: { hours: 7, minutes: 45 } },
    { date: "2025-10-21", time: { hours: 8, minutes: 10 } },
    { date: "2025-10-22", time: { hours: 7, minutes: 30 } },
    { date: "2025-10-23", time: { hours: 8, minutes: 55 } },
    { date: "2025-10-24", time: { hours: 7, minutes: 45 } },
    { date: "2025-10-25", time: { hours: 0, minutes: 0 } },
    { date: "2025-10-26", time: { hours: 0, minutes: 0 } },
    { date: "2025-10-27", time: { hours: 8, minutes: 10 } },
    { date: "2025-10-28", time: { hours: 7, minutes: 30 } },
    { date: "2025-10-29", time: { hours: 8, minutes: 55 } },
    { date: "2025-10-30", time: { hours: 7, minutes: 45 } },
    { date: "2025-10-31", time: { hours: 8, minutes: 10 } },
    { date: "2025-11-01", time: { hours: 0, minutes: 0 } },
    { date: "2025-11-02", time: { hours: 0, minutes: 0 } },
    { date: "2025-11-03", time: { hours: 7, minutes: 30 } },
    { date: "2025-11-04", time: { hours: 8, minutes: 55 } },
    { date: "2025-11-05", time: { hours: 7, minutes: 45 } },
    { date: "2025-11-06", time: { hours: 8, minutes: 10 } },
    { date: "2025-11-07", time: { hours: 7, minutes: 30 } },
    { date: "2025-11-08", time: { hours: 0, minutes: 0 } },
    { date: "2025-11-09", time: { hours: 0, minutes: 0 } },
    { date: "2025-11-10", time: { hours: 8, minutes: 55 } },
    { date: "2025-11-11", time: { hours: 7, minutes: 45 } },
    { date: "2025-11-12", time: { hours: 8, minutes: 10 } },
    { date: "2025-11-13", time: { hours: 7, minutes: 30 } },
    { date: "2025-11-14", time: { hours: 8, minutes: 55 } },
    { date: "2025-11-15", time: { hours: 0, minutes: 0 } },
    { date: "2025-11-16", time: { hours: 0, minutes: 0 } },
    { date: "2025-11-17", time: { hours: 7, minutes: 45 } },
  ],
};

type TimePeriod = "week" | "month";

const User: React.FC = () => {
  const [worker] = useState<Worker>(initialWorkerData);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("week");
  const [currentDate, setCurrentDate] = useState(
    new Date("2025-11-17T12:00:00Z"),
  );

  const convertToDecimalHours = (time: TimeData): number => {
    return parseFloat((time.hours + time.minutes / 60).toFixed(2));
  };

  const handlePrev = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (timePeriod === "week") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(1); // Avoid issues with different month lengths
        newDate.setMonth(newDate.getMonth() - 1);
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (timePeriod === "week") {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(1); // Avoid issues with different month lengths
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isNextDisabled = useMemo(() => {
    // To make this dynamic, replace the fixed date string with `new Date()`
    const today = new Date("2025-11-17T23:59:59Z");
    const calendarDate = new Date(currentDate);

    if (timePeriod === "week") {
      const dayOfWeek =
        calendarDate.getDay() === 0 ? 6 : calendarDate.getDay() - 1;
      const endOfWeek = new Date(calendarDate);
      endOfWeek.setDate(calendarDate.getDate() - dayOfWeek + 6);
      return endOfWeek >= today;
    } else {
      // month
      return (
        calendarDate.getFullYear() === today.getFullYear() &&
        calendarDate.getMonth() === today.getMonth()
      );
    }
  }, [currentDate, timePeriod]);

  const displayedChartData = useMemo(() => {
    const referenceDate = new Date(currentDate);
    // To make this dynamic, replace the fixed date string with `new Date()`
    const today = new Date("2025-11-17T23:59:59Z");
    today.setHours(23, 59, 59, 999);

    const workLogsByDate = new Map(
      worker.workLogs.map((log) => [log.date, log.time]),
    );

    if (timePeriod === "week") {
      const dayOfWeek = referenceDate.getDay();
      const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const startOfWeek = new Date(referenceDate);
      startOfWeek.setDate(referenceDate.getDate() - offset);

      const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
      const weekData = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);

        if (date > today) break;

        const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
        const dateString = date.toISOString().split("T")[0];
        const logTime = workLogsByDate.get(dateString);

        weekData.push({
          name: dayNames[dayIndex],
          hours: logTime ? convertToDecimalHours(logTime) : 0,
        });
      }
      return weekData;
    }

    // Month view
    const daysInMonth = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() + 1,
      0,
    ).getDate();
    const isCurrentMonth =
      referenceDate.getFullYear() === today.getFullYear() &&
      referenceDate.getMonth() === today.getMonth();
    const limit = isCurrentMonth ? today.getDate() : daysInMonth;
    const monthData = [];

    for (let day = 1; day <= limit; day++) {
      const date = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth(),
        day,
      );
      const dateString = date.toISOString().split("T")[0];
      const logTime = workLogsByDate.get(dateString);

      monthData.push({
        name: day.toString(),
        hours: logTime ? convertToDecimalHours(logTime) : 0,
      });
    }
    return monthData;
  }, [worker.workLogs, timePeriod, currentDate]);

  const periodDisplay = useMemo(() => {
    if (timePeriod === "month") {
      const monthName = currentDate.toLocaleDateString("uk-UA", {
        month: "long",
        year: "numeric",
      });
      return monthName.charAt(0).toUpperCase() + monthName.slice(1);
    }

    // Week view
    const dayOfWeek = currentDate.getDay();
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - offset);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startDay = startOfWeek.getDate();
    const endDay = endOfWeek.getDate();
    const startMonth = startOfWeek.toLocaleDateString("uk-UA", {
      month: "long",
    });
    const endMonth = endOfWeek.toLocaleDateString("uk-UA", { month: "long" });

    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth}`;
    } else {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
    }
  }, [currentDate, timePeriod]);

  const stats = {
    timeToday: { hours: 7, minutes: 45 },
    timeWeek: { hours: 38, minutes: 20 },
    timeMonth: { hours: 165, minutes: 10 },
  };

  const getToggleButtonClass = (period: TimePeriod) => {
    const baseClasses =
      "px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
    if (timePeriod === period) {
      return `${baseClasses} bg-indigo-600 text-white shadow-sm`;
    }
    return `${baseClasses} bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600`;
  };

  return (
    <div className="container-base min-h-screen flex items-center justify-center p-4 font-sans">
      <main className="w-full">
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            <WorkerInfo worker={worker} stats={stats} />

            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                  aria-label="Попередній період"
                >
                  <svg
                    className="w-6 h-6 text-slate-500 dark:text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 text-center select-none">
                  {periodDisplay}
                </p>
                <button
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Наступний період"
                >
                  <svg
                    className="w-6 h-6 text-slate-500 dark:text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center items-center bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-lg space-x-2">
                <button
                  onClick={() => setTimePeriod("week")}
                  className={getToggleButtonClass("week")}
                >
                  Тиждень
                </button>
                <button
                  onClick={() => setTimePeriod("month")}
                  className={getToggleButtonClass("month")}
                >
                  Місяць
                </button>
              </div>
            </div>

            <div className="mt-6 h-80 w-full">
              <WorkHoursChart data={displayedChartData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const Component = User;
