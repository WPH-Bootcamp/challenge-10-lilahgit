import Container from "@/components/Container";
import Footer from "@/components/Footer";
import {
  AlignLeft,
  ArrowLeft,
  Bold,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Maximize2,
  Strikethrough,
  UploadCloud,
  X,
} from "lucide-react";
import Link from "next/link";

type WritePostPageProps = {
  searchParams?: { state?: string };
};

export default function WritePostPage({ searchParams }: WritePostPageProps) {
  const state = searchParams?.state ?? "init";
  const isFilled = state === "fill" || state === "edit";
  const hasError = state === "error";
  const toolbarActions = [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Strikethrough, label: "Strikethrough" },
    { icon: List, label: "Bulleted list" },
    { icon: ListOrdered, label: "Numbered list" },
    { icon: AlignLeft, label: "Align left" },
    { icon: Link2, label: "Insert link" },
    { icon: ImageIcon, label: "Insert image" },
    { icon: Maximize2, label: "Fullscreen" },
  ];

  return (
    <div className="min-h-screen bg-neutral-25">
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
          <div className="mx-auto w-full max-w-3xl space-y-6">
            <label className="block text-sm font-semibold text-neutral-800">
              Title
              <input
                type="text"
                defaultValue={isFilled ? "5 Reasons to Learn Frontend Development in 2025" : ""}
                placeholder="Enter your title"
                className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${
                  hasError ? "border-red-400" : "border-neutral-200"
                }`}
              />
              {hasError && <span className="mt-2 block text-xs text-red-500">Error Text Helper</span>}
            </label>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-800">Content</label>
              <div className={`rounded-lg border bg-white ${hasError ? "border-red-400" : "border-neutral-200"}`}>
                <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 px-3 py-2">
                  <select className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700">
                    <option>Heading 1</option>
                  </select>
                  <div className="flex items-center gap-2 text-neutral-600">
                    {toolbarActions.map(({ icon: Icon, label }) => (
                      <button
                        key={label}
                        type="button"
                        className="rounded-md p-1 text-neutral-600 hover:text-neutral-900"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={6}
                  defaultValue={
                    isFilled
                      ? "- Lorem ipsum dolor sit amet consectetur.\n- Lorem ipsum dolor sit amet consectetur.\n- Lorem ipsum dolor sit amet consectetur.\n- Lorem ipsum dolor sit amet consectetur."
                      : ""
                  }
                  placeholder="Enter your content"
                  className="w-full resize-none rounded-b-lg px-4 py-3 text-sm text-neutral-700 outline-none"
                />
              </div>
              {hasError && <span className="text-xs text-red-500">Error Text Helper</span>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-800">Cover Image</label>
              <div
                className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-6 text-center ${
                  hasError ? "border-red-400" : "border-neutral-300"
                }`}
              >
                {isFilled ? (
                  <div className="w-full">
                    <div className="mx-auto cover-preview w-full max-w-md overflow-hidden rounded-xl bg-neutral-100">
                      <img
                        src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
                        alt="Cover"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
                      <button className="rounded-full border border-neutral-200 px-4 py-2 text-neutral-700" type="button">
                        Change Image
                      </button>
                      <button className="rounded-full border border-red-200 px-4 py-2 text-red-500" type="button">
                        Delete Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-xs font-semibold text-neutral-500">
                      <UploadCloud className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <p className="mt-3 text-sm text-neutral-600">
                      <span className="font-semibold text-primary-300">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-neutral-500">PNG or JPG (max. 5mb)</p>
                  </>
                )}
              </div>
              {hasError && <span className="text-xs text-red-500">Error Text Helper</span>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-800">Tags</label>
              <div
                className={`flex flex-wrap items-center gap-2 rounded-lg border bg-white px-3 py-3 text-sm ${
                  hasError ? "border-red-400" : "border-neutral-200"
                }`}
              >
                {isFilled ? (
                  <>
                    {["Programming", "Frontend", "Coding"].map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600"
                      >
                        {tag}
                        <X className="h-3 w-3 text-neutral-400" aria-hidden="true" />
                      </span>
                    ))}
                  </>
                ) : null}
                <input
                  placeholder="Enter your tags"
                  className="flex-1 text-sm text-neutral-700 outline-none"
                />
              </div>
              {hasError && <span className="text-xs text-red-500">Error Text Helper</span>}
            </div>

            <div className="flex justify-end">
              <button className="w-full rounded-full bg-primary-300 px-10 py-3 text-sm font-semibold text-white sm:w-auto">
                <span className="sm:hidden">Save</span>
                <span className="hidden sm:inline">Finish</span>
              </button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
