import { AuthHeaderActions, MobileAvatarAction } from "@/components/AuthHeaderActions";
import Container from "@/components/Container";
import DocumentIcon from "@/components/DocumentIcon";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Tag from "@/components/Tag";
import { getRecommendedPosts } from "@/lib/api";
import { clampText, formatDateTime } from "@/lib/format";
import type { BlogPost } from "@/types/blog";
import { Eye, PenLine, Pencil, X } from "lucide-react";
import Link from "next/link";

type ProfilePageProps = {
  searchParams?: { tab?: string; state?: string; modal?: string };
};

const PROFILE_POST_LIMIT = 5;

function ProfileBanner() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700">
          <span className="flex h-full w-full items-center justify-center">JD</span>
        </div>
        <div>
          <h2 className="text-base font-semibold text-neutral-900">John Doe</h2>
          <p className="text-sm text-neutral-600">Frontend Developer</p>
        </div>
      </div>
      <Link href="?modal=edit-profile" className="text-sm font-semibold text-primary-300">
        Edit Profile
      </Link>
    </div>
  );
}

function ProfileTabs({ active }: { active: string }) {
  return (
    <div className="flex items-center gap-8 border-b border-neutral-200 text-sm font-semibold">
      <Link
        href="?tab=posts"
        className={`pb-3 ${active === "posts" ? "border-b-2 border-primary-300 text-primary-300" : "text-neutral-500"}`}
      >
        Your Post
      </Link>
      <Link
        href="?tab=password"
        className={`pb-3 ${active === "password" ? "border-b-2 border-primary-300 text-primary-300" : "text-neutral-500"}`}
      >
        Change Password
      </Link>
    </div>
  );
}

function ProfilePostItem({ post }: { post: BlogPost }) {
  const createdAt = formatDateTime(post.createdAt);
  const updatedAt = formatDateTime(post.createdAt);

  return (
    <article className="grid gap-4 border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0 sm:grid-cols-[240px,1fr]">
      <div className="hidden overflow-hidden rounded-xl bg-neutral-100 sm:block">
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">No image</div>
        )}
      </div>
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-neutral-900">{post.title}</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags?.slice(0, 3).map((tag) => (
            <Tag key={`${post.id}-${tag}`} label={tag} />
          ))}
        </div>
        <p className="text-sm text-neutral-600">{clampText(post.content, 160)}</p>
        <p className="text-xs text-neutral-500">
          Created {createdAt} | Last updated {updatedAt}
        </p>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link href="?modal=like" className="text-primary-300">
            Statistic
          </Link>
          <Link href="/create?state=edit" className="text-primary-300">
            Edit
          </Link>
          <Link href="?modal=delete" className="text-red-500">
            Delete
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyPostsState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <DocumentIcon />
      <h3 className="text-base font-semibold text-neutral-900">Your writing journey starts here</h3>
      <p className="text-sm text-neutral-600">No posts yet, but every great writer starts with the first one.</p>
      <Link href="/create" className="inline-flex items-center gap-2 rounded-full bg-primary-300 px-8 py-2 text-sm font-semibold text-white">
        <PenLine className="h-4 w-4" aria-hidden="true" />
        Write Post
      </Link>
    </div>
  );
}

function ChangePasswordForm() {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-neutral-800">
        Current Password
        <div className="relative mt-2">
          <input
            type="password"
            placeholder="Enter current password"
            className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 pr-10 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <Eye className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </label>
      <label className="block text-sm font-semibold text-neutral-800">
        New Password
        <div className="relative mt-2">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 pr-10 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <Eye className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </label>
      <label className="block text-sm font-semibold text-neutral-800">
        Confirm New Password
        <div className="relative mt-2">
          <input
            type="password"
            placeholder="Enter confirm new password"
            className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 pr-10 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <Eye className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </label>
      <button className="w-full rounded-full bg-primary-300 py-3 text-sm font-semibold text-white">
        Update Password
      </button>
    </div>
  );
}

function ModalOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">{children}</div>
    </div>
  );
}

