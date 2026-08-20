"use client";

import { useState, type FormEvent } from "react";

import { Input, Modal } from "@/components/core_component";
import { RequiredLabel, SelectField } from "@/components/users/user-form";
import { LabelStatus, getLabelStatus } from "@/lib/constants";
import { createDepartment, type CreateDepartmentInput } from "@/lib/api/departments";
import { putFlash } from "@/lib/flash/flash";

function readCreateForm(data: FormData): CreateDepartmentInput | null {
  const text = (name: string) => String(data.get(name) ?? "").trim();
  const code = text("code");
  const name = text("name");
  const status = text("status");

  if (!code || !name) return null;

  const formValues: CreateDepartmentInput = { code, name };
  if (status) formValues.status = status;
  return formValues;
}

export function CreateDepartmentComponent({ onClose }: { onClose: () => void }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [payload, setPayload] = useState<CreateDepartmentInput | null>(null);

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formValues = readCreateForm(new FormData(event.currentTarget));
    if (!formValues) return;

    setPayload(formValues);
    setIsConfirmOpen(true);
  }

  async function confirmCreate() {
    if (!payload) return;

    const result = await createDepartment(payload);

    if (!result.ok) {
      setIsConfirmOpen(false);
      putFlash("error", result.message, 2000);
      return;
    }

    onClose();
    putFlash("success", "Thêm phòng ban thành công", 2000);
  }

  return (
    <>
      <Modal
        id="create-department-modal"
        show
        title="Thêm phòng ban"
        closeable={isConfirmOpen ? false : "close_button"}
        width="md"
        onClose={onClose}
      >
        <form
          id="create-department-form"
          className="core_modal__form overflow-hidden"
          autoComplete="off"
          onSubmit={handleFormSubmit}
        >
          <div className="admin-user-form gap-4 overflow-y-auto flex-auto h-full">
            <Input
              id="create-department-code"
              name="code"
              label={<RequiredLabel>Mã phòng ban</RequiredLabel>}
              placeholder="SALES"
              required
            />
            <Input
              id="create-department-name"
              name="name"
              label={<RequiredLabel>Tên phòng ban</RequiredLabel>}
              placeholder="Phòng kinh doanh"
              required
            />
            <SelectField
              id="create-department-status"
              name="status"
              label={<RequiredLabel>Trạng thái</RequiredLabel>}
              defaultValue={LabelStatus.Active}
            >
              <option value={LabelStatus.Active}>{getLabelStatus(LabelStatus.Active).label}</option>
              <option value={LabelStatus.Inactive}>{getLabelStatus(LabelStatus.Inactive).label}</option>
            </SelectField>
          </div>
          <div className="core_modal__actions">
            <button type="button" className="core_button core_button--secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="core_button core_button--primary">
              Xác nhận
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        id="create-department-confirm-modal"
        show={isConfirmOpen}
        title="Xác nhận thêm phòng ban"
        closeable="close_button"
        width="md"
        className="core_modal--stacked"
        onClose={() => setIsConfirmOpen(false)}
      >
        <div className="core_modal__actions">
          <button
            type="button"
            className="core_button core_button--secondary"
            onClick={() => setIsConfirmOpen(false)}
          >
            Hủy
          </button>
          <button type="button" className="core_button core_button--primary" onClick={confirmCreate}>
            Xác nhận
          </button>
        </div>
      </Modal>
    </>
  );
}
