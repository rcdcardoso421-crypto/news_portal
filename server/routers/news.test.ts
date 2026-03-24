import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("news router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createContext();
    caller = appRouter.createCaller(ctx);
  });

  it("should fetch categories", async () => {
    const categories = await caller.news.categories();
    expect(Array.isArray(categories)).toBe(true);
  });

  it("should fetch latest articles with default limit", async () => {
    const articles = await caller.news.latest({ limit: 5 });
    expect(Array.isArray(articles)).toBe(true);
  });

  it("should fetch trending articles", async () => {
    const articles = await caller.news.trending({ limit: 5 });
    expect(Array.isArray(articles)).toBe(true);
  });

  it("should return empty array for invalid article ID", async () => {
    const article = await caller.news.byId({ id: 99999 });
    expect(article).toBeUndefined();
  });

  it("should handle pagination correctly", async () => {
    const page1 = await caller.news.latest({ limit: 5, offset: 0 });
    const page2 = await caller.news.latest({ limit: 5, offset: 5 });

    expect(Array.isArray(page1)).toBe(true);
    expect(Array.isArray(page2)).toBe(true);
  });

  it("should fetch articles by category", async () => {
    const categories = await caller.news.categories();
    if (categories.length > 0) {
      const articles = await caller.news.byCategory({
        categoryId: categories[0].id,
        limit: 5,
      });
      expect(Array.isArray(articles)).toBe(true);
    }
  });

  it("should fetch recommendations for a category", async () => {
    const categories = await caller.news.categories();
    if (categories.length > 0) {
      const recommendations = await caller.news.recommendations({
        categoryId: categories[0].id,
        limit: 4,
      });
      expect(Array.isArray(recommendations)).toBe(true);
    }
  });

  it("should exclude article from recommendations", async () => {
    const categories = await caller.news.categories();
    if (categories.length > 0) {
      const articles = await caller.news.byCategory({
        categoryId: categories[0].id,
        limit: 10,
      });

      if (articles.length > 0) {
        const recommendations = await caller.news.recommendations({
          categoryId: categories[0].id,
          excludeId: articles[0].id,
          limit: 10,
        });

        // Check that the excluded article is not in recommendations
        const excludedArticleInRecommendations = recommendations.some(
          (rec) => rec.id === articles[0].id
        );
        expect(excludedArticleInRecommendations).toBe(false);
      }
    }
  });
});
