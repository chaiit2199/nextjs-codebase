"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

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
      if (event.key === "Escape" && canClickAway) {
        onClose?.();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    containerRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [show, canClickAway, onClose]);

  if (!show || typeof document === "undefined") return null;

  return createPortal(
    <div id={modalId} className={["core_modal", className].filter(Boolean).join(" ")}>
      <div
        id={`${modalId}-bg`}
        className="core_modal__backdrop"
        aria-hidden="true"
        onClick={canClickAway ? onClose : undefined}
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
                          className={`core_modal__btn core_modal__btn--${action.color ?? "secondary"}`}
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
