import { useMemo } from 'react';
import { Expense, DashboardStats, CategorySummary, ExpenseCategory } from '@/types';
import { CATEGORY_MAP } from '@/constants/categories';

export const useDashboardStats = (expenses: Expense[]): DashboardStats => {
  return useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // 1. Filter expenses for the current month
    const currentMonthExpenses = expenses.filter((exp) => {
      const parts = exp.date.split('-');
      if (parts.length !== 3) return false;
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-indexed
      return year === currentYear && month === currentMonth;
    });

    // 2. Total spending & transaction count this month
    const totalThisMonth = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const transactionCount = currentMonthExpenses.length;

    // 3. Category Breakdown for current month
    const categoryTotals: Record<ExpenseCategory, number> = {} as Record<ExpenseCategory, number>;
    
    // Initialize all categories with 0
    Object.keys(CATEGORY_MAP).forEach((cat) => {
      categoryTotals[cat as ExpenseCategory] = 0;
    });

    currentMonthExpenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const categoryBreakdown: CategorySummary[] = Object.entries(categoryTotals)
      .map(([cat, total]) => {
        const category = cat as ExpenseCategory;
        const percentage = totalThisMonth > 0 ? (total / totalThisMonth) * 100 : 0;
        return {
          category,
          total,
          percentage: Math.round(percentage * 100) / 100, // round to 2 decimals
          color: CATEGORY_MAP[category]?.color || '#94A3B8'
        };
      })
      .filter((item) => item.total > 0) // only show categories with expenses
      .sort((a, b) => b.total - a.total); // sort descending

    // 4. Top Category this month
    const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0].category : null;

    // 5. Daily Spending for the last 7 days (including today)
    const dailySpending: { date: string; total: number }[] = [];
    
    // Generate dates for the last 7 days in YYYY-MM-DD
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      // Sum all expenses matching this date
      const dayTotal = expenses
        .filter((exp) => exp.date === dateString)
        .reduce((sum, exp) => sum + exp.amount, 0);

      // format date label as DD MMM (e.g., "22 Jun")
      const dayLabel = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short'
      }).format(date);

      dailySpending.push({
        date: dayLabel,
        total: dayTotal
      });
    }

    return {
      totalThisMonth,
      transactionCount,
      topCategory,
      dailySpending,
      categoryBreakdown
    };
  }, [expenses]);
};
