import { cache } from "react";

import { client, HttpError } from "@/lib/http/client";

export type User = {
    id?: number | string;
    code?: string;
    username: string;
    full_name: string;
    email?: string;
    phone?: string;
    address?: string;
    role?: string | number;
    status?: number;
    department?: Department | null;
};

type CurrentUser = {
    data: {
      user: User;
    };
};

type UsersResponse = {
    data: User[];
    meta?: {
      total: number;
      page: number;
      page_size: number;
      trace_id?: string;
    };
};

export type Department = {
    id: number;
    code: string;
    name: string;
    status: string;
};

type DepartmentsResponse = {
    data: Department[];
    meta?: {
        total: number;
        page: number;
        page_size: number;
        trace_id?: string;
    };
};

export type RoleGrant = {
    permission_id: number;
    permission_code: string;
};

export type Role = {
    id: number;
    code: string;
    name: string;
    status: string;
    version: number;
    description: string;
    is_system: boolean;
    allowed_scope_types: string[];
    grants: RoleGrant[];
    users_count: number;
};

export type ShortRole = Pick<Role, "id" | "name">;

type RolesResponse = {
    data: Role[];
    meta?: {
        trace_id?: string;
    };
};

type ShortRolesResponse = {
    data: ShortRole[];
    meta?: {
        trace_id?: string;
    };
};
  

async function orEmpty<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch (error) {
    if (error instanceof HttpError && error.status === HttpError.Unauthorized) {
      return fallback;
    }

    throw error;
  }
}

export const getCurrentUser = cache(() =>
  orEmpty(async () => (await client.get<CurrentUser>("/api/v1/me")).data.user, null),
);

export const getUsers = cache(() =>
  orEmpty(async () => (await client.get<UsersResponse>("/api/v1/users")).data, []),
);

export const getDepartments = cache(() =>
  orEmpty(async () => (await client.get<DepartmentsResponse>("/api/v1/departments")).data, []),
);

export const getShortRoles = cache(() =>
  orEmpty(async () => (await client.get<ShortRolesResponse>("/api/v1/roles?view=short")).data, []),
);

export const getRoles = cache(() =>
  orEmpty(async () => (await client.get<RolesResponse>("/api/v1/roles")).data, []),
);

