import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ImageUpload from "@/components/image-upload";
import ProductGrid from "@/components/product-grid";
import LoadingOverlay from "@/components/loading-overlay";
import { Eye, Brain, Database, Zap } from "lucide-react";
import { type SearchResult } from "@shared/schema";

export default function Home() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleSearchComplete = (results: SearchResult[], imageUrl?: string) => {
    setSearchResults(results);
    if (imageUrl) {
      setUploadedImage(imageUrl);
    }
    setIsSearching(false);
  };

  const handleSearchStart = () => {
    setIsSearching(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent animate-fade-in">
              Find Similar Products with AI
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              Upload any product image and discover visually similar items from our database of thousands of products
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <ImageUpload 
              onSearchStart={handleSearchStart}
              onSearchComplete={handleSearchComplete}
              uploadedImage={uploadedImage}
            />

            {/* Demo Section */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <Eye className="w-5 h-5 text-primary mr-2" />
                  Try Our Demo
                </h4>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" 
                    alt="Demo handbag" 
                    className="w-full h-20 object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    data-testid="demo-image-handbag"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" 
                    alt="Demo headphones" 
                    className="w-full h-20 object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    data-testid="demo-image-headphones"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" 
                    alt="Demo watch" 
                    className="w-full h-20 object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    data-testid="demo-image-watch"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Click any image above to see similar products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <ProductGrid 
          results={searchResults}
          onLoadMore={() => {}}
          hasMore={false}
        />
      )}

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose VisualMatch?</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powered by advanced AI and machine learning algorithms to deliver the most accurate visual search results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">AI-Powered Search</h4>
              <p className="text-muted-foreground">Advanced neural networks analyze visual features to find the most similar products with high accuracy.</p>
            </div>

            <div className="text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Database className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Massive Database</h4>
              <p className="text-muted-foreground">Search through thousands of products across multiple categories including fashion, electronics, and home goods.</p>
            </div>

            <div className="text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Lightning Fast</h4>
              <p className="text-muted-foreground">Get results in seconds with our optimized search algorithms and cloud infrastructure.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {isSearching && <LoadingOverlay />}
    </div>
  );
}
