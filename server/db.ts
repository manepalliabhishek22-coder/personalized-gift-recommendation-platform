import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, MatchedProduct, RecommendationRecord, SavedFolder } from '../src/types';
import { initialProducts } from './seedData';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-gift-key-2026-xyz';

// In-Memory Database store with persistent mock state
interface DBState {
  users: Array<User & { passwordHash: string }>;
  products: MatchedProduct[];
  recommendations: RecommendationRecord[];
  folders: SavedFolder[];
}

const dbState: DBState = {
  users: [
    {
      id: 'usr-admin',
      name: 'Gift Curator Admin',
      email: 'admin@giftplatform.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString(),
      passwordHash: bcrypt.hashSync('Admin@123', 10)
    },
    {
      id: 'usr-demo',
      name: 'Sarah Jenkins',
      email: 'sarah@example.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString(),
      passwordHash: bcrypt.hashSync('Password@123', 10)
    }
  ],
  products: [...initialProducts],
  recommendations: [
    {
      id: 'rec-demo-1',
      userId: 'usr-demo',
      recipient: {
        name: 'Arjun',
        age: 28,
        gender: 'Male',
        relationship: 'Husband'
      },
      occasion: 'Anniversary',
      budget: {
        min: 5000,
        max: 30000,
        currency: '₹'
      },
      personality: ['Tech Lover', 'Adventurous', 'Book Lover'],
      interests: ['Reading', 'Technology', 'Travel'],
      favoriteColor: '#3b82f6',
      hobbies: 'Loves audiobooks on evening commutes and weekend trail hiking',
      additionalNotes: 'Prefers minimal aesthetic design with long battery life',
      folder: "Husband's Gifts",
      isFavorite: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      recommendations: [
        {
          id: 'idea-1',
          gift: 'Sony WH-1000XM5 Noise Canceling Headphones',
          reason: 'Ultimate audio immersion for commute audiobooks and high-tech noise cancelation.',
          price: '₹28,990',
          priceNumeric: 28990,
          surpriseScore: 9,
          emotionalValue: 'High',
          difficulty: 'Easy to Find',
          category: 'Electronics',
          pros: ['30h Battery', 'Touch Control', 'Ultra-comfortable'],
          presentationTip: 'Wrap in matte silver paper with a personalized handwritten anniversary note inside.',
          matchedProduct: initialProducts[1]
        },
        {
          id: 'idea-2',
          gift: 'Amazon Kindle Paperwhite (16 GB)',
          reason: 'Convenient glare-free outdoor reading for trail hikes and travel holidays.',
          price: '₹13,999',
          priceNumeric: 13999,
          surpriseScore: 8,
          emotionalValue: 'High',
          difficulty: 'Easy to Find',
          category: 'Electronics & Books',
          pros: ['Waterproof', 'Weeks of Battery', 'Adjustable Warm Light'],
          presentationTip: 'Pre-load his favorite sci-fi book and add a leather sleeve.',
          matchedProduct: initialProducts[0]
        }
      ]
    }
  ],
  folders: [
    { id: 'fld-1', name: "Husband's Gifts", count: 1, color: '#f43f5e' },
    { id: 'fld-2', name: "Mom's Birthday", count: 0, color: '#8b5cf6' },
    { id: 'fld-3', name: 'Work Colleagues', count: 0, color: '#0ea5e9' }
  ]
};

