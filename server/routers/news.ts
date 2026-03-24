import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  getNewsCategories,
  getArticlesByCategory,
  getTrendingArticles,
  getArticleById,
  getLatestArticles,
} from "../db";
import { incrementArticleViews } from "../services/articleManager";

export const newsRouter = router({
  /**
   * Obter todas as categorias de notícias
   */
  categories: publicProcedure.query(async () => {
    return getNewsCategories();
  }),

  /**
   * Obter notícias por categoria
   */
  byCategory: publicProcedure
    .input(
      z.object({
        categoryId: z.number(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return getArticlesByCategory(input.categoryId, input.limit, input.offset);
    }),

  /**
   * Obter notícias em trending (mais lidas)
   */
  trending: publicProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      return getTrendingArticles(input.limit);
    }),

  /**
   * Obter últimas notícias
   */
  latest: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return getLatestArticles(input.limit, input.offset);
    }),

  /**
   * Obter notícia individual por ID
   */
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const article = await getArticleById(input.id);
      if (article) {
        // Incrementar visualizações
        await incrementArticleViews(input.id);
      }
      return article;
    }),

  /**
   * Buscar notícias por palavra-chave
   */
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      // TODO: Implementar busca full-text no banco de dados
      return [];
    }),

  /**
   * Obter recomendações baseadas em categoria
   */
  recommendations: publicProcedure
    .input(
      z.object({
        categoryId: z.number(),
        excludeId: z.number().optional(),
        limit: z.number().default(5),
      })
    )
    .query(async ({ input }) => {
      const articles = await getArticlesByCategory(input.categoryId, input.limit);
      // Filtrar artigo atual se fornecido
      if (input.excludeId) {
        return articles.filter((a) => a.id !== input.excludeId);
      }
      return articles;
    }),
});