function EditProfileModal() {
  return (
    <ModalOverlay>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">Edit Profile</h3>
        <Link href="/profile" className="text-neutral-500">
          <X className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-neutral-200 text-lg font-semibold text-neutral-700">
            <span className="flex h-full w-full items-center justify-center">JD</span>
          </div>
          <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary-300 text-white">
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
        <div className="w-full space-y-4">
          <label className="block text-sm font-semibold text-neutral-800">
            Name
            <input
              type="text"
              defaultValue="John Doe"
              className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <label className="block text-sm font-semibold text-neutral-800">
            Profile Headline
            <input
              type="text"
              defaultValue="Frontend Developer"
              className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <button className="w-full rounded-full bg-primary-300 py-3 text-sm font-semibold text-white">
            Update Password
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

function StatModal({ type }: { type: "like" | "comment" }) {
  const items =
    type === "like"
      ? [
          { name: "Clarissa", headline: "Frontend Developer" },
          { name: "Marco", headline: "Frontend Developer" },
          { name: "Michael Sailor", headline: "Frontend Developer" },
          { name: "Jessica Jane", headline: "Frontend Developer" },
          { name: "Alexandra", headline: "Frontend Developer" },
        ]
      : [
          {
            name: "Clarissa",
            date: "27 Maret 2025",
            message: "This is super insightful - thanks for sharing!",
          },
          {
            name: "Marco",
            date: "27 Maret 2025",
            message: "Exactly what I needed to read today. Frontend is evolving so fast!",
          },
          {
            name: "Michael Sailor",
            date: "27 Maret 2025",
            message: "Great breakdown! You made complex ideas sound simple.",
          },
        ];

  return (
    <ModalOverlay>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">Statistic</h3>
        <Link href="/profile" className="text-neutral-500">
          <X className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-4 border-b border-neutral-200">
        <div className="flex items-center gap-6 text-sm font-semibold">
          <Link href="?modal=like" className={`pb-3 ${type === "like" ? "border-b-2 border-primary-300 text-primary-300" : "text-neutral-500"}`}>
            Like
          </Link>
          <Link href="?modal=comment" className={`pb-3 ${type === "comment" ? "border-b-2 border-primary-300 text-primary-300" : "text-neutral-500"}`}>
            Comment
          </Link>
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-neutral-900">
        {type === "like" ? "Like (20)" : "Comment (20)"}
      </p>
      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3 border-b border-neutral-200 pb-4 last:border-b-0">
            <div className="h-10 w-10 rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
              <span className="flex h-full w-full items-center justify-center">
                {item.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{item.name}</p>
              {"headline" in item ? (
                <p className="text-xs text-neutral-500">{item.headline}</p>
              ) : (
                <>
                  <p className="text-xs text-neutral-500">{item.date}</p>
                  <p className="text-sm text-neutral-700">{item.message}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </ModalOverlay>
  );
}

function DeleteModal() {
  return (
    <ModalOverlay>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">Delete</h3>
        <Link href="/profile" className="text-neutral-500">
          <X className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <p className="mt-2 text-sm text-neutral-600">Are you sure to delete?</p>
      <div className="mt-6 flex items-center justify-end gap-4">
        <Link href="/profile" className="text-sm font-semibold text-neutral-600">
          Cancel
        </Link>
        <button className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white" type="button">
          Delete
        </button>
      </div>
    </ModalOverlay>
  );
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const tab = searchParams?.tab ?? "posts";
  const state = searchParams?.state ?? "fill";
  const modal = searchParams?.modal;

  const postsResponse = await getRecommendedPosts(1, PROFILE_POST_LIMIT);
  const posts = state === "empty" ? [] : postsResponse.data;

  return (
    <div className="min-h-screen bg-neutral-25">
      <Header rightSlot={<AuthHeaderActions />} mobileActions={<MobileAvatarAction />} />
      <main className="py-10">
        <Container>
          <div className="mx-auto w-full max-w-4xl space-y-6">
            <ProfileBanner />
            <ProfileTabs active={tab} />

            {tab === "password" ? (
              <div className="mx-auto w-full max-w-2xl">
                <ChangePasswordForm />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-neutral-900">{posts.length} Post</p>
                  <Link
                    href="/create"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-300 px-6 py-2 text-sm font-semibold text-white sm:w-auto"
                  >
                    <PenLine className="h-4 w-4" aria-hidden="true" />
                    Write Post
                  </Link>
                </div>
                {posts.length === 0 ? (
                  <EmptyPostsState />
                ) : (
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <ProfilePostItem key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />

      {modal === "edit-profile" ? <EditProfileModal /> : null}
      {modal === "like" ? <StatModal type="like" /> : null}
      {modal === "comment" ? <StatModal type="comment" /> : null}
      {modal === "delete" ? <DeleteModal /> : null}
    </div>
  );
}