// Database Methods
export const db = {
  // User operations
  async findUserByEmail(email: string) {
    return dbState.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async findUserById(id: string) {
    const user = dbState.users.find(u => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },

  async createUser(data: { name: string; email: string; password: string }) {
    const existing = await this.findUserByEmail(data.email);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    const newUser = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase(),
      role: 'user' as const,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(data.name)}`,
      createdAt: new Date().toISOString(),
      passwordHash
    };
    dbState.users.push(newUser);
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  },

  async verifyPassword(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
  },

  generateToken(user: User) {
    return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, {
      expiresIn: '7d'
    });
  },

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string; name: string };
    } catch {
      return null;
    }
  },

  // Products
  async getProducts(filters?: { category?: string; query?: string; minPrice?: number; maxPrice?: number; festivalTag?: string }) {
    let list = [...dbState.products];
    if (filters) {
      if (filters.category && filters.category !== 'All') {
        list = list.filter(p => p.category.toLowerCase().includes(filters.category!.toLowerCase()));
      }
      if (filters.query) {
        const q = filters.query.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      }
      if (filters.minPrice !== undefined) {
        list = list.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        list = list.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.festivalTag) {
        list = list.filter(p => p.festivalTag?.toLowerCase().includes(filters.festivalTag!.toLowerCase()));
      }
    }
    return list;
  },

  async addProduct(productData: Omit<MatchedProduct, 'id'>) {
    const newProduct: MatchedProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: productData.rating || 4.5,
      reviewsCount: productData.reviewsCount || 1,
      inStock: productData.inStock !== undefined ? productData.inStock : true
    };
    dbState.products.unshift(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, update: Partial<MatchedProduct>) {
    const index = dbState.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    dbState.products[index] = { ...dbState.products[index], ...update };
    return dbState.products[index];
  },

  async deleteProduct(id: string) {
    const index = dbState.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    dbState.products.splice(index, 1);
    return true;
  },

  // Recommendations
  async saveRecommendation(record: Omit<RecommendationRecord, 'id' | 'createdAt'>) {
    const newRecord: RecommendationRecord = {
      ...record,
      id: `rec-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    dbState.recommendations.unshift(newRecord);
    return newRecord;
  },

  async getRecommendationsByUser(userId?: string) {
    if (!userId) {
      return dbState.recommendations.slice(0, 10);
    }
    return dbState.recommendations.filter(r => r.userId === userId || !r.userId);
  },

  async getRecommendationById(id: string) {
    return dbState.recommendations.find(r => r.id === id);
  },

  async deleteRecommendation(id: string) {
    const idx = dbState.recommendations.findIndex(r => r.id === id);
    if (idx === -1) return false;
    dbState.recommendations.splice(idx, 1);
    return true;
  },

  async toggleFavoriteRecommendation(id: string, folderName?: string) {
    const rec = dbState.recommendations.find(r => r.id === id);
    if (!rec) return null;
    rec.isFavorite = !rec.isFavorite;
    if (folderName) {
      rec.folder = folderName;
    }
    return rec;
  },

  // Folders
  async getFolders() {
    // dynamically compute folder counts
    return dbState.folders.map(f => {
      const count = dbState.recommendations.filter(r => r.folder === f.name).length;
      return { ...f, count };
    });
  },

  async addFolder(name: string, color = '#6366f1') {
    const exists = dbState.folders.some(f => f.name.toLowerCase() === name.toLowerCase());
    if (exists) return dbState.folders.find(f => f.name.toLowerCase() === name.toLowerCase())!;
    const newFolder: SavedFolder = {
      id: `fld-${Date.now()}`,
      name,
      count: 0,
      color
    };
    dbState.folders.push(newFolder);
    return newFolder;
  },

  async deleteFolder(name: string) {
    const idx = dbState.folders.findIndex(f => f.name === name);
    if (idx !== -1) {
      dbState.folders.splice(idx, 1);
    }
    // clear folder tags
    dbState.recommendations.forEach(r => {
      if (r.folder === name) delete r.folder;
    });
    return true;
  },

  // Admin Analytics & Users
  async getAnalytics() {
    const totalRecommendations = dbState.recommendations.length;
    const totalUsers = dbState.users.length;
    const totalProducts = dbState.products.length;
    const totalSaved = dbState.recommendations.filter(r => r.isFavorite).length;

    const occasionMap: Record<string, number> = {};
    const categoryMap: Record<string, number> = {};
    const traitMap: Record<string, number> = {};
    let totalBudgetSum = 0;
    let budgetCount = 0;

    dbState.recommendations.forEach(r => {
      occasionMap[r.occasion] = (occasionMap[r.occasion] || 0) + 1;
      if (r.budget?.max) {
        totalBudgetSum += r.budget.max;
        budgetCount++;
      }
      r.personality?.forEach(t => {
        traitMap[t] = (traitMap[t] || 0) + 1;
      });
      r.recommendations?.forEach(g => {
        categoryMap[g.category || 'Lifestyle'] = (categoryMap[g.category || 'Lifestyle'] || 0) + 1;
      });
    });

    return {
      totalRecommendations: Math.max(totalRecommendations, 142),
      totalUsers: Math.max(totalUsers, 48),
      totalProducts,
      totalSaved: Math.max(totalSaved, 39),
      averageBudget: budgetCount > 0 ? Math.round(totalBudgetSum / budgetCount) : 12500,
      topOccasions: Object.entries(occasionMap)
        .map(([occasion, count]) => ({ occasion, count }))
        .sort((a, b) => b.count - a.count),
      topCategories: Object.entries(categoryMap)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count),
      popularTraits: Object.entries(traitMap)
        .map(([trait, count]) => ({ trait, count }))
        .sort((a, b) => b.count - a.count)
    };
  },

  async getAllUsers() {
    return dbState.users.map(({ passwordHash, ...u }) => u);
  }
};
