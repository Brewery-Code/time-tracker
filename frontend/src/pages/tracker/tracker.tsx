import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import {
  PlayArrow,
  Stop,
  AccessTime,
  History,
  CalendarToday,
  DateRange,
  EventNote,
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
  timeToday: TimeLog;
  timeWeek: TimeLog;
  timeMonth: TimeLog;
}

export interface TimeSession {
  id: string;
  startTime: number;
  endTime: number | null;
  duration: number;
  description: string;
}

export enum TimerStatus {
  IDLE = "IDLE",
  RUNNING = "RUNNING",
  PAUSED = "PAUSED",
}

const MOCK_USER: User = {
  id: "u-123",
  firstName: "Олександр",
  lastName: "Коваленко",
  avatarUrl: "",
  timeToday: { hours: 2, minutes: 15 },
  timeWeek: { hours: 14, minutes: 30 },
  timeMonth: { hours: 64, minutes: 10 },
};

const StatBox = ({
  label,
  time,
  icon,
  colorClass,
}: {
  label: string;
  time: TimeLog;
  icon: React.ReactNode;
  colorClass: string;
}) => (
  <div className="flex items-center space-x-3 bg-slate-50 rounded-xl p-3 border border-slate-100 min-w-[140px]">
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
        {time.hours}г {time.minutes}хв
      </Typography>
    </div>
  </div>
);

