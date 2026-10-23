import {
  User,
  QuestionnaireData,
  GiftIdea,
  MatchedProduct,
  RecommendationRecord,
  SavedFolder,
  Folder,
  AdminAnalytics
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('gift_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async getMe(): Promise<User | null> {
    const token = localStorage.getItem('gift_token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeader()
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  },

  // Recommendations
  async generateRecommendations(questionnaire: QuestionnaireData): Promise<{
    recommendations: GiftIdea[];
    recommendationRecord: RecommendationRecord;
  }> {
    const res = await fetch(`${API_BASE}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(questionnaire)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate recommendations');
    return data;
  },

  // AI Chat
  async chat(
    message: string,
    history?: Array<{ role: string; parts: Array<{ text: string }> } | { sender: string; text: string }>
  ): Promise<{ reply: string; suggestions?: string[] }> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send message');
    return {
      reply: data.reply || 'Here are some curated gift recommendations for you.',
      suggestions: [
        'Explore tech gifts under ₹5,000',
        'Find personalized wedding presents',
        'Gifts for fitness & wellness enthusiasts'
      ]
    };
  },

  async sendChatMessage(
    message: string,
    history: Array<{ sender: 'user' | 'assistant'; text: string }>,
    questionnaire?: Partial<QuestionnaireData>
  ): Promise<string> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, questionnaire })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send message');
    return data.reply;
  },

  // Products
  async getProducts(params?: { category?: string; search?: string; minPrice?: number; maxPrice?: number; festival?: string }): Promise<MatchedProduct[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
    if (params?.festival) query.set('festival', params.festival);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    const data = await res.json();
    return data.products || [];
  },

  async addProduct(product: Omit<MatchedProduct, 'id'>): Promise<MatchedProduct> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create product');
    return data.product;
  },

  async createProduct(product: any): Promise<MatchedProduct> {
    return this.addProduct(product);
  },

  async updateProduct(id: string, product: Partial<MatchedProduct>): Promise<MatchedProduct> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data.product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.ok;
  },

  // History & Saved
  async getHistory(): Promise<RecommendationRecord[]> {
    const res = await fetch(`${API_BASE}/history`, {
      headers: getAuthHeader()
    });
    const data = await res.json();
    return data.history || [];
  },

  async getRecommendationsHistory(): Promise<RecommendationRecord[]> {
    return this.getHistory();
  },

  async getRecommendationById(id: string): Promise<RecommendationRecord | null> {
    const res = await fetch(`${API_BASE}/history/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.recommendation;
  },

  async deleteHistory(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.ok;
  },

  async toggleSave(id: string, folderName?: string): Promise<RecommendationRecord> {
    const res = await fetch(`${API_BASE}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ id, folderName })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save');
    return data.recommendation;
  },

  // Folders
  async getFolders(): Promise<Folder[]> {
    const res = await fetch(`${API_BASE}/folders`);
    const data = await res.json();
    return data.folders || [];
  },

  async createFolder(name: string, description?: string): Promise<Folder> {
    const res = await fetch(`${API_BASE}/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ name, description })
    });
    const data = await res.json();
    return data.folder || { id: Date.now().toString(), name, description, giftIds: [] };
  },

  async deleteFolder(name: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/folders/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    });
    return res.ok;
  },

  // Admin
  async getAdminAnalytics(): Promise<AdminAnalytics> {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getAuthHeader()
    });
    const data = await res.json();
    return data.analytics;
  },

  async getAdminStats(): Promise<any> {
    const analytics = await this.getAdminAnalytics();
    return {
      totalUsers: analytics?.totalUsers || 2,
      totalProducts: analytics?.totalProducts || 16,
      totalRecommendationsGenerated: analytics?.totalRecommendations || 38,
      popularOccasion: analytics?.topOccasions?.[0]?.occasion || 'Birthday'
    };
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeader()
    });
    const data = await res.json();
    return data.users || [];
  }
};
