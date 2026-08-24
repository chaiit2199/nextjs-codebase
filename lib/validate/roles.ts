import { z } from "zod";

import { optionalString, positiveInt, trimmed } from "./shared";

export const createRoleSchema = z.object({
  code: trimmed.min(1, "Thiếu mã vai trò").max(64),
  name: trimmed.min(1, "Thiếu tên vai trò").max(255),
  description: optionalString(500),
  allowed_scope_types: z.array(trimmed.min(1).max(64)).min(1, "Chọn ít nhất một phạm vi").max(50),
});

export const updateRoleSchema = z.object({
  id: positiveInt,
  name: trimmed.min(1, "Thiếu tên nhóm quyền").max(255),
  description: optionalString(500),
  remove: z.array(positiveInt),
  upsert: z.array(z.object({ permission_id: positiveInt })),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
