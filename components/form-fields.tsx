import type { ReactNode } from "react";

export function RequiredLabel({ children }: { children: string }) {
  return (
    <>
      {children} <span className="core_label__required">*</span>
    </>
  );
}

export function SelectField({
  id,
  name,
  label,
  defaultValue,
  required,
  children,
}: {
  id: string;
  name: string;
  label: ReactNode;
  defaultValue?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="core_field">
      <label htmlFor={id} className="core_label">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="core_input core_input--select w-full"
      >
        {children}
      </select>
    </div>
  );
}
