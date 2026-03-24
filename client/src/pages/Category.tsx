import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { ArticleCard } from "@/components/ArticleCard";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  // Fetch categories
  const { data: categories = [] } = trpc.news.categories.useQuery();

  // Find category by slug
  const category = categories.find((cat) => cat.slug === slug);

  // Fetch articles for this category
  const { data: articles = [], isLoading: articlesLoading } =
    trpc.news.byCategory.useQuery(
      {
        categoryId: category?.id || 0,
        limit: articlesPerPage,
        offset: (currentPage - 1) * articlesPerPage,
      },
      { enabled: !!category }
    );

  if (!category && !articlesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header categories={categories} />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Categoria não encontrada
          </h1>
          <p className="text-muted-foreground mb-6">
            Desculpe, não conseguimos encontrar esta categoria.
          </p>
          <a href="/" className="text-primary hover:underline">
            Voltar para a página inicial
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {category?.name}
          </h1>
          <p className="text-muted-foreground">
            {category?.description}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-transparent rounded mt-4" />
        </div>

        {/* Articles Grid */}
        {articlesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {articles.map((article) => (
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

            {/* Pagination */}
            <div className="flex justify-center gap-2 mb-12">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-foreground">
                Página {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={articles.length < articlesPerPage}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próxima
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma notícia disponível nesta categoria
          </div>
        )}

        {/* AdSense Space */}
        <section className="bg-muted rounded-lg p-8 text-center my-12">
          <p className="text-muted-foreground text-sm">
            Espaço reservado para anúncios (Google AdSense)
          </p>
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
