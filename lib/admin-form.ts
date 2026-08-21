// Shared FormData parsing helpers for the CMS's Server Actions — kept
// dependency-free (no zod) to match the rest of the codebase's plain
// hand-rolled validation style (see app/api/create-checkout-session).

export function textField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** One item per line, e.g. a textarea for description paragraphs or bullet lists. */
export function linesToArray(formData: FormData, name: string): string[] {
  const value = formData.get(name);
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function intField(formData: FormData, name: string, fallback = 0): number {
  const value = Number(formData.get(name));
  return Number.isFinite(value) ? Math.trunc(value) : fallback;
}

export function checkboxField(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export type ActionState = { error?: string; success?: boolean } | undefined;

/**
 * Parses "label | value | extra" lines (one row per line) into objects —
 * used for the Settings form's phone numbers and social links, which are
 * small structured lists that don't warrant a full repeater-field UI.
 */
export function parsePipeLines(raw: string, keys: string[]): Record<string, string>[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());
      const row: Record<string, string> = {};
      keys.forEach((key, i) => {
        row[key] = parts[i] ?? "";
      });
      return row;
    });
}

export function serializePipeLines(rows: unknown, keys: string[]): string {
  if (!Array.isArray(rows)) return "";
  return rows
    .map((row) => keys.map((key) => (row as Record<string, string>)[key] ?? "").join(" | "))
    .join("\n");
}
