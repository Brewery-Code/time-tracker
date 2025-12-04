import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { UserCard } from "@widgets/index";
import { rqClient } from "@shared/api/instance";
import { useQueryClient } from "@tanstack/react-query"; // Для оновлення списку після додавання

// Типізація форми (те, що ми збираємо з полів)
interface EmployeeFormInputs {
  first_name: string;
  last_name: string;
  position: string;
  email: string;
  phone_number: string;
  workplace_id: number;
  file: FileList; // React Hook Form повертає FileList для input type="file"
}

function Home() {
  // 1. Стан для модалки
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // 2. React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormInputs>();

  // Дивимось за файлом, щоб показати його назву
  const selectedFile = watch("file");

  // 3. Запити
  const employees = rqClient.useQuery("get", "/employees");
  const newEmployee = rqClient.useMutation("post", "/employees", {
    onSuccess: () => {
      // Закриваємо модалку і очищаємо форму
      setOpen(false);
      reset();
      // Оновлюємо список працівників (Invalidate queries)
      // *Примітка: перевірте ключ запиту у вашому DevTools, зазвичай openapi-react-query генерує ключі автоматично
      queryClient.invalidateQueries({ queryKey: ["get", "/employees"] });
    },
    onError: (error) => {
      console.error("Помилка при створенні:", error);
      alert("Не вдалося створити працівника");
    },
  });

  // 4. Відкриття/Закриття
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset(); // Скидаємо форму при закритті
  };

  // 5. Логіка відправки (Submit)
  const onSubmit: SubmitHandler<EmployeeFormInputs> = (data) => {
    // 1. Формуємо JSON
    const employeeData = {
      first_name: data.first_name,
      last_name: data.last_name,
      position: data.position,
      email: data.email,
      phone_number: data.phone_number,
      workplace_id: Number(data.workplace_id),
    };

    const fileToUpload = data.file?.[0];

    if (!fileToUpload) {
      alert("Будь ласка, оберіть файл!");
      return;
    }

    // 2. СТВОРЮЄМО FormData ВРУЧНУ
    const formData = new FormData();
    formData.append("file", fileToUpload); // Кладемо реальний файл
    formData.append("data", JSON.stringify(employeeData)); // Кладемо JSON рядок

    // 3. Відправляємо
    newEmployee.mutate({
      // body — це просто назва параметра в бібліотеці.
      // Ми кладемо туди наш formData.
      // Використовуємо 'as any', щоб TypeScript не сварився,
      // бо він чекає об'єкт { file: string... }, а ми даємо FormData.
      body: formData as any,
    });
  };

  return (
    <div className="container-base p-6">
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Список працівників</h1>

        {/* Кнопка замість Link */}
        <Button
          className="!mt-6"
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ textTransform: "none", borderRadius: 2 }}
          startIcon={
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
          }
        >
          Додати працівника
        </Button>
      </div>

      {/* --- Список карток --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {employees.data?.map((employee) => (
          <UserCard key={employee.id} user={employee} />
        ))}
      </div>

      {/* --- Модальне вікно (Dialog) --- */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Додати нового працівника
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ color: (theme) => theme.palette.grey[500] }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Ім'я"
                  fullWidth
                  {...register("first_name", { required: "Обов'язкове поле" })}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
                <TextField
                  label="Прізвище"
                  fullWidth
                  {...register("last_name", { required: "Обов'язкове поле" })}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                />
              </div>

              <TextField
                label="Посада"
                fullWidth
                {...register("position", { required: true })}
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                {...register("email", { required: true })}
              />

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Телефон"
                  fullWidth
                  defaultValue="+380"
                  {...register("phone_number", { required: true })}
                />
                <TextField
                  label="Workplace ID"
                  type="number"
                  fullWidth
                  {...register("workplace_id", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>

              {/* Кнопка завантаження файлу */}
              <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center">
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 1 }}
                >
                  Завантажити фото
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    {...register("file", { required: "Фото обов'язкове" })}
                  />
                </Button>
                {selectedFile && selectedFile.length > 0 && (
                  <Typography variant="body2" color="textSecondary">
                    Обрано: {selectedFile[0].name}
                  </Typography>
                )}
                {errors.file && (
                  <Typography variant="caption" color="error" display="block">
                    {errors.file.message}
                  </Typography>
                )}
              </div>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} color="inherit">
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={newEmployee.isPending}
            >
              {newEmployee.isPending ? "Збереження..." : "Зберегти"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export const Component = Home;
