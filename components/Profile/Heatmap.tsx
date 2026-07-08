import { HEATMAP_WEEKS } from "@/constants/config";

export interface HeatmapProps {
  values: number[];
  weeks?: number;
}

/** 継続状況のヒートマップ(値0=空、1以上=活動あり) */
export function Heatmap({ values, weeks = HEATMAP_WEEKS }: HeatmapProps) {
  return (
    <div
      className="grid gap-[3px]"
      style={{
        gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
        gridTemplateRows: "repeat(7, minmax(0, 1fr))",
        gridAutoFlow: "column",
      }}
      role="img"
      aria-label="Consistency heatmap"
    >
      {values.map((value, index) => (
        <div
          key={index}
          className={`aspect-square rounded-[3px] ${value > 0 ? "bg-ink" : "bg-surface-2"}`}
        />
      ))}
    </div>
  );
}
