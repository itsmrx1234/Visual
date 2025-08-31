import { Heart, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type SearchResult } from "@shared/schema";

interface ProductCardProps {
  result: SearchResult;
  viewMode: 'grid' | 'list';
  index: number;
}

export default function ProductCard({ result, viewMode, index }: ProductCardProps) {
  const { product, similarity } = result;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-yellow-400" />);
    }

    return stars;
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in flex"
        style={{ animationDelay: `${index * 0.1}s` }}
        data-testid={`card-product-list-${product.id}`}
      >
        <div className="relative w-48 flex-shrink-0">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
            data-testid={`img-product-${product.id}`}
          />
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
            <span data-testid={`text-similarity-${product.id}`}>
              {Math.round(similarity * 100)}%
            </span>
          </div>
        </div>
        <div className="p-6 flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" data-testid={`badge-category-${product.id}`}>
                  {product.category}
                </Badge>
                <div className="flex text-yellow-400">
                  {renderStars(product.rating || 4.0)}
                </div>
              </div>
              <h4 className="font-semibold text-lg mb-2" data-testid={`text-name-${product.id}`}>
                {product.name}
              </h4>
              <p className="text-muted-foreground text-sm mb-4" data-testid={`text-description-${product.id}`}>
                {product.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-4"
              data-testid={`button-favorite-${product.id}`}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-xl text-primary" data-testid={`text-price-${product.id}`}>
              ${product.price}
            </span>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid={`button-view-details-${product.id}`}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in group"
      style={{ animationDelay: `${index * 0.1}s` }}
      data-testid={`card-product-grid-${product.id}`}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid={`img-product-${product.id}`}
        />
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
          <span data-testid={`text-similarity-${product.id}`}>
            {Math.round(similarity * 100)}%
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 left-3 w-8 h-8 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          data-testid={`button-favorite-${product.id}`}
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" data-testid={`badge-category-${product.id}`}>
            {product.category}
          </Badge>
          <div className="flex text-yellow-400">
            {renderStars(product.rating || 4.0)}
          </div>
        </div>
        <h4 className="font-semibold text-sm mb-2 line-clamp-2" data-testid={`text-name-${product.id}`}>
          {product.name}
        </h4>
        <p className="text-muted-foreground text-xs mb-3 line-clamp-2" data-testid={`text-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary" data-testid={`text-price-${product.id}`}>
            ${product.price}
          </span>
          <Button 
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid={`button-view-details-${product.id}`}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
