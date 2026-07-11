"use client";

import { useState } from "react"; // ← 追加
import { QuestBottomSheet } from "@/components/Create/QuestBottomSheet";
import { CameraLauncher } from "@/components/Create/CameraLauncher";
import { ReviewScreen } from "@/components/Create/ReviewScreen";
import { ShareSuccessOverlay } from "@/components/Share/ShareSuccessOverlay"; // ← 追加
import { useCreateQuest } from "@/context/CreateQuestContext";
import { useQuest } from "@/hooks/useQuest";
import type { VideoAsset } from "@/types/video";

/**
 * START/ENDフローのオーバーレイ制御。
 * step に応じて Bottom Sheet / Camera / Review をHomeの上に重ねる。
 * mode が "start" なら新規active化、"end" なら既存questをCOMPLETED化する。
 */
export function CreateFlow() {
  const flow = useCreateQuest();
  const { publishStartQuest, completeEndQuest } = useQuest();

  // ↓ 追加: 投稿成功時だけShareオーバーレイを出すためのローカル状態(Context非依存)
  const [shareOpen, setShareOpen] = useState(false);
  const [sharedQuestName, setSharedQuestName] = useState("");

  const handleRecorded = (video: VideoAsset) => {
    console.log("[TRUZ] CreateFlow.handleRecorded uri length:", video.uri?.length ?? "undefined");
    flow.completeRecording(video);
  };

  const handlePost = () => {
    if (!flow.recordedVideo) {
      console.error("[TRUZ] handlePost: recordedVideo is NULL");
      return;
    }
    const video = flow.recordedVideo;
    console.log(
      "[TRUZ] handlePost posting, mode:",
      flow.mode,
      "uri length:",
      video.uri?.length ?? "undefined",
    );

    const postedQuestName = flow.questName.trim(); // ← 追加(投稿名を控える)

    if (flow.mode === "start") {
      const questName = flow.questName.trim();
      window.setTimeout(() => {
        publishStartQuest({ questName, startVideo: video });
        console.log("[TRUZ] publishStartQuest done, startVideo uri length:", video.uri?.length);
        flow.reset();
        setSharedQuestName(postedQuestName); // ← 追加
        setShareOpen(true); // ← 追加(投稿成功後にオーバーレイ表示)
      }, 1200);
    } else if (flow.mode === "end" && flow.endingQuestId) {
      const questId = flow.endingQuestId;
      window.setTimeout(() => {
        completeEndQuest({ questId, endVideo: video });
        flow.reset();
        setSharedQuestName(postedQuestName); // ← 追加
        setShareOpen(true); // ← 追加
      }, 1200);
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
        </div>
      ) : null}

      {/* ↓ 追加: 投稿成功直後だけ表示されるShareオーバーレイ */}
      <ShareSuccessOverlay
        open={shareOpen}
        questName={sharedQuestName}
        onDone={() => setShareOpen(false)}
      />
    </>
  );
}