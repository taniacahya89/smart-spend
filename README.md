# SmartSpend 💸

> Personal expense tracker with AI-powered financial advisor — built for Indonesian students and young adults.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)

---

## ✨ Features

- **Expense CRUD** — Add, edit, delete, and view expenses with category, date, and description
- **Smart Filters** — Search, filter by category & month, sort by date or amount
- **Dashboard** — Visual summary with bar chart (7-day spending) and pie chart (category breakdown)
- **Budget Tracker** — Set monthly income and track spending ratio with a dynamic progress bar
- **AI Advisor** — Get personalized financial analysis powered by Groq AI (LLaMA 3.1)
- **Follow-up Chat** — Ask the AI follow-up questions with full context of your expenses
- **Dark Mode** — Modern dark fintech UI, toggle available
- **Responsive** — Mobile-first design with bottom navigation on mobile, sidebar on desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript (TSX) |
| Styling | Tailwind CSS v3 |
| Charts | Recharts |
| Backend & Auth | Supabase (PostgreSQL + Row Level Security) |
| AI | Groq API (llama-3.1-8b-instant) |
| Hosting | Vercel |

---

## 📸 Screenshots

> Dashboard
![Dashboard Screenshot](./screenshots/dashboard.png)

> Expense List
![Expenses Screenshot](./screenshots/expenses.png)

> AI Advisor
![Advisor Screenshot](./screenshots/advisor.png)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account ([supabase.com](https://supabase.com))
- Groq API key ([console.groq.com](https://console.groq.com))

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/smartspend.git
cd smartspend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
```

### 4. Setup Supabase database
Run the following SQL in your Supabase SQL Editor:

```sql
-- Expenses table
create table expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  category text not null,
  description text,
  date date not null default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table expenses enable row level security;

create policy "Users can only access their own expenses"
  on expenses for all
  using (auth.uid() = user_id);

-- User profiles table
create table user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  monthly_income numeric(12, 2) not null default 0,
  name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_profiles enable row level security;

create policy "Users can only access their own profile"
  on user_profiles for all
  using (auth.uid() = id);

-- Auto-create profile on register
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Sidebar, PageWrapper, BottomNav
│   ├── expense/         # ExpenseForm, ExpenseItem, ExpenseList, ExpenseFilters
│   ├── dashboard/       # SummaryCard, BudgetProgress, SpendingChart, CategoryBreakdown
│   └── advisor/         # AdvisorChat, AdvisorResult, TypingIndicator
├── pages/               # LoginPage, RegisterPage, DashboardPage, ExpensesPage, AdvisorPage, SettingsPage
├── hooks/               # useAuth, useExpenses, useProfile, useDashboardStats, useAdvisor
├── lib/                 # supabase.ts, gemini.ts (Groq), formatters.ts
├── types/               # TypeScript interfaces & types
├── constants/           # categories.ts (category colors & icons)
└── context/             # AuthContext, ToastContext
```

---

## 🤖 AI Advisor

The AI Advisor uses **Groq API (LLaMA 3.1 8B)** to analyze your spending patterns. It receives:

- Monthly income & total expenses
- Spending ratio (%)
- Category breakdown with percentages
- Top 5 largest transactions
- Remaining days in the month

Based on this context, it provides:
- A spending summary with real numbers
- A rating: **hemat** (frugal) / **normal** / **boros** (overspending)
- 3 concrete, personalized tips
- 1 unique financial insight

After the initial analysis, you can ask follow-up questions in natural language — the AI maintains full context of your expense data throughout the conversation.

**Rating criteria:**
| Rating | Condition |
|---|---|
| 💚 Hemat | Expenses < 50% of income |
| 🟡 Normal | Expenses 50–80% of income |
| 🔴 Boros | Expenses > 80% of income |

---

## 🌐 Deployment

This project is deployed on **Vercel**. To deploy your own:

1. Push the repo to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

---

## 📝 License

MIT License — feel free to use this project as a reference or template.

---

<p align="center">Built with ❤️ by <a href="https://github.com/YOUR_USERNAME">Tania</a></p>
