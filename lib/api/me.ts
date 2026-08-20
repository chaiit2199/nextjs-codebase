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
  

export const getCurrentUser = cache(async (): Promise<User | null> => {
    try {
        const payload = await client.get<CurrentUser>("/api/v1/me");
        return payload.data.user;
    } catch (error) {
        if (error instanceof HttpError && error.status === HttpError.Unauthorized) {
        return null;
        }

        throw error;
    }
});

export const getUsers = async (): Promise<User[]> => {
    try {
        const payload = await client.get<UsersResponse>("/api/v1/users");
        return payload.data;
    } catch (error) {
        if (error instanceof HttpError && error.status === HttpError.Unauthorized) {
        return [];
        }

        throw error;
    }
};

export const getDepartments = async (): Promise<Department[]> => {
    try {
        const payload = await client.get<DepartmentsResponse>("/api/v1/departments");
        return payload.data;
    } catch (error) {
        if (error instanceof HttpError && error.status === HttpError.Unauthorized) {
        return [];
        }

        throw error;
    }
};

export const getShortRoles = async (): Promise<ShortRole[]> => {
    try {
        const payload = await client.get<ShortRolesResponse>("/api/v1/roles?view=short");
        return payload.data;
    } catch (error) {
        if (error instanceof HttpError && error.status === HttpError.Unauthorized) {
            return [];
        }

        throw error;
    }
};

export const getRoles = async (): Promise<Role[]> => {
    try {
        const payload = await client.get<RolesResponse>("/api/v1/roles");
        return payload.data;
    } catch (error) {
        if (error instanceof HttpError && error.status === HttpError.Unauthorized) {
            return [];
        }

        throw error;
    }
};

