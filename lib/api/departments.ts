"use server";

import { revalidatePath } from "next/cache";

import {
  createDepartmentSchema,
  departmentIdSchema,
  updateDepartmentSchema,
  type CreateDepartmentInput,
  type UpdateDepartmentInput,
} from "@/lib/validate/departments";
import { runServerAction } from "@/lib/server-actions";
import { client } from "@/lib/http/client";
import type { DepartmentsResponse } from "@/lib/api/types";

export type FilterDepartmentsParams = {
  search?: string;
  status?: number | "ALL";
  page?: number;
  page_size?: number;
};

export type { CreateDepartmentInput, UpdateDepartmentInput };

export async function createDepartment(payload: CreateDepartmentInput) {
  return runServerAction(createDepartmentSchema, payload, "Không thể tạo phòng ban", async (input) => {
    console.log(input);
    await client.post("/api/v1/departments", input);
    revalidatePath("/department");
    return { ok: true as const };
  });
}

export async function updateDepartment(payload: UpdateDepartmentInput) {
  return runServerAction(updateDepartmentSchema, payload, "Không thể cập nhật phòng ban", async (input) => {
    const { id, ...body } = input;
    console.log(body);
    await client.patch(`/api/v1/departments/${id}`, body);
    revalidatePath("/department");
    return { ok: true as const };
  });
}

export async function approveDepartment(payload: { id: number }) {
  return runServerAction(departmentIdSchema, payload, "Không thể duyệt phòng ban", async ({ id }) => {
    await client.post(`/api/v1/departments/${id}/approve`);
    revalidatePath("/department");
    return { ok: true as const };
  });
}

export async function rejectDepartment(payload: { id: number }) {
  return runServerAction(departmentIdSchema, payload, "Không thể từ chối phòng ban", async ({ id }) => {
    await client.post(`/api/v1/departments/${id}/reject`);
    revalidatePath("/department");
    return { ok: true as const };
  });
}

export async function filterDepartments(params: FilterDepartmentsParams = {}) {
  
  const response = await client.get<DepartmentsResponse>("/api/v1/departments", { params });
  return { ok: true as const, data: response.data, meta: response.meta };
}
