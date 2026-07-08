import { Clock } from "lucide-react";

export function QuestDuration({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[13px] text-soft">
      <Clock size={14} />
      {label}
    </span>
  );
}
