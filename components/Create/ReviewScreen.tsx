"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { PostButton } from "@/components/Create/PostButton";
import type { VideoAsset } from "@/types/video";

export interface ReviewScreenProps {
  questName: string;
  video: VideoAsset;
  onBack: () => void;
  onPost: () => void;
}

/** 録画レビュー: 動画(再生可)・クエスト名・戻る・投稿。トリミングや加工は無し */
export function ReviewScreen({ questName, video, onBack, onPost }: ReviewScreenProps) {
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = () => {
    setIsPosting(true);
    onPost();
  };

  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <header className="flex items-center gap-2 px-5 pt-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          disabled={isPosting}
          className="-ml-2 p-2 text-ink"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display text-lg font-semibold text-ink">Review</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 px-5 pb-6 pt-2">
        <div className="relative flex-1 overflow-hidden rounded-media bg-black">
          <video
            src={video.uri}
            poster={video.posterUri ?? undefined}
            controls
            autoPlay
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
        <p className="font-sans text-xl font-bold text-ink">{questName}</p>
        <PostButton onPost={handlePost} isPosting={isPosting} />
      </div>
    </div>
  );
}