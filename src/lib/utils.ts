import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, letting later Tailwind utilities win over earlier ones.
 *
 * The same helper the dashboard uses, trimmed to what this site needs: the
 * metadata and avatar helpers that sat beside it were Next-specific and have
 * no consumer here.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
