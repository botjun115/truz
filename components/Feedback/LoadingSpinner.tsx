export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink" />
      {label ? <span className="text-sm text-soft">{label}</span> : null}
    </div>
  );
}
