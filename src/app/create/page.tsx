"use client";

import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { useCreatePost } from "@/features/posts/hooks/usePosts";
import { validatePostImage } from "@/features/posts/validators/postValidator";
import type { ApiError } from "@/shared/lib/api/apiClient";
import { getToken } from "@/shared/lib/auth/token";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  Image as ImageIcon,
  Indent,
  Italic,
  Link2,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
  Outdent,
  Strikethrough,
  Unlink,
  UploadCloud,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

type FormState = {
  title: string;
  tags: string;
};

type FieldErrors = {
  title?: string;
  content?: string;
  tags?: string;
  image?: string;
};

type EditorBlockType = "P" | "H1" | "H2" | "H3";

function extractText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function isEditorEmpty(html: string) {
  return extractText(html).length === 0;
}

function toggleWrapTag(tag: "b" | "i" | "s", icon: ReactNode, active: boolean, onClick: () => void) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`rounded-md p-1 ${active ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:text-neutral-900"}`}
    >
      {icon}
      <span className="sr-only">{tag}</span>
    </button>
  );
}

export default function WritePostPage() {
  const router = useRouter();
  const createPostMutation = useCreatePost();
  const editorRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>({ title: "", tags: "" });
  const [contentHtml, setContentHtml] = useState("");
  const [blockType, setBlockType] = useState<EditorBlockType>("P");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");

  const tags = useMemo(
    () =>
      form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [form.tags],
  );

  useEffect(() => {
    if (!image) {
      setImagePreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const refreshToolbarState = () => {
    setIsBold(Boolean(document.queryCommandState("bold")));
    setIsItalic(Boolean(document.queryCommandState("italic")));
    setIsStrike(Boolean(document.queryCommandState("strikeThrough")));
  };

  const executeCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    const nextHtml = editorRef.current?.innerHTML ?? "";
    setContentHtml(nextHtml);
    refreshToolbarState();
  };

  const applyBlockType = (nextType: EditorBlockType) => {
    setBlockType(nextType);
    executeCommand("formatBlock", nextType === "P" ? "P" : nextType);
  };

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFieldErrors((prev) => ({ ...prev, image: undefined }));
    if (!validatePostImage(selectedFile)) {
      setImage(null);
      setFieldErrors((prev) => ({
        ...prev,
        image: "Image must be PNG/JPG and smaller than 5MB.",
      }));
      return;
    }

    setImage(selectedFile);
  };

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};

    if (!getToken()) {
      setFormError("Please login first.");
      router.push("/login");
      return false;
    }

    if (!form.title.trim()) nextErrors.title = "Title is required.";
    if (isEditorEmpty(contentHtml)) nextErrors.content = "Content is required.";
    if (tags.length === 0) nextErrors.tags = "At least one tag is required.";
    if (!image) nextErrors.image = "Cover image is required.";

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!validate() || !image) return;

    try {
      const created = await createPostMutation.mutateAsync({
        title: form.title.trim(),
        content: contentHtml,
        tags,
        image,
      });
      router.push(`/blog/${created.id}`);
      router.refresh();
    } catch (error) {
      const apiError = error as ApiError;
      setFormError(apiError.message || "Failed to create post.");
    }
  };

  return (
    <div className={`min-h-screen bg-neutral-25 ${isFullscreen ? "overflow-hidden" : ""}`}>
      <header className="border-b border-neutral-200 bg-white">
        <Container className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold text-neutral-900">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Write Post
          </Link>
          <div className="h-9 w-9 overflow-hidden rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
            <span className="flex h-full w-full items-center justify-center">JD</span>
          </div>
        </Container>
      </header>

      <main className="py-10">
        <Container>
          <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl space-y-6">
            <label className="block text-sm font-semibold text-neutral-800">
              Title
              <input
                type="text"
                value={form.title}
                onChange={handleChange("title")}
                placeholder="Enter your title"
                className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-lg font-bold text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${
                  fieldErrors.title ? "border-red-400" : "border-neutral-200"
                }`}
              />
              {fieldErrors.title && <span className="mt-2 block text-xs text-red-500">{fieldErrors.title}</span>}
            </label>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-800">Content</label>
              <div className={`rounded-lg border bg-white ${fieldErrors.content ? "border-red-400" : "border-neutral-200"}`}>
                <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 px-3 py-2">
                  <select
                    value={blockType}
                    onChange={(event) => applyBlockType(event.target.value as EditorBlockType)}
                    className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700"
                  >
                    <option value="P">Paragraph</option>
                    <option value="H1">Heading 1</option>
                    <option value="H2">Heading 2</option>
                    <option value="H3">Heading 3</option>
                  </select>

                  <span className="mx-1 h-5 w-px bg-neutral-200" />

                  {toggleWrapTag("b", <Bold className="h-4 w-4" aria-hidden="true" />, isBold, () => executeCommand("bold"))}
                  {toggleWrapTag("s", <Strikethrough className="h-4 w-4" aria-hidden="true" />, isStrike, () => executeCommand("strikeThrough"))}
                  {toggleWrapTag("i", <Italic className="h-4 w-4" aria-hidden="true" />, isItalic, () => executeCommand("italic"))}

                  <span className="mx-1 h-5 w-px bg-neutral-200" />

                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("insertUnorderedList")} className="rounded-md p-1 text-neutral-600 hover:text-neutral-900">
                    <List className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("insertOrderedList")} className="rounded-md p-1 text-neutral-600 hover:text-neutral-900">
                    <ListOrdered className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <span className="mx-1 h-5 w-px bg-neutral-200" />

                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("justifyLeft")} className="rounded-md p-1 text-neutral-600 hover:text-neutral-900">
                    <AlignLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("justifyCenter")} className="rounded-md p-1 text-neutral-600 hover:text-neutral-900">
                    <AlignCenter className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("justifyRight")} className="rounded-md p-1 text-neutral-600 hover:text-neutral-900">
                    <AlignRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("justifyFull")} className="rounded-md p-1 text-neutral-600 hover:text-neutral-900">
                    <AlignJustify className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <span className="mx-1 h-5 w-px bg-neutral-200" />

                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      const url = window.prompt("Enter URL");
                      if (url) executeCommand("createLink", url);
                    }}
                    className="rounded-md p-1 text-neutral-600 hover:text-neutral-900"
                  >
                    <Link2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("unlink")} className="rounded-md p-1 text-neutral-600 hover:text-neutral-900">
                    <Unlink className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      const url = window.prompt("Enter image URL");
                      if (url) executeCommand("insertImage", url);
                    }}
                    className="rounded-md p-1 text-neutral-600 hover:text-neutral-900"
                  >
                    <ImageIcon className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <span className="mx-1 h-5 w-px bg-neutral-200" />

                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("outdent")} className="rounded-md p-1 text-neutral-600 hover:text-neutral-900">
                    <Outdent className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("indent")} className="rounded-md p-1 text-neutral-600 hover:text-neutral-900">
                    <Indent className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <button type="button" onClick={() => setIsFullscreen((prev) => !prev)} className="ml-auto rounded-md p-1 text-neutral-600 hover:text-neutral-900">
                    {isFullscreen ? <Minimize2 className="h-4 w-4" aria-hidden="true" /> : <Maximize2 className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>

                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={() => setContentHtml(editorRef.current?.innerHTML ?? "")}
                  onKeyUp={refreshToolbarState}
                  onMouseUp={refreshToolbarState}
                  data-placeholder="Enter your content"
                  className={`editor-content min-h-[220px] w-full rounded-b-lg px-4 py-3 text-neutral-700 outline-none ${isFullscreen ? "fixed inset-4 z-50 min-h-0 rounded-lg border border-neutral-200 bg-white" : ""}`}
                />
              </div>
              {fieldErrors.content && <span className="text-xs text-red-500">{fieldErrors.content}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-800">Cover Image</label>
              <div className={`rounded-xl border border-dashed px-6 py-6 text-center ${fieldErrors.image ? "border-red-400" : "border-neutral-300"}`}>
                {imagePreviewUrl ? (
                  <div className="w-full">
                    <div className="mx-auto cover-preview w-full max-w-md overflow-hidden rounded-xl bg-neutral-100">
                      <img src={imagePreviewUrl} alt="Cover preview" className="h-full w-full object-cover" />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
                      <label className="cursor-pointer rounded-full border border-neutral-200 px-4 py-2 text-neutral-700">
                        Change Image
                        <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleImageChange} />
                      </label>
                      <button
                        className="rounded-full border border-red-200 px-4 py-2 text-red-500"
                        type="button"
                        onClick={() => setImage(null)}
                      >
                        Delete Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-xs font-semibold text-neutral-500">
                      <UploadCloud className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <label className="mt-3 block cursor-pointer text-sm text-neutral-600">
                      <span className="font-semibold text-primary-300">Click to upload</span> or drag and drop
                      <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleImageChange} />
                    </label>
                    <p className="text-xs text-neutral-500">PNG or JPG (max. 5mb)</p>
                  </>
                )}
              </div>
              {fieldErrors.image && <span className="text-xs text-red-500">{fieldErrors.image}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-800">Tags</label>
              <div className={`flex flex-wrap items-center gap-2 rounded-lg border bg-white px-3 py-3 text-sm ${fieldErrors.tags ? "border-red-400" : "border-neutral-200"}`}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600"
                  >
                    {tag}
                    <X className="h-3 w-3 text-neutral-400" aria-hidden="true" />
                  </span>
                ))}
                <input
                  value={form.tags}
                  onChange={handleChange("tags")}
                  placeholder="Enter your tags (comma separated)"
                  className="flex-1 text-sm text-neutral-700 outline-none"
                />
              </div>
              {fieldErrors.tags && <span className="text-xs text-red-500">{fieldErrors.tags}</span>}
            </div>

            {formError && <p className="text-sm font-medium text-red-500">{formError}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createPostMutation.isPending}
                className="w-full rounded-full bg-primary-300 px-10 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {createPostMutation.isPending ? "Creating..." : "Finish"}
              </button>
            </div>
          </form>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
