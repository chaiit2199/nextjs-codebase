import { z } from "zod";

import { positiveInt, recordStatusSchema, trimmed } from "./shared";

export const createDepartmentSchema = z.object({
  code: trimmed.min(1, "Thiếu mã phòng ban").max(32),
  name: trimmed.min(1, "Thiếu tên phòng ban").max(255),
  status: recordStatusSchema.optional(),
});

export const updateDepartmentSchema = z.object({
  id: positiveInt,
  code: trimmed.min(1).max(32).optional(),
  name: trimmed.min(1).max(255).optional(),
  status: recordStatusSchema.optional(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
