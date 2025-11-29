
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  onboarded: boolean;
  heardAboutUs: string;
  interestIn: string[];
  lastWorkspaceId: string;
}

interface AuthResponse {
  user: User;
  account: {
    id: string;
    provider: string;
    providerAccountId: string;
    userId: string;
    user: User;
    access_token: string;
    access_token_expires_at: number;
    refresh_token: string;
    refresh_token_expires_at: number;
  };
  nextStep: string;
  accessToken: string;
  refreshToken: string;
  accessExpires: number;
  refreshExpires: number;
}

export class AuthService {
  private readonly BASE_URL = import.meta.env.VITE_BACKEND_API;
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly ACCESS_EXPIRES_KEY = 'access_expires';
  private readonly REFRESH_EXPIRES_KEY = 'refresh_expires';

  constructor() {
    this.checkAndClearExpiredTokens();
  }

  private checkAndClearExpiredTokens(): void {
    const accessExpires = localStorage.getItem(this.ACCESS_EXPIRES_KEY);
    const refreshExpires = localStorage.getItem(this.REFRESH_EXPIRES_KEY);
    const now = Date.now() / 1000;

    if (accessExpires && parseFloat(accessExpires) < now) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.ACCESS_EXPIRES_KEY);
    }

    if (refreshExpires && parseFloat(refreshExpires) < now) {
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_EXPIRES_KEY);
    }
  }

  private isTokenExpired(): boolean {
    const accessExpires = localStorage.getItem(this.ACCESS_EXPIRES_KEY);
    if (!accessExpires) return true;
    
    const now = Date.now() / 1000;
    return parseFloat(accessExpires) < now;
  }

  private getAccessToken(): string | null {
    if (this.isTokenExpired()) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.ACCESS_EXPIRES_KEY);
      return null;
    }
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public signIn(): void {
    window.location.href = `${this.BASE_URL}/auth/google`;
  }

  public signInWithRedirect(redirectUrl: string): void {
    const encodedRedirect = encodeURIComponent(redirectUrl);
    window.location.href = `${this.BASE_URL}auth/google?redirect_uri=${encodedRedirect}`;
  }

  public async handleAuthCallback(): Promise<AuthResponse> {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');
    const accessExpires = urlParams.get('accessExpires');
    const refreshExpires = urlParams.get('refreshExpires');

    if (!accessToken || !refreshToken) {
      throw new Error('Missing tokens in callback');
    }

    const authData: AuthResponse = {
      user: JSON.parse(urlParams.get('user') || '{}'),
      account: JSON.parse(urlParams.get('account') || '{}'),
      nextStep: urlParams.get('nextStep') || 'unknown',
      accessToken,
      refreshToken,
      accessExpires: parseFloat(accessExpires || '0'),
      refreshExpires: parseFloat(refreshExpires || '0'),
    };

    this.storeTokens(authData);
    return authData;
  }

  private storeTokens(authData: AuthResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, authData.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authData.refreshToken);
    localStorage.setItem(this.ACCESS_EXPIRES_KEY, authData.accessExpires.toString());
    localStorage.setItem(this.REFRESH_EXPIRES_KEY, authData.refreshExpires.toString());
  }

  public async authorizeUser(): Promise<User | null> {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error('Failed to authorize user');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Authorization error:', error);
      this.logout();
      return null;
    }
  }

  public logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.ACCESS_EXPIRES_KEY);
    localStorage.removeItem(this.REFRESH_EXPIRES_KEY);
    window.location.href = '/auth';
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
