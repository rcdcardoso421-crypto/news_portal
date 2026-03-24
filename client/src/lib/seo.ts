/**
 * Utilitários para SEO e meta tags
 */

export interface SEOMetaTags {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterCreator?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

/**
 * Atualizar meta tags do documento
 */
export function updateMetaTags(seo: SEOMetaTags) {
  // Title
  document.title = seo.title;
  updateMetaTag("og:title", seo.title);
  updateMetaTag("twitter:title", seo.title);

  // Description
  updateMetaTag("description", seo.description);
  updateMetaTag("og:description", seo.description);
  updateMetaTag("twitter:description", seo.description);

  // Keywords
  if (seo.keywords) {
    updateMetaTag("keywords", seo.keywords);
  }

  // Open Graph
  if (seo.ogImage) {
    updateMetaTag("og:image", seo.ogImage);
    updateMetaTag("twitter:image", seo.ogImage);
  }

  if (seo.ogUrl) {
    updateMetaTag("og:url", seo.ogUrl);
  }

  if (seo.ogType) {
    updateMetaTag("og:type", seo.ogType);
  }

  // Twitter
  if (seo.twitterCard) {
    updateMetaTag("twitter:card", seo.twitterCard);
  }

  if (seo.twitterCreator) {
    updateMetaTag("twitter:creator", seo.twitterCreator);
  }

  // Article metadata
  if (seo.author) {
    updateMetaTag("author", seo.author);
  }

  if (seo.publishedDate) {
    updateMetaTag("article:published_time", seo.publishedDate);
  }

  if (seo.modifiedDate) {
    updateMetaTag("article:modified_time", seo.modifiedDate);
  }
}

/**
 * Atualizar ou criar meta tag
 */
function updateMetaTag(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    if (name.startsWith("og:") || name.startsWith("article:")) {
      tag.setAttribute("property", name);
    } else {
      tag.setAttribute("name", name);
    }
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

/**
 * Gerar schema.org JSON-LD para artigo
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: article.image,
    author: {
      "@type": "Organization",
      name: article.author || "NotíciasAI",
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    url: article.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  };

  return schema;
}

/**
 * Injetar schema.org JSON-LD no documento
 */
export function injectSchema(schema: any) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
