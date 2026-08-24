import { z } from "zod";

import { UserStatus } from "@/lib/constants";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/password";

const trimmed = z.string().trim();

export const passwordSchema = trimmed
  .min(1, "Vui lòng nhập mật khẩu")
  .min(PASSWORD_MIN_LENGTH, `Tối thiểu ${PASSWORD_MIN_LENGTH} ký tự`)
  .refine((value) => /[A-Za-z]/.test(value) && /\d/.test(value), "Mật khẩu phải gồm chữ và số");

const optionalText = (max: number) =>
  trimmed.min(1).max(max).optional().or(z.literal("").transform(() => undefined));

const positiveInt = z.coerce.number().int().positive();

const recordStatusSchema = z.coerce
  .number()
  .int()
  .refine((value) => value === UserStatus.Active || value === UserStatus.Inactive);

export const createUserSchema = z.object({
  username: trimmed.min(1, "Thiếu tên đăng nhập").max(64),
  password: passwordSchema,
  full_name: trimmed.min(1, "Thiếu họ và tên").max(255),
  phone: optionalText(32),
  address: optionalText(500),
  email: trimmed.email("Email không hợp lệ").max(255).optional().or(z.literal("").transform(() => undefined)),
  status: recordStatusSchema.optional(),
  role_id: positiveInt.optional(),
  department_id: positiveInt.optional(),
});

export const updateUserSchema = z
  .object({
    id: positiveInt,
    full_name: trimmed.min(1).max(255).optional(),
    phone: optionalText(32),
    address: optionalText(500),
    email: trimmed.email("Email không hợp lệ").max(255).optional().or(z.literal("").transform(() => undefined)),
    status: recordStatusSchema.optional(),
    department_id: positiveInt.optional(),
  })
  .refine(
    (value) =>
      value.full_name !== undefined ||
      value.phone !== undefined ||
      value.address !== undefined ||
      value.email !== undefined ||
      value.status !== undefined ||
      value.department_id !== undefined,
    "Không có dữ liệu cập nhật",
  );

export const changePasswordSchema = z
  .object({
    current_password: trimmed.min(1, "Vui lòng nhập mật khẩu hiện tại"),
    new_password: passwordSchema,
  })
  .refine((value) => value.new_password !== value.current_password, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại",
    path: ["new_password"],
  });

export const createDepartmentSchema = z.object({
  code: trimmed.min(1, "Thiếu mã phòng ban").max(32),
  name: trimmed.min(1, "Thiếu tên phòng ban").max(255),
  status: recordStatusSchema.optional(),
});

export const updateDepartmentSchema = z
  .object({
    id: positiveInt,
    code: trimmed.min(1).max(32).optional(),
    name: trimmed.min(1).max(255).optional(),
    status: recordStatusSchema.optional(),
  })
  .refine(
    (value) => value.code !== undefined || value.name !== undefined || value.status !== undefined,
    "Không có dữ liệu cập nhật",
  );

export const createRoleSchema = z.object({
  code: trimmed.min(1, "Thiếu mã vai trò").max(64),
  name: trimmed.min(1, "Thiếu tên vai trò").max(255),
  description: optionalText(500),
  allowed_scope_types: z.array(trimmed.min(1).max(64)).min(1, "Chọn ít nhất một phạm vi").max(50),
});

export const updateRoleSchema = z.object({
  id: positiveInt,
  name: trimmed.min(1, "Thiếu tên nhóm quyền").max(255),
  description: optionalText(500),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
