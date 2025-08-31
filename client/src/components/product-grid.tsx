import { useState } from "react";
import { Grid, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/product-card";
import { type SearchResult } from "@shared/schema";

interface ProductGridProps {
  results: SearchResult[];
  onLoadMore: () => void;
  hasMore: boolean;
}

export default function ProductGrid({ results, onLoadMore, hasMore }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('similarity');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredResults = results.filter(result => 
    categoryFilter === 'all' || result.product.category.toLowerCase() === categoryFilter.toLowerCase()
  );

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.product.price - b.product.price;
      case 'price-high':
        return b.product.price - a.product.price;
      case 'rating':
        return (b.product.rating || 0) - (a.product.rating || 0);
      case 'similarity':
      default:
        return b.similarity - a.similarity;
    }
  });

  if (results.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30" data-testid="section-search-results">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h3 className="text-2xl font-bold mb-2">Similar Products Found</h3>
            <p className="text-muted-foreground">
              <span data-testid="text-results-count">{sortedResults.length}</span> products found with{" "}
              <span className="text-primary font-medium">30%+</span> similarity
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="home decor">Home Decor</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="home">Home</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="similarity">Highest Similarity</SelectItem>
                <SelectItem value="price-low">Lowest Price</SelectItem>
                <SelectItem value="price-high">Highest Price</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3 py-1"
                data-testid="button-view-grid"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3 py-1"
                data-testid="button-view-list"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {sortedResults.map((result, index) => (
            <ProductCard 
              key={result.product.id} 
              result={result} 
              viewMode={viewMode}
              index={index}
            />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <Button 
              onClick={onLoadMore}
              variant="secondary"
              className="px-8 py-3 font-medium"
              data-testid="button-load-more"
            >
              <Plus className="w-4 h-4 mr-2" />
              Load More Products
            </Button>
            <p className="text-muted-foreground text-sm mt-3">
              Showing <span data-testid="text-showing-count">{sortedResults.length}</span> of{" "}
              <span data-testid="text-total-count">{results.length}</span> results
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
