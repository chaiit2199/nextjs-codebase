export type ApiListMeta = {
  total?: number;
  page?: number;
  page_size?: number;
  trace_id?: string;
};

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

export type Department = {
  id: number;
  code: string;
  name: string;
  status?: number;
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

export type CurrentUserResponse = {
  data: {
    user: User;
  };
};

export type UsersResponse = {
  data: User[];
  meta?: ApiListMeta;
};

export type DepartmentsResponse = {
  data: Department[];
  meta?: ApiListMeta;
};

export type RolesResponse = {
  data: Role[];
  meta?: ApiListMeta;
};

export type ShortRolesResponse = {
  data: ShortRole[];
  meta?: ApiListMeta;
};

export type ScopeTypesResponse = {
  data: ScopeType[];
  meta?: ApiListMeta;
};

export type Permission = {
  id: number;
  code: string;
  module_code: string;
  module_name: string;
  function_name: string;
};

export type PermissionsResponse = {
  data: {
    permissions: Permission[];
    role: {
      code: string;
      id: number;
      name: string;
      status: number;
      version: number;
      is_system: boolean;
      allowed_scope_types: string[];
    };
  };
  meta?: ApiListMeta;
};

export type ScopeType = {
  code: string;
  name: string;
  description: string;
  requires_targets: boolean;
  target_resource: string | null;
};