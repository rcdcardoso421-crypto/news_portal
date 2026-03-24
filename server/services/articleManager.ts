import { getDb } from "../db";
import { articles, newsCategories, InsertArticle } from "../../drizzle/schema";
import { rewriteTitle, rewriteContent, generateSummary } from "./aiRewriter";
import { fetchNewsByCategory } from "./newsApi";
import { eq } from "drizzle-orm";

/**
 * Processar e salvar artigos do NewsAPI no banco de dados
 */
export async function processAndSaveArticles(
  newsArticles: any[],
  categoryId: number
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  let savedCount = 0;

  for (const newsArticle of newsArticles) {
    try {
      // Verificar se artigo já existe
      const externalId = `newsapi-${Buffer.from(newsArticle.url).toString(
        "base64"
      )}`;

      const existing = await db
        .select()
        .from(articles)
        .where(eq(articles.externalId, externalId))
        .limit(1);

      if (existing.length > 0) {
        continue; // Artigo já existe
      }

      // Reescrever título e conteúdo com IA
      const rewrittenTitle = await rewriteTitle(newsArticle.title);
      const description = newsArticle.description || "";
      const rewrittenDescription = await generateSummary(description, 200);
      const content = newsArticle.content || description;
      const rewrittenContent = await rewriteContent(content, 500);

      // Preparar dados do artigo
      const articleData: InsertArticle = {
        externalId,
        categoryId,
        title: rewrittenTitle,
        originalTitle: newsArticle.title,
        description: rewrittenDescription,
        content: rewrittenContent,
        originalContent: content,
        author: newsArticle.author,
        imageUrl: newsArticle.urlToImage,
        sourceUrl: newsArticle.url,
        sourceName: newsArticle.source?.name,
        publishedAt: new Date(newsArticle.publishedAt),
        isRewritten: 1,
        views: 0,
      };

      // Salvar no banco de dados
      await db.insert(articles).values(articleData);
      savedCount++;

      // Pequeno delay para não sobrecarregar a API de IA
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error processing article:", error);
    }
  }

  return savedCount;
}

/**
 * Atualizar notícias de todas as categorias
 */
export async function updateAllNews(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  // Primeiro, garantir que todas as categorias existem
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

  for (const category of categories) {
    try {
      // Verificar se categoria existe
      const existing = await db
        .select()
        .from(newsCategories)
        .where(eq(newsCategories.slug, category.slug))
        .limit(1);

      let categoryId: number;

      if (existing.length === 0) {
        // Criar categoria
        const result = await db
          .insert(newsCategories)
          .values({
            slug: category.slug,
            name: category.name,
            description: `Notícias sobre ${category.name.toLowerCase()}`,
          });
        // Buscar a categoria criada
        const created = await db
          .select()
          .from(newsCategories)
          .where(eq(newsCategories.slug, category.slug))
          .limit(1);
        categoryId = created[0]?.id || 0;
      } else {
        categoryId = existing[0].id;
      }

      // Buscar notícias do NewsAPI
      const newsArticles = await fetchNewsByCategory(
        category.newsApiCategory,
        20
      );

      if (newsArticles.length > 0) {
        const saved = await processAndSaveArticles(newsArticles, categoryId);
        console.log(
          `[News Update] Categoria ${category.name}: ${saved} novos artigos salvos`
        );
      }
    } catch (error) {
      console.error(`Error updating category ${category.slug}:`, error);
    }
  }
}

/**
 * Incrementar visualizações de um artigo
 */
export async function incrementArticleViews(articleId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const article = await db
      .select()
      .from(articles)
      .where(eq(articles.id, articleId))
      .limit(1);

    if (article.length > 0) {
      await db
        .update(articles)
        .set({ views: (article[0].views || 0) + 1 })
        .where(eq(articles.id, articleId));
    }
  } catch (error) {
    console.error("Error incrementing article views:", error);
  }
}
