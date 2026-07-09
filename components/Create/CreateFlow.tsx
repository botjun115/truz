"use client";

import { QuestBottomSheet } from "@/components/Create/QuestBottomSheet";
import { CameraLauncher } from "@/components/Create/CameraLauncher";
import { ReviewScreen } from "@/components/Create/ReviewScreen";
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

  const handleRecorded = (video: VideoAsset) => flow.completeRecording(video);

  const handlePost = () => {
    if (!flow.recordedVideo) return;
    const video = flow.recordedVideo;

    if (flow.mode === "start") {
      const questName = flow.questName.trim();
      window.setTimeout(() => {
        publishStartQuest({ questName, startVideo: video });
        flow.reset();
      }, 1200);
    } else if (flow.mode === "end" && flow.endingQuestId) {
      const questId = flow.endingQuestId;
      window.setTimeout(() => {
        completeEndQuest({ questId, endVideo: video });
        flow.reset();
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
        <CameraLauncher kind={flow.mode} onRecorded={handleRecorded} />
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
    </>
  );
}