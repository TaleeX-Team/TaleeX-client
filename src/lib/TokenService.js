// TokenService.js - Place this in your lib directory
const TokenService = {
    getAccessToken: () => {
        return localStorage.getItem('accessToken');
    },

    setAccessToken: (token) => {
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
    },

    getRefreshToken: () => {
        return localStorage.getItem('refreshToken');
    },

    setRefreshToken: (token) => {
        if (token) {
            localStorage.setItem('refreshToken', token);
        } else {
            localStorage.removeItem('refreshToken');
        }
    },

    clearTokens: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    // For OAuth login using cookies
    setOAuthAuthenticated: (isAuthenticated) => {
        console.log(`[TokenService] Setting OAuth authenticated to: ${isAuthenticated}`);
        if (isAuthenticated) {
            localStorage.setItem('oauthAuthenticated', 'true');
            console.log('[TokenService] Value set in localStorage:', localStorage.getItem('oauthAuthenticated'));
        } else {
            localStorage.removeItem('oauthAuthenticated');
            console.log('[TokenService] Value removed from localStorage');
        }
    },

    isOAuthAuthenticated: () => {
        const value = localStorage.getItem('oauthAuthenticated') === 'true';
        console.log(`[TokenService] Checking OAuth authenticated: ${value} (raw value: "${localStorage.getItem('oauthAuthenticated')}")`);
        return value;
    },


    isAuthenticated: () => {
        return !!(TokenService.getAccessToken() || TokenService.isOAuthAuthenticated());
    }
};

export default TokenService;