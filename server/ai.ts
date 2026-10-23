import { GoogleGenAI, Type } from '@google/genai';
import { QuestionnaireData, GiftIdea, MatchedProduct } from '../src/types';
import { db } from './db';

// Lazy Gemini client initialization
let genAIClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

export async function generateGiftRecommendations(data: QuestionnaireData): Promise<GiftIdea[]> {
  const catalog = await db.getProducts();
  const client = getGeminiClient();

  const promptText = `
You are an elite master gift curator and psychology-driven gift stylist.
Analyze this detailed recipient questionnaire:
- Recipient Name: ${data.recipientName}
- Age: ${data.recipientAge}
- Gender: ${data.recipientGender}
- Relationship to Giver: ${data.relationship}
- Occasion: ${data.occasion}
- Budget Range: ${data.currency} ${data.budgetMin} to ${data.currency} ${data.budgetMax}
- Personality Archetypes: ${data.personalityTraits.join(', ') || 'Eclectic'}
- Key Interests: ${data.interests.join(', ') || 'Varied'}
- Favorite Color Palette: ${data.favoriteColor || 'Not specified'}
- Hobbies: ${data.hobbies || 'Not specified'}
- Additional Context / Notes: ${data.additionalNotes || 'None'}

Retail Catalog Categories Available:
${Array.from(new Set(catalog.map(p => p.category))).join(', ')}

Please generate exactly 10 distinct, highly thoughtful, creative, and personalized gift recommendations spanning practical items, memorable luxury experiences, and emotional keepsakes tailored strictly to this person's interests, budget (${data.currency} ${data.budgetMin}-${data.budgetMax}), and occasion (${data.occasion}).

For each gift, include:
1. gift: Specific product/experience name
2. reason: 1-2 compelling sentences explaining why it resonates with their personality and hobbies
3. price: Formatted price with currency symbol (e.g. "${data.currency} 4,500")
4. priceNumeric: Approximate numeric price value
5. surpriseScore: Integer 1 to 10 (10 being completely unexpected and delightful)
6. emotionalValue: Exactly one of "Low", "Moderate", "High", "Priceless"
7. difficulty: Exactly one of "Easy to Find", "Custom / Made-to-Order", "Rare / Specialty"
8. category: Best category (e.g., Electronics, Fashion & Accessories, Gourmet Food & Cooking, Art & Creativity, Home & Wellness, Fitness & Sports, Books & Knowledge, Luxury Experience)
9. pros: Array of 3 short highlight bullet points
10. presentationTip: A sweet suggestion on how to wrap or present this gift on ${data.occasion}
`;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: promptText,
        config: {
          systemInstruction: 'You are an award-winning personal gift consultant. Return only valid structured JSON.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                gift: { type: Type.STRING },
                reason: { type: Type.STRING },
                price: { type: Type.STRING },
                priceNumeric: { type: Type.NUMBER },
                surpriseScore: { type: Type.INTEGER },
                emotionalValue: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                category: { type: Type.STRING },
                pros: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                presentationTip: { type: Type.STRING }
              },
              required: ['gift', 'reason', 'price', 'priceNumeric', 'surpriseScore', 'emotionalValue', 'difficulty', 'category']
            }
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        if (Array.isArray(parsed) && parsed.length > 0) {
          return matchAndEnrichGifts(parsed, catalog, data);
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart heuristic generator:', err);
    }
  }

  // Smart Heuristic Fallback Generator when API is unavailable
  return generateHeuristicGifts(data, catalog);
}

