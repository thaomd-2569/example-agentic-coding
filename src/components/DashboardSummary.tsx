import React from "react";
import type { DashboardSummaryProps } from "../types/dashboard";

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ totalIncome, totalExpense, balance, startDate, endDate }) => (
  <section className="bg-white rounded shadow p-4 mb-4">
    <h2 className="font-bold text-lg mb-2">Summary ({startDate} → {endDate})</h2>
    {(totalIncome === 0 && totalExpense === 0) ? (
      <div className="text-gray-400 text-center py-8">No data for selected range.</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-green-600">
          <div className="font-semibold">Income</div>
          <div className="text-2xl">{totalIncome.toLocaleString()}</div>
        </div>
        <div className="text-red-600">
          <div className="font-semibold">Expense</div>
          <div className="text-2xl">{totalExpense.toLocaleString()}</div>
        </div>
        <div className="text-blue-700">
          <div className="font-semibold">Balance</div>
          <div className="text-2xl">{balance.toLocaleString()}</div>
        </div>
      </div>
    )}
  </section>
);
