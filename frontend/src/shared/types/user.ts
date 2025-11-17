import type { TimeLog } from "./time-log";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  timeToday: TimeLog;
  timeWeek: TimeLog;
  timeMonth: TimeLog;
}
