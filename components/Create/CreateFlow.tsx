"use client";

import { useState } from "react";
import { QuestBottomSheet } from "@/components/Create/QuestBottomSheet";
import { CameraLauncher } from "@/components/Create/CameraLauncher";
import { ReviewScreen } from "@/components/Create/ReviewScreen";
import { ShareSuccessOverlay } from "@/components/Share/ShareSuccessOverlay";
import { useCreateQuest } from "@/context/CreateQuestContext";
import { useQuest } from "@/hooks/useQuest";
import { buildVideoStoragePath, uploadVideo } from "@/lib/firebase/upload";
import { generateId } from "@/utils/id";
import type { VideoAsset } from "@/types/video";

/**
 * START/ENDフローのオーバーレイ制御。
 * 投稿時に動画をFirebase Storageへアップロードし、blob:URLを永続URL(https)へ差し替える。
 * これによりフィード/リロード後も黒画面にならない。
 */
export function CreateFlow() {
  const flow = useCreateQuest();
  const { publishStartQuest, completeEndQuest } = useQuest();

  const [shareOpen, setShareOpen] = useState(false);
  const [sharedQuestName, setSharedQuestName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleRecorded = (video: VideoAsset) => {
    flow.completeRecording(video);
  };

  /** blob:URLから実データを取得し、Storageへアップして永続URLを持つVideoAssetを返す */
  const uploadAndGetVideoAsset = async (
    video: VideoAsset,
    questId: string,
    kind: "start" | "end",
  ): Promise<VideoAsset> => {
    const response = await fetch(video.uri);
    const blob = await response.blob();
    const contentType = blob.type || "video/webm";
    const path = buildVideoStoragePath("user_me", questId, kind);
    const { downloadUrl } = await uploadVideo({ file: blob, path, contentType });
    return { ...video, uri: downloadUrl };
  };

  const handlePost = async () => {
    if (!flow.recordedVideo) return;
    const video = flow.recordedVideo;
    const postedQuestName = flow.questName.trim();

    setUploading(true);
    setUploadError(null);

    try {
      if (flow.mode === "start") {
        const questId = generateId("quest");
        const uploaded = await uploadAndGetVideoAsset(video, questId, "start");
        publishStartQuest({ questName: postedQuestName, startVideo: uploaded });
        flow.reset();
        setSharedQuestName(postedQuestName);
        setShareOpen(true);
      } else if (flow.mode === "end" && flow.endingQuestId) {
        const questId = flow.endingQuestId;
        const uploaded = await uploadAndGetVideoAsset(video, questId, "end");
        completeEndQuest({ questId, endVideo: uploaded });
        flow.reset();
        setSharedQuestName(postedQuestName);
        setShareOpen(true);
      }
    } catch (error) {
      console.error("[TRUZ] upload failed:", error);
      const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      setUploadError(`アップロード失敗: ${detail}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <QuestBottomSheet
        open={flow.step === "sheet"}
        questName={flow.questName}
        onQuestNameChange={flow.setQuestName}
        onNext={flow.goToCamera}
        onClose={flow.close}
      />

      {flow.step === "camera" ? (
        <CameraLauncher kind={flow.mode} onRecorded={handleRecorded} onClose={flow.close} />
      ) : null}

      {flow.step === "review" && flow.recordedVideo ? (
        <div className="fixed inset-0 z-50 mx-auto max-w-md">
          <ReviewScreen
            questName={flow.questName.trim()}
            video={flow.recordedVideo}
            onBack={flow.backToCamera}
            onPost={handlePost}
          />
          {uploading ? (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60">
              <p className="font-mono text-sm tracking-wider text-white">Uploading…</p>
            </div>
          ) : null}
          {uploadError ? (
            <div className="absolute inset-x-4 bottom-24 z-50 rounded-control bg-danger/90 px-4 py-3 text-center text-xs font-semibold text-white">
              {uploadError}
            </div>
          ) : null}
        </div>
      ) : null}

      <ShareSuccessOverlay
        open={shareOpen}
        questName={sharedQuestName}
        onDone={() => setShareOpen(false)}
      />
    </>
  );
}