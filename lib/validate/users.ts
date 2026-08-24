import { z } from "zod";

import { PASSWORD_MIN_LENGTH } from "@/lib/auth/password";

import { optionalEmail, optionalString, positiveInt, recordStatusSchema, trimmed } from "./shared";

const passwordSchema = trimmed
  .min(1, "Vui lòng nhập mật khẩu")
  .min(PASSWORD_MIN_LENGTH, `Tối thiểu ${PASSWORD_MIN_LENGTH} ký tự`)
  .refine((value) => /[A-Za-z]/.test(value) && /\d/.test(value), "Mật khẩu phải gồm chữ và số");

export const createUserSchema = z.object({
  username: trimmed.min(1, "Thiếu tên đăng nhập").max(64),
  password: passwordSchema,
  full_name: trimmed.min(1, "Thiếu họ và tên").max(255),
  phone: optionalString(32),
  address: optionalString(500),
  email: optionalEmail(),
  status: recordStatusSchema.optional(),
  role_id: positiveInt.optional(),
  department_id: positiveInt.optional(),
});

export const updateUserSchema = z.object({
  id: positiveInt,
  full_name: trimmed.min(1).max(255).optional(),
  phone: optionalString(32),
  address: optionalString(500),
  email: optionalEmail(),
  status: recordStatusSchema.optional(),
  department_id: positiveInt.optional(),
});

export const changePasswordSchema = z
  .object({
    current_password: trimmed.min(1, "Vui lòng nhập mật khẩu hiện tại"),
    new_password: passwordSchema,
  })
  .refine((value) => value.new_password !== value.current_password, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại",
    path: ["new_password"],
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
