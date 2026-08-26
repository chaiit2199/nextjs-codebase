"use client";

import { useEffect, useState, type FormEvent } from "react";

import type { Department } from "@/lib/api/me";
import { Icon } from "@/components/icon";
import { Tab } from "@/components/tab";
import { Input, Modal, EmptyData, Pagination } from "@/components/core_component";
import { FormSubmitButton } from "@/components/form-submit-button";
import { RequiredLabel } from "@/components/form-fields";
import {
  USER_STATUS_TABS,
  UserStatus,
  type UserStatusTabValue,
  readFormStatus,
  recordStatusMeta,
} from "@/lib/constants";
import {
  approveDepartment,
  filterDepartments,
  rejectDepartment,
  updateDepartment,
  type UpdateDepartmentInput,
} from "@/lib/api/departments";
import { putFlash } from "@/lib/flash/flash";

type ConfirmAction = "update" | "approve" | "reject";

const CONFIRM_TITLE: Record<ConfirmAction, string> = {
  update: "Xác nhận cập nhật phòng ban",
  approve: "Xác nhận duyệt phòng ban",
  reject: "Xác nhận từ chối phòng ban",
};

const CONFIRM_SUCCESS: Record<ConfirmAction, string> = {
  update: "Cập nhật phòng ban thành công",
  approve: "Đã duyệt phòng ban",
  reject: "Đã từ chối phòng ban",
};

type UpdateDepartmentForm = Pick<UpdateDepartmentInput, "code" | "name">;

function readUpdateForm(data: FormData): UpdateDepartmentForm {
  const text = (name: string) => String(data.get(name) ?? "").trim();
  const formValues: UpdateDepartmentForm = {};
  const code = text("code");
  const name = text("name");

  if (code) formValues.code = code;
  if (name) formValues.name = name;

  return formValues;
}

