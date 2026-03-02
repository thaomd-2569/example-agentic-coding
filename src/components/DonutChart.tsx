import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { DonutChartProps } from "../types/dashboard";

export const DonutChart: React.FC<DonutChartProps> = ({ data }) => (
  <section className="bg-white rounded shadow p-4 mb-4" aria-label="Expense by Category Donut Chart">
    <h2 className="font-bold text-lg mb-2">Expense by Category</h2>
    <ResponsiveContainer width="100%" height={320}>
      <PieChart role="img" aria-label="Expense by Category">
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, idx) => (
            <Cell key={entry.categoryId} fill={entry.color || "#ccc"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </section>
);
