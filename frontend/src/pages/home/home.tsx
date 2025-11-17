import { useState, useEffect } from "react";
import { type User } from "@shared/types";
import { UserCard } from "@widgets/index";

const MOCK_USERS: User[] = [
  {
    id: "1",
    firstName: "Olena",
    lastName: "Kovalenko",
    avatarUrl: "https://picsum.photos/seed/user1/200",
    timeToday: { hours: 7, minutes: 45 },
    timeWeek: { hours: 38, minutes: 15 },
    timeMonth: { hours: 152, minutes: 30 },
  },
  {
    id: "2",
    firstName: "Andriy",
    lastName: "Shevchenko",
    avatarUrl: "https://picsum.photos/seed/user2/200",
    timeToday: { hours: 8, minutes: 5 },
    timeWeek: { hours: 40, minutes: 25 },
    timeMonth: { hours: 161, minutes: 0 },
  },
  {
    id: "3",
    firstName: "Yaroslava",
    lastName: "Mahuchikh",
    avatarUrl: "https://picsum.photos/seed/user3/200",
    timeToday: { hours: 6, minutes: 30 },
    timeWeek: { hours: 32, minutes: 0 },
    timeMonth: { hours: 130, minutes: 45 },
  },
  {
    id: "4",
    firstName: "Mykhailo",
    lastName: "Mudryk",
    avatarUrl: "https://picsum.photos/seed/user4/200",
    timeToday: { hours: 8, minutes: 15 },
    timeWeek: { hours: 41, minutes: 10 },
    timeMonth: { hours: 165, minutes: 20 },
  },
  {
    id: "5",
    firstName: "Kateryna",
    lastName: "Baindl",
    avatarUrl: "https://picsum.photos/seed/user5/200",
    timeToday: { hours: 5, minutes: 55 },
    timeWeek: { hours: 29, minutes: 40 },
    timeMonth: { hours: 118, minutes: 5 },
  },
  {
    id: "6",
    firstName: "Serhiy",
    lastName: "Rebrov",
    avatarUrl: "https://picsum.photos/seed/user6/200",
    timeToday: { hours: 9, minutes: 0 },
    timeWeek: { hours: 45, minutes: 0 },
    timeMonth: { hours: 180, minutes: 0 },
  },
];

function Home() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(MOCK_USERS);
  }, []);

  return (
    <div className="container-base">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        User Activity
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export const Component = Home;
