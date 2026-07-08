"use client";

import { QuestBottomSheet } from "@/components/Create/QuestBottomSheet";
import { CameraLauncher } from "@/components/Create/CameraLauncher";
import { ReviewScreen } from "@/components/Create/ReviewScreen";
import { useCreateQuest } from "@/context/CreateQuestContext";
import { useQuest } from "@/hooks/useQuest";
import type { VideoAsset } from "@/types/video";

/**
 * START Questフローのオーバーレイ制御。
 * step に応じて Bottom Sheet / Camera / Review をHomeの上に重ねる。
 */
export function CreateFlow() {
  const flow = useCreateQuest();
  const { publishStartQuest } = useQuest();

  const handleRecorded = (video: VideoAsset) => flow.completeRecording(video);

  const handlePost = () => {
    if (!flow.startVideo) return;
    const questName = flow.questName.trim();
    const video = flow.startVideo;
    // 擬似アップロード(ローディングはPostButton側で表示)
    window.setTimeout(() => {
      publishStartQuest({ questName, startVideo: video });
      flow.reset();
    }, 1200);
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

      {flow.step === "camera" ? <CameraLauncher onRecorded={handleRecorded} /> : null}

      {flow.step === "review" && flow.startVideo ? (
        <div className="fixed inset-0 z-50 mx-auto max-w-md">
          <ReviewScreen
            questName={flow.questName.trim()}
            video={flow.startVideo}
            onBack={flow.backToCamera}
            onPost={handlePost}
          />
        </div>
      ) : null}
    </>
  );
}