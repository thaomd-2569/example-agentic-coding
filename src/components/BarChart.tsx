import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { BarChartProps } from "../types/dashboard";

export const DashboardBarChart: React.FC<BarChartProps> = ({ data }) => (
  <section className="bg-white rounded shadow p-4 mb-4" aria-label="Income and Expense by Day Bar Chart">
    <h2 className="font-bold text-lg mb-2">Income / Expense by Day</h2>
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} role="img" aria-label="Income and Expense by Day">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="#22c55e" name="Income" />
        <Bar dataKey="expense" fill="#ef4444" name="Expense" />
      </BarChart>
    </ResponsiveContainer>
  </section>
);
