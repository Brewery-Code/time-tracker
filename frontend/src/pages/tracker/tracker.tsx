import {
  Avatar,
  Button,
  Card,
  CardContent,
  Paper,
  Typography,
} from "@mui/material";
import {
  PlayArrow,
  Stop,
  AccessTime,
  DateRange,
  CalendarToday,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";

export interface TimeLog {
  hours: number;
  minutes: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  timeWeek: TimeLog;
  timeMonth: TimeLog;
}

export enum TimerStatus {
  IDLE = "IDLE",
  RUNNING = "RUNNING",
}

// Початкові дані (статистика за тиждень/місяць приходить з бекенду)
const MOCK_USER: User = {
  id: "u-123",
  firstName: "Олександр",
  lastName: "Коваленко",
  avatarUrl: "",
  timeWeek: { hours: 14, minutes: 30 },
  timeMonth: { hours: 64, minutes: 10 },
};

// Початковий час за сьогодні (наприклад, з бази даних)
const INITIAL_TODAY_SECONDS = 2 * 3600 + 15 * 60; // 2 години 15 хвилин

const StatBox = ({
  label,
  value,
  icon,
  colorClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}) => (
  <div className="flex items-center space-x-3 bg-slate-50 rounded-xl p-3 border border-slate-100 min-w-[140px] flex-1">
    <div className={`p-2 rounded-lg ${colorClass} text-white shadow-sm`}>
      {icon}
    </div>
    <div>
      <Typography
        variant="caption"
        className="text-slate-500 font-medium block"
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        className="font-bold text-slate-800 leading-none mt-0.5"
      >
        {value}
      </Typography>
    </div>
  </div>
);

function Tracker() {
  const [status, setStatus] = useState<TimerStatus>(TimerStatus.IDLE);

  // accumulatedSeconds - час, який вже був зафіксований до запуску поточного таймера
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(
    INITIAL_TODAY_SECONDS,
  );
  // currentSessionSeconds - час поточної активної сесії
  const [currentSessionSeconds, setCurrentSessionSeconds] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Форматування часу у HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Форматування для карток статистики (гг ххв)
  const formatStatTime = (hours: number, minutes: number) =>
    `${hours}г ${minutes}хв`;
  const formatSecondsToStat = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return formatStatTime(h, m);
  };

  const startTimer = useCallback(() => {
    if (status === TimerStatus.RUNNING) return;

    setStatus(TimerStatus.RUNNING);
    startTimeRef.current = Date.now();

    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current) {
        const now = Date.now();
        // Оновлюємо лише час поточної сесії
        setCurrentSessionSeconds(
          Math.floor((now - startTimeRef.current) / 1000),
        );
      }
    }, 1000);
  }, [status]);

  const stopTimer = useCallback(() => {
    if (status !== TimerStatus.RUNNING) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Додаємо час сесії до загального накопиченого часу
    setAccumulatedSeconds((prev) => prev + currentSessionSeconds);
    setCurrentSessionSeconds(0);
    setStatus(TimerStatus.IDLE);
    startTimeRef.current = null;

    // Тут можна відправити запит на бекенд для збереження часу
  }, [status, currentSessionSeconds]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Загальний час за сьогодні (накопичений + поточний)
  const totalSecondsToday = accumulatedSeconds + currentSessionSeconds;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 font-sans">
      {/* Верхня панель: Інфо та Статистика */}
      <Paper className="rounded-2xl shadow-sm border border-slate-200 overflow-hidden bg-white p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Користувач */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Avatar
              src={MOCK_USER.avatarUrl}
              sx={{ width: 64, height: 64 }}
              className="bg-blue-600 text-white shadow-md"
            >
              {!MOCK_USER.avatarUrl && <PersonIcon />}
            </Avatar>
            <div>
              <Typography
                variant="h6"
                className="font-bold text-slate-800 leading-tight"
              >
                {MOCK_USER.firstName} {MOCK_USER.lastName}
              </Typography>
              <Typography variant="body2" className="text-slate-500">
                Робочий простір
              </Typography>
            </div>
          </div>

          {/* Статистика */}
          <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
            {/* Показуємо "Сьогодні" динамічно */}
            <StatBox
              label="Сьогодні"
              value={formatSecondsToStat(totalSecondsToday)}
              icon={<AccessTime fontSize="small" />}
              colorClass="bg-blue-500"
            />
            <StatBox
              label="Тиждень"
              value={formatStatTime(
                MOCK_USER.timeWeek.hours,
                MOCK_USER.timeWeek.minutes,
              )}
              icon={<DateRange fontSize="small" />}
              colorClass="bg-violet-500"
            />
            <StatBox
              label="Місяць"
              value={formatStatTime(
                MOCK_USER.timeMonth.hours,
                MOCK_USER.timeMonth.minutes,
              )}
              icon={<CalendarToday fontSize="small" />}
              colorClass="bg-indigo-500"
            />
          </div>
        </div>
      </Paper>

      {/* Основна картка Трекера */}
      <Card className="rounded-2xl shadow-lg border-0 bg-white relative overflow-hidden">
        {/* Індикатор активності (смужка зверху) */}
        <div
          className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-500 ${
            status === TimerStatus.RUNNING
              ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]"
              : "bg-slate-200"
          }`}
        />

        <CardContent className="p-12 flex flex-col items-center justify-center space-y-8 text-center min-h-[300px]">
          <div className="space-y-2">
            <Typography
              variant="overline"
              className="text-slate-400 font-semibold tracking-widest"
            >
              {status === TimerStatus.RUNNING
                ? "Таймер активний"
                : "Готовий до роботи"}
            </Typography>
          </div>

          {/* Таймер */}
          <div className="font-mono text-8xl md:text-9xl font-bold tracking-tighter text-slate-800 tabular-nums select-none">
            {/* Відображаємо час поточної сесії, якщо таймер йде, або нулі, якщо стоїть. 
                АБО можна відображати загальний час за сьогодні.
                Зазвичай в трекері показують час поточної сесії. */}
            {formatTime(currentSessionSeconds)}
          </div>

          {/* Кнопки керування */}
          <div>
            {status !== TimerStatus.RUNNING ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow style={{ fontSize: 32 }} />}
                onClick={startTimer}
                className="bg-blue-600 hover:bg-blue-700 py-4 px-12 rounded-full text-xl font-bold shadow-blue-200 shadow-xl transition-transform hover:scale-105 active:scale-95"
              >
                Почати
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                size="large"
                startIcon={<Stop style={{ fontSize: 32 }} />}
                onClick={stopTimer}
                className="bg-red-500 hover:bg-red-600 py-4 px-12 rounded-full text-xl font-bold shadow-red-200 shadow-xl transition-transform hover:scale-105 active:scale-95"
              >
                Зупинити
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Component = Tracker;
