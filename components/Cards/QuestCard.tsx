import { QuestStatus } from "@/components/Quest/QuestStatus";
import type { Quest } from "@/types/quest";
import { formatDuration } from "@/utils/time";

export interface QuestCardProps {
  quest: Quest;
}

/** プロフィール等で使うコンパクトなクエスト概要カード */
export function QuestCard({ quest }: QuestCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-control border border-line bg-surface p-3.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{quest.questName}</p>
        {quest.durationMs !== null ? (
          <p className="font-mono text-xs text-soft">{formatDuration(quest.durationMs)}</p>
        ) : null}
      </div>
      <QuestStatus status={quest.status} />
    </div>
  );
}
