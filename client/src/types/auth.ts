export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
};

export type AuthResponse = {
  message: string;
  user: AuthUser;
  token: string;
};