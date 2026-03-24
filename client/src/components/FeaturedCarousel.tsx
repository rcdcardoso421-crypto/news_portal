import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedArticle {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  views: number;
}

interface FeaturedCarouselProps {
  articles: FeaturedArticle[];
}

export function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay, articles.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? articles.length - 1 : prev - 1
    );
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
    setAutoPlay(false);
  };

  if (articles.length === 0) {
    return null;
  }

  const current = articles[currentIndex];

  return (
    <div
      className="relative h-96 sm:h-[500px] rounded-lg overflow-hidden group"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Background image */}
      {current.imageUrl && (
        <img
          src={current.imageUrl}
          alt={current.title}
          className="w-full h-full object-cover"
        />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
        <Link href={`/artigo/${current.id}`}>
          <a className="group/link">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 line-clamp-3 group-hover/link:underline">
              {current.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-200 line-clamp-2 mb-4">
              {current.description}
            </p>
          </a>
        </Link>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300">
            👁️ {current.views} visualizações
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/20 border-white/40 text-white hover:bg-white/30"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/20 border-white/40 text-white hover:bg-white/30"
              onClick={goToNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setAutoPlay(false);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
