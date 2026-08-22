import { cache } from "react";

import { client, HttpError } from "@/lib/http/client";
import type {
  CurrentUserResponse,
  DepartmentsResponse,
  RolesResponse,
  ShortRolesResponse,
  User,
  Department,
  Role,
  ShortRole,
  UsersResponse,
} from "@/lib/api/types";

export type {
  User,
  Department,
  Role,
  RoleGrant,
  ShortRole,
} from "@/lib/api/types";

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
  orEmpty(async () => (await client.get<CurrentUserResponse>("/api/v1/me")).data.user, null),
);

export const getUsers = cache(() =>
  orEmpty(async () => (await client.get<UsersResponse>("/api/v1/users")).data, [] as User[]),
);

export const getDepartments = cache(() =>
  orEmpty(async () => (await client.get<DepartmentsResponse>("/api/v1/departments")).data, [] as Department[]),
);

export const getShortRoles = cache(() =>
  orEmpty(async () => (await client.get<ShortRolesResponse>("/api/v1/roles?view=short")).data, [] as ShortRole[]),
);

export const getRoles = cache(() =>
  orEmpty(async () => (await client.get<RolesResponse>("/api/v1/roles")).data, [] as Role[]),
);
