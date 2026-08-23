"use client";

import { useState, type FormEvent } from "react";

import type { Department } from "@/lib/api/me";
import { Icon } from "@/components/icon";
import { Input, Modal } from "@/components/core_component";
import { FormSubmitButton } from "@/components/form-submit-button";
import { RequiredLabel, SelectField } from "@/components/form-fields";
import { LabelStatus, getLabelStatus } from "@/lib/constants";
import { updateDepartment, type UpdateDepartmentInput } from "@/lib/api/departments";
import { putFlash } from "@/lib/flash/flash";

type UpdateDepartmentForm = Pick<UpdateDepartmentInput, "code" | "name" | "status">;

function readUpdateForm(data: FormData): UpdateDepartmentForm {
  const text = (name: string) => String(data.get(name) ?? "").trim();
  const formValues: UpdateDepartmentForm = {};
  const code = text("code");
  const name = text("name");
  const status = text("status");

  if (code) formValues.code = code;
  if (name) formValues.name = name;
  if (status === LabelStatus.Active || status === LabelStatus.Inactive) {
    formValues.status = status;
  }

  return formValues;
}

export function EditDepartmentComponent({ departments }: { departments: Department[] }) {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [payload, setPayload] = useState<UpdateDepartmentForm | null>(null);

  function openEditForm(department: Department) {
    setSelectedDepartment(department);
    setPayload(null);
    setIsConfirmOpen(false);
    setIsFormOpen(true);
  }

  function resetForm() {
    setPayload(null);
    setIsConfirmOpen(false);
    setIsFormOpen(false);
    setSelectedDepartment(null);
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPayload(readUpdateForm(new FormData(event.currentTarget)));
    setIsConfirmOpen(true);
  }

  async function confirmUpdate() {
    if (!payload || !selectedDepartment?.id) return;

    const result = await updateDepartment({
      id: selectedDepartment.id,
      ...payload,
    });

    if (!result.ok) {
      setIsConfirmOpen(false);
      putFlash("error", result.message, 2000);
      return;
    }

    resetForm();
    putFlash("success", "Cập nhật phòng ban thành công", 2000);
  }

  return (
    <>
      <section className="admin-section" id="admin-departments-section">
        <div className="admin-table-card mb-6">
          <div className="overview-table-wrap">
            <table className="overview-table" id="departments-table">
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
                  const meta = getLabelStatus(department.status);

                  return (
                    <tr key={department.id} id={`department-row-${department.id}`} onClick={() => openEditForm(department)} className="cursor-pointer">
                      <td className="overview-table__muted">{department.code}</td>
                      <td>{department.name}</td>
                      <td>
                        <span className={`admin-status admin-status--${meta.kind}`}>{meta.label}</span>
                      </td>
                      <td className="actions bg-transparent">
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="admin-actions__btn"
                            aria-label="Chỉnh sửa"
                          >
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
              />
              <Input
                id="update-department-name"
                name="name"
                label={<RequiredLabel>Tên phòng ban</RequiredLabel>}
                placeholder="Phòng kinh doanh"
                defaultValue={selectedDepartment.name}
              />
              <SelectField
                id="update-department-status"
                name="status"
                label={<RequiredLabel>Trạng thái</RequiredLabel>}
                defaultValue={selectedDepartment.status ?? LabelStatus.Active}
              >
                <option value={LabelStatus.Active}>{getLabelStatus(LabelStatus.Active).label}</option>
                <option value={LabelStatus.Inactive}>{getLabelStatus(LabelStatus.Inactive).label}</option>
              </SelectField>
            </div>
            <div className="core_modal__actions">
              <button type="button" className="core_button core_button--secondary" onClick={resetForm}>
                Hủy
              </button>
              <button type="submit" className="core_button core_button--primary">
                Xác nhận
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        id="update-department-confirm-modal"
        show={isConfirmOpen}
        title="Xác nhận cập nhật phòng ban"
        width="md"
        className="core_modal--stacked"
        onClose={() => setIsConfirmOpen(false)}
      >
        <form className="core_modal__actions" action={confirmUpdate}>
          <button
            type="button"
            className="core_button core_button--secondary"
            onClick={() => setIsConfirmOpen(false)}
          >
            Hủy
          </button>
          <FormSubmitButton>Xác nhận</FormSubmitButton>
        </form>
      </Modal>
    </>
  );
}
