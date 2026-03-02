import { Transaction, Category } from "../types/transaction";
import type { CategoryBreakdown, DailySummary } from "../types/dashboard";

export type { CategoryBreakdown, DailySummary };

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  startDate: string;
  endDate: string;
}

// Helper: ISO date string comparison (YYYY-MM-DD)
function inRange(date: string, start: string, end: string) {
  return date >= start && date <= end;
}

export function getDashboardSummary(
  transactions: Transaction[],
  startDate: string,
  endDate: string
): DashboardSummary {
  let totalIncome = 0;
  let totalExpense = 0;
  for (const t of transactions) {
    if (inRange(t.date, startDate, endDate)) {
      if (t.type === "income") totalIncome += t.amount;
      else if (t.type === "expense") totalExpense += t.amount;
    }
  }
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    startDate,
    endDate,
  };
}

export function getCategoryBreakdown(
  transactions: Transaction[],
  categories: Category[],
  startDate: string,
  endDate: string
): CategoryBreakdown[] {
  const map = new Map<string, number>();
  for (const t of transactions) {
    if (t.type === "expense" && inRange(t.date, startDate, endDate)) {
      map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
    }
  }
  return Array.from(map.entries())
    .map(([categoryId, amount]) => {
      const cat = categories.find((c) => c.id === categoryId);
      return {
        categoryId,
        amount,
        name: cat?.name || "Unknown",
        color: cat?.color || "#ccc",
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export function getDailySummary(
  transactions: Transaction[],
  startDate: string,
  endDate: string
): DailySummary[] {
  // Generate all days in range
  const days: string[] = [];
  let d = new Date(startDate);
  const end = new Date(endDate);
  while (d <= end) {
    days.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  // Aggregate
  return days.map((date) => {
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      if (t.date === date) {
        if (t.type === "income") income += t.amount;
        else if (t.type === "expense") expense += t.amount;
      }
    }
    return { date, income, expense };
  });
}
