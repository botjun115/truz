import type { QuestStatus as QuestStatusValue } from "@/types/quest";
import { assertNever } from "@/utils/validation";

export function QuestStatus({ status }: { status: QuestStatusValue }) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ink bg-surface px-2.5 py-1 font-mono text-[10.5px] font-bold tracking-wider text-ink">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" aria-hidden />
          ACTIVE
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center whitespace-nowrap rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[10.5px] font-bold tracking-wider text-soft">
          COMPLETED
        </span>
      );
    default:
      return assertNever(status);
  }
}
