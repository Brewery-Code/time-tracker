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
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { publicRqClient } from "@shared/api/instance";
import { ROUTES } from "@shared/model/routes";

interface LoginForm {
  email: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = publicRqClient.useMutation("post", "/users/login", {
    onSuccess() {
      navigate(ROUTES.HOME);
    },
    onError(error) {
      if (typeof error.detail === "string") {
        // звичайний рядок
        setError("password", { type: "server", message: error.detail });
      } else if (Array.isArray(error.detail)) {
        // масив помилок від backend
        const firstErrorMsg = error.detail[0]?.msg || "Сталася помилка";
        setError("password", { type: "server", message: firstErrorMsg });
      } else {
        setError("password", { type: "server", message: "Сталася помилка" });
      }
    },
  });

  function onSubmit(data: LoginForm) {
    loginMutation.mutate({ body: data });
  }

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
            <Grid width={"100%"}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "email є обов'язковим",
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
