import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchRequestSchema } from "@shared/schema";
import { mlService } from "./services/ml-service";
import { sampleProducts } from "./data/products";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize ML service
  await mlService.initializeModel();

  // Initialize sample products
  console.log('Initializing sample products...');
  for (const product of sampleProducts) {
    try {
      await storage.createProduct(product);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  }

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error('Failed to get products:', error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      console.error('Failed to get products by category:', error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Search similar products by image upload
  app.post("/api/search/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const { category, minSimilarity = 0.7, limit = 20 } = req.body;

      // Extract features from uploaded image
      const embeddings = await mlService.extractFeatures(req.file.buffer);

      // Search for similar products
      const results = await storage.searchSimilarProducts(
        embeddings,
        category,
        parseFloat(minSimilarity),
        parseInt(limit)
      );

      // Store the search
      await storage.createSearch({
        embeddings,
        imageUrl: null
      });

      res.json({
        results,
        total: results.length,
        query: {
          category: category || 'all',
          minSimilarity: parseFloat(minSimilarity),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Search upload failed:', error);
      res.status(500).json({ message: "Failed to process image search" });
    }
  });

  // Search similar products by image URL
  app.post("/api/search/url", async (req, res) => {
    try {
      const parseResult = searchRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: parseResult.error.errors
        });
      }

      const { imageUrl, category, minSimilarity, limit } = parseResult.data;

      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
      }

      // Extract features from image URL
      const embeddings = await mlService.extractFeaturesFromUrl(imageUrl);

      // Search for similar products
      const results = await storage.searchSimilarProducts(
        embeddings,
        category,
        minSimilarity,
        limit
      );

      // Store the search
      await storage.createSearch({
        embeddings,
        imageUrl
      });

      res.json({
        results,
        total: results.length,
        query: {
          imageUrl,
          category: category || 'all',
          minSimilarity,
          limit
        }
      });
    } catch (error) {
      console.error('Search URL failed:', error);
      res.status(500).json({ message: "Failed to process image search" });
    }
  });

  // Get search history (optional feature)
  app.get("/api/searches", async (req, res) => {
    try {
      // For now, just return empty array since we don't have a way to get all searches
      res.json([]);
    } catch (error) {
      console.error('Failed to get search history:', error);
      res.status(500).json({ message: "Failed to fetch search history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
