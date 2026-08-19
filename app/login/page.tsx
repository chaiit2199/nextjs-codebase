"use client";

import { useState } from "react";

import { Icon } from "@/components/icon";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div id="login-page" className="login-page">
      <div className="w-full">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="login-shell ios-glass-card">
            <div className="login-card">
              <header className="login-header">
                <h1 id="login-title" className="login-header__title">
                  <img src="/images/logo.png" alt="USA Farm Agri" className="login-header__logo" />
                </h1>
              </header>

              <form id="login-form" action="/login" method="post" className="login-form">
                <div className="core_field">
                  <label className="core_label" htmlFor="identity">
                    Email hoặc tên đăng nhập *
                  </label>
                  <input
                    id="identity"
                    name="username"
                    type="text"
                    className="core_input"
                    placeholder="mail@congty.com"
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="login-field login-field--password">
                  <label htmlFor="password" className="core_label">
                    Mật khẩu *
                  </label>
                  <div className="login-field__control">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="core_input core_input--with-trailing w-full"
                      placeholder="Tối thiểu 6 ký tự"
                      autoComplete="current-password"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      id="toggle-password"
                      className="login-field__trailing-btn"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      <Icon name={showPassword ? "hero-eye-slash" : "hero-eye"} className="size-5" />
                    </button>
                  </div>
                </div>

                <div className="login-form__meta">
                  <a href="#" className="login-link" tabIndex={-1}>
                    Quên mật khẩu?
                  </a>
                </div>

                <button type="submit" id="login-submit" className="login-submit">
                  Đăng nhập
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
