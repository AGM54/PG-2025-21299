import { User } from "firebase/auth";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
}

// Tipos específicos de errores de Firebase Auth
export type FirebaseAuthErrorCode =
  | "auth/email-already-in-use"
  | "auth/weak-password"
  | "auth/invalid-email"
  | "auth/network-request-failed"
  | "auth/user-not-found"
  | "auth/wrong-password"
  | "auth/user-disabled"
  | "auth/too-many-requests"
  | "auth/invalid-credential";
