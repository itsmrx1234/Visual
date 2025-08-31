import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, Image, Search, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type SearchResult } from "@shared/schema";

interface ImageUploadProps {
  onSearchStart: () => void;
  onSearchComplete: (results: SearchResult[], imageUrl?: string) => void;
  uploadedImage: string | null;
}

export default function ImageUpload({ onSearchStart, onSearchComplete, uploadedImage }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const searchByUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('minSimilarity', '0.3');
      formData.append('limit', '20');
      
      const response = await apiRequest('POST', '/api/search/upload', formData);
      return response.json();
    },
    onSuccess: (data) => {
      onSearchComplete(data.results);
      toast({
        title: "Search Complete",
        description: `Found ${data.results.length} similar products`,
      });
    },
    onError: (error) => {
      console.error('Upload search failed:', error);
      toast({
        title: "Search Failed",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const searchByUrlMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest('POST', '/api/search/url', {
        imageUrl: url,
        minSimilarity: 0.3,
        limit: 20,
      });
      return response.json();
    },
    onSuccess: (data) => {
      onSearchComplete(data.results, imageUrl);
      toast({
        title: "Search Complete",
        description: `Found ${data.results.length} similar products`,
      });
    },
    onError: (error) => {
      console.error('URL search failed:', error);
      toast({
        title: "Search Failed",
        description: "Failed to process image URL. Please check the URL and try again.",
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageUrl("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleFileSearch = () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image file first.",
        variant: "destructive",
      });
      return;
    }
    
    onSearchStart();
    searchByUploadMutation.mutate(selectedFile);
  };

  const handleUrlSearch = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "No URL Provided",
        description: "Please enter a valid image URL.",
        variant: "destructive",
      });
      return;
    }

    onSearchStart();
    searchByUrlMutation.mutate(imageUrl.trim());
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="gradient-border animate-slide-up">
        <div className="p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CloudUpload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Upload Product Image</h3>
            <p className="text-muted-foreground text-sm mb-4">Drag and drop an image or click to browse</p>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer bg-muted/5 ${
                isDragActive 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              data-testid="dropzone-upload"
            >
              <input {...getInputProps()} data-testid="input-file-upload" />
              <Image className="w-12 h-12 text-muted-foreground mb-3 mx-auto" />
              <span className="text-muted-foreground">
                {isDragActive ? 'Drop the image here...' : 'Choose file or drag here'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <div className="flex-1 border-t border-border"></div>
            <span className="text-muted-foreground text-sm">OR</span>
            <div className="flex-1 border-t border-border"></div>
          </div>
          
          <div className="space-y-3">
            <Input
              type="url"
              placeholder="Paste image URL here..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-input border-border focus:ring-2 focus:ring-ring"
              data-testid="input-image-url"
            />
            <Button 
              onClick={handleUrlSearch}
              disabled={searchByUrlMutation.isPending || !imageUrl.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              data-testid="button-search-url"
            >
              <Search className="w-4 h-4 mr-2" />
              Find Similar Products
            </Button>
          </div>

          {selectedFile && (
            <Button 
              onClick={handleFileSearch}
              disabled={searchByUploadMutation.isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              data-testid="button-search-file"
            >
              <Search className="w-4 h-4 mr-2" />
              Search with Selected Image
            </Button>
          )}
        </div>
      </div>

      {/* Image Preview */}
      {(previewUrl || uploadedImage) && (
        <Card className="p-6 animate-scale-in" data-testid="card-image-preview">
          <h4 className="font-semibold mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            {previewUrl ? 'Selected Image' : 'Uploaded Image'}
          </h4>
          <img 
            src={previewUrl || uploadedImage || ''} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-lg mb-3"
            data-testid="img-preview"
          />
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span data-testid="text-filename">
              {selectedFile ? selectedFile.name : 'Image from URL'}
            </span>
            <span data-testid="text-filesize">
              {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB` : 'External'}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
