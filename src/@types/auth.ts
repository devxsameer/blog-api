// src/types/auth.ts
export type Role = "admin" | "author" | "user";

export interface AuthUser {
  id: string;
  role: Role;
}
