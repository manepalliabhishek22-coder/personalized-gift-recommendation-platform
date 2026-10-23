import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { generateGiftRecommendations, askAIGiftAssistant } from './server/ai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Auth middleware
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  const decoded = db.verifyToken(token);
  if (decoded) {
    req.user = decoded;
  }
  next();
};

app.use(authenticate);

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    const user = await db.createUser({ name, email, password });
    const token = db.generateToken(user);
    res.status(201).json({ token, user });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const userRecord = await db.findUserByEmail(email);
    if (!userRecord) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const match = await db.verifyPassword(password, userRecord.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const { passwordHash: _, ...user } = userRecord;
    const token = db.generateToken(user);
    res.json({ token, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login error.' });
  }
});

app.get('/api/auth/me', async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const user = await db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ user });
});

// --- RECOMMENDATION GENERATION ---
app.post('/api/recommend', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const questionnaireData = req.body;
    if (!questionnaireData.recipientName || !questionnaireData.occasion) {
      return res.status(400).json({ error: 'Recipient name and occasion are required.' });
    }

    const recommendations = await generateGiftRecommendations(questionnaireData);

    // Save search history
    const savedRecord = await db.saveRecommendation({
      userId: req.user?.id,
      recipient: {
        name: questionnaireData.recipientName,
        age: Number(questionnaireData.recipientAge) || 25,
        gender: questionnaireData.recipientGender || 'Other',
        relationship: questionnaireData.relationship || 'Friend'
      },
      occasion: questionnaireData.occasion,
      budget: {
        min: Number(questionnaireData.budgetMin) || 500,
        max: Number(questionnaireData.budgetMax) || 10000,
        currency: questionnaireData.currency || '₹'
      },
      personality: questionnaireData.personalityTraits || [],
      interests: questionnaireData.interests || [],
      favoriteColor: questionnaireData.favoriteColor || '',
      hobbies: questionnaireData.hobbies || '',
      additionalNotes: questionnaireData.additionalNotes || '',
      recommendations
    });

    res.json({
      success: true,
      recommendationRecord: savedRecord,
      recommendations
    });
  } catch (err: any) {
    console.error('Recommendation API error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate recommendations.' });
  }
});

// --- AI CHAT ASSISTANT ---
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, questionnaire } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    const reply = await askAIGiftAssistant(message, history || [], questionnaire);
    res.json({ reply });
  } catch (err: any) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'Failed to process AI chat.' });
  }
});

// --- PRODUCTS CATALOG CRUD ---
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, festival } = req.query;
    const products = await db.getProducts({
      category: category as string,
      query: search as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      festivalTag: festival as string
    });
    res.json({ products });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

app.post('/api/products', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const product = await db.addProduct(req.body);
    res.status(201).json({ product });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create product.' });
  }
});

app.put('/api/products/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ product: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update product.' });
  }
});

app.delete('/api/products/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = await db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

// --- RECOMMENDATION HISTORY & SAVED ---
app.get('/api/history', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const history = await db.getRecommendationsByUser(req.user?.id);
    res.json({ history });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});

app.get('/api/history/:id', async (req: Request, res: Response) => {
  try {
    const rec = await db.getRecommendationById(req.params.id);
    if (!rec) {
      return res.status(404).json({ error: 'Recommendation not found.' });
    }
    res.json({ recommendation: rec });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load recommendation.' });
  }
});

app.delete('/api/history/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = await db.deleteRecommendation(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete history item.' });
  }
});

app.post('/api/save', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id, folderName } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Recommendation ID is required.' });
    }
    const updated = await db.toggleFavoriteRecommendation(id, folderName);
    if (!updated) {
      return res.status(404).json({ error: 'Recommendation not found.' });
    }
    res.json({ recommendation: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update save status.' });
  }
});

// --- FOLDERS ---
app.get('/api/folders', async (req: Request, res: Response) => {
  try {
    const folders = await db.getFolders();
    res.json({ folders });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch folders.' });
  }
});

app.post('/api/folders', async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Folder name is required.' });
    }
    const folder = await db.addFolder(name, color);
    res.status(201).json({ folder });
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to create folder.' });
  }
});

app.delete('/api/folders/:name', async (req: Request, res: Response) => {
  try {
    const success = await db.deleteFolder(req.params.name);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete folder.' });
  }
});

// --- ADMIN ROUTES ---
app.get('/api/admin/analytics', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const analytics = await db.getAnalytics();
    res.json({ analytics });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
});

app.get('/api/admin/users', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await db.getAllUsers();
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Vite Middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎁 Gift Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
