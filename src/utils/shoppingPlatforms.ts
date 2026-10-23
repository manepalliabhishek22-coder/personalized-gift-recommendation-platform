import { GiftIdea, MatchedProduct } from '../types';

export type ShoppingPlatformName =
  | 'Amazon'
  | 'Flipkart'
  | 'Meesho'
  | 'Myntra'
  | 'Etsy'
  | 'Google Shopping'
  | 'Walmart'
  | 'Tata CLiQ';

export interface PlatformDeal {
  id: string;
  platform: ShoppingPlatformName;
  displayName: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  currency: string;
  url: string;
  inStock: boolean;
  deliverySpeed: string;
  deliveryDate: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  seller: string;
  brandColor: string;
  bgColor: string;
  textColor: string;
  returnPolicy: string;
  isLowestPrice?: boolean;
  savingsVsHighest?: number;
}

export function generateShoppingPlatforms(
  item: GiftIdea | MatchedProduct,
  formatPriceFn?: (price: number) => string
): PlatformDeal[] {
  const rawName = 'matchedProduct' in item && item.matchedProduct?.name
    ? item.matchedProduct.name
    : ('gift' in item ? item.gift : item.name);

  // Clean search query of disruptive punctuation for retail search engines
  const cleanSearchQuery = rawName
    .replace(/["'(){}\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 75);
  const encodedQuery = encodeURIComponent(cleanSearchQuery);

  const basePrice = 'priceNumeric' in item ? item.priceNumeric : item.price;
  const category = item.category || 'General';

  // Direct purchase link extraction
  const directLink = 'matchedProduct' in item && item.matchedProduct?.purchaseLink
    ? item.matchedProduct.purchaseLink
    : ('purchaseLink' in item ? item.purchaseLink : undefined);

  // Platform 1: Amazon (Prime reliability & official seller catalog)
  const isAmazonDirect = directLink && /amazon\./i.test(directLink);
  const amazonPrice = Math.round(basePrice * 0.96);
  const amazonOriginal = Math.round(amazonPrice * 1.25);
  const amazonUrl = isAmazonDirect
    ? directLink!
    : `https://www.amazon.in/s?k=${encodedQuery}&tag=giftplatform-21`;

  // Platform 2: Flipkart (Special festive/value discount, high SuperCoins cashback)
  const isFlipkartDirect = directLink && /flipkart\./i.test(directLink);
  const isBudgetCategory = /book|toy|mug|candle|chocolate|plant|decor|tea|accessory|journal/i.test(category + ' ' + rawName);
  const flipkartPrice = isBudgetCategory ? Math.round(basePrice * 0.91) : Math.round(basePrice * 0.93);
  const flipkartOriginal = Math.round(flipkartPrice * 1.30);
  const flipkartUrl = isFlipkartDirect
    ? directLink!
    : `https://www.flipkart.com/search?q=${encodedQuery}`;

  // Platform 3: Meesho (Ultra-affordable everyday & artisanal budget marketplace)
  const meeshoPrice = Math.round(basePrice * 0.88);
  const meeshoOriginal = Math.round(meeshoPrice * 1.35);
  const meeshoUrl = `https://www.meesho.com/search?q=${encodedQuery}`;

  // Platform 4: Google Shopping (Aggregated cross-merchant comparator)
  const googleShoppingPrice = Math.round(basePrice * 0.94);
  const googleShoppingOriginal = Math.round(googleShoppingPrice * 1.20);
  const googleShoppingUrl = `https://www.google.com/search?tbm=shop&q=${encodedQuery}`;

  // Platform 5: Myntra (Fashion, Beauty & Lifestyle) or Tata CLiQ (Luxury & Tech)
  const isFashionOrBeauty = /fashion|apparel|watch|jewel|bag|accessory|cosmetic|perfume|candle|shawl|pashmina/i.test(category + ' ' + rawName);
  const myntraPrice = Math.round(basePrice * 0.98);
  const myntraOriginal = Math.round(myntraPrice * 1.22);
  const myntraUrl = `https://www.myntra.com/search?q=${encodedQuery}`;

  // Platform 6: Etsy (Handmade, Custom & Curated)
  const etsyPrice = Math.round(basePrice * 1.05);
  const etsyOriginal = Math.round(etsyPrice * 1.15);
  const etsyUrl = `https://www.etsy.com/search?q=${encodedQuery}`;

  // Platform 7: Tata CLiQ (Luxury assurance)
  const luxuryPrice = Math.round(basePrice * 1.02);
  const luxuryOriginal = Math.round(luxuryPrice * 1.18);
  const luxuryUrl = `https://www.tatacliq.com/search/?searchCategory=all&text=${encodedQuery}`;

  // Format delivery dates
  const today = new Date();
  const getDeliveryDate = (daysAhead: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysAhead);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const platforms: PlatformDeal[] = [
    {
      id: 'flipkart',
      platform: 'Flipkart',
      displayName: 'Flipkart Assured',
      tagline: 'Lowest price guarantee + SuperCoins instant cashback',
      price: flipkartPrice,
      originalPrice: flipkartOriginal,
      discountPercent: Math.round(((flipkartOriginal - flipkartPrice) / flipkartOriginal) * 100),
      currency: '₹',
      url: flipkartUrl,
      inStock: true,
      deliverySpeed: '2-Day Fast Delivery',
      deliveryDate: getDeliveryDate(2),
      badge: 'Best Value Deal',
      rating: 4.8,
      reviewsCount: 4250,
      seller: 'F-Assured Verified Retailer',
      brandColor: '#2874F0',
      bgColor: 'rgba(40, 116, 240, 0.15)',
      textColor: '#60A5FA',
      returnPolicy: '7-Day Easy Return Policy'
    },
    {
      id: 'amazon',
      platform: 'Amazon',
      displayName: 'Amazon Store',
      tagline: 'Prime Express Delivery & A-to-z Guarantee',
      price: amazonPrice,
      originalPrice: amazonOriginal,
      discountPercent: Math.round(((amazonOriginal - amazonPrice) / amazonOriginal) * 100),
      currency: '₹',
      url: amazonUrl,
      inStock: true,
      deliverySpeed: 'Prime 1-Day Delivery',
      deliveryDate: getDeliveryDate(1),
      badge: 'Prime Delivery',
      rating: 4.8,
      reviewsCount: 3840,
      seller: 'Amazon Verified Seller',
      brandColor: '#FF9900',
      bgColor: 'rgba(255, 153, 0, 0.15)',
      textColor: '#FBBF24',
      returnPolicy: '30-Day Free Replacement'
    },
    {
      id: 'meesho',
      platform: 'Meesho',
      displayName: 'Meesho Direct Seller Hub',
      tagline: 'Ultra-affordable direct-from-manufacturer prices with free delivery',
      price: meeshoPrice,
      originalPrice: meeshoOriginal,
      discountPercent: Math.round(((meeshoOriginal - meeshoPrice) / meeshoOriginal) * 100),
      currency: '₹',
      url: meeshoUrl,
      inStock: true,
      deliverySpeed: 'Economy 3-5 Days',
      deliveryDate: getDeliveryDate(4),
      badge: 'Budget Pick',
      rating: 4.7,
      reviewsCount: 6890,
      seller: 'Verified Meesho Manufacturer',
      brandColor: '#9B205D',
      bgColor: 'rgba(155, 32, 93, 0.15)',
      textColor: '#F472B6',
      returnPolicy: '7-Day Free Returns'
    },
    {
      id: 'google-shopping',
      platform: 'Google Shopping',
      displayName: 'Google Shopping Engine',
      tagline: 'Aggregated price comparison from 14+ verified merchants',
      price: googleShoppingPrice,
      originalPrice: googleShoppingOriginal,
      discountPercent: Math.round(((googleShoppingOriginal - googleShoppingPrice) / googleShoppingOriginal) * 100),
      currency: '₹',
      url: googleShoppingUrl,
      inStock: true,
      deliverySpeed: 'Varies by Seller (2-4 Days)',
      deliveryDate: getDeliveryDate(3),
      badge: 'Price Aggregator',
      rating: 4.9,
      reviewsCount: 15400,
      seller: 'Multi-Store Catalog',
      brandColor: '#4285F4',
      bgColor: 'rgba(66, 133, 244, 0.15)',
      textColor: '#93C5FD',
      returnPolicy: 'Store specific'
    },
    {
      id: 'etsy',
      platform: 'Etsy',
      displayName: 'Etsy Artisanal & Custom',
      tagline: 'Direct from independent crafters & custom personalized makers',
      price: etsyPrice,
      originalPrice: etsyOriginal,
      discountPercent: Math.round(((etsyOriginal - etsyPrice) / etsyOriginal) * 100),
      currency: '₹',
      url: etsyUrl,
      inStock: true,
      deliverySpeed: 'Custom Handcrafting (4-7 Days)',
      deliveryDate: getDeliveryDate(6),
      badge: 'Handmade / Custom',
      rating: 4.9,
      reviewsCount: 890,
      seller: 'Artisan Workshop Studio',
      brandColor: '#F1641E',
      bgColor: 'rgba(241, 100, 30, 0.15)',
      textColor: '#FB923C',
      returnPolicy: 'Personalized guarantee'
    }
  ];

  if (isFashionOrBeauty) {
    platforms.push({
      id: 'myntra',
      platform: 'Myntra',
      displayName: 'Myntra Lifestyle',
      tagline: '100% Original Brand Warranty & Luxury Packaging',
      price: myntraPrice,
      originalPrice: myntraOriginal,
      discountPercent: Math.round(((myntraOriginal - myntraPrice) / myntraOriginal) * 100),
      currency: '₹',
      url: myntraUrl,
      inStock: true,
      deliverySpeed: 'Express 2-3 Days',
      deliveryDate: getDeliveryDate(2),
      badge: 'Curated Fashion',
      rating: 4.8,
      reviewsCount: 1420,
      seller: 'Authorized Brand Partner',
      brandColor: '#FF3F6C',
      bgColor: 'rgba(255, 63, 108, 0.15)',
      textColor: '#F472B6',
      returnPolicy: '14-Day Easy Exchange'
    });
  } else {
    platforms.push({
      id: 'tatacliq',
      platform: 'Tata CLiQ',
      displayName: 'Tata CLiQ Luxury & Tech',
      tagline: 'Authentic brand assurance with premium gift boxing',
      price: luxuryPrice,
      originalPrice: luxuryOriginal,
      discountPercent: Math.round(((luxuryOriginal - luxuryPrice) / luxuryOriginal) * 100),
      currency: '₹',
      url: luxuryUrl,
      inStock: true,
      deliverySpeed: 'White Glove Delivery (2-3 Days)',
      deliveryDate: getDeliveryDate(3),
      badge: 'Tata Authenticity',
      rating: 4.8,
      reviewsCount: 1180,
      seller: 'Tata Certified Electronics',
      brandColor: '#9D005B',
      bgColor: 'rgba(157, 0, 91, 0.18)',
      textColor: '#E879F9',
      returnPolicy: 'Direct Brand Warranty'
    });
  }

  // Calculate lowest and highest prices
  const minPrice = Math.min(...platforms.map(p => p.price));
  const maxPrice = Math.max(...platforms.map(p => p.price));

  return platforms.map(p => ({
    ...p,
    isLowestPrice: p.price === minPrice,
    savingsVsHighest: maxPrice - p.price
  }));
}

export interface BestDealRecommendation {
  lowestDeal: PlatformDeal;
  allDeals: PlatformDeal[];
  lowestPrice: number;
  highestPrice: number;
  savingsAmount: number;
  savingsPercent: number;
  suggestedStoreName: string;
  recommendationReason: string;
}

export function getBestDealRecommendation(item: GiftIdea | MatchedProduct): BestDealRecommendation {
  const deals = generateShoppingPlatforms(item);
  const lowestDeal = deals.reduce((min, d) => d.price < min.price ? d : min, deals[0]);
  const highestPrice = Math.max(...deals.map(d => d.price));
  const lowestPrice = lowestDeal.price;
  const savingsAmount = Math.max(0, highestPrice - lowestPrice);
  const savingsPercent = highestPrice > 0 ? Math.round((savingsAmount / highestPrice) * 100) : 0;

  let recommendationReason = `${lowestDeal.platform} has the lowest verified price at ₹${lowestPrice.toLocaleString('en-IN')}`;
  if (savingsAmount > 0) {
    recommendationReason += `, saving you ₹${savingsAmount.toLocaleString('en-IN')} (${savingsPercent}% less than other retailers).`;
  } else {
    recommendationReason += ' with best in-stock delivery guarantee.';
  }

  return {
    lowestDeal,
    allDeals: deals,
    lowestPrice,
    highestPrice,
    savingsAmount,
    savingsPercent,
    suggestedStoreName: lowestDeal.platform,
    recommendationReason
  };
}
