import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface SubmitButtonProps extends HTMLMotionProps<"button"> {
  loading?: boolean;
  children: ReactNode;
}

export default function SubmitButton({
  loading,
  children,
  className = "",
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: loading || disabled ? 1 : 1.01 }}
      whileTap={{ scale: loading || disabled ? 1 : 0.98 }}
      disabled={loading || disabled}
      className={[
        "flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5",
        "text-sm font-semibold text-white shadow-lg shadow-teal-800/20 transition",
        "hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      ) : null}
      {children}
    </motion.button>
  );
}
