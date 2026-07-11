"use client";

import { Film } from "lucide-react";
import type { Quest } from "@/types/quest";

export interface ProfilePostGridProps {
  quests: Quest[];
  onSelect?: (questId: string) => void;
}

/**
 * 自分の投稿の3列グリッド(縦動画サムネイル)。
 * データ元は既存のローカル投稿(Quest)。録画/投稿処理には一切依存しない読み取り専用。
 */
export function ProfilePostGrid({ quests, onSelect }: ProfilePostGridProps) {
  if (quests.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Film size={30} className="text-faint" strokeWidth={1.6} />
        <p className="text-sm text-soft">No posts yet.</p>
        <p className="text-xs text-faint">Complete a quest to see it here.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-1">
      {quests.map((quest) => {
        const video = quest.startVideo;
        return (
          <button
            key={quest.id}
            type="button"
            onClick={() => onSelect?.(quest.id)}
            className="relative aspect-[9/16] overflow-hidden rounded-media bg-surface-2"
          >
            {video ? (
              <video
                src={video.uri}
                poster={video.posterUri ?? undefined}
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                <Film size={20} className="text-faint" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}