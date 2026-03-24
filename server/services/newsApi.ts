import { ENV } from "../_core/env";

export interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

const NEWSAPI_BASE_URL = "https://newsapi.org/v2";

/**
 * Buscar notícias por categoria usando NewsAPI
 */
export async function fetchNewsByCategory(
  category: string,
  limit = 20
): Promise<NewsApiArticle[]> {
  try {
    const params = new URLSearchParams({
      category,
      pageSize: limit.toString(),
      apiKey: ENV.newsapiKey,
      sortBy: "publishedAt",
      language: "pt",
    });

    const response = await fetch(`${NEWSAPI_BASE_URL}/top-headlines?${params}`);

    if (!response.ok) {
      console.error(`NewsAPI error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: NewsApiResponse = await response.json();

    if (data.status !== "ok") {
      console.error(`NewsAPI returned error: ${data.status}`);
      return [];
    }

    return data.articles || [];
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error);
    return [];
  }
}

/**
 * Buscar notícias por palavra-chave
 */
export async function searchNews(
  query: string,
  limit = 20
): Promise<NewsApiArticle[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      pageSize: limit.toString(),
      apiKey: ENV.newsapiKey,
      sortBy: "publishedAt",
      language: "pt",
    });

    const response = await fetch(`${NEWSAPI_BASE_URL}/everything?${params}`);

    if (!response.ok) {
      console.error(`NewsAPI error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: NewsApiResponse = await response.json();

    if (data.status !== "ok") {
      console.error(`NewsAPI returned error: ${data.status}`);
      return [];
    }

    return data.articles || [];
  } catch (error) {
    console.error("Error searching news:", error);
    return [];
  }
}

/**
 * Mapeamento de categorias NewsAPI para slugs internos
 */
export const CATEGORY_MAPPING: Record<string, string> = {
  business: "economia",
  entertainment: "entretenimento",
  general: "geral",
  health: "saude",
  science: "ciencia",
  sports: "esportes",
  technology: "tecnologia",
  politics: "politica",
};

/**
 * Obter todas as categorias disponíveis
 */
export function getAvailableCategories() {
  return Object.entries(CATEGORY_MAPPING).map(([key, value]) => ({
    newsApiCategory: key,
    slug: value,
  }));
}
