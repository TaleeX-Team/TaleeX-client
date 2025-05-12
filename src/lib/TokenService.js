import Cookies from "js-cookie";

const TokenService = {
  // Token storage and retrieval methods
  getAccessToken: () => {
    // 1) Check localStorage first
    const localToken = localStorage.getItem("accessToken");
    if (localToken) return localToken;

    // 2) Then cookies (for users who still get them)
    return Cookies.get("accessToken") || null;
  },

  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
      // if it’s an OAuth session, we’ll still mirror it to a cookie
      if (TokenService.isOAuthAuthenticated()) {
        Cookies.set("accessToken", token, {
          secure: true,
          sameSite: "none",
        });
      }
    } else {
      localStorage.removeItem("accessToken");
      Cookies.remove("accessToken");
    }
  },

  getRefreshToken: () => {
    const local = localStorage.getItem("refreshToken");
    if (local) return local;
    return Cookies.get("refreshToken") || null;
  },

  setRefreshToken: (token) => {
    if (token) {
      localStorage.setItem("refreshToken", token);
      if (TokenService.isOAuthAuthenticated()) {
        Cookies.set("refreshToken", token, {
          secure: true,
          sameSite: "none",
        });
      }
    } else {
      localStorage.removeItem("refreshToken");
      Cookies.remove("refreshToken");
    }
  },

  // OAuth flag
  isOAuthAuthenticated: () => localStorage.getItem("isOAuth") === "true",
  setOAuthAuthenticated: (val) => {
    if (val) localStorage.setItem("isOAuth", "true");
    else localStorage.removeItem("isOAuth");
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isOAuth");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("hasPassword");
    Cookies.remove("userId");
  },

  // —— NEW: parse out the OAuth fragment on page load ——
  processOAuthCallback: () => {
    const hash = window.location.hash.slice(1); // remove leading '#'
    if (!hash) return false;

    const params = new URLSearchParams(hash);
    const at = params.get("accessToken");
    const rt = params.get("refreshToken");
    const hp = params.get("hasPassword");
    const uid = params.get("userId");

    if (at) {
      // store tokens
      TokenService.setAccessToken(at);
      TokenService.setOAuthAuthenticated(true);

      if (rt) TokenService.setRefreshToken(rt);

      // optional user info
      if (hp !== null) localStorage.setItem("hasPassword", hp);

      if (uid) localStorage.setItem("userId", uid);

      // clear the URL fragment so tokens aren’t visible
      window.history.replaceState(null, "", window.location.pathname);

      return true;
    }
    return false;
  },

  isAuthenticated: () => !!TokenService.getAccessToken(),
};

export default TokenService;
