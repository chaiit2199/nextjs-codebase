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
    department?: string | null;
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