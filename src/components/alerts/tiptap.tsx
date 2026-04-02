"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { createAlertApi } from "@/api/alerts";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function TextEditor() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [isPending, setIsPending] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>write your alert here...</p>",
    immediatelyRender: false,
  });

  if (!editor) return null;

  async function AddAlert() {
    const body = editor?.getHTML();
    if (!body || body === "<p></p>") {
      toast.error("Content is required");
      return;
    }
    const title = "Alert";

    setIsPending(true);

    const res = await createAlertApi({ title, body });
    if (res?.ok) {
      toast.success(res?.data?.message || "Alert created successfully");
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      editor?.commands.clearContent();
      setTitle("");
    } else {
      toast.error(res?.error || "Failed to create alert");
    }
    setIsPending(false);
  }
  return (
    <div className="border rounded-2xl p-6 space-y-5 shadow-sm mt-4 bg-bg ">
      <div className="space-y-2">
        {/* 🔥 Toolbar */}
        <div className="flex flex-wrap gap-1 bg-background p-1 rounded-xl border border-border/50">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-muted ${
              editor.isActive("bold")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            title="Bold"
          >
            <Bold size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-muted ${
              editor.isActive("italic")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            title="Italic"
          >
            <Italic size={18} />
          </button>

          <div className="w-px h-6 bg-border mx-1 self-center" />

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-muted ${
              editor.isActive("heading", { level: 1 })
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-muted ${
              editor.isActive("heading", { level: 2 })
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </button>

          <div className="w-px h-6 bg-border mx-1 self-center" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-muted ${
              editor.isActive("bulletList")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            title="Bullet List"
          >
            <List size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-muted ${
              editor.isActive("orderedList")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            title="Ordered List"
          >
            <ListOrdered size={18} />
          </button>
        </div>

        <EditorContent
          editor={editor}
          className="prose-editor min-h-[200px] outline-none border-none focus:outline-none focus:ring-0"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={AddAlert}
          disabled={isPending}
          className="h-12 px-8 font-semibold shadow-md active:scale-95 transition-all text-white bg-[#267e3a] hover:bg-[#1e612c]"
        >
          {isPending ? (
            <Loader2 className="animate-spin mr-2" size={18} />
          ) : (
            <Save className="mr-2" size={18} />
          )}
          {isPending ? "Creating..." : "Save Alert"}
        </Button>
      </div>
    </div>
  );
}
