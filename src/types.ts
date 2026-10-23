export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface QuestionnaireData {
  recipientName: string;
  recipientAge: number;
  recipientGender: 'Male' | 'Female' | 'Non-binary' | 'Other';
  relationship: string;
  occasion: string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  personalityTraits: string[];
  interests: string[];
  favoriteColor: string;
  hobbies: string;
  additionalNotes: string;
}

export interface MatchedProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  purchaseLink: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
  festivalTag?: string;
}

export interface GiftIdea {
  id: string;
  gift: string;
  reason: string;
  price: string;
  priceNumeric: number;
  surpriseScore: number; // 1-10
  emotionalValue: 'Low' | 'Moderate' | 'High' | 'Priceless';
  difficulty: 'Easy to Find' | 'Custom / Made-to-Order' | 'Rare / Specialty';
  category: string;
  pros?: string[];
  presentationTip?: string;
  matchedProduct?: MatchedProduct;
}

export interface RecommendationRecord {
  id: string;
  userId?: string;
  recipient: {
    name: string;
    age: number;
    gender: string;
    relationship: string;
  };
  recipientName?: string;
  recipientAge?: number;
  recipientGender?: string;
  relationship?: string;
  occasion: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  personality: string[];
  personalityTraits?: string[];
  interests: string[];
  favoriteColor: string;
  hobbies: string;
  additionalNotes?: string;
  recommendations: GiftIdea[];
  folder?: string;
  folderName?: string;
  isSaved?: boolean;
  isFavorite?: boolean;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  count?: number;
  giftIds?: string[];
  color?: string;
}

export interface SavedFolder {
  id: string;
  name: string;
  count: number;
  color?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'ai';
  text: string;
  timestamp: string | Date;
  suggestions?: string[];
  suggestedGifts?: Partial<GiftIdea>[];
}

export interface AdminAnalytics {
  totalRecommendations: number;
  totalUsers: number;
  totalProducts: number;
  totalSaved: number;
  topOccasions: { occasion: string; count: number }[];
  topCategories: { category: string; count: number }[];
  averageBudget: number;
  popularTraits: { trait: string; count: number }[];
}
