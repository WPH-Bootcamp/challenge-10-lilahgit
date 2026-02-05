import Container from "@/components/Container";
import DocumentIcon from "@/components/DocumentIcon";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  HomeDesktopActions,
  HomeMobileActions,
} from "@/components/HomeHeaderActions";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { searchPosts } from "@/features/posts/services/postsServices";
import Link from "next/link";
import type { ReactNode } from "react";

type SearchPageProps = {
  searchParams?: Promise<{ query?: string; page?: string }>;
};

const SEARCH_LIMIT = 6;

function SearchLayout({ children, searchValue }: { children: ReactNode; searchValue: string }) {
  return (
    <div className="min-h-screen bg-neutral-25">
      <Header
        searchDefaultValue={searchValue}
        rightSlot={<HomeDesktopActions />}
        mobileActions={<HomeMobileActions />}
        showMobileSearch
      />
      <main className="py-10">{children}</main>
      <Footer />
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = resolvedSearchParams.query?.trim() ?? "";
  const parsedPage = Number(resolvedSearchParams.page ?? "1");
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  if (!query) {
    return (
      <SearchLayout searchValue="">
        <Container className="mx-auto min-h-search max-w-4xl">
          <div className="flex min-h-empty items-center justify-center">
            <EmptyState
              variant="centered"
              icon={<DocumentIcon />}
              title="Start searching"
              description="Type a keyword in the search bar."
            />
          </div>
        </Container>
      </SearchLayout>
    );
  }

  const results = await searchPosts(query, page, SEARCH_LIMIT);

  return (
    <SearchLayout searchValue={query}>
      <Container className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-xl font-semibold text-neutral-900">
          Result for &quot;{query}&quot;
        </h1>
        {results.data.length === 0 ? (
          <div className="flex min-h-empty items-center justify-center">
            <EmptyState
              variant="centered"
              icon={<DocumentIcon />}
              title="No results found"
              description="Try using different keywords"
              action={
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-primary-300 px-8 py-2 text-sm font-semibold text-white"
                >
                  Back to Home
                </Link>
              }
            />
          </div>
        ) : (
          <div className="home-main-col w-full">
            {results.data.map((post) => (
              <PostCard key={post.id} post={post} hideImageOnMobile />
            ))}
            <Pagination
              page={results.page}
              lastPage={results.lastPage}
              basePath="/search"
              query={query}
            />
          </div>
        )}
      </Container>
    </SearchLayout>
  );
}

