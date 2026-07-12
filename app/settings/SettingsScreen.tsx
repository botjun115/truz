"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload } from "lucide-react";
import { ProfileAvatar } from "@/components/Profile/ProfileAvatar";
import { applyTheme, useUserProfile } from "@/hooks/useUserProfile";
import { imageFileToResizedDataUrl } from "@/lib/imageFile";
import type { ProfileThemePreference } from "@/types/profile";

const NAME_MAX = 30;
const BIO_MAX = 120;
const AVATAR_MAX_PX = 256;
const COVER_MAX_PX = 720;
const THEMES: readonly ProfileThemePreference[] = ["dark", "light", "system"];

/**
 * 設定画面(一括保存方式)。
 * すべての項目をローカルstateで一時保持し、テーマだけは即プレビュー反映。
 * localStorageへの確定保存は「Save Changes」を押したときのみ。
 */
export function SettingsScreen() {
  const { profile, hydrated, update } = useUserProfile();
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [coverDataUrl, setCoverDataUrl] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [theme, setThemeState] = useState<ProfileThemePreference>("dark");

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || loaded) return;
    setName(profile.name);
    setBio(profile.bio);
    setAvatarDataUrl(profile.avatarDataUrl);
    setCoverDataUrl(profile.coverDataUrl);
    setIsPrivate(profile.isPrivate);
    setThemeState(profile.theme);
    setLoaded(true);
  }, [hydrated, loaded, profile]);

  const previewTheme = (next: ProfileThemePreference) => {
    setThemeState(next);
    applyTheme(next);
  };

  const goBack = () => {
    applyTheme(profile.theme);
    router.push("/profile");
  };

  const handleAvatar = async (file: File | undefined) => {
    if (!file) return;
    try {
      setAvatarDataUrl(await imageFileToResizedDataUrl(file, AVATAR_MAX_PX));
    } catch (e) {
      setError(e instanceof Error ? e.message : "画像の読み込みに失敗しました。");
    }
  };

  const handleCover = async (file: File | undefined) => {
    if (!file) return;
    try {
      setCoverDataUrl(await imageFileToResizedDataUrl(file, COVER_MAX_PX));
    } catch (e) {
      setError(e instanceof Error ? e.message : "画像の読み込みに失敗しました。");
    }
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      setError("名前を入力してください。");
      return;
    }
    const ok = update({
      name: trimmedName.slice(0, NAME_MAX),
      bio: bio.slice(0, BIO_MAX),
      avatarDataUrl,
      coverDataUrl,
      isPrivate,
      theme,
    });
    if (!ok) {
      setError("保存容量が上限を超えました。画像を小さいものに変えてお試しください。");
      return;
    }
    setError(null);
    router.push("/profile");
  };

  return (
    <div className="page-shell">
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-line bg-bg/85 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+12px)] backdrop-blur-md">
        <button type="button" onClick={goBack} aria-label="Back" className="-ml-2 p-2 text-ink">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display text-lg font-semibold text-ink">Settings</h1>
      </header>

      <main className="flex-1 space-y-7 px-5 pb-28 pt-5">
        {error ? (
          <p className="rounded-control bg-danger/15 px-3 py-2 text-sm text-danger">{error}</p>
        ) : null}

        <section className="space-y-3">
          <SectionLabel>Profile Photo</SectionLabel>
          <div className="flex items-center gap-4">
            <ProfileAvatar name={name} avatarDataUrl={avatarDataUrl} size={64} />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-control border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink"
            >
              <Upload size={16} /> Change
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleAvatar(e.target.files?.[0])}
            />
          </div>
        </section>

        <section className="space-y-2">
          <SectionLabel>Name</SectionLabel>
          <input
            value={name}
            maxLength={NAME_MAX}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full rounded-control border border-line bg-surface-2 px-3 text-sm text-ink outline-none"
          />
          <span className="text-[11px] text-faint">{name.length}/{NAME_MAX}</span>
        </section>

        <section className="space-y-2">
          <SectionLabel>Bio</SectionLabel>
          <textarea
            value={bio}
            maxLength={BIO_MAX}
            rows={3}
            onChange={(e) => setBio(e.target.value)}
            className="w-full resize-none rounded-control border border-line bg-surface-2 px-3 py-2 text-sm text-ink outline-none"
          />
          <span className="text-[11px] text-faint">{bio.length}/{BIO_MAX}</span>
        </section>

        <section className="space-y-3">
          <SectionLabel>Cover Image</SectionLabel>
          <div
            className="h-24 w-full rounded-card border border-line bg-surface-2"
            style={
              coverDataUrl
                ? { backgroundImage: `url(${coverDataUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                : undefined
            }
          />
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-control border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink"
          >
            <Upload size={16} /> Change Cover
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleCover(e.target.files?.[0])}
          />
        </section>

        <section className="flex items-center justify-between">
          <div>
            <SectionLabel>Private Account</SectionLabel>
            <p className="mt-1 text-xs text-faint">Only approved followers can see your posts.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isPrivate}
            onClick={() => setIsPrivate((prev) => !prev)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              isPrivate ? "bg-accent" : "bg-surface-2"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                isPrivate ? "left-6" : "left-1"
              }`}
            />
          </button>
        </section>

        <section className="space-y-2">
          <SectionLabel>Theme</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((mode) => {
              const active = theme === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => previewTheme(mode)}
                  className={`rounded-control border py-2.5 text-sm font-semibold capitalize transition-colors ${
                    active ? "border-accent text-accent" : "border-line text-soft"
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </section>

        <button
          type="button"
          onClick={handleSave}
          className="flex h-12 w-full items-center justify-center rounded-control bg-ink text-sm font-semibold text-bg"
        >
          Save Changes
        </button>
      </main>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-semibold uppercase tracking-widest text-soft">{children}</p>
  );
}