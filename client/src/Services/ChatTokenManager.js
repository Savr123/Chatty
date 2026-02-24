// Use sessionStorage for main token + localStorage for cross-tab sync
class ChatTokenManager {
    constructor() {
      this.TOKEN_KEY = 'chat_token';
      this.SYNC_KEY = 'chat_token_sync';
    }

    // Store token in sessionStorage (per-tab security)
    setToken(token) {
      sessionStorage.setItem(this.TOKEN_KEY, token);

      // Sync across tabs using localStorage as messenger
      localStorage.setItem(this.SYNC_KEY, JSON.stringify({
        token: token,
        timestamp: Date.now()
      }));
    }

    getToken() {
      // Try sessionStorage first (most secure)
      let token = sessionStorage.getItem(this.TOKEN_KEY);

      if (!token || token == "undefined") {
        // Check if another tab has the token
        const syncData = localStorage.getItem(this.SYNC_KEY);
        if (syncData) {
          const { token: syncedToken, timestamp } = JSON.parse(syncData);
          // Only use if recent (within 5 seconds)
          if (Date.now() - timestamp < 5000) {
            token = syncedToken;
            sessionStorage.setItem(this.TOKEN_KEY, token);
          }
        }
      }

      return token;
    }

    clear() {
      sessionStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.SYNC_KEY);
      // Notify other tabs to clear
      localStorage.setItem('chat_logout', Date.now());
    }

    // Listen for cross-tab events
    setupCrossTabListeners() {
      window.addEventListener('storage', (event) => {
        if (event.key === this.SYNC_KEY && event.newValue) {
          // Another tab updated the token
          const { token } = JSON.parse(event.newValue);
          if (token && token !== sessionStorage.getItem(this.TOKEN_KEY)) {
            sessionStorage.setItem(this.TOKEN_KEY, token);
            this.onTokenRefreshed?.(token);
          }
        }

        if (event.key === 'chat_logout') {
          // Logout from all tabs
          this.clear();
          window.location.href = '/login';
        }
      });
    }
}

const chatTokenManager = new ChatTokenManager();

export default chatTokenManager;