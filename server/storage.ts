import { type User, type InsertUser, type Product, type InsertProduct, type Search, type InsertSearch, type SearchResult } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  createSearch(search: InsertSearch): Promise<Search>;
  searchSimilarProducts(embeddings: number[], category?: string, minSimilarity?: number, limit?: number): Promise<SearchResult[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private searches: Map<string, Search>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.searches = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      rating: insertProduct.rating ?? 4.0,
      reviewCount: insertProduct.reviewCount ?? 0,
      embeddings: insertProduct.embeddings ?? null,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async createSearch(insertSearch: InsertSearch): Promise<Search> {
    const id = randomUUID();
    const search: Search = { 
      ...insertSearch, 
      id,
      imageUrl: insertSearch.imageUrl ?? null,
      embeddings: insertSearch.embeddings ?? null,
      createdAt: new Date()
    };
    this.searches.set(id, search);
    return search;
  }

  async searchSimilarProducts(
    queryEmbeddings: number[], 
    category?: string, 
    minSimilarity: number = 0.7, 
    limit: number = 20
  ): Promise<SearchResult[]> {
    const products = category 
      ? await this.getProductsByCategory(category)
      : await this.getAllProducts();

    const results: SearchResult[] = [];

    for (const product of products) {
      if (!product.embeddings || product.embeddings.length === 0) continue;

      const similarity = this.cosineSimilarity(queryEmbeddings, product.embeddings);
      
      if (similarity >= minSimilarity) {
        results.push({ product, similarity });
      }
    }

    // Sort by similarity (highest first) and limit results
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export const storage = new MemStorage();
