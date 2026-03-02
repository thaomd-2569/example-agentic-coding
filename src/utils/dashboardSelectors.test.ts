import { getDashboardSummary, getCategoryBreakdown, getDailySummary } from "./dashboardSelectors";
import { Transaction } from "../types/transaction";
import { Category } from "../store/useCategoryStore";

describe("dashboardSelectors", () => {
  const transactions: Transaction[] = [
    { id: "t1", amount: 1000, type: "income", categoryId: "cat1", date: "2026-03-01", note: "Salary" },
    { id: "t2", amount: 200, type: "expense", categoryId: "cat2", date: "2026-03-01", note: "Food" },
    { id: "t3", amount: 300, type: "expense", categoryId: "cat2", date: "2026-03-02", note: "Lunch" },
    { id: "t4", amount: 500, type: "income", categoryId: "cat3", date: "2026-03-02", note: "Freelance" },
    { id: "t5", amount: 100, type: "expense", categoryId: "cat1", date: "2026-03-03", note: "Gift" },
  ];
  const categories: Category[] = [
    { id: "cat1", name: "Salary", color: "#00f" },
    { id: "cat2", name: "Food", color: "#f00" },
    { id: "cat3", name: "Freelance", color: "#0f0" },
  ];

  it("getDashboardSummary computes totals and balance", () => {
    const summary = getDashboardSummary(transactions, "2026-03-01", "2026-03-03");
    expect(summary.totalIncome).toBe(1500);
    expect(summary.totalExpense).toBe(600);
    expect(summary.balance).toBe(900);
  });

  it("getCategoryBreakdown returns correct breakdown", () => {
    const breakdown = getCategoryBreakdown(transactions, categories, "2026-03-01", "2026-03-03");
    expect(breakdown.length).toBe(2);
    expect(breakdown[0].name).toBe("Food");
    expect(breakdown[0].amount).toBe(500);
    expect(breakdown[1].name).toBe("Salary");
    expect(breakdown[1].amount).toBe(100);
  });

  it("getDailySummary returns daily income/expense", () => {
    const daily = getDailySummary(transactions, "2026-03-01", "2026-03-03");
    expect(daily).toEqual([
      { date: "2026-03-01", income: 1000, expense: 200 },
      { date: "2026-03-02", income: 500, expense: 300 },
      { date: "2026-03-03", income: 0, expense: 100 },
    ]);
  });
});
