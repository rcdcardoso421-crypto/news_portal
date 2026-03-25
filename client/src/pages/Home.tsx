import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { ArticleCard } from "@/components/ArticleCard";
import { Loader2 } from "lucide-react";
import { updateMetaTags } from "@/lib/seo";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [allLatestArticles, setAllLatestArticles] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Update SEO meta tags
  useEffect(() => {
    updateMetaTags({
      title: "Impacto News - Informacao que Transforma",
      description: "Portal de noticias automatizado com conteudo reescrito por IA. Acompanhe as ultimas noticias de Politica, Economia, Tecnologia, Esportes e Entretenimento.",
      keywords: "noticias, portal de noticias, ultimas noticias, tecnologia, economia, politica, esportes, entretenimento",
      ogType: "website",
    });
  }, []);

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } =
    trpc.news.categories.useQuery();

  // Fetch latest articles with pagination
  const { data: latestArticles = [], isLoading: latestLoading } =
    trpc.news.latest.useQuery({ limit: 20, offset: (page - 1) * 20 });

  // Fetch trending articles
  const { data: trendingArticles = [], isLoading: trendingLoading } =
    trpc.news.trending.useQuery({ limit: 10 });

  // Fetch articles by category
  const { data: categoryArticles = [], isLoading: categoryLoading } =
    trpc.news.byCategory.useQuery(
      { categoryId: selectedCategory || 0, limit: 12 },
      { enabled: selectedCategory !== null }
    );

  // Accumulate articles from pagination
  useEffect(() => {
    if (latestArticles.length === 0) return; // Evitar atualizar quando vazio
    
    if (page === 1) {
      setAllLatestArticles(latestArticles);
    } else {
      setAllLatestArticles((prev) => [...prev, ...latestArticles]);
      setIsLoadingMore(false);
    }
  }, [latestArticles, page]);

  // Handle infinite scroll
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && !latestLoading && latestArticles.length > 0) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [isLoadingMore, latestLoading, latestArticles.length]);

  // Setup infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || latestLoading || latestArticles.length < 20) return;
      
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      
      if (scrollTop + windowHeight >= docHeight - 300) {
        handleLoadMore();
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadingMore, latestLoading, latestArticles.length, handleLoadMore]);

  // Set first category as default
  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories]);

  const featuredArticles = latestArticles.slice(0, 5).map((article) => ({
    id: article.id,
    title: article.title,
    description: article.description || "",
    imageUrl: article.imageUrl,
    views: article.views,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Carousel */}
        {!latestLoading && featuredArticles.length > 0 && (
          <section className="mb-12">
            <FeaturedCarousel articles={featuredArticles} />
          </section>
        )}

        {/* Latest News Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Últimas Notícias
            </h2>
            <div className="h-1 flex-grow ml-4 bg-gradient-to-r from-primary to-transparent rounded" />
          </div>

          {allLatestArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allLatestArticles.map((article) => (
                  <ArticleCard
                    key={`${article.id}-${page}`}
                    id={article.id}
                    title={article.title}
                    description={article.description || ""}
                    imageUrl={article.imageUrl}
                    views={article.views}
                    publishedAt={article.publishedAt}
                  />
                ))}
              </div>
              {/* Load more trigger */}
              <div
                ref={loadMoreRef}
                className="mt-8 flex justify-center"
              >
                {isLoadingMore && (
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                )}
              </div>
            </>
          ) : latestLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma notícia disponível no momento
            </div>
          )}
        </section>

        {/* Trending Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              🔥 Trending Agora
            </h2>
            <div className="h-1 flex-grow ml-4 bg-gradient-to-r from-primary to-transparent rounded" />
          </div>

          {trendingLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : trendingArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {trendingArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="relative group cursor-pointer overflow-hidden rounded-lg h-48"
                >
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-between p-4">
                    <div className="text-white text-3xl font-bold opacity-20">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-300 mt-1">
                        👁️ {article.views}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma notícia em trending
            </div>
          )}
        </section>

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Categorias
              </h2>
              <div className="h-1 flex-grow ml-4 bg-gradient-to-r from-primary to-transparent rounded" />
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-card text-foreground border border-border hover:border-primary"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Category Articles */}
            {categoryLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : categoryArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryArticles.slice(0, 8).map((article) => (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    description={article.description || ""}
                    imageUrl={article.imageUrl}
                    views={article.views}
                    publishedAt={article.publishedAt}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma notícia nesta categoria
              </div>
            )}
          </section>
        )}

        {/* AdSense Space */}
        <section className="my-12 bg-muted rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Espaço reservado para anúncios (Google AdSense)
          </p>
        </section>

        {/* Most Read Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              📚 Mais Lidas
            </h2>
            <div className="h-1 flex-grow ml-4 bg-gradient-to-r from-primary to-transparent rounded" />
          </div>

          {trendingLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : trendingArticles.length > 0 ? (
            <div className="space-y-4">
              {trendingArticles.slice(0, 5).map((article, index) => (
                <a
                  key={article.id}
                  href={`/artigo/${article.id}`}
                  className="flex gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-lg transition-shadow group"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-xl">
                    #{index + 1}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      👁️ {article.views} visualizações
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma notícia disponível
            </div>
          )}
        </section>
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
