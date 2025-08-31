// Client-side ML utilities for image processing
export class ImageProcessor {
  static async resizeImage(file: File, maxWidth: number = 224, maxHeight: number = 224): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and resize image
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Image file size must be less than 10MB'
      };
    }

    return { isValid: true };
  }

  static validateImageUrl(url: string): { isValid: boolean; error?: string } {
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol;
      
      if (protocol !== 'http:' && protocol !== 'https:') {
        return {
          isValid: false,
          error: 'Please provide a valid HTTP or HTTPS image URL'
        };
      }

      const pathname = urlObj.pathname.toLowerCase();
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      
      if (!imageExtensions.some(ext => pathname.endsWith(ext))) {
        // Check if URL has image-like query parameters
        if (!url.includes('format=') && !url.includes('auto=format')) {
          return {
            isValid: false,
            error: 'URL must point to an image file or image service'
          };
        }
      }

      return { isValid: true };
    } catch {
      return {
        isValid: false,
        error: 'Please provide a valid image URL'
      };
    }
  }
}

export const categories = [
  'Fashion',
  'Electronics', 
  'Home Decor',
  'Furniture',
  'Accessories',
  'Home'
] as const;

export type Category = typeof categories[number];

export const sortOptions = [
  { value: 'similarity', label: 'Highest Similarity' },
  { value: 'price-low', label: 'Lowest Price' },
  { value: 'price-high', label: 'Highest Price' },
  { value: 'rating', label: 'Highest Rating' },
] as const;
