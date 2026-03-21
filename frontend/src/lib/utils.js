import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/** ملفات من مجلد public — صحيحة على GitHub Pages (BASE_URL مثل /wazari/) */
export function publicUrl(path) {
  const clean = path.startsWith("/") ? path.slice(1) : path
  const base = import.meta.env.BASE_URL || "/"
  return `${base}${clean}`
}
