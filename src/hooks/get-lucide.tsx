
import * as LucideIcons from "lucide-react";
import { FileText } from "lucide-react";
export function getLucideIcon(iconName?: string) {
  const key = (iconName ?? "fileText")
    .charAt(0)
    .toUpperCase() + (iconName ?? "fileText").slice(1)
  const IconsMap = LucideIcons as any
  return IconsMap[key] ?? FileText
}