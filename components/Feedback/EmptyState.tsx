export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-8 py-16 text-center">
      {icon ? <div className="text-faint">{icon}</div> : null}
      <p className="mt-2 text-base font-semibold text-ink">{title}</p>
      {description ? <p className="text-sm text-soft">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
