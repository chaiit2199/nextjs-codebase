"use client";

import { useState, type FormEvent } from "react";

import type { Department, User } from "@/lib/api/me";
import { UserAvatar } from "@/components/user-components";
import { Icon } from "@/components/icon";
import { UserStatus, userStatusMeta } from "@/lib/constants";
import { FormSubmitButton } from "@/components/form-submit-button";
import { RequiredLabel, SelectField } from "@/components/form-fields";
import { Input, Modal } from "@/components/core_component";
import { updateUser } from "@/lib/api/users";
import { putFlash } from "@/lib/flash/flash";

type UpdateUserEntity = {
    full_name?: string;
    phone?: string;
    email?: string;
    status?: number;
    department_id?: number;
    address?: string;
};

function readUpdateForm(data: FormData): UpdateUserEntity {
    const formValues: UpdateUserEntity = {};
    const text = (name: string) => String(data.get(name) ?? "").trim();

    const fullName = text("full_name");
    const phone = text("phone");
    const email = text("email");
    const address = text("address");
    const status = Number(data.get("status"));
    const departmentId = Number(data.get("department_id"));

    if (fullName) formValues.full_name = fullName;
    if (phone) formValues.phone = phone;
    if (email) formValues.email = email;
    if (address) formValues.address = address;
    if (Number.isFinite(status)) formValues.status = status;
    if (Number.isFinite(departmentId) && departmentId > 0) formValues.department_id = departmentId;

    return formValues;
}

export function UsersComponent({ users, departments }: { users: User[]; departments: Department[]}) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [payload, setPayload] = useState<UpdateUserEntity | null>(null);

    function openEditForm(user: User) {
        setSelectedUser(user);
        setPayload(null);
        setIsConfirmOpen(false);
        setIsFormOpen(true);
    }

    function resetForm() {
        setPayload(null);
        setIsConfirmOpen(false);
        setIsFormOpen(false);
        setSelectedUser(null);
    }

    function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPayload(readUpdateForm(new FormData(event.currentTarget)));
        setIsConfirmOpen(true);
    }

    async function confirmUpdate() {
        if (!payload || !selectedUser?.id) return;

        const result = await updateUser({
            id: Number(selectedUser.id),
            ...payload,
        });

        if (!result.ok) {
            setIsConfirmOpen(false);
            putFlash("error", result.message, 2000);
            return;
        }

        resetForm();
        putFlash("success", "Cập nhật nhân viên thành công", 2000);
    }

    return (
        <>
        <section className="admin-section" id="admin-users-section">
            <div className="admin-table-card mb-6">
                <div className="overview-table-wrap">
                    <table className="overview-table" id="users-table">
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Tên đăng nhập</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Phòng ban</th>
                                <th>Trạng thái</th>
                                <th className="actions" />
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} id={`user-row-${user.id}`}>
                                    <td>
                                    <div className="admin-user">
                                        <UserAvatar fullname={user.full_name} />
                                        <p className="admin-user__name">{user.full_name}</p>
                                    </div>
                                    </td>
                                    <td className="overview-table__muted">{user.username}</td>
                                    <td className="overview-table__muted">{user.phone}</td>
                                    <td className="overview-table__muted">{user.address}</td>
                                    <td className="overview-table__muted">{user.department?.name ?? "—"}</td>
                                    <td>
                                        <UserStatusBadge status={user.status} />
                                    </td>
                                    <td className="actions">
                                        <div className="admin-actions">
                                            <button
                                            type="button"
                                            className="admin-actions__btn"
                                            aria-label="Chỉnh sửa"
                                            onClick={() => openEditForm(user)}
                                            >
                                            <Icon name="hero-pencil-square" className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

            <Modal
                id="update-user-modal"
                show={isFormOpen && selectedUser !== null}
                title="Chi tiết nhân viên"
                closeable={isConfirmOpen ? false : "close_button"}
                width="lg"
                onClose={resetForm}
            >
                {selectedUser && (
                <form
                    key={selectedUser.id}
                    id="update-user-form"
                    className="core_modal__form overflow-hidden"
                    autoComplete="off"
                    onSubmit={handleFormSubmit}
                >
                    <div className="admin-user-form gap-4 overflow-y-auto flex-auto h-full">
                    <Input
                        id="update-user-username"
                        name="username"
                        label={<RequiredLabel>Tên đăng nhập</RequiredLabel>}
                        defaultValue={selectedUser.username}
                        readOnly
                    />
                    <Input
                        id="update-user-full-name"
                        name="full_name"
                        label={<RequiredLabel>Họ và tên</RequiredLabel>}
                        defaultValue={selectedUser.full_name}
                    />
                    <Input
                        id="update-user-phone"
                        name="phone"
                        label={<RequiredLabel>Số điện thoại</RequiredLabel>}
                        defaultValue={selectedUser.phone}
                    />
                    <Input
                        id="update-user-email"
                        name="email"
                        type="email"
                        label={<RequiredLabel>Email</RequiredLabel>}
                        placeholder="Email"
                        defaultValue={selectedUser.email ?? ""}
                    />
                    <SelectField
                        id="update-user-status"
                        name="status"
                        label={<RequiredLabel>Trạng thái</RequiredLabel>}
                        defaultValue={String(selectedUser.status ?? UserStatus.Active)}
                    >
                        <option value={UserStatus.Active}>{userStatusMeta(UserStatus.Active).label}</option>
                        <option value={UserStatus.Inactive}>{userStatusMeta(UserStatus.Inactive).label}</option>
                    </SelectField>
                    <SelectField
                        id="update-user-department"
                        name="department_id"
                        label={<RequiredLabel>Phòng ban</RequiredLabel>}
                        defaultValue={departmentOptionValue(selectedUser.department)}
                    >
                        <option value="" disabled>
                        Chọn phòng ban
                        </option>
                        {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                        ))}
                    </SelectField>
                    <div className="admin-user-form__full">
                        <Input
                        id="update-user-address"
                        name="address"
                        label={<RequiredLabel>Địa chỉ</RequiredLabel>}
                        placeholder="Địa chỉ"
                        defaultValue={selectedUser.address ?? ""}
                        />
                    </div>
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
                id="update-user-confirm-modal"
                show={isConfirmOpen}
                title="Xác nhận cập nhật nhân viên"
                closeable="close_button"
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

function departmentOptionValue(department: User["department"]) {
    return department?.id != null ? String(department.id) : "";
}

function UserStatusBadge({ status }: { status?: number }) {
    const meta = userStatusMeta(status);

    return (
        <span className={`admin-status admin-status--${meta.kind}`}>
        {meta.label}
        </span>
    );
}
