import { getColor, getInitials, roleLabel } from "@/lib/users/avatar";

export type UserAvatarSize = "sm" | "md" | "lg";

export type UserAvatarProps = {
  fullname: string;
  className?: string;
  size?: UserAvatarSize;
};

export function UserAvatar({ fullname, className, size = "md" }: UserAvatarProps) {
  const initials = getInitials(fullname);
  const background = getColor(fullname);

  return (
    <span
      className={["user-avatar", `user-avatar--${size}`, className].filter(Boolean).join(" ")}
      style={{ backgroundColor: background, ["--avatar-bg" as string]: background }}
      title={fullname}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export type UserAvatarRowProps = {
  fullname: string;
  role?: string | number | null;
  id?: string;
  className?: string;
  showChevron?: boolean;
};

export function UserAvatarRow({
  fullname,
  role = "1002",
  id,
  className,
  showChevron = true,
}: UserAvatarRowProps) {
  return (
    <div id={id} className={["profile", className].filter(Boolean).join(" ")}>
      <UserAvatar fullname={fullname} className="profile__avatar" />
      <div className="profile__meta">
        <span className="profile__name">{fullname}</span>
        <span className="profile__role">{roleLabel(role)}</span>
      </div>
      {showChevron && (
        <svg className="profile__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      )}
    </div>
  );
}
