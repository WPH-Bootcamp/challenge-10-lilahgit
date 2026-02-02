import { AuthHeaderActions, MobileAvatarAction } from "@/components/AuthHeaderActions";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import SectionHeading from "@/components/SectionHeading";
import { getMostLikedPosts, getRecommendedPosts } from "@/lib/api";
import type { BlogPost, PaginatedResponse } from "@/types/blog";
import { LogOut, Menu, Search, User, X } from "lucide-react";
import Link from "next/link";

type HomeProps = {
  searchParams?: { page?: string; auth?: string; menu?: string };
};

const RECOMMENDED_LIMIT = 5;
const MOST_LIKED_LIMIT = 3;

type HomeLayoutProps = {
  children: React.ReactNode;
};

function ProfileMenuDropdown() {
  return (
    <div className="absolute right-0 top-full mt-3 w-40 rounded-xl border border-neutral-200 bg-white p-2 shadow-sm">
      <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
        <User className="h-4 w-4" aria-hidden="true" />
        Profile
      </Link>
      <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50" type="button">
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Logout
      </button>
    </div>
  );
}

function GuestDesktopActions() {
  return (
    <>
      <Link href="/login" className="text-sm font-medium text-primary-300">
        Login
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-primary-300 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-400"
      >
        Register
      </Link>
    </>
  );
}

function GuestMobileActions() {
  return (
    <>
      <Link href="/search" className="rounded-full p-2 text-neutral-600">
        <Search className="h-5 w-5" aria-hidden="true" />
      </Link>
      <Link href="?menu=auth" className="rounded-full p-2 text-neutral-700">
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Link>
    </>
  );
}

function AuthMobileActions({
  showProfileMenu,
  menuHref,
}: {
  showProfileMenu: boolean;
  menuHref: string;
}) {
  return (
    <div className="relative">
      <Link href={menuHref}>
        <MobileAvatarAction />
      </Link>
      {showProfileMenu ? <ProfileMenuDropdown /> : null}
    </div>
  );
}

function MobileAuthMenuOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
        <Link href="/" className="flex items-center">
          <Logo className="h-6 w-auto" />
        </Link>
        <Link href="/" className="text-neutral-500">
          <X className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
      <div className="flex flex-col items-center gap-4 py-12">
        <Link href="/login" className="text-sm font-semibold text-primary-300">
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-full bg-primary-300 px-10 py-3 text-sm font-semibold text-white"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-25">
      {children}
    </div>
  );
}

function HomeShell({
  children,
  auth,
  menu,
}: {
  children: React.ReactNode;
  auth: boolean;
  menu?: string;
}) {
  const showProfileMenu = menu === "profile";
  const showAuthMenu = menu === "auth";
  const menuHref = auth ? "?auth=1&menu=profile" : "?menu=profile";

  return (
    <>
      <Header
        rightSlot={
          auth ? (
            <AuthHeaderActions
              menuHref={menuHref}
              menu={showProfileMenu ? <ProfileMenuDropdown /> : null}
            />
          ) : (
            <GuestDesktopActions />
          )
        }
        mobileActions={
          auth ? <AuthMobileActions showProfileMenu={showProfileMenu} menuHref={menuHref} /> : <GuestMobileActions />
        }
      />
      <main className="py-8">{children}</main>
      <Footer />
      {!auth && showAuthMenu ? <MobileAuthMenuOverlay /> : null}
    </>
  );
}

type RecommendedSectionProps = {
  data: PaginatedResponse<BlogPost>;
};

function RecommendedSection({ data }: RecommendedSectionProps) {
  return (
    <section className="space-y-6">
      <SectionHeading title="Recommend For You" />
      {data.data.length === 0 ? (
        <EmptyState title="No posts yet" description="Check back soon for fresh stories." />
      ) : (
        <div className="space-y-6">
          {data.data.map((post) => (
            <PostCard key={post.id} post={post} hideImageOnMobile />
          ))}
        </div>
      )}
      <Pagination page={data.page} lastPage={data.lastPage} basePath="/" />
    </section>
  );
}

type MostLikedSectionProps = {
  data: PaginatedResponse<BlogPost>;
};

function MostLikedSection({ data }: MostLikedSectionProps) {
  return (
    <aside className="space-y-6 lg:border-l lg:border-neutral-200 lg:pl-8">
      <SectionHeading title="Most Liked" />
      <div className="space-y-4">
        {data.data.map((post) => (
          <PostCard key={post.id} post={post} variant="compact" />
        ))}
      </div>
    </aside>
  );
}

export default async function Home({ searchParams }: HomeProps) {
  const page = Number(searchParams?.page ?? "1");
  const auth = searchParams?.auth === "1";
  const menu = searchParams?.menu;

  try {
    const [recommended, mostLiked] = await Promise.all([
      getRecommendedPosts(page, RECOMMENDED_LIMIT),
      getMostLikedPosts(1, MOST_LIKED_LIMIT),
    ]);

    return (
      <HomeLayout>
        <HomeShell auth={auth} menu={menu}>
          <Container className="grid gap-10 md:grid-cols-[1fr,240px] lg:grid-cols-[1fr,280px]">
            <RecommendedSection data={recommended} />
            <MostLikedSection data={mostLiked} />
          </Container>
        </HomeShell>
      </HomeLayout>
    );
  } catch {
    return (
      <HomeLayout>
        <HomeShell auth={auth} menu={menu}>
          <Container>
            <EmptyState title="Failed to load posts" description="Please try again later." />
          </Container>
        </HomeShell>
      </HomeLayout>
    );
  }
}