function matchAndEnrichGifts(items: any[], catalog: MatchedProduct[], data: QuestionnaireData): GiftIdea[] {
  return items.map((item, idx) => {
    // Find closest catalog product matching category or keywords
    const matched = findBestCatalogProduct(item.gift, item.category, catalog);
    const validEmotionalValue = ['Low', 'Moderate', 'High', 'Priceless'].includes(item.emotionalValue)
      ? item.emotionalValue
      : 'High';
    const validDifficulty = ['Easy to Find', 'Custom / Made-to-Order', 'Rare / Specialty'].includes(item.difficulty)
      ? item.difficulty
      : 'Easy to Find';

    return {
      id: `gift-ai-${idx + 1}-${Date.now()}`,
      gift: item.gift || 'Personalized Surprise Gift',
      reason: item.reason || `Tailored thoughtfully for ${data.recipientName} celebrating ${data.occasion}.`,
      price: item.price || `${data.currency} ${item.priceNumeric || Math.round((data.budgetMin + data.budgetMax) / 2)}`,
      priceNumeric: Number(item.priceNumeric) || Math.round((data.budgetMin + data.budgetMax) / 2),
      surpriseScore: Math.min(10, Math.max(1, Number(item.surpriseScore) || 8)),
      emotionalValue: validEmotionalValue as any,
      difficulty: validDifficulty as any,
      category: item.category || 'Curated Gifts',
      pros: Array.isArray(item.pros) && item.pros.length > 0 ? item.pros : ['Unique Selection', 'Thoughtfully Personalized', 'High Utility'],
      presentationTip: item.presentationTip || `Pair with a heartfelt handwritten message in a satin-ribbon box matching their favorite ${data.favoriteColor || 'signature'} tone.`,
      matchedProduct: matched
    };
  });
}

function findBestCatalogProduct(giftName: string, category: string, catalog: MatchedProduct[]): MatchedProduct | undefined {
  const lowerGift = giftName.toLowerCase();
  const lowerCat = category.toLowerCase();

  // 1. Direct name match
  let match = catalog.find(p => lowerGift.includes(p.name.toLowerCase().split(' ')[0]) || p.name.toLowerCase().includes(lowerGift.split(' ')[0]));
  if (match) return match;

  // 2. Category match
  match = catalog.find(p => p.category.toLowerCase().includes(lowerCat) || lowerCat.includes(p.category.toLowerCase()));
  if (match) return match;

  // 3. Fallback pick random or first catalog item
  return catalog[Math.floor(Math.random() * catalog.length)];
}

