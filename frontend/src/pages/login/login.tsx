import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// Типізація для об'єкта помилок
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function LoginPage() {
  // Стан для зберігання даних форми
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Стан для зберігання помилок валідації
  const [errors, setErrors] = useState<FormErrors>({});

  // Обробник зміни значень в полях вводу
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Функція валідації
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.firstName) newErrors.firstName = "Ім'я є обов'язковим";
    if (!formData.lastName) newErrors.lastName = "Прізвище є обов'язковим";
    if (!formData.email) {
      newErrors.email = "Email є обов'язковим";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Введіть коректний email";
    }
    if (!formData.password) {
      newErrors.password = "Пароль є обов'язковим";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль має містити щонайменше 6 символів";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Паролі не співпадають";
    }

    return newErrors;
  };

  // Обробник відправки форми
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    // Якщо об'єкт помилок порожній - форма валідна
    if (Object.keys(validationErrors).length === 0) {
      console.log("Дані форми відправлено:", formData);
      // Тут буде логіка відправки даних на сервер
      alert("Реєстрація успішна!");
      // Очищення форми
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <Container maxWidth="xs" className="container-base">
      <CssBaseline />
      {/* Використовуємо Tailwind класи для відступів, тіні та заокруглення */}
      <Box className="mt-8 bg-white flex flex-col items-center p-6 shadow-xl rounded-lg">
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Створити акаунт
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* Поле Email */}
          <Grid container spacing={2}>
            <Grid width={"100%"}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email адреса"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            {/* Поле Пароль */}
            <Grid width={"100%"}>
              <TextField
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            // Використовуємо sx prop від MUI для відступів, але можна і Tailwind
            sx={{ mt: 3, mb: 2 }}
          >
            Зареєструватися
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid>
              <Link href="/register" variant="body2">
                Вже маєте акаунт? Увійти
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export const Component = LoginPage;
