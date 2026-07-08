"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface FloatingButtonBase {
  ariaLabel: string;
}
interface FloatingButtonLink extends FloatingButtonBase {
  href: string;
  onClick?: never;
}
interface FloatingButtonAction extends FloatingButtonBase {
  onClick: () => void;
  href?: never;
}
export type FloatingButtonProps = FloatingButtonLink | FloatingButtonAction;

const CLASS =
  "flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/10";

/** 中央のフローティングアクションボタン(白地に黒の+)。href/onClickどちらでも使える */
export function FloatingButton(props: FloatingButtonProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="-mt-7 inline-flex"
    >
      {"href" in props && props.href ? (
        <Link href={props.href} aria-label={props.ariaLabel} className={CLASS}>
          <Plus size={24} strokeWidth={2.4} />
        </Link>
      ) : (
        <button type="button" onClick={props.onClick} aria-label={props.ariaLabel} className={CLASS}>
          <Plus size={24} strokeWidth={2.4} />
        </button>
      )}
    </motion.span>
  );
}