function generateHeuristicGifts(data: QuestionnaireData, catalog: MatchedProduct[]): GiftIdea[] {
  const currency = data.currency || '₹';
  const minBudget = Number(data.budgetMin) || 300;
  const maxBudget = Number(data.budgetMax) || 5000;
  const midBudget = Math.round((minBudget + maxBudget) / 2);
  const isBudgetFriendly = maxBudget <= 2000;

  let curatedIdeas: Array<Omit<GiftIdea, 'id'>> = [];

  if (isBudgetFriendly) {
    // Highly thoughtful, affordable gifts for everyone under ₹1,500
    curatedIdeas = [
      {
        gift: `Custom Engraved Natural Walnut Bookmark & Traveler's Journal`,
        reason: `A heartfelt, sentimental keepsake honoring ${data.occasion} without breaking the bank, personalized with an inspirational note for ${data.recipientName}.`,
        price: `${currency} ${Math.min(maxBudget, Math.max(minBudget, 249))}`,
        priceNumeric: Math.min(maxBudget, Math.max(minBudget, 249)),
        surpriseScore: 9,
        emotionalValue: 'Priceless',
        difficulty: 'Custom / Made-to-Order',
        category: 'Books & Stationery',
        pros: ['Handcrafted Walnut Wood', 'Custom Engraving Included', 'Recycled Eco-Paper'],
        presentationTip: 'Tuck a handwritten letter inside the journal page tied with natural jute twine.',
        matchedProduct: catalog.find(p => p.id === 'prod-13') || catalog[0]
      },
      {
        gift: `Custom Spotify Acrylic Song Plaque with Ambient Wooden LED Base`,
        reason: `Preserves a song that defines your bond, projecting a warm glowing photo memory on their desk or nightstand.`,
        price: `${currency} ${Math.min(maxBudget, Math.max(minBudget, 399))}`,
        priceNumeric: Math.min(maxBudget, Math.max(minBudget, 399)),
        surpriseScore: 10,
        emotionalValue: 'Priceless',
        difficulty: 'Custom / Made-to-Order',
        category: 'Music & Memories',
        pros: ['Scannable Spotify Code', 'Warm Ambient LED Glow', 'Durable Cast Acrylic'],
        presentationTip: 'Turn off the lights before turning on the LED wooden stand for an instant emotional reveal.',
        matchedProduct: catalog.find(p => p.id === 'prod-14') || catalog[1]
      },
      {
        gift: `Artisan Belgian Dark Chocolate Truffles Box (Pack of 8)`,
        reason: `A rich gourmet indulgence crafted with 70% dark cacao and hazelnut praline that feels decadent yet exceptionally affordable.`,
        price: `${currency} ${Math.min(maxBudget, Math.max(minBudget, 389))}`,
        priceNumeric: Math.min(maxBudget, Math.max(minBudget, 389)),
        surpriseScore: 8,
        emotionalValue: 'High',
        difficulty: 'Easy to Find',
        category: 'Gourmet Food & Cooking',
        pros: ['Pure Belgian Cacao', 'Zero Palm Oil', 'Artisanal Gold Foil Box'],
        presentationTip: 'Present chilled with a celebratory ribbon and handwritten tasting guide.',
        matchedProduct: catalog.find(p => p.id === 'prod-16') || catalog[3]
      },
      {
        gift: `Air-Purifying Live Jade Plant in Glazed Ceramic Planter`,
        reason: `A living symbol of good luck, health, and prosperity that flourishes effortlessly on their study or work desk.`,
        price: `${currency} ${Math.min(maxBudget, Math.max(minBudget, 329))}`,
        priceNumeric: Math.min(maxBudget, Math.max(minBudget, 329)),
        surpriseScore: 8,
        emotionalValue: 'High',
        difficulty: 'Easy to Find',
        category: 'Home & Gardening',
        pros: ['Hardy Air Purifier', 'Minimal Watering Needed', 'Artisan Hand-painted Ceramic Pot'],
        presentationTip: 'Write a sweet note: "May our bond continue growing like this jade plant."',
        matchedProduct: catalog.find(p => p.id === 'prod-17') || catalog[4]
      },
      {
        gift: `Double-Wall Vacuum Insulated Travel Coffee Tumbler (450ml)`,
        reason: `Everyday practical utility keeping their brew steaming hot or ice-cold during daily commutes.`,
        price: `${currency} ${Math.min(maxBudget, Math.max(minBudget, 499))}`,
        priceNumeric: Math.min(maxBudget, Math.max(minBudget, 499)),
        surpriseScore: 7,
        emotionalValue: 'Moderate',
        difficulty: 'Easy to Find',
        category: 'Home & Kitchen',
        pros: ['Spill-Proof Flip Lid', 'Sweat-Free Powder Coating', 'BPA Free 304 Stainless Steel'],
        presentationTip: 'Fill the inside with their favorite candies or a pack of single-serve brew bags.',
        matchedProduct: catalog.find(p => p.id === 'prod-18') || catalog[2]
      },
      {
        gift: `Himalayan Lavender Aromatherapy Bath Salts & Cold-Pressed Soap`,
        reason: `Delivers a restorative, calming home spa escape to unwind and relieve stress after busy days.`,
        price: `${currency} ${Math.min(maxBudget, Math.max(minBudget, 349))}`,
        priceNumeric: Math.min(maxBudget, Math.max(minBudget, 349)),
        surpriseScore: 8,
        emotionalValue: 'High',
        difficulty: 'Easy to Find',
        category: 'Home & Wellness',
        pros: ['100% Pure Essential Oils', 'Organic Shea Butter', 'Relaxes Tired Muscles'],
        presentationTip: 'Wrap in botanical kraft paper with a sprig of dried lavender tucked in the bow.',
        matchedProduct: catalog.find(p => p.id === 'prod-15') || catalog[4]
      },
      {
        gift: `Minimalist Zodiac Constellation Pendant Necklace`,
        reason: `A personalized piece of everyday jewelry celebrating their astrological birth sign in tarnish-resistant gold finish.`,
        price: `${currency} ${Math.min(maxBudget, Math.max(minBudget, 349))}`,
        priceNumeric: Math.min(maxBudget, Math.max(minBudget, 349)),
        surpriseScore: 9,
        emotionalValue: 'High',
        difficulty: 'Easy to Find',
        category: 'Fashion & Accessories',
        pros: ['Hypoallergenic Metal', 'Adjustable 18-inch Chain', 'Dainty Everyday Aesthetic'],
        presentationTip: 'Present inside a plush black velvet envelope pouch with a note on their zodiac strengths.',
        matchedProduct: catalog.find(p => p.id === 'prod-20') || catalog[6]
      },
      {
        gift: `Botanical Amber Glass Soy Wax Scented Candle with Wood Wick`,
        reason: `Fills their room with calming woody amber aromas while crackling gently like a miniature hearth fire.`,
        price: `${currency} ${Math.min(maxBudget, Math.max(minBudget, 449))}`,
        priceNumeric: Math.min(maxBudget, Math.max(minBudget, 449)),
        surpriseScore: 8,
        emotionalValue: 'Moderate',
        difficulty: 'Easy to Find',
        category: 'Home & Wellness',
        pros: ['Crackling Wood Wick', 'Clean 40-Hour Burn', 'Reusable Amber Glass Jar'],
        presentationTip: 'Pair with a vintage box of matchsticks tied together with silk ribbon.',
        matchedProduct: catalog.find(p => p.id === 'prod-24') || catalog[4]
      },
      {
        gift: `Artisan Loose Leaf Exotic Herbal Tea Sampler Box (6 Blends)`,
        reason: `An aromatic sensory journey featuring soothing chamomile, Kashmiri kahwa, and fragrant Darjeeling green tea.`,
        price: `${currency} ${Math.min(maxBudget, Math.max(minBudget, 599))}`,
        priceNumeric: Math.min(maxBudget, Math.max(minBudget, 599)),
        surpriseScore: 7,
        emotionalValue: 'Moderate',
        difficulty: 'Easy to Find',
        category: 'Gourmet Food & Cooking',
        pros: ['100% Whole Leaf', 'Natural Herbs & Flowers', 'Reusable Wooden Storage Box'],
        presentationTip: 'Include a honey stick and a sweet invitation for your next afternoon tea catch-up.',
        matchedProduct: catalog.find(p => p.id === 'prod-21') || catalog[3]
      },
      {
        gift: `18-in-1 Stainless Steel Pocket Survival Multi-Tool & Keyring`,
        reason: `An ultra-practical everyday carry gadget that solves handy fixes on the fly without taking pocket space.`,
        price: `${currency} ${Math.min(maxBudget, Math.max(minBudget, 269))}`,
        priceNumeric: Math.min(maxBudget, Math.max(minBudget, 269)),
        surpriseScore: 8,
        emotionalValue: 'Moderate',
        difficulty: 'Easy to Find',
        category: 'Tools & Gadgets',
        pros: ['TSA Compliant Carry-On', 'Rust-Proof 420 Steel', 'Fits in Credit Card Slot'],
        presentationTip: 'Hide inside a fun puzzle box or inside a greeting card pocket.',
        matchedProduct: catalog.find(p => p.id === 'prod-19') || catalog[8]
      }
    ];
  } else {
    curatedIdeas = [
      {
        gift: `Custom Engraved Chronograph Timepiece in ${data.favoriteColor || 'Rose Gold'}`,
        reason: `An elegant commemorative heirloom celebrating ${data.occasion} with personalized caseback engraving for ${data.recipientName}.`,
        price: `${currency} ${Math.min(data.budgetMax, Math.round(midBudget * 1.1))}`,
        priceNumeric: Math.min(data.budgetMax, Math.round(midBudget * 1.1)),
        surpriseScore: 9,
        emotionalValue: 'Priceless',
        difficulty: 'Custom / Made-to-Order',
        category: 'Fashion & Accessories',
        pros: ['Heirloom Quality', 'Custom Engraving Included', 'Timeless Aesthetic'],
        presentationTip: 'Present inside a velvet-lined wooden watch box tied with a midnight blue ribbon.',
        matchedProduct: catalog[6] || catalog[0]
      },
      {
        gift: `Amazon Kindle Paperwhite eReader with Artisan Leather Folio`,
        reason: `Ideal for someone who loves reading and quiet unwinding, holding thousands of titles with weeks of battery life.`,
        price: `${currency} ${Math.min(data.budgetMax, 13999)}`,
        priceNumeric: Math.min(data.budgetMax, 13999),
        surpriseScore: 8,
        emotionalValue: 'High',
        difficulty: 'Easy to Find',
        category: 'Electronics & Books',
        pros: ['Glare-free 300 PPI Display', 'Waterproof IPX8', 'Adjustable Warm Amber Light'],
        presentationTip: 'Bookmark the first page with a sweet letter recounting your favorite memory together.',
        matchedProduct: catalog[0]
      },
      {
        gift: `Sony WH-1000XM5 Studio Noise Canceling Audio Headset`,
        reason: `Unmatched acoustics for music immersion, travel, and quiet productivity that reflects their passion for quality sound.`,
        price: `${currency} ${Math.min(data.budgetMax, 28990)}`,
        priceNumeric: Math.min(data.budgetMax, 28990),
        surpriseScore: 9,
        emotionalValue: 'High',
        difficulty: 'Easy to Find',
        category: 'Electronics',
        pros: ['30-Hour Quick Charge Battery', 'Industry Leading ANC', 'Multipoint Bluetooth'],
        presentationTip: 'Place in a sleek minimalist gift bag with a custom Spotify playlist QR code card.',
        matchedProduct: catalog[1]
      },
      {
        gift: `Fujifilm Instax Mini 12 Instant Keepsake Camera & Scrapbook Kit`,
        reason: `Captures real-time spontaneous memories during ${data.occasion} and turns them into physical vintage photo cards.`,
        price: `${currency} ${Math.min(data.budgetMax, 6499)}`,
        priceNumeric: Math.min(data.budgetMax, 6499),
        surpriseScore: 8,
        emotionalValue: 'High',
        difficulty: 'Easy to Find',
        category: 'Photography & Art',
        pros: ['Instant Physical Prints', 'Selfie Mirror Mode', 'Includes Decorative Photo Album'],
        presentationTip: 'Take the very first candid photo together immediately when they unwrap the box.',
        matchedProduct: catalog[2]
      },
      {
        gift: `Smart Hydroponic Indoor Culinary Garden with Automatic LED Grow System`,
        reason: `Brings calming organic vitality into their living space with fresh herbs and vibrant green accents year-round.`,
        price: `${currency} ${Math.min(data.budgetMax, 5299)}`,
        priceNumeric: Math.min(data.budgetMax, 5299),
        surpriseScore: 8,
        emotionalValue: 'Moderate',
        difficulty: 'Easy to Find',
        category: 'Home & Gardening',
        pros: ['Automated Watering Cycle', 'Zero Soil Mess', 'Fresh Herbs in Weeks'],
        presentationTip: 'Tie with natural jute twine and attach seed packet tags for Basil and Rosemary.',
        matchedProduct: catalog[7] || catalog[3]
      },
      {
        gift: `Artisan Specialty Pour-Over Coffee Roasters Tasting Hamper`,
        reason: `A sophisticated morning ritual upgrade featuring single-origin beans, hand-blown carafe, and tasting notes.`,
        price: `${currency} ${Math.min(data.budgetMax, 2450)}`,
        priceNumeric: Math.min(data.budgetMax, 2450),
        surpriseScore: 7,
        emotionalValue: 'Moderate',
        difficulty: 'Easy to Find',
        category: 'Gourmet Food & Cooking',
        pros: ['Single-origin Micro-lot Beans', 'Ceramic Dripper', 'Aromatic Experience'],
        presentationTip: 'Accompany with fresh cinnamon biscuits and brew the first cup together.',
        matchedProduct: catalog[3]
      },
      {
        gift: `Handcrafted 100% Cashmere Pashmina Stole with Needlework Embroidery`,
        reason: `A luxurious and warm wrap perfect for chilly evenings and formal festivities with artisanal Kashmiri heritage.`,
        price: `${currency} ${Math.min(data.budgetMax, 8999)}`,
        priceNumeric: Math.min(data.budgetMax, 8999),
        surpriseScore: 8,
        emotionalValue: 'High',
        difficulty: 'Rare / Specialty',
        category: 'Fashion & Luxury',
        pros: ['Feather-light Softness', 'Natural Thermal Insulation', 'Artisanal Craftsmanship'],
        presentationTip: 'Fold in tissue paper scented with subtle sandalwood aroma spray.',
        matchedProduct: catalog[11] || catalog[6]
      },
      {
        gift: `Deluxe Botanical Soy Aromatherapy Candle Trio (Lavender & Amber)`,
        reason: `Infuses their personal sanctuary with calming, therapeutic aromas after a busy workday.`,
        price: `${currency} ${Math.min(data.budgetMax, 1899)}`,
        priceNumeric: Math.min(data.budgetMax, 1899),
        surpriseScore: 7,
        emotionalValue: 'Moderate',
        difficulty: 'Easy to Find',
        category: 'Home & Wellness',
        pros: ['100% Eco Soy Wax', '60-Hour Clean Burn', 'Recyclable Glass Tumblers'],
        presentationTip: 'Include a custom gold candle snuffer and apothecary match jar.',
        matchedProduct: catalog[4]
      },
      {
        gift: `Personalized Topographic Map Art of Your Special Meeting Spot`,
        reason: `Deeply sentimental custom wall print celebrating where your relationship with ${data.recipientName} first blossomed.`,
        price: `${currency} ${Math.min(data.budgetMax, 2999)}`,
        priceNumeric: Math.min(data.budgetMax, 2999),
        surpriseScore: 10,
        emotionalValue: 'Priceless',
        difficulty: 'Custom / Made-to-Order',
        category: 'Art & Creativity',
        pros: ['Exact Coordinates Marked', 'Museum-Grade Archival Paper', 'Custom Matched Frame'],
        presentationTip: 'Hide behind their favorite chair with a treasure map clue leading up to it.',
        matchedProduct: catalog[9] || catalog[2]
      },
      {
        gift: `Fitbit Charge 6 Smart Bio-Tracker & Health Band`,
        reason: `Empowers their wellness journey with real-time biometric tracking, sleep analytics, and workout metrics.`,
        price: `${currency} ${Math.min(data.budgetMax, 14999)}`,
        priceNumeric: Math.min(data.budgetMax, 14999),
        surpriseScore: 8,
        emotionalValue: 'Moderate',
        difficulty: 'Easy to Find',
        category: 'Fitness & Sports',
        pros: ['Built-in GPS Tracking', '7-Day Battery Life', 'ECG & Stress Management Sensors'],
        presentationTip: 'Wrap in high-contrast sporty geometric wrap with an inspiring card.',
        matchedProduct: catalog[5]
      }
    ];
  }

  return curatedIdeas.map((idea, idx) => ({
    ...idea,
    id: `gift-heur-${idx + 1}-${Date.now()}`
  }));
}

