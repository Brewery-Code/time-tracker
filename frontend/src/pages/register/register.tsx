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
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { publicRqClient } from "@shared/api/instance";
import type { ApiSchemas } from "@shared/api/schema";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@shared/model/routes";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function RegisterPage() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const registerMutation = publicRqClient.useMutation(
    "post",
    "/users/register",
    {
      onSuccess() {
        navigate(ROUTES.HOME);
      },
    },
  );

  const onSubmit: SubmitHandler<RegisterForm> = (data) => {
    const apiData: ApiSchemas["UserCreateSchema"] = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password1: data.password,
      password2: data.confirmPassword,
    };

    registerMutation.mutate({ body: apiData });
  };

  return (
    <Container maxWidth="xs" className="container-base">
      <CssBaseline />
      <Box className="mt-8 bg-white flex flex-col items-center p-6 shadow-xl rounded-lg">
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Створити акаунт
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid width="100%">
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "Ім'я є обов'язковим" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Ім'я"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>

            <Grid width="100%">
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Прізвище є обов'язковим" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Прізвище"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            <Grid width="100%">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email є обов'язковим",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Некоректний email",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Email адреса"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid width="100%">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Пароль є обов'язковим",
                  minLength: {
                    value: 6,
                    message: "Пароль має містити щонайменше 6 символів",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    type="password"
                    label="Пароль"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>

            <Grid width="100%">
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Підтвердіть пароль",
                  validate: (value) =>
                    value === passwordValue || "Паролі не співпадають",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    type="password"
                    label="Підтвердіть пароль"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Зареєструватися
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid>
              <Link href="/login" variant="body2">
                Вже маєте акаунт? Увійти
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export const Component = RegisterPage;
