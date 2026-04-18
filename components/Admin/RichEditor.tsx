/**
 * Rich Text Editor using TipTap
 * Provides WordPress-like editing experience
 */

"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ImagePickerModal } from "./ImagePickerModal";

interface RichEditorProps {
  value: string; // JSON string from TipTap
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichEditor({
  value,
  onChange,
  placeholder = "Start writing...",
}: RichEditorProps) {
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  // Parse JSON value or create default
  let initialContent = {
    type: "doc",
    content: [{ type: "paragraph" }],
  };

  try {
    if (value) {
      if (typeof value === "string" && value.startsWith("{")) {
        // Try to parse as JSON
        initialContent = JSON.parse(value);
      } else if (typeof value === "string" && value.length > 0) {
        // Convert plain text to TipTap format
        initialContent = {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: value,
                },
              ],
            },
          ],
        };
      }
    }
  } catch (e) {
    console.warn("Invalid JSON content:", e);
    // If parsing fails and it's plain text, convert it
    if (typeof value === "string" && value.length > 0) {
      initialContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: value,
              },
            ],
          },
        ],
      };
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "mb-2",
          },
        },
        heading: {
          HTMLAttributes: {
            class: "font-bold my-2",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-gray-100 rounded p-2 my-2 overflow-x-auto",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-inside ml-4 mb-2",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-inside ml-4 mb-2",
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer hover:text-blue-600",
        },
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON());
      onChange(json);
    },
    editorProps: {
      attributes: {
        class:
          "min-h-96 p-4 prose prose-sm max-w-none focus:outline-none border border-gray-300 rounded-lg bg-white",
      },
    },
  });

  // Update editor content when value prop changes (e.g., when switching pages)
  useEffect(() => {
    if (editor && value) {
      try {
        let content;
        if (typeof value === "string" && value.startsWith("{")) {
          // Parse as JSON
          content = JSON.parse(value);
        } else if (typeof value === "string" && value.length > 0) {
          // Convert plain text to TipTap format
          content = {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: value,
                  },
                ],
              },
            ],
          };
        }
        if (content) {
          editor.commands.setContent(content);
        }
      } catch (e) {
        console.warn("Invalid JSON content:", e);
        // Try as plain text
        if (typeof value === "string" && value.length > 0) {
          const plainTextContent = {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: value,
                  },
                ],
              },
            ],
          };
          editor.commands.setContent(plainTextContent);
        }
      }
    }
  }, [value, editor]);

  const addImage = useCallback(
    (url: string) => {
      if (url && editor) {
        const img = new Image();
        img.onload = () => {
          editor
            .chain()
            .focus()
            .insertContent(
              `<img src="${url}" alt="image" class="max-w-full h-auto my-4 rounded" />`,
            )
            .run();
        };
        img.onerror = () => {
          toast.error("Failed to load image");
        };
        img.src = url;
      }
    },
    [editor],
  );

  const addLink = useCallback(() => {
    const url = prompt("Enter link URL:");
    if (url && editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Toolbar - Like Word Document */}
      <div className="flex flex-wrap gap-1 rounded-lg border border-gray-300 bg-gray-50 p-3">
        {/* Text Formatting */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`rounded px-2 py-2 text-sm hover:bg-gray-200 ${
              editor.isActive("bold") ? "bg-gray-300 font-bold" : ""
            }`}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`rounded px-2 py-2 text-sm hover:bg-gray-200 ${
              editor.isActive("italic") ? "bg-gray-300 italic" : ""
            }`}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`rounded px-2 py-2 text-sm hover:bg-gray-200 ${
              editor.isActive("strike") ? "bg-gray-300 line-through" : ""
            }`}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        <div className="mx-1 w-px bg-gray-300" />

        {/* Headings */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`rounded px-2 py-2 text-sm font-bold hover:bg-gray-200 ${
              editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
            }`}
            title="Heading (Large)"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`rounded px-2 py-2 text-sm hover:bg-gray-200 ${
              editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
            }`}
            title="Heading (Medium)"
          >
            H2
          </button>
        </div>

        <div className="mx-1 w-px bg-gray-300" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-2 hover:bg-gray-200 ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-2 hover:bg-gray-200 ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          title="Numbered List"
        >
          1. List
        </button>

        <div className="mx-1 w-px bg-gray-300" />

        {/* Links & Media */}
        <button
          type="button"
          onClick={addLink}
          className="rounded p-2 hover:bg-gray-200"
          title="Add Link"
        >
          🔗 Link
        </button>
        <button
          type="button"
          onClick={() => setIsImagePickerOpen(true)}
          className="rounded p-2 hover:bg-gray-200"
          title="Add Image"
        >
          🖼️ Image
        </button>

        <div className="mx-1 w-px bg-gray-300" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="rounded p-2 hover:bg-gray-200"
          title="Undo"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="rounded p-2 hover:bg-gray-200"
          title="Redo"
        >
          ↷
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelect={(url) => {
          addImage(url);
          setIsImagePickerOpen(false);
        }}
      />
    </div>
  );
}