export function EditDepartmentComponent({
  search,
  reloadAt: externalReloadAt = 0,
}: {
  search: string;
  reloadAt?: number;
}) {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [payload, setPayload] = useState<UpdateDepartmentForm | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [reloadAt, setReloadAt] = useState(0);
  const [activeTab, setActiveTab] = useState<UserStatusTabValue>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [departments, setDepartments] = useState<Department[]>([]);
  const canEdit = selectedDepartment?.status === UserStatus.Active;
  const isPendingApproval = selectedDepartment?.status === UserStatus.WaitingForApproval;

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    filterDepartments({
      search: search.trim() || undefined,
      status: activeTab === "all" ? "ALL" : Number(activeTab),
      page,
      page_size: pageSize,
    }).then((result) => {
      if (cancelled || !result.ok) return;
      setDepartments(result.data ?? []);
      const total = result.meta?.total ?? result.data?.length ?? 0;
      const size = result.meta?.page_size ?? pageSize;
      setTotalPages(Math.max(1, Math.ceil(total / size)));
    });

    return () => {
      cancelled = true;
    };
  }, [search, activeTab, page, pageSize, reloadAt, externalReloadAt]);

  function openEditForm(department: Department) {
    setSelectedDepartment(department);
    setPayload(null);
    setConfirmAction(null);
    setIsConfirmOpen(false);
    setIsFormOpen(true);
  }

  function resetForm() {
    setPayload(null);
    setConfirmAction(null);
    setIsConfirmOpen(false);
    setIsFormOpen(false);
    setSelectedDepartment(null);
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedDepartment?.status !== UserStatus.Active) return;
    setPayload(readUpdateForm(new FormData(event.currentTarget)));
    setConfirmAction("update");
    setIsConfirmOpen(true);
  }

  function openReviewConfirm(action: "approve" | "reject") {
    if (!selectedDepartment?.id) return;
    setConfirmAction(action);
    setIsConfirmOpen(true);
  }

  async function handleConfirm() {
    const departmentId = Number(selectedDepartment?.id);
    if (!selectedDepartment || !departmentId || !confirmAction) return;

    const result =
      confirmAction === "update"
        ? selectedDepartment.status === UserStatus.Active && payload
          ? await updateDepartment({ id: departmentId, ...payload })
          : null
        : confirmAction === "approve"
          ? await approveDepartment({ id: departmentId })
          : await rejectDepartment({ id: departmentId });

    if (!result?.ok) {
      setIsConfirmOpen(false);
      putFlash("error", result?.message ?? "Không thể cập nhật phòng ban", 1500);
      return;
    }

    resetForm();
    setReloadAt((value) => value + 1);
    putFlash("success", CONFIRM_SUCCESS[confirmAction], 1500);
  }

  return (
    <>
      <section className="admin-section" id="admin-departments-section">
        <div className="admin-table-card mb-6">
          <Tab
            tabs={USER_STATUS_TABS}
            activeTab={activeTab}
            onTabClick={(tab) => {
              setActiveTab(tab.value);
              setPage(1);
            }}
          />

          {departments.length === 0 ? (
            <EmptyData
              title="Không có phòng ban"
              description="Thử đổi bộ lọc hoặc từ khóa tìm kiếm."
            />
          ) : (
            <div className="overview-table-wrap">
              <table className="overview-table" id="departments-table">
                <colgroup>
                  <col style={{ width: "16%" }} />
                  <col />
                  <col style={{ width: "12rem" }} />
                  <col style={{ width: "3rem" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Tên phòng ban</th>
                    <th>Trạng thái</th>
                    <th className="actions" />
                  </tr>
                </thead>
                <tbody>
                  {departments.map((department) => {
                    const meta = recordStatusMeta(department.status);

                    return (
                      <tr
                        key={department.id}
                        id={`department-row-${department.id}`}
                        onClick={() => openEditForm(department)}
                        className="cursor-pointer"
                      >
                        <td className="overview-table__muted">{department.code}</td>
                        <td>{department.name}</td>
                        <td>
                          <span className={`status status--${meta.kind}`}>{meta.label}</span>
                        </td>
                        <td className="actions bg-transparent">
                          <div className="admin-actions">
                            <button type="button" className="admin-actions__btn" aria-label="Chỉnh sửa">
                              <Icon name="hero-pencil-square" className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      </section>

      <Modal
        id="update-department-modal"
        show={isFormOpen && selectedDepartment !== null}
        title="Chi tiết phòng ban"
        closeable={!isConfirmOpen}
        width="lg"
        onClose={resetForm}
      >
        {selectedDepartment && (
          <form
            key={selectedDepartment.id}
            id="update-department-form"
            className="core_modal__form overflow-hidden"
            autoComplete="off"
            onSubmit={handleFormSubmit}
          >
            <div className="admin-user-form gap-4 overflow-y-auto flex-auto h-full">
              <Input
                id="update-department-code"
                name="code"
                label={<RequiredLabel>Mã phòng ban</RequiredLabel>}
                placeholder="SALES"
                defaultValue={selectedDepartment.code}
                readOnly={!canEdit}
              />
              <Input
                id="update-department-name"
                name="name"
                label={<RequiredLabel>Tên phòng ban</RequiredLabel>}
                placeholder="Phòng kinh doanh"
                defaultValue={selectedDepartment.name}
                readOnly={!canEdit}
              />
            </div>
            <div className="core_modal__actions">
              <button type="button" className="core_button core_button--secondary" onClick={resetForm}>
                Hủy
              </button>
              {isPendingApproval && (
                <>
                  <button
                    type="button"
                    className="core_button core_button--danger"
                    onClick={() => openReviewConfirm("reject")}
                  >
                    Từ chối
                  </button>
                  <button
                    type="button"
                    className="core_button core_button--primary"
                    onClick={() => openReviewConfirm("approve")}
                  >
                    Duyệt
                  </button>
                </>
              )}
              {canEdit && (
                <button type="submit" className="core_button core_button--primary">
                  Xác nhận
                </button>
              )}
            </div>
          </form>
        )}
      </Modal>

      <Modal
        id="update-department-confirm-modal"
        show={isConfirmOpen}
        title={confirmAction ? CONFIRM_TITLE[confirmAction] : "Xác nhận"}
        width="md"
        className="core_modal--stacked"
        onClose={() => {
          setIsConfirmOpen(false);
          setConfirmAction(null);
        }}
      >
        <form className="core_modal__actions" action={handleConfirm}>
          <input type="hidden" name="department_id" value={selectedDepartment?.id ?? ""} />
          <input type="hidden" name="action" value={confirmAction ?? ""} />
          <button
            type="button"
            className="core_button core_button--secondary"
            onClick={() => {
              setIsConfirmOpen(false);
              setConfirmAction(null);
            }}
          >
            Hủy
          </button>
          <FormSubmitButton>
            {confirmAction === "reject" ? "Từ chối" : confirmAction === "approve" ? "Duyệt" : "Xác nhận"}
          </FormSubmitButton>
        </form>
      </Modal>
    </>
  );
}
