export function QuestTitle({ title }: { title: string }) {
  return (
    <h3 className="line-clamp-2 font-sans text-[26px] font-bold leading-tight text-ink">
      {title}
    </h3>
  );
}
