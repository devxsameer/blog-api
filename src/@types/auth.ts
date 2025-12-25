import { Role } from "@/constants/roles.js";

// src/types/auth.ts
export interface AuthUser {
  id: string;
  role: Role;
}
