"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Link2Off,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Smile,
  Palette,
} from "lucide-react";
const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Serif (Georgia)", value: "Georgia, 'Times New Roman', serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Courier New (mono)", value: "'Courier New', Courier, monospace" },
];

const FONT_SIZES = [
  { label: "Size", value: "" },
  { label: "Small", value: "14px" },
  { label: "Normal", value: "16px" },
  { label: "Large", value: "20px" },
  { label: "X-Large", value: "26px" },
];

const EMOJI = [
  "💰", "💵", "💳", "🧾", "📊", "📈", "📉", "🏦", "⚖️", "📅",
  "⏰", "✅", "❌", "⚠️", "💡", "🔒", "🔑", "📞", "✉️", "📌",
  "📝", "🎯", "🤝", "👍", "🙌", "😀", "😊", "🚀", "⭐", "🔥",
];

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`flex h-7 w-7 items-center justify-center rounded transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "bg-navy-900 text-white" : "text-heading hover:bg-black/5"
      }`}
    >
      {children}
    </button>
  );
}

function EmojiPicker({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <ToolbarButton onClick={() => setOpen((v) => !v)} active={open} label="Insert icon">
        <Smile size={15} />
      </ToolbarButton>
      {open && (
        <div className="absolute top-full left-0 z-20 mt-1 grid w-56 grid-cols-6 gap-1 rounded-md border border-black/10 bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          {EMOJI.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                editor.chain().focus().insertContent(emoji).run();
                setOpen(false);
              }}
              className="flex h-7 w-7 items-center justify-center rounded text-[16px] hover:bg-black/5"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-black/10 bg-section px-2 py-1.5">
      <select
        aria-label="Font family"
        onChange={(e) => {
          if (e.target.value) editor.chain().focus().setFontFamily(e.target.value).run();
          else editor.chain().focus().unsetFontFamily().run();
        }}
        className="h-7 rounded border border-black/15 bg-white px-1.5 text-[12.5px] text-heading outline-none"
        defaultValue=""
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.label} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Font size"
        onChange={(e) => {
          if (e.target.value) editor.chain().focus().setFontSize(e.target.value).run();
          else editor.chain().focus().unsetFontSize().run();
        }}
        className="h-7 rounded border border-black/15 bg-white px-1.5 text-[12.5px] text-heading outline-none"
        defaultValue=""
      >
        {FONT_SIZES.map((f) => (
          <option key={f.label} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <span className="relative flex h-7 w-7 items-center justify-center">
        <Palette size={15} className="pointer-events-none absolute text-heading" />
        <input
          type="color"
          aria-label="Text color"
          title="Text color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="h-7 w-7 cursor-pointer opacity-0"
        />
      </span>

      <span className="mx-1 h-5 w-px bg-black/10" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        label="Bold"
      >
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        label="Italic"
      >
        <Italic size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        label="Underline"
      >
        <UnderlineIcon size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        label="Strikethrough"
      >
        <Strikethrough size={15} />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-black/10" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        label="Heading 2"
      >
        <Heading2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        label="Heading 3"
      >
        <Heading3 size={15} />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-black/10" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        label="Bullet list"
      >
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        label="Numbered list"
      >
        <ListOrdered size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        label="Quote"
      >
        <Quote size={15} />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-black/10" />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
        label="Align left"
      >
        <AlignLeft size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
        label="Align center"
      >
        <AlignCenter size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
        label="Align right"
      >
        <AlignRight size={15} />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-black/10" />

      {editor.isActive("link") ? (
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          active
          label="Remove link"
        >
          <Link2Off size={15} />
        </ToolbarButton>
      ) : (
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          label="Add link"
        >
          <Link2 size={15} />
        </ToolbarButton>
      )}

      <EmojiPicker editor={editor} />

      <span className="mx-1 h-5 w-px bg-black/10" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        label="Undo"
      >
        <Undo2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        label="Redo"
      >
        <Redo2 size={15} />
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write your post here…" }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        id: name,
        class:
          "rich-content min-h-[280px] max-w-none px-4 py-3.5 text-[15px] text-body outline-none",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  if (!editor) {
    return (
      <div className="min-h-[320px] rounded-md border border-black/15 bg-white" aria-hidden />
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-black/15 bg-white focus-within:border-navy-900">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}
