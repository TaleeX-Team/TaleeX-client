import Cookies from "js-cookie";

const TokenService = {
    // Token storage and retrieval methods
    getAccessToken: () => {
        // First check localStorage
        const localToken = localStorage.getItem('accessToken');
        if (localToken) return localToken;

        // Then check cookie for OAuth flow
        const cookieToken = Cookies.get('accessToken');
        if (cookieToken) return cookieToken;

        return null;
    },

    setAccessToken: (token) => {
        if (token) {
            localStorage.setItem('accessToken', token);
            // For OAuth users, also set in cookie with appropriate options
            if (TokenService.isOAuthAuthenticated()) {
                Cookies.set('accessToken', token, { secure: true, sameSite: 'strict' });
            }
        } else {
            localStorage.removeItem('accessToken');
            Cookies.remove('accessToken');
        }
    },

    getRefreshToken: () => {
        // First check localStorage
        const localToken = localStorage.getItem('refreshToken');
        if (localToken) return localToken;

        // Then check cookie for OAuth flow
        const cookieToken = Cookies.get('refreshToken');
        if (cookieToken) return cookieToken;

        return null;
    },

    setRefreshToken: (token) => {
        if (token) {
            localStorage.setItem('refreshToken', token);
            // For OAuth users, also set in cookie with appropriate options
            if (TokenService.isOAuthAuthenticated()) {
                Cookies.set('refreshToken', token, { secure: true, sameSite: 'strict' });
            }
        } else {
            localStorage.removeItem('refreshToken');
            Cookies.remove('refreshToken');
        }
    },

    clearTokens: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('hasPassword');
    },

    // OAuth specific methods
    isOAuthAuthenticated: () => {
        return localStorage.getItem('isOAuth') === 'true';
    },

    setOAuthAuthenticated: (isOAuth) => {
        if (isOAuth) {
            localStorage.setItem('isOAuth', 'true');
        } else {
            localStorage.removeItem('isOAuth');
        }
    },

    // Check if authenticated with either method
    isAuthenticated: () => {
        // Check for tokens via any storage method
        return !!TokenService.getAccessToken();
    },

    // Process tokens from OAuth callback
    processOAuthTokens: () => {
        // Check if tokens are available in cookies after OAuth redirect
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        if (accessToken) {
            TokenService.setAccessToken(accessToken);
            TokenService.setOAuthAuthenticated(true);

            if (refreshToken) {
                TokenService.setRefreshToken(refreshToken);
            }

            return true;
        }

        return false;
    }
};

export default TokenService;