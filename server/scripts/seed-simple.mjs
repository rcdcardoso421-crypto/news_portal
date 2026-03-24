import { getDb } from "../db.ts";
import { articles, newsCategories } from "../../drizzle/schema.ts";
import { eq } from "drizzle-orm";

const NEWSAPI_KEY = "bf39c68958f44f0695efb061be0ecec1";
const NEWSAPI_BASE_URL = "https://newsapi.org/v2";

async function fetchNews(category, limit = 20) {
  try {
    const params = new URLSearchParams({
      category,
      pageSize: limit.toString(),
      apiKey: NEWSAPI_KEY,
      sortBy: "publishedAt",
      language: "pt",
    });

    console.log(`[Seed] Fetching ${category}...`);
    const response = await fetch(`${NEWSAPI_BASE_URL}/top-headlines?${params}`);

    if (!response.ok) {
      console.error(`[Seed] NewsAPI error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data.status !== "ok") {
      console.error(`[Seed] NewsAPI error: ${data.status}`);
      return [];
    }

    console.log(`[Seed] Got ${data.articles.length} articles from ${category}`);
    return data.articles || [];
  } catch (error) {
    console.error(`[Seed] Error fetching ${category}:`, error);
    return [];
  }
}

async function seedNews() {
  const db = await getDb();
  if (!db) {
    console.error("[Seed] ❌ Cannot connect to database");
    process.exit(1);
  }

  const categories = [
    { slug: "politica", name: "Política", newsApiCategory: "politics" },
    { slug: "economia", name: "Economia", newsApiCategory: "business" },
    { slug: "tecnologia", name: "Tecnologia", newsApiCategory: "technology" },
    { slug: "esportes", name: "Esportes", newsApiCategory: "sports" },
    {
      slug: "entretenimento",
      name: "Entretenimento",
      newsApiCategory: "entertainment",
    },
  ];

  let totalSaved = 0;

  for (const category of categories) {
    try {
      // Ensure category exists
      const existing = await db
        .select()
        .from(newsCategories)
        .where(eq(newsCategories.slug, category.slug))
        .limit(1);

      let categoryId;

      if (existing.length === 0) {
        console.log(`[Seed] Creating category: ${category.name}`);
        await db.insert(newsCategories).values({
          slug: category.slug,
          name: category.name,
          description: `Notícias sobre ${category.name.toLowerCase()}`,
        });

        const created = await db
          .select()
          .from(newsCategories)
          .where(eq(newsCategories.slug, category.slug))
          .limit(1);
        categoryId = created[0]?.id;
      } else {
        categoryId = existing[0].id;
      }

      // Fetch articles
      const newsArticles = await fetchNews(category.newsApiCategory, 10);

      if (newsArticles.length === 0) {
        console.log(`[Seed] ⚠️  No articles for ${category.name}`);
        continue;
      }

      // Save articles
      for (const newsArticle of newsArticles) {
        try {
          const externalId = `newsapi-${Buffer.from(newsArticle.url).toString(
            "base64"
          )}`;

          const existing = await db
            .select()
            .from(articles)
            .where(eq(articles.externalId, externalId))
            .limit(1);

          if (existing.length > 0) {
            continue;
          }

          await db.insert(articles).values({
            externalId,
            categoryId,
            title: newsArticle.title,
            originalTitle: newsArticle.title,
            description: newsArticle.description || "",
            content: newsArticle.content || newsArticle.description || "",
            originalContent: newsArticle.content || newsArticle.description || "",
            author: newsArticle.author,
            imageUrl: newsArticle.urlToImage,
            sourceUrl: newsArticle.url,
            sourceName: newsArticle.source?.name,
            publishedAt: new Date(newsArticle.publishedAt),
            isRewritten: 0,
            views: 0,
          });

          totalSaved++;
          console.log(`[Seed] ✅ Saved: ${newsArticle.title.substring(0, 50)}...`);
        } catch (error) {
          console.error(`[Seed] Error saving article:`, error);
        }
      }

      console.log(`[Seed] Completed ${category.name}`);
    } catch (error) {
      console.error(`[Seed] Error with category ${category.slug}:`, error);
    }
  }

  console.log(`[Seed] ✅ Seeding complete! Saved ${totalSaved} articles`);
  process.exit(0);
}

seedNews();
