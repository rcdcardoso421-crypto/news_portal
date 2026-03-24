import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { ArticleCard } from "@/components/ArticleCard";
import { Loader2, Share2, Twitter, Facebook, Linkedin, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { updateMetaTags, generateArticleSchema, injectSchema } from "@/lib/seo";

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const articleId = parseInt(id || "0");
  const [copied, setCopied] = useState(false);

  // Fetch categories
  const { data: categories = [] } = trpc.news.categories.useQuery();

  // Fetch article
  const { data: article, isLoading: articleLoading } = trpc.news.byId.useQuery(
    { id: articleId },
    { enabled: articleId > 0 }
  );

  // Fetch recommendations
  const { data: recommendations = [], isLoading: recommendationsLoading } =
    trpc.news.recommendations.useQuery(
      { categoryId: article?.categoryId || 0, excludeId: articleId, limit: 4 },
      { enabled: !!article?.categoryId }
    );

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || "Leia esta notícia";

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Update SEO meta tags when article loads
  useEffect(() => {
    if (article) {
      updateMetaTags({
        title: `${article.title} | NoticiasAI`,
        description: article.description || article.originalTitle,
        keywords: `noticias, ${article.sourceName || "noticia"}`,
        ogImage: article.imageUrl || undefined,
        ogUrl: window.location.href,
        ogType: "article",
        twitterCard: "summary_large_image",
        author: article.author || article.sourceName || undefined,
        publishedDate: article.publishedAt?.toString() || undefined,
      });

      // Inject schema.org JSON-LD
      const schema = generateArticleSchema({
        title: article.title,
        description: article.description || article.originalTitle,
        image: article.imageUrl || undefined,
        author: article.author || article.sourceName || undefined,
        publishedDate: article.publishedAt?.toString() || undefined,
        url: window.location.href,
      });
      injectSchema(schema);
    }
  }, [article]);

  if (articleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header categories={categories} />
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header categories={categories} />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Artigo não encontrado
          </h1>
          <p className="text-muted-foreground mb-6">
            Desculpe, não conseguimos encontrar este artigo.
          </p>
          <a href="/" className="text-primary hover:underline">
            Voltar para a página inicial
          </a>
        </div>
      </div>
    );
  }

  const readingTime = article.content
    ? Math.ceil(article.content.split(/\s+/).length / 200)
    : 3;

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-primary">
            Início
          </a>
          <span>/</span>
          <a href={`/categoria/${article.categoryId}`} className="hover:text-primary">
            Categoria
          </a>
          <span>/</span>
          <span className="text-foreground">{article.title}</span>
        </div>

        {/* Article Header */}
        <article className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Featured Image */}
          {article.imageUrl && (
            <div className="relative w-full h-96 overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {article.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="font-medium">Fonte:</span>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {article.sourceName || "Notícia Original"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span>📅</span>
                <time dateTime={article.publishedAt?.toString()}>
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recente"}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <span>⏱️</span>
                <span>{readingTime} min de leitura</span>
              </div>
              <div className="flex items-center gap-2">
                <span>👁️</span>
                <span>{article.views} visualizações</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="text-sm font-medium text-foreground">Compartilhar:</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare("twitter")}
                className="gap-2"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare("facebook")}
                className="gap-2"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare("linkedin")}
                className="gap-2"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copiado!" : "Copiar link"}
              </Button>
            </div>

            {/* Description */}
            {article.description && (
              <div className="bg-muted p-4 rounded-lg mb-8 italic text-foreground">
                {article.description}
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-sm max-w-none mb-8">
              {article.content ? (
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {article.content}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Conteúdo não disponível. Leia a notícia original no link acima.
                </p>
              )}
            </div>

            {/* Source Link */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
              <p className="text-sm text-foreground mb-2">
                <strong>Quer ler a notícia original?</strong>
              </p>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Clique aqui para acessar a fonte →
              </a>
            </div>

            {/* AdSense Space */}
            <div className="bg-muted rounded-lg p-8 text-center my-8">
              <p className="text-muted-foreground text-sm">
                Espaço reservado para anúncios (Google AdSense)
              </p>
            </div>
          </div>
        </article>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Você também pode gostar
              </h2>
              <div className="h-1 flex-grow ml-4 bg-gradient-to-r from-primary to-transparent rounded" />
            </div>

            {recommendationsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map((rec) => (
                  <ArticleCard
                    key={rec.id}
                    id={rec.id}
                    title={rec.title}
                    description={rec.description || ""}
                    imageUrl={rec.imageUrl}
                    views={rec.views}
                    publishedAt={rec.publishedAt}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Sobre</h4>
              <p className="text-sm">
                Portal de notícias automatizado com conteúdo reescrito por IA
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categorias</h4>
              <ul className="text-sm space-y-2">
                {categories.slice(0, 3).map((cat) => (
                  <li key={cat.id}>
                    <a href={`/categoria/${cat.slug}`} className="hover:underline">
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <p className="text-sm">contato@noticiasai.com</p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm">
            <p>© 2026 NotíciasAI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
