import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { APP_NAME } from "@/constants/config";

export interface HeaderProps {
  title?: string;
  brand?: boolean;
  backHref?: string;
  right?: React.ReactNode;
}

export function Header({ title, brand = false, backHref, right }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-line bg-bg px-5">
      {backHref ? (
        <Link href={backHref} aria-label="Back" className="-ml-2 p-2 text-ink">
          <ChevronLeft size={20} />
        </Link>
      ) : null}
      {brand ? (
        <span className="font-sans text-[26px] font-bold tracking-[1.5px] text-ink">
          {APP_NAME} <span className="text-accent">•</span>
        </span>
      ) : (
        <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
      )}
      <div className="ml-auto flex items-center gap-1">{right}</div>
    </header>
  );
}
