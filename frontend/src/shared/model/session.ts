import { publicFetchClient } from "@shared/api/instance";

const TOKEN_KEY = "access_token";

let refreshTokenPromise: Promise<string | null> | null = null;

export const logout = () => {
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });
};

export const refreshToken = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const exp = localStorage.getItem("access_token_exp");

  if (!token || !exp) {
    return null;
  }

  if (Number(exp) < Date.now() / 1000) {
    if (!refreshTokenPromise) {
      refreshTokenPromise = publicFetchClient
        .POST("/auth/token/", {
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: {
            client_id: import.meta.env.VITE_BACKEND_CLIENT_ID,
            grant_type: "refresh_token",
          },
        })
        .then((res) => {
          if (res.data?.access_token && res.data?.expires_in) {
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem(
              "access_token_exp",
              String(Date.now() / 1000 + res.data.expires_in),
            );
            return res.data.access_token;
          } else {
            logout();
            return null;
          }
        })
        .finally(() => {
          refreshTokenPromise = null;
        });
    }

    const newToken = await refreshTokenPromise;

    if (newToken) {
      return newToken;
    } else {
      return null;
    }
  }

  return token;
};
