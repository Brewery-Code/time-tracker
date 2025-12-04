import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { CONFIG } from "@shared/model/config";
import type { ApiPaths } from "./schema";

// 1. Спочатку створюємо базовий клієнт
export const fetchClient = createFetchClient<ApiPaths>({
  baseUrl: CONFIG.API_BASE_URL,
  credentials: "include",
});

export const publicFetchClient = createFetchClient<ApiPaths>({
  baseUrl: CONFIG.API_BASE_URL,
  credentials: "include",
});

// 2. ОДРАЗУ додаємо middleware (ДО створення rqClient)
fetchClient.use({
  async onResponse({ request, response }) {
    console.log("Middleware спрацював! Статус:", response.status);

    // Тимчасово ловимо 500, але ОБОВ'ЯЗКОВО виправте бекенд на 401
    if (response.status === 401 || response.status === 500) {
      // Робіть запит на рефреш
      const { error } = await publicFetchClient.POST("/users/token-refresh", {
        credentials: "include",
      });

      // Перевіряємо, чи успішний був саме РЕФРЕШ (error від publicClient), а не старий response
      if (!error) {
        console.log("Токен оновлено, повторюємо запит...");

        // Клонуємо запит
        const retryRequest = request.clone();

        // Повторюємо
        return await fetch(retryRequest);
      } else {
        console.log("Не вдалося оновити токен");
        // Тут можна зробити logout
      }
    }

    return response;
  },
});

// 3. І тільки ТЕПЕР створюємо rqClient
export const rqClient = createClient(fetchClient);
export const publicRqClient = createClient(publicFetchClient);
