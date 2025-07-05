# Personal Finance Visualizer

## 🚀 Features

### Stage 1: Basic Transaction Tracking ✅

- **Add/Edit/Delete transactions** with amount, date, and description
- **Transaction list view** with real-time updates
- **Single chart**: Monthly expenses bar chart using real transaction data
- **Basic form validation** with error handling and user feedback
- **Responsive design** optimized for mobile, tablet, and desktop


## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd finance
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
finance/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── globals.css         # Global styles
│   │   ├── layout.js           # Root layout
│   │   └── page.js             # Home page
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── transaction-form.jsx
│   │   ├── transaction-list.jsx
│   │   ├── transaction-item.jsx
│   │   ├── transaction-update-form.jsx
│   │   └── monthly-charts.jsx
│   ├── lib/                    # Utility functions
│   │   ├── actions.js          # Server actions
│   │   ├── mongodb.js          # Database connection
│   │   ├── transaction-context.js
│   │   └── utils.js
│   └── models/                 # Database models
│       └── Transaction.js
├── public/                     # Static assets
└── package.json
```
