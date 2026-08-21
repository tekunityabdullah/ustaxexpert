// Mirrors lib/blog.ts's BlogContentBlock — kept independent so both the
// blog Server Actions file (server) and the rich text form (client) can
// import these plain helpers without pulling in "use server" restrictions.
export type BlogContentBlock = string | { heading: string; text: string };

/** True for posts seeded/written before the rich text editor existed —
 * their `content` column holds a JSON array of paragraphs instead of an
 * HTML string. */
export function isLegacyBlockContent(content: unknown): content is BlogContentBlock[] {
  return Array.isArray(content);
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Converts legacy block-array content into HTML so editing an old post
 * loads real formatted text into the WYSIWYG editor instead of raw JSON. */
export function blockArrayToHtml(blocks: BlogContentBlock[]): string {
  return blocks
    .map((block) =>
      typeof block === "string"
        ? `<p>${escapeHtml(block)}</p>`
        : `<h3>${escapeHtml(block.heading)}</h3><p>${escapeHtml(block.text)}</p>`
    )
    .join("");
}

/** Strips tags down to plain text — used only to check the rich editor's
 * HTML output isn't functionally empty (e.g. just an empty <p></p>). */
export function stripHtmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
