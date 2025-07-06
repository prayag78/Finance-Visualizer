# Personal Finance Visualizer

## 🚀 Features

### Stage 1: Basic Transaction Tracking ✅

- **Add/Edit/Delete transactions** with amount, date, and description
- **Transaction list view** with real-time updates
- **Single chart**: Monthly expenses bar chart using real transaction data
- **Basic form validation** with error handling and user feedback
- **Responsive design** optimized for mobile, tablet, and desktop

### Stage 2: Categories & Pie chart ✅

- **Predefined categories for transactions** (Food & Dining, Transportation, Shopping, Entertainment, Healthcare, Utilities, Housing, Education, Travel, Other)
- **Category-wise pie chart** showing spending breakdown by category
- **Dashboard with summary cards**:
  - Total expenses overview
  - Top spending categories
  - Average transaction amount
  - Most recent transactions (last 5)
- **Real-time category analytics** with percentage breakdowns

### Stage 3: Budget Management & Insights ✅

- **Set monthly category budgets** - Create and manage budget limits for each spending category
- **Budget vs actual comparison chart** - Visual comparison between planned budgets and actual spending
- **Simple spending insights** - Get actionable insights about your spending patterns and budget performance
- **Category-based budget tracking** - Monitor spending against category-specific budget limits

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
