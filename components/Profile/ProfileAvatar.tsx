"use client";

export interface ProfileAvatarProps {
  name: string;
  avatarDataUrl: string | null;
  size?: number;
  className?: string;
}

/** 円形アバター。画像が無ければ名前の頭文字。 */
export function ProfileAvatar({ name, avatarDataUrl, size = 40, className = "" }: ProfileAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const style = { width: size, height: size } as const;
  if (avatarDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarDataUrl}
        alt={name}
        style={style}
        className={`rounded-full object-cover ring-1 ring-white/[0.06] ${className}`}
      />
    );
  }
  return (
    <span
      style={style}
      className={`flex items-center justify-center rounded-full bg-surface-2 font-display font-bold text-ink ring-1 ring-white/[0.06] ${className}`}
    >
      {initial}
    </span>
  );
}