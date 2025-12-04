import { rqClient } from "@shared/api/instance"; // Імпорт вашого клієнта
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  PlayArrow,
  Stop,
  AccessTime,
  DateRange,
  CalendarToday,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  VpnKey as KeyIcon,
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

export const TimerStatus = {
  IDLE: "IDLE",
  RUNNING: "RUNNING",
} as const;

type TimerStatus = (typeof TimerStatus)[keyof typeof TimerStatus];

const MOCK_USER: User = {
  id: "u-123",
  firstName: "Олександр",
  lastName: "Коваленко",
  avatarUrl: "",
  timeWeek: { hours: 14, minutes: 30 },
  timeMonth: { hours: 64, minutes: 10 },
};

const INITIAL_TODAY_SECONDS = 2 * 3600 + 15 * 60;

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
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(
    INITIAL_TODAY_SECONDS,
  );
  const [currentSessionSeconds, setCurrentSessionSeconds] = useState(0);

  // --- TOKEN STATE ---
  const [token, setToken] = useState(() => {
    return localStorage.getItem("employee_personal_token") || "";
  });
  const [showToken, setShowToken] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // --- API MUTATIONS ---
  const startWorkMutation = rqClient.useMutation(
    "post",
    "/employees/work/start",
  );
  const endWorkMutation = rqClient.useMutation("post", "/employees/work/end");

  // Збереження токена при зміні
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setToken(newValue);
    localStorage.setItem("employee_personal_token", newValue);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatStatTime = (hours: number, minutes: number) =>
    `${hours}г ${minutes}хв`;
  const formatSecondsToStat = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return formatStatTime(h, m);
  };

  // --- LOGIC ---

  const handleStartClick = useCallback(() => {
    if (!token) {
      alert("Будь ласка, введіть персональний токен");
      return;
    }

    // Виклик API Start
    startWorkMutation.mutate(
      {
        // Передаємо заголовок через параметри (залежно від конфігурації вашого rqClient,
        // це може бути передано як 'params.header' або просто в об'єкті конфігу fetch)
        params: {
          header: {
            Authorization: `token ${token}`,
          },
        } as any,
      },
      {
        onSuccess: () => {
          // Запускаємо локальний таймер тільки після успіху API
          setStatus(TimerStatus.RUNNING);
          startTimeRef.current = Date.now();

          intervalRef.current = window.setInterval(() => {
            if (startTimeRef.current) {
              const now = Date.now();
              setCurrentSessionSeconds(
                Math.floor((now - startTimeRef.current) / 1000),
              );
            }
          }, 1000);
        },
        onError: (error) => {
          console.error("Failed to start work:", error);
          alert("Помилка при старті таймера. Перевірте токен.");
        },
      },
    );
  }, [token, startWorkMutation]);

  const handleStopClick = useCallback(() => {
    if (!token) return;

    // Виклик API End
    endWorkMutation.mutate(
      {
        params: {
          header: {
            Authorization: `token ${token}`,
          },
        } as any,
      },
      {
        onSuccess: () => {
          // Зупиняємо локальний таймер тільки після успіху API
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          setAccumulatedSeconds((prev) => prev + currentSessionSeconds);
          setCurrentSessionSeconds(0);
          setStatus(TimerStatus.IDLE);
          startTimeRef.current = null;
        },
        onError: (error) => {
          console.error("Failed to end work:", error);
          alert("Помилка при зупинці таймера. Перевірте з'єднання.");
        },
      },
    );
  }, [status, currentSessionSeconds, token, endWorkMutation]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const totalSecondsToday = accumulatedSeconds + currentSessionSeconds;
  const isLoading = startWorkMutation.isPending || endWorkMutation.isPending;

  const {
    data: userData,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = rqClient.useQuery("get", `/employees/by-token/${token}`, {
    enabled: !!token && token.length > 3,
    retry: false,
    onError: () => {
      console.warn("Invalid token or user not found");
    },
  });

  console.log(userData);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 font-sans">
      {/* Верхня панель: Інфо та Статистика */}
      <Paper className="rounded-2xl shadow-sm border border-slate-200 overflow-hidden bg-white p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Користувач */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Avatar
                src={userData}
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

          {/* Поле для Токена */}
          <div className="border-t border-slate-100 pt-4">
            <TextField
              label="Персональний Токен (Authorization)"
              variant="outlined"
              size="small"
              fullWidth
              type={showToken ? "text" : "password"}
              value={token}
              onChange={handleTokenChange}
              placeholder="Вставте свій токен тут..."
              disabled={status === TimerStatus.RUNNING || isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon className="text-slate-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowToken(!showToken)}
                      edge="end"
                    >
                      {showToken ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Токен зберігається локально у вашому браузері"
            />
          </div>
        </div>
      </Paper>

      {/* Основна картка Трекера */}
      <Card className="rounded-2xl shadow-lg border-0 bg-white relative overflow-hidden">
        {/* Індикатор активності */}
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
          <div className="font-mono text-8xl md:text-9xl font-bold tracking-tighter text-slate-800 tabular-nums select-none transition-opacity duration-300">
            {formatTime(currentSessionSeconds)}
          </div>

          {/* Кнопки керування */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 rounded-full">
                <CircularProgress size={32} />
              </div>
            )}

            {status !== TimerStatus.RUNNING ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow style={{ fontSize: 32 }} />}
                onClick={handleStartClick}
                disabled={isLoading || !token}
                className={`py-4 px-12 rounded-full text-xl font-bold shadow-xl transition-transform hover:scale-105 active:scale-95 ${
                  !token
                    ? "bg-slate-300 shadow-none cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                }`}
              >
                Почати
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                size="large"
                startIcon={<Stop style={{ fontSize: 32 }} />}
                onClick={handleStopClick}
                disabled={isLoading}
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
