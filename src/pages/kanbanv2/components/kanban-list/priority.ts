export type Priority = "low" | "medium" | "high" | "urgent" | "none";

export const PRIORITY_COLOR: Record<Exclude<Priority, "none">, string> = {
  low: "text-gray-500 fill-gray-500",
  medium: "text-yellow-600 fill-yellow-600",
  high: "text-blue-800 fill-blue-800",
  urgent: "text-red-800 fill-red-800",
};

export function priorityColorClass(p?: Priority): string {
  if (!p || p === "none") return PRIORITY_COLOR.low; // default icon color
  return PRIORITY_COLOR[p as Exclude<Priority, "none">] ?? PRIORITY_COLOR.low;
}
