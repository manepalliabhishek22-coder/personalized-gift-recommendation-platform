import { GiftIdea, MatchedProduct } from '../types';

export interface ProductAnglePhoto {
  id: string;
  label: string;
  shortName: string;
  url: string;
  description: string;
}

export interface RealProductSpecs {
  dimensionsCm: string;
  dimensionsInches: string;
  weightGrams: number;
  weightOz: string;
  materials: string[];
  inTheBox: string[];
  scaleReference: {
    comparisonItem: string;
    itemHeightCm: number;
    description: string;
  };
  features: string[];
}

export interface RealProductVisualData {
  title: string;
  category: string;
  heroImage: string;
  angles: ProductAnglePhoto[];
  specs: RealProductSpecs;
  lifestyleSettings: Array<{
    id: string;
    name: string;
    ambience: string;
    image: string;
  }>;
}

export function getRealProductVisualData(item: GiftIdea | MatchedProduct): RealProductVisualData {
  const name = ('gift' in item ? item.gift : item.name).toLowerCase();
  const category = (item.category || '').toLowerCase();
  const baseImg = ('matchedProduct' in item && item.matchedProduct?.image)
    ? item.matchedProduct.image
    : ('image' in item && item.image ? item.image : '');

  // 1. HEADPHONES / AUDIO
  if (name.includes('headphone') || name.includes('sony') || name.includes('audio') || name.includes('earphone') || category.includes('electronics')) {
    return {
      title: 'gift' in item ? item.gift : item.name,
      category: 'Electronics & High-Fidelity Audio',
      heroImage: baseImg || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85',
      angles: [
        {
          id: 'hero',
          label: 'Front Studio View',
          shortName: 'Studio Front',
          url: baseImg || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85',
          description: 'True-to-life studio perspective showcasing symmetric over-ear acoustic chambers.'
        },
        {
          id: 'angle',
          label: '45° Isometric Perspective',
          shortName: '45° Angle',
          url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=85',
          description: 'Dynamic profile highlighting the ergonomic headband curvature and pivot hinges.'
        },
        {
          id: 'macro',
          label: 'Macro Material Texture',
          shortName: 'Material Detail',
          url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=85',
          description: 'Ultra-close inspection of the synthetic protein leather cushions and acoustic mesh.'
        },
        {
          id: 'lifestyle',
          label: 'Real Lifestyle Setting',
          shortName: 'In-Context Desk',
          url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85',
          description: 'Actual placement in a modern creative workspace next to espresso and notebook.'
        },
        {
          id: 'packaging',
          label: 'Luxury Unboxing Presentation',
          shortName: 'Gift Box Wrap',
          url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85',
          description: 'Delivered in a hard-shell matte carrying case wrapped in ribbon with personal card.'
        }
      ],
      specs: {
        dimensionsCm: '22.4 × 19.8 × 7.6 cm',
        dimensionsInches: '8.8 × 7.8 × 3.0 in',
        weightGrams: 250,
        weightOz: '8.8 oz',
        materials: ['Aerospace-grade matte ABS', 'Synthetic protein leather', 'Memory foam ear cushions', 'Solid zinc hinge pins'],
        inTheBox: ['Wireless Headphones', 'Semi-rigid travel case', 'USB-C charging cable (20cm)', '3.5mm gold-plated audio cable'],
        scaleReference: {
          comparisonItem: 'iPhone 15 Pro (14.7 cm)',
          itemHeightCm: 22.4,
          description: 'Approximately 1.5× the height of an iPhone 15 Pro; comfortably fits in standard backpacks.'
        },
        features: ['30-Hour Battery Life', 'Industry-Leading Active Noise Cancelling', 'Multi-Device Bluetooth 5.2 Multipoint']
      },
      lifestyleSettings: [
        { id: 'desk', name: 'Executive Desk', ambience: 'Clean Studio Light', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85' },
        { id: 'flight', name: 'Travel & Commute', ambience: 'Warm Ambient Lamp', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85' }
      ]
    };
  }

  // 2. CAMERAS / PHOTOGRAPHY
  if (name.includes('camera') || name.includes('instax') || name.includes('fujifilm') || category.includes('photography')) {
    return {
      title: 'gift' in item ? item.gift : item.name,
      category: 'Photography & Creative Optics',
      heroImage: baseImg || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=85',
      angles: [
        {
          id: 'hero',
          label: 'Front Lens Studio View',
          shortName: 'Front View',
          url: baseImg || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=85',
          description: 'Crisp front facade showing optical lens barrel, flash emitter, and selfie mirror.'
        },
        {
          id: 'angle',
          label: 'Top Shutter & Viewfinder Angle',
          shortName: 'Top Angle',
          url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85',
          description: 'Ergonomic grip view with dedicated tactile shutter release and film exit slot.'
        },
        {
          id: 'macro',
          label: 'Optical Glass & Texture',
          shortName: 'Macro Lens',
          url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=85',
          description: 'Close-up on the multi-coated glass optical element and textured thumb rest.'
        },
        {
          id: 'lifestyle',
          label: 'Memories On Table',
          shortName: 'Lifestyle Gathering',
          url: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=1200&q=85',
          description: 'Real photo surrounded by instant mini prints, travel journal, and coffee cup.'
        },
        {
          id: 'packaging',
          label: 'Festive Gift Presentation',
          shortName: 'Gift Wrapped',
          url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=85',
          description: 'Packaged in presentation box with 20 instant film sheets and matching wrist strap.'
        }
      ],
      specs: {
        dimensionsCm: '10.4 × 12.2 × 6.6 cm',
        dimensionsInches: '4.1 × 4.8 × 2.6 in',
        weightGrams: 306,
        weightOz: '10.8 oz',
        materials: ['Molded impact-resistant polycarbonate', 'Multi-coated optical glass elements', 'Silicone wrist tether'],
        inTheBox: ['Instant Camera', 'Matching color wrist strap', '2× AA alkaline batteries', 'User instruction guide'],
        scaleReference: {
          comparisonItem: 'Standard Ceramic Mug (9.5 cm)',
          itemHeightCm: 12.2,
          description: 'Slightly taller than an espresso cup; comfortably held with one hand.'
        },
        features: ['Auto Exposure Shutter 1/2 to 1/250 sec', 'Selfie / Close-Up Lens Mode (30-50 cm)', 'Constant Firing Flash with Light Adjustment']
      },
      lifestyleSettings: [
        { id: 'party', name: 'Celebration Gathering', ambience: 'Warm Golden Hour', image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=1200&q=85' }
      ]
    };
  }

  // 3. COFFEE & ARTISAN KITCHEN
  if (name.includes('coffee') || name.includes('ceramic') || name.includes('pour-over') || category.includes('gourmet')) {
    return {
      title: 'gift' in item ? item.gift : item.name,
      category: 'Artisanal Coffee & Gourmet Living',
      heroImage: baseImg || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
      angles: [
        {
          id: 'hero',
          label: 'Ceramic Cone Studio View',
          shortName: 'Studio Front',
          url: baseImg || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
          description: 'Speckled artisanal cone seated on heat-tempered borosilicate glass decanter.'
        },
        {
          id: 'angle',
          label: 'Pouring Extraction View',
          shortName: 'Brewing Action',
          url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',
          description: 'Spiral extraction ribs promoting optimal water contact and blooming aroma.'
        },
        {
          id: 'macro',
          label: 'Handmade Stoneware Glaze',
          shortName: 'Glaze Texture',
          url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=85',
          description: 'Macro inspection revealing natural mineral flecks and food-safe matte glaze.'
        },
        {
          id: 'lifestyle',
          label: 'Morning Sunlit Kitchen Counter',
          shortName: 'Kitchen Morning',
          url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
          description: 'Real brew bar setup with freshly roasted beans and goose-neck kettle.'
        },
        {
          id: 'packaging',
          label: 'Eco-Craft Unboxing Experience',
          shortName: 'Kraft Box Wrap',
          url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85',
          description: 'Sturdy recycled kraft packaging cushioned with wood wool and jute ribbon.'
        }
      ],
      specs: {
        dimensionsCm: '12.0 × 12.0 × 10.2 cm',
        dimensionsInches: '4.7 × 4.7 × 4.0 in',
        weightGrams: 380,
        weightOz: '13.4 oz',
        materials: ['High-fire natural stoneware clay', 'Non-toxic matte glaze', 'Heat-resistant silicone base ring'],
        inTheBox: ['Artisanal Ceramic Dripper', '250g Single-Origin Medium Roast Beans', '40 unbleached paper filters', 'Wooden dosing spoon'],
        scaleReference: {
          comparisonItem: 'Coffee Mug (9.5 cm)',
          itemHeightCm: 10.2,
          description: 'Fits securely atop any standard coffee mug or server up to 10 cm in diameter.'
        },
        features: ['Thermal Retention Stoneware', 'Universal 60-Degree Extraction Angle', 'Dishwasher & Microwave Safe']
      },
      lifestyleSettings: [
        { id: 'morning', name: 'Sunrise Brew Bar', ambience: 'Natural Morning Sun', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85' }
      ]
    };
  }

  // 4. CANDLES / HOME WELLNESS
  if (name.includes('candle') || name.includes('scent') || name.includes('aromatherapy') || category.includes('wellness')) {
    return {
      title: 'gift' in item ? item.gift : item.name,
      category: 'Home Fragrance & Wellness',
      heroImage: baseImg || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85',
      angles: [
        {
          id: 'hero',
          label: 'Apothecary Amber Jar',
          shortName: 'Studio Front',
          url: baseImg || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85',
          description: 'Heavyweight amber glass vessel with gold aluminum lid and minimalist label.'
        },
        {
          id: 'angle',
          label: 'Warm Illuminated Flame',
          shortName: 'Lit Flame Glow',
          url: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1200&q=85',
          description: 'Steady calm flame casting deep golden reflections on amber glass.'
        },
        {
          id: 'macro',
          label: 'Pure Soy Wax & Cotton Wick',
          shortName: 'Wax Texture',
          url: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&w=1200&q=85',
          description: '100% plant-based soy wax surface infused with pure botanical essential oils.'
        },
        {
          id: 'lifestyle',
          label: 'Relaxing Evening Bedroom',
          shortName: 'Bedside Glow',
          url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=85',
          description: 'Creating an intimate, warm sanctuary on a marble nightstand.'
        },
        {
          id: 'packaging',
          label: 'Luxury Botanical Gift Box',
          shortName: 'Satin Box',
          url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85',
          description: 'Delivered in an embossed gold-foil presentation box with matchbook included.'
        }
      ],
      specs: {
        dimensionsCm: '8.5 × 8.5 × 10.0 cm',
        dimensionsInches: '3.3 × 3.3 × 3.9 in',
        weightGrams: 420,
        weightOz: '14.8 oz',
        materials: ['100% Midwestern natural soy wax', 'Unbleached organic cotton wick', 'UV-blocking amber apothecary glass'],
        inTheBox: ['Set of 4 Scented Soy Candles (French Lavender, Vanilla Amber, English Pear, Fig)', 'Black safety matches', 'Candle care card'],
        scaleReference: {
          comparisonItem: 'Coffee Mug (9.5 cm)',
          itemHeightCm: 10.0,
          description: 'Palm-sized jar; perfectly proportioned for bedside tables, baths, and desks.'
        },
        features: ['50-Hour Clean Burn per Jar', 'Zero Paraffin or Phthalates', 'Therapeutic Grade Aromatherapy Oils']
      },
      lifestyleSettings: [
        { id: 'evening', name: 'Sanctuary Twilight', ambience: 'Candlelight Glow (2400K)', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=85' }
      ]
    };
  }

  // 5. KINDLE / BOOKS / TABLETS
  if (name.includes('kindle') || name.includes('book') || name.includes('tablet') || name.includes('reader')) {
    return {
      title: 'gift' in item ? item.gift : item.name,
      category: 'Electronics & Reading Essentials',
      heroImage: baseImg || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=85',
      angles: [
        {
          id: 'hero',
          label: 'Flush Glare-Free Display',
          shortName: 'Front Screen',
          url: baseImg || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=85',
          description: 'High-contrast 300 ppi E-ink screen that reads just like real printed paper.'
        },
        {
          id: 'angle',
          label: 'Ultra-Slim Profile Angle',
          shortName: 'Slim Profile',
          url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=85',
          description: 'Just 8.1 mm thin with rounded ergonomic corners for effortless single-hand reading.'
        },
        {
          id: 'macro',
          label: '300 PPI Laser-Sharp Typography',
          shortName: 'Sharp Text',
          url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=85',
          description: 'Macro inspection showing crisp ink edges and adjustable warm backlight LEDs.'
        },
        {
          id: 'lifestyle',
          label: 'Cozy Reading Armchair',
          shortName: 'Armchair Read',
          url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=85',
          description: 'Immersed in an afternoon chapter with natural sunlight streaming across the page.'
        },
        {
          id: 'packaging',
          label: 'Sleek Presentation Box',
          shortName: 'Gift Packaging',
          url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=85',
          description: 'Slim recyclable presentation box with USB-C braided charging cable.'
        }
      ],
      specs: {
        dimensionsCm: '17.4 × 12.5 × 0.81 cm',
        dimensionsInches: '6.9 × 4.9 × 0.32 in',
        weightGrams: 205,
        weightOz: '7.2 oz',
        materials: ['Recycled magnesium chassis', 'Anti-reflective etched glass', 'Soft-touch silicone rear shell'],
        inTheBox: ['Kindle Paperwhite (16 GB)', 'USB-C charging cable', 'Quick Start documentation'],
        scaleReference: {
          comparisonItem: 'iPhone 15 Pro (14.7 cm)',
          itemHeightCm: 17.4,
          description: 'Roughly the size of a standard paperback novel, yet half the thickness.'
        },
        features: ['10-Week Battery Life on Single Charge', 'IPX8 Waterproof (Submersion in Fresh Water)', 'Adjustable Warm Light from White to Amber']
      },
      lifestyleSettings: [
        { id: 'day', name: 'Bright Daylight Patio', ambience: 'Zero Glare Sun', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=85' }
      ]
    };
  }

  // 6. LEATHER ACCESSORIES / FASHION
  if (name.includes('leather') || name.includes('wallet') || name.includes('bag') || name.includes('shawl') || category.includes('fashion')) {
    return {
      title: 'gift' in item ? item.gift : item.name,
      category: 'Fashion & Handcrafted Leather Goods',
      heroImage: baseImg || 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85',
      angles: [
        {
          id: 'hero',
          label: 'Hand-Stitched Front Facade',
          shortName: 'Studio Front',
          url: baseImg || 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85',
          description: 'Full-grain vegetable-tanned leather displaying natural pull-up character and wax stitching.'
        },
        {
          id: 'angle',
          label: 'Interior Card Organizers',
          shortName: 'Internal View',
          url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85',
          description: 'Precision beveled card slots, passport sleeve, and currency divider.'
        },
        {
          id: 'macro',
          label: 'Pebbled Grain & Saddle Stitch',
          shortName: 'Leather Grain',
          url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85',
          description: 'Close inspection of authentic leather pores that develop rich patina over years.'
        },
        {
          id: 'lifestyle',
          label: 'Travel Lounge Departure',
          shortName: 'Travel Desk',
          url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85',
          description: 'Laid out on mahogany airport lounge table with espresso and passport.'
        },
        {
          id: 'packaging',
          label: 'Velvet Dust Bag & Rigid Box',
          shortName: 'Gift Box',
          url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=85',
          description: 'Enclosed in an unbleached cotton dust bag inside a matte black foil-stamped gift box.'
        }
      ],
      specs: {
        dimensionsCm: '14.5 × 10.5 × 1.8 cm',
        dimensionsInches: '5.7 × 4.1 × 0.7 in',
        weightGrams: 115,
        weightOz: '4.1 oz',
        materials: ['100% full-grain Tuscan vegetable tanned leather', 'Hand-waxed linen thread', 'RFID-blocking metallic shielding'],
        inTheBox: ['Personalized Leather Wallet', 'Certificate of leather authenticity', 'Cotton protective dust bag', 'Leather balm mini-tin'],
        scaleReference: {
          comparisonItem: 'Credit / ID Card (8.5 cm)',
          itemHeightCm: 14.5,
          description: 'Fits comfortably into standard jacket breast pockets or travel carry-on bags.'
        },
        features: ['Patina Development Guarantee', 'RFID Signal Blocking Against Wireless Theft', 'Hand-Polished Beeswax Burnished Edges']
      },
      lifestyleSettings: [
        { id: 'travel', name: 'First Class Lounge', ambience: 'Warm Leather & Wood', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85' }
      ]
    };
  }

  // DEFAULT / GENERAL CURATED LUXURY
  return {
    title: 'gift' in item ? item.gift : item.name,
    category: item.category || 'Curated Premium Gift',
    heroImage: baseImg || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=85',
    angles: [
      {
        id: 'hero',
        label: 'Front Studio Presentation',
        shortName: 'Studio Front',
        url: baseImg || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=85',
        description: 'Pristine studio product showcase highlighting true physical proportions.'
      },
      {
        id: 'angle',
        label: 'Perspective Angle',
        shortName: '45° Angle',
        url: baseImg || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85',
        description: 'Side profile displaying depth, tactile finish, and clean modern contours.'
      },
      {
        id: 'macro',
        label: 'Material Quality Inspection',
        shortName: 'Fine Detail',
        url: baseImg || 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=85',
        description: 'Microscopic inspection of premium surfaces, seams, and tactile touch points.'
      },
      {
        id: 'lifestyle',
        label: 'Real Everyday Environment',
        shortName: 'In-Context Living',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85',
        description: 'Naturally integrated into an authentic, beautiful lifestyle setting.'
      },
      {
        id: 'packaging',
        label: 'Luxury Unboxing Box',
        shortName: 'Gift Wrap',
        url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=85',
        description: 'Tied with satin silk ribbon and accompanied by personalized greetings.'
      }
    ],
    specs: {
      dimensionsCm: '18.0 × 14.0 × 8.5 cm',
      dimensionsInches: '7.1 × 5.5 × 3.3 in',
      weightGrams: 350,
      weightOz: '12.3 oz',
      materials: ['High-density verified premium materials', 'Precision-finished edges', 'Environmentally certified packaging'],
      inTheBox: ['Curated Premium Gift Item', 'Authenticity card', 'Presentation gift box with ribbon', 'Custom gift message card'],
      scaleReference: {
        comparisonItem: 'iPhone 15 Pro (14.7 cm)',
        itemHeightCm: 18.0,
        description: 'Proportionally balanced for standard gift tables and home display shelves.'
      },
      features: ['Hand-Inspected Quality Control', 'Authentic Merchant Guarantee', 'Gift-Ready Presentation']
    },
    lifestyleSettings: [
      { id: 'living', name: 'Modern Residence', ambience: 'Warm Sunlight', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85' }
    ]
  };
}
