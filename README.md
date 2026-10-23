Personalized Gift Recommendation Platform 🎁
An AI-powered web application that helps users discover thoughtful, personalized gift ideas based on a recipient's personality, interests, hobbies, relationship, special occasion, and budget.

The platform combines AI-generated recommendations with a curated product catalog and tools for saving, comparing, and exploring gift ideas.
✨ Features
- Personalized gift recommendations — Generate tailored gift ideas using recipient and occasion details.
- AI-powered gift assistant — Chat with an assistant for gift-planning help and suggestions.
- Recipient questionnaire — Provide details such as age, relationship, interests, personality traits, favorite color, hobbies, budget, and additional notes.
- Product catalog — Browse and search gifts, with filtering by category and price.
- Gift comparison — Compare selected recommendations to help make a decision.
- Saved gifts and folders — Organize gift ideas into folders.
- Recommendation history — Review previous recommendation sessions.
- Authentication — Register and sign in with account credentials.
- Admin panel — Access product-management and administrative views.
- Product visualization — Explore supported gift/product visual previews.
- Export and sharing support — Use the application's history/export tools to keep or export recommendation information.
- Voice input — Use the questionnaire's voice-input control where supported.
- AI fallback — If Gemini is unavailable or a request fails, the recommendation service includes a heuristic fallback generator.
Some features depend on server configuration and an available Gemini API key. The current database implementation stores data in memory, so records may be lost when the server restarts.

🧰 Tech Stack
Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- Motion
- Three.js
Backend
- Node.js
- Express
- TypeScript
- tsx for development
- esbuild for server bundling
AI and supporting libraries
- Google Gemini API via @google/genai
- bcryptjs for password hashing
- jsonwebtoken for authentication tokens
- html2canvas and jspdf for export-related functionality
📁 Project Structure
personalized-gift-recommendation-platform/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── services/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── server/
│   ├── ai.ts
│   ├── db.ts
│   └── seedData.ts
├── .env.example
├── index.html
├── package.json
├── server.ts
├── tsconfig.json
└── vite.config.ts
⚙️ Prerequisites
Install the following before running the project:
- Node.js (a current LTS version is recommended)
- npm
- A Google Gemini API key for AI-powered responses
🚀 Getting Started
1. Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd personalized-gift-recommendation-platform
Replace <YOUR_GITHUB_REPOSITORY_URL> with your repository's Git URL.
2. Install dependencies
npm install
3. Configure environment variables
Create a .env file in the project's root directory by copying .env.example.

Windows Command Prompt:
copy .env.example .env
macOS/Linux:
cp .env.example .env
Open .env and configure the values:
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=
APP_URL=http://localhost:3000
PORT=3000
JWT_SECRET=replace_with_a_long_random_secret
MONGO_URI=
- GEMINI_API_KEY: Your Google Gemini API key. Keep it private.
- OPENAI_API_KEY: Optional variable in the example configuration; the included recommendation service primarily uses Gemini and its heuristic fallback.
- APP_URL: The app's URL, if needed by your deployment environment.
- PORT: The server's port. Note that the current server.ts sets the port to 3000.
- JWT_SECRET: Set a strong, private secret for signing authentication tokens.
- MONGO_URI: Included as a configuration placeholder; the current database code uses in-memory data and does not connect to MongoDB.
Important: Never commit .env or publish API keys and production secrets to GitHub.
4. Start the application
npm run dev
Open http://localhost:3000 in your browser.

The development command starts the Express server and the Vite development environment.
🏗️ Build for Production
Build the frontend and bundle the server:
npm run build
Start the built server:
npm start
The project also includes a TypeScript check:
npm run lint
🧭 How It Works
1. Open the application and enter the gift-planning questionnaire.
2. Add recipient details, the occasion, budget, interests, personality traits, and other preferences.
3. Submit the questionnaire to request gift recommendations.
4. The backend attempts to generate personalized ideas using Gemini.
5. If the AI request is unavailable or fails, the backend uses a heuristic recommendation generator.
6. Recommendations are enriched with matching products from the curated catalog when possible.
7. Browse the suggestions, compare ideas, save favorites, organize them into folders, and revisit recommendation history.
🔐 Demo Accounts
The source code seeds development demo accounts:
Role	Email	Password
User	sarah@example.com	Password@123
Admin	admin@giftplatform.com	Admin@123


These are development-only demo credentials. Do not use them in a public production deployment. Change or remove seeded accounts and configure secure secrets before deploying.
🗃️ Data and Security Notes
- The current server/db.ts implementation uses an in-memory data store, not a persistent database.
- User accounts, products, folders, and recommendation history may reset when the server restarts.
- MONGO_URI is present in the example environment file, but MongoDB persistence is not implemented by the current database module.
- Use a strong JWT_SECRET and protect all API keys.
- Review authentication and authorization checks, input validation, and deployment settings before using the application with real users.
- Do not expose demo credentials or development secrets in a production environment.
🛠️ Troubleshooting
AI recommendations are not generated
- Check that GEMINI_API_KEY is set correctly in .env.
- Restart the server after changing environment variables.
- Check the server terminal for API errors. The app may use heuristic recommendations if the AI service is unavailable.
The app does not start
- Confirm Node.js and npm are installed.
- Run npm install again.
- Make sure port 3000 is available.
Saved information disappears after restart
- This is expected with the current in-memory database implementation. Persistent database integration is needed to retain data across restarts.
🔮 Possible Future Enhancements
- Integrate a persistent database such as MongoDB or PostgreSQL.
- Add live product prices, stock availability, and retailer links.
- Improve recommendation ranking using feedback and user preferences.
- Add automated tests and CI/CD workflows.
- Add production-ready role-based authorization, rate limiting, and request validation.
- Improve accessibility and mobile usability.
🤝 Contributing
1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Submit a pull request describing the changes.
📄 License
No license is specified in the provided project files. Add a LICENSE file before distributing the project under an open-source license.
Built to make gift-giving more personal, thoughtful, and convenient. 💝
