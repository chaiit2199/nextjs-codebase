"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Icon } from "@/components/icon";

export type ModalCloseable = true | false | "close_button";
export type ModalWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type ModalHeight = "base" | "full";

export type ModalAction = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  color?: "primary" | "secondary" | "danger";
};

export type ModalProps = {
  id?: string;
  show?: boolean;
  icon?: React.ReactNode;
  onClose?: () => void;
  closeable?: ModalCloseable;
  width?: ModalWidth;
  height?: ModalHeight;
  size?: ModalWidth;
  showCloseIcon?: boolean;
  showHeader?: boolean;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  status?: React.ReactNode;
  footer?: React.ReactNode;
  actions?: ModalAction[];
  children: React.ReactNode;
};

export function Modal({
  id,
  show = false,
  icon,
  onClose,
  closeable = "close_button",
  width = "md",
  height = "base",
  size,
  showCloseIcon = true,
  showHeader = true,
  className,
  title,
  subtitle,
  status,
  footer,
  actions,
  children,
}: ModalProps) {
  const generatedId = useId();
  const modalId = id ?? generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const sizer = size ?? width;
  const canClickAway = closeable === true;
  const canClose = closeable !== false;
  const hasFooter = Boolean(footer) || Boolean(actions?.length);

  useEffect(() => {
    if (!show) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !canClose) return;
      event.preventDefault();
      event.stopPropagation();
      onClose?.();
    }

    window.addEventListener("keydown", onKeyDown, true);
    containerRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [show, canClose, onClose]);

  if (!show || typeof document === "undefined") return null;

  return createPortal(
    <div id={modalId} className={["core_modal", className].filter(Boolean).join(" ")}>
      <div
        id={`${modalId}-bg`}
        className="core_modal__backdrop"
        aria-hidden="true"
        onClick={() => {
          onClose?.();
        }}
      />
      <div
        className="core_modal__position"
        aria-labelledby={`${modalId}-title`}
        aria-describedby={`${modalId}-description`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className={[
            "core_modal__sizer",
            `core_modal__sizer--${sizer}`,
            height === "full" && "core_modal__sizer--full",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            ref={containerRef}
            id={`${modalId}-container`}
            className="core_modal__container"
            tabIndex={-1}
          >
            <div id={`${modalId}-content`} className="core_modal__content">
              {showHeader && (
                <header>
                  {icon && <span className="core_modal__icon">{icon}</span>}
                  <div className="core_modal__title--left">
                    <h2 id={`${modalId}-title`} className="core_modal__title">
                      {title}
                    </h2>
                    {subtitle && <div className="core_modal__subtitle">{subtitle}</div>}
                  </div>
                  <div className="core_modal__title--right">
                    {status && <div className="core_modal__status">{status}</div>}
                    {showCloseIcon && canClose && (
                      <button
                        type="button"
                        tabIndex={-1}
                        className="core_modal__close"
                        aria-label="close"
                        onClick={onClose}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    )}
                  </div>
                </header>
              )}

              <div id={`${modalId}-description`} className="core_modal__body">
                {children}
              </div>

              {hasFooter && (
                <footer>
                  {actions && actions.length > 0 && (
                    <div className="core_modal__actions">
                      {actions.map((action, index) => (
                        <button
                          key={index}
                          type={action.type ?? "button"}
                          className={`core_modal core_modal--${action.color ?? "secondary"}`}
                          onClick={() => {
                            action.onClick?.();
                            onClose?.();
                          }}
                        >
                          {action.children}
                        </button>
                      ))}
                    </div>
                  )}
                  {footer}
                </footer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export type DropdownPlacement = | "bottom-left" | "bottom-right" | "top-left" | "top-right" | "top-center" | "center-right";

export type DropdownItem = {
  children: React.ReactNode;
  onClick?: () => void;
};

export type DropdownProps = {
  id?: string;
  className?: string;
  labelClassName?: string;
  placement?: DropdownPlacement;
  label: React.ReactNode;
  items?: DropdownItem[];
  children?: React.ReactNode;
};

export function Dropdown({
  id,
  className,
  labelClassName,
  placement = "bottom-left",
  label,
  items,
  children,
}: DropdownProps) {
  const generatedId = useId();
  const dropdownId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!(target instanceof Element)) return;
      if (target.closest(".core_modal")) return;
      if (rootRef.current?.contains(target)) return;
      close();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !document.querySelector(".core_modal")) {
        close();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <DropdownCloseContext.Provider value={close}>
      <div
        ref={rootRef}
        id={dropdownId}
        className={["core_dropdown", open && "core_dropdown--active", className]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={["core_dropdown__title", labelClassName].filter(Boolean).join(" ")}
          onClick={() => setOpen((value) => !value)}
        >
          {label}
        </div>
        <ul id={`${dropdownId}-list`} className="core_dropdown__list" data-placement={placement}>
          {children
            ? children
            : items?.map((item, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className="item"
                    onClick={() => {
                      item.onClick?.();
                      close();
                    }}
                  >
                    {item.children}
                  </button>
                </li>
              ))}
        </ul>
      </div>
    </DropdownCloseContext.Provider>
  );
}

const DropdownCloseContext = createContext<(() => void) | null>(null);

export function useDropdownClose() {
  return useContext(DropdownCloseContext);
}

export type InputProps = Omit<React.ComponentProps<"input">, "type"> & {
  type?: React.HTMLInputTypeAttribute;
  label?: React.ReactNode;
  error?: string;
};

export function Input({
  id,
  type = "text",
  label,
  error,
  className,
  autoComplete,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isPassword = type === "password";
  const [visible, setVisible] = useState(false);
  const inputType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <div className="core_field">
      {label && (
        <label htmlFor={inputId} className="core_label">
          {label}
        </label>
      )}
      <div className={isPassword ? "core_field__control" : undefined}>
        <input
          id={inputId}
          type={inputType}
          autoComplete={autoComplete}
          className={[
            "core_input",
            "w-full",
            isPassword && "core_input--with-trailing",
            error && "core_input--error",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="core_input__toggle"
            aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            onClick={() => setVisible((value) => !value)}
          >
            <Icon name={visible ? "hero-eye-slash" : "hero-eye"} className="size-5" />
          </button>
        )}
      </div>
      {error && <p className="core_field__error">{error}</p>}
    </div>
  );
}
