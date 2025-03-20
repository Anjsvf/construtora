import { apiRequest } from './api';

// Types
interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface LoginResponse {
  token: string;
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

// Constants
const TOKEN_KEY = '@ConstrutoraBecker:token';
const USER_KEY = '@ConstrutoraBecker:user';

// Functions
export async function login(email: string, password: string): Promise<User> {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // O backend retorna diretamente os dados do usuário junto com o token
  const userData: User = {
    _id: response._id,
    username: response.username,
    email: response.email,
    isAdmin: response.isAdmin
  };

  // Save token and user to localStorage
  localStorage.setItem(TOKEN_KEY, response.token);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));

  return userData;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function isAdmin(): boolean {
  const user = getUser();
  return !!user && user.isAdmin;
} 