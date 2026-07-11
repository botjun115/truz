"use client";

/** 広告プレースホルダー(AdMob等は未導入)。黒系UIに馴染む控えめな枠。 */
export function SponsoredSlot() {
  return (
    <div className="rounded-card border border-line bg-surface-2/50 px-4 py-3 text-center">
      <p className="font-mono text-[10px] uppercase tracking-widest text-faint">Sponsored</p>
      <p className="mt-1 text-sm text-soft">Advertisement space</p>
    </div>
  );
}