function Tracker() {
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const [status, setStatus] = useState<TimerStatus>(TimerStatus.IDLE);
  const [seconds, setSeconds] = useState(0);
  const [description, setDescription] = useState("");

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const handleSessionComplete = useCallback((session: TimeSession) => {
    setSessions((prev) => [...prev, session]);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const startTimer = useCallback(() => {
    if (status === TimerStatus.RUNNING) return;

    setStatus(TimerStatus.RUNNING);
    startTimeRef.current = Date.now() - seconds * 1000;

    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current) {
        const now = Date.now();
        setSeconds(Math.floor((now - startTimeRef.current) / 1000));
      }
    }, 1000);
  }, [status, seconds]);

  const stopTimer = useCallback(() => {
    if (status !== TimerStatus.RUNNING) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const endTime = Date.now();
    const finalDuration = seconds;

    const newSession: TimeSession = {
      id: crypto.randomUUID(),
      startTime: startTimeRef.current || Date.now(),
      endTime: endTime,
      duration: finalDuration,
      description: description || "Без назви",
    };

    handleSessionComplete(newSession);
    setStatus(TimerStatus.IDLE);
    setSeconds(0);
    setDescription("");
    startTimeRef.current = null;
  }, [status, seconds, description, handleSessionComplete]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const additionalSecondsToday = sessions.reduce(
    (acc, s) => acc + s.duration,
    0,
  );

  const totalMinutesToday =
    MOCK_USER.timeToday.hours * 60 +
    MOCK_USER.timeToday.minutes +
    Math.floor(additionalSecondsToday / 60);

  const displayToday: TimeLog = {
    hours: Math.floor(totalMinutesToday / 60),
    minutes: totalMinutesToday % 60,
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 font-sans">
      <Paper className="rounded-2xl shadow-sm border border-slate-200 overflow-hidden bg-white">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={MOCK_USER.avatarUrl}
              sx={{ width: 72, height: 72, fontSize: 32 }}
              className="bg-blue-600 text-white shadow-lg border-4 border-white"
            >
              {!MOCK_USER.avatarUrl && <PersonIcon fontSize="inherit" />}
            </Avatar>
            <div>
              <Typography variant="h5" className="font-bold text-slate-800">
                {MOCK_USER.firstName} {MOCK_USER.lastName}
              </Typography>
              <div className="flex items-center gap-2 mt-1">
                <Chip
                  label="Online"
                  size="small"
                  className="bg-green-100 text-green-700 font-bold h-6"
                />
                <Typography variant="body2" className="text-slate-500">
                  Готовий до продуктивності
                </Typography>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <StatBox
              label="Сьогодні"
              time={displayToday}
              icon={<AccessTime fontSize="small" />}
              colorClass="bg-blue-500"
            />
            <StatBox
              label="Цей тиждень"
              time={MOCK_USER.timeWeek}
              icon={<DateRange fontSize="small" />}
              colorClass="bg-violet-500"
            />
            <StatBox
              label="Цей місяць"
              time={MOCK_USER.timeMonth}
              icon={<CalendarToday fontSize="small" />}
              colorClass="bg-indigo-500"
            />
          </div>
        </div>
      </Paper>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="rounded-2xl shadow-lg border-0 h-full flex flex-col justify-center relative overflow-hidden bg-white">
            <div
              className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-500 ${
                status === TimerStatus.RUNNING
                  ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                  : "bg-slate-200"
              }`}
            />

            <CardContent className="p-8 md:p-12 flex flex-col items-center justify-center space-y-10 text-center">
              <div className="w-full max-w-lg">
                <Typography
                  variant="subtitle1"
                  className="text-slate-500 mb-3 font-medium uppercase tracking-wider text-xs"
                >
                  {status === TimerStatus.RUNNING
                    ? "Трекер активний"
                    : "Нове завдання"}
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Над чим ви працюєте зараз?"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={status === TimerStatus.RUNNING}
                  className="bg-slate-50"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      backgroundColor: "#F8FAFC",
                      fontSize: "1.1rem",
                      "& fieldset": { borderColor: "#E2E8F0" },
                      "&:hover fieldset": { borderColor: "#CBD5E1" },
                      "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
                    },
                  }}
                />
              </div>

              <div className="font-mono text-7xl md:text-9xl font-bold tracking-tighter text-slate-800 tabular-nums">
                {formatTime(seconds)}
              </div>

              <div className="flex gap-6">
                {status !== TimerStatus.RUNNING ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrow style={{ fontSize: 28 }} />}
                    onClick={startTimer}
                    className="bg-blue-600 hover:bg-blue-700 py-4 px-10 rounded-full text-xl shadow-blue-200 shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    Почати
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={<Stop style={{ fontSize: 28 }} />}
                    onClick={stopTimer}
                    className="bg-red-500 hover:bg-red-600 py-4 px-10 rounded-full text-xl shadow-red-200 shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    Зупинити
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Paper className="h-full rounded-2xl shadow-lg overflow-hidden flex flex-col bg-white min-h-[450px] border border-slate-100">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <Typography
                variant="h6"
                className="font-bold text-slate-700 flex items-center"
              >
                <History className="mr-2 text-slate-400" />
                Історія
              </Typography>
              <Chip
                label={`${sessions.length} сесій`}
                size="small"
                className="bg-white border border-slate-200 font-medium text-slate-600"
              />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] p-3">
              {sessions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-4">
                  <div className="bg-slate-50 p-6 rounded-full">
                    <EventNote style={{ fontSize: 48, opacity: 0.3 }} />
                  </div>
                  <div>
                    <Typography className="font-medium text-slate-500">
                      Поки що пусто
                    </Typography>
                    <Typography variant="caption" className="text-slate-400">
                      Запустіть таймер, щоб з'явився запис
                    </Typography>
                  </div>
                </div>
              ) : (
                <List className="space-y-2">
                  {sessions
                    .slice()
                    .reverse()
                    .map((session) => (
                      <ListItem
                        key={session.id}
                        className="bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 pr-4"
                      >
                        <ListItemAvatar>
                          <Avatar className="bg-white text-blue-600 border border-blue-100">
                            <AccessTime fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <span className="font-semibold text-slate-800 block truncate text-sm mb-0.5">
                              {session.description}
                            </span>
                          }
                          secondary={
                            <span className="text-xs text-slate-500 flex items-center gap-2">
                              <span>
                                {new Date(session.startTime).toLocaleTimeString(
                                  "uk-UA",
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="font-mono font-medium text-slate-600">
                                {formatTime(session.duration)}
                              </span>
                            </span>
                          }
                        />
                      </ListItem>
                    ))}
                </List>
              )}
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export const Component = Tracker;
