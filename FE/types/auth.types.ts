export interface User {
  username: string;
}

export interface RegisterPayload {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  phoneNumber?: string;
  age?: number;
}

export interface TokenPayload {
  sub: string;
}

export interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}
