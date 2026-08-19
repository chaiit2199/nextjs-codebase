import { cache } from "react";

import { client, HttpError } from "@/lib/http/client";

export type CurrentUser = {
    id?: number | string;
    code?: string;
    username: string;
    full_name: string;
    email?: string;
    phone?: string;
    address?: string;
    role?: string | number;
    status?: number;
};

type UserResponse = {
    data: {
        user: CurrentUser;
    };
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
    try {
        const payload = await client.get<UserResponse>("/api/v1/me");
        return payload.data.user;
    } catch (error) {
        if (error instanceof HttpError && error.status === HttpError.Unauthorized) {
        return null;
        }

        throw error;
    }
});