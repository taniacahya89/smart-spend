export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string | null;
  date: string; // ISO date string "YYYY-MM-DD"
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | "Makanan & Minuman"
  | "Transport"
  | "Belanja"
  | "Hiburan"
  | "Kesehatan"
  | "Pendidikan"
  | "Tagihan"
  | "Lainnya";

export interface ExpenseFormData {
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export interface CategorySummary {
  category: ExpenseCategory;
  total: number;
  percentage: number;
  color: string;
}

export interface DashboardStats {
  totalThisMonth: number;
  transactionCount: number;
  topCategory: ExpenseCategory | null;
  dailySpending: { date: string; total: number }[];
  categoryBreakdown: CategorySummary[];
}

export interface AdvisorMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "danger" | "info";
}

export interface UserProfile {
  id: string;
  monthlyIncome: number;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetStatus {
  monthlyIncome: number;
  totalExpenses: number;
  remaining: number;
  ratio: number;
  status: 'hemat' | 'normal' | 'boros' | 'tidak_dapat_dinilai';
}

export interface AdvisorAnalysis {
  ringkasan: string;
  penilaian: 'hemat' | 'normal' | 'boros' | 'tidak_dapat_dinilai';
  alasan_penilaian: string;
  saran: string[];
  highlight: string;
}