export async function askAIGiftAssistant(
  message: string,
  history: Array<{ sender: 'user' | 'assistant'; text: string }>,
  currentQuestionnaire?: Partial<QuestionnaireData>
): Promise<string> {
  const client = getGeminiClient();

  const systemContext = `
You are "Gifty", a witty, warm, and highly knowledgeable AI Gift Stylist & Concierge assistant.
You help users brainstorm creative, budget-friendly and affordable gift ideas, compare shopping websites (like Flipkart, Amazon, Google Shopping, Myntra, Etsy), identify which store has the lowest price, and suggest creative presentation tips.
Always proactively identify which website has the lowest price (e.g., Flipkart frequently offers the lowest direct retail prices and SuperCoins cashback, while Google Shopping aggregates competitive seller discounts).
${currentQuestionnaire ? `Current Recipient Context: Name: ${currentQuestionnaire.recipientName || 'Friend'}, Relationship: ${currentQuestionnaire.relationship || 'Close'}, Occasion: ${currentQuestionnaire.occasion || 'Special Day'}, Budget: ${currentQuestionnaire.currency || '₹'} ${currentQuestionnaire.budgetMax || 1000}` : ''}
Keep responses warm, concise, insightful, with concrete product/experience recommendations and bullet points.`;

  if (client) {
    try {
      const chat = client.chats.create({
        model: 'gemini-3.7-flash',
        config: {
          systemInstruction: systemContext
        }
      });

      const response = await chat.sendMessage({
        message: message
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn('Gemini chat error:', err);
    }
  }

  const lowerMsg = message.toLowerCase();

  // Price & Website comparison inquiries
  if (lowerMsg.includes('which website') || lowerMsg.includes('less price') || lowerMsg.includes('lowest price') || lowerMsg.includes('cheapest site') || lowerMsg.includes('best site')) {
    return `### 🏷️ Best Website Recommendations for Lowest Price:

1. **Flipkart (Lowest Overall Price)**:
   - Typically **5% to 15% cheaper** than standard retail on everyday gifts, home decor, customized gifts, and electronics.
   - Extra savings with SuperCoins, festive coupons, and free delivery on Assured orders.

2. **Google Shopping (Best Multi-Store Price Aggregator)**:
   - Scans 14+ certified e-commerce merchants simultaneously to surface hidden seller discounts and free shipping perks.

3. **Amazon (Fastest Delivery & Prime Reliability)**:
   - Slightly higher base price occasionally, but offers **Prime 1-Day delivery**, effortless 30-day replacements, and gift-wrapping options.

4. **Myntra (Best for Fashion & Beauty at Discounts)**:
   - Use seasonal coupons for up to 20% off apparel, wristwatches, perfumes, and accessories.

💡 *Pro-Tip: On every gift card in our platform, click "Stores" or "Compare Stores" to instantly see the live lowest-price retailer!*`;
  }

  // Affordable gifts inquiries
  if (lowerMsg.includes('affordable') || lowerMsg.includes('cheap') || lowerMsg.includes('under') || lowerMsg.includes('budget') || lowerMsg.includes('500') || lowerMsg.includes('1000')) {
    return `### ✨ Top Affordable Gifts for Everyone (Under ₹500):

1. **Custom Engraved Wooden Bookmark & Kraft Journal** (~₹249 - Best price on **Flipkart**)
   - Emotional value: High • Custom initials & heartfelt message.
2. **Personalized Spotify Acrylic Song Plaque with Wooden LED Stand** (~₹399 - Best price on **Flipkart**)
   - Glows with their favorite song and special photo memory.
3. **Air-Purifying Live Jade Plant in Glazed Ceramic Planter** (~₹329 - Best price on **Flipkart**)
   - Timeless symbol of prosperity and low maintenance.
4. **Artisan Belgian Dark Chocolate Truffles Box** (~₹389 - Best price on **Flipkart/Amazon**)
   - Luxurious taste at a very pocket-friendly price.
5. **Stainless Steel Insulated Travel Coffee Mug (450ml)** (~₹499 - Best price on **Flipkart**)
   - Keeps coffee hot for 6 hours; durable everyday utility.

Would you like me to tailor any of these to a specific occasion or recipient?`;
  }

  if (lowerMsg.includes('card') || lowerMsg.includes('message') || lowerMsg.includes('write')) {
    return `Here is a heartfelt message you can write on the card for ${currentQuestionnaire?.recipientName || 'your special someone'}:\n\n*"Wishing you a day filled with laughter, love, and all the things that bring you immense joy. Thank you for always bringing your wonderful energy into my life. Happy ${currentQuestionnaire?.occasion || 'celebration'}!"*`;
  }

  return `That's a wonderful thought for ${currentQuestionnaire?.recipientName || 'your recipient'}! If you're looking for budget-friendly picks, check out our **Under ₹500** gifts like custom engraved bookmarks, Spotify LED song plaques, or air-purifying desk plants. Flipkart currently offers the lowest price on these items with 2-day delivery. Would you like store links or presentation tips?`;
}
