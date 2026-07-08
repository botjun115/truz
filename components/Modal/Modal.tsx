"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { overlayFade } from "@/constants/animation";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/** 汎用モーダル(フェード付き) */
export function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          variants={overlayFade}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
          onClick={onClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="w-full max-w-md rounded-t-card border border-line bg-surface p-5 sm:rounded-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center">
              {title ? (
                <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="ml-auto flex h-11 w-11 items-center justify-center text-ink"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
