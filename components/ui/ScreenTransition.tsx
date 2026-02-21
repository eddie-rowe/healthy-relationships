"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface ScreenTransitionProps {
  stepKey: string;
  children: ReactNode;
}

export default function ScreenTransition({ stepKey, children }: ScreenTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
