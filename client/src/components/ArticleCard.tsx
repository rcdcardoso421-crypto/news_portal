import { Link } from "wouter";
import { Eye, Clock } from "lucide-react";

interface ArticleCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  views: number;
  publishedAt: Date | null;
  readingTime?: number;
}

export function ArticleCard({
  id,
  title,
  description,
  imageUrl,
  views,
  publishedAt,
  readingTime = 3,
}: ArticleCardProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recente";

  return (
    <Link href={`/artigo/${id}`}>
      <a className="group block bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300 h-full">
        {/* Image */}
        {imageUrl && (
          <div className="relative overflow-hidden bg-muted h-40 sm:h-48">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-4 flex flex-col h-full">
          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg line-clamp-2 text-card-foreground group-hover:text-primary transition-colors mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-grow">
            {description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {views}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readingTime}min
              </span>
            </div>
            <time dateTime={publishedAt?.toISOString()}>{formattedDate}</time>
          </div>
        </div>
      </a>
    </Link>
  );
}
