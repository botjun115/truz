"use client";

export interface ProfileStatsProps {
  followingCount: number;
  followerCount: number;
  totalLikes: number;
  totalViews: number;
}

interface StatItem {
  label: string;
  value: number;
}

function formatCount(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return String(value);
}

/** Following / Followers / Total Likes / Total Views の統計行 */
export function ProfileStats({
  followingCount,
  followerCount,
  totalLikes,
  totalViews,
}: ProfileStatsProps) {
  const items: StatItem[] = [
    { label: "Following", value: followingCount },
    { label: "Followers", value: followerCount },
    { label: "Total Likes", value: totalLikes },
    { label: "Total Views", value: totalViews },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="text-lg font-bold text-ink">{formatCount(item.value)}</span>
          <span className="mt-0.5 text-center text-[11px] text-soft">{item.label}</span>
        </div>
      ))}
    </div>
  );
}